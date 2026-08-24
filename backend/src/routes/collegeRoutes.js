import express from "express";
import collegeAuthMiddleware from "../middleware/collegeAuthMiddleware.js";
import {
  registerCollege,
  loginCollege,
  getCollegeProfile,
  updateCollegeProfile,
  getCollegeDashboard,
  createStudent,
  bulkImportStudents,
  exportStudentsCSV,
  bulkUpdateStudents,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createApplication,
  getApplicationSummary,
  getApplicationStatusHistory,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getEligibleStudents,
  getCollegeDrives,
  addStudentToCollege,
  getCollegeStudents,
  getCollegeStudentById,
  updateCollegeStudent,
  deleteCollegeStudent,
} from "../controllers/collegeController.js";

const router = express.Router();

// ==========================
// Public Auth Routes
// ==========================
router.post("/register", registerCollege);
router.post("/auth/register", registerCollege);
router.post("/login", loginCollege);
router.post("/auth/login", loginCollege);

// ==========================
// Protected Profile Routes
// ==========================
router.get("/profile", collegeAuthMiddleware, getCollegeProfile);
router.put("/profile", collegeAuthMiddleware, updateCollegeProfile);
router.patch("/profile", collegeAuthMiddleware, updateCollegeProfile);

// ==========================
// Dashboard & Drives
// ==========================
router.get("/dashboard", collegeAuthMiddleware, getCollegeDashboard);
router.get("/drives", collegeAuthMiddleware, getCollegeDrives);

// ==========================
// Student Pool Management
// ==========================
router.post("/students/bulk-import", collegeAuthMiddleware, bulkImportStudents);
router.get("/students/export", collegeAuthMiddleware, exportStudentsCSV);
router.patch("/students/bulk", collegeAuthMiddleware, bulkUpdateStudents);
router.post("/students", collegeAuthMiddleware, createStudent);
router.get("/students", collegeAuthMiddleware, getAllStudents);
router.get("/students/eligible", collegeAuthMiddleware, getEligibleStudents);
router.get("/students/:id", collegeAuthMiddleware, getStudentById);
router.put("/students/:id", collegeAuthMiddleware, updateStudent);
router.patch("/students/:id", collegeAuthMiddleware, updateStudent);
router.delete("/students/:id", collegeAuthMiddleware, deleteStudent);

// ==========================
// Application Management
// ==========================
router.get("/applications/summary", collegeAuthMiddleware, getApplicationSummary);
router.get("/applications/:id/history", collegeAuthMiddleware, getApplicationStatusHistory);
router.post("/applications", collegeAuthMiddleware, createApplication);
router.get("/applications", collegeAuthMiddleware, getAllApplications);
router.get("/applications/:id", collegeAuthMiddleware, getApplicationById);
router.put("/applications/:id", collegeAuthMiddleware, updateApplication);
router.patch("/applications/:id", collegeAuthMiddleware, updateApplication);
router.delete("/applications/:id", collegeAuthMiddleware, deleteApplication);

// ==========================
// Project Management
// ==========================
router.post("/projects", collegeAuthMiddleware, createProject);
router.get("/projects", collegeAuthMiddleware, getAllProjects);
router.get("/projects/:id", collegeAuthMiddleware, getProjectById);
router.put("/projects/:id", collegeAuthMiddleware, updateProject);
router.delete("/projects/:id", collegeAuthMiddleware, deleteProject);

export default router;