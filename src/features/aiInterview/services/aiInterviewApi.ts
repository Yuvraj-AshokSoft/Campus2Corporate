import type {
  AIInterviewSession,
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
 * Start a new AI interview
 */
export const startAIInterview = async ({
  driveId,
}: {
  driveId: string;
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
