import { ChromaClient } from "chromadb";
import { execSync } from "child_process";

const CHROMA_URL = "http://localhost:8000";
const CONTAINER_NAME = "chroma-bp";
const MAX_WAIT_MS = 30_000;

/**
 * Ensures the Chroma Docker container is running and returns a connected client.
 * Starts the container automatically if it's stopped.
 */
export async function ensureChroma(): Promise<ChromaClient> {
  if (!(await isChromaReady())) {
    startContainer();
    await waitForReady();
  }
  return new ChromaClient({ path: CHROMA_URL });
}

async function isChromaReady(): Promise<boolean> {
  try {
    const res = await fetch(`${CHROMA_URL}/api/v2/heartbeat`, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

function startContainer(): void {
  try {
    const status = execSync(`docker inspect -f '{{.State.Status}}' ${CONTAINER_NAME} 2>/dev/null`, {
      encoding: "utf-8",
    }).trim();

    if (status === "running") return;

    console.log("🐳 Starting Chroma container...");
    execSync(`docker start ${CONTAINER_NAME}`, { stdio: "pipe" });
  } catch {
    // Container doesn't exist — create it
    console.log("🐳 Creating Chroma container...");
    execSync(
      `docker run -d --name ${CONTAINER_NAME} -p 8000:8000 -v /home/dev/code/Bakalarka/RAG/data:/chroma/chroma chromadb/chroma:latest`,
      { stdio: "pipe" },
    );
  }
}

async function waitForReady(): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    if (await isChromaReady()) {
      console.log("🐳 Chroma ready.");
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Chroma not ready after ${MAX_WAIT_MS / 1000}s`);
}
