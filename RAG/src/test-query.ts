import "dotenv/config";
import { ChromaClient } from "chromadb";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const EMBEDDING_MODEL = "qwen/qwen3-embedding-8b";

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

async function main() {
  const query = process.argv[2] || "cognitive biases in software development";

  console.log(`Query: "${query}"\n`);

  const client = new ChromaClient({ path: "http://localhost:8000" });
  const collection = await client.getCollection({ name: "bp-sources", embeddingFunction: undefined as never });

  const queryEmbedding = await getEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 5,
  });

  results.documents[0].forEach((doc, i) => {
    const meta = results.metadatas[0][i];
    const distance = results.distances?.[0][i];
    console.log(`--- Result ${i + 1} (distance: ${distance?.toFixed(4)}) ---`);
    console.log(`Source: ${meta?.source}, Page: ${meta?.page}`);
    console.log(`Text: ${doc?.slice(0, 250)}...\n`);
  });
}

main().catch(console.error);
