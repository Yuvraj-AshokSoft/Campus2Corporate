import express from "express";
import * as aiController from "../controllers/aiController.js";
import studentAuthMiddleware from "../middleware/studentAuthMiddleware.js";

const router = express.Router();

router.use(studentAuthMiddleware);

router.post(["/smart-study-planner", "/study-plan"], aiController.studyPlan);
router.post(["/placement-readiness", "/placement-analysis"], aiController.placementAnalysis);
router.post(["/resume-score", "/ats-score"], aiController.atsScore);
router.post(["/job-gap-analysis", "/skill-gap"], aiController.skillGap);
router.post("/career-coach", aiController.careerCoach);
router.post(["/resume-summary", "/resume/summary"], aiController.resumeSummary);
router.post(["/resume-experience", "/resume/experience"], aiController.resumeExperience);
router.post(["/resume-note", "/resume/note"], aiController.resumeNote);
router.post("/generate-roadmap", aiController.generateRoadmap);
router.post(["/hiring-interview", "/hiring/interview"], aiController.hiringInterview);
router.post(["/hiring-questions", "/hiring/questions"], aiController.hiringQuestions);
router.post(["/hiring-evaluate", "/hiring/evaluate"], aiController.hiringEvaluate);
router.post(["/hiring-feedback", "/hiring/feedback"], aiController.hiringFeedback);

export default router;
