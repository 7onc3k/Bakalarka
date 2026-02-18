import "dotenv/config";
import { ChromaClient } from "chromadb";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const EMBEDDING_MODEL = "qwen/qwen3-embedding-8b";
const RERANK_MODEL = "rerank-v4.0-pro"; // For reranking (best quality)
const COLLECTION_NAME = "bp-sources";

// Fetch more results for reranking, then return top N
const RERANK_FETCH_MULTIPLIER = 3;

interface QueryResult {
  doc: string;
  source: string;
  page: number;
  similarity: number;
  relevanceScore?: number; // from reranking
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: [text],
    }),
  });

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Expand query with related terms using LLM
 */
async function expandQuery(query: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2.5",
      messages: [
        {
          role: "user",
          content: `Given this search query for academic software engineering literature, generate 2-3 related terms or synonyms that would help find relevant documents. Return ONLY the expanded query (original + related terms), nothing else.

Query: "${query}"

Expanded query:`,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const expanded = data.choices?.[0]?.message?.content?.trim() || query;
  return expanded;
}

/**
 * Rerank results using Cohere rerank model via OpenRouter
 */
async function rerankResults(
  query: string,
  results: QueryResult[],
  topN: number
): Promise<QueryResult[]> {
  if (results.length === 0) return [];

  try {
    const response = await fetch("https://api.cohere.com/v2/rerank", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: RERANK_MODEL,
        query: query,
        documents: results.map((r) => r.doc),
        top_n: topN,
        return_documents: false,
      }),
    });

    if (!response.ok) {
      console.warn("Reranking failed, using original order");
      return results.slice(0, topN);
    }

    const data = await response.json();
    const reranked: QueryResult[] = [];

    for (const item of data.results) {
      const original = results[item.index];
      reranked.push({
        ...original,
        relevanceScore: item.relevance_score,
      });
    }

    return reranked;
  } catch {
    console.warn("Reranking failed, using original order");
    return results.slice(0, topN);
  }
}

function printUsage() {
  console.log(`
RAG Query - Semantic search přes BP zdroje

Použití:
  npm run query -- "hledaný text"
  npm run query -- "hledaný text" --n=10

Parametry:
  --n=N         Počet výsledků (default: 5)
  --doc=X       Filtrovat podle dokumentu (partial match)
  --keyword=X   Filtrovat podle klíčového slova v textu
  --expand      Rozšířit query o související termíny (LLM)
  --rerank      Přeřadit výsledky pomocí rerank modelu
  --raw         Bez reranku a expanze (rychlejší)
  --help        Zobrazí tuto nápovědu

Příklady:
  npm run query -- "cognitive biases in code review"
  npm run query -- "Brooks law manpower" --n=3
  npm run query -- "SDLC phases" --doc=sommerville
  npm run query -- "software crisis" --keyword=NATO
  npm run query -- "agile methodology" --expand --rerank
`);
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const queryParts: string[] = [];
  let numResults = 5;
  let docFilter: string | null = null;
  let keywordFilter: string | null = null;
  let useExpansion = false;
  let useRerank = false;
  let rawMode = false;

  for (const arg of args) {
    if (arg.startsWith("--n=")) {
      numResults = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--doc=")) {
      docFilter = arg.split("=")[1];
    } else if (arg.startsWith("--keyword=")) {
      keywordFilter = arg.split("=")[1];
    } else if (arg === "--expand") {
      useExpansion = true;
    } else if (arg === "--rerank") {
      useRerank = true;
    } else if (arg === "--raw") {
      rawMode = true;
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      return;
    } else {
      queryParts.push(arg);
    }
  }

  let query = queryParts.join(" ");

  if (!query) {
    printUsage();
    return;
  }

  // Raw mode disables expansion and reranking
  if (rawMode) {
    useExpansion = false;
    useRerank = false;
  }

  console.log(`\n🔍 Query: "${query}"`);

  // Query expansion
  if (useExpansion) {
    console.log("📝 Expanding query...");
    query = await expandQuery(query);
    console.log(`   Expanded: "${query}"`);
  }

  console.log(`📊 Results: ${numResults}`);
  if (docFilter) console.log(`📁 Document filter: "${docFilter}"`);
  if (keywordFilter) console.log(`🔤 Keyword filter: "${keywordFilter}"`);
  if (useRerank) console.log(`🔄 Reranking: enabled`);
  console.log();

  const client = new ChromaClient({ path: "http://localhost:8000" });
  const collection = await client.getCollection({
    name: COLLECTION_NAME,
    embeddingFunction: undefined as never,
  });

  const queryEmbedding = await getEmbedding(query);

  // Fetch more results if reranking
  const fetchCount = useRerank ? numResults * RERANK_FETCH_MULTIPLIER : numResults;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryOptions: any = {
    queryEmbeddings: [queryEmbedding],
    nResults: fetchCount,
  };

  // Document filter (metadata)
  if (docFilter) {
    queryOptions.where = { source: { $contains: docFilter } };
  }

  // Keyword filter (full-text search in document content)
  if (keywordFilter) {
    queryOptions.whereDocument = { $contains: keywordFilter };
  }

  const results = await collection.query(queryOptions);

  if (!results.documents[0].length) {
    console.log("Žádné výsledky.");
    return;
  }

  // Convert to QueryResult format
  let queryResults: QueryResult[] = results.documents[0].map((doc, i) => {
    const meta = results.metadatas[0][i];
    const distance = results.distances?.[0][i];
    return {
      doc: doc || "",
      source: (meta?.source as string) || "unknown",
      page: (meta?.page as number) || 0,
      similarity: distance ? 1 - distance : 0,
    };
  });

  // Rerank if enabled
  if (useRerank && queryResults.length > 0) {
    console.log("🔄 Reranking results...\n");
    queryResults = await rerankResults(query, queryResults, numResults);
  } else {
    queryResults = queryResults.slice(0, numResults);
  }

  // Display results
  queryResults.forEach((result, i) => {
    console.log(`━━━ Result ${i + 1} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📄 ${result.source} (page ${result.page})`);

    if (result.relevanceScore !== undefined) {
      console.log(
        `📊 Relevance: ${result.relevanceScore.toFixed(3)} (semantic: ${result.similarity.toFixed(2)})`
      );
    } else {
      console.log(`📊 Similarity: ${result.similarity.toFixed(2)}`);
    }

    console.log(`\n${result.doc.slice(0, 500)}${result.doc.length > 500 ? "..." : ""}\n`);
  });
}

main().catch(console.error);
