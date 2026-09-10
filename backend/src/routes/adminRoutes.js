import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getDashboardAnalytics,
  getAllStudents,
  getStudentById,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  updateCollegeStatus,
  deleteCollege,
  createRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  updateRecruiterStatus,
  deleteRecruiter,
  getAllCompanies,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  approveProject,
  rejectProject,
  deleteProject,
  getVerificationQueue,
  verifyCollege,
  verifyRecruiter,
  getPlacementOversight,
  getBroadcasts,
  createBroadcast,
  deleteBroadcast,
  getContentRoadmaps,
  createContentRoadmap,
  updateContentRoadmap,
  deleteContentRoadmap,
  getSupportTickets,
  getSupportTicketById,
  createSupportTicket,
  replySupportTicket,
  updateSupportTicketStatus,
  getPlatformAnalytics,
  getSystemSettings,
  updateSystemSettings,
  getAdminActivities,
} from "../controllers/adminController.js";

import { adminAuth, requireSuperAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// ==========================================
// 1. Public Authentication Routes
// ==========================================
router.post("/login", loginAdmin);
router.post("/auth/login", loginAdmin);

// ==========================================
// 2. Protected Profile & Account APIs
// ==========================================
router.get("/profile", adminAuth, getAdminProfile);
router.put("/profile", adminAuth, updateAdminProfile);
router.patch("/profile", adminAuth, updateAdminProfile);
router.post("/register", adminAuth, requireSuperAdmin, registerAdmin);

// ==========================================
// 3. Dashboard Analytics
// ==========================================
router.get("/dashboard", adminAuth, getDashboardAnalytics);

// ==========================================
// 4. Student Management
// ==========================================
router.get("/students", adminAuth, getAllStudents);
router.get("/students/:id", adminAuth, getStudentById);
router.patch("/students/:id/status", adminAuth, updateStudentStatus);
router.put("/students/:id", adminAuth, updateStudent);
router.delete("/students/:id", adminAuth, deleteStudent);

// ==========================================
// 5. College Management
// ==========================================
router.get("/colleges", adminAuth, getAllColleges);
router.post("/colleges", adminAuth, createCollege);
router.get("/colleges/:id", adminAuth, getCollegeById);
router.patch("/colleges/:id/status", adminAuth, updateCollegeStatus);
router.put("/colleges/:id", adminAuth, updateCollege);
router.delete("/colleges/:id", adminAuth, deleteCollege);

// ==========================================
// 6. Recruiter & Company Management
// ==========================================
router.get("/recruiters", adminAuth, getAllRecruiters);
router.post("/recruiters", adminAuth, createRecruiter);
router.get("/recruiters/:id", adminAuth, getRecruiterById);
router.patch("/recruiters/:id/status", adminAuth, updateRecruiterStatus);
router.put("/recruiters/:id", adminAuth, updateRecruiter);
router.delete("/recruiters/:id", adminAuth, deleteRecruiter);
router.get("/companies", adminAuth, getAllCompanies);

// ==========================================
// 7. Project & Job Moderation
// ==========================================
router.get("/projects", adminAuth, getAllProjects);
router.post("/projects", adminAuth, createProject);
router.put("/projects/:id/approve", adminAuth, approveProject);
router.patch("/projects/:id/approve", adminAuth, approveProject);
router.put("/projects/:id/approval", adminAuth, approveProject);
router.patch("/projects/:id/approval", adminAuth, approveProject);
router.put("/projects/:id/reject", adminAuth, rejectProject);
router.patch("/projects/:id/reject", adminAuth, rejectProject);
router.get("/projects/:id", adminAuth, getProjectById);
router.put("/projects/:id", adminAuth, updateProject);
router.delete("/projects/:id", adminAuth, deleteProject);

// ==========================================
// 8. Verification Queue & Action Endpoints
// ==========================================
router.get("/verifications", adminAuth, getVerificationQueue);
router.get("/verification-queue", adminAuth, getVerificationQueue);
router.put("/verifications/colleges/:id", adminAuth, verifyCollege);
router.patch("/verifications/colleges/:id", adminAuth, verifyCollege);
router.put("/colleges/:id/verify", adminAuth, verifyCollege);
router.patch("/colleges/:id/verify", adminAuth, verifyCollege);
router.put("/verifications/recruiters/:id", adminAuth, verifyRecruiter);
router.patch("/verifications/recruiters/:id", adminAuth, verifyRecruiter);
router.put("/recruiters/:id/verify", adminAuth, verifyRecruiter);
router.patch("/recruiters/:id/verify", adminAuth, verifyRecruiter);

// ==========================================
// 9. Placement Oversight
// ==========================================
router.get("/placements/overview", adminAuth, getPlacementOversight);
router.get("/placement-oversight", adminAuth, getPlacementOversight);

// ==========================================
// 10. Broadcast Control
// ==========================================
router.get("/broadcasts", adminAuth, getBroadcasts);
router.post("/broadcasts", adminAuth, createBroadcast);
router.delete("/broadcasts/:id", adminAuth, deleteBroadcast);

// ==========================================
// 11. Content Hub / Roadmaps
// ==========================================
router.get("/content/roadmaps", adminAuth, getContentRoadmaps);
router.get("/content-roadmaps", adminAuth, getContentRoadmaps);
router.post("/content/roadmaps", adminAuth, createContentRoadmap);
router.post("/content-roadmaps", adminAuth, createContentRoadmap);
router.put("/content/roadmaps/:id", adminAuth, updateContentRoadmap);
router.put("/content-roadmaps/:id", adminAuth, updateContentRoadmap);
router.delete("/content/roadmaps/:id", adminAuth, deleteContentRoadmap);
router.delete("/content-roadmaps/:id", adminAuth, deleteContentRoadmap);

// ==========================================
// 12. Support Center
// ==========================================
router.get("/support/tickets", adminAuth, getSupportTickets);
router.get("/support-tickets", adminAuth, getSupportTickets);
router.post("/support/tickets", adminAuth, createSupportTicket);
router.post("/support-tickets", adminAuth, createSupportTicket);
router.post("/support/tickets/:id/reply", adminAuth, replySupportTicket);
router.post("/support-tickets/:id/reply", adminAuth, replySupportTicket);
router.put("/support/tickets/:id/status", adminAuth, updateSupportTicketStatus);
router.put("/support-tickets/:id/status", adminAuth, updateSupportTicketStatus);
router.get("/support/tickets/:id", adminAuth, getSupportTicketById);
router.get("/support-tickets/:id", adminAuth, getSupportTicketById);

// ==========================================
// 13. Platform Deep Analytics
// ==========================================
router.get("/analytics", adminAuth, getPlatformAnalytics);

// ==========================================
// 14. System Settings (Super Admin Restricted)
// ==========================================
router.get("/settings", adminAuth, getSystemSettings);
router.put("/settings", adminAuth, requireSuperAdmin, updateSystemSettings);

// ==========================================
// 15. Activity / Audit Logs
// ==========================================
router.get("/activity", adminAuth, getAdminActivities);

export default router;