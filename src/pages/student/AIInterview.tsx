import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  Mic,
  Send,
  Sparkles,
  Square,
  Star,
  Users,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useVoiceInterview, type VoiceInterviewState } from "../../features/aiInterview/hooks/useVoiceInterview";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const auth = () => `Bearer ${localStorage.getItem("c2c_student_token") || ""}`;

const getCameraErrorMessage = (error: unknown): string => {
  const name = error instanceof DOMException ? error.name : (error as { name?: string })?.name || "";
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Camera permission is required for the interview.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera was detected.";
    case "NotReadableError":
    case "TrackStartError":
      return "The camera is currently being used by another application.";
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "The camera configuration is unavailable.";
    case "SecurityError":
      return "Camera access is blocked by the browser.";
    default:
      return "Unable to access the camera.";
  }
};

type Session = {
  sessionId: string;
  role: string;
  interviewType?: "technical" | "hr";
  totalQuestions: number;
  currentQuestion: number;
};

type Question = {
  questionId: string;
  question: string;
};

type Result = {
  sessionId: string;
  interviewType?: "technical" | "hr";
  overallScore: number;
  technicalScore?: number;
  hrScore?: number;
  communicationScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation?: string;
};

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: auth(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "AI interviewer temporarily unavailable. Please try again.");
  }
  return data as T;
}

export default function AIInterview() {
  const navigate = useNavigate();
  const { driveId } = useParams<{ driveId: string }>();
  const [searchParams] = useSearchParams();

  const roundParam = searchParams.get("round") || searchParams.get("type");
  const isHrRound = roundParam?.toLowerCase() === "hr";

  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [textMode, setTextMode] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const isInitializingCameraRef = useRef(false);
  const isSubmittingAnswerRef = useRef(false);
  const isMountedRef = useRef(true);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, []);

  const attachStreamToVideo = useCallback(async (stream: MediaStream) => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.muted = true;
    video.playsInline = true;

    try {
      await video.play();
    } catch (playErr) {
      console.warn("[Camera] Video playback warning:", playErr);
    }

    console.log("[Camera] video dimensions:", video.videoWidth, video.videoHeight);
    console.log("[Camera] srcObject attached:", video.srcObject === stream);

    const hasLiveTrack = stream.getVideoTracks().some((track) => track.readyState === "live");
    if (hasLiveTrack) {
      setCameraReady(true);
      setCameraError("");
    }
  }, []);

  const setVideoElement = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && cameraStreamRef.current && isMountedRef.current) {
      const liveTrack = cameraStreamRef.current.getVideoTracks().find((t) => t.readyState === "live");
      if (liveTrack) {
        if (node.srcObject !== cameraStreamRef.current) {
          node.srcObject = cameraStreamRef.current;
        }
        node.muted = true;
        node.playsInline = true;
        node.play().then(() => {
          if (isMountedRef.current) {
            setCameraReady(true);
            setCameraError("");
          }
        }).catch((err) => {
          console.warn("[Camera] Autoplay warning:", err);
        });
      }
    }
  }, []);

  const initializeCamera = useCallback(async () => {
    if (isInitializingCameraRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser.");
      return;
    }

    isInitializingCameraRef.current = true;
    console.log("[Camera] initializing");

    try {
      let stream = cameraStreamRef.current;
      const liveTrack = stream?.getVideoTracks().find((track) => track.readyState === "live");

      if (!stream || !liveTrack) {
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach((track) => track.stop());
          cameraStreamRef.current = null;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (!isMountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = stream;
      }

      console.log("[Camera] stream:", stream);
      console.log("[Camera] tracks:", stream.getVideoTracks());
      console.log("[Camera] track state:", stream.getVideoTracks()[0]?.readyState);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          if (isMountedRef.current) {
            setCameraReady(false);
          }
        };
      }

      await attachStreamToVideo(stream);
    } catch (cameraErr) {
      console.error("[Camera] getUserMedia error:", cameraErr);
      cameraStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (isMountedRef.current) {
        setCameraReady(false);
        setCameraError(getCameraErrorMessage(cameraErr));
      }
    } finally {
      isInitializingCameraRef.current = false;
    }
  }, [attachStreamToVideo]);

  const toggleCamera = useCallback(() => {
    if (cameraReady) {
      stopCamera();
    } else {
      void initializeCamera();
    }
  }, [cameraReady, stopCamera, initializeCamera]);

  const finishInterview = useCallback(async () => {
    if (!session) return;
    try {
      const response = await request<{ result: Result }>(`/ai-interview/${session.sessionId}/complete`, {
        method: "POST",
      });

      const finalResult = {
        ...response.result,
        interviewType: isHrRound ? ("hr" as const) : ("technical" as const),
      };

      setResult(finalResult);
      setQuestion(null);
      stopCamera();

      // Cache the result for this drive in localStorage
      if (driveId) {
        const storageKey = isHrRound
          ? `c2c_interview_result_${driveId}_hr`
          : `c2c_interview_result_${driveId}_technical`;
        localStorage.setItem(storageKey, JSON.stringify(finalResult));
      }
    } catch (completionError) {
      setError(
        completionError instanceof Error
          ? completionError.message
          : "Unable to complete the interview.",
      );
    }
  }, [driveId, isHrRound, session, stopCamera]);

  const submitAnswer = useCallback(
    async (value: string) => {
      if (!session || !question || processing || !value.trim()) return;
      setProcessing(true);
      setAnswer(value);
      setError("");
      try {
        const response = await request<{
          completed: boolean;
          currentQuestion?: Question;
        }>(`/ai-interview/${session.sessionId}/answer`, {
          method: "POST",
          body: JSON.stringify({
            questionId: question.questionId,
            question: question.question,
            answer: value.trim(),
          }),
        });

        if (response.completed) {
          await finishInterview();
        } else if (response.currentQuestion?.question) {
          setSession((current) =>
            current ? { ...current, currentQuestion: current.currentQuestion + 1 } : current,
          );
          setQuestion(response.currentQuestion);
          setAnswer("");
        }
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to process your response.",
        );
      } finally {
        setProcessing(false);
      }
    },
    [finishInterview, processing, question, session],
  );

  const handleTranscriptComplete = useCallback(
    (transcript: string) => {
      isSubmittingAnswerRef.current = false;
      void submitAnswer(transcript);
    },
    [submitAnswer],
  );

  const voice = useVoiceInterview(handleTranscriptComplete);

  const handleFinishAnswer = useCallback(() => {
    if (isSubmittingAnswerRef.current) return;
    isSubmittingAnswerRef.current = true;
    void voice.finishListening();
  }, [voice]);

  const startInterview = useCallback(async () => {
    if (!driveId) {
      setError("Hiring drive was not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setQuestion(null);

    try {
      const response = await request<{
        session: Session;
        currentQuestion: Question;
        firstQuestion: string;
      }>("/ai-interview/start", {
        method: "POST",
        body: JSON.stringify({
          driveId,
          role: "Software Engineer",
          totalQuestions: 5,
          interviewType: isHrRound ? "hr" : "technical",
        }),
      });

      setSession(response.session);
      setQuestion(
        response.currentQuestion || {
          questionId: crypto.randomUUID(),
          question: response.firstQuestion,
        },
      );
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start the AI interview.",
      );
    } finally {
      setLoading(false);
    }
  }, [driveId, isHrRound]);

  useEffect(() => {
    void startInterview();
  }, [startInterview]);

  // Initialize camera preview on mount & when interview view is ready
  useEffect(() => {
    if (!loading && !result) {
      if (cameraStreamRef.current) {
        void attachStreamToVideo(cameraStreamRef.current);
      } else {
        void initializeCamera();
      }
    }
  }, [loading, result, initializeCamera, attachStreamToVideo]);

  // Speak question via browser TTS whenever a new question is ready
  useEffect(() => {
    if (question?.question && !processing) {
      voice.speak(question.question);
    }
  }, [question?.question, processing, voice]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      voice.stop();
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraReady(false);
    };
  }, [voice]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#5400D6]" />
          <p className="mt-4 text-base font-bold text-slate-800">
            {isHrRound ? "Preparing your HR & Behavioral Interview..." : "Preparing your Technical Round 1..."}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {isHrRound
              ? "Configuring behavioral scenarios and culture-fit questions"
              : "Calibrating coding competencies and CS fundamentals"}
          </p>
        </div>
      </main>
    );
  }

  if (result) {
    return (
      <ResultView
        result={result}
        isHrRound={isHrRound}
        onContinue={() => {
          if (!isHrRound) {
            // Technical Round completed -> Transition to HR Interview
            navigate(`/student/ai-interview/${driveId}?round=hr`);
          } else {
            // HR Round completed -> Transition to Final Score & Feedback
            navigate(`/student/final-scorecard/${driveId || ""}`);
          }
        }}
      />
    );
  }

  const isVoiceBusy =
    voice.state === "speaking" ||
    voice.state === "processing" ||
    voice.state === "transcribing";

  const labels: Record<VoiceInterviewState, string> = {
    idle: "Ready to Speak",
    speaking: "AI Interviewer Speaking",
    listening: "YOUR TURN (LISTENING...)",
    transcribing: "Groq Whisper Transcribing...",
    processing: "Gemini Analyzing Response...",
    error: voice.errorMessage || "Microphone unavailable",
  };

  const listening = voice.state === "listening";
  const transcribing = voice.state === "transcribing";

  return (
    <main className="min-h-screen bg-[#f8f7fb] px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#F4EFFF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#5400D6]">
                {isHrRound ? "Round 3 · HR Interview" : "Round 2 · Technical Round 1"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {isHrRound
                ? "Behavioral, Situational & Culture-Fit Interview"
                : "Technical & Problem-Solving Interview"}
            </h1>
            <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">
              {session?.role || "Software Engineer"} · Question {session?.currentQuestion || 1} of{" "}
              {session?.totalQuestions || 5}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              {isHrRound ? "STAR Method Evaluation" : "Adaptive Difficulty"}
            </span>
          </div>
        </header>

        {/* Error Alert */}
        {(error || cameraError) && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error || cameraError}</span>
          </div>
        )}

        {/* Interview Stage */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Active Question & Voice Card */}
          <section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            {/* Pulsing Avatar Visualizer */}
            <div
              className={`flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ${
                voice.state === "speaking"
                  ? "bg-[#eee5ff] shadow-[0_0_0_18px_#f7f3ff] ring-4 ring-[#5400D6]"
                  : listening
                    ? "bg-emerald-50 shadow-[0_0_0_18px_#f0fdf8] ring-4 ring-emerald-500"
                    : transcribing
                      ? "bg-amber-50 shadow-[0_0_0_18px_#fffbeb] ring-4 ring-amber-500"
                      : "bg-slate-100"
              }`}
            >
              {isHrRound ? (
                <Users className="h-10 w-10 text-[#5400D6]" />
              ) : (
                <Sparkles className="h-10 w-10 text-[#5400D6]" />
              )}
            </div>

            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
              {labels[voice.state]}
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight sm:text-3xl text-slate-900">
              {listening
                ? "🎙 Recording your response... Speak naturally."
                : transcribing
                  ? "Transcribing your response with Groq Whisper..."
                  : voice.state === "processing"
                    ? "Evaluating and adapting next question..."
                    : question?.question || "Welcome to your interview round."}
            </h2>

            {/* Audio Wave Visualizer */}
            {listening && (
              <div className="mt-6 flex h-10 items-center gap-1.5">
                {[12, 24, 38, 20, 32, 15, 28, 42, 22, 35, 18, 30, 44, 25].map((height, index) => (
                  <span
                    key={index}
                    className="w-1 animate-pulse rounded-full bg-emerald-500"
                    style={{
                      height,
                      animationDuration: `${0.6 + (index % 4) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {transcribing && (
              <div className="mt-6 flex items-center gap-2 text-amber-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-semibold">Generating transcript...</span>
              </div>
            )}

            {answer && (
              <p className="mt-6 max-w-xl text-xs sm:text-sm leading-6 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                "{answer}"
              </p>
            )}

            {/* Controls */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {listening ? (
                <button
                  type="button"
                  onClick={handleFinishAnswer}
                  disabled={isSubmittingAnswerRef.current}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-700 disabled:opacity-40"
                >
                  <Square className="h-4 w-4 fill-white" />
                  Finish Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (session) {
                      isSubmittingAnswerRef.current = false;
                      void voice.startListening(session.sessionId);
                    }
                  }}
                  disabled={isVoiceBusy || processing}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5400D6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5400D6]/25 transition hover:bg-[#4500AD] disabled:opacity-40"
                >
                  <Mic className="h-4 w-4" />
                  Start Speaking
                </button>
              )}

              <button
                type="button"
                onClick={() => setTextMode((value) => !value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {textMode ? "Hide Text Mode" : "Type Answer Instead"}
              </button>
            </div>

            {/* Text Mode Fallback */}
            {textMode && (
              <div className="mt-5 flex w-full max-w-xl gap-2">
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  rows={2}
                  placeholder="Type your response clearly here..."
                  className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#5400D6] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => submitAnswer(answer)}
                  disabled={!answer.trim() || processing}
                  className="rounded-xl bg-[#5400D6] px-5 font-bold text-white transition hover:bg-[#4500AD] disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}

            <p className="mt-8 text-[11px] text-slate-400">
              Evaluated by AI in real-time. Detailed feedback & scores appear at the end.
            </p>
          </section>

          {/* Sidebar (Video & Instructions) */}
          <aside className="space-y-4">
            {/* Video preview */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                <video
                  ref={setVideoElement}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => setCameraReady(true)}
                  onCanPlay={() => setCameraReady(true)}
                  onPlaying={() => setCameraReady(true)}
                  className={`h-full w-full object-cover ${cameraReady ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
                />
                {!cameraReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 px-4 text-center">
                    <CameraOff className="h-8 w-8 mb-1" />
                    <p className="text-[10px] font-semibold">{cameraError || "Camera preview inactive"}</p>
                  </div>
                )}
              </div>

              <div className="p-3">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  {cameraReady ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  {cameraReady ? "Turn Camera Off" : "Turn Camera On"}
                </button>
              </div>
            </section>

            {/* Round Insights */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isHrRound ? "HR Round Rubric" : "Technical Round Rubric"}
              </p>
              <div className="mt-3 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>
                    {isHrRound ? "Behavioral depth & STAR structure" : "Algorithmic accuracy & CS concepts"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>
                    {isHrRound ? "Team culture, empathy & leadership" : "Problem-solving methodology"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Clear articulation & communication</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ResultView({
  result,
  isHrRound,
  onContinue,
}: {
  result: Result;
  isHrRound: boolean;
  onContinue: () => void;
}) {
  const primaryScoreLabel = isHrRound ? "HR & Culture-Fit" : "Technical Knowledge";
  const primaryScoreValue = isHrRound
    ? result.hrScore ?? result.overallScore
    : result.technicalScore ?? result.overallScore;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7fb] px-4 py-8">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#5400D6]">
            {isHrRound ? "HR Interview Complete" : "Technical Round 1 Complete"}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            {isHrRound ? "HR Evaluation Summary" : "Technical Evaluation Summary"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isHrRound
              ? "Your behavioral, communication, and culture-fit responses have been scored."
              : "Your technical answers and problem-solving abilities have been scored."}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Overall Score", result.overallScore],
            [primaryScoreLabel, primaryScoreValue],
            ["Communication", result.communicationScore],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl bg-[#f5f0ff] p-5 text-center">
              <p className="text-xs font-bold text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-black text-[#5400D6]">
                {value}
                <span className="text-base font-normal text-slate-400">/100</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50/50 p-5 border border-emerald-100">
            <h2 className="font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Strengths
            </h2>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
              {result.strengths?.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100">
            <h2 className="font-bold text-amber-950 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-600" />
              Areas to Improve
            </h2>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
              {result.weaknesses?.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.recommendation && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Recommendation</p>
            <p className="mt-1 text-sm text-slate-700">{result.recommendation}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5400D6] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5400D6]/25 transition hover:bg-[#4500AD]"
        >
          <span>{isHrRound ? "View Final Scorecard & Feedback" : "Continue to HR Interview"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </main>
  );
}
