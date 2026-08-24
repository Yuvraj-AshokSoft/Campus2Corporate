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
import http from "http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import College from "../src/models/college.js";
import Student from "../src/models/student.js";
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Project from "../src/models/project.js";
import Application from "../src/models/application.js";
import ApplicationStatusHistory from "../src/models/applicationStatusHistory.js";

const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

let server;
let passCount = 0;
let failCount = 0;

// Override console.assert to guarantee throwing on failure and non-zero exit code
const originalAssert = console.assert;
console.assert = function (condition, ...args) {
  const message = args.join(" ");
  if (!condition) {
    failCount++;
    const err = new Error(`Assertion failed: ${message}`);
    console.error(`❌ ${err.message}`);
    throw err;
  }
  passCount++;
};

async function runTests() {
  console.log("=== STARTING COLLEGE BACKEND TEST SUITE ===");

  const mongoUri =
    process.env.TEST_MONGO_URI ||
    "mongodb://127.0.0.1:27017/c2c";

  try {
    try {
      console.log("Connecting to MongoDB at:", mongoUri);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log("Connected to MongoDB successfully!");
    } catch (e) {
      if (process.env.MONGO_URI) {
        console.log("Retrying with MONGO_URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      } else {
        throw e;
      }
    }

    // Clean up test data
    await College.deleteMany({ email: /@testcollege\.edu/ });
    await Student.deleteMany({ email: /@teststudent\.com/ });
    await Company.deleteMany({ name: "TestCorp" });
    await Recruiter.deleteMany({ email: "recruiter@testcorp.com" });
    await Application.deleteMany({});
    await ApplicationStatusHistory.deleteMany({});

    await new Promise((resolve) => {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
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

      const contentType = res.headers.get("content-type") || "";
      let data = null;
      let text = null;
      if (contentType.includes("application/json")) {
        data = await res.json().catch(() => null);
      } else {
        text = await res.text().catch(() => null);
      }
      return { status: res.status, body: data, text, headers: res.headers };
    }

    let tokenCollegeA;
    let collegeA_Id;
    let tokenCollegeB;
    let collegeB_Id;
    let student1_Id;
    let student2_Id;
    let student3_Id;
    let studentB_Id;
    let recruiterId;
    let companyId;
    let applicationA_Id;
    let application2_Id;

    // --- PHASE 1: AUTHENTICATION & JWT TESTS ---
    console.log("\n--- PHASE 1: AUTH & JWT TESTS ---");

    // Test 1: Register College A
    const regRes = await request("/api/college/register", {
      method: "POST",
      body: {
        name: "Test College A",
        email: "collegea@testcollege.edu",
        phone: "9876543210",
        password: "Password123",
        university: "State University",
        address: "123 Tech Campus",
        website: "https://testcollegea.edu",
      },
    });
    console.assert(
      regRes.status === 201,
      `Expected 201, got ${regRes.status}: ${JSON.stringify(regRes.body)}`
    );
    console.assert(
      regRes.body.success === true,
      "Expected success true on register"
    );
    console.assert(
      regRes.body.data.password === undefined,
      "Password should not be exposed in register response"
    );
    console.log("✔ College A registered successfully");

    // Test 1b: Short password registration fails with 400
    const shortPassRes = await request("/api/college/register", {
      method: "POST",
      body: {
        name: "Test Short Pass",
        email: "shortpass@testcollege.edu",
        phone: "9876543219",
        password: "short",
        university: "State University",
      },
    });
    console.assert(
      shortPassRes.status === 400,
      `Expected 400 for short password, got ${shortPassRes.status}`
    );
    console.log("✔ Short password registration returns 400 Bad Request");

    // Test 2: Duplicate Email Registration
    const dupReg = await request("/api/college/register", {
      method: "POST",
      body: {
        name: "College A Dup",
        email: "collegea@testcollege.edu",
        phone: "9876543211",
        password: "Password123",
        university: "State University",
      },
    });
    console.assert(
      dupReg.status === 400,
      `Expected 400 for duplicate email, got ${dupReg.status}`
    );
    console.log("✔ Duplicate email registration blocked cleanly (400)");

    // Test 3: Login College A
    const loginRes = await request("/api/college/login", {
      method: "POST",
      body: {
        email: "collegea@testcollege.edu",
        password: "Password123",
      },
    });
    console.assert(
      loginRes.status === 200,
      `Expected 200, got ${loginRes.status}: ${JSON.stringify(loginRes.body)}`
    );
    console.assert(loginRes.body.data.token, "Login should return token");
    tokenCollegeA = loginRes.body.data.token;
    collegeA_Id = loginRes.body.data.college.id || loginRes.body.data.college._id;

    // Verify JWT payload role is "college"
    const decodedToken = jwt.decode(tokenCollegeA);
    console.assert(
      decodedToken.role === "college",
      `Expected role 'college', got ${decodedToken.role}`
    );
    console.log("✔ College A logged in successfully (JWT contains role: 'college')");

    // Test 4: Missing Token Protection
    const noTokRes = await request("/api/college/profile");
    console.assert(
      noTokRes.status === 401,
      `Expected 401 for missing token, got ${noTokRes.status}`
    );
    console.log("✔ Missing token rejected with 401");

    // Test 5: Malformed/Invalid Token
    const badTokRes = await request("/api/college/profile", {
      headers: { Authorization: "Bearer invalid_jwt_token_xyz" },
    });
    console.assert(
      badTokRes.status === 401,
      `Expected 401 for invalid token, got ${badTokRes.status}`
    );
    console.log("✔ Invalid token rejected with 401");

    // Test 6: Wrong Role Token (Student token on College route)
    const secret = process.env.JWT_SECRET || "fallback_jwt_secret_key_123456";
    const studentToken = jwt.sign(
      { id: collegeA_Id, role: "student" },
      secret
    );
    const wrongRoleRes = await request("/api/college/profile", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.assert(
      wrongRoleRes.status === 403,
      `Expected 403 for wrong role token, got ${wrongRoleRes.status}`
    );
    console.log("✔ Wrong role (student) token on College route rejected with 403");

    // Test 7: Register & Login Inactive College B
    const regResB = await request("/api/college/register", {
      method: "POST",
      body: {
        name: "Test College B",
        email: "collegeb@testcollege.edu",
        phone: "9876543299",
        password: "Password123",
        university: "Tech Institute",
      },
    });
    collegeB_Id = regResB.body.data.id || regResB.body.data._id;

    // Mark College B as Inactive directly in DB
    await College.findByIdAndUpdate(collegeB_Id, { status: "Inactive" });

    const loginResB = await request("/api/college/login", {
      method: "POST",
      body: {
        email: "collegeb@testcollege.edu",
        password: "Password123",
      },
    });
    console.assert(
      loginResB.status === 403,
      `Expected 403 for inactive college login, got ${loginResB.status}`
    );
    console.log("✔ Inactive college login blocked with 403");

    // --- PHASE 2: PROFILE TESTS (PUT + PATCH) ---
    console.log("\n--- PHASE 2: PROFILE TESTS ---");

    // Test 8: GET Profile
    const profRes = await request("/api/college/profile", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      profRes.status === 200,
      `Expected 200 on GET profile, got ${profRes.status}`
    );
    console.assert(
      profRes.body.data.email === "collegea@testcollege.edu",
      "Profile email match"
    );
    console.assert(
      profRes.body.data.password === undefined,
      "Password should not be present in profile"
    );
    console.log("✔ GET Profile retrieved successfully without password exposure");

    // Test 9: PUT Profile
    const updateProfRes = await request("/api/college/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        university: "Updated State University",
        address: "456 Innovation Way",
        city: "Tech City",
        state: "CA",
      },
    });
    console.assert(
      updateProfRes.status === 200,
      `Expected 200 on PUT profile, got ${updateProfRes.status}`
    );
    console.assert(
      updateProfRes.body.data.university === "Updated State University",
      "University field updated"
    );
    console.log("✔ PUT Profile updated successfully");

    // Test 9b: PATCH Profile
    const patchProfRes = await request("/api/college/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        city: "Silicon Valley",
      },
    });
    console.assert(
      patchProfRes.status === 200 && patchProfRes.body.data.city === "Silicon Valley",
      "PATCH Profile city should be Silicon Valley"
    );
    console.log("✔ PATCH Profile alias updated successfully");

    // --- PHASE 3: STUDENT MANAGEMENT TESTS ---
    console.log("\n--- PHASE 3: STUDENT MANAGEMENT TESTS ---");

    // Test 10: Create Student 1 for College A
    const s1Res = await request("/api/college/students", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        name: "John Doe",
        email: "john@teststudent.com",
        branch: "CSE",
        semester: 8,
        status: "Active",
      },
    });
    console.assert(
      s1Res.status === 201,
      `Expected 201 on create student 1, got ${s1Res.status}: ${JSON.stringify(s1Res.body)}`
    );
    student1_Id = s1Res.body.data._id;
    console.log("✔ Student 1 created successfully");

    // Verify College.students array synchronicity
    const colADoc = await College.findById(collegeA_Id);
    console.assert(
      colADoc.students.map((id) => id.toString()).includes(student1_Id),
      "College.students array must include newly created student ID"
    );
    console.log("✔ College.students array synchronized on student creation");

    // Test 11: Create Student 2 & Student 3 for College A
    const s2Res = await request("/api/college/students", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        name: "Jane Smith",
        email: "jane@teststudent.com",
        branch: "ECE",
        semester: 6,
        status: "Active",
      },
    });
    student2_Id = s2Res.body.data._id;

    const s3Res = await request("/api/college/students", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        name: "Bob Builder",
        email: "bob@teststudent.com",
        branch: "CSE",
        semester: 6,
        status: "Active",
      },
    });
    student3_Id = s3Res.body.data._id;

    // Test 12: Duplicate Student Email
    const dupStudentRes = await request("/api/college/students", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        name: "Duplicate John",
        email: "john@teststudent.com",
      },
    });
    console.assert(
      dupStudentRes.status === 400,
      `Expected 400 for duplicate student email, got ${dupStudentRes.status}`
    );
    console.log("✔ Duplicate student email blocked cleanly with 400");

    // Test 13: Invalid ObjectId on Student endpoint
    const invalidIdRes = await request("/api/college/students/invalid_object_id_123", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      invalidIdRes.status === 400,
      `Expected 400 for invalid ObjectId, got ${invalidIdRes.status}`
    );
    console.log("✔ Invalid ObjectId handled with 400 Bad Request");

    // Test 13b: Duplicate email validation on student update returns 400
    const invalidEmailRes = await request(`/api/college/students/${student1_Id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        email: "jane@teststudent.com", // Belongs to Student 2
      },
    });
    console.assert(
      invalidEmailRes.status === 400,
      `Expected 400 for duplicate email update, got ${invalidEmailRes.status}`
    );
    console.log("✔ Duplicate email check on student update returned HTTP 400");

    // Test 13c: Attempt to update password via PUT student is stripped
    const passUpdateAttempt = await request(`/api/college/students/${student1_Id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        password: "InjectedPlaintextPassword123",
        branch: "CSE-AI",
      },
    });
    console.assert(
      passUpdateAttempt.status === 200,
      `Expected 200 on student update, got ${passUpdateAttempt.status}`
    );
    const rawStudentDoc = await Student.findById(student1_Id).select("+password");
    console.assert(
      rawStudentDoc.password !== "InjectedPlaintextPassword123",
      "Plaintext password must NOT be written to student document"
    );
    console.log("✔ Student password update attempt cleanly stripped (no plaintext leak)");

    // Test 13d: PATCH Student alias works
    const patchStudentRes = await request(`/api/college/students/${student1_Id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        branch: "CSE",
      },
    });
    console.assert(
      patchStudentRes.status === 200 && patchStudentRes.body.data.branch === "CSE",
      "PATCH Student should succeed"
    );
    console.log("✔ PATCH Student alias works successfully");

    // Test 14: Search & Filters on Student List
    const searchRes = await request("/api/college/students?search=John", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      searchRes.body.data.length === 1 && searchRes.body.data[0].name === "John Doe",
      "Search should return only John Doe"
    );

    const branchRes = await request("/api/college/students?branch=CSE", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      branchRes.body.data.length === 2,
      "Branch filter CSE should return 2 students"
    );

    const semRes = await request("/api/college/students?semester=6", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      semRes.body.data.length === 2,
      "Semester filter 6 should return 2 students"
    );

    const pageRes = await request("/api/college/students?page=1&limit=2", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      pageRes.body.data.students.length === 2 &&
        pageRes.body.data.pagination.total === 3,
      "Pagination should return 2 students on page 1 of 3 total"
    );
    console.log("✔ Student list search, branch, semester, and pagination filters work perfectly");

    // Test 15: Eligible Students
    const eligRes = await request("/api/college/students/eligible?branch=CSE", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      eligRes.status === 200,
      `Expected 200 on eligible students, got ${eligRes.status}`
    );
    console.assert(
      eligRes.body.data.length === 2,
      `Expected 2 eligible students with branch CSE, got ${eligRes.body.data.length}`
    );
    console.log("✔ Eligible students returns correct scoped students");

    // Test 16: Cross-College Access Protection for Students
    await College.findByIdAndUpdate(collegeB_Id, { status: "Active" });
    const loginResB_Active = await request("/api/college/login", {
      method: "POST",
      body: {
        email: "collegeb@testcollege.edu",
        password: "Password123",
      },
    });
    tokenCollegeB = loginResB_Active.body.data.token;

    const sBRes = await request("/api/college/students", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
      body: {
        name: "College B Student",
        email: "studentB@teststudent.com",
      },
    });
    studentB_Id = sBRes.body.data._id;

    const crossStudentRes = await request(`/api/college/students/${studentB_Id}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      crossStudentRes.status === 404,
      `Expected 404 when College A accesses College B's student, got ${crossStudentRes.status}`
    );
    console.log("✔ Cross-college student access blocked (404 Not Found)");

    // --- PHASE 4: APPLICATION MANAGEMENT & CASCADE TESTS ---
    console.log("\n--- PHASE 4: APPLICATION TESTS ---");

    const compDoc = await Company.create({
      name: "TestCorp",
      email: "info@testcorp.com",
    });
    companyId = compDoc._id.toString();

    const recDoc = await Recruiter.create({
      name: "Recruiter Bob",
      email: "recruiter@testcorp.com",
      password: "Password123",
      phone: "9988776655",
      designation: "HR Lead",
      company: companyId,
    });
    recruiterId = recDoc._id.toString();

    // Test 18: Create Application 1 for Student 1 (College A)
    const appCreateRes = await request("/api/college/applications", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        student: student1_Id,
        recruiter: recruiterId,
        company: companyId,
        status: "Applied",
      },
    });
    console.assert(
      appCreateRes.status === 201,
      `Expected 201 on create application, got ${appCreateRes.status}: ${JSON.stringify(appCreateRes.body)}`
    );
    applicationA_Id = appCreateRes.body.data._id;
    console.assert(
      appCreateRes.body.data.student._id === student1_Id,
      "Populated student ID matches"
    );
    console.log("✔ Application 1 created and populated successfully");

    // Test 18b: Create Application 2 for Student 3 (College A)
    const appCreateRes2 = await request("/api/college/applications", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        student: student3_Id,
        recruiter: recruiterId,
        company: companyId,
        status: "Selected",
      },
    });
    application2_Id = appCreateRes2.body.data._id;
    console.log("✔ Application 2 created for Student 3");

    // Test 19: Attempt Create Application for Student B (College B) using College A's token
    const crossAppCreateRes = await request("/api/college/applications", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        student: studentB_Id,
        recruiter: recruiterId,
        company: companyId,
        status: "Applied",
      },
    });
    console.assert(
      crossAppCreateRes.status === 403 || crossAppCreateRes.status === 400,
      `Expected 403/400 when creating application for student of another college, got ${crossAppCreateRes.status}`
    );
    console.log("✔ Cross-college application creation blocked cleanly");

    // Test 20: GET All Applications for College A (DB-level query scoping)
    const getAppsRes = await request("/api/college/applications", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      getAppsRes.status === 200,
      `Expected 200 on list applications, got ${getAppsRes.status}`
    );
    console.assert(
      getAppsRes.body.data.length === 2,
      "Should return 2 applications for College A"
    );
    console.log("✔ GET All Applications returns DB-scoped applications for College A");

    // Test 20b: Filter applications by status
    const filterAppRes = await request("/api/college/applications?status=Selected", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      filterAppRes.body.data.length === 1 && filterAppRes.body.data[0].status === "Selected",
      "Status filter should return 1 Selected application"
    );
    console.log("✔ Filter applications by status works");

    // Test 20c: Application pagination
    const pageAppRes = await request("/api/college/applications?page=1&limit=1", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      pageAppRes.body.data.applications.length === 1 &&
        pageAppRes.body.data.pagination.total === 2 &&
        pageAppRes.body.data.pagination.totalPages === 2,
      "Application pagination should return 1 application with totalPages=2"
    );
    console.log("✔ Application pagination works with metadata");

    // Test 21: GET Application By ID
    const getAppByIdRes = await request(`/api/college/applications/${applicationA_Id}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      getAppByIdRes.status === 200,
      `Expected 200 on get application by ID, got ${getAppByIdRes.status}`
    );
    console.log("✔ GET Application By ID succeeded");

    // Test 22: Cross-College Access Protection for Applications
    const crossAppGetRes = await request(`/api/college/applications/${applicationA_Id}`, {
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
    });
    console.assert(
      crossAppGetRes.status === 404,
      `Expected 404 when College B accesses College A's application, got ${crossAppGetRes.status}`
    );
    console.log("✔ Cross-college application view blocked with 404");

    // Test 23: Update Application Status via PUT and PATCH
    const updateAppRes = await request(`/api/college/applications/${applicationA_Id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        status: "Shortlisted",
      },
    });
    console.assert(
      updateAppRes.status === 200 && updateAppRes.body.data.status === "Shortlisted",
      "Application status updated to Shortlisted"
    );
    console.log("✔ Update Application via PUT succeeded");

    const patchAppRes = await request(`/api/college/applications/${applicationA_Id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        status: "Interview",
      },
    });
    console.assert(
      patchAppRes.status === 200 && patchAppRes.body.data.status === "Interview",
      "Application status updated to Interview via PATCH"
    );
    console.log("✔ Update Application via PATCH alias succeeded");

    // Test 24: Delete Student 3 & verify cascade application deletion & College.students array pull
    const delStudentRes = await request(`/api/college/students/${student3_Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      delStudentRes.status === 200,
      `Expected 200 on delete student, got ${delStudentRes.status}`
    );

    const colADocAfterDel = await College.findById(collegeA_Id);
    console.assert(
      !colADocAfterDel.students.map((id) => id.toString()).includes(student3_Id),
      "Deleted student ID should be pulled from College.students array"
    );

    const orphanedApps = await Application.find({ student: student3_Id });
    console.assert(
      orphanedApps.length === 0,
      "Cascade delete must remove all applications linked to the deleted student"
    );
    console.log("✔ Delete student succeeded, College.students updated & applications cascade-deleted");

    // Test 25: Delete Application 1
    const delAppRes = await request(`/api/college/applications/${applicationA_Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      delAppRes.status === 200,
      `Expected 200 on delete application, got ${delAppRes.status}`
    );
    console.log("✔ Delete Application succeeded");

    // ==========================================
    // --- PHASE 6: ENHANCEMENTS PHASE 1 TESTS ---
    // ==========================================
    console.log("\n--- PHASE 6: BULK IMPORT, CSV EXPORT & BULK UPDATE TESTS ---");

    // Test 26: Bulk Student Import via JSON
    const bulkImportJsonRes = await request("/api/college/students/bulk-import", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        students: [
          {
            name: "Bulk Student 1",
            email: "bulk1@teststudent.com",
            phone: "9876543231",
            branch: "Computer Science",
            semester: 6,
            percentage: 82.5,
            skills: ["JavaScript", "Node.js"],
          },
          {
            name: "Bulk Student 2",
            email: "bulk2@teststudent.com",
            phone: "9876543232",
            branch: "Information Technology",
            semester: 6,
            percentage: 76.0,
            skills: ["Python", "Django"],
          },
          {
            name: "Bulk Student 3",
            email: "bulk3@teststudent.com",
            phone: "9876543233",
            branch: "Computer Science",
            semester: 8,
            percentage: 91.0,
            skills: ["React", "TypeScript"],
          },
        ],
      },
    });

    console.assert(
      bulkImportJsonRes.status === 201,
      `Expected 201 on bulk import JSON, got ${bulkImportJsonRes.status}: ${JSON.stringify(bulkImportJsonRes.body)}`
    );
    console.assert(
      bulkImportJsonRes.body.data.importedCount === 3,
      `Expected importedCount 3, got ${bulkImportJsonRes.body.data.importedCount}`
    );
    console.assert(
      bulkImportJsonRes.body.data.failedCount === 0,
      `Expected failedCount 0, got ${bulkImportJsonRes.body.data.failedCount}`
    );

    const importedIds = bulkImportJsonRes.body.data.importedStudents.map((s) => s._id);
    const colADocAfterBulk = await College.findById(collegeA_Id);
    const colAStudentIds = colADocAfterBulk.students.map((id) => id.toString());
    console.assert(
      importedIds.every((id) => colAStudentIds.includes(id)),
      "All imported student IDs must be added to College.students array"
    );
    console.log("✔ Bulk student import via JSON succeeded & synced College.students");

    // Test 27: Bulk Import with Validation Errors & Duplicate Email Detection
    const bulkImportErrorsRes = await request("/api/college/students/bulk-import", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        students: [
          {
            name: "Valid Unique Student",
            email: "validunique@teststudent.com",
            branch: "Electronics",
            semester: 4,
            percentage: 78,
          },
          {
            name: "Duplicate DB Email",
            email: "bulk1@teststudent.com", // Already exists in DB
            branch: "Computer Science",
            semester: 6,
            percentage: 80,
          },
          {
            name: "Duplicate In Batch 1",
            email: "batchdup@teststudent.com",
            branch: "Computer Science",
            semester: 6,
            percentage: 75,
          },
          {
            name: "Duplicate In Batch 2",
            email: "batchdup@teststudent.com", // Duplicate in same batch
            branch: "Computer Science",
            semester: 6,
            percentage: 75,
          },
          {
            name: "Missing Percentage",
            email: "nopercentage@teststudent.com",
            branch: "Mechanical",
            semester: 5,
            percentage: -10, // Invalid percentage
          },
          {
            name: "Invalid Email Format",
            email: "invalid-email-format",
            percentage: 85,
          },
        ],
      },
    });

    console.assert(
      bulkImportErrorsRes.status === 201 || bulkImportErrorsRes.status === 200,
      `Expected 200/201 on partial bulk import, got ${bulkImportErrorsRes.status}`
    );
    console.assert(
      bulkImportErrorsRes.body.data.importedCount === 2, // Valid Unique Student + Duplicate In Batch 1 (first instance)
      `Expected importedCount 2, got ${bulkImportErrorsRes.body.data.importedCount}`
    );
    console.assert(
      bulkImportErrorsRes.body.data.failedCount === 4,
      `Expected failedCount 4, got ${bulkImportErrorsRes.body.data.failedCount}`
    );
    console.assert(
      bulkImportErrorsRes.body.data.failedRows.length === 4,
      "Failed rows array must contain details of the 4 invalid/duplicate rows"
    );
    console.log("✔ Bulk import invalid-row reporting & duplicate email detection verified");

    // Test 28: Bulk Student Import via CSV string
    const csvContent = [
      "name,email,phone,branch,semester,percentage,skills",
      'CSV Student 1,csv1@teststudent.com,9876543241,Information Technology,6,88.5,"Java, Spring"',
      'CSV Student 2,csv2@teststudent.com,9876543242,Computer Science,7,79.0,"Python, FastAPI"',
    ].join("\n");

    const bulkImportCsvRes = await request("/api/college/students/bulk-import", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: { csvData: csvContent },
    });

    console.assert(
      bulkImportCsvRes.status === 201,
      `Expected 201 on bulk import CSV, got ${bulkImportCsvRes.status}: ${JSON.stringify(bulkImportCsvRes.body)}`
    );
    console.assert(
      bulkImportCsvRes.body.data.importedCount === 2,
      `Expected importedCount 2, got ${bulkImportCsvRes.body.data.importedCount}`
    );
    console.log("✔ Bulk student import via CSV string format succeeded");

    // Test 29: Student CSV Export
    const exportRes = await request("/api/college/students/export", {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });

    console.assert(
      exportRes.status === 200,
      `Expected 200 on student export, got ${exportRes.status}`
    );
    console.assert(
      exportRes.headers.get("content-type")?.includes("text/csv"),
      "Response Content-Type header must be text/csv"
    );
    console.assert(
      typeof exportRes.text === "string" && exportRes.text.length > 0,
      "Export text response must be non-empty"
    );
    console.assert(
      exportRes.text.includes("Name,Email,Phone,Branch,Semester,Percentage,Status,Skills,Registered At"),
      "CSV header row must match expected columns"
    );
    console.assert(
      exportRes.text.includes("bulk1@teststudent.com") &&
        exportRes.text.includes("csv1@teststudent.com"),
      "Exported CSV must contain College A's student records"
    );
    console.assert(
      !exportRes.text.includes("password") && !exportRes.text.includes("$2a$"),
      "CSV export must never leak password hashes or secrets"
    );
    console.log("✔ Student CSV export generated clean RFC 4180 output with no secret leakage");

    // Test 30: Student CSV Export with Filters & College Isolation
    const filteredExportRes = await request(
      "/api/college/students/export?branch=Information Technology&minPercentage=80",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );

    console.assert(
      filteredExportRes.status === 200,
      `Expected 200 on filtered export, got ${filteredExportRes.status}`
    );
    console.assert(
      filteredExportRes.text.includes("csv1@teststudent.com"),
      "Filtered CSV must include CSV Student 1 (IT, 88.5%)"
    );
    console.assert(
      !filteredExportRes.text.includes("bulk2@teststudent.com"),
      "Filtered CSV must exclude bulk2 (IT, 76.0% < 80%)"
    );

    // Cross-college export isolation: College B export must NOT have College A students
    const collegeBExportRes = await request("/api/college/students/export", {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
    });
    console.assert(
      collegeBExportRes.status === 200,
      `Expected 200 on College B export, got ${collegeBExportRes.status}`
    );
    console.assert(
      !collegeBExportRes.text.includes("bulk1@teststudent.com"),
      "College B CSV export must strictly isolate College A's students"
    );
    console.log("✔ Student CSV export filtering and cross-college isolation verified");

    // Test 31: Bulk Student Update
    const bulk1Id = importedIds[0];
    const bulk2Id = importedIds[1];

    const bulkUpdateRes = await request("/api/college/students/bulk", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        updates: [
          {
            id: bulk1Id,
            branch: "Artificial Intelligence",
            semester: 7,
            percentage: 95.0,
            status: "Inactive",
          },
          {
            id: bulk2Id,
            skills: ["Python", "FastAPI", "Docker"],
            percentage: 84.0,
          },
        ],
      },
    });

    console.assert(
      bulkUpdateRes.status === 200,
      `Expected 200 on bulk update, got ${bulkUpdateRes.status}: ${JSON.stringify(bulkUpdateRes.body)}`
    );
    console.assert(
      bulkUpdateRes.body.data.updatedCount === 2,
      `Expected updatedCount 2, got ${bulkUpdateRes.body.data.updatedCount}`
    );
    console.assert(
      bulkUpdateRes.body.data.failedCount === 0,
      `Expected failedCount 0, got ${bulkUpdateRes.body.data.failedCount}`
    );

    const updatedDoc1 = await Student.findById(bulk1Id);
    console.assert(
      updatedDoc1.branch === "Artificial Intelligence" &&
        updatedDoc1.semester === 7 &&
        updatedDoc1.percentage === 95.0 &&
        updatedDoc1.status === "Inactive",
      "Student 1 document in DB must reflect all updated fields"
    );
    console.log("✔ Bulk student update applied valid changes successfully");

    // Test 32: Bulk Student Update - Cross College Isolation & Validation
    const bulkUpdateErrorsRes = await request("/api/college/students/bulk", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        updates: [
          {
            id: studentB_Id, // Belongs to College B!
            branch: "Hacked Branch",
          },
          {
            id: "507f1f77bcf86cd799439011", // Non-existent student
            semester: 8,
          },
          {
            id: bulk1Id,
            percentage: 150, // Invalid percentage > 100
          },
        ],
      },
    });

    console.assert(
      bulkUpdateErrorsRes.status === 200,
      `Expected 200 on bulk update with errors, got ${bulkUpdateErrorsRes.status}`
    );
    console.assert(
      bulkUpdateErrorsRes.body.data.updatedCount === 0,
      `Expected updatedCount 0, got ${bulkUpdateErrorsRes.body.data.updatedCount}`
    );
    console.assert(
      bulkUpdateErrorsRes.body.data.failedCount === 3,
      `Expected failedCount 3, got ${bulkUpdateErrorsRes.body.data.failedCount}`
    );
    console.log("✔ Bulk student update cross-college isolation and validation verified");

    // Test 33: Bulk Student Update Common Format ({ studentIds, updates })
    const commonBulkUpdateRes = await request("/api/college/students/bulk", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        studentIds: [bulk1Id, bulk2Id],
        updates: {
          status: "Active",
        },
      },
    });
    console.assert(
      commonBulkUpdateRes.status === 200 && commonBulkUpdateRes.body.data.updatedCount === 2,
      "Common format bulk update succeeded"
    );
    console.log("✔ Bulk student update common format ({ studentIds, updates }) verified");

    // ==========================================
    // --- PHASE 7: APPLICATION STATUS HISTORY TESTS ---
    // ==========================================
    console.log("\n--- PHASE 7: APPLICATION STATUS HISTORY TESTS ---");

    // Test 34: Initial Status History Creation on Application Create
    const createHistoryAppRes = await request("/api/college/applications", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        student: student1_Id,
        recruiter: recruiterId,
        company: companyId,
        remarks: "First application submission",
      },
    });

    console.assert(
      createHistoryAppRes.status === 201,
      `Expected 201 on create app for history test, got ${createHistoryAppRes.status}: ${JSON.stringify(createHistoryAppRes.body)}`
    );
    const historyAppId = createHistoryAppRes.body.data._id;

    const initialHistoryRes = await request(
      `/api/college/applications/${historyAppId}/history`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );

    console.assert(
      initialHistoryRes.status === 200,
      `Expected 200 on initial history fetch, got ${initialHistoryRes.status}: ${JSON.stringify(initialHistoryRes.body)}`
    );
    console.assert(
      Array.isArray(initialHistoryRes.body.data) &&
        initialHistoryRes.body.data.length === 1,
      `Expected 1 history entry, got ${initialHistoryRes.body.data?.length}`
    );
    console.assert(
      initialHistoryRes.body.data[0].oldStatus === null &&
        initialHistoryRes.body.data[0].newStatus === "Applied",
      "Initial history entry must have oldStatus: null and newStatus: 'Applied'"
    );
    console.assert(
      initialHistoryRes.body.data[0].remarks === "First application submission",
      "Initial history entry must preserve initial remarks"
    );
    console.log("✔ Initial 'Applied' status history created reliably on application creation");

    // Test 35: Status Transition History on Update
    const updateHistoryRes1 = await request(
      `/api/college/applications/${historyAppId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
        body: {
          status: "Under Review",
          remarks: "Application under screening",
        },
      }
    );

    console.assert(
      updateHistoryRes1.status === 200,
      `Expected 200 on update status, got ${updateHistoryRes1.status}`
    );

    const historyAfterUpdate1 = await request(
      `/api/college/applications/${historyAppId}/history`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );

    console.assert(
      historyAfterUpdate1.body.data.length === 2,
      `Expected 2 history records after first transition, got ${historyAfterUpdate1.body.data.length}`
    );
    console.assert(
      historyAfterUpdate1.body.data[0].oldStatus === "Applied" &&
        historyAfterUpdate1.body.data[0].newStatus === "Under Review" &&
        historyAfterUpdate1.body.data[0].remarks === "Application under screening",
      "Most recent history entry must record Applied -> Under Review"
    );
    console.log("✔ Single status transition recorded with oldStatus, newStatus, remarks and changedBy");

    // Test 36: Multiple Status Transitions & Newest-First Ordering
    await request(`/api/college/applications/${historyAppId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        status: "Shortlisted",
        remarks: "Passed initial technical screening",
      },
    });

    await request(`/api/college/applications/${historyAppId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        status: "Interview",
        remarks: "Technical interview scheduled",
      },
    });

    const fullHistoryRes = await request(
      `/api/college/applications/${historyAppId}/history`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );

    console.assert(
      fullHistoryRes.body.data.length === 4,
      `Expected 4 history entries, got ${fullHistoryRes.body.data.length}`
    );

    const hList = fullHistoryRes.body.data;
    console.assert(
      hList[0].newStatus === "Interview" && hList[0].oldStatus === "Shortlisted",
      "History index 0 must be Interview"
    );
    console.assert(
      hList[1].newStatus === "Shortlisted" && hList[1].oldStatus === "Under Review",
      "History index 1 must be Shortlisted"
    );
    console.assert(
      hList[2].newStatus === "Under Review" && hList[2].oldStatus === "Applied",
      "History index 2 must be Under Review"
    );
    console.assert(
      hList[3].newStatus === "Applied" && hList[3].oldStatus === null,
      "History index 3 must be Applied"
    );

    const t0 = new Date(hList[0].changedAt).getTime();
    const t1 = new Date(hList[1].changedAt).getTime();
    console.assert(
      t0 >= t1,
      "History entries must be sorted strictly newest-first"
    );
    console.log("✔ Multiple transitions and newest-first ordering verified");

    // Test 37: No Duplicate History when Status does NOT change
    const noChangeRes = await request(
      `/api/college/applications/${historyAppId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
        body: {
          coverLetter: "Updated cover letter without status change",
        },
      }
    );
    console.assert(
      noChangeRes.status === 200,
      `Expected 200 on non-status update, got ${noChangeRes.status}`
    );

    const historyAfterNoChange = await request(
      `/api/college/applications/${historyAppId}/history`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );

    console.assert(
      historyAfterNoChange.body.data.length === 4,
      `Expected history length to remain 4 when status did not change, got ${historyAfterNoChange.body.data.length}`
    );
    console.log("✔ No duplicate history created when status is unchanged");

    // Test 38: Invalid ObjectId for History Endpoint -> 400
    const invalidIdHistoryRes = await request(
      "/api/college/applications/invalid-id-format/history",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );
    console.assert(
      invalidIdHistoryRes.status === 400,
      `Expected 400 for invalid ObjectId on history, got ${invalidIdHistoryRes.status}`
    );
    console.log("✔ Invalid ObjectId on history endpoint returns 400 Bad Request");

    // Test 39: Cross-College History Access Blocked -> 404
    const crossCollegeHistoryRes = await request(
      `/api/college/applications/${historyAppId}/history`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenCollegeB}` },
      }
    );
    console.assert(
      crossCollegeHistoryRes.status === 404,
      `Expected 404 on cross-college history access, got ${crossCollegeHistoryRes.status}`
    );
    console.log("✔ Cross-college application history access blocked with 404");

    // Test 40: Application Deletion Cascade Cleanup for History
    const delHistoryAppRes = await request(
      `/api/college/applications/${historyAppId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenCollegeA}` },
      }
    );
    console.assert(
      delHistoryAppRes.status === 200,
      `Expected 200 on delete app, got ${delHistoryAppRes.status}`
    );

    const historyAfterAppDel = await ApplicationStatusHistory.find({
      application: historyAppId,
    });
    console.assert(
      historyAfterAppDel.length === 0,
      "ApplicationStatusHistory records must be cleaned up on application deletion"
    );
    console.log("✔ Cascade cleanup of status history on application deletion verified");

    // ==========================================
    // --- PHASE 8: ADVANCED APPLICATION FILTERING TESTS ---
    // ==========================================
    console.log("\n--- PHASE 8: ADVANCED APPLICATION FILTERING TESTS ---");

    // Clean up applications for a fresh filtering test dataset
    await Application.deleteMany({});
    await ApplicationStatusHistory.deleteMany({});

    // Create a project for project filtering tests
    const filterProj = await Project.create({
      title: "Full Stack Engineer Project",
      description: "Node & React Project description that is at least 20 characters long",
      company: companyId,
      recruiter: recruiterId,
      requiredSkills: ["Node.js", "React"],
      duration: "3 months",
      stipend: 25000,
      location: "Remote",
      openings: 5,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    const filterProjectId = filterProj._id.toString();

    // Create a fresh Student 3 for College A (as student 3 was deleted in earlier deletion test)
    const freshStudent3 = await Student.create({
      name: "Fresh Student 3",
      email: "fresh3@teststudent.com",
      college: collegeA_Id,
      branch: "CSE",
      semester: 8,
      status: "Active",
    });
    student3_Id = freshStudent3._id.toString();
    await College.findByIdAndUpdate(collegeA_Id, { $addToSet: { students: freshStudent3._id } });

    // Create dates: 2 days ago, 1 day ago, today
    const now = new Date();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    const pad = (n) => String(n).padStart(2, "0");
    const formatDate = (d) =>
      `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

    const dateTwoDaysAgo = formatDate(twoDaysAgo);
    const dateOneDayAgo = formatDate(oneDayAgo);
    const dateToday = formatDate(now);

    // Create 4 applications for College A
    // App 1: Student 1, Company, Project, "Applied", 2 days ago
    const app1Doc = await Application.create({
      student: student1_Id,
      recruiter: recruiterId,
      company: companyId,
      project: filterProjectId,
      status: "Applied",
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    });
    const filterApp1Id = app1Doc._id.toString();

    // App 2: Student 2, Company, null Project, "Under Review", 1 day ago
    const app2Doc = await Application.create({
      student: student2_Id,
      recruiter: recruiterId,
      company: companyId,
      status: "Under Review",
      createdAt: oneDayAgo,
      updatedAt: oneDayAgo,
    });
    const filterApp2Id = app2Doc._id.toString();

    // App 3: Student 3, Company, Project, "Selected", today
    const app3Doc = await Application.create({
      student: student3_Id,
      recruiter: recruiterId,
      company: companyId,
      project: filterProjectId,
      status: "Selected",
      createdAt: now,
      updatedAt: now,
    });
    const filterApp3Id = app3Doc._id.toString();

    // App 4: Student 1, Company, Project, "Interview", today
    const app4Doc = await Application.create({
      student: student1_Id,
      recruiter: recruiterId,
      company: companyId,
      project: filterProjectId,
      status: "Interview",
      createdAt: now,
      updatedAt: now,
    });
    const filterApp4Id = app4Doc._id.toString();

    // Create 1 application for College B (Student B)
    const appBDoc = await Application.create({
      student: studentB_Id,
      recruiter: recruiterId,
      company: companyId,
      project: filterProjectId,
      status: "Selected",
      createdAt: now,
      updatedAt: now,
    });
    const filterAppBId = appBDoc._id.toString();

    // Test 41: Filter by Valid Status
    const statusFilterRes = await request("/api/college/applications?status=Selected", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      statusFilterRes.status === 200,
      `Expected 200 on status filter, got ${statusFilterRes.status}`
    );
    console.assert(
      Array.isArray(statusFilterRes.body.data) &&
        statusFilterRes.body.data.length === 1 &&
        statusFilterRes.body.data[0]._id === filterApp3Id &&
        statusFilterRes.body.data[0].status === "Selected",
      "Status filter Selected should return only Application 3"
    );
    console.log("✔ Application filter by status (Selected) returns exact matching application");

    // Test 42: Filter by Invalid Status -> 400
    const invalidStatusRes = await request("/api/college/applications?status=NonExistentStatus", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      invalidStatusRes.status === 400,
      `Expected 400 for invalid status, got ${invalidStatusRes.status}`
    );
    console.log("✔ Application filter by invalid status rejected with 400 Bad Request");

    // Test 43: Filter by Valid Company ID
    const compFilterRes = await request(`/api/college/applications?companyId=${companyId}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      compFilterRes.status === 200 &&
        Array.isArray(compFilterRes.body.data) &&
        compFilterRes.body.data.length === 4,
      `Expected 4 applications for companyId, got ${compFilterRes.body.data?.length}`
    );
    console.log("✔ Application filter by valid companyId returns all scoped applications");

    // Test 44: Filter by Invalid Company ObjectId -> 400
    const invalidCompRes = await request("/api/college/applications?companyId=bad-company-id", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      invalidCompRes.status === 400,
      `Expected 400 for malformed companyId, got ${invalidCompRes.status}`
    );
    console.log("✔ Application filter by invalid companyId rejected with 400 Bad Request");

    // Test 45: Filter by Valid Project ID
    const projFilterRes = await request(`/api/college/applications?projectId=${filterProjectId}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      projFilterRes.status === 200 &&
        Array.isArray(projFilterRes.body.data) &&
        projFilterRes.body.data.length === 3,
      `Expected 3 applications linked to project, got ${projFilterRes.body.data?.length}`
    );
    console.log("✔ Application filter by valid projectId returns matching applications");

    // Test 46: Filter by Invalid Project ObjectId -> 400
    const invalidProjRes = await request("/api/college/applications?projectId=bad-project-id", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      invalidProjRes.status === 400,
      `Expected 400 for malformed projectId, got ${invalidProjRes.status}`
    );
    console.log("✔ Application filter by invalid projectId rejected with 400 Bad Request");

    // Test 47: Filter by Valid Student ID
    const studentFilterRes = await request(`/api/college/applications?studentId=${student1_Id}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      studentFilterRes.status === 200 &&
        Array.isArray(studentFilterRes.body.data) &&
        studentFilterRes.body.data.length === 2,
      `Expected 2 applications for student 1, got ${studentFilterRes.body.data?.length}`
    );
    console.log("✔ Application filter by valid studentId returns only that student's applications");

    // Test 48: Filter by Invalid Student ObjectId -> 400
    const invalidStudentRes = await request("/api/college/applications?studentId=invalid-student-id", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      invalidStudentRes.status === 400,
      `Expected 400 for malformed studentId, got ${invalidStudentRes.status}`
    );
    console.log("✔ Application filter by invalid studentId rejected with 400 Bad Request");

    // Test 49: Filter by Cross-College Student ID -> 404
    const crossStudentFilterRes = await request(`/api/college/applications?studentId=${studentB_Id}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      crossStudentFilterRes.status === 404,
      `Expected 404 when querying applications for another college's student, got ${crossStudentFilterRes.status}`
    );
    console.log("✔ Cross-college studentId filter rejected with 404 Not Found");

    // Test 50: Date Filtering - startDate only
    const startDateRes = await request(`/api/college/applications?startDate=${dateOneDayAgo}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      startDateRes.status === 200 &&
        Array.isArray(startDateRes.body.data) &&
        startDateRes.body.data.length === 3,
      `Expected 3 applications from yesterday onwards, got ${startDateRes.body.data?.length}`
    );
    console.log("✔ Application date filtering with startDate returns expected records");

    // Test 51: Date Filtering - endDate only
    const endDateRes = await request(`/api/college/applications?endDate=${dateOneDayAgo}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      endDateRes.status === 200 &&
        Array.isArray(endDateRes.body.data) &&
        endDateRes.body.data.length === 2,
      `Expected 2 applications up to yesterday, got ${endDateRes.body.data?.length}`
    );
    console.log("✔ Application date filtering with endDate returns expected records");

    // Test 52: Date Filtering - startDate + endDate range
    const rangeDateRes = await request(
      `/api/college/applications?startDate=${dateTwoDaysAgo}&endDate=${dateOneDayAgo}`,
      { headers: { Authorization: `Bearer ${tokenCollegeA}` } }
    );
    console.assert(
      rangeDateRes.status === 200 &&
        Array.isArray(rangeDateRes.body.data) &&
        rangeDateRes.body.data.length === 2,
      `Expected 2 applications within date range, got ${rangeDateRes.body.data?.length}`
    );
    console.log("✔ Application date filtering with startDate and endDate range works");

    // Test 53: Invalid Date Format -> 400
    const badDateFormatRes = await request("/api/college/applications?startDate=2026/08/25", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      badDateFormatRes.status === 400,
      `Expected 400 for invalid date format, got ${badDateFormatRes.status}`
    );
    console.log("✔ Invalid date format rejected with 400 Bad Request");

    // Test 54: Invalid Date Range (startDate > endDate) -> 400
    const badRangeRes = await request(
      `/api/college/applications?startDate=${dateToday}&endDate=${dateTwoDaysAgo}`,
      { headers: { Authorization: `Bearer ${tokenCollegeA}` } }
    );
    console.assert(
      badRangeRes.status === 400,
      `Expected 400 when startDate > endDate, got ${badRangeRes.status}`
    );
    console.log("✔ Invalid date range (startDate > endDate) rejected with 400 Bad Request");

    // Test 55: Pagination (page, limit, total, totalPages)
    const page1Res = await request("/api/college/applications?page=1&limit=2", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      page1Res.status === 200 &&
        page1Res.body.data.applications.length === 2 &&
        page1Res.body.data.pagination.total === 4 &&
        page1Res.body.data.pagination.page === 1 &&
        page1Res.body.data.pagination.limit === 2 &&
        page1Res.body.data.pagination.totalPages === 2,
      "Page 1 pagination metadata and item count match"
    );

    const page2Res = await request("/api/college/applications?page=2&limit=2", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      page2Res.status === 200 &&
        page2Res.body.data.applications.length === 2 &&
        page2Res.body.data.pagination.page === 2,
      "Page 2 pagination succeeds with remaining items"
    );
    console.log("✔ Pagination controls (page, limit, total, totalPages) verified");

    // Test 56: Pagination max limit enforcement
    const maxLimitRes = await request("/api/college/applications?page=1&limit=500", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      maxLimitRes.status === 200 &&
        maxLimitRes.body.data.pagination.limit === 100,
      `Expected limit capped at 100, got ${maxLimitRes.body.data.pagination.limit}`
    );
    console.log("✔ Pagination max limit capped at 100 safely");

    // Test 57: Combined Multi-Filter Query
    const multiFilterRes = await request(
      `/api/college/applications?status=Interview&companyId=${companyId}&studentId=${student1_Id}&page=1&limit=10`,
      { headers: { Authorization: `Bearer ${tokenCollegeA}` } }
    );
    console.assert(
      multiFilterRes.status === 200 &&
        multiFilterRes.body.data.applications.length === 1 &&
        multiFilterRes.body.data.applications[0]._id === filterApp4Id,
      "Multi-filter query should return only Application 4"
    );
    console.log("✔ Multi-filter query (status + company + student + pagination) verified");

    // Test 58: Cross-College Scoping through Filters
    const crossCollegeAppListRes = await request("/api/college/applications", {
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
    });
    console.assert(
      crossCollegeAppListRes.status === 200 &&
        Array.isArray(crossCollegeAppListRes.body.data) &&
        crossCollegeAppListRes.body.data.length === 1 &&
        crossCollegeAppListRes.body.data[0]._id === filterAppBId,
      "College B should only receive its own single application"
    );

    const crossCollegeStatusFilter = await request("/api/college/applications?status=Applied", {
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
    });
    console.assert(
      crossCollegeStatusFilter.status === 200 &&
        crossCollegeStatusFilter.body.data.length === 0,
      "College B filtering for Applied status should return 0 (no leakage from College A)"
    );
    console.log("✔ Cross-college application isolation strictly maintained across all filters");

    // ==========================================
    // --- PHASE 9: APPLICATION SUMMARY TESTS ---
    // ==========================================
    console.log("\n--- PHASE 9: APPLICATION SUMMARY TESTS ---");

    // Test 59: Application Summary for College A
    const summaryResA = await request("/api/college/applications/summary", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      summaryResA.status === 200,
      `Expected 200 on application summary, got ${summaryResA.status}`
    );
    console.assert(
      summaryResA.body.success === true,
      "Summary response success should be true"
    );

    const summaryDataA = summaryResA.body.data;
    console.assert(
      summaryDataA.totalApplications === 4,
      `Expected totalApplications 4, got ${summaryDataA.totalApplications}`
    );
    console.assert(
      summaryDataA.uniqueStudentsApplied === 3,
      `Expected uniqueStudentsApplied 3, got ${summaryDataA.uniqueStudentsApplied}`
    );
    console.assert(
      summaryDataA.placedCount === 1,
      `Expected placedCount 1, got ${summaryDataA.placedCount}`
    );
    console.assert(
      summaryDataA.placementRate === 33.33,
      `Expected placementRate 33.33, got ${summaryDataA.placementRate}`
    );

    // Verify all 6 status keys exist
    console.assert(
      summaryDataA.statusCounts["Applied"] === 1 &&
        summaryDataA.statusCounts["Under Review"] === 1 &&
        summaryDataA.statusCounts["Shortlisted"] === 0 &&
        summaryDataA.statusCounts["Interview"] === 1 &&
        summaryDataA.statusCounts["Selected"] === 1 &&
        summaryDataA.statusCounts["Rejected"] === 0,
      "Status counts must match expected counts for each status enum"
    );
    console.log("✔ Application summary metrics (totalApplications, statusCounts, uniqueStudentsApplied, placedCount, placementRate) verified");

    // Test 60: Summary for Zero-Application College (College C)
    const regResC = await request("/api/college/register", {
      method: "POST",
      body: {
        name: "Test College C",
        email: "collegec@testcollege.edu",
        phone: "9876543233",
        password: "Password123",
        university: "Zero Univ",
      },
    });
    const tokenCollegeC = regResC.body.data.token;

    const summaryResC = await request("/api/college/applications/summary", {
      headers: { Authorization: `Bearer ${tokenCollegeC}` },
    });
    console.assert(
      summaryResC.status === 200,
      `Expected 200 for zero-application summary, got ${summaryResC.status}`
    );
    const summaryDataC = summaryResC.body.data;
    console.assert(
      summaryDataC.totalApplications === 0 &&
        summaryDataC.uniqueStudentsApplied === 0 &&
        summaryDataC.placedCount === 0 &&
        summaryDataC.placementRate === 0,
      "Zero applications must return 0 counts and 0 placementRate without division errors"
    );
    console.assert(
      summaryDataC.statusCounts["Applied"] === 0 &&
        summaryDataC.statusCounts["Under Review"] === 0 &&
        summaryDataC.statusCounts["Shortlisted"] === 0 &&
        summaryDataC.statusCounts["Interview"] === 0 &&
        summaryDataC.statusCounts["Selected"] === 0 &&
        summaryDataC.statusCounts["Rejected"] === 0,
      "All status counts must be 0 for zero-application college"
    );
    console.log("✔ Zero-application college summary returns clean zeros without division-by-zero errors");

    // Test 61: Cross-College Summary Isolation (College B)
    const summaryResB = await request("/api/college/applications/summary", {
      headers: { Authorization: `Bearer ${tokenCollegeB}` },
    });
    console.assert(
      summaryResB.status === 200,
      `Expected 200 on College B summary, got ${summaryResB.status}`
    );
    const summaryDataB = summaryResB.body.data;
    console.assert(
      summaryDataB.totalApplications === 1 &&
        summaryDataB.uniqueStudentsApplied === 1 &&
        summaryDataB.placedCount === 1 &&
        summaryDataB.placementRate === 100 &&
        summaryDataB.statusCounts["Selected"] === 1 &&
        summaryDataB.statusCounts["Applied"] === 0,
      "College B summary must only reflect College B application data"
    );
    console.log("✔ Cross-college summary isolation verified (College B only counts College B applications)");

    // Test 62: Route Precedence Verification (GET /applications/summary is not captured by /applications/:id)
    const routePrecedenceCheck = await request("/api/college/applications/summary", {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      routePrecedenceCheck.status === 200 &&
        routePrecedenceCheck.body.data.totalApplications !== undefined,
      "Route /applications/summary must return summary object, not application by ID"
    );
    console.log("✔ Route precedence verified (/applications/summary resolved before /applications/:id)");

    // ==========================================
    // --- PHASE 10: REGRESSION & CRUD INTEGRITY CHECKS ---
    // ==========================================
    console.log("\n--- PHASE 10: REGRESSION & CRUD INTEGRITY CHECKS ---");

    // Test 63: Application Creation Still Works
    const regCreateAppRes = await request("/api/college/applications", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        student: student2_Id,
        recruiter: recruiterId,
        company: companyId,
        status: "Applied",
        remarks: "Regression create application",
      },
    });
    console.assert(
      regCreateAppRes.status === 201 && regCreateAppRes.body.data._id,
      "Regression create application must succeed with 201"
    );
    const regAppId = regCreateAppRes.body.data._id;
    console.log("✔ Regression: Application creation still works with 201");

    // Test 64: Application Get By ID Still Works
    const regGetAppRes = await request(`/api/college/applications/${regAppId}`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      regGetAppRes.status === 200 && regGetAppRes.body.data._id === regAppId,
      "Regression get application by ID must succeed with 200"
    );
    console.log("✔ Regression: Application get by ID still works with 200");

    // Test 65: Application Update & Status History Still Works
    const regUpdateAppRes = await request(`/api/college/applications/${regAppId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
      body: {
        status: "Interview",
        remarks: "Regression interview scheduled",
      },
    });
    console.assert(
      regUpdateAppRes.status === 200 && regUpdateAppRes.body.data.status === "Interview",
      "Regression update application status must succeed"
    );

    const regHistoryRes = await request(`/api/college/applications/${regAppId}/history`, {
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      regHistoryRes.status === 200 &&
        regHistoryRes.body.data.length === 2 &&
        regHistoryRes.body.data[0].newStatus === "Interview" &&
        regHistoryRes.body.data[0].oldStatus === "Applied",
      "Regression status history tracking verified"
    );
    console.log("✔ Regression: Application update & status history tracking verified");

    // Test 66: Application Delete & Cascade Still Works
    const regDelAppRes = await request(`/api/college/applications/${regAppId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenCollegeA}` },
    });
    console.assert(
      regDelAppRes.status === 200,
      "Regression delete application must succeed with 200"
    );

    const regHistoryAfterDel = await ApplicationStatusHistory.find({ application: regAppId });
    console.assert(
      regHistoryAfterDel.length === 0,
      "Regression status history cascade cleanup on delete verified"
    );
    console.log("✔ Regression: Application delete and status history cascade verified");

    console.log(`\n=== ALL COLLEGE BACKEND TESTS PASSED SUCCESSFULLY! (${passCount} assertions passed, ${failCount} failed) ===`);
  } catch (error) {
    console.error("\n❌ TEST SUITE FAILED WITH ERROR:", error);
    process.exitCode = 1;
  } finally {
    // Cleanup test data
    try {
      await College.deleteMany({ email: /@testcollege\.edu/ });
      await Student.deleteMany({ email: /@teststudent\.com/ });
      await Company.deleteMany({ name: "TestCorp" });
      await Recruiter.deleteMany({ email: "recruiter@testcorp.com" });
      await Project.deleteMany({ title: "Full Stack Engineer Project" });
      await Application.deleteMany({});
      await ApplicationStatusHistory.deleteMany({});
      await mongoose.disconnect();
    } catch (e) {}

    if (server) {
      server.close();
    }
  }
}

runTests();
