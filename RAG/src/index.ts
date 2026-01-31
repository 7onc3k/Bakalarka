import "dotenv/config";
import { ChromaClient } from "chromadb";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { EPub } from "epub2";
import sbd from "sbd";

// Load environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in environment");
  process.exit(1);
}
if (!MISTRAL_API_KEY) {
  console.warn("WARNING: MISTRAL_API_KEY not set - OCR fallback disabled");
}

const SOURCES_DIR = path.resolve(import.meta.dirname, "../../thesis/sources");
const COLLECTION_NAME = "bp-sources";
const TARGET_CHUNK_SIZE = 800; // target characters per chunk
const MAX_CHUNK_SIZE = 1200; // max characters (won't split mid-sentence if under this)
const MIN_CHUNK_SIZE = 200; // min characters (will merge small chunks)
const EMBEDDING_MODEL = "qwen/qwen3-embedding-8b";
const EMBEDDING_BATCH_SIZE = 20; // Process embeddings in batches

// Sentence boundary detection options
const SBD_OPTIONS = {
  newline_boundaries: true,
  html_boundaries: false,
  sanitize: false,
  allowed_tags: false,
  preserve_whitespace: false,
  abbreviations: null,
};

interface ChunkMetadata {
  source: string;
  page: number; // For EPUB this represents chapter number
  chunk_index: number;
  indexed_at: string;
  format: "pdf" | "epub";
  [key: string]: string | number; // Index signature for Chroma compatibility
}

async function getSourceFiles(): Promise<string[]> {
  const files = await fs.readdir(SOURCES_DIR);
  return files.filter((f) => {
    const lower = f.toLowerCase();
    return lower.endsWith(".pdf") || lower.endsWith(".epub");
  });
}

interface PageText {
  page: number;
  text: string;
}

interface PdfPageData {
  getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
}

async function extractTextFromPdfPerPage(
  filePath: string
): Promise<{ pages: PageText[]; numPages: number }> {
  const buffer = await fs.readFile(filePath);
  const pages: PageText[] = [];
  let currentPage = 0;

  // Use pdf-parse with custom page render to capture per-page text
  const result = await pdfParse(buffer, {
    pagerender: async (pageData: PdfPageData) => {
      currentPage++;
      const textContent = await pageData.getTextContent();
      const text = textContent.items
        .map((item) => item.str || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        pages.push({ page: currentPage, text });
      }
      return text;
    },
  });

  return { pages, numPages: result.numpages };
}

async function extractTextFromPdf(
  filePath: string
): Promise<{ text: string; numPages: number }> {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return {
    text: data.text,
    numPages: data.numpages,
  };
}

async function extractTextFromEpub(
  filePath: string
): Promise<{ text: string; numChapters: number }> {
  return new Promise((resolve, reject) => {
    const epub = new EPub(filePath);

    epub.on("error", (err: Error) => {
      reject(err);
    });

    epub.on("end", async () => {
      const chapters: string[] = [];

      for (const chapter of epub.flow) {
        if (chapter.id) {
          try {
            const chapterText = await new Promise<string>((res, rej) => {
              epub.getChapter(chapter.id!, (err: Error, text?: string) => {
                if (err) rej(err);
                else res(text || "");
              });
            });
            // Strip HTML tags
            const plainText = chapterText
              .replace(/<[^>]*>/g, " ")
              .replace(/&nbsp;/g, " ")
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#\d+;/g, "")
              .replace(/\s+/g, " ")
              .trim();
            if (plainText) {
              chapters.push(plainText);
            }
          } catch {
            // Skip chapters that can't be read
          }
        }
      }

      resolve({
        text: chapters.join("\n\n"),
        numChapters: chapters.length,
      });
    });

    epub.parse();
  });
}

function isLikelyScannedPdf(text: string, numPages: number): boolean {
  if (!text.trim()) return true;
  const charsPerPage = text.length / numPages;
  if (charsPerPage < 100) return true;
  // High ratio of non-ASCII chars might indicate bad OCR/encoding
  const garbageRatio = (text.match(/[^\x20-\x7E\n\u00C0-\u024F]/g) || []).length / text.length;
  if (garbageRatio > 0.3) return true;
  return false;
}

interface OcrPage {
  index: number;
  markdown: string;
}

async function extractTextWithMistralOcr(
  filePath: string
): Promise<{ text: string; numPages: number; pages: { page: number; text: string }[] }> {
  if (!MISTRAL_API_KEY) {
    throw new Error("MISTRAL_API_KEY not set");
  }

  // Read PDF as base64
  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString("base64");

  const response = await fetch("https://api.mistral.ai/v1/ocr", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-ocr-latest",
      document: {
        type: "document_base64",
        document_base64: base64,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral OCR error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const pages: { page: number; text: string }[] = data.pages.map((p: OcrPage) => ({
    page: p.index + 1,
    text: p.markdown,
  }));

  const fullText = pages.map((p) => p.text).join("\n\n");

  return {
    text: fullText,
    numPages: pages.length,
    pages,
  };
}

interface ChunkWithPage {
  text: string;
  page: number;
}

/**
 * Sentence-based chunking: splits text into sentences, then groups them
 * into chunks of target size while respecting sentence boundaries.
 * Includes overlap by repeating last sentence(s) from previous chunk.
 */
function chunkTextBySentences(text: string): string[] {
  const sentences = sbd.sentences(text, SBD_OPTIONS);
  if (sentences.length === 0) return text.trim() ? [text.trim()] : [];

  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;
  let overlapSentences: string[] = []; // sentences to prepend for overlap

  for (const sentence of sentences) {
    const sentenceLen = sentence.length;

    // If adding this sentence exceeds max size and we have content, start new chunk
    if (currentLength + sentenceLen > MAX_CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk.join(" ").trim());

      // Keep last 1-2 sentences for overlap (context continuity)
      overlapSentences = currentChunk.slice(-2);
      currentChunk = [...overlapSentences];
      currentLength = currentChunk.join(" ").length;
    }

    currentChunk.push(sentence);
    currentLength += sentenceLen + 1; // +1 for space

    // If we've reached target size and sentence ends naturally, consider splitting
    if (currentLength >= TARGET_CHUNK_SIZE && sentence.match(/[.!?]$/)) {
      // Continue to next sentence to see if it's a good break point
    }
  }

  // Add remaining content
  if (currentChunk.length > 0) {
    const finalChunk = currentChunk.join(" ").trim();
    // Merge with previous if too small
    if (finalChunk.length < MIN_CHUNK_SIZE && chunks.length > 0) {
      chunks[chunks.length - 1] += " " + finalChunk;
    } else if (finalChunk.length > 0) {
      chunks.push(finalChunk);
    }
  }

  return chunks;
}

/**
 * Chunk pages with sentence-based splitting, preserving accurate page numbers.
 */
function chunkPagesWithPageInfo(pages: PageText[]): ChunkWithPage[] {
  const chunks: ChunkWithPage[] = [];

  for (const { page, text } of pages) {
    const pageChunks = chunkTextBySentences(text);
    for (const chunkText of pageChunks) {
      chunks.push({ text: chunkText, page });
    }
  }

  return chunks;
}

/**
 * Simple character-based chunking (fallback for EPUB)
 */
function chunkTextSimple(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    start += chunkSize - overlap;
  }

  return chunks;
}

function estimatePageForChunk(
  chunkIndex: number,
  totalChunks: number,
  totalPages: number
): number {
  const chunksPerPage = totalChunks / totalPages;
  return Math.floor(chunkIndex / chunksPerPage) + 1;
}

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

async function getEmbeddingsInBatches(
  texts: string[],
  batchSize: number
): Promise<number[][]> {
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    console.log(`      Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}...`);
    const embeddings = await getEmbeddings(batch);
    allEmbeddings.push(...embeddings);

    // Small delay to avoid rate limiting
    if (i + batchSize < texts.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return allEmbeddings;
}

async function main() {
  console.log("Connecting to Chroma...");
  const client = new ChromaClient({ path: "http://localhost:8000" });

  // Get or create collection (without default embedding function)
  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: {
      description: "Bachelor thesis sources",
      embedding_model: EMBEDDING_MODEL,
    },
  });

  console.log(`Collection "${COLLECTION_NAME}" ready`);
  console.log(`Using embedding model: ${EMBEDDING_MODEL}`);

  // Get existing sources to avoid re-indexing
  const existingDocs = await collection.get();
  const indexedSources = new Set(
    existingDocs.metadatas?.map((m) => m?.source as string).filter(Boolean)
  );

  console.log(`Already indexed: ${indexedSources.size} sources`);

  // Get source files (PDF + EPUB)
  const sourceFiles = await getSourceFiles();
  const pdfCount = sourceFiles.filter(f => f.toLowerCase().endsWith(".pdf")).length;
  const epubCount = sourceFiles.filter(f => f.toLowerCase().endsWith(".epub")).length;
  console.log(`Found ${sourceFiles.length} files in sources/ (${pdfCount} PDF, ${epubCount} EPUB)\n`);

  for (const filename of sourceFiles) {
    if (indexedSources.has(filename)) {
      console.log(`[SKIP] ${filename} - already indexed`);
      continue;
    }

    console.log(`[INDEX] ${filename}`);

    const filePath = path.join(SOURCES_DIR, filename);
    const isEpub = filename.toLowerCase().endsWith(".epub");
    let chunksWithPages: ChunkWithPage[] = [];
    let numPages: number;
    let usedOcr = false;

    if (isEpub) {
      // Extract text from EPUB (chapters as pages)
      const epubResult = await extractTextFromEpub(filePath);
      numPages = epubResult.numChapters;
      // For EPUB, use sentence-based chunking with estimated pages
      const chunks = chunkTextBySentences(epubResult.text);
      chunksWithPages = chunks.map((text, i) => ({
        text,
        page: estimatePageForChunk(i, chunks.length, numPages),
      }));
      console.log(`    EPUB: ${numPages} chapters, ${epubResult.text.length} chars`);
    } else {
      // Extract text from PDF - first try per-page extraction
      const pdfResult = await extractTextFromPdfPerPage(filePath);
      numPages = pdfResult.numPages;

      // Check if we got meaningful text
      const totalText = pdfResult.pages.map((p) => p.text).join(" ");
      if (isLikelyScannedPdf(totalText, numPages)) {
        if (MISTRAL_API_KEY) {
          console.log(`    Scanned PDF detected, using Mistral OCR...`);
          try {
            const ocrResult = await extractTextWithMistralOcr(filePath);
            numPages = ocrResult.numPages;
            usedOcr = true;
            // OCR returns pages with page numbers
            chunksWithPages = chunkPagesWithPageInfo(ocrResult.pages);
            console.log(`    OCR extracted ${ocrResult.text.length} chars from ${numPages} pages`);
          } catch (err) {
            console.log(`    OCR failed: ${err}`);
            continue;
          }
        } else {
          console.log(`    WARNING: Scanned PDF but no MISTRAL_API_KEY - skipping`);
          continue;
        }
      } else {
        // Use per-page extraction with accurate page numbers
        chunksWithPages = chunkPagesWithPageInfo(pdfResult.pages);
        console.log(`    PDF: ${numPages} pages, ${totalText.length} chars`);
      }
    }

    const unitLabel = isEpub ? "chapters" : "pages";
    console.log(`    ${chunksWithPages.length} chunks from ${numPages} ${unitLabel}${usedOcr ? " (OCR)" : ""}`);

    // Get embeddings from OpenRouter
    console.log(`    Getting embeddings...`);
    const chunkTexts = chunksWithPages.map((c) => c.text);
    const embeddings = await getEmbeddingsInBatches(chunkTexts, EMBEDDING_BATCH_SIZE);

    // Prepare data for Chroma
    const ids = chunksWithPages.map((_, i) => `${filename}_chunk_${i}`);
    const metadatas: ChunkMetadata[] = chunksWithPages.map((chunk, i) => ({
      source: filename,
      page: chunk.page,
      chunk_index: i,
      indexed_at: new Date().toISOString(),
      format: isEpub ? "epub" : "pdf",
    }));

    // Upsert to Chroma with pre-computed embeddings (in batches)
    const UPSERT_BATCH_SIZE = 100;
    for (let i = 0; i < chunksWithPages.length; i += UPSERT_BATCH_SIZE) {
      const end = Math.min(i + UPSERT_BATCH_SIZE, chunksWithPages.length);
      await collection.upsert({
        ids: ids.slice(i, end),
        documents: chunkTexts.slice(i, end),
        embeddings: embeddings.slice(i, end),
        metadatas: metadatas.slice(i, end),
      });
    }

    console.log(`    ✓ Done\n`);
  }

  // Summary
  const finalCount = await collection.count();
  console.log(`\n=== Summary ===`);
  console.log(`Total chunks in collection: ${finalCount}`);
}

main().catch(console.error);
