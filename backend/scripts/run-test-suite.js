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

  const server = app.listen(5000, () => {
    console.log("[Test Runner] Backend Express App running on port 5000");

    const testApiScript = path.join(__dirname, "test-api.js");
    const child = spawn("node", [testApiScript], { stdio: "inherit" });

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
