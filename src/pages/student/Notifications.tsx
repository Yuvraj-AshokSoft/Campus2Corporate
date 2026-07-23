import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentLayout from "../../components/student/StudentLayout";

// ─── Icon System (matches Admin Dashboard / Student Dashboard) ───────────────
type IconName =
  | "activity" | "alert" | "arrow-up" | "arrow-down" | "bell" | "briefcase"
  | "building" | "calendar" | "chart" | "check" | "clock" | "dashboard"
  | "database" | "file" | "graduation" | "lock" | "plug" | "search"
  | "settings" | "shield" | "sparkles" | "target" | "user-check" | "users"
  | "ai-brain" | "placement" | "resume" | "interview" | "risk" | "campus"
  | "automation" | "monitor" | "send" | "refresh" | "close" | "chevron-right"
  | "wand" | "zap" | "trending-up" | "cpu" | "mail" | "phone" | "book"
  | "award" | "upload" | "eye" | "message" | "chevron-down" | "lightbulb"
  | "clipboard" | "logout" | "trash" | "filter" | "check-circle" | "info"
  | "smartphone" | "eye-off" | "key" | "share2";

const Icon = ({ name, className = "h-4 w-4", style }: { name: IconName; className?: string; style?: React.CSSProperties }) => {
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
    trash: <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" /></>,
    filter: <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" />,
    "check-circle": <><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.3 2.3 4.7-5.1" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01" /><path d="M11 12h1v5h1" /></>,
    smartphone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
    "eye-off": <><path d="M3 3l18 18" /><path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.2 4.1" /><path d="M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m10.8 12.2 7.7-7.7" /><path d="m16.5 5.5 2 2" /><path d="m14.5 7.5 2 2" /></>,
    share2: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-3.8" /><path d="m8.6 13.4 6.8 3.8" /></>,
  };
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Toggle switch ──────────────────────────────────────────────────────────
// Fixed-size track (44 x 24) with a fixed-size thumb (16 x 16) and a 4px inset
// on both sides. translate-x-1 (unchecked) and translate-x-6 (checked) keep the
// thumb fully inside the track at every state — nothing overflows the pill.
const Toggle = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${
      checked ? "bg-blue-600" : "bg-slate-300"
    }`}
  >
    <span
      className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const ToggleRow = ({
  icon, iconBg, iconFg, title, desc, checked, onChange,
}: {
  icon: IconName; iconBg: string; iconFg: string; title: string; desc: string; checked: boolean; onChange: () => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: iconBg }}>
        <Icon name={icon} className="h-4 w-4" style={{ color: iconFg } as React.CSSProperties} />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-slate-800">{title}</p>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-400">{desc}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} label={title} />
  </div>
);

const sidebarItems: Array<{ label: string; icon: IconName; route: string; badge?: number }> = [
  { label: "Dashboard", icon: "dashboard", route: "/student-dashboard" },
  { label: "My Profile", icon: "user-check", route: "/student/profile" },
  { label: "Project List", icon: "briefcase", route: "/student/projects" },
  { label: "Applied Projects", icon: "clipboard", route: "/student/applied-projects", badge: 2 },
  { label: "Notifications", icon: "bell", route: "/student/notifications", badge: 3 },
  { label: "Certificates", icon: "award", route: "/student/certificates" },
  { label: "Settings", icon: "settings", route: "/student/settings" },
  { label: "AI Resume Builder", icon: "resume" , route: "/student/airesume" },
];

// ─── Notification Data ─────────────────────────────────────────────────────
type NotificationType = "assignment" | "assessment" | "mentor" | "interview" | "system" | "achievement";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const typeMeta: Record<NotificationType, { icon: IconName; bg: string; fg: string }> = {
  assignment: { icon: "file", bg: "#eff6ff", fg: "#2563eb" },
  assessment: { icon: "target", bg: "#fff7ed", fg: "#f59e0b" },
  mentor: { icon: "users", bg: "#f5f3ff", fg: "#8b5cf6" },
  interview: { icon: "interview", bg: "#fdf2f8", fg: "#f43f5e" },
  system: { icon: "info", bg: "#f0f9ff", fg: "#0ea5e9" },
  achievement: { icon: "award", bg: "#ecfdf5", fg: "#10b981" },
};

const initialNotifications: NotificationItem[] = [
  { id: "n1", type: "assignment", title: "React Assignment due soon", desc: "Module 3 Project Submission is due 25 Jun. Submit before 11:59 PM.", time: "2h ago", read: false },
  { id: "n2", type: "assessment", title: "Aptitude Assessment scheduled", desc: "Your Placement Prep Test is scheduled for 28 Jun, 10:00 AM.", time: "5h ago", read: false },
  { id: "n3", type: "mentor", title: "Mentor session confirmed", desc: "One-on-one career guidance with your mentor on 30 Jun, 3:00 PM.", time: "1d ago", read: false },
  { id: "n4", type: "achievement", title: "New badge unlocked", desc: "You earned the \u201cDSA Warrior\u201d badge for completing 20 DSA problems.", time: "1d ago", read: true },
  { id: "n5", type: "interview", title: "Mock interview reminder", desc: "Technical practice mock interview is set for 05 Jul, 11:00 AM.", time: "2d ago", read: true },
  { id: "n6", type: "system", title: "Profile verification complete", desc: "Your academic credentials have been verified successfully.", time: "3d ago", read: true },
  { id: "n7", type: "assignment", title: "Python module updated", desc: "New exercises added to Python Programming — 45% progress.", time: "4d ago", read: true },
  { id: "n8", type: "mentor", title: "Feedback received", desc: "Your mentor left feedback on your last mock trial submission.", time: "5d ago", read: true },
];

type FilterTab = "all" | "unread" | NotificationType;

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "assignment", label: "Assignments" },
  { key: "assessment", label: "Assessments" },
  { key: "mentor", label: "Mentor" },
  { key: "interview", label: "Interviews" },
  { key: "achievement", label: "Achievements" },
];

// ─── Preference & Privacy state shapes ─────────────────────────────────────
interface NotificationPrefs {
  assignments: boolean;
  assessments: boolean;
  mentorSessions: boolean;
  interviews: boolean;
  achievements: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const defaultNotificationPrefs: NotificationPrefs = {
  assignments: true,
  assessments: true,
  mentorSessions: true,
  interviews: true,
  achievements: false,
  email: true,
  push: true,
  sms: false,
};

interface PrivacyPrefs {
  profileVisibleToRecruiters: boolean;
  showActivityStatus: boolean;
  shareDataWithPartners: boolean;
  twoFactorAuth: boolean;
}

const defaultPrivacyPrefs: PrivacyPrefs = {
  profileVisibleToRecruiters: true,
  showActivityStatus: true,
  shareDataWithPartners: false,
  twoFactorAuth: false,
};

type SettingsTab = "notifications" | "preferences" | "privacy";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export const StudentNotifications = () => {
  const { currentUser } = useAuth();
  const fullName = currentUser?.fullName || "Yuvraj Singh";
  const email = currentUser?.email || "yuvraj@example.com";

  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("notifications");
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(defaultNotificationPrefs);
  const [privacyPrefs, setPrivacyPrefs] = useState<PrivacyPrefs>(defaultPrivacyPrefs);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = items.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const markAsRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllAsRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const toggleNotifPref = (key: keyof NotificationPrefs) =>
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePrivacyPref = (key: keyof PrivacyPrefs) =>
    setPrivacyPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const settingsTabs: { key: SettingsTab; label: string; icon: IconName }[] = [
    { key: "notifications", label: "Activity feed", icon: "bell" },
    { key: "preferences", label: "Notification preferences", icon: "settings" },
    { key: "privacy", label: "Privacy & security", icon: "shield" },
  ];

  return (
    <StudentLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Notifications"
      userSummary={{ fullName, role: "B.Tech CSE · 4th Year", status: "Placement track active" }}
      stats={{ label: "Unread", value: String(unreadCount), subtitle: "Today", accent: unreadCount > 0 ? "New" : "All caught up" }}
      showAiButton={false}
    >
      <div className="space-y-5">

            {/* Page header banner */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                    <Icon name="bell" className="h-3 w-3" />
                    Stay in the loop
                  </span>
                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Notifications</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Updates on assignments, assessments, mentor sessions, and placement activity.
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[12px] font-bold text-rose-700 ring-1 ring-rose-100">
                    {unreadCount} unread
                  </span>
                  <button onClick={markAllAsRead} disabled={unreadCount === 0}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
                    <Icon name="check-circle" className="h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>

            {/* Section tabs: Activity feed / Notification preferences / Privacy & security */}
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex flex-wrap gap-1.5">
                {settingsTabs.map((tab) => (
                  <button key={tab.key} onClick={() => setSettingsTab(tab.key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      settingsTab === tab.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}>
                    <Icon name={tab.icon} className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Activity feed ── */}
            {settingsTab === "notifications" && (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="flex flex-wrap gap-1.5">
                    {filterTabs.map((tab) => (
                      <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          activeTab === tab.key ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }`}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity Feed</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">
                        {activeTab === "all" ? "All notifications" : filterTabs.find((t) => t.key === activeTab)?.label}
                      </h2>
                    </div>
                    <Icon name="filter" className="h-4 w-4 text-slate-300" />
                  </div>

                  {filtered.length === 0 ? (
                    <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                        <Icon name="bell" className="h-4 w-4 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-600">You're all caught up</p>
                      <p className="text-xs text-slate-400">Nothing here for this filter right now.</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-2.5">
                      {filtered.map((n) => {
                        const meta = typeMeta[n.type];
                        return (
                          <div key={n.id}
                            className={`group flex items-start gap-3 rounded-xl border p-3.5 transition ${
                              n.read ? "border-slate-100 bg-white" : "border-blue-100 bg-blue-50/40"
                            }`}>
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: meta.bg }}>
                              <Icon name={meta.icon} className="h-4 w-4" style={{ color: meta.fg } as React.CSSProperties} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                {!n.read && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />}
                                <p className="truncate text-[13px] font-bold text-slate-900">{n.title}</p>
                              </div>
                              <p className="mt-0.5 text-xs leading-5 text-slate-500">{n.desc}</p>
                              <p className="mt-1.5 text-[10px] font-semibold text-slate-400">{n.time}</p>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                              {!n.read && (
                                <button onClick={() => markAsRead(n.id)} title="Mark as read"
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600">
                                  <Icon name="check" className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button onClick={() => dismiss(n.id)} title="Dismiss"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* ── Notification preferences ── */}
            {settingsTab === "preferences" && (
              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What you're alerted about</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">Notification types</h2>
                    </div>
                    <Icon name="settings" className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="mt-2 divide-y divide-slate-100">
                    <ToggleRow icon="file" iconBg="#eff6ff" iconFg="#2563eb"
                      title="Assignment updates" desc="Deadlines, submissions, and grading for your modules."
                      checked={notifPrefs.assignments} onChange={() => toggleNotifPref("assignments")} />
                    <ToggleRow icon="target" iconBg="#fff7ed" iconFg="#f59e0b"
                      title="Assessment reminders" desc="Aptitude tests and placement prep assessment alerts."
                      checked={notifPrefs.assessments} onChange={() => toggleNotifPref("assessments")} />
                    <ToggleRow icon="users" iconBg="#f5f3ff" iconFg="#8b5cf6"
                      title="Mentor session alerts" desc="Confirmations and reminders for one-on-one sessions."
                      checked={notifPrefs.mentorSessions} onChange={() => toggleNotifPref("mentorSessions")} />
                    <ToggleRow icon="interview" iconBg="#fdf2f8" iconFg="#f43f5e"
                      title="Interview reminders" desc="Mock and real interview scheduling updates."
                      checked={notifPrefs.interviews} onChange={() => toggleNotifPref("interviews")} />
                    <ToggleRow icon="award" iconBg="#ecfdf5" iconFg="#10b981"
                      title="Achievements & badges" desc="Get notified when you unlock a new badge or milestone."
                      checked={notifPrefs.achievements} onChange={() => toggleNotifPref("achievements")} />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">How you're alerted</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">Delivery channels</h2>
                    </div>
                    <Icon name="send" className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="mt-2 divide-y divide-slate-100">
                    <ToggleRow icon="mail" iconBg="#eff6ff" iconFg="#2563eb"
                      title="Email notifications" desc={`Sent to ${email}`}
                      checked={notifPrefs.email} onChange={() => toggleNotifPref("email")} />
                    <ToggleRow icon="bell" iconBg="#f0f9ff" iconFg="#0ea5e9"
                      title="Push notifications" desc="Real-time alerts in the browser and mobile app."
                      checked={notifPrefs.push} onChange={() => toggleNotifPref("push")} />
                    <ToggleRow icon="smartphone" iconBg="#f5f3ff" iconFg="#8b5cf6"
                      title="SMS alerts" desc="Text messages for time-critical updates only."
                      checked={notifPrefs.sms} onChange={() => toggleNotifPref("sms")} />
                  </div>
                </section>
              </div>
            )}

            {/* ── Privacy & security ── */}
            {settingsTab === "privacy" && (
              <div className="space-y-5">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Who can see your data</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">Privacy</h2>
                    </div>
                    <Icon name="eye-off" className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="mt-2 divide-y divide-slate-100">
                    <ToggleRow icon="eye" iconBg="#ecfdf5" iconFg="#10b981"
                      title="Profile visible to recruiters" desc="Let hiring partners view your profile and resume score."
                      checked={privacyPrefs.profileVisibleToRecruiters} onChange={() => togglePrivacyPref("profileVisibleToRecruiters")} />
                    <ToggleRow icon="activity" iconBg="#eff6ff" iconFg="#2563eb"
                      title="Show activity status" desc="Let mentors and admins see when you were last active."
                      checked={privacyPrefs.showActivityStatus} onChange={() => togglePrivacyPref("showActivityStatus")} />
                    <ToggleRow icon="share2" iconBg="#fff7ed" iconFg="#f59e0b"
                      title="Share data with placement partners" desc="Allow anonymized performance data to improve matching."
                      checked={privacyPrefs.shareDataWithPartners} onChange={() => togglePrivacyPref("shareDataWithPartners")} />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account protection</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">Security</h2>
                    </div>
                    <Icon name="shield" className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="mt-2 divide-y divide-slate-100">
                    <ToggleRow icon="key" iconBg="#f5f3ff" iconFg="#8b5cf6"
                      title="Two-factor authentication" desc="Require a one-time code in addition to your password."
                      checked={privacyPrefs.twoFactorAuth} onChange={() => togglePrivacyPref("twoFactorAuth")} />
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <Icon name="lock" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <p className="text-[11px] text-slate-500">
                      Turning on two-factor authentication adds a verification step the next time you sign in from a new device.
                    </p>
                  </div>
                </section>
              </div>
            )}
      </div>
    </StudentLayout>
  );
};

export default StudentNotifications;