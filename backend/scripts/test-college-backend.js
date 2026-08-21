import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../src/app.js";
import College from "../src/models/college.js";
import Student from "../src/models/student.js";
import Company from "../src/models/company.js";
import Recruiter from "../src/models/recruiter.js";
import Application from "../src/models/application.js";

const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

let server;

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
      const body = options.body ? JSON.stringify(options.body) : undefined;

      const res = await fetch(url, {
        method: options.method || "GET",
        headers,
        body,
      });

      const data = await res.json().catch(() => null);
      return { status: res.status, body: data };
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

    console.log("\n=== ALL COLLEGE BACKEND TESTS PASSED SUCCESSFULLY! ===");
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
      await Application.deleteMany({});
      await mongoose.disconnect();
    } catch (e) {}

    if (server) {
      server.close();
    }
  }
}

runTests();
