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
import EligibilityPreset from "../src/models/eligibilityPreset.js";
import generateToken from "../src/utils/generateToken.js";

async function runTests() {
  console.log("=== Starting Eligibility Presets Module Integration Tests ===");
  
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
  let presetA1Id, presetA2Id, presetB1Id;

  try {
    // 1. Setup Test Colleges and Tokens
    await College.deleteMany({ email: { $in: ["test_preset_a@college.edu", "test_preset_b@college.edu"] } });
    await EligibilityPreset.deleteMany({ name: { $in: ["Standard Tech 7.5+ CGPA", "Core Engineering 6.0+ CGPA", "College B Preset"] } });

    collegeA = await College.create({
      name: "Test College A",
      email: "test_preset_a@college.edu",
      phone: "9876543210",
      password: "password123",
      address: "123 Campus Way",
      website: "https://collegea.edu",
      university: "State Tech University"
    });

    collegeB = await College.create({
      name: "Test College B",
      email: "test_preset_b@college.edu",
      phone: "9876543211",
      password: "password123",
      address: "456 Academy Blvd",
      website: "https://collegeb.edu",
      university: "City University"
    });

    tokenA = generateToken(collegeA._id);
    tokenB = generateToken(collegeB._id);

    // Test 1: POST /api/college/eligibility-presets without Authorization header -> 401
    const res1 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unauthorized Preset" })
    });
    const body1 = await res1.json();
    assert(res1.status === 401 && body1.success === false, "Missing token returns 401 Unauthorized");

    // Test 2: POST /api/college/eligibility-presets missing required name -> 400
    const res2 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({ minCgpa: 7.5 })
    });
    const body2 = await res2.json();
    assert(res2.status === 400 && body2.success === false, "Missing preset name returns 400 Bad Request");

    // Test 3: POST /api/college/eligibility-presets valid creation for College A -> 201
    const res3 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: "Standard Tech 7.5+ CGPA",
        minCgpa: 7.5,
        eligibleBranches: ["CSE", "ECE", "IT"],
        maxActiveBacklogs: 0,
        allowedPassingYears: [2025, 2026],
        description: "Standard tech eligibility preset for IT roles"
      })
    });
    const body3 = await res3.json();
    assert(res3.status === 201 && body3.success === true && body3.data.name === "Standard Tech 7.5+ CGPA", "Create eligibility preset returns 201 Created");
    presetA1Id = body3.data._id;

    // Test 4: Create 2nd preset for College A
    const res4 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({
        name: "Core Engineering 6.0+ CGPA",
        minCgpa: 6.0,
        eligibleBranches: ["Mechanical", "Civil", "EEE"],
        maxActiveBacklogs: 1,
        allowedPassingYears: [2025, 2026],
        description: "Core branch preset"
      })
    });
    const body4 = await res4.json();
    assert(res4.status === 201 && body4.success === true, "Create 2nd preset for College A returns 201 Created");
    presetA2Id = body4.data._id;

    // Test 5: Create preset for College B
    const res5 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenB}`
      },
      body: JSON.stringify({
        name: "College B Preset",
        minCgpa: 8.0,
        eligibleBranches: ["CSE"],
        maxActiveBacklogs: 0,
        allowedPassingYears: [2026],
        description: "College B specific preset"
      })
    });
    const body5 = await res5.json();
    assert(res5.status === 201 && body5.success === true, "Create preset for College B returns 201 Created");
    presetB1Id = body5.data._id;

    // Test 6: GET /api/college/eligibility-presets for College A -> 200 (returns 2 presets for College A only)
    const res6 = await fetch(`${baseUrl}/api/college/eligibility-presets`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body6 = await res6.json();
    assert(res6.status === 200 && body6.success === true && body6.data.length === 2, "Get presets returns only presets belonging to College A");

    // Test 7: GET /api/college/eligibility-presets with search query
    const res7 = await fetch(`${baseUrl}/api/college/eligibility-presets?search=Standard`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body7 = await res7.json();
    assert(res7.status === 200 && body7.data.length === 1 && body7.data[0].name === "Standard Tech 7.5+ CGPA", "Search filter returns matching presets");

    // Test 8: GET /api/college/eligibility-presets/:id for valid College A preset -> 200
    const res8 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body8 = await res8.json();
    assert(res8.status === 200 && body8.data._id === presetA1Id, "Get preset by ID returns correct preset");

    // Test 9: GET /api/college/eligibility-presets/:id with malformed ObjectId -> 400
    const res9 = await fetch(`${baseUrl}/api/college/eligibility-presets/invalid-objectid-123`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body9 = await res9.json();
    assert(res9.status === 400 && body9.success === false, "Malformed ObjectId returns 400 Bad Request");

    // Test 10: GET /api/college/eligibility-presets/:id for non-existent preset -> 404
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const res10 = await fetch(`${baseUrl}/api/college/eligibility-presets/${nonExistentId}`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body10 = await res10.json();
    assert(res10.status === 404 && body10.success === false, "Non-existent preset ID returns 404 Not Found");

    // Test 11: Multi-tenant isolation - GET College A's preset with College B's token -> 403
    const res11 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body11 = await res11.json();
    assert(res11.status === 403 && body11.success === false, "Cross-college GET returns 403 Forbidden");

    // Test 12: PUT /api/college/eligibility-presets/:id update College A's preset -> 200
    const res12 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({ minCgpa: 8.0, description: "Updated description" })
    });
    const body12 = await res12.json();
    assert(res12.status === 200 && body12.data.minCgpa === 8.0 && body12.data.description === "Updated description", "Update preset returns 200 OK with updated data");

    // Test 13: Multi-tenant isolation - PUT College A's preset with College B's token -> 403
    const res13 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenB}`
      },
      body: JSON.stringify({ minCgpa: 5.0 })
    });
    const body13 = await res13.json();
    assert(res13.status === 403 && body13.success === false, "Cross-college PUT returns 403 Forbidden");

    // Test 14: Multi-tenant isolation - DELETE College A's preset with College B's token -> 403
    const res14 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body14 = await res14.json();
    assert(res14.status === 403 && body14.success === false, "Cross-college DELETE returns 403 Forbidden");

    // Test 15: DELETE College A's preset with College A's token -> 200
    const res15 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body15 = await res15.json();
    assert(res15.status === 200 && body15.success === true && body15.data === null, "Delete preset returns 200 OK");

    // Test 16: Verify deleted preset is no longer accessible -> 404
    const res16 = await fetch(`${baseUrl}/api/college/eligibility-presets/${presetA1Id}`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body16 = await res16.json();
    assert(res16.status === 404 && body16.success === false, "Accessing deleted preset returns 404 Not Found");

  } finally {
    // Clean up
    if (collegeA) await College.findByIdAndDelete(collegeA._id);
    if (collegeB) await College.findByIdAndDelete(collegeB._id);
    if (presetA1Id) await EligibilityPreset.findByIdAndDelete(presetA1Id);
    if (presetA2Id) await EligibilityPreset.findByIdAndDelete(presetA2Id);
    if (presetB1Id) await EligibilityPreset.findByIdAndDelete(presetB1Id);

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
