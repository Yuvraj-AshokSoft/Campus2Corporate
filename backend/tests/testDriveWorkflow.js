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
import Student from "../src/models/student.js";
import PlacementDrive from "../src/models/placementDrive.js";
import Application from "../src/models/application.js";
import EligibilityPreset from "../src/models/eligibilityPreset.js";
import generateToken from "../src/utils/generateToken.js";

async function runTests() {
  console.log("=== Starting Placement Drive Workflow & Eligibility Integration Tests ===");

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
  let presetA, driveA, driveB;
  let student1, student2, student3;
  let application1;

  try {
    // 1. Setup Test Data
    await College.deleteMany({ email: { $in: ["workflow_college_a@college.edu", "workflow_college_b@college.edu"] } });
    await Student.deleteMany({ email: { $in: ["student1_eligible@student.edu", "student2_lowcgpa@student.edu", "student3_wrongbranch@student.edu"] } });

    collegeA = await College.create({
      name: "Workflow College A",
      email: "workflow_college_a@college.edu",
      phone: "9876543220",
      password: "password123",
      address: "100 Tech Park",
      website: "https://workflow-a.edu",
      university: "State Tech"
    });

    collegeB = await College.create({
      name: "Workflow College B",
      email: "workflow_college_b@college.edu",
      phone: "9876543221",
      password: "password123",
      address: "200 Science Rd",
      website: "https://workflow-b.edu",
      university: "City Tech"
    });

    tokenA = generateToken(collegeA._id);
    tokenB = generateToken(collegeB._id);

    presetA = await EligibilityPreset.create({
      college: collegeA._id,
      name: "Tech High Standards 7.5+",
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "ECE"],
      maxActiveBacklogs: 0,
      allowedPassingYears: [2026],
      description: "High standard tech role preset"
    });

    driveA = await PlacementDrive.create({
      college: collegeA._id,
      companyName: "Acme Software Corp",
      jobRole: "Software Engineer",
      packageLPA: "12 LPA",
      driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      mode: "Virtual",
      eligibilityPreset: presetA._id,
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "ECE"],
      maxActiveBacklogs: 0,
      allowedPassingYears: [2026]
    });

    driveB = await PlacementDrive.create({
      college: collegeB._id,
      companyName: "Beta Systems",
      jobRole: "Systems Engineer",
      packageLPA: "8 LPA",
      driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      mode: "On-Campus"
    });

    student1 = await Student.create({
      name: "Eligible Student One",
      email: "student1_eligible@student.edu",
      college: collegeA._id,
      branch: "CSE",
      cgpa: 8.5,
      percentage: 85,
      activeBacklogs: 0,
      backlogs: 0,
      passingYear: 2026,
      status: "Active"
    });

    student2 = await Student.create({
      name: "Low CGPA Student",
      email: "student2_lowcgpa@student.edu",
      college: collegeA._id,
      branch: "CSE",
      cgpa: 6.0,
      percentage: 60,
      activeBacklogs: 0,
      backlogs: 0,
      passingYear: 2026,
      status: "Active"
    });

    student3 = await Student.create({
      name: "Wrong Branch Student",
      email: "student3_wrongbranch@student.edu",
      college: collegeA._id,
      branch: "Civil",
      cgpa: 9.0,
      percentage: 90,
      activeBacklogs: 0,
      backlogs: 0,
      passingYear: 2026,
      status: "Active"
    });

    application1 = await Application.create({
      student: student1._id,
      placementDrive: driveA._id,
      drive: driveA._id,
      status: "Applied"
    });

    // Test 1: GET /api/college/drives/:driveId/participants without token -> 401
    const res1 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants`);
    const body1 = await res1.json();
    assert(res1.status === 401 && body1.success === false, "Missing token returns 401 Unauthorized");

    // Test 2: GET /api/college/drives/invalid-id/participants -> 400
    const res2 = await fetch(`${baseUrl}/api/college/drives/invalid-id-format/participants`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body2 = await res2.json();
    assert(res2.status === 400 && body2.success === false, "Malformed driveId returns 400 Bad Request");

    // Test 3: GET /api/college/drives/<non-existent>/participants -> 404
    const nonExistentDriveId = new mongoose.Types.ObjectId().toString();
    const res3 = await fetch(`${baseUrl}/api/college/drives/${nonExistentDriveId}/participants`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body3 = await res3.json();
    assert(res3.status === 404 && body3.success === false, "Non-existent drive returns 404 Not Found");

    // Test 4: Cross-college GET participants (College B token for College A drive) -> 403
    const res4 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body4 = await res4.json();
    assert(res4.status === 403 && body4.success === false, "Cross-college GET participants returns 403 Forbidden");

    // Test 5: GET /api/college/drives/:driveId/participants with College A token -> 200 OK
    const res5 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body5 = await res5.json();
    assert(res5.status === 200 && body5.success === true && body5.data.length === 1 && body5.data[0].student.name === "Eligible Student One", "Get participants returns populated student data");

    // Test 6: GET participants filtered by status=Applied -> 200 OK
    const res6 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants?status=Applied`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body6 = await res6.json();
    assert(res6.status === 200 && body6.data.length === 1, "Filter participants by status=Applied returns 1 item");

    // Test 7: GET participants filtered by status=Shortlisted -> 200 OK (0 items)
    const res7 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants?status=Shortlisted`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body7 = await res7.json();
    assert(res7.status === 200 && body7.data.length === 0, "Filter participants by status=Shortlisted returns 0 items");

    // Test 8: PATCH participant status to Shortlisted -> 200 OK
    const res8 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants/${application1._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({ status: "Shortlisted" })
    });
    const body8 = await res8.json();
    assert(res8.status === 200 && body8.success === true && body8.data.status === "Shortlisted", "Update participant status to Shortlisted returns 200 OK");

    // Test 9: PATCH participant status through stage 'Interviewed' -> 200 OK
    const res9 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants/${application1._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({ status: "Interviewed" })
    });
    const body9 = await res9.json();
    assert(res9.status === 200 && body9.data.status === "Interviewed", "Update participant status to Interviewed returns 200 OK");

    // Test 10: PATCH participant status to 'Placed' -> 200 OK
    const res10 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants/${application1._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenA}`
      },
      body: JSON.stringify({ status: "Placed" })
    });
    const body10 = await res10.json();
    assert(res10.status === 200 && body10.data.status === "Placed", "Update participant status to Placed returns 200 OK");

    // Test 11: Cross-college PATCH participant status -> 403 Forbidden
    const res11 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/participants/${application1._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenB}`
      },
      body: JSON.stringify({ status: "Rejected" })
    });
    const body11 = await res11.json();
    assert(res11.status === 403 && body11.success === false, "Cross-college PATCH participant status returns 403 Forbidden");

    // Test 12: GET /api/college/drives/:driveId/eligible-students with College A token -> 200 OK
    const res12 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/eligible-students`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body12 = await res12.json();
    assert(res12.status === 200 && body12.success === true && body12.data.length === 3, "Evaluate eligible students evaluates all 3 college students");

    const eval1 = body12.data.find(e => e.student.email === "student1_eligible@student.edu");
    const eval2 = body12.data.find(e => e.student.email === "student2_lowcgpa@student.edu");
    const eval3 = body12.data.find(e => e.student.email === "student3_wrongbranch@student.edu");

    assert(eval1 && eval1.isEligible === true && eval1.matchScore === 100, "Student 1 (CGPA 8.5, CSE) is eligible with 100% match score");
    assert(eval2 && eval2.isEligible === false && eval2.evaluation.cgpa.pass === false, "Student 2 (CGPA 6.0) is not eligible due to low CGPA");
    assert(eval3 && eval3.isEligible === false && eval3.evaluation.branch.pass === false, "Student 3 (Civil) is not eligible due to disallowed branch");

    // Test 13: Cross-college GET /api/college/drives/:driveId/eligible-students -> 403 Forbidden
    const res13 = await fetch(`${baseUrl}/api/college/drives/${driveA._id}/eligible-students`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body13 = await res13.json();
    assert(res13.status === 403 && body13.success === false, "Cross-college GET eligible students returns 403 Forbidden");

  } finally {
    // Clean up
    if (collegeA) await College.findByIdAndDelete(collegeA._id);
    if (collegeB) await College.findByIdAndDelete(collegeB._id);
    if (presetA) await EligibilityPreset.findByIdAndDelete(presetA._id);
    if (driveA) await PlacementDrive.findByIdAndDelete(driveA._id);
    if (driveB) await PlacementDrive.findByIdAndDelete(driveB._id);
    if (student1) await Student.findByIdAndDelete(student1._id);
    if (student2) await Student.findByIdAndDelete(student2._id);
    if (student3) await Student.findByIdAndDelete(student3._id);
    if (application1) await Application.findByIdAndDelete(application1._id);

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
