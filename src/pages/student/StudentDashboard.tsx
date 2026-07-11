import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
// ─── Icon System (matches Admin Dashboard) ────────────────────────────────────
type IconName =
  | "activity" | "alert" | "arrow-up" | "arrow-down" | "bell" | "briefcase"
  | "building" | "calendar" | "chart" | "check" | "clock" | "dashboard"
  | "database" | "file" | "graduation" | "lock" | "plug" | "search"
  | "settings" | "shield" | "sparkles" | "target" | "user-check" | "users"
  | "ai-brain" | "placement" | "resume" | "interview" | "risk" | "campus"
  | "automation" | "monitor" | "send" | "refresh" | "close" | "chevron-right"
  | "wand" | "zap" | "trending-up" | "cpu" | "mail" | "phone" | "book"
  | "award" | "upload" | "eye" | "message" | "chevron-down" | "lightbulb"
  | "clipboard" | "logout";

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
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    phone: <path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.3 1L6.6 10.8Z" />,
    book: <><path d="M4 5a2 2 0 0 1 2-2h9v16H6a2 2 0 0 0-2 2V5Z" /><path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-3" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="m9 13.5-1 7.5 4-2 4 2-1-7.5" /></>,
    upload: <><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    lightbulb: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></>,
    clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="m9 12 2 2 4-4" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Helpers: Anthropic API calls ────────────────────────────────────────────
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const callClaude = async (body: object): Promise<string> => {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return (json.content ?? [])
    .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
    .join("");
};

const parseJSON = <T,>(raw: string): T => {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
};

const getInitials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "YS";

const buildStudentContext = (name: string) => `
Student: ${name}
Degree: B.Tech Computer Science & Engineering, 4th Year
University: Campus2Corporate University
Registered Modules: React Development (70%), Python Programming (45%), Data Structures & Algorithms (60%), Aptitude Training (85%)
Completed: 2 courses | Pending: 3 courses | Certificates: 1
Performance Score Trend: Jan 65 → May 90 (improving)
Upcoming: React Assignment Due Jun 25, Aptitude Assessment Jun 28, Mentor Session Jun 30, Mock Interview Jul 5
`;

// Shared hook: pulls the signed-in user (with sensible fallbacks) and derives
// everything the dashboard and AI features need from it.
const useStudentProfile = () => {
  const { currentUser, logout } = useAuth();
  const fullName = currentUser?.fullName || "Yuvraj Singh";
  const firstName = fullName.split(" ")[0] || "Yuvraj";
  const initials = getInitials(fullName);
  const email = currentUser?.email || "yuvraj@example.com";
  const phone = currentUser?.phone || "+91 9876543210";
  const context = buildStudentContext(fullName);
  return { fullName, firstName, initials, email, phone, context, logout };
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const performanceData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 85 },
  { month: "May", score: 90 },
];

const modules = [
  { title: "React Development", category: "Frontend Development", progress: 70, color: "#2563eb" },
  { title: "Python Programming", category: "Programming Fundamentals", progress: 45, color: "#10b981" },
  { title: "Data Structures & Algorithms", category: "Technical Interview Prep", progress: 60, color: "#8b5cf6" },
  { title: "Aptitude Training", category: "Placement Prep", progress: 85, color: "#f59e0b" },
];

const sidebarItems: Array<{
  label: string;
  icon: IconName;
  route: string;
  active?: boolean;
  badge?: number;
}> = [
  {
    label: "Dashboard",
    icon: "dashboard",
    route: "/student/dashboard",
    active: true,
  },
  {
    label: "My Profile",
    icon: "user-check",
    route: "/student/profile",
  },
  {
    label: "Project List",
    icon: "briefcase",
    route: "/student/projects",
  },
  {
    label: "Applied Projects",
    icon: "clipboard",
    route: "/student/applied-projects",
    badge: 2,
  },
  {
    label: "Notifications",
    icon: "bell",
    route: "/student/notifications",
    badge: 3,
  },
  //{
  //  label: "Placements",
  //  icon: "graduation-cap",
  //  route: "/student/placements",
  //},
  {
    label: "Certificates",
    icon: "award",
    route: "/student/certificates",
  },
  {
    label: "Settings",
    icon: "settings",
    route: "/student/settings",
  },
];

const stats = [
  { label: "Registered courses", value: "5", change: "+1", up: true, icon: "book" as IconName, bg: "#eff6ff" },
  { label: "Completed", value: "2", change: "+2", up: true, icon: "check" as IconName, bg: "#ecfdf5" },
  { label: "Pending", value: "3", change: "−1", up: false, icon: "clock" as IconName, bg: "#fffbeb" },
  { label: "Certificates", value: "1", change: "+1", up: true, icon: "award" as IconName, bg: "#f5f3ff" },
];

const roadmapSteps = [
  { step: "01", title: "Profile Building", desc: "Secure, verified credentials.", icon: "user-check" as IconName },
  { step: "02", title: "Skill Assessment", desc: "AI proctored baseline tests.", icon: "ai-brain" as IconName },
  { step: "03", title: "Learning Roadmap", desc: "Curated targeted content.", icon: "book" as IconName },
  { step: "04", title: "Mentorship", desc: "Mock trials & expert reviews.", icon: "users" as IconName },
  { step: "05", title: "AI Matching", desc: "Vector matching active roles.", icon: "cpu" as IconName },
  { step: "06", title: "Interview", desc: "Calendar scheduling.", icon: "calendar" as IconName },
  { step: "07", title: "Placement", desc: "Final contract signing.", icon: "award" as IconName },
];

const upcomingActivities = [
  { title: "React Assignment Submission", desc: "Module 3 Project Submission", date: "Due: 25 Jun", tone: "High" },
  { title: "Aptitude Assessment", desc: "Placement Prep Test", date: "28 Jun", tone: "Medium" },
  { title: "Mentor Session", desc: "One-on-One Career Guidance", date: "30 Jun", tone: "Normal" },
  { title: "Mock Interview", desc: "Technical Practice", date: "05 Jul", tone: "Low" },
];

const aiCoachTopics = [
  "How do I crack placement interviews?",
  "What should I focus on this week?",
  "Review my weak areas",
  "Predict my placement readiness",
];

const popularRoles = ["Frontend Developer", "Backend Developer", "Data Analyst", "Full Stack Developer"];

// ─── Types ────────────────────────────────────────────────────────────────────
interface StudyDay { day: string; tasks: string[] }
interface ProfileResult { score: number; strengths: string[]; gaps: string[]; tip: string }
interface ATSBreakdown { label: string; score: number }
interface ATSResult {
  score: number; title: string; description: string; breakdown: ATSBreakdown[];
  keywords_found: string[]; keywords_missing: string[]; tip: string;
}
interface SkillGapResult {
  match_score: number; role: string; summary: string; matched_skills: string[];
  missing_skills: { skill: string; priority: "High" | "Medium" | "Low" }[];
  suggested_modules: string[]; tip: string;
}

// ─── Pulse dot ────────────────────────────────────────────────────────────────
const PulseDot = ({ color = "#10b981" }: { color?: string }) => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />
    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
  </span>
);

// ─── Section header (matches admin card headers) ─────────────────────────────
const SectionHeader = ({ eyebrow, title, sub, icon, iconColor = "#2563eb" }:
  { eyebrow: string; title: string; sub?: string; icon: IconName; iconColor?: string }) => (
  <div className="flex items-start justify-between">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{eyebrow}</p>
      <h2 className="mt-0.5 flex items-center gap-2 text-lg font-black text-slate-900">
        <span style={{ color: iconColor }}>
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {title}
      </h2>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
    <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">AI</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 1 — AI Smart Study Planner
// ═══════════════════════════════════════════════════════════════════════════
export const AIStudyPlanner = () => {
  const { context } = useStudentProfile();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyDay[] | null>(null);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generatePlan = async () => {
    setLoading(true); setError(""); setPlan(null);
    try {
      const text = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an AI study planner. Based on this student's data, generate a 5-day study plan (Mon–Fri) for this week. Respond ONLY with valid JSON — no preamble, no markdown, no backticks. Format:
[{"day":"Monday","tasks":["task 1","task 2","task 3"]},...]

Student context:
${context}

Rules:
- Focus on weaker areas (Python 45%, DSA 60%)
- Include aptitude prep (assessment Jun 28)
- Keep tasks short (max 10 words each)
- 3 tasks per day`,
        }],
      });
      setPlan(parseJSON<StudyDay[]>(text));
      setGenerated(true);
    } catch {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dotColors = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader eyebrow="Weekly Planning" title="AI Smart Study Planner" icon="calendar" iconColor="#8b5cf6" />

      {!generated && !loading && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-100">
            <Icon name="sparkles" className="h-4 w-4 text-violet-600" />
          </div>
          <p className="mb-3 text-xs leading-5 text-slate-500">Get a personalized 5-day study plan tailored to your weak areas and upcoming deadlines.</p>
          <button onClick={generatePlan}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
            Generate my study plan
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex flex-col items-center gap-2 py-6">
          <Icon name="refresh" className="h-5 w-5 animate-spin text-violet-500" />
          <p className="text-xs text-slate-400">Building your plan…</p>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {plan && (
        <div className="mt-4 space-y-2.5">
          {plan.map((day, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: dotColors[i % dotColors.length] }} />
                <span className="text-xs font-bold text-slate-700">{day.day}</span>
              </div>
              <ul className="space-y-1">
                {day.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                    <Icon name="check" className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-400" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={generatePlan}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
            <Icon name="refresh" className="h-3 w-3" />
            Regenerate plan
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 2 — AI Placement Readiness Analyzer
// ═══════════════════════════════════════════════════════════════════════════
export const AIProfileAnalyzer = () => {
  const { context } = useStudentProfile();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [error, setError] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const text = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a placement readiness analyzer. Analyze this student profile and return ONLY valid JSON — no markdown, no backticks, no extra text.

Format: {"score":75,"strengths":["strength 1","strength 2","strength 3"],"gaps":["gap 1","gap 2"],"tip":"One actionable tip under 20 words."}

Rules:
- score: 0-100 integer (placement readiness)
- strengths: exactly 3 items, each under 8 words
- gaps: exactly 2 items, each under 8 words
- tip: single most impactful next step

Student data:
${context}`,
        }],
      });
      setResult(parseJSON<ProfileResult>(text));
      setAnalyzed(true);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result ? (result.score >= 75 ? "#10b981" : result.score >= 50 ? "#f59e0b" : "#ef4444") : "#2563eb";
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader eyebrow="Readiness Check" title="AI Placement Readiness Analyzer" icon="target" iconColor="#10b981" />

      {!analyzed && !loading && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-bold text-slate-700">Analyze your placement readiness</p>
            <p className="mt-0.5 text-[11px] text-slate-400">Get strengths, skill gaps & top priority action</p>
          </div>
          <button onClick={analyzeProfile}
            className="ml-3 flex-shrink-0 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
            Analyze now
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <Icon name="refresh" className="h-4 w-4 flex-shrink-0 animate-spin text-emerald-500" />
          <p className="text-xs text-slate-500">Analyzing your profile…</p>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <Icon name="alert" className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-shrink-0 flex-col items-center justify-center">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="36" cy="36" r="28" fill="none" stroke={scoreColor} strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * result.score) / 100}
                transform="rotate(-90 36 36)" />
            </svg>
            <p className="-mt-12 text-2xl font-black" style={{ color: scoreColor }}>{result.score}</p>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-wider text-slate-400">Readiness</p>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Strengths</p>
              <div className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Icon name="check" className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Skill gaps</p>
              <div className="space-y-1.5">
                {result.gaps.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                    {g}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">Top priority</p>
              <p className="text-xs font-medium text-blue-700">{result.tip}</p>
            </div>
          </div>
        </div>
      )}

      {analyzed && !loading && (
        <button onClick={analyzeProfile}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
          <Icon name="refresh" className="h-3 w-3" />
          Re-analyze profile
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 3 — AI ATS Resume Scorer
// ═══════════════════════════════════════════════════════════════════════════
export const AIATSScorer = () => {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFileName(file.name);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setFileContent((e.target?.result as string) || "");
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const analyze = async () => {
    if (!fileName) return;
    setLoading(true); setError(""); setResult(null);
    const resumeText = fileContent ? fileContent.slice(0, 3000) : `[No extractable text — filename: ${fileName}]`;
    try {
      const text = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and return ONLY valid JSON — no markdown, no backticks, no extra text.

Format exactly:
{"score":72,"title":"Good ATS Match","description":"Your resume passes most ATS filters with minor gaps.","breakdown":[{"label":"Keyword density","score":80},{"label":"Format & structure","score":75},{"label":"Contact info","score":90},{"label":"Work experience","score":70},{"label":"Skills section","score":65},{"label":"Quantified results","score":55}],"keywords_found":["Python","JavaScript","SQL","React","Problem-solving"],"keywords_missing":["CI/CD","Docker","Agile","REST APIs"],"tip":"Add quantified impact metrics (e.g., 'Reduced load time by 30%') to boost recruiter attention."}

Rules:
- score: 0-100 integer
- title: 3-5 words
- description: 1 sentence under 20 words
- breakdown: exactly 6 items, label (2-3 words) and score (0-100 int)
- keywords_found: 4-6 items
- keywords_missing: 3-5 items
- tip: 1 sentence under 25 words

Resume content:
${resumeText}`,
        }],
      });
      setResult(parseJSON<ATSResult>(text));
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFileName(""); setFileContent(""); setResult(null); setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const scoreHex = (s: number) => (s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444");
  const scoreTag = (s: number) =>
    s >= 75 ? { label: "ATS Friendly", cls: "bg-emerald-50 text-emerald-700 ring-emerald-100" }
    : s >= 50 ? { label: "Needs Improvement", cls: "bg-amber-50 text-amber-700 ring-amber-100" }
    : { label: "Low ATS Score", cls: "bg-rose-50 text-rose-700 ring-rose-100" };

  const circumference = 2 * Math.PI * 32;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader eyebrow="Resume Intelligence" title="AI ATS Resume Scorer" icon="resume" iconColor="#f59e0b" />

      {!loading && !result && (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
              isDragging ? "border-amber-400 bg-amber-50"
              : fileName ? "border-emerald-300 bg-emerald-50"
              : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50"
            }`}>
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
              <Icon name="upload" className={`h-4 w-4 ${fileName ? "text-emerald-500" : "text-slate-400"}`} />
            </div>
            {fileName ? (
              <>
                <p className="text-xs font-bold text-emerald-700">{fileName}</p>
                <p className="mt-1 text-[11px] text-slate-400">Click to replace</p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-700">Drop your resume here or click to browse</p>
                <p className="mt-1 text-[11px] text-slate-400">PDF, TXT, DOC · Max 5 MB</p>
              </>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleFileInput} />

          <button onClick={analyze} disabled={!fileName}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            Analyze resume
          </button>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="mt-4 flex flex-col items-center gap-2 py-8">
          <Icon name="refresh" className="h-5 w-5 animate-spin text-amber-500" />
          <p className="text-xs text-slate-400">Analyzing your resume against ATS criteria…</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreHex(result.score)} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * result.score) / 100}
                  transform="rotate(-90 40 40)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black" style={{ color: scoreHex(result.score) }}>{result.score}</span>
                <span className="text-[9px] text-slate-400">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{result.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{result.description}</p>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${scoreTag(result.score).cls}`}>
                {scoreTag(result.score).label}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Score breakdown</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {result.breakdown.map((item, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-[11px] text-slate-600">{item.label}</span>
                    <span className="text-[11px] font-bold text-slate-700">{item.score}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${item.score}%`, background: scoreHex(item.score) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Keywords found</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_found.map((k, i) => (
                  <span key={i} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Keywords missing</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_missing.map((k, i) => (
                  <span key={i} className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100">{k}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <Icon name="lightbulb" className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">Top recommendation</p>
              <p className="text-xs text-blue-700">{result.tip}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <Icon name="eye" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <p className="text-[11px] text-slate-400">
              This score is visible to <span className="font-semibold text-slate-500">you</span>,{" "}
              <span className="font-semibold text-slate-500">recruiters</span>, and{" "}
              <span className="font-semibold text-slate-500">admins</span> reviewing your profile.
            </p>
          </div>

          <button onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
            <Icon name="refresh" className="h-3 w-3" />
            Score another resume
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 4 — AI Job Skills & Gap Analysis Matching
// ═══════════════════════════════════════════════════════════════════════════
export const AISkillGapAnalyzer = () => {
  const { context } = useStudentProfile();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [error, setError] = useState("");

  const analyze = async (targetRole?: string) => {
    const roleToUse = (targetRole ?? role).trim();
    if (!roleToUse) return;
    setRole(roleToUse); setLoading(true); setError(""); setResult(null);
    try {
      const text = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a job skill-gap analyzer. Compare this student's current skills against what is typically required for the target job role. Return ONLY valid JSON — no markdown, no backticks, no extra text.

Format exactly:
{"match_score":68,"role":"Frontend Developer","summary":"You meet most core requirements but lack testing and deployment experience.","matched_skills":["React","JavaScript","HTML/CSS"],"missing_skills":[{"skill":"TypeScript","priority":"High"},{"skill":"Unit Testing","priority":"Medium"}],"suggested_modules":["TypeScript Fundamentals","Testing with Jest"],"tip":"Focus on TypeScript next — it's required in 80% of frontend job postings."}

Rules:
- match_score: 0-100 integer
- role: echo back the target role name, cleaned up
- summary: 1 sentence, under 22 words
- matched_skills: 3-6 items the student already has, based on their registered modules and progress
- missing_skills: 3-5 items, each with a "skill" (1-3 words) and "priority" of "High", "Medium", or "Low"
- suggested_modules: 2-4 short course/module names to close the gap
- tip: 1 sentence, under 25 words, most impactful next step

Target job role: ${roleToUse}

Student data:
${context}`,
        }],
      });
      setResult(parseJSON<SkillGapResult>(text));
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(""); setRole(""); };

  const scoreHex = result ? (result.match_score >= 75 ? "#10b981" : result.match_score >= 50 ? "#f59e0b" : "#ef4444") : "#2563eb";
  const circumference = 2 * Math.PI * 28;

  const priorityCls = (p: string) =>
    p === "High" ? "bg-rose-50 text-rose-700 ring-rose-100"
    : p === "Medium" ? "bg-amber-50 text-amber-700 ring-amber-100"
    : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader eyebrow="Job Matching" title="AI Job Skills & Gap Analysis" icon="target" iconColor="#f43f5e" />

      {!result && !loading && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon name="briefcase" className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs font-bold text-slate-700">Enter a target job role</p>
          </div>
          <div className="flex gap-2">
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              placeholder="e.g. Frontend Developer"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50" />
            <button onClick={() => analyze()} disabled={!role.trim()}
              className="flex-shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
              Analyze
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularRoles.map((r) => (
              <button key={r} onClick={() => analyze(r)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                {r}
              </button>
            ))}
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <Icon name="refresh" className="h-4 w-4 flex-shrink-0 animate-spin text-rose-500" />
          <p className="text-xs text-slate-500">Matching your skills against {role}…</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative h-[72px] w-[72px] flex-shrink-0">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="36" cy="36" r="28" fill="none" stroke={scoreHex} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * result.match_score) / 100}
                  transform="rotate(-90 36 36)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black" style={{ color: scoreHex }}>{result.match_score}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{result.role}</p>
              <p className="mt-0.5 text-xs text-slate-500">{result.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Matched skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matched_skills.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    <Icon name="check" className="h-3 w-3" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Skill gaps</p>
              <div className="flex flex-col gap-1.5">
                {result.missing_skills.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px]">
                    <span className="text-slate-700">{m.skill}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${priorityCls(m.priority)}`}>{m.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Suggested modules to close the gap</p>
            <div className="flex flex-wrap gap-1.5">
              {result.suggested_modules.map((m, i) => (
                <span key={i} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">{m}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3">
            <Icon name="lightbulb" className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
            <div>
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">Top recommendation</p>
              <p className="text-xs text-rose-700">{result.tip}</p>
            </div>
          </div>

          <button onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
            <Icon name="refresh" className="h-3 w-3" />
            Check another role
          </button>
        </div>
      )}
    </div>
  );
};
const BadgesSection = () => {
  const badges = [
    {
      title: "React Expert",
      icon: "⚛️",
      color: "from-blue-500 to-cyan-500",
      earned: true,
    },
    {
      title: "SQL Master",
      icon: "🗄️",
      color: "from-emerald-500 to-green-500",
      earned: true,
    },
    {
      title: "DSA Warrior",
      icon: "⚔️",
      color: "from-purple-500 to-indigo-500",
      earned: true,
    },
    {
      title: "Placement Ready",
      icon: "🎯",
      color: "from-orange-500 to-red-500",
      earned: false,
    },
    {
      title: "Top Performer",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
      earned: false,
    },
    {
      title: "100 Day Streak",
      icon: "🔥",
      color: "from-pink-500 to-red-500",
      earned: false,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Achievements
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            🏅 Badges & Achievements
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Unlock badges as you progress through your learning journey.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          3 / 6 Earned
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              badge.earned
                ? "border-slate-200 bg-white"
                : "border-dashed border-slate-200 bg-slate-50 opacity-60"
            }`}
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-3xl shadow-lg`}
            >
              {badge.icon}
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              {badge.title}
            </h3>

            <p
              className={`mt-2 text-xs font-semibold ${
                badge.earned ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {badge.earned ? "Unlocked" : "Locked"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
// ═══════════════════════════════════════════════════════════════════════════
// FEATURE 5 — Project & Coding Streak
// ═══════════════════════════════════════════════════════════════════════════
const ProjectCodingStreak = () => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Productivity</p>
        <h2 className="mt-0.5 text-lg font-black text-slate-900">Project &amp; coding streak</h2>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
        <Icon name="zap" className="h-4 w-4 text-orange-500" />
      </div>
    </div>

    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-100 bg-orange-50/60 p-4">
        <p className="text-[11px] font-semibold text-slate-500">Coding streak</p>
        <p className="mt-1.5 text-2xl font-black text-orange-600">🔥 12 days</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-blue-50/60 p-4">
        <p className="text-[11px] font-semibold text-slate-500">Current project</p>
        <p className="mt-1.5 text-base font-bold text-slate-900">AI Resume Analyzer</p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Today&apos;s goal</span>
        <span className="font-semibold text-slate-700">Complete Project Module 4</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>Progress</span>
        <span>2 / 3 tasks completed</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-blue-500" />
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <div>
        <p className="text-xs font-bold text-slate-900">XP earned today</p>
        <p className="mt-0.5 text-[11px] text-slate-500">Keep your streak alive</p>
      </div>
      <p className="text-2xl font-black text-emerald-600">+18 XP</p>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════
// AI Career Coach — Chat Drawer (matches Admin's AIChatPanel)
// ═══════════════════════════════════════════════════════════════════════════
const AICareerCoachPanel = ({ onClose }: { onClose: () => void }) => {
  const { firstName, context } = useStudentProfile();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: `Hi ${firstName}! I'm your AI Career Coach. I know your profile — ask me anything about placements, interviews, or your learning path.` },
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
    const history = [...messages, { role: "user" as const, text: userText }];
    setMessages(history);
    setLoading(true);
    try {
      const reply = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: `You are an expert AI Career Coach for engineering students. You have access to this student's data:
${context}
Be concise, warm, and actionable. Keep responses under 100 words. Use bullet points for lists. Never make up information.`,
        messages: history.map((m) => ({ role: m.role, content: m.text })),
      });
      setMessages((m) => [...m, { role: "assistant", text: reply || "Sorry, I couldn't get a response." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <Icon name="ai-brain" className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AI Career Coach</p>
            <div className="flex items-center gap-1.5">
              <PulseDot color="#10b981" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 p-3">
        {aiCoachTopics.map((t) => (
          <button key={t} onClick={() => send(t)}
            className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition hover:border-blue-500 hover:text-blue-400">
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
              </div>
            )}
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === "user" ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm bg-slate-800 text-slate-200"
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
                  <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            placeholder="Ask your career coach…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          />
          <button onClick={() => send()}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-40"
            disabled={loading || !input.trim()}>
            <Icon name="send" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
export const StudentDashboard = () => {
  const { fullName, firstName, initials, email, phone } = useStudentProfile();
  const [aiOpen, setAiOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="student-dashboard min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-500/25">
              <Icon name="graduation" className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-slate-900">C2C Student</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Campus2Corporate</p>
            </div>
          </div>

          <div className="hidden w-64 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 md:flex">
            <Icon name="search" className="h-3.5 w-3.5" />
            <span className="text-[13px]">Search portal…</span>
            <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50">
              <Icon name="bell" className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">3</span>
            </button>
            <button onClick={() => setAiOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-blue-800">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Ask AI
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-[10px] font-black text-white">{initials}</span>
                <span className="hidden sm:inline">{firstName}</span>
                <Icon name="chevron-down" className={`h-3.5 w-3.5 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl">
                  <div className="border-b border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-900">{fullName}</p>
                    <p className="text-xs text-slate-400">{email}</p>
                  </div>
                  {[
                    { label: "My Profile", route: "/student/profile" },
                    { label: "Certificates", route: "/student/certificates" },
                    { label: "Settings", route: "/student/settings" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.route);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-[76px] space-y-3">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">Student Hub</p>
                <h2 className="mt-1.5 text-base font-black text-white">{fullName}</h2>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">B.Tech CSE · 4th Year</p>
                <div className="mt-4 flex items-center gap-2">
                  <PulseDot color="#10b981" />
                  <span className="text-[10px] font-semibold text-emerald-400">Placement track active</span>
                </div>
              </div>

              <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {sidebarItems.map((item) => (
                  <button key={item.label}
                    onClick={() => {
                      setActiveSidebar(item.label);
                      navigate(item.route);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition ${
                      activeSidebar === item.label ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                  <Icon name="chart" className="h-3.5 w-3.5 text-blue-600" />
                  Overall progress
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-4xl font-black text-slate-900">65</span>
                  <span className="mb-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">Semester 8</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
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
                    AI-powered career workspace
                  </span>
                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    Welcome back, {firstName}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Track your courses, placement readiness, and AI-powered career tools — all in one place.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: "View courses", icon: "book" as IconName },
                      { label: "Resume score", icon: "resume" as IconName },
                      { label: "Book mentor", icon: "users" as IconName },
                      { label: "Schedule mock", icon: "calendar" as IconName },
                    ].map((a) => (
                      <button key={a.label}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                        <Icon name={a.icon} className="h-3.5 w-3.5" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

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
                      { label: "Registered", value: "5" },
                      { label: "Completed", value: "2" },
                      { label: "Pending", value: "3" },
                      { label: "Certificates", value: "1" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                        <p className="text-[10px] font-semibold text-slate-400">{m.label}</p>
                        <p className="mt-0.5 text-xl font-black text-slate-900">{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Learning score</span>
                      <span className="text-blue-700">90%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <article key={s.label}
                  className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                      <Icon name={s.icon} className="h-4.5 w-4.5 text-slate-700" />
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
                
            {/* Profile card + Performance chart */}
            <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-black text-white shadow-inner">{initials}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black leading-tight text-slate-900">{fullName}</h2>
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">STU001</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">B.Tech Computer Science & Eng.</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
                  {[
                    { icon: "mail" as IconName, label: "Email", value: email },
                    { icon: "phone" as IconName, label: "Phone", value: phone },
                    { icon: "graduation" as IconName, label: "University", value: "Campus2Corporate University" },
                    { icon: "calendar" as IconName, label: "DOB", value: "30-12-2000" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3 text-xs">
                      <Icon name={f.icon} className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <div>
                        <p className="text-slate-400">{f.label}</p>
                        <p className="font-semibold text-slate-700">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Learning Analytics</p>
                    <h2 className="mt-0.5 text-lg font-black text-slate-900">Performance overview</h2>
                  </div>
                  <Icon name="chart" className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4 w-full" style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#f8fafc", fontSize: "12px" }} />
                      <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* Coding streak */}
            <ProjectCodingStreak />
            {/* Global Rank */}
            <BadgesSection />
            {/* AI feature grid */}
            <div className="grid gap-5 xl:grid-cols-2">
              {/* <AIStudyPlanner /> */}
              {/* <AIProfileAnalyzer /> */}
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {/* <AIATSScorer /> */}
              {/* <AISkillGapAnalyzer /> */}
            </div>

            {/* Modules & progress */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Course Tracking</p>
                  <h2 className="mt-0.5 text-lg font-black text-slate-900">Modules & learning progress</h2>
                </div>
                <Icon name="book" className="h-4 w-4 text-slate-300" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {modules.map((mod, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[13px] font-bold text-slate-900">{mod.title}</h3>
                        <p className="mt-0.5 text-[10px] text-slate-400">{mod.category}</p>
                      </div>
                      <span className="text-xs font-black text-slate-700">{mod.progress}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${mod.progress}%`, background: mod.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Roadmap + Upcoming activities */}
            <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
              <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Career Path</p>
                    <h2 className="mt-0.5 text-lg font-black">Roadmap to placement</h2>
                  </div>
                  <Icon name="target" className="h-5 w-5 text-blue-400" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {roadmapSteps.map((s) => (
                    <div key={s.step} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <Icon name={s.icon} className="h-4 w-4 text-blue-300" />
                        <span className="text-[9px] font-mono font-bold text-slate-500">{s.step}</span>
                      </div>
                      <p className="mt-2 text-[11px] font-bold text-white">{s.title}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Schedule</p>
                    <h2 className="mt-0.5 text-lg font-black text-slate-900">Upcoming activities</h2>
                  </div>
                  <Icon name="clock" className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  {upcomingActivities.map((a, i) => {
                    const toneCls: Record<string, string> = {
                      High: "bg-rose-50 text-rose-600",
                      Medium: "bg-amber-50 text-amber-600",
                      Normal: "bg-blue-50 text-blue-600",
                      Low: "bg-emerald-50 text-emerald-600",
                    };
                    return (
                      <div key={a.title} className={`flex items-start gap-3 p-3.5 ${i < upcomingActivities.length - 1 ? "border-b border-slate-100" : ""} transition hover:bg-slate-50/60`}>
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${toneCls[a.tone]}`}>
                          <Icon name="calendar" className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-bold text-slate-900">{a.title}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{a.desc}</p>
                        </div>
                        <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{a.date}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* ── AI Chat Drawer ── */}
      {aiOpen && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-start sm:pr-6 sm:pt-[72px]">
          <div className="pointer-events-auto flex h-[560px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-slate-900/50">
            <AICareerCoachPanel onClose={() => setAiOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Floating AI button (mobile) ── */}
      {!aiOpen && (
        <button onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-800 sm:hidden">
          <Icon name="sparkles" className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default StudentDashboard;