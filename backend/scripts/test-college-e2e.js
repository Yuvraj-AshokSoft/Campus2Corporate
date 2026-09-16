import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import mongoose from "mongoose";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "campus2corporate_admin_secret_2026";
}

import app from "../src/app.js";
import College from "../src/models/college.js";
import Student from "../src/models/student.js";
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Project from "../src/models/project.js";
import PlacementDrive from "../src/models/placementDrive.js";
import Application from "../src/models/application.js";
import Broadcast from "../src/models/broadcast.js";
import EligibilityPreset from "../src/models/eligibilityPreset.js";
import CollegeNotification from "../src/models/collegeNotification.js";
import CollegeActivityLog from "../src/models/collegeActivityLog.js";
import generateToken from "../src/utils/generateToken.js";

import {
  resolveTestDbUri,
  verifyTestDbSafety,
  printSafetyReport,
  createTestTracker,
} from "./test-helper.js";

const { assert, recordSkip, getStats, setDefaultCategory } =
  createTestTracker("College Dashboard E2E Integration Suite");

let server;
let baseUrl = "";

async function request(reqPath, options = {}) {
  const url = `${baseUrl}${reqPath}`;
  const headers = { "Content-Type": "application/json", ...options.headers };
  const body =
    options.body !== undefined
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined;

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body,
  });

  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data, headers: res.headers };
}

async function runCollegeE2ETests() {
  console.log("=================================================================");
  console.log("=== STARTING COMPREHENSIVE COLLEGE DASHBOARD E2E & SMOKE SUITE ===");
  console.log("=================================================================");

  const mongoUri = resolveTestDbUri();
  const { dbName } = verifyTestDbSafety(mongoUri);
  printSafetyReport(dbName);

  let isDbConnected = false;
  try {
    if (mongoUri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch {}
    }
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    isDbConnected = true;
    console.log(`✔ Connected to isolated test database "${dbName}" successfully!\n`);
  } catch (err) {
    console.log(`ℹ Live test MongoDB connection unavailable (${err.message}).`);
    recordSkip(75, `Live test DB connection failed: ${err.message}`);
    return;
  }

  // 1. Setup Test Fixtures: College A, College B, Students, Companies, Recruiters
  console.log("--- SETUP: Provisioning Isolated Test Tenants & Fixtures ---");
  await College.deleteMany({ email: /@e2etestcollege\.edu/ });
  await Student.deleteMany({ email: /@e2eteststudent\.edu/ });
  await Company.deleteMany({ name: /^E2E Test Corp/ });
  await Recruiter.deleteMany({ email: /@e2etestrecruiter\.com/ });
  await Project.deleteMany({ title: /^E2E College Project/ });
  await PlacementDrive.deleteMany({ companyName: /^E2E / });
  await Application.deleteMany({});
  await Broadcast.deleteMany({ title: /^E2E Broadcast/ });
  await EligibilityPreset.deleteMany({ name: /^E2E / });
  await CollegeNotification.deleteMany({});
  await CollegeActivityLog.deleteMany({});

  // College A (Primary)
  const collegeA = await College.create({
    name: "E2E College Alpha",
    email: "college_a@e2etestcollege.edu",
    phone: "9876543210",
    password: "Password123!",
    address: "Alpha Campus, Bangalore",
    website: "https://college-alpha.edu",
    university: "Alpha Technical University",
    status: "Active",
    verificationStatus: "Verified",
  });
  const tokenA = generateToken(collegeA, "college");

  // College B (Secondary for tenant-isolation checks)
  const collegeB = await College.create({
    name: "E2E College Beta",
    email: "college_b@e2etestcollege.edu",
    phone: "9876543211",
    password: "Password123!",
    address: "Beta Campus, Mumbai",
    website: "https://college-beta.edu",
    university: "Beta Technical University",
    status: "Active",
    verificationStatus: "Verified",
  });
  const tokenB = generateToken(collegeB, "college");

  // Students for College A
  const studentA1 = await Student.create({
    name: "Alice A",
    email: "alice@e2eteststudent.edu",
    password: "Password123!",
    college: collegeA._id,
    branch: "CSE",
    percentage: 85,
    cgpa: 8.5,
    backlogs: 0,
    activeBacklogs: 0,
    passingYear: 2026,
    graduationYear: 2026,
    rollNumber: "ALPHA-CSE-001",
    status: "Active",
  });

  const studentA2 = await Student.create({
    name: "Arthur A",
    email: "arthur@e2eteststudent.edu",
    password: "Password123!",
    college: collegeA._id,
    branch: "Civil",
    percentage: 58,
    cgpa: 5.8,
    backlogs: 2,
    activeBacklogs: 2,
    passingYear: 2026,
    graduationYear: 2026,
    rollNumber: "ALPHA-CIV-002",
    status: "Active",
  });

  // Student for College B
  const studentB1 = await Student.create({
    name: "Bob B",
    email: "bob@e2eteststudent.edu",
    password: "Password123!",
    college: collegeB._id,
    branch: "CSE",
    percentage: 90,
    cgpa: 9.0,
    backlogs: 0,
    activeBacklogs: 0,
    passingYear: 2026,
    graduationYear: 2026,
    rollNumber: "BETA-CSE-001",
    status: "Active",
  });

  // Company and Recruiter
  const companyA = await Company.create({
    name: "E2E Test Corp Apex",
    industry: "Software & Cloud",
    location: "Bengaluru",
    website: "https://apexcorp.test",
    description: "Enterprise Cloud Platforms",
  });

  const recruiterA = await Recruiter.create({
    name: "Rachel Recruiter",
    email: "rachel@e2etestrecruiter.com",
    phone: "9123456780",
    company: companyA._id,
    designation: "Lead Talent Partner",
  });

  // Start HTTP Server on ephemeral port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`College E2E test server running on ephemeral port ${port}\n`);
      resolve();
    });
  });

  const authHeaderA = { Authorization: `Bearer ${tokenA}` };
  const authHeaderB = { Authorization: `Bearer ${tokenB}` };

  setDefaultCategory("http");

  // =========================================================================
  // Phase 1.1: Authentication & Base Protection
  // =========================================================================
  console.log("--- PHASE 1.1: Authentication & Base Protection ---");
  {
    const resNoToken = await request("/api/college/dashboard");
    assert(resNoToken.status === 401, "Calling /api/college/dashboard without token returns 401");

    const resFakeToken = await request("/api/college/dashboard", {
      headers: { Authorization: "Bearer invalid.fake.token" },
    });
    assert(resFakeToken.status === 401, "Calling /api/college/dashboard with invalid token returns 401");

    const resInvalidDriveId = await request("/api/college/drives/invalid-mongo-id", {
      headers: authHeaderA,
    });
    assert(resInvalidDriveId.status === 400, "Invalid ObjectId on /api/college/drives/:id returns 400 Bad Request");

    const resInvalidProjectId = await request("/api/college/projects/invalid-mongo-id", {
      headers: authHeaderA,
    });
    assert(resInvalidProjectId.status === 400, "Invalid ObjectId on /api/college/projects/:id returns 400 Bad Request");

    const resInvalidPresetId = await request("/api/college/eligibility-presets/invalid-mongo-id", {
      headers: authHeaderA,
    });
    assert(resInvalidPresetId.status === 400, "Invalid ObjectId on /api/college/eligibility-presets/:id returns 400");

    const resInvalidBroadcastId = await request("/api/college/broadcasts/invalid-mongo-id", {
      headers: authHeaderA,
    });
    assert(resInvalidBroadcastId.status === 400, "Invalid ObjectId on /api/college/broadcasts/:id returns 400");

    const resInvalidNotifId = await request("/api/college/notifications/invalid-mongo-id", {
      method: "DELETE",
      headers: authHeaderA,
    });
    assert(resInvalidNotifId.status === 400, "Invalid ObjectId on /api/college/notifications/:id returns 400");
  }

  // =========================================================================
  // Phase 1.2: College Dashboard Scoped Stats (GET /api/college/dashboard)
  // =========================================================================
  console.log("\n--- PHASE 1.2: Scoped Dashboard Statistics ---");
  {
    const res = await request("/api/college/dashboard", { headers: authHeaderA });
    assert(res.status === 200, "Dashboard returns 200 OK for authenticated College A");
    assert(res.data.success === true, "Dashboard returns success: true");
    const stats = res.data.data;
    assert(stats.totalStudents === 2, `Dashboard totalStudents strictly equals College A count (2), got ${stats.totalStudents}`);
    assert(stats.activeStudents === 2, `Dashboard activeStudents strictly equals College A active count (2), got ${stats.activeStudents}`);
    assert(stats.verifiedStudents === 2, "Dashboard verifiedStudents calculated accurately");
    assert(typeof stats.totalApplications === "number", "Dashboard totalApplications is numeric");
    assert(typeof stats.placedStudents === "number", "Dashboard placedStudents is numeric");

    // Verify College B dashboard isolation
    const resB = await request("/api/college/dashboard", { headers: authHeaderB });
    assert(resB.status === 200, "Dashboard returns 200 OK for College B");
    assert(resB.data.data.totalStudents === 1, `College B totalStudents strictly equals 1 (isolated from College A), got ${resB.data.data.totalStudents}`);
  }

  // =========================================================================
  // Phase 1.3: Projects CRUD (/api/college/projects)
  // =========================================================================
  console.log("\n--- PHASE 1.3: Projects CRUD & Multi-Tenant Boundaries ---");
  let createdProjectId;
  {
    // POST Create project as College A
    const resCreate = await request("/api/college/projects", {
      method: "POST",
      headers: authHeaderA,
      body: {
        title: "E2E College Project AI Chatbot",
        description: "Intelligent career assistant using Node & React",
        category: "Artificial Intelligence",
        skillsRequired: ["Node.js", "React", "MongoDB"],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    assert(resCreate.status === 201, "POST /api/college/projects creates project with 201 Created");
    assert(resCreate.data.data && resCreate.data.data.title === "E2E College Project AI Chatbot", "Created project title matches payload");
    createdProjectId = resCreate.data.data._id;

    // GET List projects as College A
    const resListA = await request("/api/college/projects", { headers: authHeaderA });
    assert(resListA.status === 200, "GET /api/college/projects returns 200 OK for College A");
    const foundInA = resListA.data.data.some((p) => p._id === createdProjectId);
    assert(foundInA, "Created project is listed in College A's projects list");

    // GET List projects as College B -> MUST NOT contain College A's project
    const resListB = await request("/api/college/projects", { headers: authHeaderB });
    assert(resListB.status === 200, "GET /api/college/projects returns 200 OK for College B");
    const foundInB = resListB.data.data.some((p) => p._id === createdProjectId);
    assert(!foundInB, "TENANT GUARD: College A's project is strictly hidden from College B");

    // GET Project by ID
    const resGet = await request(`/api/college/projects/${createdProjectId}`, { headers: authHeaderA });
    assert(resGet.status === 200, "GET /api/college/projects/:id returns 200 OK for College A");

    // PUT Update project as College A
    const resUpdateA = await request(`/api/college/projects/${createdProjectId}`, {
      method: "PUT",
      headers: authHeaderA,
      body: { title: "E2E College Project AI Assistant (Updated)" },
    });
    assert(resUpdateA.status === 200, "PUT /api/college/projects/:id updates project with 200 OK");
    assert(resUpdateA.data.data.title.includes("(Updated)"), "Project title updated in DB response");

    // TENANT ATTACK: College B attempts to update College A's project -> Expect 403
    const resUpdateB = await request(`/api/college/projects/${createdProjectId}`, {
      method: "PUT",
      headers: authHeaderB,
      body: { title: "Hacked by College B" },
    });
    assert(resUpdateB.status === 403, "TENANT GUARD: College B blocked from updating College A's project with 403 Forbidden");

    // TENANT ATTACK: College B attempts to delete College A's project -> Expect 403
    const resDeleteB = await request(`/api/college/projects/${createdProjectId}`, {
      method: "DELETE",
      headers: authHeaderB,
    });
    assert(resDeleteB.status === 403, "TENANT GUARD: College B blocked from deleting College A's project with 403 Forbidden");

    // DELETE Project as College A
    const resDeleteA = await request(`/api/college/projects/${createdProjectId}`, {
      method: "DELETE",
      headers: authHeaderA,
    });
    assert(resDeleteA.status === 200, "DELETE /api/college/projects/:id deletes project with 200 OK as College A");
  }

  // =========================================================================
  // Phase 1.4: Placement Drives CRUD (/api/college/drives)
  // =========================================================================
  console.log("\n--- PHASE 1.4: Placement Drives CRUD & Multi-Tenant Boundaries ---");
  let driveIdA;
  {
    const resCreate = await request("/api/college/drives", {
      method: "POST",
      headers: authHeaderA,
      body: {
        company: companyA._id,
        companyName: "E2E Test Corp Apex",
        jobRole: "Associate Cloud Engineer",
        packageLPA: "14.5 LPA",
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        mode: "On-Campus",
        eligibleBranches: ["CSE", "IT"],
        eligibilityCriteria: "CGPA > 7.5",
        capacityLimit: 120,
        status: "Upcoming",
        location: "Auditorium Hall 1",
        description: "Recruitment drive for Batch 2026",
      },
    });
    assert(resCreate.status === 201, "POST /api/college/drives creates placement drive with 201 Created");
    assert(resCreate.data.data.companyName === "E2E Test Corp Apex", "Drive companyName stored correctly");
    driveIdA = resCreate.data.data._id;

    // GET List with query filters
    const resListFilter = await request("/api/college/drives?status=Upcoming&search=Apex", {
      headers: authHeaderA,
    });
    assert(resListFilter.status === 200, "GET /api/college/drives with query filters returns 200 OK");
    assert(resListFilter.data.data.length >= 1, "Drive found under status and search filters");

    // GET Single drive by ID
    const resGet = await request(`/api/college/drives/${driveIdA}`, { headers: authHeaderA });
    assert(resGet.status === 200, "GET /api/college/drives/:id returns 200 OK");
    assert(resGet.data.data.jobRole === "Associate Cloud Engineer", "Drive jobRole populated correctly");

    // PUT Update packageLPA as College A
    const resUpdate = await request(`/api/college/drives/${driveIdA}`, {
      method: "PUT",
      headers: authHeaderA,
      body: { packageLPA: "16.0 LPA" },
    });
    assert(resUpdate.status === 200, "PUT /api/college/drives/:id updates drive package with 200 OK");
    assert(resUpdate.data.data.packageLPA === "16.0 LPA", "Drive package updated in DB response");

    // TENANT ATTACK: College B attempts to modify College A's drive
    const resUpdateB = await request(`/api/college/drives/${driveIdA}`, {
      method: "PUT",
      headers: authHeaderB,
      body: { packageLPA: "1.0 LPA" },
    });
    assert(resUpdateB.status === 403, "TENANT GUARD: College B blocked from modifying College A's drive with 403 Forbidden");

    // TENANT ATTACK: College B attempts to delete College A's drive
    const resDeleteB = await request(`/api/college/drives/${driveIdA}`, {
      method: "DELETE",
      headers: authHeaderB,
    });
    assert(resDeleteB.status === 403, "TENANT GUARD: College B blocked from deleting College A's drive with 403 Forbidden");
  }

  // =========================================================================
  // Phase 1.5: Eligibility Presets (/api/college/eligibility-presets)
  // =========================================================================
  console.log("\n--- PHASE 1.5: Eligibility Presets Management ---");
  let presetIdA;
  {
    // POST Create preset as College A
    const resCreate = await request("/api/college/eligibility-presets", {
      method: "POST",
      headers: authHeaderA,
      body: {
        name: "E2E Tier-1 Tech Preset",
        minCgpa: 8.0,
        eligibleBranches: ["CSE", "ECE", "IT"],
        maxActiveBacklogs: 0,
        allowedPassingYears: [2026],
        description: "Strict preset for Tier-1 Tech firms",
      },
    });
    assert(resCreate.status === 201, "POST /api/college/eligibility-presets creates preset with 201 Created");
    presetIdA = resCreate.data.data._id;

    // GET List presets as College A
    const resListA = await request("/api/college/eligibility-presets", { headers: authHeaderA });
    assert(resListA.status === 200, "GET /api/college/eligibility-presets returns 200 OK for College A");
    const foundPresetA = resListA.data.data.some((p) => p._id === presetIdA);
    assert(foundPresetA, "Created preset found in College A presets list");

    // GET List presets as College B -> Must be isolated
    const resListB = await request("/api/college/eligibility-presets", { headers: authHeaderB });
    assert(resListB.status === 200, "GET /api/college/eligibility-presets returns 200 OK for College B");
    const foundPresetB = resListB.data.data.some((p) => p._id === presetIdA);
    assert(!foundPresetB, "TENANT GUARD: College A's eligibility preset hidden from College B");

    // GET Preset by ID
    const resGet = await request(`/api/college/eligibility-presets/${presetIdA}`, { headers: authHeaderA });
    assert(resGet.status === 200, "GET /api/college/eligibility-presets/:id returns 200 OK");
    assert(resGet.data.data.minCgpa === 8.0, "Preset minCgpa retrieved accurately");

    // PUT Update preset
    const resUpdate = await request(`/api/college/eligibility-presets/${presetIdA}`, {
      method: "PUT",
      headers: authHeaderA,
      body: { minCgpa: 8.2 },
    });
    assert(resUpdate.status === 200, "PUT /api/college/eligibility-presets/:id updates preset with 200 OK");
    assert(resUpdate.data.data.minCgpa === 8.2, "Preset minCgpa updated to 8.2 in DB");

    // TENANT ATTACK: College B attempts to update College A's preset
    const resUpdateB = await request(`/api/college/eligibility-presets/${presetIdA}`, {
      method: "PUT",
      headers: authHeaderB,
      body: { minCgpa: 1.0 },
    });
    assert(resUpdateB.status === 403, "TENANT GUARD: College B blocked from updating College A's preset with 403");

    // DELETE Preset as College A
    const resDelete = await request(`/api/college/eligibility-presets/${presetIdA}`, {
      method: "DELETE",
      headers: authHeaderA,
    });
    assert(resDelete.status === 200, "DELETE /api/college/eligibility-presets/:id deletes preset with 200 OK");
  }

  // =========================================================================
  // Phase 1.6: Drive Participants & Eligibility Workflow
  // =========================================================================
  console.log("\n--- PHASE 1.6: Drive Participants & Eligibility Evaluation ---");
  let appA1Id;
  {
    // Create applications linking Student A1 and Student A2 to Drive A
    const appA1 = await Application.create({
      student: studentA1._id,
      placementDrive: driveIdA,
      college: collegeA._id,
      status: "Applied",
      appliedAt: new Date(),
    });
    appA1Id = appA1._id;

    const appA2 = await Application.create({
      student: studentA2._id,
      placementDrive: driveIdA,
      college: collegeA._id,
      status: "Applied",
      appliedAt: new Date(),
    });

    // GET /api/college/drives/:driveId/participants
    const resParticipants = await request(`/api/college/drives/${driveIdA}/participants`, {
      headers: authHeaderA,
    });
    assert(resParticipants.status === 200, "GET /api/college/drives/:driveId/participants returns 200 OK");
    assert(resParticipants.data.data.length === 2, "Drive participants count matches 2 applications");
    assert(resParticipants.data.data[0].student.name !== undefined, "Participant populated with student academic record");

    // Filter by status=Applied
    const resFilterApplied = await request(`/api/college/drives/${driveIdA}/participants?status=Applied`, {
      headers: authHeaderA,
    });
    assert(resFilterApplied.status === 200, "Filter participants by status=Applied returns 200 OK");
    assert(resFilterApplied.data.data.length === 2, "Filtered participants count equals 2");

    // PATCH /api/college/drives/:driveId/participants/:participantId -> Stage: Shortlisted
    const resStage1 = await request(`/api/college/drives/${driveIdA}/participants/${appA1Id}`, {
      method: "PATCH",
      headers: authHeaderA,
      body: { status: "Shortlisted" },
    });
    assert(resStage1.status === 200, "PATCH participant stage to 'Shortlisted' returns 200 OK");
    assert(resStage1.data.data.status === "Shortlisted", "Participant DB status updated to 'Shortlisted'");

    // PATCH /api/college/drives/:driveId/participants/:participantId -> Stage: Selected (Placed)
    const resStage2 = await request(`/api/college/drives/${driveIdA}/participants/${appA1Id}`, {
      method: "PATCH",
      headers: authHeaderA,
      body: { status: "Selected" },
    });
    assert(resStage2.status === 200, "PATCH participant stage to 'Selected' returns 200 OK");
    assert(resStage2.data.data.status === "Selected", "Participant DB status updated to 'Selected'");

    // GET /api/college/drives/:driveId/eligible-students -> Evaluation Engine
    const resEval = await request(`/api/college/drives/${driveIdA}/eligible-students`, {
      headers: authHeaderA,
    });
    assert(resEval.status === 200, "GET /api/college/drives/:driveId/eligible-students returns 200 OK");
    assert(Array.isArray(resEval.data.data), "Response data is an array of student evaluations");
    const eligibleList = resEval.data.data;
    const aliceEvaluation = eligibleList.find((e) => e.student && e.student._id === studentA1._id.toString());
    assert(aliceEvaluation !== undefined, "Alice A evaluation record found");
    assert(aliceEvaluation.matchScore > 50, `Alice A matchScore (${aliceEvaluation.matchScore}) is high (> 50)`);
    assert(aliceEvaluation.evaluation.cgpa.pass === true, "Alice A passed CGPA check");
  }

  // =========================================================================
  // Phase 1.7: Broadcasts / Announcements (/api/college/broadcasts)
  // =========================================================================
  console.log("\n--- PHASE 1.7: Broadcasts / Announcements ---");
  let broadcastIdA;
  {
    const resCreate = await request("/api/college/broadcasts", {
      method: "POST",
      headers: authHeaderA,
      body: {
        title: "E2E Broadcast: Campus Drive Preparation 2026",
        message: "All CSE students must attend the pre-placement talk in Hall 1.",
        targetAudience: "Students",
        priority: "High",
        isUrgent: true,
      },
    });
    assert(resCreate.status === 201, "POST /api/college/broadcasts creates broadcast with 201 Created");
    assert(resCreate.data.data.isUrgent === true, "Broadcast isUrgent flag persisted as true");
    assert(resCreate.data.data.priority === "High", "Broadcast priority persisted as 'High'");
    broadcastIdA = resCreate.data.data._id;

    // GET List as College A
    const resListA = await request("/api/college/broadcasts", { headers: authHeaderA });
    assert(resListA.status === 200, "GET /api/college/broadcasts returns 200 OK for College A");
    const foundA = resListA.data.data.some((b) => b._id === broadcastIdA);
    assert(foundA, "Created broadcast listed for College A");

    // GET List as College B -> Must be isolated
    const resListB = await request("/api/college/broadcasts", { headers: authHeaderB });
    assert(resListB.status === 200, "GET /api/college/broadcasts returns 200 OK for College B");
    const foundB = resListB.data.data.some((b) => b._id === broadcastIdA);
    assert(!foundB, "TENANT GUARD: College A broadcast strictly hidden from College B");

    // GET Broadcast by ID
    const resGet = await request(`/api/college/broadcasts/${broadcastIdA}`, { headers: authHeaderA });
    assert(resGet.status === 200, "GET /api/college/broadcasts/:id returns 200 OK");

    // PUT Update broadcast
    const resUpdate = await request(`/api/college/broadcasts/${broadcastIdA}`, {
      method: "PUT",
      headers: authHeaderA,
      body: { message: "Updated: Please report by 9:30 AM sharp." },
    });
    assert(resUpdate.status === 200, "PUT /api/college/broadcasts/:id updates broadcast with 200 OK");
    assert(resUpdate.data.data.message.includes("9:30 AM"), "Broadcast message updated in DB");

    // DELETE Broadcast
    const resDelete = await request(`/api/college/broadcasts/${broadcastIdA}`, {
      method: "DELETE",
      headers: authHeaderA,
    });
    assert(resDelete.status === 200, "DELETE /api/college/broadcasts/:id deletes broadcast with 200 OK");
  }

  // =========================================================================
  // Phase 1.8: In-App College Notifications (/api/college/notifications)
  // =========================================================================
  console.log("\n--- PHASE 1.8: In-App College Notifications ---");
  let notifId1, notifId2;
  {
    const notif1 = await CollegeNotification.create({
      college: collegeA._id,
      title: "New Student Verification Pending",
      message: "Alice A submitted updated semester grades.",
      category: "student",
      isRead: false,
    });
    notifId1 = notif1._id;

    const notif2 = await CollegeNotification.create({
      college: collegeA._id,
      title: "Recruiter Scheduled Interview Round",
      message: "Apex Corp confirmed technical round date.",
      category: "recruiter",
      isRead: false,
    });
    notifId2 = notif2._id;

    // GET notifications
    const resGet = await request("/api/college/notifications", { headers: authHeaderA });
    assert(resGet.status === 200, "GET /api/college/notifications returns 200 OK");
    assert(resGet.data.data.unreadCount >= 2, `unreadCount accurately calculates unread items (>= 2), got ${resGet.data.data.unreadCount}`);

    // PATCH /api/college/notifications/:id/read -> Mark single read
    const resRead1 = await request(`/api/college/notifications/${notifId1}/read`, {
      method: "PATCH",
      headers: authHeaderA,
    });
    assert(resRead1.status === 200, "PATCH /api/college/notifications/:id/read returns 200 OK");
    assert(resRead1.data.data.isRead === true, "Notification isRead marked as true");

    // PATCH /api/college/notifications/read-all -> Mark all read
    const resReadAll = await request("/api/college/notifications/read-all", {
      method: "PATCH",
      headers: authHeaderA,
    });
    assert(resReadAll.status === 200, "PATCH /api/college/notifications/read-all returns 200 OK");

    const resGetAfter = await request("/api/college/notifications", { headers: authHeaderA });
    assert(resGetAfter.data.data.unreadCount === 0, "After read-all, unreadCount strictly equals 0");

    // DELETE /api/college/notifications/:id -> Dismiss single
    const resDelete = await request(`/api/college/notifications/${notifId2}`, {
      method: "DELETE",
      headers: authHeaderA,
    });
    assert(resDelete.status === 200, "DELETE /api/college/notifications/:id deletes notification with 200 OK");
  }

  // =========================================================================
  // Phase 1.9: Activity & Audit Logs (/api/college/activity-logs)
  // =========================================================================
  console.log("\n--- PHASE 1.9: Activity & Audit Logs ---");
  {
    const resLogs = await request("/api/college/activity-logs", { headers: authHeaderA });
    assert(resLogs.status === 200, "GET /api/college/activity-logs returns 200 OK");
    assert(Array.isArray(resLogs.data.data.logs), "Logs property returned as Array");
    assert(resLogs.data.data.total >= 1, "Audit logs automatically recorded previous operations");

    // Test filter module=PlacementDrive
    const resFilterModule = await request("/api/college/activity-logs?module=PlacementDrive", {
      headers: authHeaderA,
    });
    assert(resFilterModule.status === 200, "Filter activity logs by module=PlacementDrive returns 200 OK");
    const allDriveModule = resFilterModule.data.data.logs.every((l) => l.module === "PlacementDrive");
    assert(allDriveModule, "All filtered logs have module='PlacementDrive'");

    // Test filter action=CREATE_DRIVE
    const resFilterAction = await request("/api/college/activity-logs?action=CREATE_DRIVE", {
      headers: authHeaderA,
    });
    assert(resFilterAction.status === 200, "Filter activity logs by action=CREATE_DRIVE returns 200 OK");

    // Test pagination
    const resPage = await request("/api/college/activity-logs?page=1&limit=2", {
      headers: authHeaderA,
    });
    assert(resPage.status === 200, "Pagination query returns 200 OK");
    assert(resPage.data.data.page === 1, "Page number matches requested page 1");
    assert(resPage.data.data.totalPages !== undefined, "totalPages calculated in pagination response");
  }

  // =========================================================================
  // Phase 1.10: Recruiter Coordination & Placement Summaries
  // =========================================================================
  console.log("\n--- PHASE 1.10: Recruiter Coordination & Placement Summaries ---");
  {
    // GET /api/college/companies
    const resCompanies = await request("/api/college/companies", { headers: authHeaderA });
    assert(resCompanies.status === 200, "GET /api/college/companies returns 200 OK");
    const foundApex = resCompanies.data.data.some((c) => c.name === "E2E Test Corp Apex");
    assert(foundApex, "Coordinating company 'E2E Test Corp Apex' returned in list");

    // GET /api/college/coordination/visits
    const resVisits = await request("/api/college/coordination/visits", { headers: authHeaderA });
    assert(resVisits.status === 200, "GET /api/college/coordination/visits returns 200 OK");
    assert(Array.isArray(resVisits.data.data.upcoming), "Campus visits response includes 'upcoming' array");
    assert(Array.isArray(resVisits.data.data.past), "Campus visits response includes 'past' array");
    assert(typeof resVisits.data.data.upcomingCount === "number", "upcomingCount is numeric");

    // GET /api/college/coordination/company-summary
    const resCompSummary = await request("/api/college/coordination/company-summary", {
      headers: authHeaderA,
    });
    assert(resCompSummary.status === 200, "GET /api/college/coordination/company-summary returns 200 OK");
    assert(Array.isArray(resCompSummary.data.data), "Company summary returned as Array");
    const apexSummary = resCompSummary.data.data.find((s) => s.companyName === "E2E Test Corp Apex");
    assert(apexSummary !== undefined, "Apex Corp summary aggregated with placement metrics");
    if (apexSummary) {
      assert(apexSummary.totalDrives >= 1, "Apex Corp totalDrives count calculated");
      assert(apexSummary.totalApplicants >= 2, "Apex Corp totalApplicants count calculated");
      assert(apexSummary.placedCount >= 1, "Apex Corp placedCount accurately reflects Selected applications");
    }

    // GET /api/college/coordination/recruiter-summary
    const resRecSummary = await request("/api/college/coordination/recruiter-summary", {
      headers: authHeaderA,
    });
    assert(resRecSummary.status === 200, "GET /api/college/coordination/recruiter-summary returns 200 OK");
    assert(Array.isArray(resRecSummary.data.data), "Recruiter summary returned as Array");
    const rachel = resRecSummary.data.data.find((r) => r.email === "rachel@e2etestrecruiter.com");
    assert(rachel !== undefined, "Rachel Recruiter profile returned with visit metrics");
  }

  // Cleanup server
  if (server) {
    server.close();
  }

  // =========================================================================
  // Final Stats Printout
  // =========================================================================
  const stats = getStats();
  console.log("\n=================================================================");
  console.log("=== COLLEGE E2E & SMOKE SUITE FINISHED ===");
  console.log(`  HTTP integration assertions:    ${stats.httpCount}`);
  console.log(`  Required integration skipped:   ${stats.skipped}`);
  console.log(`  Total passed:                   ${stats.passed}`);
  console.log(`  Total failed:                   ${stats.failed}`);
  console.log("=================================================================");

  if (stats.failed > 0) {
    process.exit(1);
  }
}

runCollegeE2ETests()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("FATAL ERROR IN E2E SUITE:", err);
    if (server) server.close();
    process.exit(1);
  });
