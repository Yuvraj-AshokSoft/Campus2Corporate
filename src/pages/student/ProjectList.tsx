import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentLayout from "../../components/student/StudentLayout";

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
  | "clipboard" | "logout" | "filter" | "grid" | "list" | "star" | "arrow-right";

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
    filter: <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></>,
    star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />,
    "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round"
      strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const useStudentProfile = () => {
  const { currentUser } = useAuth();
  const fullName = currentUser?.fullName || "Yuvraj Singh";
  return { fullName };
};
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


// ─── Project data ─────────────────────────────────────────────────────────────
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "Frontend" | "Backend" | "Full Stack" | "AI / ML" | "Data Science" | "Mobile";

interface Project {
  id: string;
  title: string;
  company: string;
  category: Category;
  difficulty: Difficulty;
  duration: string;
  techStack: string[];
  description: string;
  requirements: string[];
  applicants: number;
  slots: number;
  deadline: string;
  stipend: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: "p1", title: "AI Resume Analyzer Dashboard", company: "NimbusTech Labs", category: "AI / ML",
    difficulty: "Intermediate", duration: "4 weeks", techStack: ["React", "TypeScript", "Claude API", "Tailwind"],
    description: "Build an ATS-style resume scoring dashboard that parses resumes and returns keyword and formatting feedback using an LLM.",
    requirements: ["Comfortable with React + TypeScript", "Basic understanding of REST APIs", "Interest in applied AI"],
    applicants: 34, slots: 6, deadline: "20 Jul", stipend: "₹8,000/mo", featured: true,
  },
  {
    id: "p2", title: "E-commerce Order Tracking API", company: "CartFlow Retail", category: "Backend",
    difficulty: "Intermediate", duration: "3 weeks", techStack: ["Node.js", "Express", "MongoDB", "JWT"],
    description: "Design and ship a REST API for order lifecycle tracking with role-based access for customers, sellers, and admins.",
    requirements: ["Node.js fundamentals", "Familiarity with MongoDB schema design", "Understanding of auth flows"],
    applicants: 21, slots: 4, deadline: "18 Jul", stipend: "₹7,000/mo",
  },
  {
    id: "p3", title: "Customer Churn Prediction Pipeline", company: "DataForge Analytics", category: "Data Science",
    difficulty: "Advanced", duration: "6 weeks", techStack: ["Python", "Pandas", "Scikit-learn", "Power BI"],
    description: "Build an end-to-end churn prediction pipeline with feature engineering, model evaluation, and a stakeholder-facing dashboard.",
    requirements: ["Strong Python & pandas skills", "Understanding of classification metrics", "Exposure to BI tooling"],
    applicants: 47, slots: 5, deadline: "25 Jul", stipend: "₹10,000/mo", featured: true,
  },
  {
    id: "p4", title: "Real-time Collaborative Whiteboard", company: "SketchSync", category: "Full Stack",
    difficulty: "Advanced", duration: "5 weeks", techStack: ["React", "Socket.io", "Node.js", "Canvas API"],
    description: "Implement a multiplayer whiteboard with live cursors, shape sync, and conflict resolution over WebSockets.",
    requirements: ["Experience with WebSockets", "Solid React state management", "Comfort with Canvas or SVG"],
    applicants: 29, slots: 3, deadline: "22 Jul", stipend: "₹9,000/mo",
  },
  {
    id: "p5", title: "Campus Event Discovery App", company: "EduSphere", category: "Mobile",
    difficulty: "Beginner", duration: "3 weeks", techStack: ["React Native", "Expo", "Firebase"],
    description: "Build a mobile app where students discover, RSVP to, and get reminders for campus events and workshops.",
    requirements: ["Basic React Native knowledge", "Familiarity with Firebase Auth/Firestore"],
    applicants: 52, slots: 8, deadline: "15 Jul", stipend: "₹5,000/mo",
  },
  {
    id: "p6", title: "Sentiment Analysis for Product Reviews", company: "ReviewPulse", category: "AI / ML",
    difficulty: "Intermediate", duration: "4 weeks", techStack: ["Python", "Hugging Face", "FastAPI"],
    description: "Fine-tune a sentiment classifier on e-commerce reviews and expose it via a FastAPI microservice with a simple UI.",
    requirements: ["Python + basic ML workflow", "Understanding of NLP preprocessing", "REST API basics"],
    applicants: 38, slots: 5, deadline: "21 Jul", stipend: "₹8,500/mo",
  },
  {
    id: "p7", title: "Personal Finance Tracker", company: "WalletWise", category: "Frontend",
    difficulty: "Beginner", duration: "2 weeks", techStack: ["React", "Chart.js", "Tailwind"],
    description: "Build a responsive expense tracker with category breakdowns, budgets, and interactive charts — no backend required.",
    requirements: ["HTML/CSS/JS fundamentals", "Basic React hooks"],
    applicants: 61, slots: 10, deadline: "14 Jul", stipend: "Unpaid · Certificate",
  },
  {
    id: "p8", title: "DevOps CI/CD Pipeline for Microservices", company: "ShipRight Systems", category: "Backend",
    difficulty: "Advanced", duration: "5 weeks", techStack: ["Docker", "GitHub Actions", "Kubernetes", "AWS"],
    description: "Set up automated build, test, and deployment pipelines for a microservices architecture running on Kubernetes.",
    requirements: ["Familiarity with Docker", "Basic CI/CD concepts", "Comfort with cloud platforms"],
    applicants: 18, slots: 3, deadline: "28 Jul", stipend: "₹11,000/mo",
  },
  {
    id: "p9", title: "AI-Powered Study Buddy Chatbot", company: "LearnLoop", category: "Full Stack",
    difficulty: "Intermediate", duration: "4 weeks", techStack: ["React", "Claude API", "PostgreSQL"],
    description: "Build a conversational study assistant that answers syllabus questions and generates practice quizzes on demand.",
    requirements: ["React + API integration experience", "Basic SQL knowledge", "Interest in edtech"],
    applicants: 44, slots: 6, deadline: "19 Jul", stipend: "₹8,000/mo",
  },
  {
    id: "p10", title: "Sales Analytics Dashboard", company: "Vantage Metrics", category: "Data Science",
    difficulty: "Beginner", duration: "3 weeks", techStack: ["Python", "Streamlit", "SQL"],
    description: "Turn raw sales data into an interactive Streamlit dashboard with filters, trend lines, and exportable reports.",
    requirements: ["Basic Python", "Comfort writing SQL queries"],
    applicants: 33, slots: 7, deadline: "17 Jul", stipend: "₹6,000/mo",
  },
];

const categories: Array<Category | "All"> = ["All", "Frontend", "Backend", "Full Stack", "AI / ML", "Data Science", "Mobile"];
const sortOptions = ["Newest", "Deadline (soonest)", "Most applicants", "Fewest slots left"] as const;

// ─── Visual helpers ─────────────────────────────────────────────────────────────
const difficultyCls: Record<Difficulty, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Intermediate: "bg-amber-50 text-amber-700 ring-amber-100",
  Advanced: "bg-rose-50 text-rose-700 ring-rose-100",
};

const categoryColor: Record<Category, string> = {
  Frontend: "#2563eb", Backend: "#10b981", "Full Stack": "#8b5cf6",
  "AI / ML": "#f43f5e", "Data Science": "#f59e0b", Mobile: "#0ea5e9",
};

// ─── Project card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, applied, onApply, onView }: {
  project: Project; applied: boolean; onApply: () => void; onView: () => void;
}) => {
  const slotsLeft = Math.max(project.slots - Math.round(project.applicants / 8), 1);
  const fillPct = Math.min(100, Math.round((project.applicants / (project.applicants + project.slots)) * 100));

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: categoryColor[project.category] }}>
            <Icon name="briefcase" className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">{project.company}</p>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold ring-1" style={{ color: categoryColor[project.category], background: `${categoryColor[project.category]}14`, borderColor: categoryColor[project.category] }}>
              {project.category}
            </span>
          </div>
        </div>
        {project.featured && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 ring-1 ring-amber-100">
            <Icon name="star" className="h-3 w-3" />
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[15px] font-black leading-snug text-slate-900">{project.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{project.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{t}</span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><Icon name="clock" className="h-3 w-3" />{project.duration}</span>
        <span className="flex items-center gap-1"><Icon name="calendar" className="h-3 w-3" />Due {project.deadline}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${difficultyCls[project.difficulty]}`}>
          {project.difficulty}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{project.applicants} applied</span>
          <span>{slotsLeft} slots left</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${fillPct}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        <span className="text-xs font-bold text-slate-700">{project.stipend}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={onView}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50">
            Details
          </button>
          <button onClick={onApply} disabled={applied}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
              applied ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}>
            {applied && <Icon name="check" className="h-3 w-3" />}
            {applied ? "Applied" : "Apply now"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Project detail modal ─────────────────────────────────────────────────────
const ProjectModal = ({ project, applied, onApply, onClose }: {
  project: Project; applied: boolean; onApply: () => void; onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: categoryColor[project.category] }}>
            <Icon name="briefcase" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400">{project.company}</p>
            <h3 className="text-base font-black text-slate-900">{project.title}</h3>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${difficultyCls[project.difficulty]}`}>{project.difficulty}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{project.category}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{project.duration}</span>
        </div>

        <p className="text-[13px] leading-6 text-slate-600">{project.description}</p>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tech stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span key={t} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">{t}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">What you'll need</p>
          <ul className="space-y-1.5">
            {project.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
                <Icon name="check" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
          <div>
            <p className="text-sm font-black text-slate-900">{project.applicants}</p>
            <p className="text-[10px] text-slate-400">Applicants</p>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{project.deadline}</p>
            <p className="text-[10px] text-slate-400">Deadline</p>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{project.stipend}</p>
            <p className="text-[10px] text-slate-400">Stipend</p>
          </div>
        </div>

        <button onClick={onApply} disabled={applied}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
            applied ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-slate-900 text-white hover:bg-slate-800"
          }`}>
          <Icon name={applied ? "check" : "send"} className="h-4 w-4" />
          {applied ? "Application submitted" : "Apply to this project"}
        </button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROJECT LIST PAGE
// ═══════════════════════════════════════════════════════════════════════════
export const ProjectListPage = () => {
  const { fullName } = useStudentProfile();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [sort, setSort] = useState<typeof sortOptions[number]>("Newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set(["p2", "p7"]));
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [toast, setToast] = useState("");

  const applyToProject = (id: string, title: string) => {
    if (appliedIds.has(id)) return;
    setAppliedIds((s) => new Set(s).add(id));
    setToast(`Applied to "${title}"`);
    setTimeout(() => setToast(""), 2500);
  };

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const matchesQuery = query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.company.toLowerCase().includes(query.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === "All" || p.category === category;
      const matchesDifficulty = difficulty === "All" || p.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });

    if (sort === "Deadline (soonest)") list = [...list].sort((a, b) => a.deadline.localeCompare(b.deadline));
    else if (sort === "Most applicants") list = [...list].sort((a, b) => b.applicants - a.applicants);
    else if (sort === "Fewest slots left") list = [...list].sort((a, b) => a.slots - b.slots);
    else list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }, [query, category, difficulty, sort]);

  const stats = [
    { label: "Open projects", value: String(projects.length), icon: "briefcase" as IconName, bg: "#eff6ff" },
    { label: "Categories", value: String(categories.length - 1), icon: "grid" as IconName, bg: "#f5f3ff" },
    { label: "You've applied", value: String(appliedIds.size), icon: "check" as IconName, bg: "#ecfdf5" },
    { label: "Closing this week", value: "3", icon: "clock" as IconName, bg: "#fffbeb" },
  ];

  return (
    <StudentLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Project List"
      userSummary={{ fullName, role: "B.Tech CSE · 4th Year", status: "Placement track active" }}
      stats={{ label: "Open projects", value: String(projects.length), subtitle: "Active opportunities", accent: "Live" }}
      showAiButton={false}
    >
      <main className="min-w-0 flex-1 space-y-5">

            {/* Header banner */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                  <Icon name="briefcase" className="h-3 w-3" />
                  Live opportunities
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Browse project listings</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Apply to real-world projects from partner companies and build a portfolio recruiters actually look at.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <article key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                    <Icon name={s.icon} className="h-4.5 w-4.5 text-slate-700" />
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
                </article>
              ))}
            </div>

            {/* Search + filters */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <Icon name="search" className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects, companies, tech stack…"
                    className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFiltersOpen((v) => !v)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition ${
                      filtersOpen ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}>
                    <Icon name="filter" className="h-3.5 w-3.5" />
                    Filters
                  </button>
                  <div className="flex overflow-hidden rounded-xl border border-slate-200">
                    <button onClick={() => setView("grid")}
                      className={`flex h-[38px] w-9 items-center justify-center transition ${view === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                      <Icon name="grid" className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setView("list")}
                      className={`flex h-[38px] w-9 items-center justify-center transition ${view === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-400 hover:bg-slate-50"}`}>
                      <Icon name="list" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                      category === c ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>

              {filtersOpen && (
                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-500">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | "All")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50">
                      <option>All</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-slate-500">Sort by</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value as typeof sortOptions[number])}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50">
                      {sortOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </section>

            {/* Results */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-slate-500">{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                <Icon name="search" className="mx-auto h-6 w-6 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-600">No projects match your filters</p>
                <p className="mt-1 text-xs text-slate-400">Try a different search term or clear a filter.</p>
              </div>
            ) : (
              <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
                {filtered.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    applied={appliedIds.has(p.id)}
                    onApply={() => applyToProject(p.id, p.title)}
                    onView={() => setActiveProject(p)}
                  />
                ))}
              </div>
            )}
          </main>

      {/* ── Project detail modal ── */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          applied={appliedIds.has(activeProject.id)}
          onApply={() => applyToProject(activeProject.id, activeProject.title)}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Icon name="check" className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </StudentLayout>
  );
};

export default ProjectListPage;