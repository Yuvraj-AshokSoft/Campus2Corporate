import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type IconName =
  | "activity" | "alert" | "arrow-up" | "arrow-down" | "bell" | "briefcase"
  | "building" | "calendar" | "chart" | "check" | "clock" | "dashboard"
  | "database" | "file" | "graduation" | "lock" | "plug" | "search"
  | "settings" | "shield" | "sparkles" | "target" | "user-check" | "users"
  | "ai-brain" | "placement" | "resume" | "interview" | "risk" | "campus"
  | "automation" | "monitor" | "send" | "refresh" | "close" | "chevron-right"
  | "wand" | "zap" | "trending-up" | "cpu";

// ─── Icon System ──────────────────────────────────────────────────────────────
const Icon = ({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) => {
  const paths: Record<IconName, React.ReactNode> = {
    activity: <path d="M4 12h3l2-6 4 12 2-6h5" />,
    alert: <><path d="M12 4 3.5 18.5h17L12 4Z" /><path d="M12 9v4" /><path d="M12 16h.01" /></>,
    "arrow-up": <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
    "arrow-down": <><path d="M7 7 17 17" /><path d="M17 9v8H9" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    briefcase: <><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" /><path d="M4 12h16" /></>,
    building: <><path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M3 21h18" /><path d="M9 7h1" /><path d="M14 7h1" /><path d="M9 11h1" /><path d="M14 11h1" /></>,
    calendar: <><path d="M7 3v4" /><path d="M17 3v4" /><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-5" /><path d="M12 16V8" /><path d="M16 16v-7" /></>,
    check: <><path d="M21 12a9 9 0 1 1-5-8" /><path d="m9 12 2 2 6-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6" /><path d="M8 13h8" /><path d="M8 17h5" /></>,
    graduation: <><path d="m22 10-10-5-10 5 10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    plug: <><path d="M8 3v5" /><path d="M16 3v5" /><path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" /><path d="M12 18v3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" /></>,
    shield: <><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" /><path d="m9 12 2 2 4-5" /></>,
    sparkles: <><path d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" /><path d="M5 16v4" /><path d="M3 18h4" /><path d="M19 3v3" /><path d="M17.5 4.5h3" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="M2 12h3" /><path d="M19 12h3" /></>,
    "user-check": <><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="m16 11 2 2 4-5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8" /><path d="M16 3.2a4 4 0 0 1 0 7.6" /></>,
    "ai-brain": <><circle cx="12" cy="12" r="5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><path d="m4.9 4.9 2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" /></>,
    placement: <><path d="M12 4v12" /><path d="m8 12 4-4 4 4" /><path d="M8 20h8" /></>,
    resume: <><path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5" /><path d="M8 13h8" /><path d="M8 17h6" /></>,
    interview: <><path d="M6 7h12v8H9l-3 3V7Z" /><path d="M8 5h8" /></>,
    risk: <><path d="M12 3 3 19h18L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
    campus: <><path d="M4 21V9l8-5 8 5v12" /><path d="M12 3v18" /><path d="M8 12h8" /></>,
    automation: <><circle cx="12" cy="12" r="5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /><path d="m4.9 4.9 1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    monitor: <><rect x="4" y="5" width="16" height="12" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
    send: <><path d="m22 2-11 11" /><path d="m22 2-7 20-4-9-9-4 20-7z" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    wand: <><path d="m15 5 4 4" /><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 3.43L9.6 10.1" /><path d="m9.6 10.1-4.3 4.3a2.41 2.41 0 0 0 3.43 3.4L13 13.4" /><path d="m13 13.4 4.3 4.3a2.41 2.41 0 0 0 3.4-3.43L16.6 10" /><path d="m16.6 10 1.7-1.7" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    "trending-up": <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>,
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2" /></>,
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const sidebarItems: Array<{ label: string; icon: IconName; active?: boolean; badge?: number }> = [
  { label: "AI Command Center", icon: "ai-brain", active: true },
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
  { label: "Student signals", value: "18.4k", change: "+14%", up: true, icon: "users" as IconName, accent: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8" },
  { label: "Placement rate", value: "89%", change: "+3.1%", up: true, icon: "trending-up" as IconName, accent: "#10b981", bg: "#ecfdf5", text: "#065f46" },
  { label: "Active drives", value: "132", change: "+12%", up: true, icon: "briefcase" as IconName, accent: "#8b5cf6", bg: "#f5f3ff", text: "#5b21b6" },
  { label: "Risk alerts", value: "23", change: "−8%", up: false, icon: "shield" as IconName, accent: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
];

const approvalQueue = [
  { title: "Recruiter verification", owner: "Enterprise team", items: 18, sla: "4h SLA", tone: "High" },
  { title: "College onboarding", owner: "Institution success", items: 7, sla: "1d SLA", tone: "Medium" },
  { title: "Mentor profile audit", owner: "Community ops", items: 31, sla: "2d SLA", tone: "Normal" },
  { title: "Flagged student reports", owner: "Trust & safety", items: 5, sla: "2h SLA", tone: "High" },
];

const roleMatrix = [
  { role: "Students", total: "18.4k", active: "91%", access: "Learning, assessments, jobs", risk: "Low" },
  { role: "Recruiters", total: "842", active: "78%", access: "Drive creation, talent search", risk: "Medium" },
  { role: "Colleges", total: "126", active: "88%", access: "Roster, analytics, reports", risk: "Low" },
  { role: "Mentors", total: "382", active: "64%", access: "Reviews, sessions, feedback", risk: "Normal" },
];

const integrations: Array<{ name: string; status: string; detail: string; icon: IconName; color: string }> = [
  { name: "ATS Sync", status: "Connected", detail: "Greenhouse · Lever · Workday", icon: "plug", color: "#3b82f6" },
  { name: "AI Scoring Engine", status: "Live", detail: "Resume · Interview · Skills", icon: "sparkles", color: "#8b5cf6" },
  { name: "Data Warehouse", status: "Healthy", detail: "Nightly placement analytics", icon: "database", color: "#10b981" },
];

const auditEvents = [
  { event: "Admin role policy updated", user: "Super Admin", time: "09:42 AM", status: "Reviewed", color: "text-blue-700 bg-blue-50 ring-blue-100" },
  { event: "Bulk student import approved", user: "College Ops", time: "08:15 AM", status: "Synced", color: "text-emerald-700 bg-emerald-50 ring-emerald-100" },
  { event: "Recruiter account escalated", user: "Trust Team", time: "Yesterday", status: "Open", color: "text-amber-700 bg-amber-50 ring-amber-100" },
  { event: "API key rotated for ATS Sync", user: "Security Bot", time: "Yesterday", status: "Closed", color: "text-slate-600 bg-slate-100 ring-slate-200" },
];

const readinessSegments = [
  { label: "Profile verified", value: "92%", pct: 92, color: "#3b82f6" },
  { label: "Placement ready", value: "76%", pct: 76, color: "#10b981" },
  { label: "Interview scheduled", value: "58%", pct: 58, color: "#8b5cf6" },
  { label: "Offer pipeline", value: "41%", pct: 41, color: "#f59e0b" },
];

const opsMetrics = [
  { label: "Assessment completion", value: "86%", pct: 86, color: "#3b82f6" },
  { label: "Recruiter response SLA", value: "92%", pct: 92, color: "#10b981" },
  { label: "College data freshness", value: "79%", pct: 79, color: "#8b5cf6" },
  { label: "Mentor session fill rate", value: "68%", pct: 68, color: "#f59e0b" },
];

// ─── AI Insights data ─────────────────────────────────────────────────────────
const aiInsightTopics = [
  "Summarize today's placement risks",
  "Which recruiters need follow-up?",
  "Predict next month's placement rate",
  "Audit anomalies in student data",
];

// ─── Pulse dot ────────────────────────────────────────────────────────────────
const PulseDot = ({ color = "#10b981" }: { color?: string }) => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />
    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
  </span>
);

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
const AIChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello! I'm the C2C AI assistant. Ask me anything about placements, student data, recruiter activity, or risk alerts." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const userText = text ?? input.trim();
    if (!userText) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const history = [...messages, { role: "user", text: userText }];
      const apiMessages = history.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system:
            "You are an expert AI assistant embedded in the C2C (Campus to Career) admin platform by Ashoksoft. You help admins analyze student placements, recruiter pipelines, risk alerts, campus data, and audit trails. Be concise, data-aware, and actionable. Use bullet points when listing multiple items. Current dashboard stats: 18.4k student signals, 89% placement rate, 132 active drives, 23 risk alerts, security score 94/100.",
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.map((b: { type: string; text?: string }) => b.text || "").join("") || "Sorry, I couldn't get a response.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Icon name="ai-brain" className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">C2C AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <PulseDot color="#10b981" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition">
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 p-3">
        {aiInsightTopics.map((t) => (
          <button key={t} onClick={() => send(t)}
            className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:border-blue-500 hover:text-blue-400 transition">
            {t}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "rounded-tr-sm bg-blue-600 text-white"
                : "rounded-tl-sm bg-slate-800 text-slate-200"
            }`}>
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
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            placeholder="Ask about placements, risks, recruiters…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          />
          <button onClick={() => send()}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-40"
            disabled={loading || !input.trim()}>
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

  const generateInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "Given these C2C platform stats: 18,400 student signals (+14%), 89% placement rate (+3.1%), 132 active drives (+12%), 23 risk alerts (−8%), 61 pending approvals, 94/100 security score, and 88% data sync. Generate 3 concise, actionable bullet-point insights an admin should act on today. Each bullet should be one sentence starting with an action verb. Be specific and data-driven.",
          }],
        }),
      });
      const data = await res.json();
      setInsight(data.content?.map((b: { text?: string }) => b.text || "").join("") || "");
      setFetched(true);
    } catch {
      setInsight("Unable to generate insights at this time.");
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <Icon name="sparkles" className="h-4.5 w-4.5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI Daily Brief</p>
            <h3 className="text-sm font-bold text-white">Platform intelligence</h3>
          </div>
        </div>
        <button onClick={generateInsight} disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition disabled:opacity-50">
          <Icon name={loading ? "refresh" : "wand"} className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Thinking…" : fetched ? "Refresh" : "Generate"}
        </button>
      </div>

      {!fetched && !loading && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-xs text-slate-400">Click <span className="text-blue-400 font-semibold">Generate</span> to get AI-powered insights based on live platform data.</p>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-2">
          {[80, 95, 65].map((w, i) => (
            <div key={i} className="h-4 animate-pulse rounded-full bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {fetched && !loading && insight && (
        <div className="mt-4 space-y-2.5">
          {insight.split("\n").filter((l) => l.trim()).map((line, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              <p className="text-xs leading-5 text-slate-300">{line.replace(/^[•\-*]\s*/, "")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Risk Score Widget ────────────────────────────────────────────────────────
const AIRiskScorer = () => {
  const [score, setScore] = useState<null | { level: string; summary: string; color: string }>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are a risk analysis engine. Respond ONLY with valid JSON, no markdown, no explanation.",
          messages: [{
            role: "user",
            content: `Analyze this C2C platform snapshot and return JSON with exactly these keys:
              - "level": one of "Low" | "Moderate" | "Elevated" | "High"
              - "score": integer 0-100 (higher = more risk)
              - "summary": one sentence describing the top risk driver
              Data: 23 risk alerts (down 8%), 5 flagged student reports with 2h SLA, 18 pending recruiter verifications, 94/100 security score, 31 mentor profiles awaiting audit, 7 system alerts today.`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: { text?: string }) => b.text || "").join("") || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const colorMap: Record<string, string> = { Low: "#10b981", Moderate: "#f59e0b", Elevated: "#f97316", High: "#ef4444" };
      setScore({ level: parsed.level, summary: parsed.summary, color: colorMap[parsed.level] || "#6b7280" });
    } catch {
      setScore({ level: "Unknown", summary: "Could not compute risk score.", color: "#6b7280" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Risk Engine</p>
          <h3 className="mt-0.5 text-base font-extrabold text-slate-900">Live risk assessment</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
          <Icon name="zap" className="h-4 w-4 text-rose-600" />
        </div>
      </div>
      {score ? (
        <div className="rounded-xl border p-4" style={{ borderColor: score.color + "30", background: score.color + "0a" }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black" style={{ color: score.color }}>{score.level}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">{score.summary}</p>
          <button onClick={analyze} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
            <Icon name="refresh" className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Re-assess
          </button>
        </div>
      ) : (
        <button onClick={analyze} disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition disabled:opacity-50">
          {loading ? <><Icon name="refresh" className="h-4 w-4 animate-spin" />Analyzing…</> : <><Icon name="cpu" className="h-4 w-4" />Run AI risk scan</>}
        </button>
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("AI Command Center");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-500/25">
              <Icon name="cpu" className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-slate-900">C2C Admin</p>
              <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Ashoksoft</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 shadow-sm w-64 cursor-pointer hover:border-blue-200 hover:bg-blue-50/40 transition">
            <Icon name="search" className="h-3.5 w-3.5" />
            <span className="text-[13px]">Search platform…</span>
            <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition">
              <Icon name="bell" className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">7</span>
            </button>
            <button onClick={() => setAiOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 transition">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Ask AI
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <Icon name="settings" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tools</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-[76px] space-y-3">
              {/* Brand card */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">Control Hub</p>
                <h2 className="mt-1.5 text-base font-black text-white">C2C Platform</h2>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">Enterprise admin workspace</p>
                <div className="mt-4 flex items-center gap-2">
                  <PulseDot color="#10b981" />
                  <span className="text-[10px] font-semibold text-emerald-400">All systems online</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {sidebarItems.map((item) => (
                  <button key={item.label}
                    onClick={() => setActiveSidebar(item.label)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition ${
                      activeSidebar === item.label
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                    <Icon name={item.icon} className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${activeSidebar === item.label ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Security score */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                  <Icon name="shield" className="h-3.5 w-3.5 text-blue-600" />
                  Security score
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-4xl font-black text-slate-900">94</span>
                  <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">Strong</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="min-w-0 flex-1 space-y-5">

            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    <Icon name="sparkles" className="h-3 w-3" />
                    AI-powered enterprise workspace
                  </span>
                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Platform Command Center
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Govern users, drive placements, monitor risk, and automate operations — all from one intelligent hub.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: "Approve recruiters", icon: "user-check" as IconName },
                      { label: "Create role", icon: "lock" as IconName },
                      { label: "Export reports", icon: "file" as IconName },
                      { label: "Schedule audit", icon: "calendar" as IconName },
                    ].map((a) => (
                      <button key={a.label}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition">
                        <Icon name={a.icon} className="h-3.5 w-3.5" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Live ops mini panel */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Today at a glance</p>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                      <PulseDot color="#10b981" />
                      Live
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { label: "Approvals", value: "61" },
                      { label: "Alerts", value: "7" },
                      { label: "New signups", value: "43" },
                      { label: "AI actions", value: "12" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                        <p className="text-[10px] font-semibold text-slate-400">{m.label}</p>
                        <p className="mt-0.5 text-xl font-black text-slate-900">{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Data sync</span>
                      <span className="text-blue-700">88%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <article key={s.label}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-default">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                      <Icon name={s.icon} className="h-4.5 w-4.5"  />
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.up ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"}`}>
                      <Icon name={s.up ? "arrow-up" : "arrow-down"} className="h-3 w-3" />
                      {s.change}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
                </article>
              ))}
            </div>

            {/* AI Insight + Risk row */}
            <div className="grid gap-4 xl:grid-cols-2">
              <AIInsightCard />
              <AIRiskScorer />
            </div>

            {/* Approval queue + Readiness funnel */}
            <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
              {/* Approval queue */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Review Queue</p>
                    <h2 className="mt-0.5 text-lg font-black text-slate-900">Pending admin actions</h2>
                  </div>
                  <button className="rounded-xl bg-slate-900 px-3.5 py-2 text-[13px] font-bold text-white hover:bg-slate-800 transition">
                    View all
                  </button>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  {approvalQueue.map((item, i) => (
                    <div key={item.title}
                      className={`flex items-center gap-4 p-4 ${i < approvalQueue.length - 1 ? "border-b border-slate-100" : ""} hover:bg-slate-50/60 transition`}>
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.tone === "High" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                        <Icon name="clock" className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[13px] font-bold text-slate-900 truncate">{item.title}</h3>
                          <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${item.tone === "High" ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100" : "bg-slate-100 text-slate-500"}`}>
                            {item.tone}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">{item.owner} · {item.sla}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xl font-black text-slate-900">{item.items}</span>
                        <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Readiness funnel */}
              <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI Governance</p>
                    <h2 className="mt-0.5 text-lg font-black">Readiness funnel</h2>
                  </div>
                  <Icon name="target" className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-5 space-y-4">
                  {readinessSegments.map((seg) => (
                    <div key={seg.label}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-slate-300">{seg.label}</span>
                        <span className="font-black text-white">{seg.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full transition-all" style={{ width: seg.value, background: seg.color }} />
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
            </div>

            {/* Role matrix + Integrations */}
            <div className="grid gap-5 xl:grid-cols-2">
              {/* Role matrix */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Control</p>
                    <h2 className="mt-0.5 text-lg font-black text-slate-900">Role & permission matrix</h2>
                  </div>
                  <Icon name="lock" className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  {roleMatrix.map((role, i) => {
                    const riskColor: Record<string, string> = {
                      Low: "bg-emerald-50 text-emerald-700 ring-emerald-100",
                      Medium: "bg-amber-50 text-amber-700 ring-amber-100",
                      Normal: "bg-slate-100 text-slate-600 ring-slate-200",
                    };
                    return (
                      <div key={role.role} className={`p-4 ${i < roleMatrix.length - 1 ? "border-b border-slate-100" : ""} hover:bg-slate-50/50 transition`}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-[13px] font-bold text-slate-900">{role.role}</h3>
                            <p className="mt-0.5 text-[11px] text-slate-400">{role.access}</p>
                          </div>
                          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${riskColor[role.risk] || riskColor.Normal}`}>
                            {role.risk}
                          </span>
                        </div>
                        <div className="mt-2.5 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                            <p className="text-[10px] font-semibold text-slate-400">Accounts</p>
                            <p className="mt-0.5 text-base font-black text-slate-900">{role.total}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                            <p className="text-[10px] font-semibold text-slate-400">Active</p>
                            <p className="mt-0.5 text-base font-black text-slate-900">{role.active}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Integrations + audit */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Connected Systems</p>
                    <h2 className="mt-0.5 text-lg font-black text-slate-900">Integrations & audit trail</h2>
                  </div>
                  <Icon name="plug" className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {integrations.map((int) => (
                    <div key={int.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200"
                        style={{ color: int.color }}>
                        <Icon name={int.icon} className="h-3.5 w-3.5" />
                      </div>
                      <h3 className="mt-2.5 text-[12px] font-black text-slate-900">{int.name}</h3>
                      <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{int.detail}</p>
                      <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                        {int.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  {auditEvents.map((ev, i) => (
                    <div key={ev.event}
                      className={`flex items-center gap-3 p-3.5 ${i < auditEvents.length - 1 ? "border-b border-slate-100" : ""} hover:bg-slate-50/50 transition`}>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[12px] font-bold text-slate-900 truncate">{ev.event}</h3>
                        <p className="mt-0.5 text-[10px] text-slate-400">{ev.user} · {ev.time}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${ev.color}`}>
                        {ev.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Ops snapshot */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Placement Intelligence</p>
                  <h2 className="mt-0.5 text-lg font-black text-slate-900">Cross-platform ops snapshot</h2>
                </div>
                <Icon name="chart" className="h-4 w-4 text-slate-300" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {opsMetrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold text-slate-500">{m.label}</p>
                    <p className="mt-1.5 text-2xl font-black text-slate-900">{m.value}</p>
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full transition-all" style={{ width: m.value, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* ── AI Chat Drawer ── */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-start sm:pt-[72px] sm:pr-6 pointer-events-none">
          <div className="pointer-events-auto flex h-[560px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-slate-900/50">
            <AIChatPanel onClose={() => setAiOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Floating AI button (mobile) ── */}
      {!aiOpen && (
        <button onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 transition sm:hidden">
          <Icon name="sparkles" className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default AdminDashboard;