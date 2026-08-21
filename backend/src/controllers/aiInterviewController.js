import mongoose from "mongoose";
import AIInterview from "../models/AIInterview.js";
import Application from "../models/application.js";

import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewResult,
  saveInterviewVideo,
} from "../services/aiInterviewService.js";

const getCandidateId = (req) =>
  req.student?._id || req.user?._id || req.user?.id;

const getOwnedInterview = async ({
  sessionId,
  candidateId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return {
      statusCode: 404,
      message: "Interview session not found.",
    };
  }

  const interview =
    await AIInterview.findById(sessionId);

  if (!interview) {
    return {
      statusCode: 404,
      message: "Interview session not found.",
    };
  }

  if (
    interview.candidateId.toString() !==
    candidateId.toString()
  ) {
    return {
      statusCode: 403,
      message:
        "You are not authorized to access this interview.",
    };
  }

  return { interview };
};

const formatSession = (interview) => ({
  sessionId: interview._id.toString(),
  candidateId: interview.candidateId.toString(),
  driveId: interview.driveId?.toString?.() || interview.driveId,
  role: interview.role,
  difficulty: interview.difficulty,
  topicsCovered: interview.topicsCovered,
  totalQuestions: interview.totalQuestions,
  currentQuestion: interview.currentQuestion,
  status: interview.status,
  startedAt: interview.startedAt,
  completedAt: interview.completedAt,
});

const buildCandidateContext = (student, application) => JSON.stringify({
  name: student.name,
  email: student.email,
  phone: student.phone,
  branch: student.branch,
  semester: student.semester,
  percentage: student.percentage,
  skills: student.skills || [],
  interests: student.interests || [],
  education: student.education || [],
  bio: student.bio || "",
  resume: application?.resume || student.resume || student.resumeUrl || "",
}, null, 2);

const getStatusCode = (error) =>
  error.statusCode ||
  ({
    AI_CONFIGURATION_ERROR: 503,
    AI_PROVIDER_TIMEOUT: 503,
    AI_RATE_LIMIT: 429,
    AI_PROVIDER_ERROR: 503,
    AI_EMPTY_RESPONSE: 502,
    AI_INVALID_RESPONSE: 502,
  }[error.code] ||
  (error.message?.includes("not found")
    ? 404
    : error.message?.includes("no longer active") ||
        error.message?.includes("already")
      ? 400
      : error.message?.includes("required") ||
          error.message?.includes("empty") ||
          error.message?.includes("answer all")
        ? 400
        : 500));

/*
 * ---------------------------------------------------------
 * START AI INTERVIEW
 * POST /api/ai-interview/start
 * ---------------------------------------------------------
 */
const startAIInterview = async (req, res) => {
  try {
    const { driveId, role, totalQuestions } = req.body;

    const candidateId = getCandidateId(req);

    if (!candidateId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!driveId) {
      return res.status(400).json({
        message: "driveId is required.",
      });
    }

    const application = mongoose.Types.ObjectId.isValid(driveId)
      ? await Application.findOne({
          student: candidateId,
          project: driveId,
        }).select("resume").lean()
      : null;

    const result = await startInterview({
      candidateId,
      driveId: String(driveId),
      role,
      totalQuestions,
      candidateContext: buildCandidateContext(req.student, application),
    });

    return res.status(201).json({
      success: true,
      message:
        "AI interview started successfully.",

      session: formatSession(result.interview),

      firstQuestion:
        result.firstQuestion.question,

      currentQuestion:
        result.firstQuestion,
    });
  } catch (error) {
    console.error(
      "Start AI Interview Error:",
      error,
    );

    return res.status(getStatusCode(error)).json({
      success: false,
      message:
        error.message ||
        "Unable to start AI interview.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * SUBMIT ANSWER
 * POST /api/ai-interview/:sessionId/answer
 * ---------------------------------------------------------
 */
const submitAIInterviewAnswer = async (
  req,
  res,
) => {
  try {
    const { sessionId } = req.params;
    const { questionId, question, answer } = req.body;

    const candidateId = getCandidateId(req);

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message:
          "Answer is required.",
      });
    }

    const ownership = await getOwnedInterview({
      sessionId,
      candidateId,
    });

    if (ownership.statusCode) {
      return res.status(ownership.statusCode).json({
        success: false,
        message: ownership.message,
      });
    }

    const result = await submitAnswer({
      sessionId,
      questionId,
      question,
      answer,
    });

    return res.status(200).json({
      success: true,
      message: result.completed
        ? "All answers submitted. Complete the interview for final evaluation."
        : "Answer evaluated successfully.",

      completed:
        result.completed,

      readyToComplete:
        result.completed,

      evaluation:
        result.evaluation
          ? {
              score:
                result.evaluation
                  .overallScore,

              technicalScore:
                result.evaluation
                  .technicalScore,

              communicationScore:
                result.evaluation
                  .communicationScore,

              feedback:
                result.evaluation.feedback,

              strengths:
                result.evaluation.strengths,

              weaknesses:
                result.evaluation.weaknesses,
            }
          : undefined,

      nextQuestion:
        result.nextQuestion || null,

      currentQuestion:
        result.currentQuestion || null,
    });
  } catch (error) {
    console.error(
      "Submit AI Interview Answer Error:",
      error,
    );

    return res.status(getStatusCode(error)).json({
      success: false,
      message:
        error.message ||
        "Unable to process interview answer.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * COMPLETE INTERVIEW
 * POST /api/ai-interview/:sessionId/complete
 * ---------------------------------------------------------
 */
const completeAIInterview = async (
  req,
  res,
) => {
  try {
    const { sessionId } = req.params;

    const candidateId = getCandidateId(req);

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const ownership = await getOwnedInterview({
      sessionId,
      candidateId,
    });

    if (ownership.statusCode) {
      return res.status(ownership.statusCode).json({
        success: false,
        message: ownership.message,
      });
    }

    const completedInterview =
      await completeInterview({
        sessionId,
      });

    return res.status(200).json({
      success: true,
      message:
        "Interview completed successfully.",

      result: {
        sessionId:
          completedInterview._id.toString(),

        overallScore:
          completedInterview.overallScore,

        technicalScore:
          completedInterview.technicalScore,

        communicationScore:
          completedInterview.communicationScore,

        strengths:
          completedInterview.strengths,

        weaknesses:
          completedInterview.weaknesses,

        recommendation:
          completedInterview.recommendation,

        answers:
          completedInterview.answers,

        questions:
          completedInterview.questions,

        status:
          completedInterview.status,

        completedAt:
          completedInterview.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "Complete AI Interview Error:",
      error,
    );

    return res.status(getStatusCode(error)).json({
      success: false,
      message:
        error.message ||
        "Unable to complete AI interview.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * GET INTERVIEW RESULT
 * GET /api/ai-interview/:sessionId/result
 * ---------------------------------------------------------
 */
const getAIInterviewResult = async (
  req,
  res,
) => {
  try {
    const { sessionId } = req.params;

    const candidateId = getCandidateId(req);

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const ownership = await getOwnedInterview({
      sessionId,
      candidateId,
    });

    if (ownership.statusCode) {
      return res.status(ownership.statusCode).json({
        success: false,
        message: ownership.message,
      });
    }

    const result =
      await getInterviewResult({
        sessionId,
      });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Get AI Interview Result Error:",
      error,
    );

    return res.status(getStatusCode(error)).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve interview result.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * UPLOAD INTERVIEW RECORDING
 * POST /api/ai-interview/:sessionId/recording
 * ---------------------------------------------------------
 */
const uploadAIInterviewRecording =
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      const candidateId = getCandidateId(req);

      if (!candidateId) {
        return res.status(401).json({
          message:
            "Authentication required.",
        });
      }

      const ownership = await getOwnedInterview({
        sessionId,
        candidateId,
      });

      if (ownership.statusCode) {
        return res.status(ownership.statusCode).json({
          success: false,
          message: ownership.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "Interview recording is required.",
        });
      }

      const videoUrl = req.file.filename
        ? `/uploads/interviews/${req.file.filename}`
        : req.file.location || req.file.url || "";

      const videoStorageKey =
        req.file.key ||
        req.file.filename ||
        "";

      if (!videoUrl) {
        return res.status(500).json({
          message:
            "Video uploaded but no storage URL was returned.",
        });
      }

      const result =
        await saveInterviewVideo({
          sessionId,
          videoUrl,
          videoStorageKey,
        });

      return res.status(200).json({
        success: true,
        message:
          "Interview recording uploaded successfully.",

        videoUrl:
          result.videoUrl,
      });
    } catch (error) {
      console.error(
        "Upload AI Interview Recording Error:",
        error,
      );

      return res.status(getStatusCode(error)).json({
        success: false,
        message:
          error.message ||
          "Unable to upload interview recording.",
      });
    }
  };

/*
 * ---------------------------------------------------------
 * GET INTERVIEW SESSION
 * GET /api/ai-interview/:sessionId
 * ---------------------------------------------------------
 */
const getAIInterview = async (
  req,
  res,
) => {
  try {
    const { sessionId } = req.params;

    const candidateId = getCandidateId(req);

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const ownership = await getOwnedInterview({
      sessionId,
      candidateId,
    });

    if (ownership.statusCode) {
      return res.status(ownership.statusCode).json({
        success: false,
        message: ownership.message,
      });
    }

    const interview = ownership.interview;

    return res.status(200).json({
      success: true,
      session: formatSession(interview),
      questions: interview.questions,
      answers: interview.answers,
    });
  } catch (error) {
    console.error(
      "Get AI Interview Error:",
      error,
    );

    return res.status(getStatusCode(error)).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve interview.",
    });
  }
};

export {
  startAIInterview,
  submitAIInterviewAnswer,
  completeAIInterview,
  getAIInterviewResult,
  uploadAIInterviewRecording,
  getAIInterview,
};
