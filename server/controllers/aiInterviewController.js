import AIInterview from "../models/AIInterview.js";

import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewResult,
  saveInterviewVideo,
} from "../services/aiInterviewService.js";

/*
 * ---------------------------------------------------------
 * START AI INTERVIEW
 * POST /api/ai-interview/start
 * ---------------------------------------------------------
 */
const startAIInterview = async (req, res) => {
  try {
    const { driveId, role } = req.body;

    const candidateId =
      req.user?._id || req.user?.id;

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

    const result = await startInterview({
      candidateId,
      driveId,
      role,
    });

    return res.status(201).json({
      message:
        "AI interview started successfully.",

      session: {
        sessionId:
          result.interview._id.toString(),

        candidateId:
          result.interview.candidateId.toString(),

        driveId:
          result.interview.driveId.toString(),

        role: result.interview.role,

        totalQuestions:
          result.interview.totalQuestions,

        currentQuestion:
          result.interview.currentQuestion,

        status:
          result.interview.status,

        startedAt:
          result.interview.startedAt,
      },

      firstQuestion:
        result.firstQuestion,
    });
  } catch (error) {
    console.error(
      "Start AI Interview Error:",
      error,
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to start AI interview.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * SUBMIT ANSWER
 * POST /api/ai-interview/:interviewId/answer
 * ---------------------------------------------------------
 */
const submitAIInterviewAnswer = async (
  req,
  res,
) => {
  try {
    const { interviewId } = req.params;
    const { answer } = req.body;

    const candidateId =
      req.user?._id || req.user?.id;

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

    const interview =
      await AIInterview.findById(
        interviewId,
      );

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview session not found.",
      });
    }

    if (
      interview.candidateId.toString() !==
      candidateId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to access this interview.",
      });
    }

    const result = await submitAnswer({
      interviewId,
      answer,
    });

    return res.status(200).json({
      message: result.completed
        ? "Interview completed."
        : "Answer evaluated successfully.",

      completed:
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
    });
  } catch (error) {
    console.error(
      "Submit AI Interview Answer Error:",
      error,
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to process interview answer.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * COMPLETE INTERVIEW
 * POST /api/ai-interview/:interviewId/complete
 * ---------------------------------------------------------
 */
const completeAIInterview = async (
  req,
  res,
) => {
  try {
    const { interviewId } = req.params;

    const candidateId =
      req.user?._id || req.user?.id;

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const interview =
      await AIInterview.findById(
        interviewId,
      );

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview session not found.",
      });
    }

    if (
      interview.candidateId.toString() !==
      candidateId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to complete this interview.",
      });
    }

    const completedInterview =
      await completeInterview({
        interviewId,
      });

    return res.status(200).json({
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

        completedAt:
          completedInterview.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "Complete AI Interview Error:",
      error,
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to complete AI interview.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * GET INTERVIEW RESULT
 * GET /api/ai-interview/:interviewId/result
 * ---------------------------------------------------------
 */
const getAIInterviewResult = async (
  req,
  res,
) => {
  try {
    const { interviewId } = req.params;

    const candidateId =
      req.user?._id || req.user?.id;

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const interview =
      await AIInterview.findById(
        interviewId,
      );

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview session not found.",
      });
    }

    if (
      interview.candidateId.toString() !==
      candidateId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to access this interview.",
      });
    }

    const result =
      await getInterviewResult({
        interviewId,
      });

    return res.status(200).json({
      result,
    });
  } catch (error) {
    console.error(
      "Get AI Interview Result Error:",
      error,
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to retrieve interview result.",
    });
  }
};

/*
 * ---------------------------------------------------------
 * UPLOAD INTERVIEW RECORDING
 * POST /api/ai-interview/:interviewId/recording
 * ---------------------------------------------------------
 */
const uploadAIInterviewRecording =
  async (req, res) => {
    try {
      const { interviewId } = req.params;

      const candidateId =
        req.user?._id || req.user?.id;

      if (!candidateId) {
        return res.status(401).json({
          message:
            "Authentication required.",
        });
      }

      const interview =
        await AIInterview.findById(
          interviewId,
        );

      if (!interview) {
        return res.status(404).json({
          message:
            "Interview session not found.",
        });
      }

      if (
        interview.candidateId.toString() !==
        candidateId.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to upload this recording.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "Interview recording is required.",
        });
      }

      const videoUrl =
        req.file.path ||
        req.file.location ||
        req.file.url ||
        "";

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
          interviewId,
          videoUrl,
          videoStorageKey,
        });

      return res.status(200).json({
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

      return res.status(500).json({
        message:
          error.message ||
          "Unable to upload interview recording.",
      });
    }
  };

/*
 * ---------------------------------------------------------
 * GET INTERVIEW SESSION
 * GET /api/ai-interview/:interviewId
 * ---------------------------------------------------------
 */
const getAIInterview = async (
  req,
  res,
) => {
  try {
    const { interviewId } = req.params;

    const candidateId =
      req.user?._id || req.user?.id;

    if (!candidateId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const interview =
      await AIInterview.findById(
        interviewId,
      ).lean();

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview session not found.",
      });
    }

    if (
      interview.candidateId.toString() !==
      candidateId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to access this interview.",
      });
    }

    return res.status(200).json({
      session: {
        sessionId:
          interview._id.toString(),

        candidateId:
          interview.candidateId.toString(),

        driveId:
          interview.driveId.toString(),

        role: interview.role,

        totalQuestions:
          interview.totalQuestions,

        currentQuestion:
          interview.currentQuestion,

        status:
          interview.status,

        startedAt:
          interview.startedAt,

        completedAt:
          interview.completedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get AI Interview Error:",
      error,
    );

    return res.status(500).json({
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