import type {
  AIInterviewSession,
  AIInterviewType,
  InterviewResult,
} from "../types/interview";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

interface StartInterviewResponse {
  session: AIInterviewSession;
  firstQuestion: string;
  currentQuestion?: {
    questionId: string;
    question: string;
    answered?: boolean;
  };
}

interface RespondInterviewResponse {
  completed: boolean;
  readyToComplete?: boolean;
  evaluation?: {
    score: number;
    technicalScore?: number;
    hrScore?: number;
    communicationScore?: number;
    feedback: string;
    strengths?: string[];
    weaknesses?: string[];
  };
  nextQuestion?: string;
  currentQuestion?: {
    questionId: string;
    question: string;
    answered?: boolean;
  } | null;
}

interface FinishInterviewResponse {
  result: InterviewResult;
}

export interface DriveScorecardData {
  driveId: string;
  overallScore: number;
  aptitudeScore?: number;
  technicalScore?: number;
  hrScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  strengths?: string[];
  improvements?: string[];
  feedback?: string;
  recommendation?: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("c2c_student_token");

  return {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const handleResponse = async <T>(
  response: Response,
): Promise<T> => {
  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return data as T;
};

/*
 * Start a new AI interview (technical or hr)
 */
export const startAIInterview = async ({
  driveId,
  role = "Software Engineer",
  totalQuestions = 5,
  interviewType = "technical",
}: {
  driveId: string;
  role?: string;
  totalQuestions?: number;
  interviewType?: AIInterviewType;
}): Promise<StartInterviewResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/ai-interview/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        driveId,
        role,
        totalQuestions,
        interviewType,
      }),
    },
  );

  return handleResponse<StartInterviewResponse>(
    response,
  );
};

/*
 * Submit candidate answer
 */
export const respondToAIInterview = async ({
  sessionId,
  questionId,
  question,
  answer,
}: {
  sessionId: string;
  questionId?: string;
  question?: string;
  answer: string;
}): Promise<RespondInterviewResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/ai-interview/${sessionId}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        questionId,
        question,
        answer,
      }),
    },
  );

  return handleResponse<RespondInterviewResponse>(
    response,
  );
};

/*
 * Upload recorded interview video
 */
export const uploadInterviewRecording = async (
  sessionId: string,
  videoBlob: Blob,
): Promise<{ videoUrl: string }> => {
  const formData = new FormData();

  formData.append(
    "video",
    videoBlob,
    `ai-interview-${sessionId}.webm`,
  );

  const response = await fetch(
    `${API_BASE_URL}/ai-interview/${sessionId}/recording`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    },
  );

  return handleResponse<{
    videoUrl: string;
  }>(response);
};

/*
 * Transcribe candidate audio answer via Groq Whisper
 *
 * The audio blob is sent as multipart/form-data.
 * Do NOT set Content-Type manually — the browser must
 * generate the multipart boundary automatically.
 */
export const transcribeAnswer = async (
  sessionId: string,
  audioBlob: Blob,
): Promise<{ success: boolean; transcript: string }> => {
  const formData = new FormData();

  formData.append(
    "audio",
    audioBlob,
    `interview-answer-${sessionId}.webm`,
  );

  const response = await fetch(
    `${API_BASE_URL}/ai-interview/${sessionId}/transcribe`,
    {
      method: "POST",
      headers: {
        // Only auth header — no Content-Type.
        // The browser sets multipart/form-data + boundary.
        ...getAuthHeaders(),
      },
      body: formData,
    },
  );

  return handleResponse<{ success: boolean; transcript: string }>(
    response,
  );
};

/*
 * Finish interview and get final evaluation
 */
export const finishAIInterview = async (
  sessionId: string,
): Promise<FinishInterviewResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/ai-interview/${sessionId}/complete`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return handleResponse<FinishInterviewResponse>(
    response,
  );
};

/*
 * Fetch final interview result
 */
export const getAIInterviewResult = async (
  sessionId: string,
): Promise<FinishInterviewResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/ai-interview/${sessionId}/result`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return handleResponse<FinishInterviewResponse>(
    response,
  );
};

/*
 * Fetch combined scorecard for drive
 */
export const getDriveScorecard = async (
  driveId: string,
): Promise<{ success: boolean; scorecard: DriveScorecardData }> => {
  const response = await fetch(
    `${API_BASE_URL}/ai-interview/drive/${driveId}/scorecard`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return handleResponse<{ success: boolean; scorecard: DriveScorecardData }>(
    response,
  );
};
