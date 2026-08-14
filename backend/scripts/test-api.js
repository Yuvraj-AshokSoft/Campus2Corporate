import "dotenv/config";
import http from "http";
import jwt from "jsonwebtoken";

const PORT = process.env.TEST_PORT || 5001;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let recruiterToken = "";
let recruiterId = "";
let jobId = "";
let collegeToken = "";
let collegeId = "";
let studentId = "";

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const bodyString = data ? JSON.stringify(data) : "";

    const reqHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (data) {
      reqHeaders["Content-Length"] = Buffer.byteLength(bodyString);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: body });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (data) {
      req.write(bodyString);
    }
    req.end();
  });
}

function recordTest(name, success, details) {
  if (success) {
    results.passed++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    results.failed++;
    console.error(`❌ [FAIL] ${name}:`, details);
  }
  results.tests.push({ name, success, details });
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🚀 STARTING BACKEND E2E API VERIFICATION TEST SUITE");
  console.log("=======================================================\n");

  const timestamp = Date.now();

  try {
    // ---------------------------------------------------------
    // 1. RECRUITER MODULE TESTS
    // ---------------------------------------------------------
    console.log("\n--- [1/3] TESTING RECRUITER BACKEND MODULE ---");

    // Test 1.1: Recruiter Registration
    const regRes = await request("POST", "/api/recruiter/auth/register", {
      name: "Jane Recruiter",
      email: `recruiter_${timestamp}@techcorp.com`,
      phone: "9876543210",
      password: "RecruiterPassword123!",
      designation: "Lead Talent Acquisition",
      companyName: `TechCorp Solutions ${timestamp}`,
      industry: "Information Technology",
      website: "https://techcorp.example.com",
      location: "Bangalore, India",
    });

    recordTest(
      "Recruiter Registration (POST /api/recruiter/auth/register)",
      regRes.status === 201 && regRes.data.success && regRes.data.data.token,
      regRes.raw
    );

    if (regRes.data?.data?.token) {
      recruiterToken = regRes.data.data.token;
      recruiterId = regRes.data.data.recruiter._id;
    }

    // Test 1.2: Recruiter Login
    const loginRes = await request("POST", "/api/recruiter/auth/login", {
      email: `recruiter_${timestamp}@techcorp.com`,
      password: "RecruiterPassword123!",
    });

    recordTest(
      "Recruiter Login (POST /api/recruiter/auth/login)",
      loginRes.status === 200 && loginRes.data.success && loginRes.data.data.token,
      loginRes.raw
    );

    // Test 1.3: Get Recruiter Profile
    const profileRes = await request("GET", "/api/recruiter/profile", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Recruiter Profile (GET /api/recruiter/profile)",
      profileRes.status === 200 && profileRes.data.success && profileRes.data.data.email === `recruiter_${timestamp}@techcorp.com`,
      profileRes.raw
    );

    // Test 1.4: Update Recruiter Profile & Company Details
    const updateProfileRes = await request("PUT", "/api/recruiter/profile", {
      designation: "Senior TA Director",
      linkedin: "https://linkedin.com/in/janerecruiter",
      companyDetails: {
        industry: "Cloud & AI Computing",
      },
    }, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Update Recruiter Profile & Company (PUT /api/recruiter/profile)",
      updateProfileRes.status === 200 &&
        updateProfileRes.data.success &&
        updateProfileRes.data.data.designation === "Senior TA Director" &&
        updateProfileRes.data.data.company.industry === "Cloud & AI Computing",
      updateProfileRes.raw
    );

    // Test 1.5: Get Recruiter Dashboard
    const dashRes = await request("GET", "/api/recruiter/dashboard", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Recruiter Dashboard (GET /api/recruiter/dashboard)",
      dashRes.status === 200 && dashRes.data.success && dashRes.data.data.stats,
      dashRes.raw
    );

    // Test 1.6: Create Job Post
    const createJobRes = await request("POST", "/api/recruiter/jobs", {
      title: "Senior Full Stack Engineer",
      description: "Looking for an experienced React and Node.js developer to build enterprise scalable solutions.",
      requiredSkills: ["Node.js", "Express", "MongoDB", "React", "TypeScript"],
      duration: "6 Months",
      stipend: 35000,
      location: "Bangalore / Hybrid",
      mode: "Hybrid",
      openings: 5,
      applicationDeadline: "2026-12-31",
    }, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Create Job Post (POST /api/recruiter/jobs)",
      createJobRes.status === 201 && createJobRes.data.success && createJobRes.data.data._id,
      createJobRes.raw
    );

    if (createJobRes.data?.data?._id) {
      jobId = createJobRes.data.data._id;
    }

    // Test 1.7: Get Recruiter Jobs
    const getJobsRes = await request("GET", "/api/recruiter/jobs", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Recruiter Jobs (GET /api/recruiter/jobs)",
      getJobsRes.status === 200 && getJobsRes.data.success && Array.isArray(getJobsRes.data.data) && getJobsRes.data.data.length >= 1,
      getJobsRes.raw
    );

    // Test 1.8: Get Job by ID
    const getJobIdRes = await request("GET", `/api/recruiter/jobs/${jobId}`, null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Job by ID (GET /api/recruiter/jobs/:id)",
      getJobIdRes.status === 200 && getJobIdRes.data.success && getJobIdRes.data.data.project.title === "Senior Full Stack Engineer",
      getJobIdRes.raw
    );

    // Test 1.9: Update Job Post
    const updateJobRes = await request("PUT", `/api/recruiter/jobs/${jobId}`, {
      stipend: 40000,
      requiredSkills: "Node.js, Express, MongoDB, Next.js, Docker",
    }, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Update Job Post (PUT /api/recruiter/jobs/:id)",
      updateJobRes.status === 200 &&
        updateJobRes.data.success &&
        updateJobRes.data.data.stipend === 40000 &&
        Array.isArray(updateJobRes.data.data.requiredSkills) &&
        updateJobRes.data.data.requiredSkills.includes("Next.js"),
      updateJobRes.raw
    );

    // Test 1.10: Candidate Pool Search
    const candRes = await request("GET", "/api/recruiter/candidates?skill=Node", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Search Candidate Pool (GET /api/recruiter/candidates)",
      candRes.status === 200 && candRes.data.success && Array.isArray(candRes.data.data),
      candRes.raw
    );

    // Test 1.11: Applications Queue
    const appRes = await request("GET", "/api/recruiter/applications", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Recruiter Applications (GET /api/recruiter/applications)",
      appRes.status === 200 && appRes.data.success && Array.isArray(appRes.data.data),
      appRes.raw
    );

    // Test 1.12: Interviews Queue
    const intRes = await request("GET", "/api/recruiter/interviews", null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Get Recruiter Interviews (GET /api/recruiter/interviews)",
      intRes.status === 200 && intRes.data.success && Array.isArray(intRes.data.data),
      intRes.raw
    );

    // ---------------------------------------------------------
    // 2. COLLEGE MODULE TESTS
    // ---------------------------------------------------------
    console.log("\n--- [2/3] TESTING COLLEGE BACKEND MODULE ---");

    // Test 2.1: College Registration
    const colRegRes = await request("POST", "/api/college/auth/register", {
      name: "National Institute of Technology",
      email: `college_${timestamp}@nit.edu`,
      phone: "9123456789",
      password: "CollegePassword123!",
      code: "NIT-2026",
      website: "https://nit.edu",
      city: "Bangalore",
      state: "Karnataka",
      placementOfficerName: "Dr. Robert Smith",
      placementOfficerEmail: "placements@nit.edu",
      placementOfficerPhone: "9123456780",
    });

    recordTest(
      "College Registration (POST /api/college/auth/register)",
      colRegRes.status === 201 && colRegRes.data.success && colRegRes.data.data.token,
      colRegRes.raw
    );

    if (colRegRes.data?.data?.token) {
      collegeToken = colRegRes.data.data.token;
      collegeId = colRegRes.data.data.college._id;
    }

    // Test 2.2: College Login
    const colLoginRes = await request("POST", "/api/college/auth/login", {
      email: `college_${timestamp}@nit.edu`,
      password: "CollegePassword123!",
    });

    recordTest(
      "College Login (POST /api/college/auth/login)",
      colLoginRes.status === 200 && colLoginRes.data.success && colLoginRes.data.data.token,
      colLoginRes.raw
    );

    // Test 2.3: Get College Profile
    const colProfileRes = await request("GET", "/api/college/profile", null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Get College Profile (GET /api/college/profile)",
      colProfileRes.status === 200 && colProfileRes.data.success && colProfileRes.data.data.email === `college_${timestamp}@nit.edu`,
      colProfileRes.raw
    );

    // Test 2.4: Update College Profile
    const updateColProfileRes = await request("PUT", "/api/college/profile", {
      description: "Premier Engineering & Technical Institute",
      address: "Campus Road, Tech Hub Zone",
    }, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Update College Profile (PUT /api/college/profile)",
      updateColProfileRes.status === 200 &&
        updateColProfileRes.data.success &&
        updateColProfileRes.data.data.description === "Premier Engineering & Technical Institute",
      updateColProfileRes.raw
    );

    // Test 2.5: Add Student to College Pool
    const addStudentRes = await request("POST", "/api/college/students", {
      name: "Alice Developer",
      email: `student_${timestamp}@nit.edu`,
      phone: "9876123456",
      branch: "Computer Science & Engineering",
      semester: 8,
      skills: ["React", "Node.js", "Python", "MongoDB"],
    }, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Add Student to College (POST /api/college/students)",
      addStudentRes.status === 201 && addStudentRes.data.success && addStudentRes.data.data._id,
      addStudentRes.raw
    );

    if (addStudentRes.data?.data?._id) {
      studentId = addStudentRes.data.data._id;
    }

    // Test 2.6: Get College Students
    const getColStudentsRes = await request("GET", "/api/college/students", null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Get College Students List (GET /api/college/students)",
      getColStudentsRes.status === 200 && getColStudentsRes.data.success && Array.isArray(getColStudentsRes.data.data) && getColStudentsRes.data.data.length >= 1,
      getColStudentsRes.raw
    );

    // Test 2.7: Get Single Student by ID
    const getColStudentIdRes = await request("GET", `/api/college/students/${studentId}`, null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Get Student Details by ID (GET /api/college/students/:id)",
      getColStudentIdRes.status === 200 && getColStudentIdRes.data?.success && getColStudentIdRes.data?.data?.student?.name === "Alice Developer",
      getColStudentIdRes.raw
    );

    // Test 2.8: Update Student Details
    const updateStudentRes = await request("PUT", `/api/college/students/${studentId}`, {
      semester: 8,
      skills: ["React", "Node.js", "Python", "MongoDB", "GraphQL"],
    }, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Update Student in College Pool (PUT /api/college/students/:id)",
      updateStudentRes.status === 200 &&
        updateStudentRes.data.success &&
        Array.isArray(updateStudentRes.data.data.skills) &&
        updateStudentRes.data.data.skills.includes("GraphQL"),
      updateStudentRes.raw
    );

    // Test 2.9: Get College Dashboard
    const colDashRes = await request("GET", "/api/college/dashboard", null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Get College Dashboard (GET /api/college/dashboard)",
      colDashRes.status === 200 && colDashRes.data.success && colDashRes.data.data.stats.totalStudents >= 1,
      colDashRes.raw
    );

    // Test 2.10: Get Placement Drives Overview
    const colDrivesRes = await request("GET", "/api/college/drives", null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Get Placement Drives Overview (GET /api/college/drives)",
      colDrivesRes.status === 200 && colDrivesRes.data.success && Array.isArray(colDrivesRes.data.data),
      colDrivesRes.raw
    );

    // Test 2.11: Delete / Unlink Student from College
    const delStudentRes = await request("DELETE", `/api/college/students/${studentId}`, null, {
      Authorization: `Bearer ${collegeToken}`,
    });

    recordTest(
      "Remove Student from College Pool (DELETE /api/college/students/:id)",
      delStudentRes.status === 200 && delStudentRes.data.success,
      delStudentRes.raw
    );

    // Test 1.13: Delete Job Post (Clean up job)
    const delJobRes = await request("DELETE", `/api/recruiter/jobs/${jobId}`, null, {
      Authorization: `Bearer ${recruiterToken}`,
    });

    recordTest(
      "Delete Job Post (DELETE /api/recruiter/jobs/:id)",
      delJobRes.status === 200 && delJobRes.data.success,
      delJobRes.raw
    );

    // ---------------------------------------------------------
    // 3. AUTHENTICATION & SECURITY ERROR HANDLING TESTS
    // ---------------------------------------------------------
    console.log("\n--- [3/3] TESTING AUTH & MIDDLEWARE ERROR HANDLING ---");

    // Test 3.1: Access protected route without token -> 401
    const noTokenRes = await request("GET", "/api/recruiter/profile");
    recordTest(
      "Unauthorized Access without Bearer Token (Expect 401)",
      noTokenRes.status === 401 && noTokenRes.data.success === false,
      noTokenRes.raw
    );

    // Test 3.2: Access protected route with invalid token -> 401
    const invalidTokenRes = await request("GET", "/api/recruiter/profile", null, {
      Authorization: "Bearer invalid_token_xyz_123",
    });
    recordTest(
      "Unauthorized Access with Malformed JWT Token (Expect 401)",
      invalidTokenRes.status === 401 && invalidTokenRes.data.success === false,
      invalidTokenRes.raw
    );

    // Test 3.3: Cross-role route access (College token on Recruiter route) -> 403
    const crossRoleRes = await request("GET", "/api/recruiter/profile", null, {
      Authorization: `Bearer ${collegeToken}`,
    });
    recordTest(
      "Forbidden Cross-Role Authorization Check (Expect 403)",
      crossRoleRes.status === 403 && crossRoleRes.data.success === false,
      crossRoleRes.raw
    );

    // Test 3.4: Role-less JWT Token Access -> 403
    const rolelessToken = jwt.sign({ id: recruiterId }, process.env.JWT_SECRET || "fallback_jwt_secret_key_123456");
    const rolelessRes = await request("GET", "/api/recruiter/profile", null, {
      Authorization: `Bearer ${rolelessToken}`,
    });
    recordTest(
      "Forbidden Access for Token Without Role Claim (Expect 403)",
      rolelessRes.status === 403 && rolelessRes.data.success === false,
      rolelessRes.raw
    );

    // Test 3.5: Non-existent route 404
    const notFoundRes = await request("GET", "/api/nonexistent/route");
    recordTest(
      "Route Not Found Handler (Expect 404)",
      notFoundRes.status === 404,
      notFoundRes.raw
    );

  } catch (err) {
    console.error("Critical error in test runner execution:", err);
  }

  console.log("\n=======================================================");
  console.log(`📊 API TEST SUMMARY RESULTS`);
  console.log(`Total Tests Run : ${results.tests.length}`);
  console.log(`Passed          : ${results.passed}`);
  console.log(`Failed          : ${results.failed}`);
  console.log("=======================================================\n");

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
