import React, { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  MessageSquare,
  Target,
  TrendingUp,
  Star,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  User,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export interface ScorecardData {
  overallScore: number;
  aptitudeScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  hrScore?: number;
  problemSolvingScore?: number;
  strengths?: string[];
  improvements?: string[];
  feedback?: string;
  recommendation?: string;
}

interface FinalScorecardProps {
  data?: ScorecardData;
  candidateName?: string;
  onContinue?: () => void;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const auth = () => `Bearer ${localStorage.getItem("c2c_student_token") || ""}`;

const clampScore = (value?: number) =>
  Math.max(0, Math.min(100, Number(value ?? 0)));

const getScoreLabel = (score: number) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
};

const ScoreBar = ({
  label,
  score,
  icon,
}: {
  label: string;
  score?: number;
  icon: React.ReactNode;
}) => {
  const value = clampScore(score);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
          <span className="text-[#5400D6]">{icon}</span>
          <span>{label}</span>
        </div>

        <span className="text-base font-black text-slate-900">
          {value}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#5400D6] transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Benchmark</span>
        <span className="font-semibold text-slate-600">{getScoreLabel(value)}</span>
      </div>
    </div>
  );
};

export default function FinalScoreCard({
  data: propData,
  candidateName: propCandidateName,
  onContinue,
}: FinalScorecardProps) {
  const navigate = useNavigate();
  const { driveId: paramDriveId } = useParams<{ driveId?: string }>();
  const [searchParams] = useSearchParams();
  const driveId = paramDriveId || searchParams.get("driveId") || "google-sde-drive";

  const [scorecard, setScorecard] = useState<ScorecardData>(() => {
    if (propData) return propData;

    return {
      overallScore: 0,
      strengths: [],
      improvements: [],
      feedback: "Loading your latest scorecard from the backend interview results...",
      recommendation: "Waiting for the final AI evaluation to finish.",
    };
  });

  const [candidateName] = useState(propCandidateName || "Student");

  useEffect(() => {
    if (propData) {
      setScorecard(propData);
      return;
    }

    // Attempt to load from backend scorecard API if available
    const fetchScorecard = async () => {
      if (!driveId) return;
      try {
        const res = await fetch(`${API}/ai-interview/drive/${driveId}/scorecard`, {
          headers: { Authorization: auth() },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.scorecard) {
            setScorecard((prev) => ({
              ...prev,
              ...data.scorecard,
            }));
          }
        }
      } catch {
        // fallback to local data
      }
    };

    void fetchScorecard();
  }, [driveId, propData]);

  const overall = clampScore(scorecard.overallScore);

  return (
    <div className="min-h-screen bg-[#f8f7fb] px-4 py-8 sm:px-6 lg:px-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation back */}
        <button
          type="button"
          onClick={() => (onContinue ? onContinue() : navigate(`/student/hiring-process/${driveId}`))}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-[#5400D6]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hiring Process
        </button>

        {/* Header Hero Card */}
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#F4EFFF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#5400D6]">
                  Hiring Process Completed
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  All Rounds Passed
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Comprehensive Candidate Scorecard
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Consolidated evaluation across Aptitude, Technical Round 1, and HR Interview.
              </p>

              {/* Meta details */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {candidateName}
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  Software Engineer Role
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Batch 2026-2027
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-indigo-100 bg-[#F4EFFF] p-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#5400D6]">
                  Hiring Decision
                </p>
                <p className="mt-1 text-xl font-black text-[#5400D6]">
                  {overall >= 70 ? "SELECTED" : "REVIEW"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Overall Score & Round Breakdown */}
        <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Circular Overall Score Card */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4EFFF] text-[#5400D6]">
              <Award className="h-6 w-6" />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Overall Candidate Score
            </p>

            <div className="relative my-6 flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-[#F4EFFF]">
              <div className="text-center">
                <span className="text-5xl font-black tracking-tight text-[#5400D6]">
                  {overall}
                </span>
                <span className="block text-xs font-bold text-slate-400">out of 100</span>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700">
              {getScoreLabel(overall)} Performance
            </span>

            <p className="mt-4 text-xs text-slate-400">
              Weighted composite of all 3 rounds
            </p>
          </div>

          {/* Individual Round Subscores Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreBar
              label="Aptitude & Logic"
              score={scorecard.aptitudeScore}
              icon={<Target className="h-4 w-4" />}
            />

            <ScoreBar
              label="Technical Round 1"
              score={scorecard.technicalScore}
              icon={<TrendingUp className="h-4 w-4" />}
            />

            <ScoreBar
              label="HR & Behavioral"
              score={scorecard.hrScore}
              icon={<Star className="h-4 w-4" />}
            />

            <ScoreBar
              label="Communication Quality"
              score={scorecard.communicationScore}
              icon={<MessageSquare className="h-4 w-4" />}
            />

            {scorecard.problemSolvingScore !== undefined && (
              <div className="sm:col-span-2">
                <ScoreBar
                  label="Problem Solving & Analytical Thinking"
                  score={scorecard.problemSolvingScore}
                  icon={<Layers className="h-4 w-4" />}
                />
              </div>
            )}
          </div>
        </section>

        {/* Strengths & Improvements Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-emerald-950">
                  Key Strengths
                </h2>
                <p className="text-xs text-emerald-700">High performance competency areas</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {scorecard.strengths?.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-medium leading-relaxed text-emerald-900 bg-white/70 p-3 rounded-xl border border-emerald-100/60"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="rounded-3xl border border-amber-100 bg-amber-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-amber-950">
                  Areas to Improve
                </h2>
                <p className="text-xs text-amber-700">Recommended focus areas for career growth</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {scorecard.improvements?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-medium leading-relaxed text-amber-900 bg-white/70 p-3 rounded-xl border border-amber-100/60"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* AI Evaluation & Feedback */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EFFF] text-[#5400D6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                AI Panel Evaluation & Feedback
              </h2>
              <p className="text-xs text-slate-500">Holistic hiring summary generated by AI evaluators</p>
            </div>
          </div>

          <p className="mt-5 text-sm sm:text-base leading-7 text-slate-700 bg-[#fbf9fe] p-5 rounded-2xl border border-slate-100 whitespace-pre-line">
            {scorecard.feedback}
          </p>

          {scorecard.recommendation && (
            <div className="mt-5 rounded-2xl border border-[#E9DDFF] bg-[#F4EFFF] p-5">
              <p className="text-xs font-black uppercase tracking-wider text-[#5400D6]">
                Final AI Hiring Recommendation
              </p>
              <p className="mt-1.5 text-sm sm:text-base font-bold text-slate-900">
                {scorecard.recommendation}
              </p>
            </div>
          )}
        </section>

        {/* Action Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-slate-900">
              Campus2Corporate Hiring Dossier
            </p>
            <p className="text-xs text-slate-400">
              Your results are synced with your student profile and recruiter dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/student-dashboard")}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate("/student/placementprep")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5400D6] px-6 py-3 text-xs font-bold text-white shadow-md shadow-[#5400D6]/20 transition hover:bg-[#4500AD]"
            >
              <span>Explore More Drives</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}