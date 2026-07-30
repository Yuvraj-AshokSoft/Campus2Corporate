import React, { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Brain,
  Sparkles,
  UserPlus,
  GraduationCap,
  Search,
  Download,
  Bell,
  Plus,
  Trash2,
  Check,
  X,
  Building,
  TrendingUp,
  BarChart3,
  Target,
  FileSpreadsheet,
  Zap,
  CheckSquare,
  ShieldCheck,
  Briefcase,
  Menu,
  Activity
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

// ─── TYPES & INTERFACES ────────────────────────────────────────────────────────
export type PortalTab =
  | "overview"
  | "students"
  | "analytics"
  | "eligible"
  | "recruiters"
  | "placement"
  | "departments"
  | "reports";

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  role: "TPO Officer" | "HOD Admin" | "System Admin";
  department: string;
  email: string;
  phone: string;
  accessLevel: "Full Access" | "Department Level" | "Read Only";
  status: "Active" | "Pending Approval";
  verifiedDate: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  email: string;
  department: string;
  semester: number;
  skills: string[];
  learningProgress: number; // 0-100%
  avgAssessmentScore: number; // 0-100
  overallSkillScore: number; // 0-100
  placementStatus: "Placed" | "Eligible & Ready" | "In Pipeline" | "Needs Improvement";
  // Automated Eligibility Criteria
  assessmentsCompleted: boolean;
  profileCompleted: boolean;
  resumeVerified: boolean;
  isReleasedToRecruiters: boolean;
  // Progress Details
  coursesCompleted: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  leetcodeRating: number;
  githubCommits: number;
  skillBreakdown: {
    java: number;
    dsa: number;
    webDev: number;
    systemDesign: number;
    aptitude: number;
  };
}

export interface CorporateDrive {
  id: string;
  company: string;
  logoUrl?: string;
  role: string;
  date: string;
  packageLPA: string;
  branchesAllowed: string;
  shortlistedCount: number;
  status: "Upcoming Drive" | "Live Interviewing" | "Completed" | "Pending Release";
  hiredCount: number;
}

export interface DepartmentStat {
  deptCode: string;
  deptName: string;
  hodName: string;
  totalStudents: number;
  eligibleStudents: number;
  placedStudents: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  topSkills: string[];
}

// ─── INITIAL MOCK DATA ─────────────────────────────────────────────────────────
const INITIAL_STAFF: StaffMember[] = [
  {
    id: "STF-101",
    name: "Dr. Sarah Jenkins",
    designation: "Head of Training & Placement",
    role: "System Admin",
    department: "Central Placement Cell",
    email: "sarah.jenkins@apex.edu",
    phone: "+91 98765 43210",
    accessLevel: "Full Access",
    status: "Active",
    verifiedDate: "15 Jan 2024"
  },
  {
    id: "STF-102",
    name: "Prof. Rajesh Kumar",
    designation: "Senior TPO Officer",
    role: "TPO Officer",
    department: "Computer Science & IT",
    email: "rajesh.k@apex.edu",
    phone: "+91 98123 45678",
    accessLevel: "Full Access",
    status: "Active",
    verifiedDate: "10 Feb 2024"
  },
  {
    id: "STF-103",
    name: "Dr. Ananya Rao",
    designation: "Head of Department (CSE)",
    role: "HOD Admin",
    department: "Computer Science",
    email: "ananya.rao@apex.edu",
    phone: "+91 97654 32109",
    accessLevel: "Department Level",
    status: "Active",
    verifiedDate: "01 Mar 2024"
  },
  {
    id: "STF-104",
    name: "Prof. Vikram Malhotra",
    designation: "Head of Department (ME)",
    role: "HOD Admin",
    department: "Mechanical Engineering",
    email: "vikram.m@apex.edu",
    phone: "+91 98989 12345",
    accessLevel: "Department Level",
    status: "Active",
    verifiedDate: "18 Mar 2024"
  },
  {
    id: "STF-105",
    name: "Neha Mehta",
    designation: "Assistant TPO Coordinator",
    role: "TPO Officer",
    department: "Electronics & Communication",
    email: "neha.mehta@apex.edu",
    phone: "+91 91234 56789",
    accessLevel: "Read Only",
    status: "Pending Approval",
    verifiedDate: "25 Jul 2026"
  }
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-001",
    name: "Rahul Sharma",
    rollNo: "2021-CSE-042",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    email: "rahul.sharma@student.apex.edu",
    department: "Computer Science",
    semester: 7,
    skills: ["Java", "DSA", "React", "System Design"],
    learningProgress: 88,
    avgAssessmentScore: 86,
    overallSkillScore: 88,
    placementStatus: "Eligible & Ready",
    assessmentsCompleted: true,
    profileCompleted: true,
    resumeVerified: true,
    isReleasedToRecruiters: true,
    coursesCompleted: 18,
    assignmentsSubmitted: 42,
    totalAssignments: 44,
    leetcodeRating: 1850,
    githubCommits: 340,
    skillBreakdown: { java: 85, dsa: 78, webDev: 90, systemDesign: 82, aptitude: 86 }
  },
  {
    id: "STU-002",
    name: "Priya Patel",
    rollNo: "2021-ECE-018",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    email: "priya.patel@student.apex.edu",
    department: "Electronics & Comm",
    semester: 7,
    skills: ["Python", "C++", "VLSI", "Aptitude"],
    learningProgress: 92,
    avgAssessmentScore: 90,
    overallSkillScore: 91,
    placementStatus: "Placed",
    assessmentsCompleted: true,
    profileCompleted: true,
    resumeVerified: true,
    isReleasedToRecruiters: true,
    coursesCompleted: 20,
    assignmentsSubmitted: 45,
    totalAssignments: 45,
    leetcodeRating: 1920,
    githubCommits: 410,
    skillBreakdown: { java: 72, dsa: 88, webDev: 80, systemDesign: 85, aptitude: 94 }
  },
  {
    id: "STU-003",
    name: "Aniket Verma",
    rollNo: "2021-ME-055",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    email: "aniket.v@student.apex.edu",
    department: "Mechanical Eng",
    semester: 7,
    skills: ["AutoCAD", "Python", "Data Analysis"],
    learningProgress: 68,
    avgAssessmentScore: 72,
    overallSkillScore: 71,
    placementStatus: "Eligible & Ready",
    assessmentsCompleted: true,
    profileCompleted: true,
    resumeVerified: true,
    isReleasedToRecruiters: false,
    coursesCompleted: 14,
    assignmentsSubmitted: 32,
    totalAssignments: 40,
    leetcodeRating: 1420,
    githubCommits: 110,
    skillBreakdown: { java: 60, dsa: 65, webDev: 70, systemDesign: 68, aptitude: 75 }
  },
  {
    id: "STU-004",
    name: "Sneha Reddy",
    rollNo: "2021-IT-029",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    email: "sneha.reddy@student.apex.edu",
    department: "Information Tech",
    semester: 7,
    skills: ["Node.js", "MongoDB", "React", "Docker"],
    learningProgress: 84,
    avgAssessmentScore: 82,
    overallSkillScore: 85,
    placementStatus: "Placed",
    assessmentsCompleted: true,
    profileCompleted: true,
    resumeVerified: true,
    isReleasedToRecruiters: true,
    coursesCompleted: 17,
    assignmentsSubmitted: 40,
    totalAssignments: 42,
    leetcodeRating: 1760,
    githubCommits: 290,
    skillBreakdown: { java: 80, dsa: 82, webDev: 92, systemDesign: 84, aptitude: 85 }
  },
  {
    id: "STU-005",
    name: "Rohan Gupta",
    rollNo: "2021-CSE-102",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    email: "rohan.gupta@student.apex.edu",
    department: "Computer Science",
    semester: 7,
    skills: ["Java", "SQL"],
    learningProgress: 55,
    avgAssessmentScore: 62,
    overallSkillScore: 64,
    placementStatus: "Needs Improvement",
    assessmentsCompleted: false,
    profileCompleted: true,
    resumeVerified: false,
    isReleasedToRecruiters: false,
    coursesCompleted: 11,
    assignmentsSubmitted: 25,
    totalAssignments: 40,
    leetcodeRating: 1200,
    githubCommits: 65,
    skillBreakdown: { java: 65, dsa: 58, webDev: 60, systemDesign: 52, aptitude: 68 }
  },
  {
    id: "STU-006",
    name: "Kavya Swaminathan",
    rollNo: "2021-CE-012",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    email: "kavya.s@student.apex.edu",
    department: "Civil Engineering",
    semester: 7,
    skills: ["STAAD Pro", "Python", "Project Mgmt"],
    learningProgress: 76,
    avgAssessmentScore: 78,
    overallSkillScore: 79,
    placementStatus: "In Pipeline",
    assessmentsCompleted: true,
    profileCompleted: true,
    resumeVerified: true,
    isReleasedToRecruiters: true,
    coursesCompleted: 15,
    assignmentsSubmitted: 36,
    totalAssignments: 40,
    leetcodeRating: 1350,
    githubCommits: 95,
    skillBreakdown: { java: 55, dsa: 68, webDev: 70, systemDesign: 72, aptitude: 85 }
  }
];

const INITIAL_DRIVES: CorporateDrive[] = [
  {
    id: "DRV-501",
    company: "Google India",
    role: "Software Development Engineer (SDE-1)",
    date: "15 Aug 2026",
    packageLPA: "44.5 LPA",
    branchesAllowed: "CS • IT • ECE",
    shortlistedCount: 42,
    status: "Upcoming Drive",
    hiredCount: 0
  },
  {
    id: "DRV-502",
    company: "Microsoft",
    role: "Software Engineer & Security Associate",
    date: "22 Aug 2026",
    packageLPA: "38.0 LPA",
    branchesAllowed: "All Branches (Score ≥ 75%)",
    shortlistedCount: 58,
    status: "Live Interviewing",
    hiredCount: 8
  },
  {
    id: "DRV-503",
    company: "Amazon AWS",
    role: "Cloud Solutions Architect Specialist",
    date: "05 Sep 2026",
    packageLPA: "32.0 LPA",
    branchesAllowed: "CS • IT",
    shortlistedCount: 35,
    status: "Upcoming Drive",
    hiredCount: 0
  },
  {
    id: "DRV-504",
    company: "TCS Digital",
    role: "System Engineer & Prime Consultant",
    date: "10 Jul 2026",
    packageLPA: "9.0 LPA",
    branchesAllowed: "All Academic Streams",
    shortlistedCount: 180,
    status: "Completed",
    hiredCount: 42
  },
  {
    id: "DRV-505",
    company: "Deloitte USI",
    role: "Technology Advisory Consultant",
    date: "28 Jul 2026",
    packageLPA: "11.5 LPA",
    branchesAllowed: "CS • IT • ECE • ME",
    shortlistedCount: 65,
    status: "Pending Release",
    hiredCount: 15
  }
];

const DEPARTMENT_STATS: DepartmentStat[] = [
  {
    deptCode: "CS",
    deptName: "Computer Science",
    hodName: "Dr. Ananya Rao",
    totalStudents: 250,
    eligibleStudents: 180,
    placedStudents: 70,
    avgPackageLPA: 12.4,
    highestPackageLPA: 44.5,
    topSkills: ["Java", "DSA", "React", "System Design", "AWS"]
  },
  {
    deptCode: "IT",
    deptName: "Information Technology",
    hodName: "Dr. Ramesh Gupta",
    totalStudents: 120,
    eligibleStudents: 95,
    placedStudents: 45,
    avgPackageLPA: 10.8,
    highestPackageLPA: 32.0,
    topSkills: ["Node.js", "Python", "Cloud Computing", "SQL"]
  },
  {
    deptCode: "ECE",
    deptName: "Electronics & Communication",
    hodName: "Dr. Sunita Deshmukh",
    totalStudents: 150,
    eligibleStudents: 85,
    placedStudents: 30,
    avgPackageLPA: 8.5,
    highestPackageLPA: 24.0,
    topSkills: ["C++", "Embedded Systems", "VLSI", "Python"]
  },
  {
    deptCode: "ME",
    deptName: "Mechanical Engineering",
    hodName: "Prof. Vikram Malhotra",
    totalStudents: 180,
    eligibleStudents: 90,
    placedStudents: 25,
    avgPackageLPA: 6.8,
    highestPackageLPA: 14.0,
    topSkills: ["AutoCAD", "ANSYS", "Python", "Data Analysis"]
  },
  {
    deptCode: "CE",
    deptName: "Civil Engineering",
    hodName: "Prof. Hitesh Shah",
    totalStudents: 100,
    eligibleStudents: 50,
    placedStudents: 15,
    avgPackageLPA: 6.2,
    highestPackageLPA: 10.5,
    topSkills: ["STAAD Pro", "Revit", "Project Mgmt"]
  }
];

const PLACEMENT_TREND_DATA = [
  { month: "Jan", placed: 12, offers: 15, avgLPA: 6.5 },
  { month: "Feb", placed: 24, offers: 30, avgLPA: 7.2 },
  { month: "Mar", placed: 38, offers: 48, avgLPA: 7.8 },
  { month: "Apr", placed: 48, offers: 60, avgLPA: 8.0 },
  { month: "May", placed: 55, offers: 72, avgLPA: 8.1 },
  { month: "Jun", placed: 65, offers: 85, avgLPA: 8.2 }
];

export const CollegeDashboard: React.FC = () => {
  // ─── STATE MANAGEMENT ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [drives] = useState<CorporateDrive[]>(INITIAL_DRIVES);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("STU-001");

  // Filter States (Student Monitoring & Gateway)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [minSkillScore] = useState(0);

  // Selection state for Bulk Approval Gateway
  const [selectedEligibleIds, setSelectedEligibleIds] = useState<string[]>([]);

  // Modal States
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    designation: "",
    role: "TPO Officer" as StaffMember["role"],
    department: "Computer Science",
    email: "",
    phone: "",
    accessLevel: "Full Access" as StaffMember["accessLevel"]
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Selected Student Object for Drill-down
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Filtered Students for Directory
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDept = selectedDeptFilter === "All" || s.department === selectedDeptFilter;
      const matchesStatus = selectedStatusFilter === "All" || s.placementStatus === selectedStatusFilter;
      const matchesScore = s.overallSkillScore >= minSkillScore;
      return matchesSearch && matchesDept && matchesStatus && matchesScore;
    });
  }, [students, searchQuery, selectedDeptFilter, selectedStatusFilter, minSkillScore]);

  // System Auto-Audited Placement Ready Candidates (Eligibility Gateway)
  const autoEligibleCandidates = useMemo(() => {
    return students.filter(
      (s) => s.overallSkillScore >= 70 && s.assessmentsCompleted && s.profileCompleted && s.resumeVerified
    );
  }, [students]);

  // Handler: Add Staff Member
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email) return;

    const newStaff: StaffMember = {
      id: `STF-${Math.floor(100 + Math.random() * 900)}`,
      name: newStaffForm.name,
      designation: newStaffForm.designation || "Placement Officer",
      role: newStaffForm.role,
      department: newStaffForm.department,
      email: newStaffForm.email,
      phone: newStaffForm.phone || "+91 90000 00000",
      accessLevel: newStaffForm.accessLevel,
      status: "Active",
      verifiedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    };

    setStaffList([newStaff, ...staffList]);
    setIsAddStaffModalOpen(false);
    setNewStaffForm({
      name: "",
      designation: "",
      role: "TPO Officer",
      department: "Computer Science",
      email: "",
      phone: "",
      accessLevel: "Full Access"
    });
    triggerToast(`Added ${newStaff.name} as ${newStaff.role}!`);
  };

  // Handler: Remove Staff Member
  const handleRemoveStaff = (id: string, name: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    triggerToast(`Removed staff member: ${name}`);
  };

  // Handler: Bulk Release Students to Corporate Recruiters
  const handleBulkReleaseStudents = () => {
    if (selectedEligibleIds.length === 0) {
      triggerToast("Please select at least one eligible student candidate!");
      return;
    }

    setStudents((prev) =>
      prev.map((s) => (selectedEligibleIds.includes(s.id) ? { ...s, isReleasedToRecruiters: true } : s))
    );

    triggerToast(`Successfully released ${selectedEligibleIds.length} verified candidate profiles to corporate recruiters!`);
    setSelectedEligibleIds([]);
  };

  // Handler: Instant AI Re-audit
  const handleRunAiAudit = () => {
    triggerToast("AI Eligibility Audit triggered! 500 student profiles re-verified against placement rules.");
  };

  // Handler: CSV Exporter
  const handleExportCSV = (reportName: string) => {
    let csvData = "";
    if (reportName.includes("Student")) {
      csvData = "ID,Name,RollNo,Department,Semester,SkillScore,PlacementStatus,ReleasedToRecruiters\n";
      students.forEach((s) => {
        csvData += `"${s.id}","${s.name}","${s.rollNo}","${s.department}",${s.semester},${s.overallSkillScore},"${s.placementStatus}",${s.isReleasedToRecruiters}\n`;
      });
    } else if (reportName.includes("Department")) {
      csvData = "DeptCode,DeptName,HOD,TotalStudents,Eligible,Placed,AvgPackageLPA,HighestPackageLPA\n";
      DEPARTMENT_STATS.forEach((d) => {
        csvData += `"${d.deptCode}","${d.deptName}","${d.hodName}",${d.totalStudents},${d.eligibleStudents},${d.placedStudents},${d.avgPackageLPA},${d.highestPackageLPA}\n`;
      });
    } else {
      csvData = "Company,Role,Date,PackageLPA,Shortlisted,Status,Hired\n";
      drives.forEach((dr) => {
        csvData += `"${dr.company}","${dr.role}","${dr.date}","${dr.packageLPA}",${dr.shortlistedCount},"${dr.status}",${dr.hiredCount}\n`;
      });
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportName.replace(/\s+/g, "_")}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Downloaded ${reportName} (CSV format)!`);
  };

  const handleExportPDF = (reportName: string) => {
    triggerToast(`Generating PDF export for "${reportName}"... File download initiated.`);
  };

  // Nav Items Config
  const navItems: { id: PortalTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "overview", label: "Overview & Verification", icon: <Building2 className="w-5 h-5" />, badge: "Approved" },
    { id: "students", label: "Student Monitoring", icon: <Users className="w-5 h-5" />, badge: "500" },
    { id: "analytics", label: "Skill & Progress Analytics", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "eligible", label: "Eligible Students Gateway", icon: <Target className="w-5 h-5" />, badge: "180 Ready" },
    { id: "recruiters", label: "Recruiter Activity", icon: <Briefcase className="w-5 h-5" />, badge: "12 Drives" },
    { id: "placement", label: "Placement Tracking", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "departments", label: "Department Analytics", icon: <Building className="w-5 h-5" /> },
    { id: "reports", label: "Performance Reports", icon: <FileSpreadsheet className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5FF] text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ─── TOAST NOTIFICATION ───────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-300/30 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── TOP HEADER BAR ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl text-purple-900 hover:bg-purple-100/60 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-2">
                Apex Institute of Technology
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> NBA & NAAC A+
                </span>
              </h1>
              <p className="text-xs text-purple-700/80 font-medium">Central TPO & Academic Governance Hub</p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, roll no, or drive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-purple-50/50 border border-purple-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={handleRunAiAudit}
            className="hidden lg:flex items-center gap-1.5 bg-purple-100/80 hover:bg-purple-200 text-purple-900 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            AI Audit Run
          </button>

          <div className="relative">
            <button className="p-2 rounded-xl text-slate-600 hover:bg-purple-50 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-purple-100">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              SJ
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-purple-700 font-semibold">Chief TPO & Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── BODY LAYOUT WITH SIDEBAR ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* 📌 Left Navigation Sidebar (Portal Switcher) */}
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-64"
          } transition-all duration-300 bg-white/90 backdrop-blur-md border-r border-purple-100 flex flex-col justify-between shrink-0 shadow-xs z-30`}
        >
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-purple-900/60 uppercase">
              {!sidebarCollapsed ? "Internal Portals" : "Portals"}
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                      : "text-slate-700 hover:bg-purple-100/60 hover:text-purple-900"
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-purple-700"}>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          {!sidebarCollapsed && (
            <div className="p-3 m-3 bg-purple-50/70 border border-purple-100 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Campus2Corporate</span>
                <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">v4.2</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Official TPO Portal Workflow for Accreditation & Multi-portal Management.
              </p>
            </div>
          )}
        </aside>

        {/* ─── MAIN PORTAL WORKSPACE CANVAS ─────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* PORTAL 1: REGISTRATION & VERIFICATION (activeTab === 'overview') */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Status Indicator Card */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                          Verification Status: Admin Approved
                        </span>
                        <span className="text-xs text-slate-500 font-medium">AISHE Code: C-41209</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                        Apex Institute of Technology & Engineering
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Verified Autonomous University • NAAC A+ Grade • NBA Accredited Programs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddStaffModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Staff Member
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Authorized Staff</span>
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{staffList.length}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified Accounts</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Active TPO Officers</span>
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">
                    {staffList.filter((s) => s.role === "TPO Officer").length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Managing Drives & Placements</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">HOD Department Admins</span>
                    <Building className="w-4 h-4 text-indigo-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">
                    {staffList.filter((s) => s.role === "HOD Admin").length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Academic Stream Oversight</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Compliance Audit</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-2">Pass</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">All Security Audits Up to Date</p>
                </div>
              </div>

              {/* Authorized Staff & Department Management Table */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Authorized Staff & Department Governance</h3>
                    <p className="text-xs text-slate-500">Manage TPO members, HOD admins, and internal access permissions.</p>
                  </div>
                  <button
                    onClick={() => setIsAddStaffModalOpen(true)}
                    className="bg-purple-100 text-purple-900 hover:bg-purple-200 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add TPO / HOD Member
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-purple-50/60 text-purple-900 font-bold border-b border-purple-100">
                        <th className="py-3 px-4 rounded-l-xl">Staff Member</th>
                        <th className="py-3 px-4">Role / Designation</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Access Level</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {staffList.map((member) => (
                        <tr key={member.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{member.name}</div>
                            <div className="text-[10px] text-slate-400">ID: {member.id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{member.designation}</div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                                member.role === "System Admin"
                                  ? "bg-blue-100 text-blue-800"
                                  : member.role === "HOD Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">{member.department}</td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">{member.email}</div>
                            <div className="text-[10px] text-slate-400">{member.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[10px]">
                              {member.accessLevel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                                member.status === "Active"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {member.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleRemoveStaff(member.id, member.name)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Revoke Staff Access"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 2: STUDENT MONITORING PORTAL (activeTab === 'students') */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fade-in">
              {/* High-Level Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Total Enrolled Students</span>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-2">500</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Across 5 Academic Streams</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Active Students</span>
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-2">420</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">84% Engagement Rate</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Placement Eligible</span>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-2">180</p>
                  <p className="text-xs text-purple-600 font-semibold mt-1">Skill Score ≥ 70%</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Placed Students</span>
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 mt-2">65</p>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">Offers Secured (Avg 8.2 LPA)</p>
                </div>
              </div>

              {/* Directory Filter Bar */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student by name, roll no, skill..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    <select
                      value={selectedDeptFilter}
                      onChange={(e) => setSelectedDeptFilter(e.target.value)}
                      className="px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Tech">Information Tech</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                      <option value="Mechanical Eng">Mechanical Eng</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>

                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Placement Statuses</option>
                      <option value="Placed">Placed</option>
                      <option value="Eligible & Ready">Eligible & Ready</option>
                      <option value="In Pipeline">In Pipeline</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                    </select>

                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDeptFilter("All");
                        setSelectedStatusFilter("All");
                      }}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-purple-100/50 rounded-xl transition-colors text-xs font-semibold"
                      title="Reset Filters"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Directory Table */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Student Directory ({filteredStudents.length})</h3>
                  <span className="text-xs text-purple-700 font-semibold">Showing real-time academic monitoring</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-purple-50/60 text-purple-900 font-bold border-b border-purple-100">
                        <th className="py-3 px-4 rounded-l-xl">Basic Profile</th>
                        <th className="py-3 px-4">Department & Sem</th>
                        <th className="py-3 px-4">Verified Skills</th>
                        <th className="py-3 px-4">Learning Progress %</th>
                        <th className="py-3 px-4">Assessment Score</th>
                        <th className="py-3 px-4">Overall Skill Score</th>
                        <th className="py-3 px-4">Placement Status</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover border border-purple-200" />
                              <div>
                                <div className="font-bold text-slate-900">{s.name}</div>
                                <div className="text-[10px] text-slate-400">{s.rollNo}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{s.department}</div>
                            <div className="text-[10px] text-purple-700 font-medium">Semester {s.semester}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {s.skills.map((sk) => (
                                <span
                                  key={sk}
                                  className="bg-purple-100/70 text-purple-900 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-purple-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${s.learningProgress}%` }}
                                />
                              </div>
                              <span className="font-bold text-slate-800 text-[11px]">{s.learningProgress}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{s.avgAssessmentScore}/100</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-black text-xs px-2.5 py-1 rounded-lg ${
                                s.overallSkillScore >= 85
                                  ? "bg-emerald-100 text-emerald-800"
                                  : s.overallSkillScore >= 70
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {s.overallSkillScore}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-bold text-[10px] px-2.5 py-1 rounded-full ${
                                s.placementStatus === "Placed"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : s.placementStatus === "Eligible & Ready"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : s.placementStatus === "In Pipeline"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {s.placementStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedStudentId(s.id);
                                setActiveTab("analytics");
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                            >
                              View Analytics
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 3: STUDENT PROGRESS ANALYTICS (activeTab === 'analytics') */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              {/* Student Drill-Down Selector Bar */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Individual Student Progress Drill-Down</h2>
                  <p className="text-xs text-slate-500">Track course completion, coding stats, test history & AI skill breakdown.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Select Student:</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-blue-900 focus:outline-none"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.department} • {st.rollNo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Header Card */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={activeStudent.avatar}
                    alt={activeStudent.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">{activeStudent.name}</h3>
                      <span className="bg-purple-100 text-purple-900 font-bold text-xs px-2.5 py-0.5 rounded-full">
                        {activeStudent.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Roll No: <span className="font-semibold text-slate-800">{activeStudent.rollNo}</span> • Semester{" "}
                      <span className="font-semibold text-slate-800">{activeStudent.semester}</span> • Email:{" "}
                      <span className="font-semibold text-slate-800">{activeStudent.email}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-purple-50/70 border border-purple-100 p-4 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider">AI Skill Score</span>
                    <p className="text-3xl font-black text-blue-600 mt-0.5">{activeStudent.overallSkillScore}%</p>
                  </div>
                  <div className="h-8 w-px bg-purple-200" />
                  <div className="text-center">
                    <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider">LeetCode Rating</span>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{activeStudent.leetcodeRating}</p>
                  </div>
                </div>
              </div>

              {/* Skill Domain Progress Bars & Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Bars for Skill Domains */}
                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    Domain Proficiency Breakdown
                  </h4>

                  <div className="space-y-3.5 text-xs font-semibold">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-700">
                        <span>Java & Core OOP</span>
                        <span className="text-blue-600 font-bold">{activeStudent.skillBreakdown.java}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${activeStudent.skillBreakdown.java}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-700">
                        <span>Data Structures & Algorithms (DSA)</span>
                        <span className="text-blue-600 font-bold">{activeStudent.skillBreakdown.dsa}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${activeStudent.skillBreakdown.dsa}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-700">
                        <span>Web Development (React/Node)</span>
                        <span className="text-blue-600 font-bold">{activeStudent.skillBreakdown.webDev}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${activeStudent.skillBreakdown.webDev}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-700">
                        <span>System Design & Architecture</span>
                        <span className="text-blue-600 font-bold">{activeStudent.skillBreakdown.systemDesign}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${activeStudent.skillBreakdown.systemDesign}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-700">
                        <span>Aptitude & Logical Reasoning</span>
                        <span className="text-blue-600 font-bold">{activeStudent.skillBreakdown.aptitude}%</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${activeStudent.skillBreakdown.aptitude}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI Radar Competency Mapping
                  </h4>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { subject: "Java", A: activeStudent.skillBreakdown.java },
                          { subject: "DSA", A: activeStudent.skillBreakdown.dsa },
                          { subject: "Web Dev", A: activeStudent.skillBreakdown.webDev },
                          { subject: "System Design", A: activeStudent.skillBreakdown.systemDesign },
                          { subject: "Aptitude", A: activeStudent.skillBreakdown.aptitude }
                        ]}
                      >
                        <PolarGrid stroke="#e9d5ff" />
                        <PolarAngleAxis dataKey="subject" stroke="#6b21a8" tick={{ fontSize: 11, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name={activeStudent.name} dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 4: AUTOMATED ELIGIBLE STUDENTS GATEWAY (activeTab === 'eligible') */}
          {activeTab === "eligible" && (
            <div className="space-y-6 animate-fade-in">
              {/* Gate Rules Banner */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <span className="bg-blue-500/30 text-blue-200 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-400/30">
                      Automated Eligibility Gateway
                    </span>
                    <h2 className="text-xl font-black mt-2">Placement Eligibility Audit Engine</h2>
                    <p className="text-xs text-purple-200 mt-1 max-w-2xl">
                      System automatically audits candidates against strict criteria: Skill Score ≥ 70%, Completed Core Assessments,
                      100% Profile Completion, and Verified Resume.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBulkReleaseStudents}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Bulk Approve ({selectedEligibleIds.length})
                    </button>
                  </div>
                </div>

                {/* Checklist Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-purple-700/50 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Skill Score ≥ 70%
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Required Assessments Passed
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> 100% Profile Completed
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Verified Resume Uploaded
                  </div>
                </div>
              </div>

              {/* Eligible Candidates Table */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      System Verified Placement Candidates ({autoEligibleCandidates.length})
                    </h3>
                    <p className="text-xs text-slate-500">Check boxes to bulk release profiles to corporate recruiters.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedEligibleIds.length === autoEligibleCandidates.length) {
                        setSelectedEligibleIds([]);
                      } else {
                        setSelectedEligibleIds(autoEligibleCandidates.map((c) => c.id));
                      }
                    }}
                    className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-purple-200 transition-colors"
                  >
                    {selectedEligibleIds.length === autoEligibleCandidates.length ? "Deselect All" : "Select All Candidates"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-purple-50/60 text-purple-900 font-bold border-b border-purple-100">
                        <th className="py-3 px-4 rounded-l-xl w-10">Select</th>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Skill Score</th>
                        <th className="py-3 px-4">Assessments</th>
                        <th className="py-3 px-4">Profile 100%</th>
                        <th className="py-3 px-4">Resume</th>
                        <th className="py-3 px-4 rounded-r-xl">Recruiter Access Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {autoEligibleCandidates.map((c) => {
                        const isSelected = selectedEligibleIds.includes(c.id);
                        return (
                          <tr key={c.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEligibleIds([...selectedEligibleIds, c.id]);
                                  } else {
                                    setSelectedEligibleIds(selectedEligibleIds.filter((id) => id !== c.id));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500 border-slate-300"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{c.name}</div>
                              <div className="text-[10px] text-slate-400">{c.rollNo}</div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800">{c.department}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-md text-xs">
                                {c.overallSkillScore}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-4 h-4" /> Passed
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-4 h-4" /> 100%
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-blue-600 font-bold flex items-center gap-1">
                                <FileText className="w-4 h-4" /> Verified PDF
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {c.isReleasedToRecruiters ? (
                                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-200">
                                  Released to Recruiters
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-1 rounded-full border border-amber-200">
                                  Pending Release
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 5: RECRUITER ACTIVITY PORTAL (activeTab === 'recruiters') */}
          {activeTab === "recruiters" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Recruiter Activity & Corporate Drive Pipeline</h2>
                  <p className="text-xs text-slate-500">Track active corporate engagements, interview sessions & offer letter releases.</p>
                </div>
              </div>

              {/* Corporate Drive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drives.map((d) => (
                  <div key={d.id} className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            d.status === "Live Interviewing"
                              ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
                              : d.status === "Upcoming Drive"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {d.status}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 mt-2">{d.company}</h3>
                        <p className="text-xs text-purple-900 font-semibold">{d.role}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-700 font-black text-xs px-2.5 py-1 rounded-xl border border-blue-100">
                        {d.packageLPA}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-purple-50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Drive Date:</span>
                        <span className="font-bold text-slate-800">{d.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Eligibility:</span>
                        <span className="font-semibold text-slate-800">{d.branchesAllowed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Shortlisted Candidates:</span>
                        <span className="font-bold text-blue-600">{d.shortlistedCount} Students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PORTAL 6: PLACEMENT TRACKING PORTAL (activeTab === 'placement') */}
          {activeTab === "placement" && (
            <div className="space-y-6 animate-fade-in">
              {/* Executive KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Highest Package</span>
                  <p className="text-3xl font-black text-blue-600 mt-2">44.5 LPA</p>
                  <p className="text-xs text-slate-500 mt-1">Google India • SDE-1</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Average Package</span>
                  <p className="text-3xl font-black text-emerald-600 mt-2">8.2 LPA</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">+14% YoY Growth</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Companies Visited</span>
                  <p className="text-3xl font-black text-purple-900 mt-2">45</p>
                  <p className="text-xs text-slate-500 mt-1">28 Core Engineering</p>
                </div>

                <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-bold text-slate-500">Placement % Rate</span>
                  <p className="text-3xl font-black text-indigo-600 mt-2">36.1%</p>
                  <p className="text-xs text-slate-500 mt-1">65 of 180 Eligible Placed</p>
                </div>
              </div>

              {/* Placement Trend Chart */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Placement Acceleration & Offer Growth</h3>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PLACEMENT_TREND_DATA}>
                      <defs>
                        <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="placed" stroke="#2563eb" fillOpacity={1} fill="url(#colorPlaced)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 7: DEPARTMENT ANALYTICS PORTAL (activeTab === 'departments') */}
          {activeTab === "departments" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Department Academic Analytics</h2>
                  <p className="text-xs text-slate-500">Comparative metrics for HODs & Placement Officers.</p>
                </div>
              </div>

              {/* Department Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {DEPARTMENT_STATS.map((dept) => (
                  <div key={dept.deptCode} className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 font-extrabold flex items-center justify-center text-xs">
                          {dept.deptCode}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">{dept.deptName}</h3>
                          <p className="text-[11px] text-slate-500">HOD: {dept.hodName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-purple-50/50 p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Students</span>
                        <p className="text-base font-extrabold text-slate-900">{dept.totalStudents}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Eligible</span>
                        <p className="text-base font-extrabold text-purple-900">{dept.eligibleStudents}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Placed</span>
                        <p className="text-base font-extrabold text-emerald-600">{dept.placedStudents}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold pt-1">
                      <span className="text-slate-500">Avg Package:</span>
                      <span className="text-blue-600 font-bold">{dept.avgPackageLPA} LPA</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparative Bar Chart */}
              <div className="bg-white/90 backdrop-blur-md border border-purple-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Comparative Placement Ratio Across Departments</h3>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEPARTMENT_STATS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="deptCode" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalStudents" fill="#cbd5e1" name="Total Students" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="eligibleStudents" fill="#a855f7" name="Eligible Students" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="placedStudents" fill="#2563eb" name="Placed Students" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PORTAL 8: PERFORMANCE REPORTS EXPORTER (activeTab === 'reports') */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Performance Reports Data Exporter</h2>
                <p className="text-xs text-slate-500">Download official institutional reports in PDF or real Excel (CSV) formats.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  "Student Progress Report",
                  "Placement & Salary Report",
                  "Assessment & Test Performance Report",
                  "Department Comparative Performance",
                  "Recruiter Activity & Corporate Drive Log",
                  "Automated Eligibility Audit Summary"
                ].map((title) => (
                  <div key={title} className="bg-white/90 backdrop-blur-md border border-purple-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900">{title}</h3>
                    </div>

                    <p className="text-xs text-slate-500">
                      Export unabridged data breakdown including timestamps, student roll numbers, test scores, and recruiter offers.
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleExportPDF(title)}
                        className="flex-1 bg-purple-100/70 hover:bg-purple-200 text-purple-900 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button
                        onClick={() => handleExportCSV(title)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Excel (CSV)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── ADD STAFF MODAL ────────────────────────────────────────────── */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-purple-100 animate-scale-up">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Add Authorized TPO / HOD Staff
              </h3>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Assistant TPO Officer"
                  value={newStaffForm.designation}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, designation: e.target.value })}
                  className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role Type</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as StaffMember["role"] })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TPO Officer">TPO Officer</option>
                    <option value="HOD Admin">HOD Admin</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Central Placement Cell">Central Placement Cell</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@apex.edu"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Level</label>
                <select
                  value={newStaffForm.accessLevel}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, accessLevel: e.target.value as StaffMember["accessLevel"] })}
                  className="w-full px-3 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full Access">Full Access</option>
                  <option value="Department Level">Department Level</option>
                  <option value="Read Only">Read Only</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;
