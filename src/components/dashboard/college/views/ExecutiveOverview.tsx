import React, { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Target,
  Building,
  Download,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  CheckCircle2,
  BookOpen,
  Send,
  BarChart3
} from "lucide-react";
import type { ViewType } from "../CollegeSidebar";

interface ExecutiveOverviewProps {
  onNavigateView?: (view: ViewType) => void;
  onOpenNewDriveModal?: () => void;
  onExportReport?: () => void;
  searchQuery?: string;
}

export interface CampusDriveItem {
  id: string;
  company: string;
  logoBg: string;
  logoLetter: string;
  date: string; // YYYY-MM-DD
  formattedDate: string; // Mar 12, 2026
  role: string;
  packageLPA: string;
  status: "Confirmed" | "Negotiating" | "Tentative" | "Completed";
  eligibleCount: number;
  appliedCount: number;
  shortlistedCount: number;
  venue: string;
  description: string;
  shortlistedStudents: string[];
}

export interface ActivityLogItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  dotColor: string;
  category: "Shortlist" | "Assessment" | "Drive" | "Offer" | "Workshop";
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Initial mock dataset for drives
const INITIAL_DRIVES: CampusDriveItem[] = [
  {
    id: "drv-1",
    company: "Stripe Tech",
    logoBg: "bg-purple-600 text-white",
    logoLetter: "S",
    date: "2026-03-12",
    formattedDate: "Mar 12, 2026",
    role: "Full Stack Developer",
    packageLPA: "18.5",
    status: "Confirmed",
    eligibleCount: 420,
    appliedCount: 310,
    shortlistedCount: 42,
    venue: "Main Auditorium & Online Assessment Center",
    description: "Full stack engineering drive covering DSA, React, and Node.js microservices architecture.",
    shortlistedStudents: ["Arjun Mehta", "Neha Gupta", "Rahul Sharma", "Priya Patel", "Sneha Reddy"]
  },
  {
    id: "drv-2",
    company: "Aether Commerce",
    logoBg: "bg-indigo-600 text-white",
    logoLetter: "A",
    date: "2026-03-15",
    formattedDate: "Mar 15, 2026",
    role: "Product Analyst",
    packageLPA: "12.0",
    status: "Negotiating",
    eligibleCount: 380,
    appliedCount: 240,
    shortlistedCount: 28,
    venue: "Seminar Hall 2 & Interview Pods",
    description: "Product analysis, SQL queries, market sizing case studies, and business analytics evaluation.",
    shortlistedStudents: ["Sara Khan", "Leo George", "Rohan Verma", "Ananya Patel"]
  },
  {
    id: "drv-3",
    company: "Nexus Finance",
    logoBg: "bg-slate-700 text-white",
    logoLetter: "N",
    date: "2026-03-20",
    formattedDate: "Mar 20, 2026",
    role: "Risk Auditor",
    packageLPA: "14.2",
    status: "Tentative",
    eligibleCount: 290,
    appliedCount: 180,
    shortlistedCount: 15,
    venue: "Corporate Placement Cell - Room 104",
    description: "Quantitative financial modeling, risk assessment, and regulatory compliance audit roles.",
    shortlistedStudents: ["Devansh Mehta", "Vikram Desai", "Pooja Hegde"]
  },
  {
    id: "drv-4",
    company: "Google APAC",
    logoBg: "bg-blue-600 text-white",
    logoLetter: "G",
    date: "2026-04-02",
    formattedDate: "Apr 02, 2026",
    role: "Software Engineer",
    packageLPA: "24.0",
    status: "Confirmed",
    eligibleCount: 520,
    appliedCount: 480,
    shortlistedCount: 50,
    venue: "Virtual APAC Assessment Hub & Google Meet",
    description: "Advanced algorithms, Graph theory, System Design, and Google Leadership Principles.",
    shortlistedStudents: ["Priya Sharma", "Neha Gupta", "Arjun Mehta", "Karan Singh"]
  },
  {
    id: "drv-5",
    company: "Microsoft",
    logoBg: "bg-emerald-600 text-white",
    logoLetter: "M",
    date: "2026-04-10",
    formattedDate: "Apr 10, 2026",
    role: "Cloud Architect",
    packageLPA: "22.0",
    status: "Negotiating",
    eligibleCount: 450,
    appliedCount: 390,
    shortlistedCount: 35,
    venue: "Apex Innovation Hall",
    description: "Azure cloud computing, distributed systems, container orchestration, and C#/C++ DSA.",
    shortlistedStudents: ["Ananya Patel", "Leo George", "Rohan Verma"]
  }
];

const INITIAL_ACTIVITIES: ActivityLogItem[] = [
  {
    id: "act-1",
    title: "Shortlisting Complete",
    desc: "42 students shortlisted for Google APAC Interview Round.",
    time: "2 hours ago",
    dotColor: "bg-purple-600",
    category: "Shortlist"
  },
  {
    id: "act-2",
    title: "Assessment Published",
    desc: "New Python Mock Assessment released for CS final year.",
    time: "5 hours ago",
    dotColor: "bg-indigo-600",
    category: "Assessment"
  },
  {
    id: "act-3",
    title: "JD Updated",
    desc: "Microsoft updated JD for 'Security Engineer' role.",
    time: "Yesterday",
    dotColor: "bg-slate-600",
    category: "Drive"
  },
  {
    id: "act-4",
    title: "Placement Offer Released",
    desc: "8 students received offer letters from Stripe Tech.",
    time: "2 days ago",
    dotColor: "bg-emerald-600",
    category: "Offer"
  }
];

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onNavigateView,
  onOpenNewDriveModal,
  onExportReport,
  searchQuery: externalSearchQuery = ""
}) => {
  // 1. Session & Global Filter State
  const [selectedSession, setSelectedSession] = useState<string>("2025-2026");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Active Search Query
  const activeSearch = externalSearchQuery;

  // 2. Calendar Month & Year State
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(2); // March = 2
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // e.g. "2026-03-12"

  // 3. Dynamic Drives & Activity Dataset State
  const [drives, setDrives] = useState<CampusDriveItem[]>(INITIAL_DRIVES);
  const [activities, setActivities] = useState<ActivityLogItem[]>(INITIAL_ACTIVITIES);

  // 4. Modals & Drawers State
  const [activeMetricModal, setActiveMetricModal] = useState<"students" | "candidates" | "readiness" | "companies" | null>(null);
  const [selectedDriveDrawer, setSelectedDriveDrawer] = useState<CampusDriveItem | null>(null);
  const [isPredictiveModelOpen, setIsPredictiveModelOpen] = useState<boolean>(false);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState<boolean>(false);
  const [isActivityLogDrawerOpen, setIsActivityLogDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Workshop Form State
  const [workshopTitle, setWorkshopTitle] = useState<string>("Data Engineering & Big Data Workshop");
  const [workshopDate, setWorkshopDate] = useState<string>("2026-03-18");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Session Metrics Recalculation
  const sessionMetrics = useMemo(() => {
    if (selectedSession === "2024-2025") {
      return {
        totalStudents: "2,480",
        studentsGrowth: "+4% ↑",
        activeCandidates: "1,822",
        candidatesGrowth: "+12% ↑",
        readiness: "84.2%",
        readinessNum: 84.2,
        companies: "142",
        readinessDeptBreakdown: [
          { dept: "Computer Science", readiness: 89.4, students: 420 },
          { dept: "Information Tech", readiness: 86.2, students: 350 },
          { dept: "Electronics", readiness: 81.0, students: 310 },
          { dept: "Mechanical", readiness: 68.5, students: 280 }
        ]
      };
    } else if (selectedSession === "2025-2026") {
      return {
        totalStudents: "2,650",
        studentsGrowth: "+6% ↑",
        activeCandidates: "2,010",
        candidatesGrowth: "+15% ↑",
        readiness: "88.5%",
        readinessNum: 88.5,
        companies: "165",
        readinessDeptBreakdown: [
          { dept: "Computer Science", readiness: 93.1, students: 450 },
          { dept: "Information Tech", readiness: 89.8, students: 380 },
          { dept: "Electronics", readiness: 85.4, students: 340 },
          { dept: "Mechanical", readiness: 74.2, students: 300 }
        ]
      };
    } else {
      return {
        totalStudents: "2,800",
        studentsGrowth: "+8% ↑",
        activeCandidates: "2,240",
        candidatesGrowth: "+18% ↑",
        readiness: "91.0%",
        readinessNum: 91.0,
        companies: "180",
        readinessDeptBreakdown: [
          { dept: "Computer Science", readiness: 95.0, students: 480 },
          { dept: "Information Tech", readiness: 92.5, students: 400 },
          { dept: "Electronics", readiness: 88.0, students: 360 },
          { dept: "Mechanical", readiness: 78.5, students: 320 }
        ]
      };
    }
  }, [selectedSession]);

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Dynamic Days Generator for Month
  const monthCalendarData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun

    // Previous month filler days
    const prevMonthDaysCount = new Date(currentYear, currentMonthIndex, 0).getDate();
    const prevDays = Array.from(
      { length: firstDayIndex },
      (_, i) => prevMonthDaysCount - firstDayIndex + i + 1
    );

    // Current month days array
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return { prevDays, currentDays };
  }, [currentYear, currentMonthIndex]);

  // Format date string helper YYYY-MM-DD
  const formatDateString = (day: number) => {
    const m = String(currentMonthIndex + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  // Calendar Day Click Handler
  const handleCalendarDayClick = (day: number) => {
    const formatted = formatDateString(day);
    if (selectedDate === formatted) {
      setSelectedDate(null); // Clear filter
      showToast("Cleared date filter. Showing all upcoming campus drives.");
    } else {
      setSelectedDate(formatted);
      showToast(`Filtering drives for ${MONTH_NAMES[currentMonthIndex]} ${day}, ${currentYear}`);
    }
  };

  // Inline Status Change Handler
  const handleStatusChange = (driveId: string, newStatus: CampusDriveItem["status"]) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === driveId ? { ...d, status: newStatus } : d))
    );

    // Log Activity Event
    const updatedDrive = drives.find((d) => d.id === driveId);
    if (updatedDrive) {
      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        title: "Drive Status Updated",
        desc: `${updatedDrive.company} drive status changed to '${newStatus}'.`,
        time: "Just now",
        dotColor: "bg-purple-600",
        category: "Drive"
      };
      setActivities((prev) => [newActivity, ...prev]);
    }

    showToast(`Updated status for drive to '${newStatus}'.`);
  };

  // Schedule Workshop Handler
  const handleScheduleWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorkshopModalOpen(false);

    // Add activity log
    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      title: "Workshop Scheduled",
      desc: `${workshopTitle} scheduled for ${workshopDate}.`,
      time: "Just now",
      dotColor: "bg-indigo-600",
      category: "Workshop"
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Workshop '${workshopTitle}' scheduled successfully!`);
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = "Company,Date,Role,Package LPA,Status,Eligible,Shortlisted\n";
    const rows = drives
      .map(
        (d) =>
          `"${d.company}","${d.formattedDate}","${d.role}","${d.packageLPA}","${d.status}",${d.eligibleCount},${d.shortlistedCount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Placement_Executive_Report_${selectedSession}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded Placement Executive Summary CSV!");
  };

  // Filtered Campus Drives
  const filteredDrives = useMemo(() => {
    return drives.filter((d) => {
      // Date filter match
      const matchesDate = !selectedDate || d.date === selectedDate;

      // Status filter match
      const matchesStatus = statusFilter === "All" || d.status === statusFilter;

      // Search term match
      const matchesSearch =
        !activeSearch ||
        d.company.toLowerCase().includes(activeSearch.toLowerCase()) ||
        d.role.toLowerCase().includes(activeSearch.toLowerCase()) ||
        d.packageLPA.includes(activeSearch);

      return matchesDate && matchesStatus && matchesSearch;
    });
  }, [drives, selectedDate, statusFilter, activeSearch]);

  return (
    <div className="space-y-6 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-800 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Workspace Header & Session Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Overview
            </h1>
            {/* Session / Batch Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedSession}
                onChange={(e) => {
                  setSelectedSession(e.target.value);
                  showToast(`Switched view to Session ${e.target.value}`);
                }}
                className="bg-purple-100/90 hover:bg-purple-200/90 text-purple-700 font-extrabold text-xs py-1.5 px-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer shadow-xs"
              >
                <option value="2024-2025">Session 2024-25</option>
                <option value="2025-2026">Session 2025-26</option>
                <option value="2026-2027">Session 2026-27</option>
              </select>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Real-time placement intelligence &amp; campus drive analytics for {selectedSession}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Report Button */}
          <button
            onClick={onExportReport || handleExportCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-200/90 flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:border-slate-300"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Report</span>
          </button>

          {/* Quick Action Button */}
          <button
            onClick={onOpenNewDriveModal}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4 fill-white/20" />
            <span>Quick Action</span>
          </button>
        </div>
      </div>

      {/* 4 Core Analytics Metric Cards Grid (With Drill-down Modal triggers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Students */}
        <div
          onClick={() => setActiveMetricModal("students")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md flex items-center gap-0.5">
              {sessionMetrics.studentsGrowth}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
              Total Students
            </span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {sessionMetrics.totalStudents}
            </div>
          </div>
        </div>

        {/* Metric 2: Active Candidates */}
        <div
          onClick={() => setActiveMetricModal("candidates")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md flex items-center gap-0.5">
              {sessionMetrics.candidatesGrowth}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
              Active Candidates
            </span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {sessionMetrics.activeCandidates}
            </div>
          </div>
        </div>

        {/* Metric 3: Placement Readiness */}
        <div
          onClick={() => setActiveMetricModal("readiness")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
              <Target className="w-5 h-5" />
            </div>
            <div className="w-16 h-2 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-500"
                style={{ width: `${sessionMetrics.readinessNum}%` }}
              />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
              Placement Readiness
            </span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {sessionMetrics.readiness}
            </div>
          </div>
        </div>

        {/* Metric 4: Companies Visiting */}
        <div
          onClick={() => setActiveMetricModal("companies")}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md uppercase">
              Live
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
              Companies Visiting
            </span>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {sessionMetrics.companies}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row (Interactive Calendar & AI Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Placement Schedule (Interactive Calendar with Month Navigation) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Monthly Placement Schedule
                </h2>
              </div>

              {/* Month/Year Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-extrabold text-slate-800 min-w-[110px] text-center">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="w-full">
              {/* Days Header */}
              <div className="grid grid-cols-7 text-center mb-2">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                  <div key={day} className="text-[11px] font-bold text-slate-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Numbers Grid */}
              <div className="grid grid-cols-7 text-center gap-y-2">
                {/* Previous Month Days */}
                {monthCalendarData.prevDays.map((d) => (
                  <div
                    key={`prev-${d}`}
                    className="h-9 flex items-center justify-center text-xs font-medium text-slate-300 cursor-not-allowed"
                  >
                    {d}
                  </div>
                ))}

                {/* Current Month Days */}
                {monthCalendarData.currentDays.map((d) => {
                  const dateStr = formatDateString(d);
                  const driveOnDate = drives.find((drv) => drv.date === dateStr);
                  const isSelected = selectedDate === dateStr;

                  let cellClass = "text-slate-700 hover:bg-purple-50 hover:text-purple-700";

                  if (driveOnDate) {
                    if (d === 12) {
                      cellClass = "bg-purple-600 text-white font-bold rounded-full shadow-md shadow-purple-500/30 scale-105";
                    } else if (d === 15) {
                      cellClass = "bg-purple-100 text-purple-700 font-extrabold rounded-full border border-purple-300";
                    } else if (d === 20) {
                      cellClass = "bg-slate-100 text-slate-800 font-extrabold rounded-full border border-slate-300";
                    } else {
                      cellClass = "bg-indigo-50 text-indigo-700 font-bold rounded-full border border-indigo-200";
                    }
                  }

                  if (isSelected) {
                    cellClass += " ring-2 ring-purple-600 ring-offset-2 scale-110 z-10";
                  }

                  return (
                    <button
                      key={`curr-${d}`}
                      onClick={() => handleCalendarDayClick(d)}
                      className={`h-9 w-9 mx-auto flex items-center justify-center text-xs transition-all cursor-pointer relative ${cellClass}`}
                    >
                      <span>{d}</span>
                      {driveOnDate && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 absolute bottom-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Date Detail Banner inside Calendar */}
          {selectedDate ? (
            <div className="mt-6 p-4 bg-purple-50/90 rounded-2xl border border-purple-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {selectedDate.split("-")[2]}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {drives.find((d) => d.date === selectedDate)
                      ? `${drives.find((d) => d.date === selectedDate)?.company} - Drive Scheduled`
                      : "No drives scheduled for this day"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {drives.find((d) => d.date === selectedDate)
                      ? `Role: ${drives.find((d) => d.date === selectedDate)?.role} • Package: ${drives.find((d) => d.date === selectedDate)?.packageLPA} LPA`
                      : `Selected Date: ${selectedDate}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-extrabold text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Click any date with a drive indicator to filter upcoming campus drives.</span>
              <span className="font-semibold text-purple-600">
                {MONTH_NAMES[currentMonthIndex]} {currentYear}
              </span>
            </div>
          )}
        </div>

        {/* Right: AI Insights Card */}
        <div className="lg:col-span-4 bg-gradient-to-b from-purple-50/70 via-purple-50/30 to-white p-6 rounded-2xl border border-purple-100 shadow-sm shadow-purple-500/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
                <h2 className="text-xs font-extrabold tracking-wider text-purple-700 uppercase">
                  AI Insights &amp; Predictive Engine
                </h2>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                96% Confidence
              </span>
            </div>

            {/* Insight Box 1: Upcoming Hiring Peak */}
            <div className="bg-purple-50/90 p-4 rounded-xl border border-purple-100/90 mb-3.5 shadow-xs">
              <h3 className="text-xs font-extrabold text-slate-900 mb-1">
                Upcoming Hiring Peak
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We predict a 25% increase in Fintech campus drives between Mar 15 - Apr 10. Recommend scheduling pre-placement talks now.
              </p>
            </div>

            {/* Insight Box 2: Skill Gap Identified + Schedule Workshop CTA */}
            <div className="bg-purple-50/90 p-4 rounded-xl border border-purple-100/90 mb-4 shadow-xs space-y-2.5">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 mb-1">
                  Skill Gap Identified
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Data Engineering roles have 40% higher vacancy but candidate readiness is at 28%. Urgent workshop recommended.
                </p>
              </div>
              <button
                onClick={() => setIsWorkshopModalOpen(true)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Schedule Recommended Workshop</span>
              </button>
            </div>
          </div>

          {/* View Predictive Model CTA */}
          <button
            onClick={() => setIsPredictiveModelOpen(true)}
            className="w-full py-2.5 bg-purple-100/90 hover:bg-purple-200 text-purple-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Predictive Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row (Upcoming Campus Drives Table & Live Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Campus Drives Table (~65% width) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Campus Drives
              </h2>
              {selectedDate && (
                <span className="text-xs text-purple-700 font-bold">
                  Filtered by Date: {selectedDate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Table Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 text-xs font-semibold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Negotiating">Negotiating</option>
                <option value="Tentative">Tentative</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => onNavigateView && onNavigateView("jobs")}
                className="text-xs font-extrabold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer px-2 py-1"
              >
                View All
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-bold">Company</th>
                  <th className="pb-3 px-4 font-bold">Date</th>
                  <th className="pb-3 px-4 font-bold">Job Role</th>
                  <th className="pb-3 px-4 font-bold">Package (LPA)</th>
                  <th className="pb-3 pl-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium">
                {filteredDrives.length > 0 ? (
                  filteredDrives.map((drive) => (
                    <tr
                      key={drive.id}
                      onClick={() => setSelectedDriveDrawer(drive)}
                      className="hover:bg-purple-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${drive.logoBg} font-extrabold text-xs flex items-center justify-center shadow-xs`}
                          >
                            {drive.logoLetter}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-purple-700">
                            {drive.company}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {drive.formattedDate}
                      </td>

                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {drive.role}
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-extrabold">
                        {drive.packageLPA}
                      </td>

                      {/* Inline Editable Status Badge */}
                      <td
                        className="py-3.5 pl-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={drive.status}
                          onChange={(e) =>
                            handleStatusChange(
                              drive.id,
                              e.target.value as CampusDriveItem["status"]
                            )
                          }
                          className={`font-bold text-[10px] px-2.5 py-1 rounded-full border border-transparent focus:outline-none cursor-pointer ${
                            drive.status === "Confirmed"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : drive.status === "Negotiating"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : drive.status === "Tentative"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-emerald-100 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Tentative">Tentative</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium text-xs">
                      No campus drives match the selected date or search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Activities Feed (~35% width) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-purple-500/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Recent Activities
              </h2>
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="relative group">
                  <span
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${act.dotColor} ring-4 ring-white`}
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal mt-0.5">
                      {act.desc}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 block mt-1">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View Activity Log CTA */}
          <button
            onClick={() => setIsActivityLogDrawerOpen(true)}
            className="w-full mt-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            View Activity Log
          </button>
        </div>
      </div>

      {/* Footer Disclaimer & Links */}
      <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>© 2025 C2C. Verified Industry Partnership Network.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-purple-600 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-purple-600 transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-purple-600 transition-colors">
            Support Center
          </a>
        </div>
      </div>

      {/* MODAL 1: Metric Drill-Down Modal */}
      {activeMetricModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900 uppercase">
                  {activeMetricModal} Metrics Drill-Down
                </h3>
              </div>
              <button
                onClick={() => setActiveMetricModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Department-wise breakdown for {selectedSession}:
            </p>

            <div className="space-y-3">
              {sessionMetrics.readinessDeptBreakdown.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{item.dept}</span>
                    <span className="text-purple-700">{item.readiness}% Readiness</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full"
                      style={{ width: `${item.readiness}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium text-right">
                    Total Enrolled: {item.students} candidates
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveMetricModal(null)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Drive Overview Slide-Over Drawer */}
      {selectedDriveDrawer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-white h-full max-w-md w-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${selectedDriveDrawer.logoBg} font-black text-sm flex items-center justify-center`}>
                  {selectedDriveDrawer.logoLetter}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{selectedDriveDrawer.company}</h2>
                  <span className="text-xs text-purple-600 font-bold">{selectedDriveDrawer.role}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriveDrawer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-purple-50/70 p-3.5 rounded-2xl text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Eligible</span>
                <div className="text-base font-black text-slate-900">{selectedDriveDrawer.eligibleCount}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Applied</span>
                <div className="text-base font-black text-indigo-600">{selectedDriveDrawer.appliedCount}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
                <div className="text-base font-black text-purple-700">{selectedDriveDrawer.shortlistedCount}</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-400 block mb-1">Package LPA</span>
                <span className="text-sm font-extrabold text-slate-900">{selectedDriveDrawer.packageLPA} LPA</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-400 block mb-1">Venue Details</span>
                <span className="font-medium text-slate-800">{selectedDriveDrawer.venue}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-400 block mb-1">Drive Description</span>
                <p className="text-slate-600 leading-relaxed font-medium">{selectedDriveDrawer.description}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-2">Shortlisted Student Preview</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDriveDrawer.shortlistedStudents.map((st, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 font-bold text-[10px] px-2.5 py-1 rounded-md">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  showToast(`Notification sent to ${selectedDriveDrawer.shortlistedCount} shortlisted candidates.`);
                  setSelectedDriveDrawer(null);
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Notify Shortlisted Candidates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AI Predictive Engine Model */}
      {isPredictiveModelOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 fill-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  AI Predictive Hiring Engine (2026 Season)
                </h3>
              </div>
              <button
                onClick={() => setIsPredictiveModelOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Based on historical hiring patterns, recruiter inquiry logs, and industry macro-trends:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-100">
                <span className="font-bold text-purple-700 block">Fintech &amp; Banking</span>
                <div className="text-lg font-black text-slate-900 mt-1">+25% Growth</div>
                <p className="text-[11px] text-slate-500 mt-0.5">High demand for Python &amp; Data Engineering.</p>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-700 block">E-Commerce &amp; Cloud</span>
                <div className="text-lg font-black text-slate-900 mt-1">+18% Growth</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Focus on AWS, DevOps &amp; Microservices.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-700 block">Core Engineering</span>
                <div className="text-lg font-black text-slate-900 mt-1">+12% Growth</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Mechatronics &amp; VLSI specialized roles.</p>
              </div>

              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">AI &amp; Machine Learning</span>
                <div className="text-lg font-black text-slate-900 mt-1">+40% Growth</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Urgent demand for PyTorch &amp; LLM Fine-tuning.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsPredictiveModelOpen(false)}
                className="px-5 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Model Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Schedule Recommended Workshop */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Schedule Remedial Workshop</h3>
              </div>
              <button
                onClick={() => setIsWorkshopModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleWorkshop} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Workshop Title</label>
                <input
                  type="text"
                  required
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={workshopDate}
                  onChange={(e) => setWorkshopDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWorkshopModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-md"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Comprehensive Activity Log Slide-Over Drawer */}
      {isActivityLogDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-end">
          <div className="bg-white h-full max-w-md w-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">System Activity Audit Log</h2>
              <button
                onClick={() => setIsActivityLogDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-normal">
                    {act.desc}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                    Category: {act.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsActivityLogDrawerOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
