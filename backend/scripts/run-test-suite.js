import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testSuites = [
  {
    name: "College Backend Suite (Phase 1, 2, 3)",
    file: path.resolve(__dirname, "test-college-backend.js"),
  },
  {
    name: "Admin Backend Suite (Full RBAC, Verifications, Moderation, Analytics)",
    file: path.resolve(__dirname, "test-admin-backend.js"),
  },
];

async function runSuite(suite) {
  return new Promise((resolve) => {
    console.log(`\n========================================`);
    console.log(`RUNNING: ${suite.name}`);
    console.log(`========================================\n`);

    const proc = spawn("node", [suite.file], {
      stdio: "inherit",
      env: process.env,
    });

    proc.on("close", (code) => {
      resolve({ name: suite.name, code });
    });
  });
}

async function main() {
  console.log("Starting Full Backend Regression Test Runner...\n");
  const results = [];

  for (const suite of testSuites) {
    const res = await runSuite(suite);
    results.push(res);
  }

  console.log("\n========================================");
  console.log("FULL REGRESSION TEST SUMMARY");
  console.log("========================================");

  let hasFailure = false;
  for (const res of results) {
    if (res.code === 0) {
      console.log(`✔ ${res.name}: PASSED`);
    } else {
      console.log(`❌ ${res.name}: FAILED (Exit code: ${res.code})`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.error("\n❌ Regression suite failed. Please check the logs above.");
    process.exit(1);
  } else {
    console.log("\n✔ All test suites passed successfully!");
    process.exit(0);
  }
}

main();
