import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
import ApplicationStatusHistory from "../src/models/applicationStatusHistory.js";
import EligibilityPreset from "../src/models/eligibilityPreset.js";
import CollegeNotification from "../src/models/collegeNotification.js";
import CollegeActivityLog from "../src/models/collegeActivityLog.js";
import Broadcast from "../src/models/broadcast.js";
import collegeRoutes from "../src/routes/collegeRoutes.js";
import generateToken from "../src/utils/generateToken.js";
import { recordsToCsv, parseCsv } from "../src/utils/csvHelper.js";

import {
  resolveTestDbUri,
  verifyTestDbSafety,
  printSafetyReport,
  createTestTracker,
  isStrictMode,
} from "./test-helper.js";

const { assert, recordSkip, getStats, setDefaultCategory } = createTestTracker("College Backend Suite");

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

  return { status: res.status, data, text, headers: res.headers };
}

async function runCollegeTests() {
  console.log("=================================================================");
  console.log("=== STARTING COMPREHENSIVE COLLEGE MODULE QA & REGRESSION SUITE ===");
  console.log("=================================================================");

  // 1. Resolve & Verify Test Database Safety
  const mongoUri = resolveTestDbUri();
  const { dbName } = verifyTestDbSafety(mongoUri);
  printSafetyReport(dbName);

  // 2. Schema & Standalone Contract Validations (Always Executed)
  console.log("--- TEST GROUP 0: College Model & Static Contracts ---");

  // 0.1 Password selection contract
  const collegePasswordPath = College.schema.path("password");
  assert(
    collegePasswordPath.options.select === false,
    "College password path has select: false configured",
    "static"
  );

  // 0.2 Token generation contract (college role claim)
  const testCollegeObj = { _id: new mongoose.Types.ObjectId() };
  const token = generateToken(testCollegeObj, "college");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert(decoded.id === testCollegeObj._id.toString(), "College token id matches college _id", "unit");
  assert(decoded.role === "college", "College token role is 'college'", "unit");
  assert(decoded.role !== "student", "College token role is NOT 'student' (Regression Guard)", "unit");

  // 0.3 CSV Helper contracts
  const sampleCsv = [
    "name,email,phone,branch,semester,percentage,skills",
    'Test Student 1,t1@student.edu,9876543210,Computer Science,6,85.5,"Java, Spring Boot"',
    'Test Student 2,t2@student.edu,9876543211,Information Technology,7,90.0,"Python, FastAPI"',
  ].join("\n");
  const parsedRows = parseCsv(sampleCsv);
  assert(parsedRows.length === 2, "parseCsv parses 2 rows correctly", "unit");
  assert(parsedRows[0].skills === "Java, Spring Boot", "Embedded comma in quoted field parsed correctly", "unit");

  const sampleRecords = [
    {
      name: "Test Student 1",
      email: "t1@student.edu",
      phone: "9876543210",
      branch: "Computer Science",
      semester: 6,
      percentage: 85.5,
      status: "Active",
      skills: "Java, Spring Boot",
      createdAt: "2026-09-01T00:00:00.000Z",
    },
  ];
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "branch", label: "Branch" },
    { key: "semester", label: "Semester" },
    { key: "percentage", label: "Percentage" },
    { key: "status", label: "Status" },
    { key: "skills", label: "Skills" },
    { key: "createdAt", label: "Registered At" },
  ];
  const exported = recordsToCsv(sampleRecords, columns);
  assert(exported.includes("Name,Email,Phone,Branch,Semester,Percentage,Status,Skills,Registered At"), "CSV headers formatted correctly", "unit");
  assert(!exported.includes("password"), "CSV output never exposes passwords", "unit");

  // 0.4 Route ordering check
  const routes = [];
  collegeRoutes.stack.forEach((layer) => {
    if (layer.route) {
      routes.push(layer.route.path);
    }
  });
  const bulkImportIdx = routes.indexOf("/students/bulk-import");
  const exportIdx = routes.indexOf("/students/export");
  const bulkUpdateIdx = routes.indexOf("/students/bulk");
  const eligibleIdx = routes.indexOf("/students/eligible");
  const studentIdIdx = routes.indexOf("/students/:id");
  const appSummaryIdx = routes.indexOf("/applications/summary");
  const appIdIdx = routes.indexOf("/applications/:id");

  assert(bulkImportIdx !== -1 && bulkImportIdx < studentIdIdx, "/students/bulk-import precedes /students/:id", "static");
  assert(exportIdx !== -1 && exportIdx < studentIdIdx, "/students/export precedes /students/:id", "static");
  assert(bulkUpdateIdx !== -1 && bulkUpdateIdx < studentIdIdx, "/students/bulk precedes /students/:id", "static");
  assert(eligibleIdx !== -1 && eligibleIdx < studentIdIdx, "/students/eligible precedes /students/:id", "static");
  assert(appSummaryIdx !== -1 && appSummaryIdx < appIdIdx, "/applications/summary precedes /applications/:id", "static");

  // 0.5 MAIN architecture models existence
  assert(PlacementDrive !== undefined, "PlacementDrive model is present and authoritative", "static");
  assert(EligibilityPreset !== undefined, "EligibilityPreset model is present and authoritative", "static");
  assert(CollegeNotification !== undefined, "CollegeNotification model is present and authoritative", "static");
  assert(CollegeActivityLog !== undefined, "CollegeActivityLog model is present and authoritative", "static");

  // 3. Live Database Connection & Integration Tests
  let isDbConnected = false;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    isDbConnected = true;
    console.log(`✔ Connected to isolated test database "${dbName}" successfully!\n`);
  } catch (err) {
    console.log(`ℹ Live test MongoDB connection unavailable (${err.message}).`);
    recordSkip(38, `Live test DB connection failed: ${err.message}`);
  }

  if (isDbConnected) {
    try {
      // Clean up previous test fixtures
      await College.deleteMany({ email: /@testcollege\.edu/ });
      await Student.deleteMany({ email: /@teststudent\.com/ });
      await Company.deleteMany({ name: /^CollegeTestCorp/ });
      await Recruiter.deleteMany({ email: /@testcollegerecruiter\.com/ });
      await Project.deleteMany({ title: /College Test Project/ });
      await PlacementDrive.deleteMany({ title: /College Test Drive/ });
      await Application.deleteMany({});
      await ApplicationStatusHistory.deleteMany({});
      await EligibilityPreset.deleteMany({});
      await CollegeNotification.deleteMany({});
      await CollegeActivityLog.deleteMany({});
      await Broadcast.deleteMany({ title: /College Test Broadcast/ });

      // Start test HTTP server on ephemeral port
      await new Promise((resolve) => {
        server = http.createServer(app);
        server.listen(0, () => {
          const port = server.address().port;
          baseUrl = `http://localhost:${port}`;
          console.log(`College Test server running on ephemeral port ${port}`);
          resolve();
        });
      });

      // =========================================================================
      // 1. COLLEGE REGISTRATION, LOGIN & JWT TESTS
      // =========================================================================
      setDefaultCategory("http");
      console.log("\n--- TEST GROUP 1: College Authentication & JWT Tests ---");

      // 1.1 Register College A
      let regRes = await request("/api/college/register", {
        method: "POST",
        body: {
          name: "Test College A",
          email: "collegea@testcollege.edu",
          phone: "9876543201",
          password: "CollegePassword123!",
          address: "100 Campus Way",
          website: "https://collegea.edu",
          university: "State University",
        },
      });
      assert(regRes.status === 201, "College registration returns 201");
      assert(regRes.data.data.token !== undefined, "Registration returns JWT token");
      const collegeA_Id = regRes.data.data.id || regRes.data.data._id;

      // 1.2 Register College B (for isolation tests)
      let regBRes = await request("/api/college/auth/register", {
        method: "POST",
        body: {
          name: "Test College B",
          email: "collegeb@testcollege.edu",
          phone: "9876543202",
          password: "CollegePassword123!",
          address: "200 Campus Way",
          website: "https://collegeb.edu",
          university: "State University",
        },
      });
      assert(regBRes.status === 201, "College registration alias /auth/register returns 201");
      const collegeB_Id = regBRes.data.data.id || regBRes.data.data._id;

      // 1.3 Login College A
      let loginRes = await request("/api/college/login", {
        method: "POST",
        body: { email: "collegea@testcollege.edu", password: "CollegePassword123!" },
      });
      assert(loginRes.status === 200, "College login returns 200");
      assert(Boolean(loginRes.data.data?.token), "College login returns JWT token");
      const tokenA = loginRes.data.data.token;

      // 1.4 Login College B
      let loginBRes = await request("/api/college/auth/login", {
        method: "POST",
        body: { email: "collegeb@testcollege.edu", password: "CollegePassword123!" },
      });
      assert(loginBRes.status === 200, "College login alias /auth/login returns 200");
      const tokenB = loginBRes.data.data.token;

      // 1.5 Verify JWT Role in decoded token
      const decodedA = jwt.verify(tokenA, process.env.JWT_SECRET);
      assert(decodedA.role === "college", "Decoded token role is 'college'");
      assert(decodedA.role !== "student", "Decoded token role is not 'student'");

      // 1.6 Inactive College Blocked (403)
      await College.findByIdAndUpdate(collegeB_Id, { status: "Inactive" });
      let inactiveLoginRes = await request("/api/college/login", {
        method: "POST",
        body: { email: "collegeb@testcollege.edu", password: "CollegePassword123!" },
      });
      assert(inactiveLoginRes.status === 403, "Inactive college login blocked with 403");

      let inactiveReqRes = await request("/api/college/profile", {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(inactiveReqRes.status === 403, "Inactive college request blocked by middleware with 403");

      // Restore College B to Active
      await College.findByIdAndUpdate(collegeB_Id, { status: "Active" });

      // =========================================================================
      // 2. COLLEGE PROFILE MANAGEMENT
      // =========================================================================
      console.log("\n--- TEST GROUP 2: College Profile Tests ---");

      let profRes = await request("/api/college/profile", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(profRes.status === 200, "College profile returns 200");
      assert(profRes.data.data.password === undefined, "Password hash is not exposed in profile");

      // Update profile with allowed fields
      let updateProfRes = await request("/api/college/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          name: "Updated College A Institute",
          city: "Tech City",
          state: "California",
          placementOfficerName: "Jane Doe",
          placementOfficerEmail: "placement@collegea.edu",
          placementOfficerPhone: "9876543209",
          // Attempt blocked fields
          status: "Inactive",
          verificationStatus: "Verified",
        },
      });
      assert(updateProfRes.status === 200, "Profile update returns 200");
      assert(updateProfRes.data.data.name === "Updated College A Institute", "Allowed field 'name' updated");
      assert(updateProfRes.data.data.city === "Tech City", "Allowed field 'city' updated");
      assert(updateProfRes.data.data.status === "Active", "Blocked field 'status' was protected");

      // =========================================================================
      // 3. STUDENT CRUD & RICH ACADEMIC FIELDS PRESERVATION
      // =========================================================================
      console.log("\n--- TEST GROUP 3: Student CRUD & Academic Fields ---");

      let createStdRes = await request("/api/college/students", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          name: "Alice Johnson",
          email: "alice@teststudent.com",
          phone: "9876543211",
          branch: "Computer Science",
          semester: 7,
          percentage: 89.5,
          cgpa: 8.95,
          backlogs: 0,
          activeBacklogs: 0,
          passingYear: 2026,
          graduationYear: 2026,
          skills: ["Java", "Spring Boot", "React"],
          status: "Active",
        },
      });
      assert(createStdRes.status === 201, "Student created with 201");
      const studentA_Id = createStdRes.data.data._id;

      // Verify rich academic fields preserved
      let getStdRes = await request(`/api/college/students/${studentA_Id}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(getStdRes.status === 200, "Get student by ID returns 200");
      assert(getStdRes.data.data.cgpa === 8.95, "Student cgpa preserved");
      assert(getStdRes.data.data.activeBacklogs === 0, "Student activeBacklogs preserved");
      assert(getStdRes.data.data.graduationYear === 2026, "Student graduationYear preserved");

      // =========================================================================
      // 4. CSV BULK IMPORT
      // =========================================================================
      console.log("\n--- TEST GROUP 4: CSV Bulk Student Import ---");

      const csvContent = [
        "name,email,phone,branch,semester,percentage,skills",
        'Bulk Student 1,bulk1@teststudent.com,9876543221,Information Technology,6,88.0,"Python, Django"',
        'Bulk Student 2,bulk2@teststudent.com,9876543222,Computer Science,6,78.5,"C++, Linux"',
      ].join("\n");

      let bulkImportRes = await request("/api/college/students/bulk-import", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: { csvData: csvContent },
      });
      assert(bulkImportRes.status === 201, "Bulk import CSV returns 201");
      assert(bulkImportRes.data.data.importedCount === 2, "Imported count equals 2");
      assert(bulkImportRes.data.data.failedCount === 0, "Failed count equals 0");

      // Duplicate detection within batch
      const duplicateBatchCsv = [
        "name,email,phone,branch,semester,percentage,skills",
        'Dup Student 1,dup@teststudent.com,9876543223,IT,6,80.0,"JS"',
        'Dup Student 2,dup@teststudent.com,9876543224,IT,6,80.0,"JS"',
      ].join("\n");
      let dupBatchRes = await request("/api/college/students/bulk-import", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: { csvData: duplicateBatchCsv },
      });
      assert(dupBatchRes.data.data.failedCount > 0, "Duplicate email in batch reported as failure");

      // =========================================================================
      // 5. CSV EXPORT & CROSS-COLLEGE ISOLATION
      // =========================================================================
      console.log("\n--- TEST GROUP 5: CSV Export & Cross-College Isolation ---");

      // Create a student for College B
      await Student.create({
        name: "Bob Foreign",
        email: "bob@teststudent.com",
        college: collegeB_Id,
        branch: "Mechanical",
        semester: 6,
        percentage: 82.0,
        status: "Active",
      });

      // Export College A CSV
      let exportResA = await request("/api/college/students/export", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(exportResA.status === 200, "Export returns 200");
      assert(exportResA.headers.get("content-type")?.includes("text/csv"), "Content-Type is text/csv");
      assert(exportResA.text.includes("alice@teststudent.com"), "College A student included in export");
      // MANDATORY CROSS-COLLEGE ISOLATION
      assert(!exportResA.text.includes("bob@teststudent.com"), "MANDATORY: College B student excluded from College A export");
      assert(!exportResA.text.includes("password"), "Export never leaks password hashes");

      // =========================================================================
      // 6. BULK STUDENT UPDATE & CROSS-COLLEGE ISOLATION
      // =========================================================================
      console.log("\n--- TEST GROUP 6: Bulk Student Update & Ownership ---");

      const studentB_Doc = await Student.findOne({ email: "bob@teststudent.com" });
      const studentB_Id = studentB_Doc._id.toString();

      // Bulk update including own student and foreign student
      let bulkUpdateRes = await request("/api/college/students/bulk", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          updates: [
            {
              id: studentA_Id,
              branch: "Artificial Intelligence",
              percentage: 95.0,
            },
            {
              id: studentB_Id, // Belongs to College B!
              branch: "Hacked Foreign Branch",
            },
          ],
        },
      });
      assert(bulkUpdateRes.status === 200, "Bulk update returns 200");
      assert(bulkUpdateRes.data.data.updatedCount === 1, "Own student updated");
      assert(bulkUpdateRes.data.data.failedCount === 1, "Foreign student update rejected");

      // Verify foreign student branch remained untouched in DB
      const freshB = await Student.findById(studentB_Id);
      assert(freshB.branch === "Mechanical", "Foreign student in DB remains completely unmodified");

      // =========================================================================
      // 7. APPLICATION LIFECYCLE & STATUS HISTORY TESTS
      // =========================================================================
      console.log("\n--- TEST GROUP 7: Applications & Status History ---");

      const testCompany = await Company.create({
        name: "CollegeTestCorp Inc",
        email: "hr@collegetestcorp.com",
      });

      const testRecruiter = await Recruiter.create({
        name: "Recruiter Bob",
        email: "recruiter@testcollegerecruiter.com",
        phone: "9876543210",
        designation: "Lead Recruiter",
        company: testCompany._id,
      });

      // Create Application
      let appCreateRes = await request("/api/college/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          student: studentA_Id,
          recruiter: testRecruiter._id,
          company: testCompany._id,
          status: "Applied",
        },
      });
      assert(appCreateRes.status === 201, "Application created with 201");
      const testAppId = appCreateRes.data.data._id;

      // Transition Status: "Applied" -> "Interview"
      let appUpdateRes = await request(`/api/college/applications/${testAppId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          status: "Interview",
          remarks: "Technical interview round scheduled",
        },
      });
      assert(appUpdateRes.status === 200, "Application status update returns 200");
      assert(appUpdateRes.data.data.status === "Interview", "Application status updated to Interview");

      // Retrieve History
      let historyRes = await request(`/api/college/applications/${testAppId}/history`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(historyRes.status === 200, "History retrieval returns 200");
      assert(Array.isArray(historyRes.data.data), "History returned as array");
      assert(historyRes.data.data.length >= 1, "History contains recorded transition");

      // MANDATORY CROSS-COLLEGE HISTORY ACCESS DENIED
      let foreignHistRes = await request(`/api/college/applications/${testAppId}/history`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(
        foreignHistRes.status === 404 || foreignHistRes.status === 403,
        "MANDATORY: College B blocked from accessing College A application history"
      );

      // =========================================================================
      // 8. APPLICATION SUMMARY & ISOLATION
      // =========================================================================
      console.log("\n--- TEST GROUP 8: Application Summary & Isolation ---");

      let summaryResA = await request("/api/college/applications/summary", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(summaryResA.status === 200, "Application summary returns 200");
      assert(typeof summaryResA.data.data.totalApplications === "number", "totalApplications is numeric");
      assert(summaryResA.data.data.statusCounts["Interview"] >= 1, "Interview count recorded");

      let summaryResB = await request("/api/college/applications/summary", {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(summaryResB.status === 200, "College B summary returns 200");
      assert(summaryResB.data.data.totalApplications === 0, "MANDATORY: College B summary has 0 applications (isolated)");

      // =========================================================================
      // 9. COLLEGE-OWNED PROJECTS
      // =========================================================================
      console.log("\n--- TEST GROUP 9: College Project Management ---");

      let createProjRes = await request("/api/college/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          title: "College Test Project Capstone",
          description: "Machine Learning Capstone Project",
          duration: "4 months",
          requiredSkills: ["Python", "PyTorch"],
        },
      });
      assert(createProjRes.status === 201, "College project created with 201");
      const projId = createProjRes.data.data._id;

      let getProjRes = await request(`/api/college/projects/${projId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(getProjRes.status === 200, "Get project by ID returns 200");
      assert(getProjRes.data.data.title === "College Test Project Capstone", "Project title matches");

      // =========================================================================
      // 10. MAIN-ONLY ARCHITECTURE REGRESSION (PLACEMENT DRIVE, PRESETS, LOGS)
      // =========================================================================
      console.log("\n--- TEST GROUP 10: MAIN-Only Architecture Regression ---");

      // 10.1 PlacementDrive CRUD
      let driveCreateRes = await request("/api/college/drives", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          companyName: "Enterprise Systems",
          jobRole: "Full Stack Engineer",
          packageLPA: "12 LPA",
          driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          eligibleBranches: ["Computer Science", "Information Technology"],
          minCgpa: 7.5,
          maxBacklogs: 0,
          status: "Upcoming",
        },
      });
      assert(driveCreateRes.status === 201, "PlacementDrive created with 201 (MAIN Preserved)");
      const driveId = driveCreateRes.data.data._id;

      let driveListRes = await request("/api/college/drives", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(driveListRes.status === 200, "PlacementDrive list returns 200");

      let driveGetRes = await request(`/api/college/drives/${driveId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(driveGetRes.status === 200, "PlacementDrive detail returns 200");

      // 10.2 Drive Participants & Progression
      let drivePartsRes = await request(`/api/college/drives/${driveId}/participants`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(drivePartsRes.status === 200, "Drive participants route returns 200");

      // 10.3 Drive Eligible Students Evaluation
      let driveEligRes = await request(`/api/college/drives/${driveId}/eligible-students`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(driveEligRes.status === 200, "Drive eligible-students evaluation returns 200");

      // 10.4 Eligibility Presets CRUD
      let presetRes = await request("/api/college/eligibility-presets", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          name: "Standard Tier 1 Criteria",
          minCgpa: 8.0,
          allowedBranches: ["Computer Science"],
          maxActiveBacklogs: 0,
        },
      });
      assert(presetRes.status === 201, "EligibilityPreset created with 201 (MAIN Preserved)");
      const presetId = presetRes.data.data._id;

      let presetGetRes = await request(`/api/college/eligibility-presets/${presetId}`, {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(presetGetRes.status === 200, "EligibilityPreset detail returns 200");

      // 10.5 College Notifications
      let notifRes = await request("/api/college/notifications", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(notifRes.status === 200, "College notifications list returns 200 (MAIN Preserved)");

      // 10.6 College Activity Logs
      let actLogRes = await request("/api/college/activity-logs", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(actLogRes.status === 200, "College activity logs route returns 200 (MAIN Preserved)");

      // 10.7 College Broadcasts
      let bcastRes = await request("/api/college/broadcasts", {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenA}` },
        body: {
          title: "College Test Broadcast: Placement Orientation",
          message: "All final year students attend placement hall tomorrow at 10 AM.",
        },
      });
      assert(bcastRes.status === 201, "College broadcast created with 201 (MAIN Preserved)");
      const bcastId = bcastRes.data.data._id;

      let delBcastRes = await request(`/api/college/broadcasts/${bcastId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(delBcastRes.status === 200, "College broadcast deleted with 200");

      // 10.8 Company & Recruiter Coordination Routes
      let compCoordRes = await request("/api/college/companies", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(compCoordRes.status === 200, "Coordinating companies route returns 200 (MAIN Preserved)");

      let recCoordRes = await request("/api/college/recruiters", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(recCoordRes.status === 200, "Coordinating recruiters route returns 200 (MAIN Preserved)");

      let visitsRes = await request("/api/college/coordination/visits", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(visitsRes.status === 200, "Coordination visits route returns 200 (MAIN Preserved)");

      // 10.9 College Dashboard
      let dashRes = await request("/api/college/dashboard", {
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(dashRes.status === 200, "College dashboard returns 200 (MAIN Preserved)");
    } finally {
      // Clean up all temporary test fixtures
      try {
        await College.deleteMany({ email: /@testcollege\.edu/ });
        await Student.deleteMany({ email: /@teststudent\.com/ });
        await Company.deleteMany({ name: /^CollegeTestCorp/ });
        await Recruiter.deleteMany({ email: /@testcollegerecruiter\.com/ });
        await Project.deleteMany({ title: /College Test Project/ });
        await PlacementDrive.deleteMany({});
        await Application.deleteMany({});
        await ApplicationStatusHistory.deleteMany({});
        await EligibilityPreset.deleteMany({});
        await CollegeNotification.deleteMany({});
        await CollegeActivityLog.deleteMany({});
        await Broadcast.deleteMany({ title: /College Test Broadcast/ });
        await mongoose.disconnect();
      } catch {}

      if (server) {
        server.close();
      }
    }
  }

  const stats = getStats();
  console.log(`\n=================================================================`);
  console.log(`=== COLLEGE SUITE FINISHED ===`);
  console.log(`  Static tests executed:          ${stats.staticCount}`);
  console.log(`  Unit tests executed:            ${stats.unitCount}`);
  console.log(`  HTTP integration tests:         ${stats.httpCount}`);
  console.log(`  DB integration tests:           ${stats.dbCount}`);
  console.log(`  Required integration skipped:   ${stats.skipped}`);
  console.log(`  Total passed:                   ${stats.passed}`);
  console.log(`  Total failed:                   ${stats.failed}`);
  console.log(`=================================================================`);

  if (stats.failed > 0 || (isStrictMode() && stats.skipped > 0)) {
    process.exit(1);
  }
}

// Execute suite if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCollegeTests().catch((err) => {
    console.error("College test runner encountered uncaught error:", err);
    process.exit(1);
  });
}

export default runCollegeTests;
