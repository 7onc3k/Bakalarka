import "dotenv/config";
import { ensureChroma } from "./chroma.js";

const COLLECTION_NAME = "bp-sources";

async function main() {
  const client = await ensureChroma();

  try {
    await client.deleteCollection({ name: COLLECTION_NAME });
    console.log(`✓ Collection "${COLLECTION_NAME}" deleted`);
    console.log("\nRun 'npm run index' to re-index all sources.");
  } catch (error: any) {
    if (error.message?.includes("does not exist")) {
      console.log(`Collection "${COLLECTION_NAME}" does not exist - nothing to delete.`);
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
