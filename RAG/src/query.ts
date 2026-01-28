import "dotenv/config";
import { ChromaClient } from "chromadb";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const EMBEDDING_MODEL = "qwen/qwen3-embedding-8b";
const COLLECTION_NAME = "bp-sources";

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

function printUsage() {
  console.log(`
RAG Query - Semantic search přes BP zdroje

Použití:
  npm run query -- "hledaný text"
  npm run query -- "hledaný text" --n=10

Parametry:
  --n=N    Počet výsledků (default: 5)
  --help   Zobrazí tuto nápovědu

Příklady:
  npm run query -- "cognitive biases in code review"
  npm run query -- "Brooks law manpower" --n=3
  npm run query -- "software crisis NATO 1968"
`);
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const queryParts: string[] = [];
  let numResults = 5;

  for (const arg of args) {
    if (arg.startsWith("--n=")) {
      numResults = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      return;
    } else {
      queryParts.push(arg);
    }
  }

  const query = queryParts.join(" ");

  if (!query) {
    printUsage();
    return;
  }

  console.log(`\nQuery: "${query}"`);
  console.log(`Results: ${numResults}\n`);

  const client = new ChromaClient({ path: "http://localhost:8000" });
  const collection = await client.getCollection({ name: COLLECTION_NAME });

  const queryEmbedding = await getEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: numResults,
  });

  if (!results.documents[0].length) {
    console.log("Žádné výsledky.");
    return;
  }

  results.documents[0].forEach((doc, i) => {
    const meta = results.metadatas[0][i];
    const distance = results.distances?.[0][i];
    const similarity = distance ? (1 - distance).toFixed(2) : "?";

    console.log(`━━━ Result ${i + 1} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📄 ${meta?.source} (page ${meta?.page})`);
    console.log(`📊 Similarity: ${similarity}`);
    console.log(`\n${doc?.slice(0, 400)}${(doc?.length || 0) > 400 ? "..." : ""}\n`);
  });
}

main().catch(console.error);
