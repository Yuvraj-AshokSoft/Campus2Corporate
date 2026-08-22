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
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Student from "../src/models/student.js";
import PlacementDrive from "../src/models/placementDrive.js";
import Application from "../src/models/application.js";
import generateToken from "../src/utils/generateToken.js";

async function runTests() {
  console.log("=== Starting Enhanced Recruiter Coordination Integration Tests ===");

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
  let companyAlpha, companyBeta;
  let recruiterAlpha;
  let driveA1, driveA2, driveA3, driveB1;
  let student1, student2;
  let app1, app2, app3;

  try {
    // 1. Setup Test Data
    await College.deleteMany({ email: { $in: ["coord_college_a@college.edu", "coord_college_b@college.edu"] } });
    await Company.deleteMany({ name: { $in: ["Alpha Corp", "Beta Systems"] } });
    await Student.deleteMany({ email: { $in: ["coord_student1@student.edu", "coord_student2@student.edu"] } });

    collegeA = await College.create({
      name: "Coordination College A",
      email: "coord_college_a@college.edu",
      phone: "9876543250",
      password: "password123",
      address: "100 Partner Way",
      website: "https://coord-a.edu",
      university: "State Tech"
    });

    collegeB = await College.create({
      name: "Coordination College B",
      email: "coord_college_b@college.edu",
      phone: "9876543251",
      password: "password123",
      address: "200 Partner Blvd",
      website: "https://coord-b.edu",
      university: "City Tech"
    });

    tokenA = generateToken(collegeA._id);
    tokenB = generateToken(collegeB._id);

    companyAlpha = await Company.create({
      name: "Alpha Corp",
      email: "alpha@alphacorp.com",
      industry: "IT Services",
      website: "https://alphacorp.com",
      location: "Bangalore"
    });

    companyBeta = await Company.create({
      name: "Beta Systems",
      email: "beta@betasystems.com",
      industry: "Fintech",
      website: "https://betasystems.com",
      location: "Hyderabad"
    });

    recruiterAlpha = await Recruiter.create({
      name: "Alice Recruiter",
      email: "alice@alpha.com",
      password: "password123",
      phone: "9876543299",
      company: companyAlpha._id,
      designation: "Lead HR Manager"
    });

    // Drives for College A
    const futureDate1 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const pastDate1 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const futureDate2 = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    driveA1 = await PlacementDrive.create({
      college: collegeA._id,
      company: companyAlpha._id,
      companyName: "Alpha Corp",
      jobRole: "Software Engineer",
      packageLPA: "15 LPA",
      driveDate: futureDate1,
      mode: "Virtual",
      status: "Upcoming"
    });

    driveA2 = await PlacementDrive.create({
      college: collegeA._id,
      company: companyAlpha._id,
      companyName: "Alpha Corp",
      jobRole: "Senior Developer",
      packageLPA: "18 LPA",
      driveDate: pastDate1,
      mode: "On-Campus",
      status: "Completed"
    });

    driveA3 = await PlacementDrive.create({
      college: collegeA._id,
      company: companyBeta._id,
      companyName: "Beta Systems",
      jobRole: "Data Analyst",
      packageLPA: "12 LPA",
      driveDate: futureDate2,
      mode: "Virtual",
      status: "REGISTRATION OPEN"
    });

    // Drive for College B
    driveB1 = await PlacementDrive.create({
      college: collegeB._id,
      company: companyBeta._id,
      companyName: "Beta Systems",
      jobRole: "Cloud Engineer",
      packageLPA: "14 LPA",
      driveDate: futureDate1,
      mode: "Virtual",
      status: "Upcoming"
    });

    // Students and Applications for College A
    student1 = await Student.create({
      name: "Student A1",
      email: "coord_student1@student.edu",
      college: collegeA._id,
      branch: "CSE",
      percentage: 80,
      status: "Active"
    });

    student2 = await Student.create({
      name: "Student A2",
      email: "coord_student2@student.edu",
      college: collegeA._id,
      branch: "ECE",
      percentage: 85,
      status: "Active"
    });

    app1 = await Application.create({
      student: student1._id,
      placementDrive: driveA1._id,
      drive: driveA1._id,
      status: "Applied"
    });

    app2 = await Application.create({
      student: student1._id,
      placementDrive: driveA2._id,
      drive: driveA2._id,
      status: "Placed"
    });

    app3 = await Application.create({
      student: student2._id,
      placementDrive: driveA2._id,
      drive: driveA2._id,
      status: "Shortlisted"
    });

    // Test 1: GET /api/college/coordination/visits without token -> 401
    const res1 = await fetch(`${baseUrl}/api/college/coordination/visits`);
    const body1 = await res1.json();
    assert(res1.status === 401 && body1.success === false, "Missing token returns 401 Unauthorized");

    // Test 2: GET /api/college/coordination/visits with College A token -> 200 OK (total 3, upcoming 2, past 1)
    const res2 = await fetch(`${baseUrl}/api/college/coordination/visits`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body2 = await res2.json();
    assert(
      res2.status === 200 &&
      body2.success === true &&
      body2.data.totalCount === 3 &&
      body2.data.upcomingCount === 2 &&
      body2.data.pastCount === 1,
      "Campus visits fetched with correct total (3), upcoming (2), and past (1) counts"
    );

    // Test 3: GET /api/college/coordination/visits?timeline=upcoming -> returns 2 items
    const res3 = await fetch(`${baseUrl}/api/college/coordination/visits?timeline=upcoming`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body3 = await res3.json();
    assert(res3.status === 200 && body3.data.visits.length === 2, "Filter timeline=upcoming returns 2 upcoming visits");

    // Test 4: GET /api/college/coordination/visits?timeline=past -> returns 1 item
    const res4 = await fetch(`${baseUrl}/api/college/coordination/visits?timeline=past`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body4 = await res4.json();
    assert(res4.status === 200 && body4.data.visits.length === 1 && body4.data.visits[0].jobRole === "Senior Developer", "Filter timeline=past returns 1 past visit");

    // Test 5: GET /api/college/coordination/company-summary with College A token -> 200 OK
    const res5 = await fetch(`${baseUrl}/api/college/coordination/company-summary`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body5 = await res5.json();
    assert(res5.status === 200 && body5.success === true && body5.data.length === 2, "Company placement summary returns 2 companies for College A");

    const alphaSummary = body5.data.find((c) => c.companyName === "Alpha Corp");
    assert(
      alphaSummary &&
      alphaSummary.totalDrives === 2 &&
      alphaSummary.activeDrivesCount === 1 &&
      alphaSummary.totalApplicants === 3 &&
      alphaSummary.shortlistedCount === 1 &&
      alphaSummary.placedCount === 1 &&
      alphaSummary.highestPackageLPA === 18,
      "Alpha Corp placement summary metrics aggregated correctly (2 drives, 3 applicants, 1 shortlisted, 1 placed, 18 LPA max)"
    );

    // Test 6: GET /api/college/coordination/recruiter-summary with College A token -> 200 OK
    const res6 = await fetch(`${baseUrl}/api/college/coordination/recruiter-summary`, {
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const body6 = await res6.json();
    assert(res6.status === 200 && body6.success === true && body6.data.length >= 1, "Recruiter placement summary returns coordinating recruiters");
    const aliceRec = body6.data.find((r) => r.email === "alice@alpha.com");
    assert(aliceRec && aliceRec.driveCount === 2 && aliceRec.lastVisitDate !== null, "Alice Recruiter summary has driveCount=2 and valid lastVisitDate");

    // Test 7: Multi-tenant isolation - GET visits for College B -> returns strictly College B's 1 drive
    const res7 = await fetch(`${baseUrl}/api/college/coordination/visits`, {
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const body7 = await res7.json();
    assert(
      res7.status === 200 &&
      body7.data.totalCount === 1 &&
      body7.data.upcomingCount === 1 &&
      body7.data.pastCount === 0,
      "Multi-tenant isolation: College B receives strictly its own campus visits"
    );

  } finally {
    // Clean up test data
    if (collegeA) await College.findByIdAndDelete(collegeA._id);
    if (collegeB) await College.findByIdAndDelete(collegeB._id);
    if (companyAlpha) await Company.findByIdAndDelete(companyAlpha._id);
    if (companyBeta) await Company.findByIdAndDelete(companyBeta._id);
    if (recruiterAlpha) await Recruiter.findByIdAndDelete(recruiterAlpha._id);
    if (driveA1) await PlacementDrive.findByIdAndDelete(driveA1._id);
    if (driveA2) await PlacementDrive.findByIdAndDelete(driveA2._id);
    if (driveA3) await PlacementDrive.findByIdAndDelete(driveA3._id);
    if (driveB1) await PlacementDrive.findByIdAndDelete(driveB1._id);
    if (student1) await Student.findByIdAndDelete(student1._id);
    if (student2) await Student.findByIdAndDelete(student2._id);
    if (app1) await Application.findByIdAndDelete(app1._id);
    if (app2) await Application.findByIdAndDelete(app2._id);
    if (app3) await Application.findByIdAndDelete(app3._id);

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
