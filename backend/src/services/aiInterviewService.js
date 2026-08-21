import crypto from "crypto";
import AIInterview from "../models/AIInterview.js";
import { generateResponse } from "./aiServices.js";

import {
  buildInterviewSystemPrompt,
  buildFirstQuestionPrompt,
  buildAnswerEvaluationPrompt,
  buildNextQuestionPrompt,
  buildFinalEvaluationPrompt,
} from "../utils/interviewPrompt.js";

const DEFAULT_TOTAL_QUESTIONS = 5;
const MIN_TOTAL_QUESTIONS = 1;
const MAX_TOTAL_QUESTIONS = 10;

const callAI = async ({
  systemPrompt,
  userPrompt,
  responseMimeType,
}) => {
  return generateResponse({
    systemInstruction: systemPrompt,
    prompt: userPrompt,
    responseMimeType: responseMimeType || "text/plain",
  });
};

const parseAIJson = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned an invalid JSON response.");
    }
  }
};

const parseQuestionText = (content) => {
  const cleaned = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (typeof parsed === "string") {
      return parsed.trim();
    }

    if (parsed?.question) {
      return String(parsed.question).trim();
    }
  } catch {
    // Plain text is the expected shape for interview questions.
  }

  return cleaned.replace(/^["']|["']$/g, "").trim();
};

const clampTotalQuestions = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_TOTAL_QUESTIONS;
  }

  return Math.min(
    MAX_TOTAL_QUESTIONS,
    Math.max(MIN_TOTAL_QUESTIONS, Math.floor(parsed)),
  );
};

const normalizeScores = (evaluation) => ({
  technicalScore: Math.min(100, Math.max(0, Number(evaluation.technicalScore) || 0)),
  communicationScore: Math.min(100, Math.max(0, Number(evaluation.communicationScore) || 0)),
  overallScore: Math.min(100, Math.max(0, Number(evaluation.overallScore) || 0)),
  feedback: evaluation.feedback || "",
  strengths: Array.isArray(evaluation.strengths)
    ? evaluation.strengths
    : [],
  weaknesses: Array.isArray(evaluation.weaknesses)
    ? evaluation.weaknesses
    : [],
  shouldAskFollowUp: Boolean(evaluation.shouldAskFollowUp),
});

const createInterview = async ({
  candidateId,
  driveId,
  role = "Software Engineer",
  totalQuestions,
  candidateContext = "",
}) => {
  return AIInterview.create({
    candidateId,
    driveId: String(driveId),
    role,
    candidateContext: String(candidateContext).slice(0, 12000),
    difficulty: "intermediate",
    topicsCovered: [],
    status: "active",
    totalQuestions: clampTotalQuestions(totalQuestions),
    currentQuestion: 1,
    startedAt: new Date(),
  });
};

const getSystemPrompt = (interview) =>
  buildInterviewSystemPrompt({
    role: interview.role,
    totalQuestions: interview.totalQuestions,
    candidateContext: interview.candidateContext,
    difficulty: interview.difficulty,
    topicsCovered: interview.topicsCovered,
  });

const generateFirstQuestion = async ({ interview }) => {
  const content = await callAI({
    systemPrompt: getSystemPrompt(interview),
    userPrompt: buildFirstQuestionPrompt({
      role: interview.role,
      candidateName: interview.candidateContext
        ?.match(/["']?(?:name|candidate)["']?\s*:\s*["']?([^\n,"'}]+)/i)?.[1],
    }),
  });

  const question = parseQuestionText(content);

  if (!question) {
    throw new Error("Gemini did not return a valid first question.");
  }

  const currentQuestion = {
    questionId: crypto.randomUUID(),
    question,
    answered: false,
  };

  interview.questions.push(currentQuestion);
  await interview.save();

  return currentQuestion;
};

const startInterview = async ({
  candidateId,
  driveId,
  role,
  totalQuestions,
  candidateContext,
}) => {
  const interview = await createInterview({
    candidateId,
    driveId,
    role,
    totalQuestions,
    candidateContext,
  });

  const firstQuestion = await generateFirstQuestion({
    interview,
  });

  return {
    interview,
    firstQuestion,
  };
};

const evaluateAnswer = async ({
  interview,
  question,
  answer,
}) => {
  const content = await callAI({
    systemPrompt:
      "You are an expert technical interview evaluator. Return valid JSON only.",
    userPrompt: buildAnswerEvaluationPrompt({
      role: interview.role,
      question: question.question,
      answer,
      questionNumber: interview.currentQuestion,
      totalQuestions: interview.totalQuestions,
      candidateContext: interview.candidateContext,
      difficulty: interview.difficulty,
    }),
    responseMimeType: "application/json",
  });

  return normalizeScores(parseAIJson(content));
};

const generateNextQuestion = async ({
  interview,
  previousQuestion,
  previousAnswer,
}) => {
  const nextQuestionNumber = interview.currentQuestion + 1;

  const content = await callAI({
    systemPrompt: getSystemPrompt(interview),
    userPrompt: buildNextQuestionPrompt({
      role: interview.role,
      previousQuestion,
      previousAnswer,
      questionNumber: nextQuestionNumber,
      totalQuestions: interview.totalQuestions,
      candidateContext: interview.candidateContext,
      difficulty: interview.difficulty,
      topicsCovered: interview.topicsCovered,
      evaluations: interview.answers.map((answer) => ({
        question: answer.question,
        technicalScore: answer.technicalScore,
        communicationScore: answer.communicationScore,
        overallScore: answer.overallScore,
        weaknesses: answer.weaknesses,
      })),
    }),
  });

  const question = parseQuestionText(content);

  if (!question) {
    throw new Error("Gemini did not return a valid next question.");
  }

  const nextQuestion = {
    questionId: crypto.randomUUID(),
    question,
    answered: false,
  };

  interview.questions.push(nextQuestion);
  interview.currentQuestion = nextQuestionNumber;
  await interview.save();

  return nextQuestion;
};

const submitAnswer = async ({
  sessionId,
  questionId,
  question,
  answer,
}) => {
  const interview = await AIInterview.findById(sessionId);

  if (!interview) {
    throw new Error("Interview session not found.");
  }

  if (interview.status !== "active") {
    throw new Error("This interview is no longer active.");
  }

  if (!answer || !answer.trim()) {
    throw new Error("Answer cannot be empty.");
  }

  const currentQuestion =
    (questionId &&
      interview.questions.find(
        (item) => item.questionId === questionId,
      )) ||
    interview.questions.find((item) => !item.answered) ||
    interview.questions[interview.questions.length - 1];

  if (!currentQuestion) {
    throw new Error("No active interview question found.");
  }

  if (currentQuestion.answered) {
    const previousAnswer = interview.answers.find(
      (item) => item.questionId === currentQuestion.questionId,
    );

    return {
      completed: interview.answers.length >= interview.totalQuestions,
      evaluation: previousAnswer
        ? normalizeScores(previousAnswer)
        : null,
      nextQuestion: interview.questions.find((item) => !item.answered)
        ?.question || null,
      currentQuestion: interview.questions.find((item) => !item.answered) || null,
      duplicate: true,
    };
  }

  if (
    question &&
    currentQuestion.question.trim() !== String(question).trim()
  ) {
    throw new Error(
      "Question does not match the active interview session.",
    );
  }

  const cleanAnswer = answer.trim();
  const evaluation = await evaluateAnswer({
    interview,
    question: currentQuestion,
    answer: cleanAnswer,
  });

  currentQuestion.answered = true;

  interview.answers.push({
    questionId: currentQuestion.questionId,
    question: currentQuestion.question,
    answer: cleanAnswer,
    technicalScore: evaluation.technicalScore,
    communicationScore: evaluation.communicationScore,
    overallScore: evaluation.overallScore,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    weaknesses: evaluation.weaknesses,
  });

  interview.difficulty = evaluation.overallScore >= 80
    ? "advanced"
    : evaluation.overallScore < 55
      ? "beginner"
      : "intermediate";

  const topic = currentQuestion.question
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 3)
    .join(" ");

  if (topic && !interview.topicsCovered.includes(topic)) {
    interview.topicsCovered.push(topic);
  }

  if (interview.answers.length >= interview.totalQuestions) {
    await interview.save();

    return {
      completed: true,
      evaluation,
      nextQuestion: null,
      currentQuestion: null,
    };
  }

  const nextQuestion = await generateNextQuestion({
    interview,
    previousQuestion: currentQuestion.question,
    previousAnswer: cleanAnswer,
  });

  return {
    completed: false,
    evaluation,
    nextQuestion: nextQuestion.question,
    currentQuestion: nextQuestion,
  };
};

const generateFinalEvaluation = async ({ interview }) => {
  const content = await callAI({
    systemPrompt:
      "You are a senior technical interview evaluator. Return valid JSON only.",
    userPrompt: buildFinalEvaluationPrompt({
      role: interview.role,
      answers: interview.answers,
      candidateContext: interview.candidateContext,
    }),
    responseMimeType: "application/json",
  });

  const evaluation = parseAIJson(content);

  return {
    overallScore: Number(evaluation.overallScore) || 0,
    technicalScore: Number(evaluation.technicalScore) || 0,
    communicationScore: Number(evaluation.communicationScore) || 0,
    strengths: Array.isArray(evaluation.strengths)
      ? evaluation.strengths
      : [],
    weaknesses: Array.isArray(evaluation.weaknesses)
      ? evaluation.weaknesses
      : [],
    recommendation: evaluation.recommendation || "",
  };
};

const completeInterview = async ({ sessionId }) => {
  const interview = await AIInterview.findById(sessionId);

  if (!interview) {
    throw new Error("Interview session not found.");
  }

  if (interview.status === "completed") {
    return interview;
  }

  if (interview.status !== "active") {
    throw new Error("This interview is no longer active.");
  }

  if (interview.answers.length < interview.totalQuestions) {
    throw new Error(
      "Please answer all interview questions before completing the interview.",
    );
  }

  const finalEvaluation = await generateFinalEvaluation({
    interview,
  });

  interview.overallScore = finalEvaluation.overallScore;
  interview.technicalScore = finalEvaluation.technicalScore;
  interview.communicationScore =
    finalEvaluation.communicationScore;
  interview.strengths = finalEvaluation.strengths;
  interview.weaknesses = finalEvaluation.weaknesses;
  interview.recommendation = finalEvaluation.recommendation;
  interview.status = "completed";
  interview.completedAt = new Date();

  await interview.save();

  return interview;
};

const getInterviewResult = async ({ sessionId }) => {
  const interview = await AIInterview.findById(sessionId).lean();

  if (!interview) {
    throw new Error("Interview session not found.");
  }

  return {
    sessionId: interview._id.toString(),
    overallScore: interview.overallScore,
    technicalScore: interview.technicalScore,
    communicationScore: interview.communicationScore,
    strengths: interview.strengths,
    weaknesses: interview.weaknesses,
    recommendation: interview.recommendation,
    answers: interview.answers,
    questions: interview.questions,
    status: interview.status,
    completedAt: interview.completedAt,
  };
};

const saveInterviewVideo = async ({
  sessionId,
  videoUrl,
  videoStorageKey = "",
}) => {
  const interview = await AIInterview.findById(sessionId);

  if (!interview) {
    throw new Error("Interview session not found.");
  }

  interview.videoUrl = videoUrl;
  interview.videoStorageKey = videoStorageKey;

  await interview.save();

  return {
    videoUrl: interview.videoUrl,
  };
};

export {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewResult,
  saveInterviewVideo,
};
