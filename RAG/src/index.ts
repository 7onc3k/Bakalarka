import "dotenv/config";
import { ChromaClient } from "chromadb";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { EPub } from "epub2";

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
const CHUNK_SIZE = 1000; // characters
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = "qwen/qwen3-embedding-8b";
const EMBEDDING_BATCH_SIZE = 20; // Process embeddings in batches

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
              epub.getChapter(chapter.id!, (err: Error | null, text: string) => {
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

function chunkText(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
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
    let text: string;
    let numPages: number;
    let usedOcr = false;

    if (isEpub) {
      // Extract text from EPUB
      const epubResult = await extractTextFromEpub(filePath);
      text = epubResult.text;
      numPages = epubResult.numChapters; // Use chapters as "pages" for EPUB
      console.log(`    EPUB: ${numPages} chapters, ${text.length} chars`);
    } else {
      // Extract text from PDF
      const pdfResult = await extractTextFromPdf(filePath);
      text = pdfResult.text;
      numPages = pdfResult.numPages;

      // Check if we need OCR fallback
      if (isLikelyScannedPdf(text, numPages)) {
        if (MISTRAL_API_KEY) {
          console.log(`    Scanned PDF detected, using Mistral OCR...`);
          try {
            const ocrResult = await extractTextWithMistralOcr(filePath);
            text = ocrResult.text;
            numPages = ocrResult.numPages;
            usedOcr = true;
            console.log(`    OCR extracted ${text.length} chars from ${numPages} pages`);
          } catch (err) {
            console.log(`    OCR failed: ${err}`);
            continue;
          }
        } else {
          console.log(`    WARNING: Scanned PDF but no MISTRAL_API_KEY - skipping`);
          continue;
        }
      }
    }

    const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);
    const unitLabel = isEpub ? "chapters" : "pages";
    console.log(`    ${chunks.length} chunks from ${numPages} ${unitLabel}${usedOcr ? " (OCR)" : ""}`);

    // Get embeddings from OpenRouter
    console.log(`    Getting embeddings...`);
    const embeddings = await getEmbeddingsInBatches(chunks, EMBEDDING_BATCH_SIZE);

    // Prepare data for Chroma
    const ids = chunks.map((_, i) => `${filename}_chunk_${i}`);
    const metadatas: ChunkMetadata[] = chunks.map((_, i) => ({
      source: filename,
      page: estimatePageForChunk(i, chunks.length, numPages),
      chunk_index: i,
      indexed_at: new Date().toISOString(),
      format: isEpub ? "epub" : "pdf",
    }));

    // Upsert to Chroma with pre-computed embeddings (in batches)
    const UPSERT_BATCH_SIZE = 100;
    for (let i = 0; i < chunks.length; i += UPSERT_BATCH_SIZE) {
      const end = Math.min(i + UPSERT_BATCH_SIZE, chunks.length);
      await collection.upsert({
        ids: ids.slice(i, end),
        documents: chunks.slice(i, end),
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
