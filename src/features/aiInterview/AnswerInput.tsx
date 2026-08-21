import type { KeyboardEvent } from "react";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: AnswerInputProps) {
  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // Enter submits the answer.
    // Shift + Enter creates a new line.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={5}
        maxLength={5000}
        placeholder="Type your answer here..."
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B99AFF] focus:bg-white focus:ring-2 focus:ring-[#F4EFFF] disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="pointer-events-none absolute bottom-2.5 right-3 text-[10px] text-slate-400">
        {value.length}/5000
      </div>
    </div>
  );
}
