import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

const client = API_KEY
  ? new GoogleGenAI({ apiKey: API_KEY, httpOptions: { timeout: REQUEST_TIMEOUT_MS } })
  : null;

const aiError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const isTransient = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return error?.status === 429 || error?.status >= 500 ||
    ["ETIMEDOUT", "ECONNRESET"].includes(error?.code) ||
    message.includes("deadline_exceeded") || message.includes("timeout");
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const extractText = (response) => {
  const text = response?.text || response?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "").join("") || "";
  if (!text.trim()) throw aiError("AI_EMPTY_RESPONSE", "Gemini returned an empty response.");
  return text.trim();
};

const parseJson = (content) => {
  const cleaned = String(content).replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const starts = [cleaned.indexOf("{"), cleaned.indexOf("[")].filter((index) => index >= 0);
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (starts.length && end > Math.min(...starts)) {
      try { return JSON.parse(cleaned.slice(Math.min(...starts), end + 1)); } catch { /* handled below */ }
    }
  }
  throw aiError("AI_INVALID_RESPONSE", "Gemini returned invalid JSON.");
};

const arrayOfText = (value) => (Array.isArray(value) ? value : [])
  .filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
const text = (value) => typeof value === "string" ? value.trim() : "";
const score = (value) => Math.min(100, Math.max(0, Number(value) || 0));

export const generateResponse = async ({ systemInstruction, prompt, responseMimeType = "text/plain", maxOutputTokens }) => {
  if (!client || !API_KEY) {
    console.error("Gemini API key is not configured.");
    throw aiError("AI_CONFIGURATION_ERROR", "Gemini API key is not configured.");
  }

  const config = {
    responseMimeType,
    ...(systemInstruction ? { systemInstruction } : {}),
    ...(maxOutputTokens ? { maxOutputTokens } : {}),
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await client.models.generateContent({ model: MODEL, contents: prompt, config });
      return extractText(response);
    } catch (error) {
      let parsedMessageObj = null;
      try {
        if (typeof error?.message === "string" && error.message.trim().startsWith("{")) {
          parsedMessageObj = JSON.parse(error.message);
        }
      } catch {
        // keep null
      }

      const innerError = parsedMessageObj?.error || null;
      const details = error?.details || innerError?.details || null;
      const retryInfo = error?.retryDelay || details?.find?.((d) => d["@type"]?.includes("RetryInfo"))?.retryDelay || null;
      const rawMessage = innerError?.message || error?.message;

      console.error("========== GEMINI PROVIDER ERROR ==========");
      console.error("Model:", MODEL);
      console.error("Name:", error?.name);
      console.error("Status:", error?.status || innerError?.code);
      console.error("Code:", error?.code || innerError?.status);
      console.error("Message:", rawMessage);
      console.error("Status Text:", error?.statusText);
      console.error("Details:", details ? JSON.stringify(details, null, 2) : undefined);
      console.error("Response:", error?.response);
      console.error("Error:", error?.error || innerError);
      console.error("Retry Info:", retryInfo);
      console.error("============================================");

      if (attempt < MAX_RETRIES && isTransient(error)) {
        await sleep(250 * 2 ** attempt);
        continue;
      }
      if (error?.code === "AI_EMPTY_RESPONSE" || error?.code === "AI_INVALID_RESPONSE") throw error;

      const errorMessage = String(rawMessage || "").toLowerCase();
      const status = error?.status || innerError?.code;

      if (status === 429 || errorMessage.includes("quota") || errorMessage.includes("rate limit") || errorMessage.includes("resource_exhausted")) {
        throw aiError("AI_RATE_LIMIT", "AI service is busy or quota limit reached. Please try again shortly.");
      }

      if (status === 400 || status === 401 || status === 403 || status === 404 || errorMessage.includes("api key") || errorMessage.includes("not found") || errorMessage.includes("permission_denied") || errorMessage.includes("invalid_argument")) {
        throw aiError("AI_CONFIGURATION_ERROR", rawMessage || "Gemini configuration or authentication error.");
      }

      if (isTransient(error) || errorMessage.includes("timeout") || errorMessage.includes("deadline")) {
        throw aiError("AI_PROVIDER_TIMEOUT", "AI service timed out. Please try again.");
      }

      throw aiError("AI_PROVIDER_ERROR", rawMessage || "AI service temporarily unavailable. Please try again.");
    }
  }
  throw aiError("AI_PROVIDER_ERROR", "AI service temporarily unavailable. Please try again.");
};

const generateJson = (systemInstruction, prompt) => generateResponse({
  systemInstruction,
  prompt,
  responseMimeType: "application/json",
});

export const generateStudyPlan = async (studentContext) => {
  const result = parseJson(await generateJson("You are a practical AI study planner. Use only supplied facts.", `Create a realistic five-day plan. Return an array of {day,tasks} objects and include goals, priorities, effort, and milestones in the tasks.\nStudent context:\n${studentContext}`));
  return (Array.isArray(result) ? result : []).map((day) => ({ day: text(day?.day), tasks: arrayOfText(day?.tasks) }));
};

export const analyzePlacement = async (studentContext) => {
  const result = parseJson(await generateJson("You are an evidence-based placement analyst. Do not infer absent facts.", `Analyze readiness and return JSON with score, strengths, gaps, tip, missingSkills, recommendations, and priorityActions. Scores must be 0-100.\n${studentContext}`));
  return { score: score(result?.score), strengths: arrayOfText(result?.strengths), gaps: arrayOfText(result?.gaps || result?.weaknesses || result?.missingSkills), tip: text(result?.tip), missingSkills: arrayOfText(result?.missingSkills), recommendations: arrayOfText(result?.recommendations), priorityActions: arrayOfText(result?.priorityActions) };
};

export const analyzeResume = async (resumeText, jobDescription = "") => {
  const result = parseJson(await generateJson("You are an ATS analyst. Use only the supplied resume and optional job description.", `Return JSON with score, title, description, breakdown, keywords_found, keywords_missing, formatting_issues, and tip. Do not invent requirements.\nResume:\n${resumeText}\nJob description:\n${jobDescription || "Not supplied"}`));
  return { score: score(result?.score), title: text(result?.title), description: text(result?.description), breakdown: Array.isArray(result?.breakdown) ? result.breakdown : [], keywords_found: arrayOfText(result?.keywords_found), keywords_missing: arrayOfText(result?.keywords_missing), formatting_issues: arrayOfText(result?.formatting_issues), tip: text(result?.tip) };
};

export const analyzeSkillGap = async (studentContext, role) => {
  const result = parseJson(await generateJson("You are a grounded career skills analyst. Do not claim skills absent from context.", `Compare this student with the target role. Return JSON with match_score, role, summary, matched_skills, missing_skills, suggested_modules, priority, learning_path, and tip.\nRole:\n${role}\nStudent:\n${studentContext}`));
  return { match_score: score(result?.match_score), role: text(result?.role || role), summary: text(result?.summary), matched_skills: arrayOfText(result?.matched_skills), missing_skills: arrayOfText(result?.missing_skills), suggested_modules: arrayOfText(result?.suggested_modules), priority: arrayOfText(result?.priority), learning_path: arrayOfText(result?.learning_path), tip: text(result?.tip) };
};

export const careerCoach = async (question, studentContext) => {
  const result = parseJson(await generateJson("You are a concise career assistant. Give practical advice based only on the supplied context.", `Return JSON as {answer}. Do not invent details.\nContext:\n${String(studentContext || "No context supplied.").slice(0, 4000)}\nQuestion:\n${question}`));
  let answer = text(result?.answer);

  if (answer.startsWith("{") || answer.startsWith("[")) {
    try {
      answer = text(parseJson(answer)?.answer) || answer;
    } catch {
      // Keep the provider's useful text when it is not a complete nested object.
    }
  }

  return { answer };
};
export const generateResumeSummary = async (resume) => ({ summary: text(parseJson(await generateJson("Write a factual ATS-friendly summary. Never invent details.", `Return JSON as {summary}, 2-3 sentences under 45 words.\n${JSON.stringify(resume)}`))?.summary) });
export const enhanceResumeExperience = async (experience) => ({ bullets: arrayOfText(parseJson(await generateJson("Improve resume bullets without inventing metrics or achievements.", `Return JSON as {bullets}.\n${JSON.stringify(experience)}`))?.bullets) });
export const classifyResumeNote = async (note) => { const result = parseJson(await generateJson("Classify resume notes factually without inventing credentials.", `Return JSON with type, experience, certification, skills, and confirmation. Type is experience, certification, or skill.\n${note}`)); return { type: ["experience", "certification", "skill"].includes(result?.type) ? result.type : "skill", experience: result?.experience || null, certification: result?.certification || null, skills: arrayOfText(result?.skills), confirmation: text(result?.confirmation) }; };
export const generateHiringInterview = async (context) => parseJson(await generateJson("Design a role-specific student interview using only supplied context.", `Return JSON with title and rounds containing name, focus, durationMinutes, and questions.\n${JSON.stringify(context)}`));
export const generateHiringQuestions = async (context) => parseJson(await generateJson("Generate role-specific interview questions, not static generic questions.", `Return JSON as {questions:[{id,type,question,expectedSignals}]}.\n${JSON.stringify(context)}`));
export const evaluateHiringAnswer = async (context) => parseJson(await generateJson("Evaluate only the candidate answer provided; do not invent content.", `Return JSON with score (0-100), strengths, improvements, and feedback.\n${JSON.stringify(context)}`));
export const generateHiringFeedback = async (context) => { const result = parseJson(await generateJson("Give concise factual hiring feedback from supplied evidence.", `Return JSON with summary, nextSteps, readinessScore (0-100).\n${JSON.stringify(context)}`)); return { summary: text(result?.summary), nextSteps: arrayOfText(result?.nextSteps), readinessScore: score(result?.readinessScore) }; };
export const generateCareerRoadmap = async (studentContext) => parseJson(await generateJson("Create a realistic roadmap grounded only in student context.", `Return JSON with goal, timeframe, phases [{title,duration,actions,milestone}], and nextAction.\n${JSON.stringify(studentContext)}`));
export const getGeminiConfig = () => ({ model: MODEL, configured: Boolean(API_KEY) });
