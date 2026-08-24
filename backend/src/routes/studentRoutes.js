import express from "express";

import studentAuthMiddleware from "../middleware/studentAuthMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

import {
  addStudentSkill,
  calculateAndStoreSkillScore,
  deleteStudentSkill,
  getAssignments,
  getLearningModules,
  getLearningProgressHistory,
  getQuizzes,
  getSkillScore,
  getStudentDashboard,
  getStudentProfile,
  getStudentSkills,
  loginStudent,
  logoutStudent,
  markModuleComplete,
  registerStudent,
  startHiringDrive,
  submitAssignment,
  submitQuiz,
  updateLearningProgress,
  updateStudentProfile,
  updateStudentSkill,
} from "../controllers/studentController.js";

const router = express.Router();

/*
 * =========================================================
 * STUDENT AUTHENTICATION
 * =========================================================
 */

router.post("/register", registerStudent);

router.post("/login", loginStudent);

router.post(
  "/logout",
  studentAuthMiddleware,
  logoutStudent,
);

router.post(
  "/auth/register",
  registerStudent,
);

router.post(
  "/auth/login",
  loginStudent,
);

router.post(
  "/auth/logout",
  studentAuthMiddleware,
  logoutStudent,
);

/*
 * =========================================================
 * STUDENT DASHBOARD
 * =========================================================
 */

router.get(
  "/dashboard",
  studentAuthMiddleware,
  getStudentDashboard,
);

/*
 * =========================================================
 * STUDENT PROFILE
 * =========================================================
 */

router.get(
  "/auth/me",
  studentAuthMiddleware,
  getStudentProfile,
);

router.get(
  "/me",
  studentAuthMiddleware,
  getStudentProfile,
);

router.get(
  "/profile",
  studentAuthMiddleware,
  getStudentProfile,
);

router.put(
  "/profile",
  studentAuthMiddleware,
  updateStudentProfile,
);

router.patch(
  "/profile",
  studentAuthMiddleware,
  updateStudentProfile,
);

router.put(
  "/profile/details",
  studentAuthMiddleware,
  updateStudentProfile,
);

router.patch(
  "/profile/details",
  studentAuthMiddleware,
  updateStudentProfile,
);

router.put(
  "/profile/education",
  studentAuthMiddleware,
  updateStudentProfile,
);

router.patch(
  "/profile/education",
  studentAuthMiddleware,
  updateStudentProfile,
);

/*
 * =========================================================
 * STUDENT SKILLS
 * =========================================================
 */

router.get(
  "/skills",
  studentAuthMiddleware,
  getStudentSkills,
);

router.post(
  "/skills",
  studentAuthMiddleware,
  addStudentSkill,
);

router.put(
  "/skills/:skillId",
  studentAuthMiddleware,
  updateStudentSkill,
);

router.patch(
  "/skills/:skillId",
  studentAuthMiddleware,
  updateStudentSkill,
);

router.delete(
  "/skills/:skillId",
  studentAuthMiddleware,
  deleteStudentSkill,
);

/*
 * =========================================================
 * LEARNING
 * =========================================================
 */

router.get(
  "/learning/modules",
  studentAuthMiddleware,
  getLearningModules,
);

router.get(
  "/learning/progress/history",
  studentAuthMiddleware,
  getLearningProgressHistory,
);

router.get(
  "/learning/modules/:moduleId/history",
  studentAuthMiddleware,
  getLearningProgressHistory,
);

router.put(
  "/learning/modules/:moduleId/progress",
  studentAuthMiddleware,
  updateLearningProgress,
);

router.patch(
  "/learning/modules/:moduleId/progress",
  studentAuthMiddleware,
  updateLearningProgress,
);

router.post(
  "/learning/progress",
  studentAuthMiddleware,
  updateLearningProgress,
);

router.post(
  "/learning/modules/:moduleId/complete",
  studentAuthMiddleware,
  markModuleComplete,
);

/*
 * =========================================================
 * ASSIGNMENTS
 * =========================================================
 */

router.get(
  "/assignments",
  studentAuthMiddleware,
  getAssignments,
);

router.post(
  "/assignments/submit",
  studentAuthMiddleware,
  submitAssignment,
);

router.post(
  "/assignments/:assignmentId/submit",
  studentAuthMiddleware,
  submitAssignment,
);

/*
 * =========================================================
 * QUIZZES
 * =========================================================
 */

router.get(
  "/quizzes",
  studentAuthMiddleware,
  getQuizzes,
);

router.post(
  "/quizzes/submit",
  studentAuthMiddleware,
  submitQuiz,
);

router.post(
  "/quizzes/:quizId/submit",
  studentAuthMiddleware,
  submitQuiz,
);

/*
 * =========================================================
 * SKILL SCORE
 * =========================================================
 */

router.get(
  "/skill-score",
  studentAuthMiddleware,
  getSkillScore,
);

router.get(
  "/score",
  studentAuthMiddleware,
  getSkillScore,
);

router.post(
  "/skill-score/calculate",
  studentAuthMiddleware,
  calculateAndStoreSkillScore,
);

/*
 * =========================================================
 * HIRING PROCESS
 * =========================================================
 *
 * POST /api/student/hiring/drives/:driveId/start
 *
 * Student uploads resume and starts the application process.
 */

router.post(
  "/hiring/drives/:driveId/start",
  studentAuthMiddleware,
  uploadResume,
  startHiringDrive,
);

export default router;