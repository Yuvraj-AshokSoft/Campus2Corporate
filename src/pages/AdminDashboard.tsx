
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type IconName =
  | "activity" | "alert" | "arrow-up" | "arrow-down" | "bell" | "briefcase"
  | "building" | "calendar" | "chart" | "check" | "clock" | "dashboard"
  | "database" | "file" | "graduation" | "lock" | "plug" | "search"
  | "settings" | "shield" | "sparkles" | "target" | "user-check" | "users"
  | "ai-brain" | "placement" | "resume" | "interview" | "risk" | "campus"
  | "automation" | "monitor" | "send" | "refresh" | "close" | "chevron-right"
  | "wand" | "zap" | "trending-up" | "cpu" | "moon" | "sun" | "filter"
  | "download" | "eye" | "trash" | "more" | "plus" | "check-circle"
  | "x-circle" | "info" | "star" | "flame" | "layers" | "grid" | "list"
  | "bell-off" | "arrow-right" | "chevron-down" | "menu";

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) => {
  const paths: Record<IconName, React.ReactNode> = {
    activity: <path d="M4 12h3l2-6 4 12 2-6h5" />,
    alert: <><path d="M12 4 3.5 18.5h17L12 4Z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
    "arrow-up": <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
    "arrow-down": <><path d="M7 7 17 17" /><path d="M17 9v8H9" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    "bell-off": <><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 1-.29 3.94" /><path d="M13.7 13.7A6 6 0 0 1 6 8v-1" /><path d="M10 20a2 2 0 0 0 4 0" /><path d="m2 2 20 20" /></>,
    briefcase: <><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" /><path d="M4 12h16" /></>,
    building: <><path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M3 21h18" /></>,
    calendar: <><path d="M7 3v4" /><path d="M17 3v4" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-7" /></>,
    check: <><path d="M21 12a9 9 0 1 1-5-8" /><path d="m9 12 2 2 6-7" /></>,
    "check-circle": <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    "x-circle": <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></>,
    graduation: <><path d="m22 10-10-5-10 5 10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    plug: <><path d="M8 3v5" /><path d="M16 3v5" /><path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" /><path d="M12 18v3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    shield: <><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" /><path d="m9 12 2 2 4-5" /></>,
    sparkles: <><path d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" /><path d="M5 16v4" /><path d="M3 18h4" /><path d="M19 3v3" /><path d="M17.5 4.5h3" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /></>,
    "user-check": <><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="m16 11 2 2 4-5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8" /><path d="M16 3.2a4 4 0 0 1 0 7.6" /></>,
    "ai-brain": <><circle cx="12" cy="12" r="5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="m4.9 4.9 2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" /></>,
    placement: <><path d="M12 4v12" /><path d="m8 12 4-4 4 4" /><path d="M8 20h8" /></>,
    resume: <><path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M8 13h8" /><path d="M8 17h6" /></>,
    interview: <><path d="M6 7h12v8H9l-3 3V7Z" /></>,
    risk: <><path d="M12 3 3 19h18L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
    campus: <><path d="M4 21V9l8-5 8 5v12" /><path d="M12 3v18" /><path d="M8 12h8" /></>,
    automation: <><circle cx="12" cy="12" r="5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /><path d="m4.9 4.9 1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    monitor: <><rect x="4" y="5" width="16" height="12" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
    send: <><path d="m22 2-11 11" /><path d="m22 2-7 20-4-9-9-4 20-7z" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    "arrow-right": <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
    wand: <><path d="m15 5 4 4" /><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 3.43L9.6 10.1" /><path d="m9.6 10.1-4.3 4.3a2.41 2.41 0 0 0 3.43 3.4L13 13.4" /><path d="m13 13.4 4.3 4.3a2.41 2.41 0 0 0 3.4-3.43L16.6 10" /><path d="m16.6 10 1.7-1.7" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    "trending-up": <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>,
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2" /></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    sun: <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    more: <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Toast System ─────────────────────────────────────────────────────────────
type Toast = { id: number; message: string; type: "success" | "error" | "info" | "warning" };
let toastCount = 0;
const toastListeners: Array<(t: Toast) => void> = [];
const showToast = (message: string, type: Toast["type"] = "info") => {
  const toast = { id: ++toastCount, message, type };
  toastListeners.forEach((fn) => fn(toast));
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
    };
    toastListeners.push(handler);
    return () => { const i = toastListeners.indexOf(handler); if (i > -1) toastListeners.splice(i, 1); };
  }, []);
  const icons: Record<Toast["type"], IconName> = { success: "check-circle", error: "x-circle", info: "info", warning: "alert" };
  const colors: Record<Toast["type"], string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    error: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
    warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  };
  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-xl pointer-events-auto ${colors[t.type]}`}
          style={{ animation: "slideUp 0.3s ease" }}>
          <Icon name={icons[t.type]} className="h-4 w-4 flex-shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
};

// ─── Pulse Dot ───────────────────────────────────────────────────────────────
const PulseDot = ({ color = "#10b981" }: { color?: string }) => (
  <span className="relative flex h-2 w-2 flex-shrink-0">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />
    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
  </span>
);

// ─── Dark mode context ────────────────────────────────────────────────────────
const useDark = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") return document.documentElement.classList.contains("dark");
    return false;
  });
  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);
  return { dark, toggle };
};

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
const AIChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello! I'm the C2C AI assistant. Ask me anything about placements, student data, recruiter activity, or risk alerts." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text?: string) => {
    const userText = text ?? input.trim();
    if (!userText) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);
    try {
      const history = [...messages, { role: "user", text: userText }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "You are an expert AI assistant embedded in the C2C (Campus to Career) admin platform by Ashoksoft. Help admins analyze student placements, recruiter pipelines, risk alerts, campus data, and audit trails. Be concise, data-aware, and actionable. Use bullet points when listing multiple items. Stats: 18.4k student signals, 89% placement rate, 132 active drives, 23 risk alerts, security score 94/100.",
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map((b: { text?: string }) => b.text || "").join("") || "Sorry, no response.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally { setLoading(false); }
  };

  const quickPrompts = ["Summarize today's placement risks", "Which recruiters need follow-up?", "Predict next month's rate", "Flag anomalies"];

  return (
    <div className="flex h-full flex-col bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <Icon name="sparkles" className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">C2C AI Assistant</p>
            <div className="flex items-center gap-1.5"><PulseDot /><span className="text-[10px] text-emerald-400">Online</span></div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"><Icon name="close" className="h-4 w-4" /></button>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 p-3">
        {quickPrompts.map((t) => (
          <button key={t} onClick={() => send(t)} className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:border-blue-500 hover:text-blue-400 transition">{t}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm bg-slate-800 text-slate-200"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
              <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2">
          <input className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            placeholder="Ask about placements, risks, recruiters…"
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-40">
            <Icon name="send" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── AI Insight Card ──────────────────────────────────────────────────────────
const AIInsightCard = () => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: "Given these C2C platform stats: 18,400 student signals (+14%), 89% placement rate (+3.1%), 132 active drives (+12%), 23 risk alerts (−8%), 61 pending approvals, 94/100 security score, 88% data sync. Generate 3 concise, actionable bullet-point insights an admin should act on today. Each bullet is one sentence starting with an action verb. Be specific and data-driven." }],
        }),
      });
      const data = await res.json();
      setInsight(data.content?.map((b: { text?: string }) => b.text || "").join("") || "");
      setFetched(true);
    } catch { setInsight("Unable to generate insights at this time."); setFetched(true); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm ring-1 ring-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <Icon name="sparkles" className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI Daily Brief</p>
            <h3 className="text-sm font-bold text-white">Platform intelligence</h3>
          </div>
        </div>
        <button onClick={generate} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition disabled:opacity-50">
          <Icon name={loading ? "refresh" : "wand"} className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Thinking…" : fetched ? "Refresh" : "Generate"}
        </button>
      </div>
      {!fetched && !loading && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-400">Click <span className="font-semibold text-blue-400">Generate</span> to get AI insights from live data.</p>
        </div>
      )}
      {loading && <div className="mt-4 space-y-2">{[80, 95, 65].map((w, i) => <div key={i} className="h-4 animate-pulse rounded-full bg-white/10" style={{ width: `${w}%` }} />)}</div>}
      {fetched && !loading && insight && (
        <div className="mt-4 space-y-2.5">
          {insight.split("\n").filter((l) => l.trim()).map((line, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              <p className="text-xs leading-5 text-slate-300">{line.replace(/^[•\-*\d.]\s*/, "")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── AI Risk Scorer ───────────────────────────────────────────────────────────
const AIRiskScorer = () => {
  const [score, setScore] = useState<null | { level: string; summary: string; color: string; pct: number }>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "You are a risk analysis engine. Respond ONLY with valid JSON, no markdown.",
          messages: [{ role: "user", content: `Analyze this C2C snapshot and return JSON with: "level" (Low|Moderate|Elevated|High), "score" (0-100 integer, higher=more risk), "summary" (one sentence on top risk driver). Data: 23 risk alerts (down 8%), 5 flagged student reports 2h SLA, 18 pending recruiter verifications, 94/100 security score, 31 mentor audits pending, 7 system alerts.` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: { text?: string }) => b.text || "").join("") || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const cm: Record<string, string> = { Low: "#10b981", Moderate: "#f59e0b", Elevated: "#f97316", High: "#ef4444" };
      setScore({ level: parsed.level, summary: parsed.summary, color: cm[parsed.level] || "#6b7280", pct: parsed.score || 50 });
    } catch { setScore({ level: "Unknown", summary: "Could not compute risk score.", color: "#6b7280", pct: 0 }); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">AI Risk Engine</p>
          <h3 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">Live risk assessment</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/30">
          <Icon name="zap" className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        </div>
      </div>
      {score ? (
        <div className="rounded-xl border p-4" style={{ borderColor: score.color + "40", background: score.color + "10" }}>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black" style={{ color: score.color }}>{score.level}</span>
            <span className="text-sm font-black" style={{ color: score.color }}>{score.pct}/100</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score.pct}%`, background: score.color }} />
          </div>
          <p className="mt-2.5 text-xs leading-5 text-slate-600 dark:text-slate-400">{score.summary}</p>
          <button onClick={analyze} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition dark:hover:text-slate-200">
            <Icon name="refresh" className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />Re-assess
          </button>
        </div>
      ) : (
        <button onClick={analyze} disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-rose-900/20">
          {loading ? <><Icon name="refresh" className="h-4 w-4 animate-spin" />Analyzing…</> : <><Icon name="cpu" className="h-4 w-4" />Run AI risk scan</>}
        </button>
      )}
    </div>
  );
};

// ─── Notification Panel ───────────────────────────────────────────────────────
type Notif = { id: number; title: string; body: string; time: string; read: boolean; type: "alert" | "info" | "success" };
const initialNotifs: Notif[] = [
  { id: 1, title: "High-priority recruiter pending", body: "TechCorp India has been waiting 6h for verification.", time: "6h ago", read: false, type: "alert" },
  { id: 2, title: "AI risk score updated", body: "Platform risk dropped to Moderate after 8 alerts resolved.", time: "2h ago", read: false, type: "info" },
  { id: 3, title: "Batch placement confirmed", body: "47 students from IIT Indore received offers via Infosys drive.", time: "1h ago", read: false, type: "success" },
  { id: 4, title: "Security scan complete", body: "No vulnerabilities detected. Score remains 94/100.", time: "30m ago", read: true, type: "success" },
  { id: 5, title: "API key expiry warning", body: "ATS Sync API key expires in 3 days. Rotate before expiry.", time: "15m ago", read: false, type: "alert" },
];

const NotifPanel = ({ onClose }: { onClose: () => void }) => {
  const [notifs, setNotifs] = useState(initialNotifs);
  const unread = notifs.filter((n) => !n.read).length;
  const markAll = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const dismiss = (id: number) => setNotifs((n) => n.filter((x) => x.id !== id));
  const markOne = (id: number) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  const typeIcon: Record<Notif["type"], IconName> = { alert: "alert", info: "info", success: "check-circle" };
  const typeColor: Record<Notif["type"], string> = {
    alert: "text-rose-500 bg-rose-50 dark:bg-rose-900/30",
    info: "text-blue-500 bg-blue-50 dark:bg-blue-900/30",
    success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30",
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div>
          <h2 className="text-sm font-black text-slate-900 dark:text-white">Notifications</h2>
          {unread > 0 && <p className="text-[11px] text-slate-500 dark:text-slate-400">{unread} unread</p>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && <button onClick={markAll} className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition dark:text-blue-400">Mark all read</button>}
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition dark:hover:bg-slate-800">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {notifs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Icon name="bell-off" className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">All caught up!</p>
          </div>
        )}
        {notifs.map((n) => (
          <div key={n.id} onClick={() => markOne(n.id)}
            className={`group relative flex items-start gap-3 p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/60 ${!n.read ? "bg-blue-50/40 dark:bg-blue-900/10" : ""}`}>
            {!n.read && <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-500" />}
            <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${typeColor[n.type]}`}>
              <Icon name={typeIcon[n.type]} className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-bold truncate ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{n.title}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{n.body}</p>
              <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
              className="mt-0.5 hidden group-hover:flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
              <Icon name="close" className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Approval Queue (enhanced interactive) ────────────────────────────────────
type ApprovalItem = {
  id: number; title: string; owner: string; items: number; sla: string; tone: "High" | "Medium" | "Normal";
  description: string; assignee: string; status: "pending" | "approved" | "rejected";
};
const initialApprovals: ApprovalItem[] = [
  { id: 1, title: "Recruiter verification", owner: "Enterprise team", items: 18, sla: "4h SLA", tone: "High", description: "18 recruiter accounts from TechCorp, Infosys & Wipro awaiting identity and business verification.", assignee: "Priya S.", status: "pending" },
  { id: 2, title: "College onboarding", owner: "Institution success", items: 7, sla: "1d SLA", tone: "Medium", description: "7 new engineering colleges from Tier-2 cities requesting placement portal access.", assignee: "Rohan M.", status: "pending" },
  { id: 3, title: "Mentor profile audit", owner: "Community ops", items: 31, sla: "2d SLA", tone: "Normal", description: "Quarterly profile quality audit for 31 active mentors — credentials and availability check.", assignee: "Ananya K.", status: "pending" },
  { id: 4, title: "Flagged student reports", owner: "Trust & safety", items: 5, sla: "2h SLA", tone: "High", description: "5 students flagged for suspicious placement form submissions, require manual review.", assignee: "Vikram T.", status: "pending" },
  { id: 5, title: "Drive budget approvals", owner: "Finance ops", items: 12, sla: "3d SLA", tone: "Medium", description: "12 campus drives requesting budget approval for travel, hosting and gift vouchers.", assignee: "Meera J.", status: "pending" },
];

const ApprovalQueue = () => {
  const [items, setItems] = useState(initialApprovals);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "High" | "Medium" | "Normal">("all");
  const [view, setView] = useState<"list" | "grid">("list");

  const act = (id: number, action: "approved" | "rejected") => {
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, status: action } : x));
    setExpanded(null);
    showToast(action === "approved" ? "Item approved successfully" : "Item rejected", action === "approved" ? "success" : "error");
  };

  const filtered = items.filter((x) => filter === "all" || x.tone === filter);
  const pending = items.filter((x) => x.status === "pending").length;

  const toneBadge = (t: ApprovalItem["tone"]) => ({
    High: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-800",
    Medium: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-800",
    Normal: "bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600",
  }[t]);

  const statusBadge = (s: ApprovalItem["status"]) => ({
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    rejected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  }[s]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Review Queue</p>
          <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            Pending admin actions
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{pending}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
            {(["all", "High", "Medium", "Normal"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1.5 text-[11px] font-bold transition ${filter === f ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700"}`}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
            <button onClick={() => setView("list")} className={`p-2 transition ${view === "list" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
              <Icon name="list" className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setView("grid")} className={`p-2 transition ${view === "grid" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
              <Icon name="grid" className="h-3.5 w-3.5" />
            </button>
          </div>
          <button className="rounded-xl bg-slate-900 px-3.5 py-2 text-[13px] font-bold text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">View all</button>
        </div>
      </div>

      {/* Items */}
      <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3 p-4" : "divide-y divide-slate-100 dark:divide-slate-700/60"}>
        {filtered.map((item) => (
          <div key={item.id}
            className={view === "grid"
              ? `rounded-xl border p-4 transition cursor-pointer ${item.status !== "pending" ? "opacity-60" : "hover:border-blue-200 hover:shadow-sm dark:hover:border-blue-700"} border-slate-200 dark:border-slate-700`
              : `transition ${item.status !== "pending" ? "opacity-60" : ""}`}>
            {/* Row / Card header */}
            <div className={`flex items-center gap-3 ${view === "list" ? "p-4" : ""} cursor-pointer`}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.tone === "High" ? "bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400" : item.tone === "Medium" ? "bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                <Icon name="clock" className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ring-1 ${toneBadge(item.tone)}`}>{item.tone}</span>
                  {item.status !== "pending" && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${statusBadge(item.status)}`}>{item.status}</span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{item.owner} · {item.sla} · {item.assignee}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xl font-black text-slate-900 dark:text-white">{item.items}</span>
                <Icon name="chevron-down" className={`h-4 w-4 text-slate-400 transition-transform ${expanded === item.id ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Expanded row */}
            {expanded === item.id && (
              <div className={`border-t border-slate-100 dark:border-slate-700 ${view === "list" ? "mx-4 pb-4 pt-3" : "mt-3 pt-3"}`}>
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</p>
                {item.status === "pending" ? (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => act(item.id, "approved")}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-[12px] font-bold text-white hover:bg-emerald-700 transition">
                      <Icon name="check-circle" className="h-3.5 w-3.5" />Approve all
                    </button>
                    <button onClick={() => act(item.id, "rejected")}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-[12px] font-bold text-rose-700 hover:bg-rose-100 transition dark:border-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
                      <Icon name="x-circle" className="h-3.5 w-3.5" />Reject
                    </button>
                    <button className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                      <Icon name="eye" className="h-3.5 w-3.5" />View details
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-semibold capitalize text-slate-400 dark:text-slate-500">Status: {item.status}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Activity Feed ────────────────────────────────────────────────────────────
const activityFeed = [
  { user: "Priya S.", action: "approved recruiter", target: "Infosys HR Portal", time: "2m ago", icon: "check-circle" as IconName, color: "text-emerald-500" },
  { user: "AI Engine", action: "auto-flagged risk in", target: "Student batch #447", time: "8m ago", icon: "zap" as IconName, color: "text-amber-500" },
  { user: "Rohan M.", action: "onboarded college", target: "RGPV Bhopal", time: "21m ago", icon: "campus" as IconName, color: "text-blue-500" },
  { user: "Security Bot", action: "rotated API key for", target: "ATS Sync", time: "45m ago", icon: "shield" as IconName, color: "text-violet-500" },
  { user: "Ananya K.", action: "completed audit for", target: "Mentor batch Q2", time: "1h ago", icon: "check" as IconName, color: "text-emerald-500" },
  { user: "Vikram T.", action: "escalated report from", target: "Student #8821", time: "2h ago", icon: "alert" as IconName, color: "text-rose-500" },
];

const ActivityFeed = () => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Live</p>
        <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">Activity feed</h2>
      </div>
      <div className="flex items-center gap-1.5"><PulseDot /><span className="text-[10px] font-semibold text-emerald-500">Real-time</span></div>
    </div>
    <div className="space-y-1">
      {activityFeed.map((a, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
          <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 ${a.color}`}>
            <Icon name={a.icon} className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">{a.user}</span>{" "}
              {a.action}{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{a.target}</span>
            </p>
          </div>
          <span className="flex-shrink-0 text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{a.time}</span>
        </div>
      ))}
    </div>
  </section>
);

// ─── AI Automation Hub ────────────────────────────────────────────────────────
const automations = [
  { name: "Auto-verify recruiter emails", status: true, runs: "124 today", icon: "user-check" as IconName },
  { name: "Risk anomaly detection", status: true, runs: "Continuous", icon: "shield" as IconName },
  { name: "Nightly placement report", status: true, runs: "00:00 IST", icon: "file" as IconName },
  { name: "Student dropout predictor", status: false, runs: "Paused", icon: "risk" as IconName },
  { name: "ATS data sync", status: true, runs: "Every 6h", icon: "database" as IconName },
];

const AutomationHub = () => {
  const [states, setStates] = useState(automations.map((a) => a.status));
  const toggle = (i: number) => {
    setStates((prev) => { const next = [...prev]; next[i] = !next[i]; return next; });
    showToast(states[i] ? "Automation paused" : "Automation enabled", states[i] ? "warning" : "success");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">AI Automation</p>
          <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">Automation hub</h2>
        </div>
        <button onClick={() => showToast("New automation wizard coming soon!", "info")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20">
          <Icon name="plus" className="h-3.5 w-3.5" />New
        </button>
      </div>
      <div className="space-y-2">
        {automations.map((a, i) => (
          <div key={a.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700">
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${states[i] ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-slate-100 text-slate-400 dark:bg-slate-700"}`}>
              <Icon name={a.icon} className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{a.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{a.runs}</p>
            </div>
            {/* Toggle */}
            <button onClick={() => toggle(i)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${states[i] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${states[i] ? "translate-x-4.5" : "translate-x-0.5"}`} style={{ transform: states[i] ? "translateX(18px)" : "translateX(2px)" }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Sidebar items ────────────────────────────────────────────────────────────
const sidebarItems: Array<{ label: string; icon: IconName; badge?: number }> = [
  { label: "AI Command Center", icon: "ai-brain" },
  { label: "Placement Intelligence", icon: "placement", badge: 3 },
  { label: "Student Analytics", icon: "users" },
  { label: "Recruiter Intelligence", icon: "briefcase", badge: 18 },
  { label: "Resume Intelligence", icon: "resume" },
  { label: "Interview Analytics", icon: "interview" },
  { label: "Risk Monitoring", icon: "risk", badge: 5 },
  { label: "Campus Insights", icon: "campus" },
  { label: "AI Automation", icon: "automation" },
  { label: "Security Center", icon: "shield" },
  { label: "System Health", icon: "monitor" },
];

const stats = [
  { label: "Student signals", value: "18.4k", change: "+14%", up: true, icon: "users" as IconName, accent: "#3b82f6", bg: "#eff6ff" },
  { label: "Placement rate", value: "89%", change: "+3.1%", up: true, icon: "trending-up" as IconName, accent: "#10b981", bg: "#ecfdf5" },
  { label: "Active drives", value: "132", change: "+12%", up: true, icon: "briefcase" as IconName, accent: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Risk alerts", value: "23", change: "−8%", up: false, icon: "shield" as IconName, accent: "#f59e0b", bg: "#fffbeb" },
];

const roleMatrix = [
  { role: "Students", total: "18.4k", active: "91%", access: "Learning, assessments, jobs", risk: "Low" },
  { role: "Recruiters", total: "842", active: "78%", access: "Drive creation, talent search", risk: "Medium" },
  { role: "Colleges", total: "126", active: "88%", access: "Roster, analytics, reports", risk: "Low" },
  { role: "Mentors", total: "382", active: "64%", access: "Reviews, sessions, feedback", risk: "Normal" },
];

const integrations: Array<{ name: string; status: string; detail: string; icon: IconName; color: string }> = [
  { name: "ATS Sync", status: "Connected", detail: "Greenhouse · Lever · Workday", icon: "plug", color: "#3b82f6" },
  { name: "AI Scoring", status: "Live", detail: "Resume · Interview · Skills", icon: "sparkles", color: "#8b5cf6" },
  { name: "Data Warehouse", status: "Healthy", detail: "Nightly placement analytics", icon: "database", color: "#10b981" },
];

const auditEvents = [
  { event: "Admin role policy updated", user: "Super Admin", time: "09:42 AM", status: "Reviewed", color: "text-blue-700 bg-blue-50 ring-blue-100 dark:text-blue-300 dark:bg-blue-900/30 dark:ring-blue-800" },
  { event: "Bulk student import approved", user: "College Ops", time: "08:15 AM", status: "Synced", color: "text-emerald-700 bg-emerald-50 ring-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30 dark:ring-emerald-800" },
  { event: "Recruiter account escalated", user: "Trust Team", time: "Yesterday", status: "Open", color: "text-amber-700 bg-amber-50 ring-amber-100 dark:text-amber-300 dark:bg-amber-900/30 dark:ring-amber-800" },
  { event: "API key rotated for ATS Sync", user: "Security Bot", time: "Yesterday", status: "Closed", color: "text-slate-600 bg-slate-100 ring-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:ring-slate-600" },
];

const readinessSegments = [
  { label: "Profile verified", value: "92%", color: "#3b82f6" },
  { label: "Placement ready", value: "76%", color: "#10b981" },
  { label: "Interview scheduled", value: "58%", color: "#8b5cf6" },
  { label: "Offer pipeline", value: "41%", color: "#f59e0b" },
];

const opsMetrics = [
  { label: "Assessment completion", value: "86%", color: "#3b82f6" },
  { label: "Recruiter response SLA", value: "92%", color: "#10b981" },
  { label: "College data freshness", value: "79%", color: "#8b5cf6" },
  { label: "Mentor session fill rate", value: "68%", color: "#f59e0b" },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const { dark, toggle } = useDark();
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("AI Command Center");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadNotifs = 4;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .dark { color-scheme: dark; }
      `}</style>

      <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-200`}>
        {/* ── Header ── */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90">
          <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo + mobile menu */}
            <div className="flex items-center gap-3">
              <button className="mr-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" onClick={() => setSidebarOpen((v) => !v)}>
                <Icon name="menu" className="h-5 w-5" />
              </button>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-500/25">
                <Icon name="cpu" className="h-5 w-5 text-white" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">C2C Admin</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Ashoksoft</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden w-64 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 transition md:flex dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
              <Icon name="search" className="h-3.5 w-3.5" />
              <span className="text-[13px]">Search platform…</span>
              <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:border-slate-600 dark:bg-slate-700">⌘K</kbd>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button onClick={toggle}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                aria-label="Toggle dark mode">
                <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
              </button>
              {/* Notifications */}
              <button onClick={() => { setNotifOpen((v) => !v); setAiOpen(false); }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <Icon name="bell" className="h-4 w-4" />
                {unreadNotifs > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">{unreadNotifs}</span>}
              </button>
              {/* Ask AI */}
              <button onClick={() => { setAiOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 transition">
                <Icon name="sparkles" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
              <button onClick={() => showToast("Admin tools panel coming soon!", "info")}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                <Icon name="settings" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tools</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* ── Sidebar ── */}
            {/* Mobile overlay */}
            {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`
              fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto bg-white pt-16 shadow-xl transition-transform dark:bg-slate-900
              lg:relative lg:inset-auto lg:z-auto lg:w-56 lg:transform-none lg:overflow-visible lg:bg-transparent lg:pt-0 lg:shadow-none lg:block
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
              <div className="sticky top-[76px] space-y-3 p-4 lg:p-0">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">Control Hub</p>
                  <h2 className="mt-1.5 text-base font-black text-white">C2C Platform</h2>
                  <p className="mt-1 text-[11px] leading-4 text-slate-400">Enterprise admin workspace</p>
                  <div className="mt-4 flex items-center gap-2">
                    <PulseDot />
                    <span className="text-[10px] font-semibold text-emerald-400">All systems online</span>
                  </div>
                </div>
                <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  {sidebarItems.map((item) => (
                    <button key={item.label} onClick={() => { setActiveSidebar(item.label); setSidebarOpen(false); }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition ${activeSidebar === item.label ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"}`}>
                      <Icon name={item.icon} className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${activeSidebar === item.label ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{item.badge}</span>
                      )}
                    </button>
                  ))}
                </nav>
                {/* Security score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <Icon name="shield" className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />Security score
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">94</span>
                    <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800">Strong</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="min-w-0 flex-1 space-y-5">
              {/* Hero */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-50 dark:opacity-10 [background-size:18px_18px]" />
                <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-900/20" />
                <div className="relative grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Icon name="sparkles" className="h-3 w-3" />AI-powered enterprise workspace
                    </span>
                    <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">Platform Command Center</h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Govern users, drive placements, monitor risk, and automate operations — all from one intelligent hub.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {([
                        { label: "Approve recruiters", icon: "user-check" as IconName },
                        { label: "Create role", icon: "lock" as IconName },
                        { label: "Export reports", icon: "download" as IconName },
                        { label: "Schedule audit", icon: "calendar" as IconName },
                      ]).map((a) => (
                        <button key={a.label} onClick={() => showToast(`${a.label} — coming soon!`, "info")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-900/20">
                          <Icon name={a.icon} className="h-3.5 w-3.5" />{a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Live ops */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Today at a glance</p>
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800">
                        <PulseDot />Live
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[{ label: "Approvals", value: "61" }, { label: "Alerts", value: "7" }, { label: "New signups", value: "43" }, { label: "AI actions", value: "12" }].map((m) => (
                        <div key={m.label} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-700 dark:ring-slate-600">
                          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{m.label}</p>
                          <p className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200 dark:bg-slate-700 dark:ring-slate-600">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Data sync</span>
                        <span className="text-blue-700 dark:text-blue-400">88%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-600">
                        <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                  <article key={s.label} className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                        <Icon name={s.icon} className="h-4 w-4"  />
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.up ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-900/30 dark:text-rose-300"}`}>
                        <Icon name={s.up ? "arrow-up" : "arrow-down"} className="h-3 w-3" />{s.change}
                      </span>
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</p>
                    <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{s.value}</p>
                  </article>
                ))}
              </div>

              {/* AI Insight + Risk */}
              <div className="grid gap-4 xl:grid-cols-2">
                <AIInsightCard />
                <AIRiskScorer />
              </div>

              {/* Approval Queue (full width, enhanced) */}
              <ApprovalQueue />

              {/* Activity + Automation */}
              <div className="grid gap-5 xl:grid-cols-2">
                <ActivityFeed />
                <AutomationHub />
              </div>

              {/* Readiness funnel + Ops */}
              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm ring-1 ring-slate-800">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI Governance</p>
                      <h2 className="mt-0.5 text-lg font-black">Readiness funnel</h2>
                    </div>
                    <Icon name="target" className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    {readinessSegments.map((seg) => (
                      <div key={seg.label}>
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-slate-300">{seg.label}</span>
                          <span className="font-black text-white">{seg.value}</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full" style={{ width: seg.value, background: seg.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl bg-white/10 p-3.5 ring-1 ring-white/10">
                    <div className="flex items-start gap-2.5">
                      <Icon name="alert" className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                      <div>
                        <p className="text-[12px] font-bold">2 scoring rules need review</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-slate-400">Resume keyword weighting changed for 3 active drives.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Placement Intelligence</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">Ops snapshot</h2>
                    </div>
                    <Icon name="chart" className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {opsMetrics.map((m) => (
                      <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/40">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{m.label}</p>
                        <p className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">{m.value}</p>
                        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                          <div className="h-full rounded-full" style={{ width: m.value, background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Role matrix + Integrations */}
              <div className="grid gap-5 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Access Control</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">Role & permission matrix</h2>
                    </div>
                    <Icon name="lock" className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    {roleMatrix.map((role, i) => {
                      const rc: Record<string, string> = {
                        Low: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800",
                        Medium: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800",
                        Normal: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600",
                      };
                      return (
                        <div key={role.role} className={`p-4 hover:bg-slate-50/50 transition dark:hover:bg-slate-700/30 ${i < roleMatrix.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">{role.role}</h3>
                              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{role.access}</p>
                            </div>
                            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${rc[role.risk] || rc.Normal}`}>{role.risk}</span>
                          </div>
                          <div className="mt-2.5 grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100 dark:bg-slate-700 dark:ring-slate-600">
                              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Accounts</p>
                              <p className="mt-0.5 text-base font-black text-slate-900 dark:text-white">{role.total}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100 dark:bg-slate-700 dark:ring-slate-600">
                              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Active</p>
                              <p className="mt-0.5 text-base font-black text-slate-900 dark:text-white">{role.active}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Connected Systems</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">Integrations & audit</h2>
                    </div>
                    <Icon name="plug" className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {integrations.map((int) => (
                      <div key={int.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-700/40">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-600" style={{ color: int.color }}>
                          <Icon name={int.icon} className="h-3.5 w-3.5" />
                        </div>
                        <h3 className="mt-2.5 text-[12px] font-black text-slate-900 dark:text-white">{int.name}</h3>
                        <p className="mt-0.5 text-[10px] leading-4 text-slate-400 dark:text-slate-500">{int.detail}</p>
                        <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800">{int.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                    {auditEvents.map((ev, i) => (
                      <div key={ev.event} className={`flex items-center gap-3 p-3.5 hover:bg-slate-50/50 transition dark:hover:bg-slate-700/30 ${i < auditEvents.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[12px] font-bold text-slate-900 dark:text-white truncate">{ev.event}</h3>
                          <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{ev.user} · {ev.time}</p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${ev.color}`}>{ev.status}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>

        {/* ── AI Chat Drawer ── */}
        {aiOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setAiOpen(false)} />
            <div className="fixed bottom-0 right-0 z-50 sm:bottom-4 sm:right-4 flex h-[580px] w-full max-w-full sm:max-w-sm flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-700 shadow-2xl"
              style={{ animation: "slideUp 0.25s ease" }}>
              <AIChatPanel onClose={() => setAiOpen(false)} />
            </div>
          </>
        )}

        {/* ── Notification Drawer ── */}
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
            <div className="fixed right-0 top-[60px] z-50 h-[calc(100vh-60px)] w-full max-w-sm overflow-hidden border-l border-slate-200 shadow-2xl dark:border-slate-700"
              style={{ animation: "slideUp 0.2s ease" }}>
              <NotifPanel onClose={() => setNotifOpen(false)} />
            </div>
          </>
        )}

        {/* ── Floating AI button (mobile, when closed) ── */}
        {!aiOpen && (
          <button onClick={() => { setAiOpen(true); setNotifOpen(false); }}
            className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition sm:hidden">
            <Icon name="sparkles" className="h-6 w-6 text-white" />
          </button>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default AdminDashboard;
