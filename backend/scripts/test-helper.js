/**
 * Test Helper Utility for Campus2Corporate Backend Regression Suites
 * Provides database safety verification, credential masking, test categorization, and strict mode enforcement.
 */
import dns from "dns";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env and backend/.env
dotenv.config();
if (fs.existsSync("backend/.env")) {
  dotenv.config({ path: "backend/.env" });
}

export function isStrictMode() {
  return (
    process.env.STRICT_INTEGRATION === "1" ||
    process.env.REQUIRE_TEST_DB === "1"
  );
}

export function resolveTestDbUri() {
  if (process.env.MONGO_TEST_URI) {
    return process.env.MONGO_TEST_URI;
  }
  if (process.env.TEST_MONGO_URI) {
    return process.env.TEST_MONGO_URI;
  }

  // Derive isolated test DB URI from configured MONGO_URI
  const baseUri = process.env.MONGO_URI;
  if (baseUri && typeof baseUri === "string") {
    if (baseUri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (e) {
        // Ignore DNS server error if restricted
      }
      if (baseUri.includes("/?")) {
        return baseUri.replace("/?", "/c2c_test?");
      } else if (baseUri.endsWith("/")) {
        return baseUri + "c2c_test";
      } else {
        const parts = baseUri.split("?");
        const hostPart = parts[0].replace(/\/+$/, "");
        const queryPart = parts[1] ? `?${parts[1]}` : "";
        const segments = hostPart.split("/");
        segments[segments.length - 1] = "c2c_test";
        return segments.join("/") + queryPart;
      }
    } else if (baseUri.startsWith("mongodb://")) {
      const parts = baseUri.split("?");
      const queryPart = parts[1] ? `?${parts[1]}` : "";
      const hostPart = parts[0].replace(/\/+$/, "");
      const segments = hostPart.split("/");
      segments[segments.length - 1] = "c2c_test";
      return segments.join("/") + queryPart;
    }
  }

  return "mongodb://127.0.0.1:27017/c2c_test";
}

export function verifyTestDbSafety(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error("Invalid MongoDB URI provided to test runner.");
  }

  // Extract database name from connection string (handling query params)
  const cleanPath = uri.split("?")[0].replace(/\/+$/, "");
  const dbName = cleanPath.split("/").pop() || "";

  // HARD SAFETY GUARD: Database name MUST clearly indicate a test environment
  const isTestDb = /test/i.test(dbName);
  if (!isTestDb) {
    console.error("\n============================================================");
    console.error("❌ CRITICAL SAFETY GUARD ABORT: NON-TEST DATABASE DETECTED");
    console.error(`Target DB Name: "${dbName}"`);
    console.error("Test execution aborted to prevent accidental data mutation.");
    console.error("============================================================\n");
    throw new Error(
      `Refusing to execute mutating tests against non-test database "${dbName}".`
    );
  }

  return {
    isSafe: true,
    dbName,
  };
}

export function printSafetyReport(dbName) {
  console.log("------------------------------------------------------------");
  console.log("PRE-RUN SAFETY REPORT:");
  console.log(`  Test DB resolved: YES (${dbName})`);
  console.log("  Clearly isolated test DB: YES");
  console.log("  Production guard: PASS");
  console.log(`  Strict Mode Active: ${isStrictMode() ? "YES" : "NO"}`);
  console.log("  Cleanup strategy: READY");
  console.log("------------------------------------------------------------\n");
}

export function createTestTracker(suiteName) {
  let passCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  let staticCount = 0;
  let unitCount = 0;
  let httpCount = 0;
  let dbCount = 0;
  let currentCategory = "unit";

  function setDefaultCategory(cat) {
    currentCategory = cat;
  }

  function assert(condition, message, category) {
    const finalCategory = category || currentCategory;
    if (finalCategory === "static") staticCount++;
    else if (finalCategory === "http") httpCount++;
    else if (finalCategory === "db") dbCount++;
    else unitCount++;

    if (!condition) {
      failCount++;
      const err = new Error(`Assertion failed: ${message}`);
      console.error(`  ❌ FAIL: ${message}`);
      throw err;
    }
    passCount++;
    console.log(`  ✔ PASS: ${message}`);
  }

  function recordSkip(count, reason) {
    skippedCount += count;
    console.log(`⚠️ SKIPPED ${count} required integration tests: ${reason}`);
    if (isStrictMode()) {
      console.error(`❌ STRICT MODE VIOLATION: Skipped tests forbidden in strict mode!`);
      failCount += count;
    }
  }

  function getStats() {
    return {
      suiteName,
      passed: passCount,
      failed: failCount,
      skipped: skippedCount,
      staticCount,
      unitCount,
      httpCount,
      dbCount,
      total: passCount + failCount,
    };
  }

  return { assert, recordSkip, getStats, setDefaultCategory };
}
