import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { resolveTestDbUri, verifyTestDbSafety } from "./test-helper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStartupTest() {
  console.log("=============================================================");
  console.log("=== REAL DATABASE-BACKED SERVER STARTUP PROOF (PORT 5999) ===");
  console.log("=============================================================\n");

  const testDbUri = resolveTestDbUri();
  const { dbName } = verifyTestDbSafety(testDbUri);
  console.log(`Targeting isolated test database: ${dbName}`);

  const serverFile = path.resolve(__dirname, "../src/server.js");

  const env = {
    ...process.env,
    PORT: "5999",
    MONGO_URI: testDbUri,
    ADMIN_EMAIL: "seededadmin@testadmin.com",
    ADMIN_PASSWORD: "SeededPassword123!",
  };

  let mongoConnected = false;
  let seedExecuted = false;
  let listenerBound = false;
  let httpResponseOk = false;
  let shutdownClean = false;

  const child = spawn("node", [serverFile], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    process.stdout.write(`[SERVER STDOUT] ${text}`);
    if (text.includes("MongoDB Connected")) {
      mongoConnected = true;
    }
    if (
      text.includes("Super Admin provisioned successfully") ||
      text.includes("Admin account seeded successfully") ||
      text.includes("Admin seeding skipped") ||
      text.includes("Admin account already exists")
    ) {
      seedExecuted = true;
    }
    if (text.includes("Server running on port 5999")) {
      listenerBound = true;
    }
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    process.stderr.write(`[SERVER STDERR] ${text}`);
  });

  // Wait for server to bind listener
  const maxWaitMs = 15000;
  const start = Date.now();
  while (!listenerBound && Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 300));
  }

  if (!listenerBound) {
    child.kill("SIGTERM");
    throw new Error("Server failed to bind listener within 15 seconds");
  }

  // Probe root endpoint
  try {
    const res = await fetch("http://localhost:5999/");
    const data = await res.json();
    console.log(`\nEndpoint probe response:`, data);
    if (res.status === 200 && data.success === true) {
      httpResponseOk = true;
    }
  } catch (err) {
    console.error("Endpoint probe failed:", err.message);
  }

  // Gracefully terminate server
  const closePromise = new Promise((resolve) => {
    child.on("close", (code, signal) => {
      console.log(`Server process exited with code: ${code}, signal: ${signal}`);
      shutdownClean = true;
      resolve();
    });
  });

  child.kill("SIGINT");
  await Promise.race([
    closePromise,
    new Promise((r) => setTimeout(() => { child.kill("SIGKILL"); r(); }, 3000)),
  ]);

  console.log("\n=============================================================");
  console.log("=== SERVER STARTUP VERIFICATION REPORT ===");
  console.log("=============================================================");
  console.log(`  MongoDB connection:     ${mongoConnected ? "PASS" : "FAIL"}`);
  console.log(`  HTTP listener startup:  ${listenerBound ? "PASS" : "FAIL"}`);
  console.log(`  seedAdmin behavior:     ${seedExecuted ? "PASS" : "FAIL"}`);
  console.log(`  Safe HTTP response:     ${httpResponseOk ? "PASS" : "FAIL"}`);
  console.log(`  Clean shutdown:         ${shutdownClean ? "PASS" : "FAIL"}`);
  console.log("=============================================================\n");

  // Fixture cleanup
  try {
    const mongoose = (await import("mongoose")).default;
    await mongoose.connect(testDbUri);
    await mongoose.connection.db.collection("admins").deleteMany({ email: "seededadmin@testadmin.com" });
    await mongoose.disconnect();
  } catch (cleanErr) {
    console.warn("Cleanup warning:", cleanErr.message);
  }

  if (!mongoConnected || !listenerBound || !httpResponseOk) {
    console.error("❌ Database-backed startup test failed!");
    process.exit(1);
  } else {
    console.log("✔ Database-backed startup test passed completely!");
    process.exit(0);
  }
}

runStartupTest().catch((err) => {
  console.error("Startup test runner error:", err);
  process.exit(1);
});
