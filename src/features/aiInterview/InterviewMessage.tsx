import type { InterviewMessage as InterviewMessageType } from "./types/interview";

interface InterviewMessageProps {
  message: InterviewMessageType;
}

export default function InterviewMessage({
  message,
}: InterviewMessageProps) {
  const isAI = message.role === "ai";

  return (
    <div
      className={`flex w-full ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isAI
            ? "rounded-tl-md bg-[#F4EFFF] text-slate-800"
            : "rounded-tr-md bg-[#5400D6] text-white"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isAI
                ? "text-[#5400D6]"
                : "text-white/70"
            }`}
          >
            {isAI ? "AI Interviewer" : "You"}
          </span>

          <span
            className={`text-[9px] ${
              isAI
                ? "text-slate-400"
                : "text-white/50"
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-6">
          {message.content}
        </p>
      </div>
    </div>
  );
}

function formatTime(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}