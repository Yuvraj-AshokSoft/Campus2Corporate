import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StudentLayout from "../../components/student/StudentLayout";
import { getApiErrorMessage, studentApi, unwrapData } from "../../services/studentApi";

// ─── Icon System (subset — matches Student/Admin Dashboard) ──────────────────
type IconName =
  | "dashboard"
  | "user-check"
  | "briefcase"
  | "clipboard"
  | "bell"
  | "award"
  | "settings"
  | "resume"
  | "search"
  | "map-pin"
  | "clock"
  | "users"
  | "chevron-right"
  | "alert"
  | "sparkles"
  | "building"
  | "calendar"
  | "zap";

const Icon = ({
  name,
  className = "h-4 w-4",
}: {
  name: IconName;
  className?: string;
}) => {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    "user-check": (
      <>
        <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="m16 11 2 2 4-5" />
      </>
    ),
    briefcase: (
      <>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path d="M4 12h16" />
      </>
    ),
    clipboard: (
      <>
        <rect x="6" y="4" width="12" height="17" rx="2" />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m9 13.5-1 7.5 4-2 4 2-1-7.5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),
    resume: (
      <>
        <path d="M6 3h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M12 21s7-6.6 7-11a7 7 0 1 0-14 0c0 4.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.8" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    alert: (
      <>
        <path d="M12 4 3.5 18.5h17L12 4Z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </>
    ),
    sparkles: (
      <>
        <path d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
        <path d="M5 16v4" />
        <path d="M3 18h4" />
        <path d="M19 3v3" />
        <path d="M17.5 4.5h3" />
      </>
    ),
    building: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
        <path d="M3 21h18" />
        <path d="M9 7h1" />
        <path d="M14 7h1" />
        <path d="M9 11h1" />
        <path d="M14 11h1" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M4 10h16" />
      </>
    ),
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  };
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

// ─── Sidebar (same as Student Dashboard, with Hiring Process highlighted) ────
const sidebarItems: Array<{ label: string; icon: IconName; route: string; badge?: number }> = [
  { label: "Dashboard", icon: "dashboard", route: "/student-dashboard" },
  { label: "My Profile", icon: "user-check", route: "/student/profile" },
  { label: "Project List", icon: "briefcase", route: "/student/projects" },
  { label: "Applied Projects", icon: "clipboard", route: "/student/applied-projects", badge: 2 },
  { label: "Hiring Process", icon: "building", route: "/student/hiring" },
  { label: "Notifications", icon: "bell", route: "/student/notifications", badge: 3 },
  { label: "Certificates", icon: "award", route: "/student/certificates" },
  { label: "Settings", icon: "settings", route: "/student/settings" },
  { label: "AI Resume Builder", icon: "resume", route: "/student/ai-resume" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type DriveCategory = string;
type DriveStatus = "Open" | "Closing Soon" | "Upcoming" | "Closed";

interface HiringDrive {
  id: string;
  company: string;
  logoText: string;
  logoGradient: string;
  category: DriveCategory;
  roles: string[];
  location: string;
  ctc: string;
  deadline: string;
  status: DriveStatus;
  applicants: number;
  rounds: number;
  eligibility: string;
  applied?: boolean;
}

const statusStyles: Record<DriveStatus, string> = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "Closing Soon": "bg-amber-50 text-amber-700 ring-amber-100",
  Upcoming: "bg-blue-50 text-blue-700 ring-blue-100",
  Closed: "bg-slate-100 text-slate-500 ring-slate-200",
};
const dummyHiringDrives: HiringDrive[] = [
  {
    id: "1",
    company: "Google",
    logoText: "G",
    logoGradient: "from-blue-500 to-green-500",
    category: "Product Based",
    roles: ["Software Engineer", "Backend Developer"],
    location: "Bangalore",
    ctc: "₹32 LPA",
    deadline: "28 Jul 2026",
    status: "Open",
    applicants: 142,
    rounds: 5,
    eligibility: "CGPA 8.0+",
    applied: false,
  },
  {
    id: "2",
    company: "Microsoft",
    logoText: "M",
    logoGradient: "from-sky-500 to-indigo-600",
    category: "Product Based",
    roles: ["Frontend Developer", "SDE Intern"],
    location: "Hyderabad",
    ctc: "₹28 LPA",
    deadline: "26 Jul 2026",
    status: "Closing Soon",
    applicants: 198,
    rounds: 4,
    eligibility: "CGPA 7.5+",
    applied: true,
  },
  {
    id: "3",
    company: "Amazon",
    logoText: "A",
    logoGradient: "from-orange-500 to-yellow-500",
    category: "E-Commerce",
    roles: ["SDE I", "Cloud Engineer"],
    location: "Hyderabad",
    ctc: "₹24 LPA",
    deadline: "02 Aug 2026",
    status: "Upcoming",
    applicants: 0,
    rounds: 5,
    eligibility: "CGPA 7.0+",
    applied: false,
  },
  {
    id: "4",
    company: "TCS",
    logoText: "T",
    logoGradient: "from-blue-700 to-cyan-500",
    category: "Service Based",
    roles: ["Java Developer", "Full Stack Developer"],
    location: "Pune",
    ctc: "₹7 LPA",
    deadline: "20 Jul 2026",
    status: "Closed",
    applicants: 520,
    rounds: 3,
    eligibility: "60% Throughout",
    applied: true,
  },
  {
    id: "5",
    company: "Infosys",
    logoText: "I",
    logoGradient: "from-indigo-600 to-blue-400",
    category: "Service Based",
    roles: ["System Engineer"],
    location: "Mysore",
    ctc: "₹6.5 LPA",
    deadline: "30 Jul 2026",
    status: "Open",
    applicants: 310,
    rounds: 3,
    eligibility: "CGPA 6.5+",
    applied: false,
  },
  {
    id: "6",
    company: "Accenture",
    logoText: "A",
    logoGradient: "from-purple-600 to-pink-500",
    category: "Consulting",
    roles: ["Associate Software Engineer"],
    location: "Mumbai",
    ctc: "₹6.8 LPA",
    deadline: "01 Aug 2026",
    status: "Open",
    applicants: 275,
    rounds: 3,
    eligibility: "CGPA 6.5+",
    applied: false,
  },
  {
    id: "7",
    company: "Flipkart",
    logoText: "F",
    logoGradient: "from-yellow-500 to-blue-600",
    category: "E-Commerce",
    roles: ["Backend Engineer", "Data Engineer"],
    location: "Bangalore",
    ctc: "₹18 LPA",
    deadline: "05 Aug 2026",
    status: "Upcoming",
    applicants: 0,
    rounds: 4,
    eligibility: "CGPA 7.5+",
    applied: false,
  },
  {
    id: "8",
    company: "Zoho",
    logoText: "Z",
    logoGradient: "from-red-500 to-orange-500",
    category: "Product Based",
    roles: ["Software Developer"],
    location: "Chennai",
    ctc: "₹10 LPA",
    deadline: "31 Jul 2026",
    status: "Open",
    applicants: 164,
    rounds: 4,
    eligibility: "No Active Backlogs",
    applied: false,
  },
];
// ─── Hiring Card ──────────────────────────────────────────────────────────────
const HiringCard = ({
  drive,
  onStart,
}: {
  drive: HiringDrive;
  onStart: (d: HiringDrive) => void;
}) => {
  const closed = drive.status === "Closed";
  const upcoming = drive.status === "Upcoming";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${drive.logoGradient} text-[11px] font-black text-white shadow-inner`}
          >
            {drive.logoText}
          </div>
          <div>
            <h3 className="text-sm font-black leading-tight text-slate-900">
              {drive.company}
            </h3>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {drive.category}
            </p>
          </div>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusStyles[drive.status]}`}
        >
          {drive.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {drive.roles.map((r) => (
          <span
            key={r}
            className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-y-2.5 border-t border-slate-100 pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Icon name="map-pin" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          {drive.location}
        </div>
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          {drive.ctc}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Icon name="clock" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          Closes {drive.deadline}
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Icon name="users" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          {drive.applicants} applied
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
        <span>{drive.rounds} rounds</span>
        <span>Eligibility: {drive.eligibility}</span>
      </div>

      <button
        onClick={() => onStart(drive)}
        disabled={closed}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {closed ? "Applications closed" : upcoming ? "View details" : "Start hiring process"}
        {!closed && <Icon name="chevron-right" className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export const Hiring = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fullName = currentUser?.fullName || currentUser?.name || "Student";

  const [hiringDrives, setHiringDrives] = useState<HiringDrive[]>([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [role, setRole] = useState("All Roles");

  useEffect(() => {
    let mounted = true;

    const loadHiringDrives = async () => {
      setLoading(true);
      setError("");
      if (!mounted) return;

      setHiringDrives(dummyHiringDrives);
      setAppliedCount(2);
      setShortlistedCount(1);

      setLoading(false);
      return;
    };

    loadHiringDrives();

    return () => {
      mounted = false;
    };
  }, []);
  //     try {
  //       const response = await studentApi.getHiringDrives();
  //       const payload = unwrapData<{
  //         drives: HiringDrive[];
  //         appliedCount: number;
  //         shortlistedCount: number;
  //       }>(response);

  //       if (!mounted) return;
  //       setHiringDrives(payload.drives || []);
  //       setAppliedCount(payload.appliedCount || 0);
  //       setShortlistedCount(payload.shortlistedCount || 0);
  //     } catch (loadError) {
  //       if (mounted) {
  //         setError(getApiErrorMessage(loadError));
  //         setHiringDrives([]);
  //       }
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   };

  //   loadHiringDrives();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []
  // 
  // );

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(hiringDrives.map((drive) => drive.category).filter(Boolean)))],
    [hiringDrives]
  );

  const roles = useMemo(
    () => ["All Roles", ...Array.from(new Set(hiringDrives.flatMap((drive) => drive.roles || []).filter(Boolean)))],
    [hiringDrives]
  );

  const filteredDrives = useMemo(() => {
    const q = search.trim().toLowerCase();
    return hiringDrives.filter((d) => {
      const matchesCategory = category === "All" || d.category === category;
      const matchesRole = role === "All Roles" || d.roles.includes(role);
      const matchesSearch = !q || d.company.toLowerCase().includes(q);
      return matchesCategory && matchesRole && matchesSearch;
    });
  }, [hiringDrives, search, category, role]);

  const openCount = hiringDrives.filter(
    (d) => d.status === "Open" || d.status === "Closing Soon"
  ).length;

  const statsRow = [
    { label: "Total drives", value: String(hiringDrives.length), icon: "building" as IconName, bg: "#eff6ff" },
    { label: "Open now", value: String(openCount), icon: "zap" as IconName, bg: "#ecfdf5" },
    { label: "Applied", value: String(appliedCount), icon: "clipboard" as IconName, bg: "#fffbeb" },
    { label: "Shortlisted", value: String(shortlistedCount), icon: "award" as IconName, bg: "#f5f3ff" },
  ];

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setRole("All Roles");
  };

  const handleStart = async (drive: HiringDrive) => {
    if (drive.status === "Closed" || drive.applied) {
      navigate(`/student/hiring/${drive.id}`);
      return;
    }

    setStartingId(drive.id);
    setError("");

    try {
      await studentApi.startHiringDrive(drive.id);
      setHiringDrives((drives) =>
        drives.map((item) => (item.id === drive.id ? { ...item, applied: true } : item))
      );
      setAppliedCount((count) => count + 1);
      navigate(`/student/hiring/${drive.id}`);
    } catch (startError) {
      setError(getApiErrorMessage(startError));
    } finally {
      setStartingId(null);
    }
  };

  return (
    <StudentLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Hiring Process"
      userSummary={{
        fullName,
        role: "B.Tech CSE · 4th Year",
        status: `${openCount} companies hiring now`,
      }}
      stats={{
        label: "Open drives",
        value: String(openCount),
        subtitle: "Companies hiring now",
        accent: "Live",
      }}
    >
      <>
        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
            Loading hiring drives...
          </div>
        )}
        {startingId && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            Starting hiring process...
          </div>
        )}

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              <Icon name="sparkles" className="h-3 w-3" />
              Placement drives
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Hiring process
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Browse companies actively hiring, filter by category or role, and
              start a company's hiring process to get matched and scored.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statsRow.map((s) => (
            <article
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: s.bg }}
              >
                <Icon name={s.icon} className="h-4 w-4 text-slate-700" />
              </div>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">
                {s.value}
              </p>
            </article>
          ))}
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xs">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                  category === c
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {c}
              </button>
            ))}

            {(search || category !== "All" || role !== "All Roles") && (
              <button
                onClick={resetFilters}
                className="ml-auto text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Companies grid */}
        {filteredDrives.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDrives.map((drive) => (
              <HiringCard key={drive.id} drive={drive} onStart={handleStart} />
            ))}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <Icon name="alert" className="h-6 w-6 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-600">
              No companies match these filters
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try a different category, role, or search term.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </>
    </StudentLayout>
  );
};

export default Hiring;

//import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import StudentLayout from "../../components/student/StudentLayout";
// import { getApiErrorMessage, studentApi } from "../../services/studentApi";

// // ─── Icon System (subset — matches Student/Admin Dashboard) ──────────────────
// type IconName =
//   | "dashboard"
//   | "user-check"
//   | "briefcase"
//   | "clipboard"
//   | "bell"
//   | "award"
//   | "settings"
//   | "resume"
//   | "search"
//   | "map-pin"
//   | "clock"
//   | "users"
//   | "chevron-right"
//   | "alert"
//   | "sparkles"
//   | "building"
//   | "calendar"
//   | "zap";

// const Icon = ({
//   name,
//   className = "h-4 w-4",
// }: {
//   name: IconName;
//   className?: string;
// }) => {
//   const paths: Record<IconName, React.ReactNode> = {
//     dashboard: (
//       <>
//         <rect x="3" y="3" width="7" height="7" rx="1.5" />
//         <rect x="14" y="3" width="7" height="7" rx="1.5" />
//         <rect x="3" y="14" width="7" height="7" rx="1.5" />
//         <rect x="14" y="14" width="7" height="7" rx="1.5" />
//       </>
//     ),
//     "user-check": (
//       <>
//         <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//         <circle cx="8.5" cy="7" r="4" />
//         <path d="m16 11 2 2 4-5" />
//       </>
//     ),
//     briefcase: (
//       <>
//         <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
//         <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
//         <path d="M4 12h16" />
//       </>
//     ),
//     clipboard: (
//       <>
//         <rect x="6" y="4" width="12" height="17" rx="2" />
//         <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
//         <path d="m9 12 2 2 4-4" />
//       </>
//     ),
//     bell: (
//       <>
//         <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
//         <path d="M10 20a2 2 0 0 0 4 0" />
//       </>
//     ),
//     award: (
//       <>
//         <circle cx="12" cy="8" r="6" />
//         <path d="m9 13.5-1 7.5 4-2 4 2-1-7.5" />
//       </>
//     ),
//     settings: (
//       <>
//         <circle cx="12" cy="12" r="3" />
//         <path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
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
//     search: (
//       <>
//         <circle cx="11" cy="11" r="7" />
//         <path d="m16 16 4 4" />
//       </>
//     ),
//     "map-pin": (
//       <>
//         <path d="M12 21s7-6.6 7-11a7 7 0 1 0-14 0c0 4.4 7 11 7 11Z" />
//         <circle cx="12" cy="10" r="2.5" />
//       </>
//     ),
//     clock: (
//       <>
//         <circle cx="12" cy="12" r="9" />
//         <path d="M12 7v5l3 2" />
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
//     "chevron-right": <path d="m9 18 6-6-6-6" />,
//     alert: (
//       <>
//         <path d="M12 4 3.5 18.5h17L12 4Z" />
//         <path d="M12 9v4" />
//         <path d="M12 16h.01" />
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
//     zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
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

// // ─── Sidebar (same as Student Dashboard, with Hiring Process highlighted) ────
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

// // ─── Types ────────────────────────────────────────────────────────────────────
// type DriveCategory = string;
// type DriveStatus = "Open" | "Closing Soon" | "Upcoming" | "Closed";

// interface HiringDrive {
//   id: string;
//   company: string;
//   logoText: string;
//   logoGradient: string;
//   category: DriveCategory;
//   roles: string[];
//   location: string;
//   ctc: string;
//   deadline: string;
//   status: DriveStatus;
//   applicants: number;
//   rounds: number;
//   eligibility: string;
//   applied?: boolean;
// }

// const statusStyles: Record<DriveStatus, string> = {
//   Open: "bg-emerald-50 text-emerald-700 ring-emerald-100",
//   "Closing Soon": "bg-amber-50 text-amber-700 ring-amber-100",
//   Upcoming: "bg-blue-50 text-blue-700 ring-blue-100",
//   Closed: "bg-slate-100 text-slate-500 ring-slate-200",
// };

// const dummyHiringDrives: HiringDrive[] = [
//   {
//     id: "1",
//     company: "Google",
//     logoText: "G",
//     logoGradient: "from-blue-500 to-green-500",
//     category: "Product Based",
//     roles: ["Software Engineer", "Backend Developer"],
//     location: "Bangalore",
//     ctc: "₹32 LPA",
//     deadline: "28 Jul 2026",
//     status: "Open",
//     applicants: 142,
//     rounds: 5,
//     eligibility: "CGPA 8.0+",
//     applied: false,
//   },
//   {
//     id: "2",
//     company: "Microsoft",
//     logoText: "M",
//     logoGradient: "from-sky-500 to-indigo-600",
//     category: "Product Based",
//     roles: ["Frontend Developer", "SDE Intern"],
//     location: "Hyderabad",
//     ctc: "₹28 LPA",
//     deadline: "26 Jul 2026",
//     status: "Closing Soon",
//     applicants: 198,
//     rounds: 4,
//     eligibility: "CGPA 7.5+",
//     applied: true,
//   },
//   {
//     id: "3",
//     company: "Amazon",
//     logoText: "A",
//     logoGradient: "from-orange-500 to-yellow-500",
//     category: "E-Commerce",
//     roles: ["SDE I", "Cloud Engineer"],
//     location: "Hyderabad",
//     ctc: "₹24 LPA",
//     deadline: "02 Aug 2026",
//     status: "Upcoming",
//     applicants: 0,
//     rounds: 5,
//     eligibility: "CGPA 7.0+",
//     applied: false,
//   },
//   {
//     id: "4",
//     company: "TCS",
//     logoText: "T",
//     logoGradient: "from-blue-700 to-cyan-500",
//     category: "Service Based",
//     roles: ["Java Developer", "Full Stack Developer"],
//     location: "Pune",
//     ctc: "₹7 LPA",
//     deadline: "20 Jul 2026",
//     status: "Closed",
//     applicants: 520,
//     rounds: 3,
//     eligibility: "60% Throughout",
//     applied: true,
//   },
//   {
//     id: "5",
//     company: "Infosys",
//     logoText: "I",
//     logoGradient: "from-indigo-600 to-blue-400",
//     category: "Service Based",
//     roles: ["System Engineer"],
//     location: "Mysore",
//     ctc: "₹6.5 LPA",
//     deadline: "30 Jul 2026",
//     status: "Open",
//     applicants: 310,
//     rounds: 3,
//     eligibility: "CGPA 6.5+",
//     applied: false,
//   },
//   {
//     id: "6",
//     company: "Accenture",
//     logoText: "A",
//     logoGradient: "from-purple-600 to-pink-500",
//     category: "Consulting",
//     roles: ["Associate Software Engineer"],
//     location: "Mumbai",
//     ctc: "₹6.8 LPA",
//     deadline: "01 Aug 2026",
//     status: "Open",
//     applicants: 275,
//     rounds: 3,
//     eligibility: "CGPA 6.5+",
//     applied: false,
//   },
//   {
//     id: "7",
//     company: "Flipkart",
//     logoText: "F",
//     logoGradient: "from-yellow-500 to-blue-600",
//     category: "E-Commerce",
//     roles: ["Backend Engineer", "Data Engineer"],
//     location: "Bangalore",
//     ctc: "₹18 LPA",
//     deadline: "05 Aug 2026",
//     status: "Upcoming",
//     applicants: 0,
//     rounds: 4,
//     eligibility: "CGPA 7.5+",
//     applied: false,
//   },
//   {
//     id: "8",
//     company: "Zoho",
//     logoText: "Z",
//     logoGradient: "from-red-500 to-orange-500",
//     category: "Product Based",
//     roles: ["Software Developer"],
//     location: "Chennai",
//     ctc: "₹10 LPA",
//     deadline: "31 Jul 2026",
//     status: "Open",
//     applicants: 164,
//     rounds: 4,
//     eligibility: "No Active Backlogs",
//     applied: false,
//   },
// ];

// // ─── Hiring Card ──────────────────────────────────────────────────────────────
// const HiringCard = ({
//   drive,
//   onStart,
// }: {
//   drive: HiringDrive;
//   onStart: (d: HiringDrive) => void;
// }) => {
//   const closed = drive.status === "Closed";
//   const upcoming = drive.status === "Upcoming";

//   const buttonLabel = closed
//     ? "Applications closed"
//     : upcoming
//     ? "View details"
//     : drive.applied
//     ? "Continue hiring process"
//     : "Start hiring process";

//   return (
//     <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${drive.logoGradient} text-[11px] font-black text-white shadow-inner`}
//           >
//             {drive.logoText}
//           </div>
//           <div>
//             <h3 className="text-sm font-black leading-tight text-slate-900">
//               {drive.company}
//             </h3>
//             <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//               {drive.category}
//             </p>
//           </div>
//         </div>
//         <span
//           className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${statusStyles[drive.status]}`}
//         >
//           {drive.status}
//         </span>
//       </div>

//       <div className="mt-4 flex flex-wrap gap-1.5">
//         {drive.roles.map((r) => (
//           <span
//             key={r}
//             className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
//           >
//             {r}
//           </span>
//         ))}
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-y-2.5 border-t border-slate-100 pt-4 text-xs">
//         <div className="flex items-center gap-1.5 text-slate-500">
//           <Icon name="map-pin" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
//           {drive.location}
//         </div>
//         <div className="flex items-center gap-1.5 font-bold text-slate-700">
//           {drive.ctc}
//         </div>
//         <div className="flex items-center gap-1.5 text-slate-500">
//           <Icon name="clock" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
//           Closes {drive.deadline}
//         </div>
//         <div className="flex items-center gap-1.5 text-slate-500">
//           <Icon name="users" className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
//           {drive.applicants} applied
//         </div>
//       </div>

//       <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
//         <span>{drive.rounds} rounds</span>
//         <span>Eligibility: {drive.eligibility}</span>
//       </div>

//       <button
//         onClick={() => onStart(drive)}
//         disabled={closed}
//         className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
//       >
//         {buttonLabel}
//         {!closed && <Icon name="chevron-right" className="h-3.5 w-3.5" />}
//       </button>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════════════
// export const Hiring = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();

//   const fullName = currentUser?.fullName || currentUser?.name || "Student";

//   const [hiringDrives, setHiringDrives] = useState<HiringDrive[]>([]);
//   const [appliedCount, setAppliedCount] = useState(0);
//   const [shortlistedCount, setShortlistedCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [startingId, setStartingId] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [role, setRole] = useState("All Roles");

//   useEffect(() => {
//     let mounted = true;

//     const loadHiringDrives = async () => {
//       setLoading(true);
//       setError("");
//       if (!mounted) return;

//       // TODO: swap back to the live API once /hiring-drives is ready:
//       // const response = await studentApi.getHiringDrives();
//       // const payload = unwrapData<{ drives: HiringDrive[]; appliedCount: number; shortlistedCount: number }>(response);
//       setHiringDrives(dummyHiringDrives);
//       setAppliedCount(2);
//       setShortlistedCount(1);
//       setLoading(false);
//     };

//     loadHiringDrives();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const categories = useMemo(
//     () => ["All", ...Array.from(new Set(hiringDrives.map((drive) => drive.category).filter(Boolean)))],
//     [hiringDrives]
//   );

//   const roles = useMemo(
//     () => ["All Roles", ...Array.from(new Set(hiringDrives.flatMap((drive) => drive.roles || []).filter(Boolean)))],
//     [hiringDrives]
//   );

//   const filteredDrives = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return hiringDrives.filter((d) => {
//       const matchesCategory = category === "All" || d.category === category;
//       const matchesRole = role === "All Roles" || d.roles.includes(role);
//       const matchesSearch = !q || d.company.toLowerCase().includes(q);
//       return matchesCategory && matchesRole && matchesSearch;
//     });
//   }, [hiringDrives, search, category, role]);

//   const openCount = hiringDrives.filter(
//     (d) => d.status === "Open" || d.status === "Closing Soon"
//   ).length;

//   const statsRow = [
//     { label: "Total drives", value: String(hiringDrives.length), icon: "building" as IconName, bg: "#eff6ff" },
//     { label: "Open now", value: String(openCount), icon: "zap" as IconName, bg: "#ecfdf5" },
//     { label: "Applied", value: String(appliedCount), icon: "clipboard" as IconName, bg: "#fffbeb" },
//     { label: "Shortlisted", value: String(shortlistedCount), icon: "award" as IconName, bg: "#f5f3ff" },
//   ];

//   const resetFilters = () => {
//     setSearch("");
//     setCategory("All");
//     setRole("All Roles");
//   };

//   // Takes the student straight into the AI-proctored assessment flow
//   // (HiringProcess.tsx), passing the drive along so that page doesn't
//   // need a round-trip fetch just to know which company/round it's running.
//   const goToHiringProcess = (drive: HiringDrive) => {
//     navigate(`/student/hiring-process/${drive.id}`, { state: { drive } });
//   };

//   const handleStart = async (drive: HiringDrive) => {
//     if (drive.status === "Closed") return;

//     // Upcoming drives aren't open yet — just show details, don't start a process.
//     if (drive.status === "Upcoming") {
//       navigate(`/student/hiring/${drive.id}`);
//       return;
//     }

//     // Already applied — resume/continue straight into the hiring process.
//     if (drive.applied) {
//       goToHiringProcess(drive);
//       return;
//     }

//     setStartingId(drive.id);
//     setError("");

//     try {
//       await studentApi.startHiringDrive(drive.id);
//       setHiringDrives((drives) =>
//         drives.map((item) => (item.id === drive.id ? { ...item, applied: true } : item))
//       );
//       setAppliedCount((count) => count + 1);
//       goToHiringProcess(drive);
//     } catch (startError) {
//       setError(getApiErrorMessage(startError));
//     } finally {
//       setStartingId(null);
//     }
//   };

//   return (
//     <StudentLayout
//       sidebarItems={sidebarItems}
//       sidebarHighlight="Hiring Process"
//       userSummary={{
//         fullName,
//         role: "B.Tech CSE · 4th Year",
//         status: `${openCount} companies hiring now`,
//       }}
//       stats={{
//         label: "Open drives",
//         value: String(openCount),
//         subtitle: "Companies hiring now",
//         accent: "Live",
//       }}
//     >
//       <>
//         {error && (
//           <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
//             {error}
//           </div>
//         )}
//         {loading && (
//           <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
//             Loading hiring drives...
//           </div>
//         )}
//         {startingId && (
//           <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
//             Starting hiring process...
//           </div>
//         )}

//         {/* Hero */}
//         <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
//           <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
//           <div className="relative">
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
//               <Icon name="sparkles" className="h-3 w-3" />
//               Placement drives
//             </span>
//             <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
//               Hiring process
//             </h1>
//             <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
//               Browse companies actively hiring, filter by category or role, and
//               start a company's hiring process to get matched and scored.
//             </p>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           {statsRow.map((s) => (
//             <article
//               key={s.label}
//               className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
//             >
//               <div
//                 className="flex h-10 w-10 items-center justify-center rounded-xl"
//                 style={{ background: s.bg }}
//               >
//                 <Icon name={s.icon} className="h-4 w-4 text-slate-700" />
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

//         {/* Filters */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="relative flex-1 lg:max-w-xs">
//               <Icon
//                 name="search"
//                 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300"
//               />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by company…"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
//               />
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
//                 Role
//               </label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
//               >
//                 {roles.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="mt-4 flex flex-wrap items-center gap-2">
//             {categories.map((c) => (
//               <button
//                 key={c}
//                 onClick={() => setCategory(c)}
//                 className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
//                   category === c
//                     ? "bg-slate-900 text-white"
//                     : "border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
//                 }`}
//               >
//                 {c}
//               </button>
//             ))}

//             {(search || category !== "All" || role !== "All Roles") && (
//               <button
//                 onClick={resetFilters}
//                 className="ml-auto text-[11px] font-bold text-slate-400 hover:text-slate-600"
//               >
//                 Clear filters
//               </button>
//             )}
//           </div>
//         </section>

//         {/* Companies grid */}
//         {filteredDrives.length > 0 ? (
//           <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//             {filteredDrives.map((drive) => (
//               <HiringCard key={drive.id} drive={drive} onStart={handleStart} />
//             ))}
//           </div>
//         ) : !loading ? (
//           <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
//             <Icon name="alert" className="h-6 w-6 text-slate-300" />
//             <p className="mt-3 text-sm font-bold text-slate-600">
//               No companies match these filters
//             </p>
//             <p className="mt-1 text-xs text-slate-400">
//               Try a different category, role, or search term.
//             </p>
//             <button
//               onClick={resetFilters}
//               className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
//             >
//               Clear filters
//             </button>
//           </div>
//         ) : null}
//       </>
//     </StudentLayout>
//   );
// };

// export default Hiring;