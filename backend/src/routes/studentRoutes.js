import express from "express";

import studentAuthMiddleware from "../middleware/studentAuthMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

import {
  addStudentCertificate,
  addStudentSkill,
  applyToProject,
  calculateAndStoreSkillScore,
  deleteStudentCertificate,
  deleteStudentNotification,
  deleteStudentSkill,
  getAssignments,
  getHiringDrives,
  getHiringDriveDetails,
  getDriveAssessment,
  getLearningModules,
  getLearningProgressHistory,
  getQuizzes,
  getSkillScore,
  getStudentApplicationById,
  getStudentApplications,
  getStudentCertificates,
  getStudentDashboard,
  getStudentNotifications,
  getStudentProfile,
  getStudentProjects,
  getOpportunities,
  getStudentResumeBuilder,
  getStudentSettings,
  getStudentSkills,
  loginStudent,
  logoutStudent,
  markAllNotificationsRead,
  markModuleComplete,
  markNotificationRead,
  registerStudent,
  saveStudentResumeBuilder,
  startHiringDrive,
  submitAssignment,
  submitQuiz,
  updateLearningProgress,
  updateStudentCertificate,
  updateStudentProfile,
  updateStudentSettings,
  updateStudentSkill,
  withdrawStudentApplication,
} from "../controllers/studentController.js";

const router = express.Router();

/*
 * =========================================================
 * STUDENT AUTHENTICATION
 * =========================================================
 */

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/logout", studentAuthMiddleware, logoutStudent);

router.post("/auth/register", registerStudent);
router.post("/auth/login", loginStudent);
router.post("/auth/logout", studentAuthMiddleware, logoutStudent);

/*
 * =========================================================
 * STUDENT DASHBOARD
 * =========================================================
 */

router.get("/dashboard", studentAuthMiddleware, getStudentDashboard);

/*
 * =========================================================
 * STUDENT PROFILE
 * =========================================================
 */

router.get("/auth/me", studentAuthMiddleware, getStudentProfile);
router.get("/me", studentAuthMiddleware, getStudentProfile);
router.get("/profile", studentAuthMiddleware, getStudentProfile);
router.put("/profile", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile", studentAuthMiddleware, updateStudentProfile);
router.put("/profile/details", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile/details", studentAuthMiddleware, updateStudentProfile);
router.put("/profile/education", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile/education", studentAuthMiddleware, updateStudentProfile);

/*
 * =========================================================
 * PROJECTS & APPLICATIONS
 * =========================================================
 */

router.get("/projects", studentAuthMiddleware, getStudentProjects);
router.get("/opportunities", studentAuthMiddleware, getOpportunities);
router.post("/projects/:projectId/apply", studentAuthMiddleware, applyToProject);

router.get("/applications", studentAuthMiddleware, getStudentApplications);
router.get("/applications/:applicationId", studentAuthMiddleware, getStudentApplicationById);
router.delete("/applications/:applicationId", studentAuthMiddleware, withdrawStudentApplication);

/*
 * =========================================================
 * NOTIFICATIONS
 * =========================================================
 */

router.get("/notifications", studentAuthMiddleware, getStudentNotifications);
router.patch("/notifications/all/read", studentAuthMiddleware, markAllNotificationsRead);
router.patch("/notifications/:id/read", studentAuthMiddleware, markNotificationRead);
router.delete("/notifications/:id", studentAuthMiddleware, deleteStudentNotification);

/*
 * =========================================================
 * CERTIFICATES
 * =========================================================
 */

router.get("/certificates", studentAuthMiddleware, getStudentCertificates);
router.post("/certificates", studentAuthMiddleware, addStudentCertificate);
router.put("/certificates/:id", studentAuthMiddleware, updateStudentCertificate);
router.delete("/certificates/:id", studentAuthMiddleware, deleteStudentCertificate);

/*
 * =========================================================
 * SETTINGS
 * =========================================================
 */

router.get("/settings", studentAuthMiddleware, getStudentSettings);
router.put("/settings", studentAuthMiddleware, updateStudentSettings);

/*
 * =========================================================
 * RESUME BUILDER
 * =========================================================
 */

router.get("/resume-builder", studentAuthMiddleware, getStudentResumeBuilder);
router.put("/resume-builder", studentAuthMiddleware, saveStudentResumeBuilder);

/*
 * =========================================================
 * STUDENT SKILLS
 * =========================================================
 */

router.get("/skills", studentAuthMiddleware, getStudentSkills);
router.post("/skills", studentAuthMiddleware, addStudentSkill);
router.put("/skills/:skillId", studentAuthMiddleware, updateStudentSkill);
router.patch("/skills/:skillId", studentAuthMiddleware, updateStudentSkill);
router.delete("/skills/:skillId", studentAuthMiddleware, deleteStudentSkill);

/*
 * =========================================================
 * LEARNING
 * =========================================================
 */

router.get("/learning/modules", studentAuthMiddleware, getLearningModules);
router.get("/learning/progress/history", studentAuthMiddleware, getLearningProgressHistory);
router.get("/learning/modules/:moduleId/history", studentAuthMiddleware, getLearningProgressHistory);
router.put("/learning/modules/:moduleId/progress", studentAuthMiddleware, updateLearningProgress);
router.patch("/learning/modules/:moduleId/progress", studentAuthMiddleware, updateLearningProgress);
router.post("/learning/progress", studentAuthMiddleware, updateLearningProgress);
router.post("/learning/modules/:moduleId/complete", studentAuthMiddleware, markModuleComplete);

/*
 * =========================================================
 * ASSIGNMENTS
 * =========================================================
 */

router.get("/assignments", studentAuthMiddleware, getAssignments);
router.post("/assignments/submit", studentAuthMiddleware, submitAssignment);
router.post("/assignments/:assignmentId/submit", studentAuthMiddleware, submitAssignment);

/*
 * =========================================================
 * QUIZZES
 * =========================================================
 */

router.get("/quizzes", studentAuthMiddleware, getQuizzes);
router.post("/quizzes/submit", studentAuthMiddleware, submitQuiz);
router.post("/quizzes/:quizId/submit", studentAuthMiddleware, submitQuiz);

/*
 * =========================================================
 * SKILL SCORE
 * =========================================================
 */

router.get("/skill-score", studentAuthMiddleware, getSkillScore);
router.get("/score", studentAuthMiddleware, getSkillScore);
router.post("/skill-score/calculate", studentAuthMiddleware, calculateAndStoreSkillScore);

/*
 * =========================================================
 * HIRING PROCESS & DRIVES
 * =========================================================
 */

router.get("/hiring/drives", studentAuthMiddleware, getHiringDrives);
router.get("/hiring/drives/:driveId", studentAuthMiddleware, getHiringDriveDetails);
router.get("/hiring/drives/:driveId/assessment", studentAuthMiddleware, getDriveAssessment);
router.post(
  "/hiring/drives/:driveId/start",
  studentAuthMiddleware,
  uploadResume,
  startHiringDrive,
);

export default router;