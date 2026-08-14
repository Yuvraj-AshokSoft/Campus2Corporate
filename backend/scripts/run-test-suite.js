import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import app from "../src/app.js";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Starting MongoMemoryServer & API Server for E2E Backend Testing...");

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

  const mongoUri = mongod.getUri();
  console.log(`[Test Runner] Connected to in-memory MongoDB at ${mongoUri}`);

  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/c2c");

  const PORT = process.env.TEST_PORT || 5001;
  const server = app.listen(PORT, "127.0.0.1", () => {
    console.log(`[Test Runner] Backend Express App running on port ${PORT}`);

    const testApiScript = path.join(__dirname, "test-api.js");
    const child = spawn("node", [testApiScript], {
      stdio: "inherit",
      env: { ...process.env, TEST_PORT: PORT.toString() },
    });

    child.on("exit", async (code) => {
      console.log(`\n[Test Runner] Test process exited with code ${code}`);
      server.close();
      await mongoose.disconnect();
      await mongod.stop();
      process.exit(code || 0);
    });
  });
}

run();
