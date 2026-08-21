import {
  CheckCircle2,
  RotateCcw,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import type { InterviewResult as InterviewResultType } from "./types/interview";

interface InterviewResultProps {
  result: InterviewResultType;
  onFinish: () => Promise<void> | void;
}

export default function InterviewResult({
  result,
  onFinish,
}: InterviewResultProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFFF]">
              <Trophy className="h-8 w-8 text-[#5400D6]" />
            </div>

            <span className="mt-4 inline-block rounded-full bg-[#F4EFFF] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5400D6]">
              Technical Round 1
            </span>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Interview Complete
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Your AI technical interview has been completed and your
              responses have been evaluated.
            </p>
          </div>

          {/* Overall Score */}
          <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-[#E9DDFF] bg-[#F4EFFF] p-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4500AD]">
              Overall Score
            </p>

            <p className="mt-1 text-5xl font-black text-[#5400D6]">
              {result.overallScore}%
            </p>

            <p className="mt-2 text-xs font-medium text-[#5F3C8A]">
              AI Interview Evaluation
            </p>
          </div>

          {/* Scores */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ScoreCard
              label="Technical Knowledge"
              score={result.technicalScore}
            />

            <ScoreCard
              label="Communication"
              score={result.communicationScore}
            />
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* Strengths */}
          <FeedbackCard
            title="Strengths"
            icon={
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            }
            items={result.strengths}
            type="success"
          />

          {/* Weaknesses */}
          <FeedbackCard
            title="Areas to Improve"
            icon={
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            }
            items={result.weaknesses}
            type="warning"
          />
        </div>

        {/* Recommendation */}
        {result.recommendation && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-black text-slate-900">
              AI Recommendation
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {result.recommendation}
            </p>
          </div>
        )}

        {/* Finish */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={onFinish}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5400D6] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-[#5400D6]/20 transition hover:bg-[#4500AD]"
          >
            <RotateCcw className="h-4 w-4" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const normalizedScore = Math.min(
    100,
    Math.max(0, score),
  );

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-600">
          {label}
        </p>

        <p className="text-lg font-black text-slate-900">
          {normalizedScore}%
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#5400D6] transition-all duration-700"
          style={{
            width: `${normalizedScore}%`,
          }}
        />
      </div>
    </div>
  );
}

function FeedbackCard({
  title,
  icon,
  items,
  type,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  type: "success" | "warning";
}) {
  const isSuccess = type === "success";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}

        <h2 className="text-sm font-black text-slate-900">
          {title}
        </h2>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-2.5"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                  isSuccess
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              <span className="text-xs leading-5 text-slate-600">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-xs text-slate-400">
          No additional feedback available.
        </p>
      )}
    </section>
  );
}