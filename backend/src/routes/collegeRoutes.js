import express from "express";
import {
  registerCollege,
  loginCollege,
  getCollegeProfile,
  getCollegeDashboard,
  getCollegeDashboardStats,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  createCollegeProject,
  getCollegeProjects,
  getCollegeProjectById,
  updateCollegeProject,
  deleteCollegeProject,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getEligibleStudents,
  createPlacementDrive,
  getPlacementDrives,
  getPlacementDriveById,
  updatePlacementDrive,
  deletePlacementDrive,
  createBroadcast,
  getBroadcasts,
  getBroadcastById,
  updateBroadcast,
  deleteBroadcast,
  getCoordinatingCompanies,
  getCompanyDetailsForCollege,
  getCoordinatingRecruiters
} from "../controllers/collegeController.js";

import collegeAuth from "../middleware/collegeAuth.js";

const router = express.Router();

// Public Routes
router.post("/register", registerCollege);
router.post("/login", loginCollege);

// Protected Routes
router.get("/profile", collegeAuth, getCollegeProfile);
router.get("/dashboard", collegeAuth, getCollegeDashboardStats);

// Student Management
router.post("/students", collegeAuth, createStudent);
router.get("/students", collegeAuth, getAllStudents);
router.get("/students/eligible", collegeAuth, getEligibleStudents);
router.get("/students/:id", collegeAuth, getStudentById);
router.put("/students/:id", collegeAuth, updateStudent);
router.delete("/students/:id", collegeAuth, deleteStudent);

// Application Management
router.post("/applications", collegeAuth, createApplication);
router.get("/applications", collegeAuth, getAllApplications);
router.get("/applications/:id", collegeAuth, getApplicationById);
router.put("/applications/:id", collegeAuth, updateApplication);
router.delete("/applications/:id", collegeAuth, deleteApplication);

// Project Management
router.post("/projects", collegeAuth, createCollegeProject);
router.get("/projects", collegeAuth, getCollegeProjects);
router.get("/projects/:id", collegeAuth, getCollegeProjectById);
router.put("/projects/:id", collegeAuth, updateCollegeProject);
router.delete("/projects/:id", collegeAuth, deleteCollegeProject);

// Placement Drive Management
router.post("/drives", collegeAuth, createPlacementDrive);
router.get("/drives", collegeAuth, getPlacementDrives);
router.get("/drives/:id", collegeAuth, getPlacementDriveById);
router.put("/drives/:id", collegeAuth, updatePlacementDrive);
router.delete("/drives/:id", collegeAuth, deletePlacementDrive);

// Broadcast / Announcement Management
router.post("/broadcasts", collegeAuth, createBroadcast);
router.get("/broadcasts", collegeAuth, getBroadcasts);
router.get("/broadcasts/:id", collegeAuth, getBroadcastById);
router.put("/broadcasts/:id", collegeAuth, updateBroadcast);
router.delete("/broadcasts/:id", collegeAuth, deleteBroadcast);

// Recruiter & Company Coordination
router.get("/companies", collegeAuth, getCoordinatingCompanies);
router.get("/companies/:id", collegeAuth, getCompanyDetailsForCollege);
router.get("/recruiters", collegeAuth, getCoordinatingRecruiters);

export default router;