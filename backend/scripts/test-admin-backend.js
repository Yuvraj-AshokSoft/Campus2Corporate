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
import Admin from "../src/models/admin.js";
import Student from "../src/models/student.js";
import College from "../src/models/college.js";
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Project from "../src/models/project.js";
import PlacementDrive from "../src/models/placementDrive.js";
import Application from "../src/models/application.js";
import Broadcast from "../src/models/broadcast.js";
import ContentRoadmap from "../src/models/contentRoadmap.js";
import SupportTicket from "../src/models/supportTicket.js";
import SystemSetting from "../src/models/systemSetting.js";
import AdminActivity from "../src/models/adminActivity.js";
import seedAdmin from "../src/utils/seedAdmin.js";
import generateToken from "../src/utils/generateToken.js";

import {
  resolveTestDbUri,
  verifyTestDbSafety,
  printSafetyReport,
  createTestTracker,
  isStrictMode,
} from "./test-helper.js";

const { assert, recordSkip, getStats, setDefaultCategory } = createTestTracker("Admin Backend Suite");

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

async function runAdminTests() {
  console.log("=================================================================");
  console.log("=== STARTING COMPREHENSIVE ADMIN MODULE QA & SECURITY TEST SUITE ===");
  console.log("=================================================================");

  // 1. Resolve & Verify Test Database Safety
  const mongoUri = resolveTestDbUri();
  const { dbName } = verifyTestDbSafety(mongoUri);
  printSafetyReport(dbName);

  // 2. Schema & In-Memory Contract Validations (Always Executed)
  console.log("--- TEST GROUP 0: Admin Model & Utility Contracts ---");

  // 0.1 Password selection contract
  const adminPasswordPath = Admin.schema.path("password");
  assert(
    adminPasswordPath.options.select === false,
    "Admin password field has select: false configured on schema",
    "static"
  );

  // 0.2 Token generation contract
  const testAdminObj = { _id: new mongoose.Types.ObjectId(), role: "Super Admin" };
  const token = generateToken(testAdminObj, "Super Admin");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert(decoded.id === testAdminObj._id.toString(), "Token decodes to correct Admin ID", "unit");
  assert(decoded.role === "Super Admin", "Token contains correct Super Admin role claim", "unit");

  // 0.3 Seeding utility safety check (missing credentials)
  const origEmail = process.env.ADMIN_EMAIL;
  const origPass = process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
  const skipResult = await seedAdmin();
  assert(skipResult === undefined, "seedAdmin cleanly skips when credentials are missing", "unit");
  process.env.ADMIN_EMAIL = origEmail || "admin@example.com";
  process.env.ADMIN_PASSWORD = origPass || "SuperSecretPassword123!";

  // 0.4 Model harmonization checks
  assert(Project.schema.path("approvalStatus") !== undefined, "Project schema contains approvalStatus", "static");
  assert(Broadcast.schema.path("createdBy") !== undefined, "Broadcast schema contains createdBy", "static");
  assert(Broadcast.schema.path("college") !== undefined, "Broadcast schema contains college (harmonized)", "static");

  // 3. Live Database Connection & Integration Tests
  let isDbConnected = false;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    isDbConnected = true;
    console.log(`✔ Connected to isolated test database "${dbName}" successfully!\n`);
  } catch (err) {
    console.log(`ℹ Live test MongoDB connection unavailable (${err.message}).`);
    recordSkip(34, `Live test DB connection failed: ${err.message}`);
  }

  if (isDbConnected) {
    try {
      // Clean up previous test fixtures
      await Admin.deleteMany({ email: /@testadmin\.com/ });
      await Student.deleteMany({ email: /@testadminstudent\.com/ });
      await College.deleteMany({ email: /@testadmincollege\.edu/ });
      await Company.deleteMany({ name: /^AdminTestCorp/ });
      await Recruiter.deleteMany({ email: /@testrecruiter\.com/ });
      await Project.deleteMany({ title: /Test Drive/ });
      await PlacementDrive.deleteMany({ title: /Admin Test Placement Drive/ });
      await Broadcast.deleteMany({ title: /Test Broadcast/ });
      await ContentRoadmap.deleteMany({ title: /Test Track/ });
      await SupportTicket.deleteMany({ requesterEmail: /@testadmin/ });
      await AdminActivity.deleteMany({});

      // Start test HTTP server on ephemeral port
      await new Promise((resolve) => {
        server = http.createServer(app);
        server.listen(0, () => {
          const port = server.address().port;
          baseUrl = `http://localhost:${port}`;
          console.log(`Admin Test server running on ephemeral port ${port}`);
          resolve();
        });
      });

      // =========================================================================
      // 1. ADMIN AUTHENTICATION & SECURITY TESTS
      // =========================================================================
      setDefaultCategory("http");
      console.log("\n--- TEST GROUP 1: Admin Authentication & Security ---");

      const superAdmin = await Admin.create({
        name: "Super Admin Tester",
        email: "super@testadmin.com",
        phone: "9876500001",
        password: "SuperSecretPassword123!",
        role: "Super Admin",
        status: "Active",
      });

      const standardAdmin = await Admin.create({
        name: "Standard Admin Tester",
        email: "staff@testadmin.com",
        phone: "9876500002",
        password: "StaffPassword123!",
        role: "Admin",
        status: "Active",
      });

      const inactiveAdmin = await Admin.create({
        name: "Inactive Admin",
        email: "inactive@testadmin.com",
        phone: "9876500003",
        password: "InactivePassword123!",
        role: "Admin",
        status: "Inactive",
      });

      // 1.1 Super Admin Login
      let loginRes = await request("/api/admin/login", {
        method: "POST",
        body: { email: "super@testadmin.com", password: "SuperSecretPassword123!" },
      });
      assert(loginRes.status === 200, "Super admin login returns 200");
      assert(loginRes.data.success === true, "Super admin login returns success: true");
      assert(Boolean(loginRes.data.data?.token), "Super admin login returns JWT token");
      assert(loginRes.data.data?.admin?.role === "Super Admin", "Super admin role is returned");
      assert(loginRes.data.data?.admin?.password === undefined, "Password hash is not exposed in login response");
      const superAdminToken = loginRes.data.data.token;

      // 1.2 Standard Admin Login
      loginRes = await request("/api/admin/login", {
        method: "POST",
        body: { email: "staff@testadmin.com", password: "StaffPassword123!" },
      });
      assert(loginRes.status === 200, "Standard admin login returns 200");
      const standardAdminToken = loginRes.data.data.token;

      // 1.3 Inactive Admin Login Blocked (403)
      let badLoginRes = await request("/api/admin/login", {
        method: "POST",
        body: { email: "inactive@testadmin.com", password: "InactivePassword123!" },
      });
      assert(badLoginRes.status === 403, "Inactive admin login blocked with 403");

      // 1.4 Inactive Admin Token Access Blocked (403)
      const inactiveToken = jwt.sign(
        { id: inactiveAdmin._id, role: inactiveAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      let inactiveAccessRes = await request("/api/admin/profile", {
        headers: { Authorization: `Bearer ${inactiveToken}` },
      });
      assert(inactiveAccessRes.status === 403, "Inactive admin token access blocked with 403");

      // 1.5 Invalid Password Login (401)
      badLoginRes = await request("/api/admin/login", {
        method: "POST",
        body: { email: "super@testadmin.com", password: "WrongPassword999!" },
      });
      assert(badLoginRes.status === 401, "Invalid password returns 401");

      // 1.6 Missing Token on Protected Route (401)
      let noTokenRes = await request("/api/admin/profile");
      assert(noTokenRes.status === 401, "Missing token returns 401");

      // 1.7 Malformed Token (401)
      let fakeTokenRes = await request("/api/admin/profile", {
        headers: { Authorization: "Bearer fake_tampered_jwt_token_xyz" },
      });
      assert(fakeTokenRes.status === 401, "Fake/tampered token returns 401");

      // 1.8 Cross-Role Token: Student Token on Admin Route (403)
      const studentToken = jwt.sign(
        { id: new mongoose.Types.ObjectId(), role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      let studentRoleRes = await request("/api/admin/profile", {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      assert(studentRoleRes.status === 403, "Student token on Admin route rejected with 403");

      // 1.9 Cross-Role Token: College Token on Admin Route (403)
      const collegeToken = jwt.sign(
        { id: new mongoose.Types.ObjectId(), role: "college" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      let collegeRoleRes = await request("/api/admin/profile", {
        headers: { Authorization: `Bearer ${collegeToken}` },
      });
      assert(collegeRoleRes.status === 403, "College token on Admin route rejected with 403");

      // =========================================================================
      // 2. ADMIN PROFILE & SUPER ADMIN RBAC
      // =========================================================================
      console.log("\n--- TEST GROUP 2: Admin Profile & RBAC Guards ---");

      // 2.1 Admin Profile
      let profRes = await request("/api/admin/profile", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(profRes.status === 200, "Admin profile returns 200");
      assert(profRes.data.data.email === "staff@testadmin.com", "Admin profile email matches");
      assert(profRes.data.data.password === undefined, "Admin profile does not expose password");

      // 2.2 Super Admin can register another admin
      let regAdminRes = await request("/api/admin/register", {
        method: "POST",
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: {
          name: "Subordinate Admin",
          email: "subadmin@testadmin.com",
          phone: "9876500004",
          password: "SubAdminPassword123!",
          role: "Admin",
        },
      });
      assert(regAdminRes.status === 201, "Super Admin can register new Admin");
      assert((regAdminRes.data.data.role || regAdminRes.data.data.admin?.role) === "Admin", "Registered admin has Admin role");

      // 2.3 Regular Admin CANNOT register another admin (RBAC 403)
      let deniedRegRes = await request("/api/admin/register", {
        method: "POST",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: {
          name: "Illegal Admin",
          email: "illegal@testadmin.com",
          phone: "9876500005",
          password: "IllegalPassword123!",
          role: "Admin",
        },
      });
      assert(deniedRegRes.status === 403, "Standard Admin blocked from registering Admins (403)");

      // =========================================================================
      // 3. DASHBOARD ANALYTICS
      // =========================================================================
      console.log("\n--- TEST GROUP 3: Dashboard Analytics ---");

      let dashRes = await request("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(dashRes.status === 200, "Dashboard returns 200");
      assert(typeof dashRes.data.data.counts?.students === "number", "Dashboard contains counts.students");
      assert(typeof dashRes.data.data.counts?.colleges === "number", "Dashboard contains counts.colleges");
      assert(typeof dashRes.data.data.counts?.recruiters === "number", "Dashboard contains counts.recruiters");

      // =========================================================================
      // 4. USER MANAGEMENT (STUDENTS, COLLEGES, RECRUITERS)
      // =========================================================================
      console.log("\n--- TEST GROUP 4: User Management ---");

      // 4.1 Create test student with rich academic fields
      const testStudent = await Student.create({
        name: "Admin Test Student",
        email: "student1@testadminstudent.com",
        phone: "9876500010",
        branch: "Computer Science",
        semester: 7,
        percentage: 88.0,
        cgpa: 8.8,
        backlogs: 0,
        activeBacklogs: 0,
        graduationYear: 2026,
        status: "Active",
      });

      // 4.2 Query students list
      let stdListRes = await request("/api/admin/students", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(stdListRes.status === 200, "Student directory list returns 200");
      assert(Array.isArray(stdListRes.data.data.students || stdListRes.data.data), "Students list returned as array");

      // 4.3 Get Student Details & verify rich academic fields preserved
      let stdDetailRes = await request(`/api/admin/students/${testStudent._id}`, {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(stdDetailRes.status === 200, "Student details returns 200");
      assert(stdDetailRes.data.data.cgpa === 8.8, "Student cgpa preserved");
      assert(stdDetailRes.data.data.activeBacklogs === 0, "Student activeBacklogs preserved");
      assert(stdDetailRes.data.data.graduationYear === 2026, "Student graduationYear preserved");

      // 4.4 Toggle Student Status
      let toggleRes = await request(`/api/admin/students/${testStudent._id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: { status: "Inactive" },
      });
      assert(toggleRes.status === 200, "Student status toggle returns 200");
      assert(toggleRes.data.data.status === "Inactive", "Student status updated to Inactive");

      // =========================================================================
      // 5. PROJECT MODERATION & STATUS SEPARATION
      // =========================================================================
      console.log("\n--- TEST GROUP 5: Project Moderation ---");

      const testProject = await Project.create({
        title: "Test Drive Moderation Project",
        description: "Full stack engineering internship drive with comprehensive requirements.",
        requiredSkills: ["Node.js", "React"],
        duration: "3 months",
        stipend: 15000,
        location: "Remote",
        openings: 5,
        applicationDeadline: new Date(Date.now() + 86400000 * 30),
        status: "Open",
        approvalStatus: "Pending",
      });

      // 5.1 Approve Project
      let apprvRes = await request(`/api/admin/projects/${testProject._id}/approval`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: { approvalStatus: "Approved" },
      });
      assert(apprvRes.status === 200, "Project approval returns 200");
      assert(apprvRes.data.data.approvalStatus === "Approved", "Project approvalStatus updated to Approved");
      assert(apprvRes.data.data.status === "Open", "Project lifecycle status remains Open");

      // =========================================================================
      // 6. VERIFICATION QUEUE
      // =========================================================================
      console.log("\n--- TEST GROUP 6: Verification Queue ---");

      const pendingCollege = await College.create({
        name: "Pending Tech College",
        email: "pending@testadmincollege.edu",
        phone: "9876500020",
        password: "CollegePassword123!",
        university: "Tech State Univ",
        verificationStatus: "Pending",
      });

      let verifQueueRes = await request("/api/admin/verifications", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(verifQueueRes.status === 200, "Verification queue returns 200");

      // Verify college
      let verifActionRes = await request(`/api/admin/colleges/${pendingCollege._id}/verify`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: {
          verificationStatus: "Verified",
          verificationNote: "Accreditation documents verified successfully.",
        },
      });
      assert(verifActionRes.status === 200, "College verification action returns 200");
      assert(verifActionRes.data.data.verificationStatus === "Verified", "College status set to Verified");

      // =========================================================================
      // 7. PLACEMENT OVERSIGHT (WITH PLACEMENTDRIVE SUPPORT) & BROADCASTS
      // =========================================================================
      console.log("\n--- TEST GROUP 7: Placement Oversight & Broadcasts ---");

      // Create a PlacementDrive fixture to verify MAIN architecture recognition
      await PlacementDrive.create({
        title: "Admin Test Placement Drive 2026",
        college: pendingCollege._id,
        companyName: "Global Tech",
        jobRole: "Software Engineer",
        packageLPA: 12.0,
        driveDate: new Date(Date.now() + 86400000 * 14),
        status: "Upcoming",
        eligibleBranches: ["Computer Science"],
        minCgpa: 7.0,
      });

      let placementRes = await request("/api/admin/placements/overview", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(placementRes.status === 200, "Placement overview returns 200");
      assert(
        placementRes.data.data.summary?.activeDrives !== undefined,
        "Placement summary contains activeDrives count"
      );

      // Create Admin broadcast
      let bcastRes = await request("/api/admin/broadcasts", {
        method: "POST",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: {
          title: "Test Broadcast Announcement",
          message: "Platform maintenance scheduled tonight.",
          targetAudience: "all_students",
          priority: "critical",
        },
      });
      assert(bcastRes.status === 201, "Admin broadcast created with 201");
      const bcastId = bcastRes.data.data._id;

      // Delete broadcast
      let delBcastRes = await request(`/api/admin/broadcasts/${bcastId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(delBcastRes.status === 200, "Admin broadcast deleted with 200");

      // =========================================================================
      // 8. CONTENT HUB & SUPPORT CENTER
      // =========================================================================
      console.log("\n--- TEST GROUP 8: Content Hub & Support Center ---");

      // 8.1 Content Roadmap CRUD
      let roadmapRes = await request("/api/admin/content/roadmaps", {
        method: "POST",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: {
          title: "Test Track: Cloud Native Architecture",
          category: "Tech",
          difficulty: "Advanced",
          description: "Microservices and Kubernetes deep-dive",
          estimatedHours: 40,
          status: "Published",
        },
      });
      assert(roadmapRes.status === 201, "Content roadmap created with 201");
      const roadmapId = roadmapRes.data.data._id;

      let delRoadmapRes = await request(`/api/admin/content/roadmaps/${roadmapId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(delRoadmapRes.status === 200, "Content roadmap deleted with 200");

      // 8.2 Support Ticket CRUD
      let ticketRes = await request("/api/admin/support/tickets", {
        method: "POST",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: {
          subject: "Test Ticket Inquiry",
          requesterName: "Inquirer",
          requesterEmail: "inquiry@testadmin.com",
          requesterRole: "student",
          category: "General",
          priority: "Medium",
          message: "Need assistance with credentials.",
        },
      });
      assert(ticketRes.status === 201, "Support ticket created with 201");
      const ticketId = ticketRes.data.data._id;

      // Add reply
      let replyRes = await request(`/api/admin/support/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: { message: "Support response provided." },
      });
      assert(replyRes.status === 200, "Support ticket reply appended with 200");

      // =========================================================================
      // 9. SYSTEM SETTINGS & ANALYTICS
      // =========================================================================
      console.log("\n--- TEST GROUP 9: System Settings & Analytics ---");

      // 9.1 Regular Admin cannot modify system settings (403)
      let deniedSettingsRes = await request("/api/admin/settings", {
        method: "PUT",
        headers: { Authorization: `Bearer ${standardAdminToken}` },
        body: { platformName: "Hacked Platform Name" },
      });
      assert(deniedSettingsRes.status === 403, "Standard Admin cannot update settings (403)");

      // 9.2 Super Admin can modify system settings
      let allowSettingsRes = await request("/api/admin/settings", {
        method: "PUT",
        headers: { Authorization: `Bearer ${superAdminToken}` },
        body: { platformName: "Campus2Corporate Live Platform" },
      });
      assert(allowSettingsRes.status === 200, "Super Admin updates settings successfully with 200");

      // 9.3 Analytics Overview
      let analyticsRes = await request("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(analyticsRes.status === 200, "Admin analytics returns 200");

      // =========================================================================
      // 10. ACTIVITY LOGGING & AUDIT TRAIL
      // =========================================================================
      console.log("\n--- TEST GROUP 10: Activity Logging & Audit Trail ---");

      let auditRes = await request("/api/admin/activity", {
        headers: { Authorization: `Bearer ${standardAdminToken}` },
      });
      assert(auditRes.status === 200, "Audit activity log returns 200");
      assert(Array.isArray(auditRes.data.data.activities || auditRes.data.data), "Activities returned as array");
    } finally {
      // Clean up all temporary test fixtures
      try {
        await Admin.deleteMany({ email: /@testadmin\.com/ });
        await Student.deleteMany({ email: /@testadminstudent\.com/ });
        await College.deleteMany({ email: /@testadmincollege\.edu/ });
        await Company.deleteMany({ name: /^AdminTestCorp/ });
        await Recruiter.deleteMany({ email: /@testrecruiter\.com/ });
        await Project.deleteMany({ title: /Test Drive/ });
        await PlacementDrive.deleteMany({});
        await Broadcast.deleteMany({ title: /Test Broadcast/ });
        await ContentRoadmap.deleteMany({ title: /Test Track/ });
        await SupportTicket.deleteMany({ requesterEmail: /@testadmin/ });
        await AdminActivity.deleteMany({});
        await mongoose.disconnect();
      } catch {}

      if (server) {
        server.close();
      }
    }
  }

  const stats = getStats();
  console.log(`\n=================================================================`);
  console.log(`=== ADMIN SUITE FINISHED ===`);
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
  runAdminTests().catch((err) => {
    console.error("Admin test runner encountered uncaught error:", err);
    process.exit(1);
  });
}

export default runAdminTests;
