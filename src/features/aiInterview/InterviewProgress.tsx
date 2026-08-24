interface InterviewProgressProps {
  current: number;
  total: number;
}

export default function InterviewProgress({
  current,
  total,
}: InterviewProgressProps) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(
    Math.max(current, 0),
    safeTotal,
  );

  const progress = Math.round(
    (safeCurrent / safeTotal) * 100,
  );

  return (
    <div className="w-full max-w-[220px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Interview Progress
        </span>

        <span className="text-[11px] font-bold text-slate-700">
          {safeCurrent}/{safeTotal}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#5400D6] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-1.5 text-right text-[10px] font-medium text-slate-400">
        {progress}% complete
      </p>
    </div>
  );
}