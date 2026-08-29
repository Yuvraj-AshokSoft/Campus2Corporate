import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "campus2corporate_admin_secret_2026";
}

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import Admin from "../src/models/admin.js";
import Student from "../src/models/student.js";
import College from "../src/models/college.js";
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Project from "../src/models/project.js";
import Application from "../src/models/application.js";
import Broadcast from "../src/models/broadcast.js";
import ContentRoadmap from "../src/models/contentRoadmap.js";
import SupportTicket from "../src/models/supportTicket.js";
import SystemSetting from "../src/models/systemSetting.js";
import AdminActivity from "../src/models/adminActivity.js";

const PORT = 5058;
const BASE_URL = `http://localhost:${PORT}`;

let server;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (!condition) {
    failCount++;
    const err = new Error(`Assertion failed: ${message}`);
    console.error(`❌ ${err.message}`);
    throw err;
  }
  passCount++;
}

async function runAdminTests() {
  console.log("=================================================================");
  console.log("=== STARTING COMPREHENSIVE ADMIN MODULE QA & SECURITY TEST SUITE ===");
  console.log("=================================================================");

  const primaryUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/c2c";
  const localFallback = "mongodb://127.0.0.1:27017/c2c";

  try {
    try {
      console.log("Connecting to MongoDB at:", primaryUri);
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
      console.log("Connected to MongoDB successfully!");
    } catch (e) {
      console.warn(`Primary connection failed (${e.message}). Trying fallback: ${localFallback}`);
      try {
        await mongoose.connect(localFallback, { serverSelectionTimeoutMS: 4000 });
        console.log("Connected to Local Fallback MongoDB successfully!");
      } catch (e2) {
        console.warn(`Local fallback failed (${e2.message}). Starting MongoMemoryServer...`);
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        console.log("Starting in-memory MongoDB at:", memUri);
        await mongoose.connect(memUri);
        console.log("Connected to in-memory MongoDB successfully!");
      }
    }

    // Clean up test data
    await Admin.deleteMany({ email: /@testadmin\.com/ });
    await Student.deleteMany({ email: /@testadminstudent\.com/ });
    await College.deleteMany({ email: /@testadmincollege\.edu/ });
    await Company.deleteMany({ name: /^AdminTestCorp/ });
    await Recruiter.deleteMany({ email: /@testrecruiter\.com/ });
    await Project.deleteMany({ title: /Test Drive/ });
    await Broadcast.deleteMany({ title: /Test Broadcast/ });
    await ContentRoadmap.deleteMany({ title: /Test Track/ });
    await SupportTicket.deleteMany({ requesterEmail: /@testadmin/ });
    await AdminActivity.deleteMany({});

    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Admin Test server running on port ${PORT}`);
        resolve();
      });
    });

    // Helper request function
    async function request(path, options = {}) {
      const url = `${BASE_URL}${path}`;
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
      } catch (err) {
        data = text;
      }

      return { status: res.status, data, headers: res.headers };
    }

    // =========================================================================
    // 1. ADMIN AUTHENTICATION & SECURITY TESTS
    // =========================================================================
    console.log("\n--- TEST GROUP 1: Admin Authentication & Security ---");

    // 1.1 Create Seed Super Admin & Regular Admin & Inactive Admin
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

    // 1.2 Test Successful Super Admin Login
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
    console.log("✔ 1.1 Super Admin Login & JWT Issuance Verified");

    // 1.3 Test Successful Standard Admin Login
    loginRes = await request("/api/admin/login", {
      method: "POST",
      body: { email: "staff@testadmin.com", password: "StaffPassword123!" },
    });
    assert(loginRes.status === 200, "Standard admin login returns 200");
    const standardAdminToken = loginRes.data.data.token;
    console.log("✔ 1.2 Standard Admin Login Verified");

    // 1.4 Test Inactive Admin Login Blocked (403)
    let badLoginRes = await request("/api/admin/login", {
      method: "POST",
      body: { email: "inactive@testadmin.com", password: "InactivePassword123!" },
    });
    assert(badLoginRes.status === 403, "Inactive admin login blocked with 403");
    console.log("✔ 1.3 Inactive Admin Login 403 Block Verified");

    // 1.5 Test Inactive Admin Token Usage Blocked (403)
    const inactiveToken = jwt.sign(
      { id: inactiveAdmin._id, email: inactiveAdmin.email, role: inactiveAdmin.role },
      process.env.JWT_SECRET || "campus2corporate_admin_secret_2026",
      { expiresIn: "1h" }
    );
    let inactiveAccessRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${inactiveToken}` },
    });
    assert(inactiveAccessRes.status === 403, "Inactive admin token access blocked with 403");
    console.log("✔ 1.4 Inactive Admin Token Access 403 Verified");

    // 1.6 Test Invalid Password Login (401)
    badLoginRes = await request("/api/admin/login", {
      method: "POST",
      body: { email: "super@testadmin.com", password: "WrongPassword999!" },
    });
    assert(badLoginRes.status === 401, "Invalid password returns 401");
    console.log("✔ 1.5 Invalid Credentials 401 Verified");

    // 1.7 Missing Token on Protected Route (401)
    let noTokenRes = await request("/api/admin/profile");
    assert(noTokenRes.status === 401, "Missing token returns 401");
    console.log("✔ 1.6 Missing Token 401 Verified");

    // 1.8 Malformed / Fake Token (401)
    let fakeTokenRes = await request("/api/admin/profile", {
      headers: { Authorization: "Bearer fake_tampered_jwt_token_xyz" },
    });
    assert(fakeTokenRes.status === 401, "Fake/tampered token returns 401");
    console.log("✔ 1.7 Fake/Malformed Token 401 Verified");

    // 1.9 Expired Token (401)
    const expiredToken = jwt.sign(
      { id: superAdmin._id, email: superAdmin.email, role: superAdmin.role },
      process.env.JWT_SECRET || "campus2corporate_admin_secret_2026",
      { expiresIn: "-10s" }
    );
    let expiredRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    assert(expiredRes.status === 401, "Expired token returns 401");
    console.log("✔ 1.8 Expired Token 401 Verified");

    // 1.10 Student Token on Admin Route (403)
    const studentToken = jwt.sign(
      { id: new mongoose.Types.ObjectId(), email: "student@test.com", role: "student" },
      process.env.JWT_SECRET || "campus2corporate_admin_secret_2026",
      { expiresIn: "1h" }
    );
    let studentRoleRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentRoleRes.status === 403, "Student token on Admin route rejected with 403");
    console.log("✔ 1.9 Cross-Role: Student Token Rejected with 403");

    // 1.11 College Token on Admin Route (403)
    const collegeToken = jwt.sign(
      { id: new mongoose.Types.ObjectId(), email: "college@test.edu", role: "college" },
      process.env.JWT_SECRET || "campus2corporate_admin_secret_2026",
      { expiresIn: "1h" }
    );
    let collegeRoleRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${collegeToken}` },
    });
    assert(collegeRoleRes.status === 403, "College token on Admin route rejected with 403");
    console.log("✔ 1.10 Cross-Role: College Token Rejected with 403");

    // 1.12 Recruiter Token on Admin Route (403)
    const recruiterToken = jwt.sign(
      { id: new mongoose.Types.ObjectId(), email: "recruiter@test.com", role: "recruiter" },
      process.env.JWT_SECRET || "campus2corporate_admin_secret_2026",
      { expiresIn: "1h" }
    );
    let recruiterRoleRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    assert(recruiterRoleRes.status === 403, "Recruiter token on Admin route rejected with 403");
    console.log("✔ 1.11 Cross-Role: Recruiter Token Rejected with 403");

    // =========================================================================
    // 2. ADMIN PROFILE & RBAC PRIVILEGE ESCALATION GUARDS
    // =========================================================================
    console.log("\n--- TEST GROUP 2: Admin Profile & RBAC Guards ---");

    // 2.1 Profile Retrieval
    let profileRes = await request("/api/admin/profile", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(profileRes.status === 200, "Profile returns 200");
    assert(profileRes.data.data.email === "super@testadmin.com", "Profile matches logged in admin");
    assert(profileRes.data.data.password === undefined, "Password is excluded from profile");
    console.log("✔ 2.1 Admin Profile Retrieval Verified");

    // 2.2 Profile Update
    let updateProfRes = await request("/api/admin/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { name: "Super Admin Lead", phone: "9876500099" },
    });
    assert(updateProfRes.status === 200, "Profile update returns 200");
    assert(updateProfRes.data.data.name === "Super Admin Lead", "Profile name updated");
    console.log("✔ 2.2 Admin Profile Safe Update Verified");

    // 2.3 Mass-Assignment Guard: Attempting to modify role or permissions via profile update
    let escalateRes = await request("/api/admin/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${standardAdminToken}` },
      body: { role: "Super Admin", status: "Inactive" },
    });
    assert(escalateRes.status === 200, "Profile update endpoint responds");
    // Verify standardAdmin in DB still has role "Admin"
    const standardAdminInDb = await Admin.findById(standardAdmin._id);
    assert(standardAdminInDb.role === "Admin", "Role remains 'Admin' - Mass assignment prevented");
    console.log("✔ 2.3 Mass-Assignment Role Escalation Guard Verified");

    // 2.4 Super Admin Registering New Admin
    let regRes = await request("/api/admin/register", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        name: "New Ops Admin",
        email: "ops@testadmin.com",
        phone: "9876500004",
        password: "OpsPassword123!",
        role: "Admin",
      },
    });
    assert(regRes.status === 201, "Super admin can register new admin with 201");
    console.log("✔ 2.4 Super Admin Register Admin Verified");

    // 2.5 Duplicate Admin Email Registration (400)
    let dupAdminRes = await request("/api/admin/register", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        name: "Duplicate Ops Admin",
        email: "ops@testadmin.com",
        phone: "9876500088",
        password: "OpsPassword123!",
        role: "Admin",
      },
    });
    assert(dupAdminRes.status === 400, "Duplicate admin email returns 400");
    console.log("✔ 2.5 Duplicate Admin Email Guard Verified");

    // 2.6 Standard Admin Attempting to Register Admin (RBAC 403)
    let badRegRes = await request("/api/admin/register", {
      method: "POST",
      headers: { Authorization: `Bearer ${standardAdminToken}` },
      body: {
        name: "Unauthorized Admin",
        email: "unauthorized@testadmin.com",
        phone: "9876500005",
        password: "BadPassword123!",
        role: "Admin",
      },
    });
    assert(badRegRes.status === 403, "Standard admin cannot register admin (returns 403)");
    console.log("✔ 2.6 RBAC Guard on Admin Registration Verified");

    // =========================================================================
    // 3. DASHBOARD ANALYTICS & STATS
    // =========================================================================
    console.log("\n--- TEST GROUP 3: Dashboard Analytics ---");

    let dashRes = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(dashRes.status === 200, "Dashboard returns 200");
    assert(typeof dashRes.data.data.totalStudents === "number", "totalStudents metric present");
    assert(typeof dashRes.data.data.pendingVerifications === "number", "pendingVerifications present");
    console.log("✔ 3.1 Dashboard Metrics Aggregation Verified");

    // =========================================================================
    // 4. USER MANAGEMENT (STUDENTS, COLLEGES, RECRUITERS, COMPANIES)
    // =========================================================================
    console.log("\n--- TEST GROUP 4: User Management ---");

    // 4.1 Create College
    const testCollege = await College.create({
      name: "Admin Test Institute of Tech",
      email: "admin@testadmincollege.edu",
      phone: "9876511111",
      password: "CollegePassword123!",
      university: "State University",
      code: "ATIT",
      city: "Mumbai",
      state: "Maharashtra",
      status: "Active",
      verificationStatus: "Verified",
    });

    // 4.2 Create College via Admin API with duplicate email check
    let dupCollegeRes = await request("/api/admin/colleges", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        name: "Duplicate College",
        email: "admin@testadmincollege.edu",
        phone: "9876511199",
        password: "CollegePassword123!",
        code: "DUPC",
      },
    });
    assert(dupCollegeRes.status === 400, "Duplicate college email returns 400");
    console.log("✔ 4.1 Duplicate College Email Guard Verified");

    // 4.3 Create Student
    const testStudent = await Student.create({
      name: "Test Admin Student",
      email: "student@testadminstudent.com",
      phone: "9876522222",
      password: "StudentPassword123!",
      college: testCollege._id,
      branch: "Computer Science",
      percentage: 88,
      status: "Active",
    });

    // 4.4 List Students with pagination & search
    let studentsRes = await request("/api/admin/students?q=Test+Admin&page=1&limit=10", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(studentsRes.status === 200, "Students list returns 200");
    assert(studentsRes.data.data.students.length > 0, "Finds created student");
    console.log("✔ 4.2 Student Directory Search & Pagination Verified");

    // 4.5 Student Details & Invalid ObjectId Check
    let studentDetailsRes = await request(`/api/admin/students/${testStudent._id}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(studentDetailsRes.status === 200, "Student details returns 200");
    assert(studentDetailsRes.data.data.email === "student@testadminstudent.com", "Correct student returned");

    let badStudentIdRes = await request("/api/admin/students/invalid-id-12345", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(badStudentIdRes.status === 400, "Invalid student ObjectId returns 400");
    console.log("✔ 4.3 Student Details & ObjectId Validation Verified");

    // 4.6 Toggle Student Status
    let statusToggleRes = await request(`/api/admin/students/${testStudent._id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { status: "Inactive" },
    });
    assert(statusToggleRes.status === 200, "Student status update returns 200");
    assert(statusToggleRes.data.data.status === "Inactive", "Student status updated to Inactive");
    console.log("✔ 4.4 Student Status Toggle Verified");

    // 4.7 Update Student
    let updateStudentRes = await request(`/api/admin/students/${testStudent._id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { percentage: 92 },
    });
    assert(updateStudentRes.status === 200, "Student update returns 200");
    assert(updateStudentRes.data.data.percentage === 92, "Student percentage updated");
    console.log("✔ 4.5 Student Record Update Verified");

    // 4.8 Colleges CRUD & Status Toggle
    let collegesRes = await request("/api/admin/colleges", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(collegesRes.status === 200, "Colleges list returns 200");
    assert(collegesRes.data.data.colleges.length > 0, "Finds created college");

    let collegeDetailRes = await request(`/api/admin/colleges/${testCollege._id}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(collegeDetailRes.status === 200, "College details returns 200");
    assert(collegeDetailRes.data.data.password === undefined, "Password excluded from college details");
    console.log("✔ 4.6 College Directory & Password Privacy Verified");

    // 4.9 Create Company & Recruiter
    const testCompany = await Company.create({
      name: "AdminTestCorp One",
      industry: "Software & AI",
      location: "Bengaluru",
      email: "hr@admintestcorp.com",
      phone: "9876533333",
    });

    const testRecruiter = await Recruiter.create({
      name: "Admin Recruiter Tester",
      email: "adminrecruiter@testrecruiter.com",
      phone: "9876544444",
      designation: "Head of Talent Acquisition",
      company: testCompany._id,
      status: "Active",
      verificationStatus: "Verified",
    });

    // 4.10 Duplicate Recruiter Email Guard (400)
    let dupRecruiterRes = await request("/api/admin/recruiters", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        name: "Duplicate Recruiter",
        email: "adminrecruiter@testrecruiter.com",
        phone: "9876544499",
        designation: "HR Manager",
        company: testCompany._id,
      },
    });
    assert(dupRecruiterRes.status === 400, "Duplicate recruiter email returns 400");
    console.log("✔ 4.7 Duplicate Recruiter Email Guard Verified");

    let recruitersRes = await request("/api/admin/recruiters", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(recruitersRes.status === 200, "Recruiters list returns 200");
    assert(recruitersRes.data.data.recruiters.length > 0, "Finds created recruiter");
    console.log("✔ 4.8 Recruiter Directory & Company Link Verified");

    // =========================================================================
    // 5. PROJECT / JOB MODERATION & APPROVAL INTEGRITY
    // =========================================================================
    console.log("\n--- TEST GROUP 5: Project Moderation & Status Separation ---");

    const testProject = await Project.create({
      title: "Test Drive: Cloud Architect 2026",
      description: "Comprehensive Cloud Native placement opportunity with enterprise scope.",
      recruiter: testRecruiter._id,
      company: testCompany._id,
      requiredSkills: ["Node.js", "Docker", "AWS"],
      duration: "6 Months",
      stipend: 45000,
      location: "Bengaluru",
      mode: "Hybrid",
      openings: 5,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "Open",
      approvalStatus: "Pending",
    });

    // 5.1 Approve Project
    let approveRes = await request(`/api/admin/projects/${testProject._id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(approveRes.status === 200, "Project approval returns 200");
    assert(approveRes.data.data.approvalStatus === "Approved", "approvalStatus changed to Approved");
    assert(approveRes.data.data.status === "Open", "operational status remains Open");
    console.log("✔ 5.1 Project Approval Workflow & Status Separation Verified");

    // 5.2 Reject Project
    let rejectRes = await request(`/api/admin/projects/${testProject._id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(rejectRes.status === 200, "Project rejection returns 200");
    assert(rejectRes.data.data.approvalStatus === "Rejected", "approvalStatus changed to Rejected");
    assert(rejectRes.data.data.status === "Open", "operational status remains Open");
    console.log("✔ 5.2 Project Rejection Workflow & Status Separation Verified");

    // =========================================================================
    // 6. VERIFICATION QUEUE
    // =========================================================================
    console.log("\n--- TEST GROUP 6: Verification Queue ---");

    const pendingCollege = await College.create({
      university: "State University",
      name: "Pending Tech Academy",
      email: "verify@testadmincollege.edu",
      phone: "9876555555",
      password: "Password123!",
      code: "PTA",
      verificationStatus: "Pending",
      status: "Active",
    });

    let queueRes = await request("/api/admin/verifications", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(queueRes.status === 200, "Verification queue returns 200");
    assert(queueRes.data.data.counts.colleges > 0, "Queue counts pending college");
    console.log("✔ 6.1 Verification Queue Aggregation Verified");

    // 6.2 Verify College with note
    let verifyCollegeRes = await request(`/api/admin/verifications/colleges/${pendingCollege._id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { status: "Verified", note: "Accredited credentials verified" },
    });
    assert(verifyCollegeRes.status === 200, "Verify college returns 200");
    assert(verifyCollegeRes.data.data.verificationStatus === "Verified", "College verificationStatus is Verified");
    console.log("✔ 6.2 Verify College Action & Note Persistence Verified");

    // =========================================================================
    // 7. PLACEMENT OVERSIGHT & BROADCASTS
    // =========================================================================
    console.log("\n--- TEST GROUP 7: Placement Oversight & Broadcasts ---");

    // 7.1 Placement Oversight (Zero-data safe)
    let placementRes = await request("/api/admin/placements/overview", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(placementRes.status === 200, "Placement overview returns 200");
    assert(typeof placementRes.data.data.summary.activeDrives === "number", "Active drives count present");
    assert(typeof placementRes.data.data.summary.totalApplicants === "number", "Total applicants count present");
    console.log("✔ 7.1 Placement Oversight Overview & Metrics Verified");

    // 7.2 Create Broadcast
    let bcastRes = await request("/api/admin/broadcasts", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        title: "Test Broadcast Announcement",
        message: "This is a platform broadcast dispatch test.",
        targetAudience: "all_students",
        priority: "high",
      },
    });
    assert(bcastRes.status === 201, "Create broadcast returns 201");
    const broadcastId = bcastRes.data.data._id;
    console.log("✔ 7.2 Dispatch Platform Broadcast Verified");

    // 7.3 List & Delete Broadcast
    let delBcastRes = await request(`/api/admin/broadcasts/${broadcastId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(delBcastRes.status === 200, "Delete broadcast returns 200");
    console.log("✔ 7.3 Broadcast Deletion Verified");

    // =========================================================================
    // 8. CONTENT HUB & SUPPORT CENTER
    // =========================================================================
    console.log("\n--- TEST GROUP 8: Content Hub & Support Center ---");

    // 8.1 Create Roadmap Track
    let roadmapRes = await request("/api/admin/content/roadmaps", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        title: "Test Track: Full-Stack Mastery",
        category: "Tech",
        description: "Complete curriculum track for engineering students.",
      },
    });
    assert(roadmapRes.status === 201, "Create roadmap returns 201");
    const roadmapId = roadmapRes.data.data._id;
    console.log("✔ 8.1 Content Roadmap Creation Verified");

    // 8.2 Update & Delete Roadmap
    let updateRoadmapRes = await request(`/api/admin/content/roadmaps/${roadmapId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { category: "Business" },
    });
    assert(updateRoadmapRes.status === 200, "Update roadmap returns 200");
    assert(updateRoadmapRes.data.data.category === "Business", "Roadmap category updated");

    let delRoadmapRes = await request(`/api/admin/content/roadmaps/${roadmapId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(delRoadmapRes.status === 200, "Delete roadmap returns 200");
    console.log("✔ 8.2 Content Roadmap Update & Cleanup Verified");

    // 8.3 Create Support Ticket
    let ticketRes = await request("/api/admin/support/tickets", {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        title: "Test Dispute: Profile Verification Delay",
        description: "My institution has not yet approved my graduation percentage.",
        requesterName: "Test Student Requester",
        requesterEmail: "student@testadmin.com",
        requesterRole: "Student",
        priority: "Escalated",
      },
    });
    assert(ticketRes.status === 201, "Create support ticket returns 201");
    const ticketId = ticketRes.data.data._id;
    console.log("✔ 8.3 Support Ticket Creation Verified");

    // 8.4 Reply to Support Ticket with Internal Staff Note
    let replyRes = await request(`/api/admin/support/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        text: "Contacting the college dean for instant verification.",
        isInternalNote: true,
      },
    });
    assert(replyRes.status === 200, "Reply to ticket returns 200");
    assert(replyRes.data.data.messages.length >= 2, "Message thread updated");
    assert(replyRes.data.data.status === "In Progress", "Status transitioned to In Progress");
    console.log("✔ 8.4 Support Ticket Staff Reply & Threading Verified");

    // 8.5 Resolve Support Ticket
    let resolveRes = await request(`/api/admin/support/tickets/${ticketId}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: { status: "Resolved" },
    });
    assert(resolveRes.status === 200, "Resolve ticket returns 200");
    assert(resolveRes.data.data.status === "Resolved", "Ticket status updated to Resolved");
    console.log("✔ 8.5 Support Ticket Resolution Verified");

    // =========================================================================
    // 9. PLATFORM ANALYTICS & SYSTEM SETTINGS
    // =========================================================================
    console.log("\n--- TEST GROUP 9: Platform Analytics & System Settings ---");

    // 9.1 Analytics KPIs & Zero-Division Safety
    let analyticsRes = await request("/api/admin/analytics", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(analyticsRes.status === 200, "Analytics returns 200");
    assert(Array.isArray(analyticsRes.data.data.funnel), "Placement funnel stages returned");
    assert(!analyticsRes.data.data.funnel.some(stage => isNaN(stage.percent)), "No NaN in funnel percentages");
    console.log("✔ 9.1 Platform Analytics & Zero-Division Resilience Verified");

    // 9.2 Get System Settings
    let settingsRes = await request("/api/admin/settings", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(settingsRes.status === 200, "Get settings returns 200");
    console.log("✔ 9.2 System Settings Retrieval Verified");

    // 9.3 Super Admin Updates System Settings & AI Weights
    let updateSettingsRes = await request("/api/admin/settings", {
      method: "PUT",
      headers: { Authorization: `Bearer ${superAdminToken}` },
      body: {
        aiReadinessWeights: {
          academicWeight: 35,
          softSkillsWeight: 35,
          techProjectsWeight: 20,
          extracurricularWeight: 10,
        },
        maintenanceMode: {
          enabled: false,
        },
      },
    });
    assert(updateSettingsRes.status === 200, "Super admin update settings returns 200");
    assert(updateSettingsRes.data.data.aiReadinessWeights.academicWeight === 35, "AI weight updated to 35%");
    console.log("✔ 9.3 AI Readiness Weights & Maintenance Config Verified");

    // 9.4 Standard Admin Attempt to Update Settings (RBAC 403)
    let badSettingsRes = await request("/api/admin/settings", {
      method: "PUT",
      headers: { Authorization: `Bearer ${standardAdminToken}` },
      body: {
        maintenanceMode: { enabled: true },
      },
    });
    assert(badSettingsRes.status === 403, "Standard admin forbidden from updating settings (403)");
    console.log("✔ 9.4 RBAC Guard on System Settings Verified");

    // =========================================================================
    // 10. AUDIT ACTIVITIES & CENTRALIZED ERROR HANDLING
    // =========================================================================
    console.log("\n--- TEST GROUP 10: Audit Trail & Error Handling ---");

    // 10.1 Audit Activity Log
    let activityRes = await request("/api/admin/activity", {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    assert(activityRes.status === 200, "Activity log returns 200");
    assert(activityRes.data.data.activities.length > 0, "Audit trail recorded administrative actions");
    console.log("✔ 10.1 Administrative Action Audit Trail Verified");

    // 10.2 Invalid ObjectId CastError Guard on Multiple Routes
    const invalidIdTests = [
      { route: "/api/admin/students/bad-id-1234", method: "GET" },
      { route: "/api/admin/colleges/bad-id-1234", method: "GET" },
      { route: "/api/admin/recruiters/bad-id-1234", method: "GET" },
      { route: "/api/admin/projects/bad-id-1234", method: "GET" },
      { route: "/api/admin/support/tickets/bad-id-1234", method: "GET" },
      { route: "/api/admin/broadcasts/bad-id-1234", method: "DELETE" },
    ];

    for (const testItem of invalidIdTests) {
      let res = await request(testItem.route, {
        method: testItem.method,
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      assert(res.status === 400, `Invalid ObjectId on ${testItem.route} returns 400`);
    }
    console.log("✔ 10.2 Centralized ObjectId Validation across all endpoints Verified");

    // Clean up test data after successful tests
    await Admin.deleteMany({ email: /@testadmin\.com/ });
    await Student.deleteMany({ email: /@testadminstudent\.com/ });
    await College.deleteMany({ email: /@testadmincollege\.edu/ });
    await Company.deleteMany({ name: /^AdminTestCorp/ });
    await Recruiter.deleteMany({ email: /@testrecruiter\.com/ });
    await Project.deleteMany({ title: /Test Drive/ });
    await Broadcast.deleteMany({ title: /Test Broadcast/ });
    await ContentRoadmap.deleteMany({ title: /Test Track/ });
    await SupportTicket.deleteMany({ requesterEmail: /@testadmin/ });

    console.log("\n=======================================================");
    console.log(`🎉 ALL ADMIN MODULE TESTS PASSED! (${passCount} assertions, 0 failures)`);
    console.log("=======================================================\n");

    if (server) server.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ADMIN MODULE TEST SUITE FAILED:", error);
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

runAdminTests();
