// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../context/AuthContext";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import StudentLayout from "../../components/student/StudentLayout";
// import {
//   getApiErrorMessage,
//   studentApi,
//   unwrapData,
//   type StudentProfile,
// } from "../../services/studentApi";

// // ─── Icon System (matches Admin Dashboard) ────────────────────────────────────
// type IconName =
//   | "activity"
//   | "alert"
//   | "arrow-up"
//   | "arrow-down"
//   | "bell"
//   | "briefcase"
//   | "building"
//   | "calendar"
//   | "chart"
//   | "check"
//   | "clock"
//   | "dashboard"
//   | "database"
//   | "file"
//   | "graduation"
//   | "lock"
//   | "plug"
//   | "search"
//   | "settings"
//   | "shield"
//   | "sparkles"
//   | "target"
//   | "user-check"
//   | "users"
//   | "ai-brain"
//   | "placement"
//   | "resume"
//   | "interview"
//   | "risk"
//   | "campus"
//   | "automation"
//   | "monitor"
//   | "send"
//   | "refresh"
//   | "close"
//   | "chevron-right"
//   | "wand"
//   | "zap"
//   | "trending-up"
//   | "cpu"
//   | "mail"
//   | "phone"
//   | "book"
//   | "award"
//   | "upload"
//   | "eye"
//   | "message"
//   | "chevron-down"
//   | "lightbulb"
//   | "clipboard"
//   | "logout";

// const Icon = ({
//   name,
//   className = "h-4 w-4",
// }: {
//   name: IconName;
//   className?: string;
// }) => {
//   const paths: Record<IconName, React.ReactNode> = {
//     activity: <path d="M4 12h3l2-6 4 12 2-6h5" />,
//     alert: (
//       <>
//         <path d="M12 4 3.5 18.5h17L12 4Z" />
//         <path d="M12 9v4" />
//         <path d="M12 16h.01" />
//       </>
//     ),
//     "arrow-up": (
//       <>
//         <path d="M7 17 17 7" />
//         <path d="M9 7h8v8" />
//       </>
//     ),
//     "arrow-down": (
//       <>
//         <path d="M7 7 17 17" />
//         <path d="M17 9v8H9" />
//       </>
//     ),
//     bell: (
//       <>
//         <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
//         <path d="M10 20a2 2 0 0 0 4 0" />
//       </>
//     ),
//     briefcase: (
//       <>
//         <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
//         <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
//         <path d="M4 12h16" />
//       </>
//     ),
//     building: (
//       <>
//         <path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
//         <path d="M3 21h18" />
//         <path d="M9 7h1" />
//         <path d="M14 7h1" />
//         <path d="M9 11h1" />
//         <path d="M14 11h1" />
//       </>
//     ),
//     calendar: (
//       <>
//         <path d="M7 3v4" />
//         <path d="M17 3v4" />
//         <rect x="4" y="5" width="16" height="16" rx="2" />
//         <path d="M4 10h16" />
//       </>
//     ),
//     chart: (
//       <>
//         <path d="M4 19V5" />
//         <path d="M4 19h16" />
//         <path d="M8 16v-5" />
//         <path d="M12 16V8" />
//         <path d="M16 16v-7" />
//       </>
//     ),
//     check: (
//       <>
//         <path d="M21 12a9 9 0 1 1-5-8" />
//         <path d="m9 12 2 2 6-7" />
//       </>
//     ),
//     clock: (
//       <>
//         <circle cx="12" cy="12" r="9" />
//         <path d="M12 7v5l3 2" />
//       </>
//     ),
//     dashboard: (
//       <>
//         <rect x="3" y="3" width="7" height="7" rx="1.5" />
//         <rect x="14" y="3" width="7" height="7" rx="1.5" />
//         <rect x="3" y="14" width="7" height="7" rx="1.5" />
//         <rect x="14" y="14" width="7" height="7" rx="1.5" />
//       </>
//     ),
//     database: (
//       <>
//         <ellipse cx="12" cy="5" rx="7" ry="3" />
//         <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
//         <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
//       </>
//     ),
//     file: (
//       <>
//         <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
//         <path d="M14 3v6h6" />
//         <path d="M8 13h8" />
//         <path d="M8 17h5" />
//       </>
//     ),
//     graduation: (
//       <>
//         <path d="m22 10-10-5-10 5 10 5 10-5Z" />
//         <path d="M6 12v5c3 2 9 2 12 0v-5" />
//       </>
//     ),
//     lock: (
//       <>
//         <rect x="4" y="11" width="16" height="10" rx="2" />
//         <path d="M8 11V8a4 4 0 0 1 8 0v3" />
//       </>
//     ),
//     plug: (
//       <>
//         <path d="M8 3v5" />
//         <path d="M16 3v5" />
//         <path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" />
//         <path d="M12 18v3" />
//       </>
//     ),
//     search: (
//       <>
//         <circle cx="11" cy="11" r="7" />
//         <path d="m16 16 4 4" />
//       </>
//     ),
//     settings: (
//       <>
//         <circle cx="12" cy="12" r="3" />
//         <path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
//       </>
//     ),
//     shield: (
//       <>
//         <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
//         <path d="m9 12 2 2 4-5" />
//       </>
//     ),
//     sparkles: (
//       <>
//         <path d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
//         <path d="M5 16v4" />
//         <path d="M3 18h4" />
//         <path d="M19 3v3" />
//         <path d="M17.5 4.5h3" />
//       </>
//     ),
//     target: (
//       <>
//         <circle cx="12" cy="12" r="8" />
//         <circle cx="12" cy="12" r="4" />
//         <path d="M12 2v3" />
//         <path d="M12 19v3" />
//         <path d="M2 12h3" />
//         <path d="M19 12h3" />
//       </>
//     ),
//     "user-check": (
//       <>
//         <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//         <circle cx="8.5" cy="7" r="4" />
//         <path d="m16 11 2 2 4-5" />
//       </>
//     ),
//     users: (
//       <>
//         <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
//         <circle cx="9.5" cy="7" r="4" />
//         <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
//         <path d="M16 3.2a4 4 0 0 1 0 7.6" />
//       </>
//     ),
//     "ai-brain": (
//       <>
//         <circle cx="12" cy="12" r="5" />
//         <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
//         <path d="m4.9 4.9 2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
//       </>
//     ),
//     placement: (
//       <>
//         <path d="M12 4v12" />
//         <path d="m8 12 4-4 4 4" />
//         <path d="M8 20h8" />
//       </>
//     ),
//     resume: (
//       <>
//         <path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
//         <path d="M14 3v5h5" />
//         <path d="M8 13h8" />
//         <path d="M8 17h6" />
//       </>
//     ),
//     interview: (
//       <>
//         <path d="M6 7h12v8H9l-3 3V7Z" />
//         <path d="M8 5h8" />
//       </>
//     ),
//     risk: (
//       <>
//         <path d="M12 3 3 19h18L12 3Z" />
//         <path d="M12 9v4" />
//         <path d="M12 17h.01" />
//       </>
//     ),
//     campus: (
//       <>
//         <path d="M4 21V9l8-5 8 5v12" />
//         <path d="M12 3v18" />
//         <path d="M8 12h8" />
//       </>
//     ),
//     automation: (
//       <>
//         <circle cx="12" cy="12" r="5" />
//         <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
//         <path d="m4.9 4.9 1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
//       </>
//     ),
//     monitor: (
//       <>
//         <rect x="4" y="5" width="16" height="12" rx="2" />
//         <path d="M8 21h8" />
//         <path d="M12 17v4" />
//       </>
//     ),
//     send: (
//       <>
//         <path d="m22 2-11 11" />
//         <path d="m22 2-7 20-4-9-9-4 20-7z" />
//       </>
//     ),
//     refresh: (
//       <>
//         <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//         <path d="M21 3v5h-5" />
//         <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//         <path d="M8 16H3v5" />
//       </>
//     ),
//     close: (
//       <>
//         <path d="M18 6 6 18" />
//         <path d="m6 6 12 12" />
//       </>
//     ),
//     "chevron-right": <path d="m9 18 6-6-6-6" />,
//     wand: (
//       <>
//         <path d="m15 5 4 4" />
//         <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 3.43L9.6 10.1" />
//         <path d="m9.6 10.1-4.3 4.3a2.41 2.41 0 0 0 3.43 3.4L13 13.4" />
//         <path d="m13 13.4 4.3 4.3a2.41 2.41 0 0 0 3.4-3.43L16.6 10" />
//         <path d="m16.6 10 1.7-1.7" />
//       </>
//     ),
//     zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
//     "trending-up": (
//       <>
//         <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//         <polyline points="16 7 22 7 22 13" />
//       </>
//     ),
//     cpu: (
//       <>
//         <rect x="4" y="4" width="16" height="16" rx="2" />
//         <rect x="9" y="9" width="6" height="6" />
//         <path d="M15 2v2M9 2v2M2 15h2M2 9h2M15 20v2M9 20v2M20 15h2M20 9h2" />
//       </>
//     ),
//     mail: (
//       <>
//         <rect x="3" y="5" width="18" height="14" rx="2" />
//         <path d="m3 7 9 6 9-6" />
//       </>
//     ),
//     phone: <path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.3 1L6.6 10.8Z" />,
//     book: (
//       <>
//         <path d="M4 5a2 2 0 0 1 2-2h9v16H6a2 2 0 0 0-2 2V5Z" />
//         <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-3" />
//       </>
//     ),
//     award: (
//       <>
//         <circle cx="12" cy="8" r="6" />
//         <path d="m9 13.5-1 7.5 4-2 4 2-1-7.5" />
//       </>
//     ),
//     upload: (
//       <>
//         <path d="M12 3v12" />
//         <path d="m7 8 5-5 5 5" />
//         <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
//       </>
//     ),
//     eye: (
//       <>
//         <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
//         <circle cx="12" cy="12" r="3" />
//       </>
//     ),
//     message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
//     "chevron-down": <path d="m6 9 6 6 6-6" />,
//     lightbulb: (
//       <>
//         <path d="M9 18h6" />
//         <path d="M10 21h4" />
//         <path d="M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
//       </>
//     ),
//     clipboard: (
//       <>
//         <rect x="6" y="4" width="12" height="17" rx="2" />
//         <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
//         <path d="m9 12 2 2 4-4" />
//       </>
//     ),
//     logout: (
//       <>
//         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//         <path d="m16 17 5-5-5-5" />
//         <path d="M21 12H9" />
//       </>
//     ),
//   };
//   return (
//     <svg
//       className={className}
//       fill="none"
//       stroke="currentColor"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       viewBox="0 0 24 24"
//       aria-hidden="true"
//     >
//       {paths[name]}
//     </svg>
//   );
// };



// const getInitials = (name: string) =>
//   name
//     .trim()
//     .split(/\s+/)
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2) || "YS";

// const buildStudentContext = (name: string) =>
//   `Student: ${name}
// Use the connected dashboard profile, learning, applications, and notification data when giving guidance.`;

// // Shared hook: pulls the signed-in user (with sensible fallbacks) and derives
// // everything the dashboard and AI features need from it.
// const useStudentProfile = () => {
//   const { currentUser, logout } = useAuth();
//   const fullName = currentUser?.fullName || currentUser?.name || "Student";
//   const firstName = fullName.split(" ")[0] || "Student";
//   const initials = getInitials(fullName);
//   const email = currentUser?.email || "";
//   const phone = currentUser?.phone || "";
//   const context = buildStudentContext(fullName);
//   return { fullName, firstName, initials, email, phone, context, logout, currentUser };
// };

// const sidebarItems: Array<{ label: string; icon: IconName; route: string; badge?: number }> = [
//   { label: "Dashboard", icon: "dashboard", route: "/student-dashboard" },
//   { label: "My Profile", icon: "user-check", route: "/student/profile" },
//   { label: "Project List", icon: "briefcase", route: "/student/projects" },
//   { label: "Applied Projects", icon: "clipboard", route: "/student/applied-projects", badge: 2 },
//   { label: "Hiring Process", icon: "building", route: "/student/hiring" },
//   { label: "Notifications", icon: "bell", route: "/student/notifications", badge: 3 },
//   { label: "Certificates", icon: "award", route: "/student/certificates" },
//   { label: "Settings", icon: "settings", route: "/student/settings" },
//   { label: "AI Resume Builder", icon: "resume", route: "/student/ai-resume" },
// ];
// const roadmapSteps = [
//   {
//     step: "01",
//     title: "Profile Building",
//     desc: "Secure, verified credentials.",
//     icon: "user-check" as IconName,
//   },
//   {
//     step: "02",
//     title: "Skill Assessment",
//     desc: "AI proctored baseline tests.",
//     icon: "ai-brain" as IconName,
//   },
//   {
//     step: "03",
//     title: "Learning Roadmap",
//     desc: "Curated targeted content.",
//     icon: "book" as IconName,
//   },
//   {
//     step: "04",
//     title: "Mentorship",
//     desc: "Mock trials & expert reviews.",
//     icon: "users" as IconName,
//   },
//   {
//     step: "05",
//     title: "AI Matching",
//     desc: "Vector matching active roles.",
//     icon: "cpu" as IconName,
//   },
//   {
//     step: "06",
//     title: "Interview",
//     desc: "Calendar scheduling.",
//     icon: "calendar" as IconName,
//   },
//   {
//     step: "07",
//     title: "Placement",
//     desc: "Final contract signing.",
//     icon: "award" as IconName,
//   },
// ];

// const aiCoachTopics = [
//   "How do I crack placement interviews?",
//   "What should I focus on this week?",
//   "Review my weak areas",
//   "Predict my placement readiness",
// ];

// const popularRoles = [
//   "Frontend Developer",
//   "Backend Developer",
//   "Data Analyst",
//   "Full Stack Developer",
// ];

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface StudyDay {
//   day: string;
//   tasks: string[];
// }
// interface ProfileResult {
//   score: number;
//   strengths: string[];
//   gaps: string[];
//   tip: string;
// }
// interface ATSBreakdown {
//   label: string;
//   score: number;
// }
// interface ATSResult {
//   score: number;
//   title: string;
//   description: string;
//   breakdown: ATSBreakdown[];
//   keywords_found: string[];
//   keywords_missing: string[];
//   tip: string;
// }
// interface SkillGapResult {
//   match_score: number;
//   role: string;
//   summary: string;
//   matched_skills: string[];
//   missing_skills: { skill: string; priority: "High" | "Medium" | "Low" }[];
//   suggested_modules: string[];
//   tip: string;
// }

// interface DashboardModule {
//   id?: string;
//   title: string;
//   category: string;
//   progress: number;
//   color: string;
// }

// interface DashboardActivity {
//   id?: string;
//   title: string;
//   desc: string;
//   date: string;
//   tone: "High" | "Medium" | "Normal" | "Low" | string;
// }

// interface DashboardData {
//   profile: StudentProfile;
//   stats: {
//     registeredCourses: number;
//     completed: number;
//     pending: number;
//     certificates: number;
//     appliedProjects: number;
//     unreadNotifications: number;
//     closingThisWeek: number;
//     learningScore: number;
//   };
//   modules: DashboardModule[];
//   performanceData: Array<{ month: string; score: number }>;
//   upcomingActivities: DashboardActivity[];
// }

// // ─── Pulse dot ────────────────────────────────────────────────────────────────
// const PulseDot = ({ color = "#10b981" }: { color?: string }) => (
//   <span className="relative flex h-2 w-2">
//     <span
//       className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
//       style={{ backgroundColor: color }}
//     />
//     <span
//       className="relative inline-flex h-2 w-2 rounded-full"
//       style={{ backgroundColor: color }}
//     />
//   </span>
// );

// // ─── Section header (matches admin card headers) ─────────────────────────────
// const SectionHeader = ({
//   eyebrow,
//   title,
//   sub,
//   icon,
//   iconColor = "#2563eb",
// }: {
//   eyebrow: string;
//   title: string;
//   sub?: string;
//   icon: IconName;
//   iconColor?: string;
// }) => (
//   <div className="flex items-start justify-between">
//     <div>
//       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//         {eyebrow}
//       </p>
//       <h2 className="mt-0.5 flex items-center gap-2 text-lg font-black text-slate-900">
//         <span style={{ color: iconColor }}>
//           <Icon name={icon} className="h-4 w-4" />
//         </span>
//         {title}
//       </h2>
//       {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
//     </div>
//     <span className="flex-shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-100">
//       AI
//     </span>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════
// // FEATURE 1 — AI Smart Study Planner
// // ═══════════════════════════════════════════════════════════════════════════
// export const AIStudyPlanner = () => {
//   const { context } = useStudentProfile();
//   const [loading, setLoading] = useState(false);
//   const [plan, setPlan] = useState<StudyDay[] | null>(null);
//   const [error, setError] = useState("");
//   const [generated, setGenerated] = useState(false);

//   const generatePlan = async () => {
//     setLoading(true);
//     setError("");
//     setPlan(null);
//     try {
//       const response = await studentApi.generateStudyPlan(context);

//       const plan = unwrapData<StudyDay[]>(response);

//       setPlan(plan);
//       setGenerated(true);
//     } catch (error) {
//       setError(getApiErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <SectionHeader
//         eyebrow="Study Planner"
//         title="AI Smart Study Planner"
//         icon="calendar"
//         iconColor="#8b5cf6"
//       />

//       {!generated && !loading && (
//         <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
//           <div>
//             <p className="text-xs font-bold text-slate-700">
//               Generate your weekly study plan
//             </p>
//             <p className="mt-0.5 text-[11px] text-slate-400">
//               AI-powered schedule based on your weak areas & deadlines
//             </p>
//           </div>
//           <button
//             onClick={generatePlan}
//             className="ml-3 flex-shrink-0 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
//           >
//             Generate
//           </button>
//         </div>
//       )}

//       {loading && (
//         <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
//           <Icon
//             name="refresh"
//             className="h-4 w-4 flex-shrink-0 animate-spin text-purple-500"
//           />
//           <p className="text-xs text-slate-500">Creating your study plan…</p>
//         </div>
//       )}

//       {error && (
//         <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
//           <Icon name="alert" className="h-3.5 w-3.5" />
//           {error}
//         </div>
//       )}

//       {plan && (
//         <div className="mt-4 space-y-4">
//           {plan.map((day) => (
//             <div
//               key={day.day}
//               className="rounded-xl border border-slate-100 bg-slate-50 p-4"
//             >
//               <p className="text-xs font-bold text-slate-700">{day.day}</p>
//               <ul className="mt-2 space-y-1.5">
//                 {day.tasks.map((task, i) => (
//                   <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
//                     <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-[9px] font-bold text-purple-700">
//                       {i + 1}
//                     </span>
//                     {task}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//           <button
//             onClick={generatePlan}
//             className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
//           >
//             <Icon name="refresh" className="h-3 w-3" />
//             Regenerate plan
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // FEATURE 2 — AI Placement Readiness Analyzer
// // ═══════════════════════════════════════════════════════════════════════════
// export const AIProfileAnalyzer = () => {
//   const { context } = useStudentProfile();
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<ProfileResult | null>(null);
//   const [error, setError] = useState("");
//   const [analyzed, setAnalyzed] = useState(false);

//   const analyzeProfile = async () => {
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const response = await studentApi.placementAnalysis(context);

//       const result = unwrapData<ProfileResult>(response);

//       setResult(result);
//       setAnalyzed(true);
//     } catch (error) {
//       setError(getApiErrorMessage(error));
//     } finally {
//       setLoading(false);
//     } 
//   };


//   const scoreColor = result
//     ? result.score >= 75
//       ? "#10b981"
//       : result.score >= 50
//         ? "#f59e0b"
//         : "#ef4444"
//     : "#2563eb";
//   const circumference = 2 * Math.PI * 28;

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <SectionHeader
//         eyebrow="Readiness Check"
//         title="AI Placement Readiness Analyzer"
//         icon="target"
//         iconColor="#10b981"
//       />

//       {!analyzed && !loading && (
//         <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
//           <div>
//             <p className="text-xs font-bold text-slate-700">
//               Analyze your placement readiness
//             </p>
//             <p className="mt-0.5 text-[11px] text-slate-400">
//               Get strengths, skill gaps & top priority action
//             </p>
//           </div>
//           <button
//             onClick={analyzeProfile}
//             className="ml-3 flex-shrink-0 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
//           >
//             Analyze now
//           </button>
//         </div>
//       )}

//       {loading && (
//         <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
//           <Icon
//             name="refresh"
//             className="h-4 w-4 flex-shrink-0 animate-spin text-emerald-500"
//           />
//           <p className="text-xs text-slate-500">Analyzing your profile…</p>
//         </div>
//       )}

//       {error && (
//         <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
//           <Icon name="alert" className="h-3.5 w-3.5" />
//           {error}
//         </div>
//       )}

//       {result && (
//         <div className="mt-4 flex flex-col gap-6 sm:flex-row">
//           <div className="flex flex-shrink-0 flex-col items-center justify-center">
//             <svg width="72" height="72" viewBox="0 0 72 72">
//               <circle
//                 cx="36"
//                 cy="36"
//                 r="28"
//                 fill="none"
//                 stroke="#f1f5f9"
//                 strokeWidth="6"
//               />
//               <circle
//                 cx="36"
//                 cy="36"
//                 r="28"
//                 fill="none"
//                 stroke={scoreColor}
//                 strokeWidth="6"
//                 strokeLinecap="round"
//                 strokeDasharray={circumference}
//                 strokeDashoffset={
//                   circumference - (circumference * result.score) / 100
//                 }
//                 transform="rotate(-90 36 36)"
//               />
//             </svg>
//             <p className="-mt-12 text-2xl font-black" style={{ color: scoreColor }}>
//               {result.score}
//             </p>
//             <p className="mt-8 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//               Readiness
//             </p>
//           </div>

//           <div className="flex-1 space-y-4">
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Strengths
//               </p>
//               <div className="space-y-1.5">
//                 {result.strengths.map((s, i) => (
//                   <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
//                     <Icon name="check" className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
//                     {s}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Skill gaps
//               </p>
//               <div className="space-y-1.5">
//                 {result.gaps.map((g, i) => (
//                   <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
//                     <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
//                     {g}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
//               <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
//                 Top priority
//               </p>
//               <p className="text-xs font-medium text-blue-700">{result.tip}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {analyzed && !loading && (
//         <button
//           onClick={analyzeProfile}
//           className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
//         >
//           <Icon name="refresh" className="h-3 w-3" />
//           Re-analyze profile
//         </button>
//       )}
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // FEATURE 3 — AI ATS Resume Scorer
// // ═══════════════════════════════════════════════════════════════════════════
// export const AIATSScorer = () => {
//   const [fileName, setFileName] = useState("");
//   const [fileContent, setFileContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<ATSResult | null>(null);
//   const [error, setError] = useState("");
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const processFile = (file: File) => {
//     setFileName(file.name);
//     setError("");
//     const reader = new FileReader();
//     reader.onload = (e) => setFileContent((e.target?.result as string) || "");
//     reader.readAsText(file);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) processFile(file);
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) processFile(file);
//   };

//   const analyze = async () => {
//     if (!fileName) return;
//     setLoading(true);
//     setError("");
//     setResult(null);
//     const resumeText = fileContent
//       ? fileContent.slice(0, 3000)
//       : `No extractable text — filename: ${fileName}`;
//     try {
//       const response = await studentApi.atsScore(resumeText);

//       const result = unwrapData<ATSResult>(response);

//       setResult(result);
//     } catch (error) {
//       setError(getApiErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setFileName("");
//     setFileContent("");
//     setResult(null);
//     setError("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const scoreHex = (s: number) =>
//     s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444";
//   const scoreTag = (s: number) =>
//     s >= 75
//       ? { label: "ATS Friendly", cls: "bg-emerald-50 text-emerald-700 ring-emerald-100" }
//       : s >= 50
//         ? { label: "Needs Improvement", cls: "bg-amber-50 text-amber-700 ring-amber-100" }
//         : { label: "Low ATS Score", cls: "bg-rose-50 text-rose-700 ring-rose-100" };

//   const circumference = 2 * Math.PI * 32;

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <SectionHeader
//         eyebrow="Resume Intelligence"
//         title="AI ATS Resume Scorer"
//         icon="resume"
//         iconColor="#f59e0b"
//       />

//       {!loading && !result && (
//         <>
//           <div
//             onClick={() => fileInputRef.current?.click()}
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//             className={`mt-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
//               isDragging
//                 ? "border-amber-400 bg-amber-50"
//                 : fileName
//                   ? "border-emerald-300 bg-emerald-50"
//                   : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50"
//             }`}
//           >
//             <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
//               <Icon
//                 name="upload"
//                 className={`h-4 w-4 ${fileName ? "text-emerald-500" : "text-slate-400"}`}
//               />
//             </div>
//             {fileName ? (
//               <>
//                 <p className="text-xs font-bold text-emerald-700">{fileName}</p>
//                 <p className="mt-1 text-[11px] text-slate-400">Click to replace</p>
//               </>
//             ) : (
//               <>
//                 <p className="text-xs font-bold text-slate-700">
//                   Drop your resume here or click to browse
//                 </p>
//                 <p className="mt-1 text-[11px] text-slate-400">
//                   PDF, TXT, DOC · Max 5 MB
//                 </p>
//               </>
//             )}
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".pdf,.txt,.doc,.docx"
//             className="hidden"
//             onChange={handleFileInput}
//           />

//           <button
//             onClick={analyze}
//             disabled={!fileName}
//             className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <Icon name="sparkles" className="h-3.5 w-3.5" />
//             Analyze resume
//           </button>

//           {error && (
//             <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
//               <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0" />
//               {error}
//             </div>
//           )}
//         </>
//       )}

//       {loading && (
//         <div className="mt-4 flex flex-col items-center gap-2 py-8">
//           <Icon name="refresh" className="h-5 w-5 animate-spin text-amber-500" />
//           <p className="text-xs text-slate-400">
//             Analyzing your resume against ATS criteria…
//           </p>
//         </div>
//       )}

//       {result && (
//         <div className="mt-4 space-y-5">
//           <div className="flex items-center gap-5">
//             <div className="relative h-20 w-20 flex-shrink-0">
//               <svg width="80" height="80" viewBox="0 0 80 80">
//                 <circle
//                   cx="40"
//                   cy="40"
//                   r="32"
//                   fill="none"
//                   stroke="#f1f5f9"
//                   strokeWidth="7"
//                 />
//                 <circle
//                   cx="40"
//                   cy="40"
//                   r="32"
//                   fill="none"
//                   stroke={scoreHex(result.score)}
//                   strokeWidth="7"
//                   strokeLinecap="round"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={
//                     circumference - (circumference * result.score) / 100
//                   }
//                   transform="rotate(-90 40 40)"
//                 />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-xl font-black" style={{ color: scoreHex(result.score) }}>
//                   {result.score}
//                 </span>
//                 <span className="text-[9px] text-slate-400">/ 100</span>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm font-bold text-slate-900">{result.title}</p>
//               <p className="mt-0.5 text-xs text-slate-500">{result.description}</p>
//               <span
//                 className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${scoreTag(result.score).cls}`}
//               >
//                 {scoreTag(result.score).label}
//               </span>
//             </div>
//           </div>

//           <div>
//             <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//               Score breakdown
//             </p>
//             <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
//               {result.breakdown.map((item, i) => (
//                 <div key={i}>
//                   <div className="mb-1 flex justify-between">
//                     <span className="text-[11px] text-slate-600">{item.label}</span>
//                     <span className="text-[11px] font-bold text-slate-700">
//                       {item.score}%
//                     </span>
//                   </div>
//                   <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-1.5 rounded-full transition-all duration-500"
//                       style={{
//                         width: `${item.score}%`,
//                         background: scoreHex(item.score),
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Keywords found
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {result.keywords_found.map((k, i) => (
//                   <span
//                     key={i}
//                     className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100"
//                   >
//                     {k}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Keywords missing
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {result.keywords_missing.map((k, i) => (
//                   <span
//                     key={i}
//                     className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-100"
//                   >
//                     {k}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3">
//             <Icon name="lightbulb" className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
//             <div>
//               <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
//                 Top recommendation
//               </p>
//               <p className="text-xs text-blue-700">{result.tip}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
//             <Icon name="eye" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
//             <p className="text-[11px] text-slate-400">
//               This score is visible to <span className="font-semibold text-slate-500">you</span>,{" "}
//               <span className="font-semibold text-slate-500">recruiters</span>, and{" "}
//               <span className="font-semibold text-slate-500">admins</span> reviewing your profile.
//             </p>
//           </div>

//           <button
//             onClick={reset}
//             className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
//           >
//             <Icon name="refresh" className="h-3 w-3" />
//             Score another resume
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // FEATURE 4 — AI Job Skills & Gap Analysis Matching
// // ═══════════════════════════════════════════════════════════════════════════
// export const AISkillGapAnalyzer = () => {
//   const { context } = useStudentProfile();
//   const [role, setRole] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<SkillGapResult | null>(null);
//   const [error, setError] = useState("");

//   const analyze = async (targetRole?: string) => {
//     const roleToUse = (targetRole ?? role).trim();
//     if (!roleToUse) return;
//     setRole(roleToUse);
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const response = await studentApi.skillGap(
//         context,
//         roleToUse
//       );

//       const result = unwrapData<SkillGapResult>(response);

//       setResult(result);
//     } catch (error) {
//       setError(getApiErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setResult(null);
//     setError("");
//     setRole("");
//   };

//   const scoreHex = result
//     ? result.match_score >= 75
//       ? "#10b981"
//       : result.match_score >= 50
//         ? "#f59e0b"
//         : "#ef4444"
//     : "#2563eb";
//   const circumference = 2 * Math.PI * 28;

//   const priorityCls = (p: string) =>
//     p === "High"
//       ? "bg-rose-50 text-rose-700 ring-rose-100"
//       : p === "Medium"
//         ? "bg-amber-50 text-amber-700 ring-amber-100"
//         : "bg-slate-100 text-slate-600 ring-slate-200";

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <SectionHeader
//         eyebrow="Job Matching"
//         title="AI Job Skills & Gap Analysis"
//         icon="target"
//         iconColor="#f43f5e"
//       />

//       {!result && !loading && (
//         <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
//           <div className="mb-3 flex items-center gap-2">
//             <Icon name="briefcase" className="h-3.5 w-3.5 text-slate-400" />
//             <p className="text-xs font-bold text-slate-700">
//               Enter a target job role
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && analyze()}
//               placeholder="e.g. Frontend Developer"
//               className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
//             />
//             <button
//               onClick={() => analyze()}
//               disabled={!role.trim()}
//               className="flex-shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               Analyze
//             </button>
//           </div>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {popularRoles.map((r) => (
//               <button
//                 key={r}
//                 onClick={() => analyze(r)}
//                 className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
//               >
//                 {r}
//               </button>
//             ))}
//           </div>
//           {error && (
//             <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
//               <Icon name="alert" className="h-3.5 w-3.5 flex-shrink-0" />
//               {error}
//             </div>
//           )}
//         </div>
//       )}

//       {loading && (
//         <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
//           <Icon
//             name="refresh"
//             className="h-4 w-4 flex-shrink-0 animate-spin text-rose-500"
//           />
//           <p className="text-xs text-slate-500">
//             Matching your skills against {role}…
//           </p>
//         </div>
//       )}

//       {result && (
//         <div className="mt-4 space-y-5">
//           <div className="flex items-center gap-5">
//             <div className="relative h-[72px] w-[72px] flex-shrink-0">
//               <svg width="72" height="72" viewBox="0 0 72 72">
//                 <circle
//                   cx="36"
//                   cy="36"
//                   r="28"
//                   fill="none"
//                   stroke="#f1f5f9"
//                   strokeWidth="6"
//                 />
//                 <circle
//                   cx="36"
//                   cy="36"
//                   r="28"
//                   fill="none"
//                   stroke={scoreHex}
//                   strokeWidth="6"
//                   strokeLinecap="round"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={
//                     circumference - (circumference * result.match_score) / 100
//                   }
//                   transform="rotate(-90 36 36)"
//                 />
//               </svg>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-lg font-black" style={{ color: scoreHex }}>
//                   {result.match_score}%
//                 </span>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm font-bold text-slate-900">{result.role}</p>
//               <p className="mt-0.5 text-xs text-slate-500">{result.summary}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Matched skills
//               </p>
//               <div className="flex flex-wrap gap-1.5">
//                 {result.matched_skills.map((s, i) => (
//                   <span
//                     key={i}
//                     className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100"
//                   >
//                     <Icon name="check" className="h-3 w-3" />
//                     {s}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Skill gaps
//               </p>
//               <div className="flex flex-col gap-1.5">
//                 {result.missing_skills.map((m, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px]"
//                   >
//                     <span className="text-slate-700">{m.skill}</span>
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${priorityCls(m.priority)}`}
//                     >
//                       {m.priority}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
//               Suggested modules to close the gap
//             </p>
//             <div className="flex flex-wrap gap-1.5">
//               {result.suggested_modules.map((m, i) => (
//                 <span
//                   key={i}
//                   className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
//                 >
//                   {m}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="flex gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3">
//             <Icon name="lightbulb" className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
//             <div>
//               <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">
//                 Top recommendation
//               </p>
//               <p className="text-xs text-rose-700">{result.tip}</p>
//             </div>
//           </div>

//           <button
//             onClick={reset}
//             className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
//           >
//             <Icon name="refresh" className="h-3 w-3" />
//             Check another role
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const BadgesSection = () => {
//   const badges = [
//     {
//       title: "React Expert",
//       icon: "⚛️",
//       color: "from-blue-500 to-cyan-500",
//       earned: true,
//     },
//     {
//       title: "SQL Master",
//       icon: "🗄️",
//       color: "from-emerald-500 to-green-500",
//       earned: true,
//     },
//     {
//       title: "DSA Warrior",
//       icon: "⚔️",
//       color: "from-purple-500 to-indigo-500",
//       earned: true,
//     },
//     {
//       title: "Placement Ready",
//       icon: "🎯",
//       color: "from-orange-500 to-red-500",
//       earned: false,
//     },
//     {
//       title: "Top Performer",
//       icon: "🏆",
//       color: "from-yellow-400 to-orange-500",
//       earned: false,
//     },
//     {
//       title: "100 Day Streak",
//       icon: "🔥",
//       color: "from-pink-500 to-red-500",
//       earned: false,
//     },
//   ];

//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//             Achievements
//           </p>
//           <h2 className="mt-1 text-xl font-black text-slate-900">
//             🏅 Badges & Achievements
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Unlock badges as you progress through your learning journey.
//           </p>
//         </div>
//         <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
//           3 / 6 Earned
//         </span>
//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
//         {badges.map((badge, index) => (
//           <div
//             key={index}
//             className={`rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
//               badge.earned
//                 ? "border-slate-200 bg-white"
//                 : "border-dashed border-slate-200 bg-slate-50 opacity-60"
//             }`}
//           >
//             <div
//               className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-3xl shadow-lg`}
//             >
//               {badge.icon}
//             </div>
//             <h3 className="mt-4 text-sm font-bold text-slate-900">
//               {badge.title}
//             </h3>
//             <p
//               className={`mt-2 text-xs font-semibold ${
//                 badge.earned ? "text-emerald-600" : "text-slate-400"
//               }`}
//             >
//               {badge.earned ? "Unlocked" : "Locked"}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // FEATURE 5 — Daily Streak
// // ═══════════════════════════════════════════════════════════════════════════
// const DailyStreak = () => (
//   <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//           Productivity
//         </p>
//         <h2 className="mt-0.5 text-lg font-black text-slate-900">
//           Daily Streak
//         </h2>
//       </div>
//       <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
//         <Icon name="zap" className="h-4 w-4 text-orange-500" />
//       </div>
//     </div>

//     <div className="mt-4 grid gap-3 sm:grid-cols-2">
//       <div className="rounded-xl border border-slate-100 bg-orange-50/60 p-4">
//         <p className="text-[11px] font-semibold text-slate-500">Daily Streak</p>
//         <p className="mt-1.5 text-2xl font-black text-orange-600">🔥 12 days</p>
//       </div>
//       <div className="rounded-xl border border-slate-100 bg-blue-50/60 p-4">
//         <p className="text-[11px] font-semibold text-slate-500">Current project</p>
//         <p className="mt-1.5 text-base font-bold text-slate-900">
//           AI Resume Analyzer
//         </p>
//       </div>
//     </div>

//     <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
//       <div className="flex items-center justify-between text-xs">
//         <span className="text-slate-500">Today&apos;s goal</span>
//         <span className="font-semibold text-slate-700">
//           Complete Module 4
//         </span>
//       </div>
//       <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
//         <span>Progress</span>
//         <span>2 / 3 tasks completed</span>
//       </div>
//       <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
//         <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-blue-500" />
//       </div>
//     </div>

//     <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
//       <div>
//         <p className="text-xs font-bold text-slate-900">XP earned today</p>
//         <p className="mt-0.5 text-[11px] text-slate-500">Keep your streak alive</p>
//       </div>
//       <p className="text-2xl font-black text-emerald-600">+18 XP</p>
//     </div>
//   </section>
// );

// // ═══════════════════════════════════════════════════════════════════════════
// // AI Career Coach — Chat Drawer (matches Admin's AIChatPanel)
// // ═══════════════════════════════════════════════════════════════════════════
// const AICareerCoachPanel = ({ onClose }: { onClose: () => void }) => {
//   const { firstName, context } = useStudentProfile();
//   const [messages, setMessages] = useState<
//     { role: "user" | "assistant"; text: string }[]
//   >([
//     {
//       role: "assistant",
//       text: `Hi ${firstName}! I'm your AI Career Coach. I know your profile — ask me anything about placements, interviews, or your learning path.`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const send = async (text?: string) => {
//     const userText = text ?? input.trim();
//     if (!userText) return;
//     setInput("");
//     const history = [...messages, { role: "user" as const, text: userText }];
//     setMessages(history);
//     setLoading(true);
//     try {
//       const response = await studentApi.careerCoach(
//         userText,
//         context
//       );
//       const result = unwrapData<{ answer?: string } | string>(response);
//       const answer = typeof result === "string" ? result : result.answer || "I couldn't generate a response right now.";

//       setMessages((current) => [...current, { role: "assistant", text: answer }]);
//     } catch (error) {
//       setMessages((current) => [
//         ...current,
//         { role: "assistant", text: getApiErrorMessage(error) },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-full flex-col">
//       <div className="flex items-center justify-between border-b border-slate-800 p-4">
//         <div className="flex items-center gap-2.5">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
//             <Icon name="ai-brain" className="h-4 w-4 text-blue-400" />
//           </div>
//           <div>
//             <p className="text-sm font-bold text-white">AI Career Coach</p>
//             <div className="flex items-center gap-1.5">
//               <PulseDot color="#10b981" />
//               <span className="text-[10px] text-emerald-400">Online</span>
//             </div>
//           </div>
//         </div>
//         <button
//           onClick={onClose}
//           className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
//         >
//           <Icon name="close" className="h-4 w-4" />
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-1.5 border-b border-slate-800 p-3">
//         {aiCoachTopics.map((t) => (
//           <button
//             key={t}
//             onClick={() => send(t)}
//             className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-semibold text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 space-y-3 overflow-y-auto p-4">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//           >
//             {m.role === "assistant" && (
//               <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
//                 <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
//               </div>
//             )}
//             <div
//               className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
//                 m.role === "user"
//                   ? "rounded-tr-sm bg-blue-600 text-white"
//                   : "rounded-tl-sm bg-slate-800 text-slate-200"
//               }`}
//             >
//               {m.text}
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div className="flex justify-start">
//             <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
//               <Icon name="sparkles" className="h-3 w-3 text-blue-400" />
//             </div>
//             <div className="rounded-2xl rounded-tl-sm bg-slate-800 px-4 py-3">
//               <span className="flex gap-1">
//                 {[0, 1, 2].map((d) => (
//                   <span
//                     key={d}
//                     className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400"
//                     style={{ animationDelay: `${d * 0.15}s` }}
//                   />
//                 ))}
//               </span>
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       <div className="border-t border-slate-800 p-3">
//         <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2">
//           <input
//             className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
//             placeholder="Ask your career coach…"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
//           />
//           <button
//             onClick={() => send()}
//             className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-40"
//             disabled={loading || !input.trim()}
//           >
//             <Icon name="send" className="h-3.5 w-3.5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // MAIN DASHBOARD
// // ═══════════════════════════════════════════════════════════════════════════
// export const StudentDashboard = () => {
//   const { fullName, firstName, initials, email, phone, currentUser } = useStudentProfile();
//   const [aiOpen, setAiOpen] = useState(false);
//   const [dashboard, setDashboard] = useState<DashboardData | null>(null);
//   const [dashboardLoading, setDashboardLoading] = useState(true);
//   const [dashboardError, setDashboardError] = useState("");

//   useEffect(() => {
//     let mounted = true;

//     const loadDashboard = async () => {
//       setDashboardLoading(true);
//       setDashboardError("");

//       try {
//         const response = await studentApi.getDashboard();
//         if (mounted) {
//           setDashboard(unwrapData<DashboardData>(response));
//         }
//       } catch (error) {
//         if (mounted) {
//           setDashboardError(getApiErrorMessage(error));
//           setDashboard(null);
//         }
//       } finally {
//         if (mounted) {
//           setDashboardLoading(false);
//         }
//       }
//     };

//     loadDashboard();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const profile = dashboard?.profile || currentUser;
//   const semesterLabel = profile?.semester ? `Semester ${profile.semester}` : "Semester not added";
//   const branchLabel = profile?.branch || "Branch not added";
//   const roleLine = [branchLabel, semesterLabel].filter(Boolean).join(" · ");
//   const learningScore = dashboard?.stats.learningScore ?? 0;
//   const modules = dashboard?.modules ?? [];
//   const performanceData = dashboard?.performanceData ?? [];
//   const upcomingActivities = dashboard?.upcomingActivities ?? [];
//   const stats = [
//     {
//       label: "Registered courses",
//       value: String(dashboard?.stats.registeredCourses ?? 0),
//       change: String(dashboard?.stats.registeredCourses ?? 0),
//       up: true,
//       icon: "book" as IconName,
//       bg: "#eff6ff",
//     },
//     {
//       label: "Completed",
//       value: String(dashboard?.stats.completed ?? 0),
//       change: String(dashboard?.stats.completed ?? 0),
//       up: true,
//       icon: "check" as IconName,
//       bg: "#ecfdf5",
//     },
//     {
//       label: "Pending",
//       value: String(dashboard?.stats.pending ?? 0),
//       change: String(dashboard?.stats.pending ?? 0),
//       up: false,
//       icon: "clock" as IconName,
//       bg: "#fffbeb",
//     },
//     {
//       label: "Certificates",
//       value: String(dashboard?.stats.certificates ?? 0),
//       change: String(dashboard?.stats.certificates ?? 0),
//       up: true,
//       icon: "award" as IconName,
//       bg: "#f5f3ff",
//     },
//   ];

//   return (
//     <StudentLayout
//       sidebarItems={sidebarItems}
//       sidebarHighlight="Dashboard"
//       userSummary={{
//         fullName,
//         role: roleLine,
//         status: "Placement track active",
//       }}
//       stats={{
//         label: "Overall progress",
//         value: String(learningScore),
//         subtitle: semesterLabel,
//         accent: semesterLabel,
//       }}
//       showAiButton
//       onAiButtonClick={() => setAiOpen(true)}
//     >
//       <>
//         {dashboardError && (
//           <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
//             {dashboardError}
//           </div>
//         )}

//         {dashboardLoading && (
//           <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
//             Loading dashboard data...
//           </div>
//         )}

//         {/* Hero banner */}
//         <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
//           <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
//           <div className="relative grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
//             <div>
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
//                 <Icon name="sparkles" className="h-3 w-3" />
//                 AI-powered career workspace
//               </span>
//               <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
//                 Welcome back, {firstName}
//               </h1>
//               <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
//                 Track your courses, placement readiness, and AI-powered career tools — all in one place.
//               </p>
//               <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
//                 <div className="flex items-center gap-2">
//                   <Icon name="lightbulb" className="h-4 w-4 text-blue-600" />
//                   <h3 className="text-sm font-bold text-slate-900">
//                     AI Career Suggestions
//                   </h3>
//                 </div>
//                 <ul className="mt-3 space-y-2 text-sm text-slate-600">
//                   <li>• Update your resume after completing every new project.</li>
//                   <li>• Apply to at least 3 internships every week to improve your chances.</li>
//                   <li>• Keep your GitHub active with regular commits and deployments.</li>
//                 </ul>
//               </div>
//             </div>

//             <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
//               <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                   Today at a glance
//                 </p>
//                 <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
//                   <PulseDot color="#10b981" />
//                   Live
//                 </span>
//               </div>
//               <div className="mt-3 grid grid-cols-2 gap-2">
//                 {[
//                   { label: "Registered", value: String(dashboard?.stats.registeredCourses ?? 0) },
//                   { label: "Completed", value: String(dashboard?.stats.completed ?? 0) },
//                   { label: "Pending", value: String(dashboard?.stats.pending ?? 0) },
//                   { label: "Certificates", value: String(dashboard?.stats.certificates ?? 0) },
//                 ].map((m) => (
//                   <div
//                     key={m.label}
//                     className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200"
//                   >
//                     <p className="text-[10px] font-semibold text-slate-400">
//                       {m.label}
//                     </p>
//                     <p className="mt-0.5 text-xl font-black text-slate-900">
//                       {m.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
//                 <div className="flex items-center justify-between text-[11px] font-semibold">
//                   <span className="text-slate-500">Learning score</span>
//                   <span className="text-blue-700">{learningScore}%</span>
//                 </div>
//                 <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
//                     style={{ width: `${learningScore}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           {stats.map((s) => (
//             <article
//               key={s.label}
//               className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//             >
//               <div className="flex items-start justify-between">
//                 <div
//                   className="flex h-10 w-10 items-center justify-center rounded-xl"
//                   style={{ background: s.bg }}
//                 >
//                   <Icon name={s.icon} className="h-4.5 w-4.5 text-slate-700" />
//                 </div>
//                 <span
//                   className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                     s.up
//                       ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
//                       : "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
//                   }`}
//                 >
//                   <Icon name={s.up ? "arrow-up" : "arrow-down"} className="h-3 w-3" />
//                   {s.change}
//                 </span>
//               </div>
//               <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
//                 {s.label}
//               </p>
//               <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">
//                 {s.value}
//               </p>
//             </article>
//           ))}
//         </div>

//         {/* Profile card + Performance chart */}
//         <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
//           <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-black text-white shadow-inner">
//                 {initials}
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-base font-black leading-tight text-slate-900">
//                     {fullName}
//                   </h2>
//                   <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
//                     {profile?.id ? String(profile.id).slice(-6).toUpperCase() : "STUDENT"}
//                   </span>
//                 </div>
//                 <p className="mt-0.5 text-xs text-slate-500">
//                   {roleLine}
//                 </p>
//               </div>
//             </div>
//             <div className="mt-5 space-y-3.5 border-t border-slate-100 pt-4">
//               {[
//                 { icon: "mail" as IconName, label: "Email", value: email },
//                 { icon: "phone" as IconName, label: "Phone", value: phone },
//                 {
//                   icon: "graduation" as IconName,
//                   label: "College",
//                   value: String(profile?.college || "Not added"),
//                 },
//                 { icon: "calendar" as IconName, label: "Semester", value: semesterLabel },
//               ].map((f) => (
//                 <div key={f.label} className="flex items-center gap-3 text-xs">
//                   <Icon name={f.icon} className="h-4 w-4 flex-shrink-0 text-slate-400" />
//                   <div>
//                     <p className="text-slate-400">{f.label}</p>
//                     <p className="font-semibold text-slate-700">{f.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                   Learning Analytics
//                 </p>
//                 <h2 className="mt-0.5 text-lg font-black text-slate-900">
//                   Performance overview
//                 </h2>
//               </div>
//               <Icon name="chart" className="h-4 w-4 text-slate-300" />
//             </div>
//             <div className="mt-4 w-full" style={{ height: 220 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart
//                   data={performanceData}
//                   margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//                 >
//                   <defs>
//                     <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
//                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f1f5f9"
//                   />
//                   <XAxis
//                     dataKey="month"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 11 }}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 11 }}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#0f172a",
//                       borderRadius: "8px",
//                       border: "none",
//                       color: "#f8fafc",
//                       fontSize: "12px",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="score"
//                     stroke="#2563eb"
//                     strokeWidth={2}
//                     fillOpacity={1}
//                     fill="url(#scoreColor)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </section>
//         </div>

//         {/* Daily streak */}
//         <DailyStreak />
//         {/* Global Rank */}
//         <BadgesSection />
//         {/* AI feature grid */}
//         <div className="grid gap-5 xl:grid-cols-2">
//           {/* <AIStudyPlanner /> */}
//           {/* <AIProfileAnalyzer /> */}
//         </div>
//         <div className="grid gap-5 xl:grid-cols-2">
//           {/* <AIATSScorer /> */}
//           {/* <AISkillGapAnalyzer /> */}
//         </div>

//         {/* Modules & progress */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Course Tracking
//               </p>
//               <h2 className="mt-0.5 text-lg font-black text-slate-900">
//                 Modules & learning progress
//               </h2>
//             </div>
//             <Icon name="book" className="h-4 w-4 text-slate-300" />
//           </div>
//           <div className="mt-4 grid gap-4 sm:grid-cols-2">
//             {modules.length === 0 && !dashboardLoading ? (
//               <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 sm:col-span-2">
//                 No learning modules found yet.
//               </div>
//             ) : modules.map((mod, i) => (
//               <div
//                 key={i}
//                 className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200"
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-[13px] font-bold text-slate-900">
//                       {mod.title}
//                     </h3>
//                     <p className="mt-0.5 text-[10px] text-slate-400">
//                       {mod.category}
//                     </p>
//                   </div>
//                   <span className="text-xs font-black text-slate-700">
//                     {mod.progress}%
//                   </span>
//                 </div>
//                 <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
//                   <div
//                     className="h-2 rounded-full transition-all duration-500"
//                     style={{ width: `${mod.progress}%`, background: mod.color }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Roadmap + Upcoming activities */}
//         <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
//           <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
//                   Career Path
//                 </p>
//                 <h2 className="mt-0.5 text-lg font-black">Roadmap to placement</h2>
//               </div>
//               <Icon name="target" className="h-5 w-5 text-blue-400" />
//             </div>
//             <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
//               {roadmapSteps.map((s) => (
//                 <div key={s.step} className="rounded-xl border border-white/10 bg-white/5 p-3">
//                   <div className="flex items-center justify-between">
//                     <Icon name={s.icon} className="h-4 w-4 text-blue-300" />
//                     <span className="text-[9px] font-mono font-bold text-slate-500">
//                       {s.step}
//                     </span>
//                   </div>
//                   <p className="mt-2 text-[11px] font-bold text-white">{s.title}</p>
//                   <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
//                     {s.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                   Schedule
//                 </p>
//                 <h2 className="mt-0.5 text-lg font-black text-slate-900">
//                   Upcoming activities
//                 </h2>
//               </div>
//               <Icon name="clock" className="h-4 w-4 text-slate-300" />
//             </div>
//             <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
//               {upcomingActivities.length === 0 && !dashboardLoading ? (
//                 <div className="p-6 text-center text-sm font-semibold text-slate-500">
//                   No upcoming activities yet.
//                 </div>
//               ) : upcomingActivities.map((a, i) => {
//                 const toneCls: Record<string, string> = {
//                   High: "bg-rose-50 text-rose-600",
//                   Medium: "bg-amber-50 text-amber-600",
//                   Normal: "bg-blue-50 text-blue-600",
//                   Low: "bg-emerald-50 text-emerald-600",
//                 };
//                 return (
//                   <div
//                     key={a.title}
//                     className={`flex items-start gap-3 p-3.5 ${
//                       i < upcomingActivities.length - 1
//                         ? "border-b border-slate-100"
//                         : ""
//                     } transition hover:bg-slate-50/60`}
//                   >
//                     <div
//                       className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${toneCls[a.tone]}`}
//                     >
//                       <Icon name="calendar" className="h-3.5 w-3.5" />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-[12px] font-bold text-slate-900">
//                         {a.title}
//                       </p>
//                       <p className="mt-0.5 text-[10px] text-slate-400">{a.desc}</p>
//                     </div>
//                     <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
//                       {a.date}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>
//       </>

//       {/* ── AI Chat Drawer ── */}
//       {aiOpen && (
//         <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-start sm:pr-6 sm:pt-[72px]">
//           <div className="pointer-events-auto flex h-[560px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-slate-900/50">
//             <AICareerCoachPanel onClose={() => setAiOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* ── Floating AI button (mobile) ── */}
//       {!aiOpen && (
//         <button
//           onClick={() => setAiOpen(true)}
//           className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-800 sm:hidden"
//         >
//           <Icon name="sparkles" className="h-6 w-6 text-white" />
//         </button>
//       )}
//     </StudentLayout>
//   );
// };

// export default StudentDashboard;
import React from "react";
import {
  Search,
  Bell,
  Zap,
  Star,
  Map,
  FolderCheck,
  Send,
  Sparkles,
  ChevronRight,
  Code2,
  Braces,
  Bookmark,
  Calendar,
  Clock,
  Award,
  Users,
  Settings,
  HelpCircle,
  MessageCircle,
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Radio,
} from "lucide-react";

/**
 * StudentDashboard
 * -----------------
 * Converted 1:1 from the C2C ("Campus2Corporate") student-home Figma export.
 * Built with Tailwind CSS + lucide-react to match the rest of the C2C
 * component library. Fonts assume "Inter" (display) and "Nimbus Sans"
 * (data/labels) are registered in the project's global stylesheet — swap
 * the font-[...] utility classes below if those aren't available.
 */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface SidebarNavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Explore Roadmaps", icon: Map },
  { label: "My Projects", icon: FolderKanban },
  { label: "College Placements", icon: GraduationCap },
  { label: "External Jobs", icon: Briefcase },
  { label: "Broadcasts", icon: Radio },
];

interface LearningCardData {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  title: string;
  nextUp: string;
  progress: number;
  barColor: string;
  active: boolean;
}

const LEARNING_CARDS: LearningCardData[] = [
  {
    id: "full-stack",
    icon: Code2,
    iconBg: "bg-[rgba(84,0,214,0.05)]",
    title: "Full Stack Developer",
    nextUp: "Next: Mastery of Server-Side Rendering in Next.js",
    progress: 72,
    barColor: "bg-[#5400D6]",
    active: true,
  },
  {
    id: "dsa",
    icon: Braces,
    iconBg: "bg-[#F0EDEC]",
    title: "DSA Mastery",
    nextUp: "Next: Big O Notation and Array Manipulations",
    progress: 28,
    barColor: "bg-[#64587F]",
    active: false,
  },
];

interface CourseCardData {
  id: string;
  image: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  lessons: string;
  title: string;
  description: string;
}

const RECOMMENDED_COURSES: CourseCardData[] = [
  {
    id: "modern-ui",
    image: "https://placehold.co/301x160",
    badge: "DESIGN",
    badgeBg: "bg-[rgba(223,208,254,0.50)]",
    badgeText: "text-[#63577E]",
    lessons: "42 Lessons",
    title: "Modern UI Fundamentals",
    description:
      "Master the principles of visual hierarchy, accessibility, and modern\u2026",
  },
  {
    id: "distributed-systems",
    image: "https://placehold.co/301x160",
    badge: "BACKEND",
    badgeBg: "bg-[rgba(84,0,214,0.10)]",
    badgeText: "text-[#5400D6]",
    lessons: "28 Lessons",
    title: "Distributed Systems 101",
    description:
      "An essential guide to understanding scalability, fault tolerance, and\u2026",
  },
];

const FILTER_TAGS = ["Engineering", "Design", "Business"];

interface DeadlineData {
  id: string;
  month: string;
  day: string;
  title: string;
  subtitle: string;
  meta: string;
  variant: "urgent" | "primary" | "neutral";
}

const DEADLINES: DeadlineData[] = [
  {
    id: "stripe-project",
    month: "OCT",
    day: "24",
    title: "Stripe Project Phase 1",
    subtitle: "Submit Documentation",
    meta: "Due in 2 hours",
    variant: "urgent",
  },
  {
    id: "mock-interview",
    month: "OCT",
    day: "26",
    title: "Mock AI Interview",
    subtitle: "Backend Engineering Prep",
    meta: "4:00 PM - 5:00 PM",
    variant: "primary",
  },
  {
    id: "portfolio-review",
    month: "OCT",
    day: "29",
    title: "Portfolio Review",
    subtitle: "Career Coach Session",
    meta: "All day event",
    variant: "neutral",
  },
];

const DEADLINE_STYLES: Record<
  DeadlineData["variant"],
  { border: string; dateBg: string; dateText: string; metaText: string }
> = {
  urgent: {
    border: "border-[#BA1A1A]",
    dateBg: "bg-[#FFDAD6]",
    dateText: "text-[#93000A]",
    metaText: "text-[#BA1A1A]",
  },
  primary: {
    border: "border-[#5400D6]",
    dateBg: "bg-[rgba(84,0,214,0.10)]",
    dateText: "text-[#5400D6]",
    metaText: "text-[#494457]",
  },
  neutral: {
    border: "border-[#CBC3DA]",
    dateBg: "bg-[#F0EDEC]",
    dateText: "text-[#494457]",
    metaText: "text-[#494457]",
  },
};

interface NotificationData {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  meta: string;
  highlighted?: boolean;
}

const NOTIFICATIONS: NotificationData[] = [
  {
    id: "ai-review",
    icon: Sparkles,
    iconBg: "bg-[#5400D6]",
    iconColor: "text-white",
    title: "AI Review is ready!",
    body: 'Your "E-commerce Auth" project has been analyzed.',
    meta: "VIEW FEEDBACK",
    highlighted: true,
  },
  {
    id: "badge",
    icon: Award,
    iconBg: "bg-[#DFD0FE]",
    iconColor: "text-[#5400D6]",
    title: "New Badge Unlocked",
    body: 'You completed the "React Hooks" milestone.',
    meta: "1 HOUR AGO",
  },
  {
    id: "community",
    icon: Users,
    iconBg: "bg-[#F0EDEC]",
    iconColor: "text-[#494457]",
    title: "Community Invite",
    body: 'Sarah requested you to join "Backend Wizards".',
    meta: "YESTERDAY",
  },
];

// ---------------------------------------------------------------------------
// Layout building blocks
// ---------------------------------------------------------------------------

function Sidebar() {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-[#CBC3DA] bg-[#FCF9F8] lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div>
        <div className="px-6 pb-8 pt-8">
          <span className="font-[Inter] text-2xl font-bold text-[#5400D6]">
            C2C
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 text-[13px] font-medium tracking-wide transition-colors ${
                item.active
                  ? "border-l-4 border-[#5400D6] bg-[rgba(84,0,214,0.05)] text-[#5400D6]"
                  : "border-l-4 border-transparent text-[#494457] hover:bg-[#F0EDEC]"
              }`}
            >
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-6">
        <div className="flex flex-col gap-2 rounded-xl bg-[#6D28FF] p-4 shadow-sm">
          <p className="font-[Inter] text-[13px] font-semibold tracking-wide text-[#E3D7FF]">
            Upgrade to Pro
          </p>
          <p className="font-[Nimbus_Sans] text-[11px] leading-[1.6] text-[#E3D7FF]/90">
            Get unlimited access to AI resume reviews and premium career
            roadmaps.
          </p>
          <button
            type="button"
            className="mt-1 rounded-lg bg-white py-2 text-center font-[Inter] text-xs text-[#5400D6] shadow-sm"
          >
            Learn More
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-[#CBC3DA] px-2 pt-6">
          <img
            src="https://placehold.co/40x40"
            alt="Alex Chen avatar"
            className="h-10 w-10 shrink-0 rounded-full bg-[#DFD0FE] object-cover"
          />
          <div className="overflow-hidden">
            <p className="truncate font-[Inter] text-[13px] font-bold tracking-wide text-[#1C1B1B]">
              Alex Chen
            </p>
            <p className="truncate font-[Nimbus_Sans] text-[11px] text-[#494457]">
              Career-Ready Student
            </p>
          </div>
        </div>

        <a
          href="#"
          className="flex items-center gap-3 px-2 py-2 font-[Inter] text-[13px] font-medium tracking-wide text-[#494457] hover:text-[#1C1B1B]"
        >
          <Settings size={20} />
          Settings
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-2 py-2 font-[Inter] text-[13px] font-medium tracking-wide text-[#494457] hover:text-[#1C1B1B]"
        >
          <HelpCircle size={20} />
          Help Center
        </a>
      </div>
    </aside>
  );
}

function TopNavbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#CBC3DA] bg-[#FCF9F8]/70 px-6 py-3 backdrop-blur-md sm:px-10">
      <div className="relative w-full max-w-[672px]">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#494457]"
        />
        <input
          type="text"
          placeholder="Search for roadmaps, projects, or jobs..."
          className="w-full rounded-full border border-[#CBC3DA] bg-[#F6F3F2] py-2.5 pl-11 pr-12 font-[Nimbus_Sans] text-sm text-[#1C1B1B] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#5400D6]/40"
        />
        <Sparkles
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5400D6]/60"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#494457] hover:bg-[#F0EDEC]"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[#FCF9F8] bg-[#BA1A1A]" />
        </button>
        <img
          src="https://placehold.co/30x30"
          alt="Alex Chen avatar"
          className="h-8 w-8 rounded-full border border-[#CBC3DA] bg-[#DFD0FE] object-cover"
        />
      </div>
    </header>
  );
}

function WelcomeBanner() {
  return (
    <section className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-3">
        <h1 className="font-[Inter] text-[28px] font-semibold leading-tight text-[#1C1B1B] sm:text-[32px]">
          Hey Alex Chen, ready to level up today?
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-[rgba(223,208,254,0.50)] bg-[rgba(223,208,254,0.30)] px-3 py-1 font-[Inter] text-xs text-[#5400D6]">
            <Zap size={12} className="fill-[#5400D6]" />
            12 Day Streak
          </span>
          <span className="font-[Inter] text-sm text-[#494457]">
            You&apos;re in the top 5% of active learners this week.
          </span>
        </div>
      </div>

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-[#5400D6] px-6 py-2.5 font-[Inter] text-base text-white shadow-[0_10px_15px_-3px_rgba(84,0,214,0.2),0_4px_6px_-4px_rgba(84,0,214,0.2)]"
      >
        <Zap size={16} className="fill-white" />
        Start Quick Action
      </button>
    </section>
  );
}

function StatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {/* Roadmaps completed */}
      <div className="flex flex-col gap-1 rounded-3xl border border-[rgba(203,195,218,0.50)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-[rgba(84,0,214,0.05)] p-2.5 text-[#5400D6]">
            <Map size={18} />
          </div>
          <span className="rounded-full bg-[rgba(16,185,129,0.06)] px-2.5 py-1 font-[Nimbus_Sans] text-[11px] font-bold text-[#1C1B1B]">
            +4.2%
          </span>
        </div>
        <p className="mt-3 font-[Nimbus_Sans] text-[11px] font-bold uppercase tracking-[1.1px] text-[#494457]">
          Roadmaps Completed
        </p>
        <p className="font-[Nimbus_Sans] text-[28px] font-extrabold leading-tight text-[#1C1B1B]">
          34%
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F0EDEC]">
          <div className="h-1.5 rounded-full bg-[#5400D6]" style={{ width: "34%" }} />
        </div>
      </div>

      {/* Projects uploaded */}
      <div className="flex flex-col gap-1 rounded-3xl border border-[rgba(203,195,218,0.50)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-[rgba(84,0,214,0.05)] p-2.5 text-[#5400D6]">
            <FolderCheck size={18} />
          </div>
          <span className="rounded-full bg-[rgba(84,0,214,0.10)] px-2.5 py-1 font-[Nimbus_Sans] text-[11px] font-bold text-[#5400D6]">
            Milestone
          </span>
        </div>
        <p className="mt-3 font-[Nimbus_Sans] text-[11px] font-bold uppercase tracking-[1.1px] text-[#494457]">
          Projects Uploaded
        </p>
        <p className="font-[Nimbus_Sans] text-[28px] font-extrabold leading-tight text-[#1C1B1B]">
          12
        </p>
        <div className="mt-2 flex gap-1.5">
          {[true, true, true, false].map((filled, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                filled ? "bg-[#5400D6]" : "bg-[#F0EDEC]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Applications sent */}
      <div className="flex flex-col gap-1 rounded-3xl border border-[rgba(203,195,218,0.50)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-[rgba(84,0,214,0.05)] p-2.5 text-[#5400D6]">
            <Send size={18} />
          </div>
          <span className="rounded-full bg-[#F0EDEC] px-2.5 py-1 font-[Nimbus_Sans] text-[11px] font-bold text-[#494457]">
            Pending (3)
          </span>
        </div>
        <p className="mt-3 font-[Nimbus_Sans] text-[11px] font-bold uppercase tracking-[1.1px] text-[#494457]">
          Applications Sent
        </p>
        <p className="font-[Nimbus_Sans] text-[28px] font-extrabold leading-tight text-[#1C1B1B]">
          8
        </p>
        <div className="mt-2 flex items-center">
          <span className="h-7 w-7 rounded-full border-2 border-[#FCF9F8] bg-[#CBC3DA]" />
          <span className="-ml-2 h-7 w-7 rounded-full border-2 border-[#FCF9F8] bg-[rgba(84,0,214,0.20)]" />
          <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#FCF9F8] bg-[#DFD0FE] font-[Nimbus_Sans] text-[10px] font-bold text-[#1C1B1B]">
            +5
          </span>
        </div>
      </div>

      {/* AI reviews received */}
      <div className="flex flex-col gap-1 overflow-hidden rounded-3xl border border-[rgba(203,195,218,0.50)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-[rgba(84,0,214,0.05)] p-2.5 text-[#5400D6]">
            <Sparkles size={18} />
          </div>
          <span className="flex items-center gap-1 font-[Nimbus_Sans] text-xs font-bold text-[#5400D6]">
            <Star size={13} className="fill-[#5400D6]" />
            4.9
          </span>
        </div>
        <p className="mt-3 font-[Nimbus_Sans] text-[11px] font-bold uppercase tracking-[1.1px] text-[#494457]">
          AI Reviews Received
        </p>
        <p className="font-[Nimbus_Sans] text-[28px] font-extrabold leading-tight text-[#1C1B1B]">
          15
        </p>
        <p className="mt-2 font-[Nimbus_Sans] text-xs text-[#494457]">
          Last review: 2h ago
        </p>
      </div>
    </section>
  );
}

function ContinueLearningSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-[Nimbus_Sans] text-2xl font-bold text-[#1C1B1B]">
          Continue Where You Left Off
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 font-[Nimbus_Sans] text-sm font-semibold text-[#5400D6]"
        >
          View all learning
          <ChevronRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {LEARNING_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex flex-col rounded-3xl border border-[rgba(203,195,218,0.50)] bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg}`}>
                <card.icon
                  size={26}
                  className={card.active ? "text-[#5400D6]" : "text-[#494457]"}
                />
              </div>
              <div className="text-right">
                <p
                  className={`font-[Nimbus_Sans] text-2xl font-extrabold ${
                    card.active ? "text-[#5400D6]" : "text-[#494457]"
                  }`}
                >
                  {card.progress}%
                </p>
                <p className="font-[Nimbus_Sans] text-[10px] font-bold uppercase tracking-widest text-[#494457]">
                  Progress
                </p>
              </div>
            </div>

            <h3 className="mt-6 font-[Nimbus_Sans] text-lg font-bold text-[#1C1B1B]">
              {card.title}
            </h3>
            <p className="mb-6 mt-1 font-[Nimbus_Sans] text-sm text-[#494457]">
              {card.nextUp}
            </p>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0EDEC]">
              <div
                className={`h-2 rounded-full ${card.barColor}`}
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecommendedSection() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-[Inter] text-2xl font-semibold text-[#1C1B1B]">
          Recommended For You
        </h2>
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F0EDEC] px-3 py-1 font-[Nimbus_Sans] text-xs font-medium text-[#1C1B1B]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {RECOMMENDED_COURSES.map((course) => (
          <article
            key={course.id}
            className="overflow-hidden rounded-2xl border border-[#CBC3DA]"
          >
            <img
              src={course.image}
              alt={course.title}
              className="h-40 w-full bg-[#F0EDEC] object-cover"
            />
            <div className="flex flex-col gap-2 bg-[#FCF9F8] p-6">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 font-[Nimbus_Sans] text-[10px] font-bold ${course.badgeBg} ${course.badgeText}`}
                >
                  {course.badge}
                </span>
                <span className="font-[Nimbus_Sans] text-[10px] font-medium text-[#494457]">
                  {course.lessons}
                </span>
              </div>
              <h3 className="font-[Inter] text-lg text-[#1C1B1B]">
                {course.title}
              </h3>
              <p className="font-[Inter] text-sm text-[#494457]">
                {course.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <span className="h-7 w-7 rounded-full border-2 border-[#FCF9F8] bg-[#F0EDEC]" />
                  <span className="-ml-2 h-7 w-7 rounded-full border-2 border-[#FCF9F8] bg-[rgba(84,0,214,0.20)]" />
                </div>
                <button
                  type="button"
                  aria-label="Save course"
                  className="rounded-full p-2 text-[#5400D6] hover:bg-[rgba(84,0,214,0.05)]"
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeadlinesPanel() {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-[#F1F0F5] bg-white/70 p-6 shadow-[0_4px_12px_rgba(109,40,255,0.03)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-[Inter] text-xl text-[#1C1B1B]">Upcoming</h2>
        <Calendar size={16} className="text-[#494457]" />
      </div>

      <div className="flex flex-col gap-4">
        {DEADLINES.map((item) => {
          const style = DEADLINE_STYLES[item.variant];
          return (
            <div
              key={item.id}
              className={`flex gap-4 rounded-xl border-l-4 p-3 ${style.border}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${style.dateBg} ${style.dateText}`}
              >
                <span className="font-[Nimbus_Sans] text-[10px] font-bold uppercase">
                  {item.month}
                </span>
                <span className="font-[Nimbus_Sans] text-lg font-extrabold leading-none">
                  {item.day}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-[Inter] text-base font-bold leading-tight text-[#1C1B1B]">
                  {item.title}
                </p>
                <p className="font-[Nimbus_Sans] text-xs text-[#494457]">
                  {item.subtitle}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Clock size={10} className={style.metaText} />
                  <span className={`font-[Nimbus_Sans] text-[11px] font-medium ${style.metaText}`}>
                    {item.meta}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="rounded-lg border border-[#CBC3DA] py-2 text-center font-[Inter] text-base text-[#494457] hover:bg-[#F0EDEC]"
      >
        See Calendar
      </button>
    </section>
  );
}

function NotificationsPanel() {
  return (
    <section className="flex flex-col gap-6 p-2">
      <h2 className="px-4 font-[Inter] text-lg text-[#1C1B1B]">
        Notifications
      </h2>

      <div className="flex flex-col gap-1">
        {NOTIFICATIONS.map((note) => (
          <div
            key={note.id}
            className={`flex gap-3 rounded-2xl p-4 ${
              note.highlighted
                ? "border border-[rgba(84,0,214,0.10)] bg-[rgba(84,0,214,0.05)]"
                : ""
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${note.iconBg}`}
            >
              <note.icon size={15} className={note.iconColor} />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="font-[Nimbus_Sans] text-sm font-medium text-[#1C1B1B]">
                {note.title}
              </p>
              <p className="font-[Nimbus_Sans] text-xs text-[#494457]">
                {note.body}
              </p>
              <p
                className={`mt-1.5 font-[Nimbus_Sans] text-[10px] font-bold uppercase tracking-wide ${
                  note.highlighted ? "text-[#5400D6]" : "text-[#494457]"
                }`}
              >
                {note.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-6 border-t border-[#CBC3DA] bg-white px-6 py-8 sm:flex-row sm:px-10">
      <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
        <span className="font-[Inter] text-2xl font-extrabold text-[#5400D6]">
          C2C
        </span>
        <p className="font-[Inter] text-sm text-[#494457]">
          © 2025 C2C Career Readiness Platform. Empowering the next
          generation of tech talent.
        </p>
      </div>
      <div className="flex gap-8">
        <a href="#" className="font-[Inter] text-sm font-medium text-[#494457] hover:text-[#1C1B1B]">
          Privacy Policy
        </a>
        <a href="#" className="font-[Inter] text-sm font-medium text-[#494457] hover:text-[#1C1B1B]">
          Terms of Service
        </a>
        <a href="#" className="font-[Inter] text-sm font-medium text-[#494457] hover:text-[#1C1B1B]">
          Support Center
        </a>
      </div>
    </footer>
  );
}

function FloatingActionButton() {
  return (
    <button
      type="button"
      aria-label="Ask AI Assistant"
      className="group fixed bottom-8 right-8 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#5400D6] text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-[#313030] px-3 py-1.5 font-[Nimbus_Sans] text-xs font-bold text-[#F3F0EF] opacity-0 transition-opacity group-hover:opacity-100">
        Ask AI Assistant
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#FCF9F8] text-[#1C1B1B] lg:flex">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopNavbar />

        <main className="relative flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70.71% 70.71% at 50% 50%, rgba(109,40,255,0.06) 2%, rgba(109,40,255,0) 60%)",
            }}
          />

          <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
            <WelcomeBanner />
            <StatsGrid />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="flex flex-col gap-12 xl:col-span-2">
                <ContinueLearningSection />
                <RecommendedSection />
              </div>
              <div className="flex flex-col gap-8">
                <DeadlinesPanel />
                <NotificationsPanel />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <FloatingActionButton />
    </div>
  );
}