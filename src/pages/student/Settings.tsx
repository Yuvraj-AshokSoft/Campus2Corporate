import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import type { StudentSidebarIconName } from "../../components/student/StudentSidebar";

// ─── Icon System (matches Student Dashboard / Admin Dashboard) ───────────────
type IconName =
  | "activity" | "alert" | "arrow-up" | "arrow-down" | "bell" | "briefcase"
  | "building" | "calendar" | "chart" | "check" | "clock" | "dashboard"
  | "database" | "file" | "graduation" | "lock" | "plug" | "search"
  | "settings" | "shield" | "sparkles" | "target" | "user-check" | "users"
  | "ai-brain" | "placement" | "resume" | "interview" | "risk" | "campus"
  | "automation" | "monitor" | "send" | "refresh" | "close" | "chevron-right"
  | "wand" | "zap" | "trending-up" | "cpu" | "mail" | "phone" | "book"
  | "award" | "upload" | "eye" | "message" | "chevron-down" | "lightbulb"
  | "clipboard" | "logout" | "camera" | "edit" | "trash" | "link" | "github"
  | "linkedin" | "globe" | "key" | "sun" | "moon" | "download" | "plus" | "smartphone";

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
    camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /></>,
    link: <><path d="M9 15 15 9" /><path d="M11 6.5 13 4.5a4 4 0 0 1 5.5 5.5L16.5 12" /><path d="M13 17.5 11 19.5a4 4 0 0 1-5.5-5.5L7.5 12" /></>,
    github: <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7" /><path d="M7 7v.01" /><path d="M11 17v-4a2 2 0 0 1 4 0v4" /><path d="M11 10v7" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18" /><path d="M12 3a15 15 0 0 0 0 18" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m10.5 12.5 8-8" /><path d="M16 7l2 2" /><path d="M13.5 9.5l2 2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
    download: <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    smartphone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "YS";

const useStudentProfile = () => {
  const { currentUser, logout } = useAuth();
  const fullName = currentUser?.fullName || "Yuvraj Singh";
  const initials = getInitials(fullName);
  const email = currentUser?.email || "yuvraj@example.com";
  const phone = currentUser?.phone || "+91 9876543210";
  return { fullName, initials, email, phone, logout };
};

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
  </div>
);

const sidebarItems: Array<{ label: string; icon: StudentSidebarIconName; route: string; badge?: number }> = [
  { label: "Dashboard", icon: "dashboard", route: "/student/dashboard" },
  { label: "My Profile", icon: "user-check", route: "/student/profile" },
  { label: "Project List", icon: "briefcase", route: "/student/projects" },
  { label: "Applied Projects", icon: "clipboard", route: "/student/applied-projects", badge: 2 },
  { label: "Notifications", icon: "bell", route: "/student/notifications", badge: 3 },
  { label: "Certificates", icon: "award", route: "/student/certificates" },
  { label: "Settings", icon: "settings", route: "/student/settings" },
];

// ─── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    role="switch"
    aria-checked={checked}
    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
      checked ? "bg-blue-600" : "bg-slate-200"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

interface ToggleRow { key: string; label: string; sub: string; icon: IconName; value: boolean }

const ToggleList = ({ items, onToggle }: { items: ToggleRow[]; onToggle: (key: string) => void }) => (
  <div className="divide-y divide-slate-100">
    {items.map((item) => (
      <div key={item.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-100">
            <Icon name={item.icon} className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-800">{item.label}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{item.sub}</p>
          </div>
        </div>
        <Toggle checked={item.value} onChange={() => onToggle(item.key)} />
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════
export const StudentSettings = () => {
  const { fullName, email, logout } = useStudentProfile();
  const navigate = useNavigate();
  const [savedToast, setSavedToast] = useState(false);

  const [accountEmail, setAccountEmail] = useState(email);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [notifications, setNotifications] = useState<ToggleRow[]>([
    { key: "email", label: "Email notifications", sub: "Assignment updates, deadlines & results", icon: "mail", value: true },
    { key: "sms", label: "SMS alerts", sub: "Time-sensitive reminders via text", icon: "smartphone", value: false },
    { key: "assignments", label: "Assignment reminders", sub: "Notify before submission deadlines", icon: "clipboard", value: true },
    { key: "mentor", label: "Mentor session reminders", sub: "Alerts before scheduled sessions", icon: "users", value: true },
    { key: "marketing", label: "Placement drive updates", sub: "New opportunities matching your profile", icon: "briefcase", value: true },
  ]);

  const [privacy, setPrivacy] = useState<ToggleRow[]>([
    { key: "recruiterVisible", label: "Visible to recruiters", sub: "Allow verified recruiters to view your profile", icon: "eye", value: true },
    { key: "leaderboard", label: "Show me on leaderboards", sub: "Display your rank on public leaderboards", icon: "trending-up", value: true },
    { key: "twoFactor", label: "Two-factor authentication", sub: "Extra security step at every login", icon: "shield", value: false },
  ]);

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const toggle = (list: ToggleRow[], setList: (v: ToggleRow[]) => void, key: string) =>
    setList(list.map((i) => (i.key === key ? { ...i, value: !i.value } : i)));

  const showSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  return (
    <StudentLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Settings"
      userSummary={{ fullName, role: "B.Tech CSE · 4th Year", status: "Placement track active" }}
      stats={{ label: "Account security", value: "Off", subtitle: "Two-factor authentication", accent: "Off" }}
      showAiButton={false}
    >
      <>

            {/* Header banner */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                  <Icon name="settings" className="h-3 w-3" />
                  Account settings
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Manage your account</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Control your login details, notifications, privacy and appearance preferences.
                </p>
              </div>
            </div>

            {/* Account + Password */}
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Login" title="Account details" icon="user-check" iconColor="#2563eb" />
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                      <Icon name="mail" className="h-3.5 w-3.5 text-slate-400" />
                      Email address
                    </label>
                    <input value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50" />
                  </div>
                  <button onClick={showSaved}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
                    <Icon name="check" className="h-3.5 w-3.5" />
                    Save changes
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Security" title="Change password" icon="key" iconColor="#f59e0b" />
                <div className="mt-4 space-y-3">
                  <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="Current password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50" />
                  <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="New password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50" />
                  <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-50" />
                  <button onClick={showSaved}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
                    <Icon name="lock" className="h-3.5 w-3.5" />
                    Update password
                  </button>
                </div>
              </section>
            </div>

            {/* Notifications + Privacy */}
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Alerts" title="Notification preferences" icon="bell" iconColor="#8b5cf6" />
                <div className="mt-4">
                  <ToggleList items={notifications} onToggle={(k) => toggle(notifications, setNotifications, k)} />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Visibility" title="Privacy & security" icon="shield" iconColor="#10b981" />
                <div className="mt-4">
                  <ToggleList items={privacy} onToggle={(k) => toggle(privacy, setPrivacy, k)} />
                </div>
              </section>
            </div>

            {/* Appearance + Connected accounts */}
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Display" title="Appearance" icon="monitor" iconColor="#2563eb" />
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {[
                    { key: "light", label: "Light", icon: "sun" as IconName },
                    { key: "dark", label: "Dark", icon: "moon" as IconName },
                    { key: "system", label: "System", icon: "monitor" as IconName },
                  ].map((t) => (
                    <button key={t.key} onClick={() => setTheme(t.key as typeof theme)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 text-xs font-bold transition ${
                        theme === t.key ? "border-blue-300 bg-blue-50 text-blue-700 ring-1 ring-blue-100" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}>
                      <Icon name={t.icon} className="h-4 w-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionHeader eyebrow="Integrations" title="Connected accounts" icon="link" iconColor="#f43f5e" />
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: "GitHub", icon: "github" as IconName, connected: true },
                    { label: "LinkedIn", icon: "linkedin" as IconName, connected: false },
                  ].map((acc) => (
                    <div key={acc.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                          <Icon name={acc.icon} className="h-4 w-4 text-slate-700" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{acc.label}</p>
                          <p className="text-[10px] text-slate-400">{acc.connected ? "Connected" : "Not connected"}</p>
                        </div>
                      </div>
                      <button className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                        acc.connected ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}>
                        {acc.connected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Danger zone */}
            <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 shadow-sm">
              <SectionHeader eyebrow="Caution" title="Danger zone" icon="alert" iconColor="#ef4444" />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Deactivate or delete your account</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">This will remove your access to placement tracking, mentors, and applied projects.</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => { logout?.(); navigate("/login"); }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    <Icon name="logout" className="h-3.5 w-3.5" />
                    Log out
                  </button>
                  <button className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-500">
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    Delete account
                  </button>
                </div>
              </div>
            </section>
      </>

      {/* ── Saved toast ── */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Icon name="check" className="h-4 w-4 text-emerald-400" />
          Changes saved
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentSettings;
