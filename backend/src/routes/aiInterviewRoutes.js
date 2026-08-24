import express from "express";

import studentAuthMiddleware from "../middleware/studentAuthMiddleware.js";

import {
  startAIInterview,
  getAIInterview,
  submitAIInterviewAnswer,
  completeAIInterview,
  getAIInterviewResult,
  uploadAIInterviewRecording,
  transcribeInterviewAudio,
} from "../controllers/aiInterviewController.js";

import {
  uploadInterviewVideo,
  uploadInterviewAudio,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

/*
 * Start a new AI interview
 *
 * POST /api/ai-interview/start
 */
router.post(
  "/start",
  studentAuthMiddleware,
  startAIInterview,
);

/*
 * Transcribe candidate audio answer
 *
 * POST /api/ai-interview/:sessionId/transcribe
 */
router.post(
  "/:sessionId/transcribe",
  studentAuthMiddleware,
  uploadInterviewAudio,
  transcribeInterviewAudio,
);

/*
 * Get an interview session
 *
 * GET /api/ai-interview/:sessionId
 */
router.get(
  "/:sessionId",
  studentAuthMiddleware,
  getAIInterview,
);

/*
 * Submit candidate answer
 *
 * POST /api/ai-interview/:sessionId/answer
 */
router.post(
  "/:sessionId/answer",
  studentAuthMiddleware,
  submitAIInterviewAnswer,
);

/*
 * Upload interview webcam recording
 *
 * POST /api/ai-interview/:sessionId/recording
 */
router.post(
  "/:sessionId/recording",
  studentAuthMiddleware,
  uploadInterviewVideo,
  uploadAIInterviewRecording,
);

/*
 * Complete interview and generate
 * final AI evaluation
 *
 * POST /api/ai-interview/:sessionId/complete
 */
router.post(
  "/:sessionId/complete",
  studentAuthMiddleware,
  completeAIInterview,
);

/*
 * Get final interview result
 *
 * GET /api/ai-interview/:sessionId/result
 */
router.get(
  "/:sessionId/result",
  studentAuthMiddleware,
  getAIInterviewResult,
);

export default router;
