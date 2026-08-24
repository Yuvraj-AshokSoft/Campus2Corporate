import * as aiService from "../services/aiServices.js";

const parseAiJson = (result) => {
  if (typeof result !== "string") return result;
  const cleaned = result.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = Math.min(...[cleaned.indexOf("{"), cleaned.indexOf("[")].filter((index) => index >= 0));
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        // Return a predictable payload when the provider returns malformed JSON.
      }
    }
    return { raw: result };
  }
};

const sendSuccess = (res, message, data) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, error) => {
  console.error("AI request failed:", error?.code || "UNKNOWN_ERROR", error?.message);

  const statusCode = {
    AI_CONFIGURATION_ERROR: 503,
    AI_PROVIDER_TIMEOUT: 503,
    AI_RATE_LIMIT: 429,
    AI_PROVIDER_ERROR: 503,
    AI_EMPTY_RESPONSE: 502,
    AI_INVALID_RESPONSE: 502,
  }[error?.code] || 500;

  return res.status(statusCode).json({
    success: false,
    message: ["AI_CONFIGURATION_ERROR", "AI_PROVIDER_TIMEOUT", "AI_RATE_LIMIT", "AI_PROVIDER_ERROR"].includes(error?.code)
      ? error.message
      : "AI service returned an invalid response. Please try again.",
  });
};

// ===============================
// AI Study Planner
// ===============================

export const studyPlan = async (req, res) => {
  try {
    const { studentContext } = req.body;

    if (!studentContext) {
      return res.status(400).json({
        success: false,
        message: "Student context is required.",
      });
    }

    const result = await aiService.generateStudyPlan(studentContext);

    sendSuccess(res, "Study plan generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

// ===============================
// Placement Analysis
// ===============================

export const placementAnalysis = async (req, res) => {
  try {
    const { studentContext } = req.body;

    if (!studentContext) {
      return res.status(400).json({
        success: false,
        message: "Student context is required.",
      });
    }

    const result = await aiService.analyzePlacement(studentContext);

    sendSuccess(
      res,
      "Placement analysis completed.",
      parseAiJson(result)
    );
  } catch (error) {
    sendError(res, error);
  }
};

// ===============================
// ATS Resume Score
// ===============================

export const atsScore = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required.",
      });
    }

    const result = await aiService.analyzeResume(resumeText, jobDescription);

    sendSuccess(res, "Resume analyzed successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

// ===============================
// Skill Gap Analysis
// ===============================

export const skillGap = async (req, res) => {
  try {
    const { studentContext, role } = req.body;

    if (!studentContext || !role) {
      return res.status(400).json({
        success: false,
        message: "Student context and role are required.",
      });
    }

    const result = await aiService.analyzeSkillGap(
      studentContext,
      role
    );

    sendSuccess(
      res,
      "Skill gap analysis completed.",
      parseAiJson(result)
    );
  } catch (error) {
    sendError(res, error);
  }
};

// ===============================
// AI Career Coach
// ===============================

export const careerCoach = async (req, res) => {
  try {
    const { question, studentContext } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const result = await aiService.careerCoach(
      question,
      studentContext || ""
    );
    const parsed = parseAiJson(result);

    sendSuccess(res, "Response generated successfully.", {
      answer: parsed.answer || String(result),
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const resumeSummary = async (req, res) => {
  try {
    if (!req.body.resume && !req.body.prompt && !Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: "Resume data is required." });
    }
    const result = await aiService.generateResumeSummary(req.body.resume || req.body);
    sendSuccess(res, "Resume summary generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const result = await aiService.generateCareerRoadmap(req.body.studentContext || req.body);
    sendSuccess(res, "Career roadmap generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const resumeExperience = async (req, res) => {
  try {
    if (!req.body.experience && !req.body.prompt && !Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: "Experience data is required." });
    }
    const result = await aiService.enhanceResumeExperience(req.body.experience || req.body);
    sendSuccess(res, "Experience bullets enhanced successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const resumeNote = async (req, res) => {
  try {
    if (!req.body.note && !req.body.prompt && !Object.keys(req.body).length) {
      return res.status(400).json({ success: false, message: "Resume note is required." });
    }
    const result = await aiService.classifyResumeNote(
      req.body.note || req.body
    );

    sendSuccess(
      res,
      "Resume note classified successfully.",
      parseAiJson(result)
    );
  } catch (error) {
    sendError(res, error);
  }
};

export const hiringInterview = async (req, res) => {
  try {
    const result = await aiService.generateHiringInterview(req.body);
    sendSuccess(res, "Interview generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const hiringQuestions = async (req, res) => {
  try {
    const result = await aiService.generateHiringQuestions(req.body);
    sendSuccess(res, "Questions generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const hiringEvaluate = async (req, res) => {
  try {
    const result = await aiService.evaluateHiringAnswer(req.body);
    sendSuccess(res, "Answer evaluated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};

export const hiringFeedback = async (req, res) => {
  try {
    const result = await aiService.generateHiringFeedback(req.body);
    sendSuccess(res, "Feedback generated successfully.", parseAiJson(result));
  } catch (error) {
    sendError(res, error);
  }
};
