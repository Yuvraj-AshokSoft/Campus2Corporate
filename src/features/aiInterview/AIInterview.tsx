import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mic,
  Send,
  Video,
} from "lucide-react";
import InterviewMessage from "./InterviewMessage";
import AnswerInput from "./AnswerInput";
import InterviewProgress from "./InterviewProgress";
import InterviewResult from "./InterviewResult";
import InterviewVideo from "./InterviewVideo";
import { useAIInterview } from "./hooks/useAIInterview";

export default function AIInterview() {
  const {
    session,
    messages,
    questionNumber,
    totalQuestions,
    loading,
    error,
    result,
    isCameraReady,
    isRecording,
    startInterview,
    submitAnswer,
    finishInterview,
    startRecording,
    stopRecording,
  } = useAIInterview();

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    startInterview();
  }, [startInterview]);

  const handleSubmit = async () => {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || loading || !session) {
      return;
    }

    await submitAnswer(trimmedAnswer);
    setAnswer("");
  };

  const handleFinish = async () => {
    if (isRecording) {
      await stopRecording();
    }

    await finishInterview();
  };

  if (result) {
    return (
      <InterviewResult
        result={result}
        onFinish={finishInterview}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">

        {/* Header */}
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#F4EFFF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5400D6]">
                  Technical Round 1
                </span>

                {session && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                AI Technical Interview
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Answer each question clearly and in your own words.
                Your camera and microphone remain active during the interview.
              </p>
            </div>

            <InterviewProgress
              current={questionNumber}
              total={totalQuestions}
            />
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Interview */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* Conversation */}
          <section className="flex min-h-[650px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Conversation Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Interview conversation
                </p>

                <h2 className="mt-0.5 text-sm font-black text-slate-900">
                  AI Interviewer
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isCameraReady
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Video className="h-3 w-3" />
                  {isCameraReady ? "Camera On" : "Camera Off"}
                </div>

                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    isCameraReady
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Mic className="h-3 w-3" />
                  {isCameraReady ? "Mic On" : "Mic Off"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.length === 0 && loading ? (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#5400D6]" />
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      Preparing your AI interview...
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Please allow camera and microphone access.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <InterviewMessage
                    key={message.id}
                    message={message}
                  />
                ))
              )}

              {loading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-[#F4EFFF] px-4 py-3 text-xs font-medium text-slate-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5400D6]" />
                    AI is preparing the next question...
                  </div>
                </div>
              )}
            </div>

            {/* Answer Area */}
            <div className="border-t border-slate-100 p-5">
              <AnswerInput
                value={answer}
                onChange={setAnswer}
                onSubmit={handleSubmit}
                disabled={loading || !session}
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[10px] leading-4 text-slate-400">
                  Press Enter to submit.
                  <br />
                  Use Shift + Enter for a new line.
                </p>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !answer.trim() ||
                    loading ||
                    !session
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5400D6] px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-[#5400D6]/20 transition hover:bg-[#4500AD] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                  Submit Answer
                </button>
              </div>
            </div>
          </section>

          {/* Interview Video */}
          <aside className="space-y-5">

            <InterviewVideo
              isCameraReady={isCameraReady}
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
            />

            {/* Interview Guidelines */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                <h3 className="text-sm font-black text-slate-900">
                  Interview guidelines
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <Guideline>
                  Keep your face visible throughout the interview.
                </Guideline>

                <Guideline>
                  Keep your camera and microphone enabled.
                </Guideline>

                <Guideline>
                  Answer each question in your own words.
                </Guideline>

                <Guideline>
                  Avoid leaving the interview screen during the assessment.
                </Guideline>

                <Guideline>
                  Make sure your internet connection remains stable.
                </Guideline>
              </div>
            </section>

            {/* Finish Interview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs leading-5 text-slate-500">
                Finish the interview only after answering all required
                questions. Your responses and interview recording will be
                submitted for evaluation.
              </p>

              <button
                type="button"
                onClick={handleFinish}
                disabled={loading || !session}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Finishing..." : "Finish Interview"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Guideline({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#5400D6]" />

      <p className="text-xs leading-5 text-slate-500">
        {children}
      </p>
    </div>
  );
}