import express from "express";
import collegeAuthMiddleware from "../middleware/collegeAuthMiddleware.js";
import {
  registerCollege,
  loginCollege,
  getCollegeProfile,
  updateCollegeProfile,
  getCollegeDashboard,
  addStudentToCollege,
  getCollegeStudents,
  getCollegeStudentById,
  updateCollegeStudent,
  deleteCollegeStudent,
  getCollegeDrives,
} from "../controllers/collegeController.js";

const router = express.Router();

// ==========================
// Public Auth Routes
// ==========================
router.post("/auth/register", registerCollege);
router.post("/auth/login", loginCollege);

// ==========================
// Protected Profile Routes
// ==========================
router.get("/profile", collegeAuthMiddleware, getCollegeProfile);
router.put("/profile", collegeAuthMiddleware, updateCollegeProfile);
router.patch("/profile", collegeAuthMiddleware, updateCollegeProfile);

// ==========================
// Dashboard Analytics
// ==========================
router.get("/dashboard", collegeAuthMiddleware, getCollegeDashboard);

// ==========================
// Student Pool Management
// ==========================
router.post("/students", collegeAuthMiddleware, addStudentToCollege);
router.get("/students", collegeAuthMiddleware, getCollegeStudents);
router.get("/students/:id", collegeAuthMiddleware, getCollegeStudentById);
router.put("/students/:id", collegeAuthMiddleware, updateCollegeStudent);
router.patch("/students/:id", collegeAuthMiddleware, updateCollegeStudent);
router.delete("/students/:id", collegeAuthMiddleware, deleteCollegeStudent);

// ==========================
// Placement Drives Overview
// ==========================
router.get("/drives", collegeAuthMiddleware, getCollegeDrives);

export default router;
