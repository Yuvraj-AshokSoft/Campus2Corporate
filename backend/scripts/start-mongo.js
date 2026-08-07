import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const dbPath = path.join(__dirname, "../.mongo_storage");
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: "c2c",
        dbPath: dbPath,
        storageEngine: "wiredTiger",
      },
    });

    const uri = mongod.getUri();
    console.log(`[MongoDB] Local MongoDB Server listening on ${uri}`);
    console.log(`[MongoDB] Database Name: c2c`);
    console.log(`[MongoDB] Storage Path: ${dbPath}`);

    process.on("SIGINT", async () => {
      console.log("[MongoDB] Stopping MongoDB Server...");
      await mongod.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error("[MongoDB] Failed to start local MongoDB:", err);
    process.exit(1);
  }
}

main();
