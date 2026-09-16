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
import generateToken from "../src/utils/generateToken.js";

import {
  resolveTestDbUri,
  verifyTestDbSafety,
  printSafetyReport,
  createTestTracker,
} from "./test-helper.js";

const { assert, recordSkip, getStats, setDefaultCategory } =
  createTestTracker("Admin Dashboard E2E & Security Suite");

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

async function runAdminE2ETests() {
  console.log("=================================================================");
  console.log("=== STARTING COMPREHENSIVE ADMIN MODULE E2E & SECURITY SUITE ===");
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

  // 1. Setup Test Fixtures: Super Admin, Standard Admin, College, Student, Recruiter
  console.log("--- SETUP: Provisioning Isolated Test Users & Platform Fixtures ---");
  await Admin.deleteMany({ $or: [{ email: /@admine2etest\.com/ }, { phone: /^98765439/ }] });
  await Student.deleteMany({ email: /@admine2estudent\.edu/ });
  await College.deleteMany({ $or: [{ email: /@admine2ecollege\.edu/ }, { phone: /^98765438/ }] });
  await Company.deleteMany({ $or: [{ name: /^AdminE2E / }, { email: /admine2e/ }] });
  await Recruiter.deleteMany({ email: /@admine2erecruiter\.com/ });
  await Project.deleteMany({ title: /^AdminE2E / });
  await PlacementDrive.deleteMany({ companyName: /^AdminE2E / });
  await Broadcast.deleteMany({ title: /^AdminE2E / });
  await ContentRoadmap.deleteMany({ title: /^AdminE2E / });
  await SupportTicket.deleteMany({ requesterEmail: /@admine2e/ });
  await AdminActivity.deleteMany({});

  // Super Admin
  const superAdmin = await Admin.create({
    name: "Platform Super Admin",
    email: "superadmin@admine2etest.com",
    phone: "9876543901",
    password: "SuperPassword123!",
    role: "Super Admin",
    status: "Active",
  });
  const superAdminToken = generateToken(superAdmin, "Super Admin");

  // Standard Admin
  const standardAdmin = await Admin.create({
    name: "Operations Admin",
    email: "opsadmin@admine2etest.com",
    phone: "9876543902",
    password: "AdminPassword123!",
    role: "Admin",
    status: "Active",
  });
  const standardAdminToken = generateToken(standardAdmin, "Admin");

  // Inactive Admin
  const inactiveAdmin = await Admin.create({
    name: "Deactivated Admin",
    email: "inactive@admine2etest.com",
    phone: "9876543903",
    password: "AdminPassword123!",
    role: "Admin",
    status: "Inactive",
  });
  const inactiveAdminToken = generateToken(inactiveAdmin, "Admin");

  // College User
  const testCollege = await College.create({
    name: "AdminE2E Apex University",
    email: "principal@admine2ecollege.edu",
    phone: "9876543888",
    password: "Password123!",
    address: "Bangalore Campus",
    website: "https://apexcampus.edu",
    university: "Apex Technical University",
    status: "Active",
    verificationStatus: "Pending",
  });
  const collegeToken = generateToken(testCollege, "college");

  // Student User
  const testStudent = await Student.create({
    name: "Samantha Student",
    email: "samantha@admine2estudent.edu",
    password: "Password123!",
    college: testCollege._id,
    branch: "Computer Science",
    percentage: 88,
    cgpa: 8.8,
    backlogs: 0,
    activeBacklogs: 0,
    passingYear: 2026,
    graduationYear: 2026,
    rollNumber: "ADM-CS-001",
    status: "Active",
  });
  const studentToken = generateToken(testStudent, "student");

  // Company & Recruiter
  const testCompany = await Company.create({
    name: "AdminE2E Cloud Corp",
    email: "contact@admine2ecloudcorp.com",
    industry: "Cloud & AI",
    location: "Hyderabad",
    website: "https://cloudcorp.test",
    description: "Enterprise AI Infrastructure",
  });

  const testRecruiter = await Recruiter.create({
    name: "Robert Recruiter",
    email: "robert@admine2erecruiter.com",
    phone: "9988776655",
    company: testCompany._id,
    designation: "Head of Campus Talent",
    status: "Active",
    verificationStatus: "Pending",
  });
  const recruiterToken = generateToken(testRecruiter, "recruiter");

  // Project Pending Moderation
  const testProject = await Project.create({
    company: testCompany._id,
    title: "AdminE2E Fullstack React App",
    description: "Student portfolio project pending approval",
    category: "Web Development",
    requiredSkills: ["React", "TypeScript", "Tailwind"],
    duration: "3 months",
    stipend: 15000,
    openings: 2,
    location: "Remote",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdBy: testStudent._id,
    approvalStatus: "Pending",
    status: "Open",
  });

  // Placement Drive
  const testDrive = await PlacementDrive.create({
    college: testCollege._id,
    company: testCompany._id,
    companyName: "AdminE2E Cloud Corp",
    jobRole: "Graduate Cloud Engineer",
    packageLPA: "18.0 LPA",
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    mode: "Virtual",
    eligibleBranches: ["Computer Science", "Information Technology"],
    eligibilityCriteria: "CGPA > 8.0",
    capacityLimit: 100,
    status: "Upcoming",
    location: "Virtual",
  });

  // Start HTTP Server on ephemeral port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Admin E2E test server running on ephemeral port ${port}\n`);
      resolve();
    });
  });

  const superAuthHeader = { Authorization: `Bearer ${superAdminToken}` };
  const adminAuthHeader = { Authorization: `Bearer ${standardAdminToken}` };
  const collegeAuthHeader = { Authorization: `Bearer ${collegeToken}` };
  const studentAuthHeader = { Authorization: `Bearer ${studentToken}` };
  const recruiterAuthHeader = { Authorization: `Bearer ${recruiterToken}` };

  setDefaultCategory("http");

  // =========================================================================
  // Phase 1.1: Authentication, Strict RBAC & Privilege Escalation Guards
  // =========================================================================
  console.log("--- PHASE 1.1: Authentication & Strict RBAC Guards ---");
  {
    // Unauthenticated requests
    const resNoToken = await request("/api/admin/dashboard");
    assert(resNoToken.status === 401, "GET /api/admin/dashboard without token returns 401 Unauthorized");

    const resProfileNoToken = await request("/api/admin/profile");
    assert(resProfileNoToken.status === 401, "GET /api/admin/profile without token returns 401 Unauthorized");

    const resFakeToken = await request("/api/admin/dashboard", {
      headers: { Authorization: "Bearer fake.tampered.token" },
    });
    assert(resFakeToken.status === 401, "GET /api/admin/dashboard with fake token returns 401 Unauthorized");

    // Inactive Admin Token Access
    const resInactive = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${inactiveAdminToken}` },
    });
    assert(resInactive.status === 403, "Inactive Admin token rejected with 403 Forbidden");

    // Privilege Escalation Guard: College JWT accessing Admin routes
    const resCollegeAttack = await request("/api/admin/dashboard", { headers: collegeAuthHeader });
    assert(resCollegeAttack.status === 403, "PRIVILEGE ESCALATION GUARD: College token on /api/admin/dashboard rejected with 403 Forbidden");

    const resCollegeQueueAttack = await request("/api/admin/verifications", { headers: collegeAuthHeader });
    assert(resCollegeQueueAttack.status === 403, "PRIVILEGE ESCALATION GUARD: College token on /api/admin/verifications rejected with 403 Forbidden");

    // Privilege Escalation Guard: Student JWT accessing Admin routes
    const resStudentAttack = await request("/api/admin/dashboard", { headers: studentAuthHeader });
    assert(resStudentAttack.status === 403, "PRIVILEGE ESCALATION GUARD: Student token on /api/admin/dashboard rejected with 403 Forbidden");

    // Privilege Escalation Guard: Recruiter JWT accessing Admin routes
    const resRecruiterAttack = await request("/api/admin/dashboard", { headers: recruiterAuthHeader });
    assert(resRecruiterAttack.status === 403, "PRIVILEGE ESCALATION GUARD: Recruiter token on /api/admin/dashboard rejected with 403 Forbidden");

    // Invalid ObjectId validations
    const resInvalidStudentId = await request("/api/admin/students/invalid-mongo-id", { headers: superAuthHeader });
    assert(resInvalidStudentId.status === 400, "Invalid ObjectId on /api/admin/students/:id returns 400 Bad Request");

    const resInvalidCollegeId = await request("/api/admin/colleges/invalid-mongo-id", { headers: superAuthHeader });
    assert(resInvalidCollegeId.status === 400, "Invalid ObjectId on /api/admin/colleges/:id returns 400 Bad Request");

    const resInvalidProjectId = await request("/api/admin/projects/invalid-mongo-id/approve", {
      method: "PATCH",
      headers: superAuthHeader,
    });
    assert(resInvalidProjectId.status === 400, "Invalid ObjectId on /api/admin/projects/:id/approve returns 400 Bad Request");

    const resInvalidBroadcastId = await request("/api/admin/broadcasts/invalid-mongo-id", {
      method: "DELETE",
      headers: superAuthHeader,
    });
    assert(resInvalidBroadcastId.status === 400, "Invalid ObjectId on /api/admin/broadcasts/:id returns 400 Bad Request");
  }

  // =========================================================================
  // Phase 1.2: Admin Overview & Global Platform Metrics
  // =========================================================================
  console.log("\n--- PHASE 1.2: Admin Overview & Global Platform Metrics ---");
  {
    const resDashboard = await request("/api/admin/dashboard", { headers: superAuthHeader });
    assert(resDashboard.status === 200, "GET /api/admin/dashboard returns 200 OK");
    assert(resDashboard.data.success === true, "Dashboard returns standard success: true envelope");
    assert(resDashboard.data.data !== undefined, "Dashboard contains payload in 'data' field");
    const counts = resDashboard.data.data.counts;
    assert(typeof counts.students === "number", "Global platform counts.students is numeric");
    assert(typeof counts.colleges === "number", "Global platform counts.colleges is numeric");
    assert(typeof counts.recruiters === "number", "Global platform counts.recruiters is numeric");
    assert(typeof counts.drives === "number", "Global platform counts.drives is numeric");
    assert(typeof counts.applications === "number", "Global platform counts.applications is numeric");

    // Profile verification
    const resProfile = await request("/api/admin/profile", { headers: superAuthHeader });
    assert(resProfile.status === 200, "GET /api/admin/profile returns 200 OK");
    assert(resProfile.data.data.email === "superadmin@admine2etest.com", "Admin profile email matches");
    assert(resProfile.data.data.password === undefined, "Admin profile strictly excludes password hash");
  }

  // =========================================================================
  // Phase 1.3: User Management & Verification Queues
  // =========================================================================
  console.log("\n--- PHASE 1.3: User Management & Verification Queues ---");
  {
    // Verification Queue
    const resQueue = await request("/api/admin/verifications", { headers: superAuthHeader });
    assert(resQueue.status === 200, "GET /api/admin/verifications returns 200 OK");
    assert(Array.isArray(resQueue.data.data.colleges), "Verification queue contains colleges array");
    assert(Array.isArray(resQueue.data.data.recruiters), "Verification queue contains recruiters array");
    assert(Array.isArray(resQueue.data.data.projects), "Verification queue contains projects array");

    // Approve College
    const resVerifyCollege = await request(`/api/admin/colleges/${testCollege._id}/verify`, {
      method: "PATCH",
      headers: superAuthHeader,
      body: { status: "Verified", note: "Approved in E2E test" },
    });
    assert(resVerifyCollege.status === 200, "PATCH /api/admin/colleges/:id/verify returns 200 OK");
    assert(resVerifyCollege.data.data.verificationStatus === "Verified", "College verificationStatus updated to 'Verified'");

    // Approve Recruiter
    const resVerifyRecruiter = await request(`/api/admin/recruiters/${testRecruiter._id}/verify`, {
      method: "PATCH",
      headers: superAuthHeader,
      body: { status: "Verified", note: "Approved in E2E test" },
    });
    assert(resVerifyRecruiter.status === 200, "PATCH /api/admin/recruiters/:id/verify returns 200 OK");
    assert(resVerifyRecruiter.data.data.verificationStatus === "Verified", "Recruiter verificationStatus updated to 'Verified'");

    // Approve Project
    const resApproveProject = await request(`/api/admin/projects/${testProject._id}/approve`, {
      method: "PATCH",
      headers: superAuthHeader,
    });
    assert(resApproveProject.status === 200, "PATCH /api/admin/projects/:id/approve returns 200 OK");
    assert(resApproveProject.data.data.approvalStatus === "Approved", "Project approvalStatus updated to 'Approved'");

    // Suspend / Toggle Student Status
    const resStudentStatus = await request(`/api/admin/students/${testStudent._id}/status`, {
      method: "PATCH",
      headers: superAuthHeader,
      body: { status: "Inactive" },
    });
    assert(resStudentStatus.status === 200, "PATCH /api/admin/students/:id/status returns 200 OK");
    assert(resStudentStatus.data.data.status === "Inactive", "Student status updated to 'Inactive'");

    // Password Hash Exclusion Check across all directory endpoints
    const resStudentsList = await request("/api/admin/students", { headers: superAuthHeader });
    assert(resStudentsList.status === 200, "GET /api/admin/students returns 200 OK");
    const studentsArray = resStudentsList.data.data.students || resStudentsList.data.data;
    assert(Array.isArray(studentsArray), "Students directory returned as array");
    const anyStudentPassword = studentsArray.some((s) => s.password !== undefined);
    assert(!anyStudentPassword, "SECURITY GUARD: Password hashes excluded from GET /api/admin/students");

    const resCollegesList = await request("/api/admin/colleges", { headers: superAuthHeader });
    assert(resCollegesList.status === 200, "GET /api/admin/colleges returns 200 OK");
    const collegesArray = resCollegesList.data.data.colleges || resCollegesList.data.data;
    assert(Array.isArray(collegesArray), "Colleges directory returned as array");
    const anyCollegePassword = collegesArray.some((c) => c.password !== undefined);
    assert(!anyCollegePassword, "SECURITY GUARD: Password hashes excluded from GET /api/admin/colleges");

    const resRecruitersList = await request("/api/admin/recruiters", { headers: superAuthHeader });
    assert(resRecruitersList.status === 200, "GET /api/admin/recruiters returns 200 OK");
    const recruitersArray = resRecruitersList.data.data.recruiters || resRecruitersList.data.data;
    assert(Array.isArray(recruitersArray), "Recruiters directory returned as array");
    const anyRecruiterPassword = recruitersArray.some((r) => r.password !== undefined);
    assert(!anyRecruiterPassword, "SECURITY GUARD: Password hashes excluded from GET /api/admin/recruiters");
  }

  // =========================================================================
  // Phase 1.4: Placement Oversight
  // =========================================================================
  console.log("\n--- PHASE 1.4: Placement Oversight & Global Drives ---");
  {
    const resPlacements = await request("/api/admin/placements/overview", { headers: superAuthHeader });
    assert(resPlacements.status === 200, "GET /api/admin/placements/overview returns 200 OK");
    assert(resPlacements.data.success === true, "Standard JSON response success flag is true");
    assert(typeof resPlacements.data.message === "string", "Standard JSON response contains descriptive message");
    assert(Array.isArray(resPlacements.data.data.drives), "Placement oversight returns drives array");
    assert(resPlacements.data.data.summary !== undefined, "Placement oversight returns summary metrics");
    assert(typeof resPlacements.data.data.summary.activeDrives === "number", "Summary activeDrives is numeric");
    assert(typeof resPlacements.data.data.summary.totalApplicants === "number", "Summary totalApplicants is numeric");
    assert(typeof resPlacements.data.data.summary.participatingColleges === "number", "Summary participatingColleges is numeric");
    assert(resPlacements.data.data.drives.length >= 1, "Placement oversight contains unified drives and projects");
    const hasDriveItem = resPlacements.data.data.drives.some((d) => d.type === "PlacementDrive");
    assert(hasDriveItem, "Unified placement oversight includes PlacementDrive items");
  }

  // =========================================================================
  // Phase 1.5: Broadcast Control & System Announcements
  // =========================================================================
  console.log("\n--- PHASE 1.5: Broadcast Control & Platform Announcements ---");
  let broadcastId;
  {
    const resCreate = await request("/api/admin/broadcasts", {
      method: "POST",
      headers: superAuthHeader,
      body: {
        title: "AdminE2E System Maintenance Window",
        message: "Platform scheduled upgrade on Saturday at 2 AM IST.",
        targetAudience: "All",
        priority: "High",
      },
    });
    assert(resCreate.status === 201, "POST /api/admin/broadcasts creates platform broadcast with 201 Created");
    assert(resCreate.data.data.title === "AdminE2E System Maintenance Window", "Broadcast title saved accurately");
    broadcastId = resCreate.data.data._id;

    // GET broadcasts
    const resList = await request("/api/admin/broadcasts", { headers: superAuthHeader });
    assert(resList.status === 200, "GET /api/admin/broadcasts returns 200 OK");
    const broadcastsArray = resList.data.data.broadcasts || resList.data.data;
    assert(Array.isArray(broadcastsArray), "Broadcasts returned as array");
    const found = broadcastsArray.some((b) => b._id === broadcastId);
    assert(found, "Created platform broadcast returned in broadcasts list");

    // DELETE broadcast
    const resDelete = await request(`/api/admin/broadcasts/${broadcastId}`, {
      method: "DELETE",
      headers: superAuthHeader,
    });
    assert(resDelete.status === 200, "DELETE /api/admin/broadcasts/:id deletes broadcast with 200 OK");
  }

  // =========================================================================
  // Phase 1.6: Analytics, Content Hub & Support Center
  // =========================================================================
  console.log("\n--- PHASE 1.6: Analytics, Content Hub & Support Center ---");
  let roadmapId, ticketId;
  {
    // Platform Analytics
    const resAnalytics = await request("/api/admin/analytics", { headers: superAuthHeader });
    assert(resAnalytics.status === 200, "GET /api/admin/analytics returns 200 OK");
    assert(resAnalytics.data.data.kpis !== undefined, "Platform analytics contains kpis object");
    assert(typeof resAnalytics.data.data.kpis.totalActiveUsers === "number", "Analytics kpis.totalActiveUsers is numeric");
    assert(resAnalytics.data.data.distribution !== undefined, "Platform analytics contains user distribution");
    assert(Array.isArray(resAnalytics.data.data.funnel), "Platform analytics contains placement funnel array");

    // Content Roadmaps
    const resCreateRoadmap = await request("/api/admin/content-roadmaps", {
      method: "POST",
      headers: superAuthHeader,
      body: {
        title: "AdminE2E Cloud Architecture 2026",
        description: "Master enterprise cloud engineering and microservices",
        category: "Tech",
        status: "Published",
      },
    });
    assert(resCreateRoadmap.status === 201, "POST /api/admin/content-roadmaps creates roadmap with 201 Created");
    roadmapId = resCreateRoadmap.data.data._id;

    const resGetRoadmaps = await request("/api/admin/content-roadmaps", { headers: superAuthHeader });
    assert(resGetRoadmaps.status === 200, "GET /api/admin/content-roadmaps returns 200 OK");
    const roadmapsArray = resGetRoadmaps.data.data.roadmaps || resGetRoadmaps.data.data;
    assert(Array.isArray(roadmapsArray), "Content roadmaps returned as array");
    const foundRoadmap = roadmapsArray.some((r) => r._id === roadmapId);
    assert(foundRoadmap, "Created roadmap found in content roadmaps list");

    const resDeleteRoadmap = await request(`/api/admin/content-roadmaps/${roadmapId}`, {
      method: "DELETE",
      headers: superAuthHeader,
    });
    assert(resDeleteRoadmap.status === 200, "DELETE /api/admin/content-roadmaps/:id returns 200 OK");

    // Support Tickets
    const resCreateTicket = await request("/api/admin/support-tickets", {
      method: "POST",
      headers: superAuthHeader,
      body: {
        requesterName: "College Admin Alpha",
        requesterEmail: "help@admine2ecollege.edu",
        requesterRole: "college",
        subject: "Drive Schedule Query",
        message: "Need assistance with company visit calendar integration.",
        priority: "High",
      },
    });
    assert(resCreateTicket.status === 201, "POST /api/admin/support-tickets creates ticket with 201 Created");
    ticketId = resCreateTicket.data.data._id;

    const resGetTickets = await request("/api/admin/support-tickets", { headers: superAuthHeader });
    assert(resGetTickets.status === 200, "GET /api/admin/support-tickets returns 200 OK");
    const ticketsArray = resGetTickets.data.data.tickets || resGetTickets.data.data;
    assert(Array.isArray(ticketsArray), "Support tickets returned as array");
    const foundTicket = ticketsArray.some((t) => t._id === ticketId);
    assert(foundTicket, "Created support ticket found in tickets list");

    const resReplyTicket = await request(`/api/admin/support-tickets/${ticketId}/reply`, {
      method: "POST",
      headers: superAuthHeader,
      body: { message: "Support team has updated your visit calendar settings." },
    });
    assert(resReplyTicket.status === 200, "POST /api/admin/support-tickets/:id/reply appends response with 200 OK");
    assert(Array.isArray(resReplyTicket.data.data.messages) && resReplyTicket.data.data.messages.length >= 1, "Support ticket thread contains admin message");

    const resTicketStatus = await request(`/api/admin/support-tickets/${ticketId}/status`, {
      method: "PUT",
      headers: superAuthHeader,
      body: { status: "Resolved" },
    });
    assert(resTicketStatus.status === 200, "PUT /api/admin/support-tickets/:id/status updates status to 'Resolved'");
  }

  // =========================================================================
  // Phase 1.7: Super Admin vs Standard Admin Granular Access
  // =========================================================================
  console.log("\n--- PHASE 1.7: Super Admin vs Standard Admin Granular Controls ---");
  {
    // Standard Admin cannot register new Admins
    const resRegisterBlocked = await request("/api/admin/register", {
      method: "POST",
      headers: adminAuthHeader,
      body: {
        name: "Unauthorized Admin",
        email: "unauth@admine2etest.com",
        phone: "9876543298",
        password: "Password123!",
        role: "Admin",
      },
    });
    assert(resRegisterBlocked.status === 403, "Standard Admin blocked from POST /api/admin/register with 403 Forbidden");

    // Super Admin can register new Admins
    const resRegisterSuccess = await request("/api/admin/register", {
      method: "POST",
      headers: superAuthHeader,
      body: {
        name: "Authorized Sub-Admin",
        email: "subadmin@admine2etest.com",
        phone: "9876543299",
        password: "Password123!",
        role: "Admin",
      },
    });
    assert(resRegisterSuccess.status === 201, "Super Admin successfully registers new Admin with 201 Created");

    // Standard Admin cannot update system settings
    const resSettingsBlocked = await request("/api/admin/settings", {
      method: "PUT",
      headers: adminAuthHeader,
      body: { siteName: "Hacked Site Name" },
    });
    assert(resSettingsBlocked.status === 403, "Standard Admin blocked from PUT /api/admin/settings with 403 Forbidden");

    // Super Admin can update system settings
    const resSettingsSuccess = await request("/api/admin/settings", {
      method: "PUT",
      headers: superAuthHeader,
      body: {
        platformName: "Campus2Corporate Enterprise",
        maintenanceMode: false,
      },
    });
    assert(resSettingsSuccess.status === 200, "Super Admin updates system settings with 200 OK");
  }

  // =========================================================================
  // Phase 1.8: Activity & Audit Trail Verification
  // =========================================================================
  console.log("\n--- PHASE 1.8: Audit Logging & Activity Trail ---");
  {
    const resActivity = await request("/api/admin/activity", { headers: superAuthHeader });
    assert(resActivity.status === 200, "GET /api/admin/activity returns 200 OK");
    const activitiesArray = resActivity.data.data.activities || resActivity.data.data;
    assert(Array.isArray(activitiesArray), "Audit activities returned as array");
    assert(activitiesArray.length >= 1, "Significant admin actions recorded in audit trail");
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
  console.log("=== ADMIN E2E & SECURITY SUITE FINISHED ===");
  console.log(`  HTTP integration assertions:    ${stats.httpCount}`);
  console.log(`  Required integration skipped:   ${stats.skipped}`);
  console.log(`  Total passed:                   ${stats.passed}`);
  console.log(`  Total failed:                   ${stats.failed}`);
  console.log("=================================================================");

  if (stats.failed > 0) {
    process.exit(1);
  }
}

runAdminE2ETests()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("FATAL ERROR IN ADMIN E2E SUITE:", err);
    if (server) server.close();
    process.exit(1);
  });
