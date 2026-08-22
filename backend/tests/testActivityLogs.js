import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import http from "http";
import app from "../src/app.js";
import College from "../src/models/college.js";
import CollegeActivityLog from "../src/models/collegeActivityLog.js";
import PlacementDrive from "../src/models/placementDrive.js";
import EligibilityPreset from "../src/models/eligibilityPreset.js";
import Broadcast from "../src/models/broadcast.js";
import generateToken from "../src/utils/generateToken.js";

async function runTests() {
  console.log("=== Starting Activity & Audit Logs Module Integration Tests ===");

  const mongoUri = process.env.MONGO_URI || "mongodb+srv://chatlu1201_db_user:pMZcWt5kxVnTWERw@cluster0.mpi71hx.mongodb.net/?appName=Cluster0";
  await mongoose.connect(mongoUri);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failedCount++;
    }
  }

  let collegeA, collegeB, tokenA, tokenB;

  try {
    // 1. Setup Test Colleges and Tokens
    await College.deleteMany({ email: { $in: ["audit_college_a@college.edu", "audit_college_b@college.edu"] } });

    collegeA = await College.create({
      name: "Audit College A",
      email: "audit_college_a@college.edu",
      phone: "9876543240",
      password: "password123",
      address: "100 Audit Way",
      website: "https://audit-a.edu",
      university: "State Tech"
    });

    collegeB = await College.create({
      name: "Audit College B",
      email: "audit_college_b@college.edu",
      phone: "9876543241",
      password: "password123",
      address: "200 Audit Blvd",
      website: "https://audit-b.edu",
      university: "City Tech"
    });

    tokenA = generateToken(collegeA._id);
    tokenB = generateToken(collegeB._id);

    // Clean up activity logs for test colleges
    await CollegeActivityLog.deleteMany({ college: { $in: [collegeA._id, collegeB._id] } });

    // 2. Perform actions for College A via API endpoints to trigger automated activity logging
    // Action A1: Create Placement Drive
    const driveRes = await fetch(`${baseUrl}/api/college/drives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        companyName: "Google India",
        jobRole: "SDE-1",
        packageLPA: "25 LPA",
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      })
    });
    assert(driveRes.status === 201, "College A created placement drive successfully");

    // Action A2: Create Eligibility Preset
    const presetRes = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: "Tier 1 Tech 8.0+ CGPA",
        minCgpa: 8.0,
        eligibleBranches: ["CSE", "ECE"]
      })
    });
    assert(presetRes.status === 201, "College A created eligibility preset successfully");

    // Action A3: Send Broadcast Announcement
    const broadcastRes = await fetch(`${baseUrl}/api/college/broadcasts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        title: "Campus Drive Alert",
        message: "Google drive registrations are now open."
      })
    });
    assert(broadcastRes.status === 201, "College A sent broadcast successfully");

    // Action B1: Create Placement Drive for College B
    const driveBRes = await fetch(`${baseUrl}/api/college/drives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenB}`
      },
      body: JSON.stringify({
        companyName: "Amazon India",
        jobRole: "Cloud Engineer",
        packageLPA: "20 LPA",
        driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      })
    });
    assert(driveBRes.status === 201, "College B created placement drive successfully");

    // Wait 500ms to allow asynchronous activity logging tasks to persist
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Test 1: GET /api/college/activity-logs without token -> 401 Unauthorized
    const res1 = await fetch(`${baseUrl}/api/college/activity-logs`);
    const body1 = await res1.json();
    assert(res1.status === 401 && body1.success === false, "Missing token returns 401 Unauthorized");

    // Test 2: GET /api/college/activity-logs with College A token -> 200 OK, returns 3 activity logs
    const res2 = await fetch(`${baseUrl}/api/college/activity-logs`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body2 = await res2.json();
    assert(
      res2.status === 200 &&
      body2.success === true &&
      body2.data.logs.length === 3,
      "Get activity logs for College A returns 3 recorded actions"
    );

    // Test 3: GET /api/college/activity-logs?module=PlacementDrive -> returns 1 log entry
    const res3 = await fetch(`${baseUrl}/api/college/activity-logs?module=PlacementDrive`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body3 = await res3.json();
    assert(
      res3.status === 200 &&
      body3.data.logs.length === 1 &&
      body3.data.logs[0].action === "CREATE_DRIVE",
      "Filter by module=PlacementDrive returns matching drive log entry"
    );

    // Test 4: GET /api/college/activity-logs?action=CREATE_PRESET -> returns 1 log entry
    const res4 = await fetch(`${baseUrl}/api/college/activity-logs?action=CREATE_PRESET`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body4 = await res4.json();
    assert(
      res4.status === 200 &&
      body4.data.logs.length === 1 &&
      body4.data.logs[0].module === "EligibilityPreset",
      "Filter by action=CREATE_PRESET returns matching preset log entry"
    );

    // Test 5: GET /api/college/activity-logs with College B token -> returns only College B's logs (1 entry)
    const res5 = await fetch(`${baseUrl}/api/college/activity-logs`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body5 = await res5.json();
    assert(
      res5.status === 200 &&
      body5.data.logs.length === 1 &&
      body5.data.logs[0].description.includes("Amazon India"),
      "Multi-tenant isolation: College B receives strictly its own activity logs"
    );

  } finally {
    // Clean up test data
    if (collegeA) {
      await College.findByIdAndDelete(collegeA._id);
      await CollegeActivityLog.deleteMany({ college: collegeA._id });
      await PlacementDrive.deleteMany({ college: collegeA._id });
      await EligibilityPreset.deleteMany({ college: collegeA._id });
      await Broadcast.deleteMany({ college: collegeA._id });
    }
    if (collegeB) {
      await College.findByIdAndDelete(collegeB._id);
      await CollegeActivityLog.deleteMany({ college: collegeB._id });
      await PlacementDrive.deleteMany({ college: collegeB._id });
    }

    server.close();
    await mongoose.connection.close();
  }

  console.log(`\n=== Test Results: ${passedCount} Passed, ${failedCount} Failed ===`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
