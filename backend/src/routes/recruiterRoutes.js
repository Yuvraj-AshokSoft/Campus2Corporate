import express from "express";
import recruiterAuthMiddleware from "../middleware/recruiterAuthMiddleware.js";
import {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile,
  updateRecruiterProfile,
  getRecruiterDashboard,
  createJob,
  getRecruiterJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidates,
  getInterviews,
} from "../controllers/recruiterController.js";

const router = express.Router();

// ==========================
// Public Auth Routes
// ==========================
router.post("/auth/register", registerRecruiter);
router.post("/auth/login", loginRecruiter);

// ==========================
// Protected Profile Routes
// ==========================
router.get("/profile", recruiterAuthMiddleware, getRecruiterProfile);
router.put("/profile", recruiterAuthMiddleware, updateRecruiterProfile);
router.patch("/profile", recruiterAuthMiddleware, updateRecruiterProfile);

// ==========================
// Dashboard Analytics
// ==========================
router.get("/dashboard", recruiterAuthMiddleware, getRecruiterDashboard);

// ==========================
// Job Management (Projects)
// ==========================
router.post("/jobs", recruiterAuthMiddleware, createJob);
router.get("/jobs", recruiterAuthMiddleware, getRecruiterJobs);
router.get("/jobs/:id", recruiterAuthMiddleware, getJobById);
router.put("/jobs/:id", recruiterAuthMiddleware, updateJob);
router.patch("/jobs/:id", recruiterAuthMiddleware, updateJob);
router.delete("/jobs/:id", recruiterAuthMiddleware, deleteJob);

// ==========================
// Applications Management
// ==========================
router.get("/applications", recruiterAuthMiddleware, getRecruiterApplications);
router.patch(
  "/applications/:id/status",
  recruiterAuthMiddleware,
  updateApplicationStatus
);

// ==========================
// Candidate Search & Interviews
// ==========================
router.get("/candidates", recruiterAuthMiddleware, getCandidates);
router.get("/interviews", recruiterAuthMiddleware, getInterviews);

export default router;
