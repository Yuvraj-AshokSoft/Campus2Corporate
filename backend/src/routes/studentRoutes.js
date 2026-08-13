import express from "express";
import studentAuthMiddleware from "../middleware/studentAuthMiddleware.js";

import {
  applyToProject,
  deleteStudentNotification,
  getAvailableProjects,
  getHiringDrives,
  getResumeBuilder,
  getStudentApplications,
  getStudentCertificates,
  getStudentDashboard,
  getStudentNotifications,
  getStudentProfile,
  getStudentSettings,
  markNotificationRead,
  saveResumeBuilder,
  updateStudentSettings,
  updateStudentProfile,

  getStudentSkills,
  addStudentSkill,
  updateStudentSkill,
  deleteStudentSkill,

  getLearningModules,
  getLearningProgressHistory,
  updateLearningProgress,
  markModuleComplete,

  getAssignments,
  submitAssignment,

  getQuizzes,
  submitQuiz,

  getSkillScore,
  calculateAndStoreSkillScore,
} from "../controllers/studentController.js";

const router = express.Router();

// ==========================
// Profile
// ==========================
router.get("/dashboard", studentAuthMiddleware, getStudentDashboard);

router.get("/profile", studentAuthMiddleware, getStudentProfile);
router.put("/profile", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile", studentAuthMiddleware, updateStudentProfile);

router.put("/profile/details", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile/details", studentAuthMiddleware, updateStudentProfile);

router.put("/profile/education", studentAuthMiddleware, updateStudentProfile);
router.patch("/profile/education", studentAuthMiddleware, updateStudentProfile);

// ==========================
// Skills
// ==========================
router.get("/skills", studentAuthMiddleware, getStudentSkills);
router.post("/skills", studentAuthMiddleware, addStudentSkill);
router.put("/skills/:skillId", studentAuthMiddleware, updateStudentSkill);
router.patch("/skills/:skillId", studentAuthMiddleware, updateStudentSkill);
router.delete("/skills/:skillId", studentAuthMiddleware, deleteStudentSkill);

// ==========================
// Projects & Applications
// ==========================
router.get("/projects", studentAuthMiddleware, getAvailableProjects);
router.post("/projects/:projectId/apply", studentAuthMiddleware, applyToProject);
router.get("/applications", studentAuthMiddleware, getStudentApplications);

// ==========================
// Notifications
// ==========================
router.get("/notifications", studentAuthMiddleware, getStudentNotifications);
router.patch(
  "/notifications/:notificationId/read",
  studentAuthMiddleware,
  markNotificationRead
);
router.delete(
  "/notifications/:notificationId",
  studentAuthMiddleware,
  deleteStudentNotification
);

// ==========================
// Certificates, Settings, Resume & Hiring
// ==========================
router.get("/certificates", studentAuthMiddleware, getStudentCertificates);
router.get("/settings", studentAuthMiddleware, getStudentSettings);
router.put("/settings", studentAuthMiddleware, updateStudentSettings);
router.patch("/settings", studentAuthMiddleware, updateStudentSettings);
router.get("/resume-builder", studentAuthMiddleware, getResumeBuilder);
router.put("/resume-builder", studentAuthMiddleware, saveResumeBuilder);
router.patch("/resume-builder", studentAuthMiddleware, saveResumeBuilder);
router.get("/hiring/drives", studentAuthMiddleware, getHiringDrives);
router.post("/hiring/drives/:projectId/start", studentAuthMiddleware, (req, res) => {
  req.params.projectId = req.params.projectId;
  return applyToProject(req, res);
});

// ==========================
// Learning Progress
// ==========================
router.get("/learning/modules", studentAuthMiddleware, getLearningModules);

router.get(
  "/learning/progress/history",
  studentAuthMiddleware,
  getLearningProgressHistory
);

router.get(
  "/learning/modules/:moduleId/history",
  studentAuthMiddleware,
  getLearningProgressHistory
);

router.put(
  "/learning/modules/:moduleId/progress",
  studentAuthMiddleware,
  updateLearningProgress
);

router.patch(
  "/learning/modules/:moduleId/progress",
  studentAuthMiddleware,
  updateLearningProgress
);

router.post(
  "/learning/progress",
  studentAuthMiddleware,
  updateLearningProgress
);

router.post(
  "/learning/modules/:moduleId/complete",
  studentAuthMiddleware,
  markModuleComplete
);

// ==========================
// Assignments
// ==========================
router.get("/assignments", studentAuthMiddleware, getAssignments);

router.post(
  "/assignments/submit",
  studentAuthMiddleware,
  submitAssignment
);

router.post(
  "/assignments/:assignmentId/submit",
  studentAuthMiddleware,
  submitAssignment
);

// ==========================
// Quizzes
// ==========================
router.get("/quizzes", studentAuthMiddleware, getQuizzes);

router.post(
  "/quizzes/submit",
  studentAuthMiddleware,
  submitQuiz
);

router.post(
  "/quizzes/:quizId/submit",
  studentAuthMiddleware,
  submitQuiz
);

// ==========================
// Skill Score
// ==========================
router.get("/skill-score", studentAuthMiddleware, getSkillScore);
router.get("/score", studentAuthMiddleware, getSkillScore);

router.post(
  "/skill-score/calculate",
  studentAuthMiddleware,
  calculateAndStoreSkillScore
);

export default router;
