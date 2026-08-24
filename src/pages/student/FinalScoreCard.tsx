import React from "react";
import {
    Award,
    CheckCircle2,
    MessageSquare,
    Target,
    TrendingUp,
    Star,
    AlertCircle,
} from "lucide-react";

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
    data: ScorecardData;
    candidateName?: string;
    onContinue?: () => void;
}

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
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    {icon}
                    <span>{label}</span>
                </div>

                <span className="text-sm font-bold text-slate-900">
                    {value}%
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                    style={{ width: `${value}%` }}
                />
            </div>

            <p className="mt-2 text-xs text-slate-500">
                {getScoreLabel(value)}
            </p>
        </div>
    );
};

const FinalScorecard: React.FC<FinalScorecardProps> = ({
    data,
    candidateName,
    onContinue,
}) => {
    const overall = clampScore(data.overallScore);

    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Award size={28} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Final Evaluation
                </p>

                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Final Score & Feedback
                </h1>

                {candidateName && (
                    <p className="mt-2 text-sm text-slate-500">
                        Performance summary for {candidateName}
                    </p>
                )}
            </div>

            <div className="mb-8 grid gap-5 lg:grid-cols-[260px_1fr]">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Overall Score
                    </p>

                    <div className="my-4 flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-indigo-100">
                        <div>
                            <div className="text-4xl font-bold text-slate-900">
                                {overall}
                            </div>
                            <div className="text-xs text-slate-500">out of 100</div>
                        </div>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                        {getScoreLabel(overall)}
                    </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <ScoreBar
                        label="Aptitude"
                        score={data.aptitudeScore}
                        icon={<Target size={17} />}
                    />

                    <ScoreBar
                        label="Technical"
                        score={data.technicalScore}
                        icon={<TrendingUp size={17} />}
                    />

                    <ScoreBar
                        label="Communication"
                        score={data.communicationScore}
                        icon={<MessageSquare size={17} />}
                    />

                    <ScoreBar
                        label="HR Interview"
                        score={data.hrScore}
                        icon={<Star size={17} />}
                    />

                    {data.problemSolvingScore !== undefined && (
                        <ScoreBar
                            label="Problem Solving"
                            score={data.problemSolvingScore}
                            icon={<CheckCircle2 size={17} />}
                        />
                    )}
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-600" size={20} />
                        <h2 className="font-semibold text-slate-900">
                            Strengths
                        </h2>
                    </div>

                    {data.strengths?.length ? (
                        <ul className="space-y-2">
                            {data.strengths.map((strength, index) => (
                                <li
                                    key={`${strength}-${index}`}
                                    className="text-sm leading-6 text-slate-700"
                                >
                                    • {strength}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500">
                            No strengths were provided.
                        </p>
                    )}
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <AlertCircle className="text-amber-600" size={20} />
                        <h2 className="font-semibold text-slate-900">
                            Areas to Improve
                        </h2>
                    </div>

                    {data.improvements?.length ? (
                        <ul className="space-y-2">
                            {data.improvements.map((item, index) => (
                                <li
                                    key={`${item}-${index}`}
                                    className="text-sm leading-6 text-slate-700"
                                >
                                    • {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500">
                            No improvement areas were provided.
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <MessageSquare className="text-indigo-600" size={20} />
                    <h2 className="font-semibold text-slate-900">
                        AI Feedback
                    </h2>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {data.feedback ||
                        "Your final performance feedback will appear here."}
                </p>
            </div>

            {data.recommendation && (
                <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        Final Recommendation
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                        {data.recommendation}
                    </p>
                </div>
            )}

            {onContinue && (
                <div className="mt-7 flex justify-center">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Continue
                    </button>
                </div>
            )}
        </section>
    );
};

export default FinalScorecard;