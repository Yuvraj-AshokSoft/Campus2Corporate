export type InterviewMessageRole =
  | "ai"
  | "candidate";

export interface InterviewMessage {
  id: string;
  role: InterviewMessageRole;
  content: string;
  questionId?: string;
  createdAt: string;
}

export type AIInterviewStatus =
  | "pending"
  | "active"
  | "completed"
  | "cancelled";

export interface AIInterviewSession {
  sessionId: string;
  candidateId: string;
  driveId: string;
  role?: string;

  totalQuestions: number;
  currentQuestion: number;

  status: AIInterviewStatus;

  startedAt?: string;
  completedAt?: string;
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
}

export interface InterviewAnswer {
  questionId?: string;
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
  createdAt?: string;
}

export interface InterviewResult {
  sessionId: string;

  overallScore: number;
  technicalScore: number;
  communicationScore: number;

  strengths: string[];
  weaknesses: string[];

  recommendation?: string;

  answers?: InterviewAnswer[];

  completedAt?: string;
}

export interface StartInterviewRequest {
  driveId: string;
}

export interface StartInterviewResponse {
  session: AIInterviewSession;
  firstQuestion: string;
  currentQuestion?: {
    questionId: string;
    question: string;
    answered?: boolean;
  };
}

export interface RespondInterviewRequest {
  sessionId: string;
  questionId?: string;
  question?: string;
  answer: string;
}

export interface RespondInterviewResponse {
  completed: boolean;

  evaluation?: InterviewEvaluation;

  nextQuestion?: string;
  currentQuestion?: {
    questionId: string;
    question: string;
    answered?: boolean;
  } | null;
}

export interface FinishInterviewRequest {
  sessionId: string;
}

export interface FinishInterviewResponse {
  result: InterviewResult;
}

export interface InterviewRecordingResponse {
  videoUrl: string;
}
