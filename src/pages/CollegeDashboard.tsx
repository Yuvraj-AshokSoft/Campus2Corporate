import React from "react";
import {
  Users,
  UserCheck,
  Award,
  Building2,
   CheckCircle2,
  FileText,
   CalendarDays,
  Calendar,
  Brain,

  Upload,
  Sparkles,
  UserPlus,
  ClipboardList,
  FileBarChart2,
   LayoutDashboard,
  GraduationCap,

  BookOpen,
  ClipboardCheck,
  Briefcase,
  
  BarChart3,
  
  Settings,
  ChevronRight,
    Clock,
  
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
   RadarChart,
  Radar,
 PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export const CollegeDashboard: React.FC = () => {


  const upcomingDrives = [
  {
    company: "Google",
    role: "Software Engineer",
    date: "12 Jul",
    branch: "CS • IT",
    students: 420,
  },
  {
    company: "Microsoft",
    role: "SDE Intern",
    date: "18 Jul",
    branch: "All Branches",
    students: 360,
  },
  {
    company: "Amazon",
    role: "Cloud Associate",
    date: "24 Jul",
    branch: "CS • IT • EC",
    students: 285,
  },
  {
    company: "Adobe",
    role: "Frontend Developer",
    date: "02 Aug",
    branch: "CS • IT",
    students: 198,
  },
];




  const aiInsights = [
  {
    title: "Placement rate increased by 4.8%",
    description: "Compared to the previous academic cycle.",
    color: "emerald",
  },
  {
    title: "Mechanical Department needs attention",
    description: "Placement readiness is below the institutional average.",
    color: "amber",
  },
  {
    title: "184 students are interview ready",
    description: "AI recommends scheduling recruiter interviews this week.",
    color: "indigo",
  },
  {
    title: "67 resumes require AI review",
    description: "Resume quality score below recommended threshold.",
    color: "violet",
  },
];




  const recruiterActivity = [
  {
    company: "Google",
    role: "Software Engineer",
    students: 48,
    status: "Interview",
    color: "bg-indigo-500",
  },
  {
    company: "Microsoft",
    role: "SDE Intern",
    students: 36,
    status: "Assessment",
    color: "bg-violet-500",
  },
  {
    company: "Amazon",
    role: "Cloud Associate",
    students: 28,
    status: "Shortlisted",
    color: "bg-blue-500",
  },
  {
    company: "Infosys",
    role: "System Engineer",
    students: 62,
    status: "Campus Drive",
    color: "bg-emerald-500",
  },
  {
    company: "TCS",
    role: "Digital Role",
    students: 74,
    status: "Hiring",
    color: "bg-purple-500",
  },
];


  const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
      title: "Mentorship",
       icon: UserCheck 
  },

  {
    title: "Departments",
    icon: Building2,
  },
  {
    title: "Students",
    icon: GraduationCap,
  },
  {
    title: "Courses",
    icon: BookOpen,
  },
  {
    title: "Assessments",
    icon: ClipboardCheck,
  },
  {
    title: "Placements",
    icon: Briefcase,
  },
  {
    title: "Recruiters",
    icon: Users,
  },
   { title: "Scholarships", icon: Award },

  { 
      title: "Events", icon: Calendar
  },

  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    icon: FileBarChart2,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];


const analyticsData = [
  {
    subject: "Admissions",
    current: 92,
    target: 100,
  },
  {
    subject: "Academics",
    current: 84,
    target: 95,
  },
  {
    subject: "Placements",
    current: 88,
    target: 96,
  },
  {
    subject: "Research",
    current: 62,
    target: 90,
  },
  {
    subject: "Infrastructure",
    current: 79,
    target: 94,
  },
  {
    subject: "Industry",
    current: 71,
    target: 93,
  },
];







  const activities = [
  {
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
    title: "48 students completed Advanced Python Assessment",
    time: "2 hours ago",
  },
  {
    icon: FileText,
    color: "bg-indigo-50 text-indigo-600",
    title: "32 resumes reviewed and approved",
    time: "4 hours ago",
  },
  {
    icon: Building2,
    color: "bg-blue-50 text-blue-600",
    title: "Capgemini registered as a campus recruiter",
    time: "6 hours ago",
  },
  {
    icon: Calendar,
    color: "bg-violet-50 text-violet-600",
    title: "Campus drive scheduled for July 15",
    time: "8 hours ago",
  },
  {
    icon: Brain,
    color: "bg-purple-50 text-purple-600",
    title: "AI generated placement readiness report",
    time: "12 hours ago",
  },
  {
    icon: Award,
    color: "bg-indigo-50 text-indigo-600",
    title: "156 students earned AWS Certification",
    time: "1 day ago",
  },
];



const quickActions = [
  {
    icon: Upload,
    title: "Upload Student Data",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Sparkles,
    title: "Generate AI Report",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: Calendar,
    title: "Schedule Campus Drive",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: UserPlus,
    title: "Invite Recruiters",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: ClipboardList,
    title: "Publish Assessments",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: FileBarChart2,
    title: "Placement Report",
    color: "text-emerald-600 bg-emerald-50",
  },
];




const roadmapPipeline = [
  {
    count: "4,250",
    percent: "100%",
    label: "Admissions",
    height: "h-52",
    bg: "bg-gradient-to-br from-slate-50 to-slate-100",
    text: "text-slate-600",
  },
  {
    count: "3,980",
    percent: "94%",
    label: "Semester Started",
    height: "h-44",
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    text: "text-indigo-600",
  },
  {
    count: "3,620",
    percent: "85%",
    label: "Course Completion",
    height: "h-40",
    bg: "bg-gradient-to-br from-violet-50 to-violet-100",
    text: "text-violet-600",
  },
  {
    count: "3,150",
    percent: "74%",
    label: "Assessment Passed",
    height: "h-32",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    text: "text-blue-600",
  },
  {
    count: "2,840",
    percent: "67%",
    label: "Placement Eligible",
    height: "h-24",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    text: "text-purple-600",
  },
  {
    count: "2,320",
    percent: "55%",
    label: "Placed",
    height: "h-20",
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    text: "text-emerald-600",
  },
];


  const enrollmentData = [
  { month: "Jan", students: 3800 },
  { month: "Feb", students: 3920 },
  { month: "Mar", students: 4010 },
  { month: "Apr", students: 4180 },
  { month: "May", students: 4250 },
  { month: "Jun", students: 4380 },
];
const departments = [
  {
    name: "Computer Science",
    students: "950 Students",
    placement: 92,
    employability: 88,
    assessment: 84,
    accent: "indigo",
  },
  {
    name: "Information Technology",
    students: "820 Students",
    placement: 89,
    employability: 85,
    assessment: 81,
    accent: "violet",
  },
  {
    name: "Electronics",
    students: "680 Students",
    placement: 78,
    employability: 75,
    assessment: 76,
    accent: "blue",
  },
  {
    name: "MBA",
    students: "450 Students",
    placement: 85,
    employability: 83,
    assessment: 80,
    accent: "purple",
  },
];

  const stats = [
    {
      title: "Total Students",
      value: "4,250",
      icon: Users,
    },
    {
      title: "Faculty Members",
      value: "320",
      icon: UserCheck,
    },
    {
      title: "Departments",
      value: "12",
      icon: Building2,
    },
    {
      title: "Placement Rate",
      value: "92%",
      icon: Award,
    },
  ];
  

  return (
       <div className="h-screen bg-slate-50 flex overflow-hidden">


{/* // sidebar  */}


<div className="w-60 h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col">  

  <div className="px-4 py-4 border-b border-white/10">

    <div className="flex items-center gap-3">

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">

        <GraduationCap className="w-7 h-7 text-white"/>

      </div>

      <div>

        <h2 className="text-2xl font-bold">
          C2C
        </h2>

        <p className="text-sm text-indigo-200">
          College Portal
        </p>

      </div>

    </div>

  </div>

  {/* Navigation */}

  <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">

    {menuItems.map((item,index)=>{

      const Icon=item.icon;

      return(

        <button
          key={index}
          className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-300

          ${
            item.active
            ? "bg-gradient-to-r from-indigo-500/30 to-violet-500/20 border border-indigo-400/20 shadow-lg"
            : "hover:bg-white/5"
          }`}
        >

          <div className="flex items-center gap-4">

            <Icon
              className={`w-6 h-6 ${
                item.active
                ? "text-indigo-300"
                : "text-slate-300"
              }`}
            />

            <span
              className={`font-medium text-lg ${
                item.active
                ? "text-white"
                : "text-slate-300"
              }`}
            >
              {item.title}
            </span>

          </div>

          {item.active && (

            <ChevronRight className="w-5 h-5 text-indigo-300"/>

          )}

        </button>

      )

    })}

  </div>

  {/* Bottom */}

 <div className="p-4">

    <div className="rounded-xl bg-white/5 border border-white/10 p-5">

      <p className="text-sm text-slate-400">
        Academic Year
      </p>

      <h3 className="text-2xl font-bold mt-2">
        2025–26
      </h3>

      <div className="mt-4 h-2 rounded-full bg-slate-700">

        <div className="h-2 rounded-full w-3/4 bg-gradient-to-r from-indigo-400 to-violet-500"/>

      </div>

      <p className="text-xs text-slate-400 mt-3">
        Semester Progress • 75%
      </p>

    </div>

  </div>

</div>



<div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">
   <div className=" relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-8 py-7 ">

  {/* Glow */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full" />

  <div className="relative z-10">

    <div className="flex flex-wrap items-center justify-between gap-4">

      <div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs mb-4">
          Academic Year 2025–26
        </div>

        <h1 className="text-3xl font-bold text-white">
          DIT University
        </h1>

        <p className="text-slate-400 mt-2 max-w-xl">
          Centralized overview of admissions, academics,
          placements and institutional performance.
        </p>

      </div>

      <div className="text-right">
        <p className="text-slate-500 text-sm">
          Last Updated
        </p>

        <p className="text-white font-semibold">
          Today • 10:42 AM
        </p>
      </div>

    </div>

    {/* KPI STRIP */}

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-slate-400 text-sm">
          Students
        </p>

        <h2 className="text-3xl font-bold text-white mt-1">
          8,462
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-slate-400 text-sm">
          Placement Rate
        </p>

        <h2 className="text-3xl font-bold text-indigo-300 mt-1">
          87%
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-slate-400 text-sm">
          Recruiters
        </p>

        <h2 className="text-3xl font-bold text-violet-300 mt-1">
          124
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-slate-400 text-sm">
          Departments
        </p>

        <h2 className="text-3xl font-bold text-emerald-300 mt-1">
          12
        </h2>
      </div>

    </div>

    {/* QUICK LINKS */}

    <div className="flex flex-wrap gap-3 mt-6">

      <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
        Admissions Open
      </div>

      <div className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
        Placement Season Active
      </div>

      <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
        NAAC Review Ready
      </div>

    </div>

  </div>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6 ">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
  <div className="mb-5">
    <h2 className="text-xl font-semibold text-slate-900">
      Student Enrollment Trend
    </h2>

    <p className="text-sm text-slate-500">
      Student growth across the academic year
    </p>
  </div>

  <div style={{ height: 320 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={enrollmentData}>
        <defs>
          <linearGradient id="enrollment" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="students"
          stroke="#4f46e5"
          fill="url(#enrollment)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


<div className="mt-8">
  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Department Insights
      </h2>

      <p className="text-slate-500">
        Academic and placement performance overview
      </p>
    </div>

    <button className="text-indigo-600 font-medium">
      Explore All
    </button>

  </div>

  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

    {departments.map((dept, index) => {

      const colors: Record<string, { bg: string; text: string; progress: string }> = {
        indigo: {
          bg: "from-indigo-50 to-white",
          text: "text-indigo-600",
          progress: "bg-indigo-500",
        },
        violet: {
          bg: "from-violet-50 to-white",
          text: "text-violet-600",
          progress: "bg-violet-500",
        },
        blue: {
          bg: "from-blue-50 to-white",
          text: "text-blue-600",
          progress: "bg-blue-500",
        },
        purple: {
          bg: "from-purple-50 to-white",
          text: "text-purple-600",
          progress: "bg-purple-500",
        },
      };

      const style = colors[dept.accent as keyof typeof colors];

      return (
        <div
          key={index}
          className={`bg-gradient-to-br ${style.bg}
          rounded-3xl border border-slate-100
          p-6 shadow-sm hover:shadow-lg
          transition-all duration-300`}
        >

          <div className="flex justify-between items-start">

            <div>

              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                <Building2 className={`w-6 h-6 ${style.text}`} />
              </div>

              <h3 className="font-bold text-lg text-slate-900">
                {dept.name}
              </h3>

              <p className="text-slate-500 text-sm">
                {dept.students}
              </p>

            </div>

            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold bg-white ${style.text}`}
            >
              {dept.placement}%
            </div>

          </div>

          <div className="mt-6">

            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">
                Placement Readiness
              </span>

              <span className={`font-semibold ${style.text}`}>
                {dept.placement}%
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full">
              <div
                className={`h-2 rounded-full ${style.progress}`}
                style={{ width: `${dept.placement}%` }}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">

            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-slate-500">
                Employability
              </p>

              <h4 className="text-xl font-bold text-slate-900 mt-1">
                {dept.employability}%
              </h4>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-slate-500">
                Assessment
              </p>

              <h4 className="text-xl font-bold text-slate-900 mt-1">
                {dept.assessment}%
              </h4>
            </div>

          </div>

        </div>
      );
    })}
  </div>
</div>


<div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

  <div className="flex items-center justify-between mb-10">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        College Growth Roadmap
      </h2>

      <p className="text-slate-500 mt-1">
        Institutional journey from admission to placement
      </p>
    </div>

    <div className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100">
      <span className="text-indigo-600 font-medium">
        Academic Year 2025
      </span>
    </div>
  </div>

  <div className="flex items-end justify-between gap-3 overflow-x-auto">

    {roadmapPipeline.map((item, index) => (
      <React.Fragment key={index}>

        <div className="min-w-[150px] flex flex-col items-center">

          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            {item.count}
          </h3>

          <div
            className={`
              ${item.bg}
              ${item.height}
              w-full
              rounded-[28px]
              transition-all
            `}
          />

          <p className="text-xl font-bold text-indigo-600 mt-4">
            {item.percent}
          </p>

          <p className="text-sm text-slate-500 text-center mt-1">
            {item.label}
          </p>

        </div>

        {index !== roadmapPipeline.length - 1 && (
  <div className="hidden lg:flex items-center justify-center mb-16 w-12 relative">

    <div className="absolute h-[2px] w-full bg-slate-200 rounded-full"></div>

    <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white z-10"></div>

  </div>
)}

      </React.Fragment>
    ))}

  </div>

</div>



<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

  {/* Activity Feed */}

  <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

    <h2 className="text-2xl font-bold text-slate-900">
      Recent Activity
    </h2>

    <p className="text-slate-500 mt-1">
      Latest updates across the institution
    </p>

    <div className="mt-8 space-y-6">

      {activities.map((item, index) => {

        const Icon = item.icon;

        return (

          <div
            key={index}
            className="flex items-start gap-4"
          >

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>

              <Icon className="w-6 h-6" />

            </div>

            <div>

              <h3 className="text-slate-800 font-medium">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                {item.time}
              </p>

            </div>

          </div>

        );

      })}

    </div>

  </div>

  {/* Quick Actions */}

  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">

    <h2 className="text-2xl font-bold text-slate-900">
      Quick Actions
    </h2>

    <p className="text-slate-500 mt-1">
      Frequently used tools
    </p>

    <div className="grid grid-cols-2 gap-4 mt-8">

      {quickActions.map((action, index) => {

        const Icon = action.icon;

        return (

          <button
            key={index}
            className="rounded-3xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >

            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${action.color}`}>

              <Icon className="w-7 h-7" />

            </div>

            <p className="text-sm font-medium text-slate-700 mt-4 text-center leading-5">
              {action.title}
            </p>

          </button>

        );

      })}

    </div>

  </div>

</div>




{/* recurter activity section */} 



<div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h2 className="text-2xl font-bold text-slate-900">
        Recruiter Activity
      </h2>

      <p className="text-slate-500">
        Live hiring updates from partnered companies
      </p>

    </div>

    <button className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 transition">
      View All
    </button>

  </div>

  <div className="space-y-5">

    {recruiterActivity.map((item, index) => (

      <div
        key={index}
        className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all"
      >

        <div className="flex items-center gap-5">

          <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}>

            <Building2 className="w-7 h-7 text-white"/>

          </div>

          <div>

            <h3 className="text-lg font-semibold text-slate-900">
              {item.company}
            </h3>

            <p className="text-slate-500">
              {item.role}
            </p>

          </div>

        </div>

        <div className="hidden md:flex items-center gap-10">

          <div className="text-center">

            <Users className="w-5 h-5 mx-auto text-slate-400"/>

            <p className="text-lg font-bold text-slate-900 mt-2">
              {item.students}
            </p>

            <span className="text-xs text-slate-500">
              Candidates
            </span>

          </div>

          <div className="text-center">

            <Clock className="w-5 h-5 mx-auto text-slate-400"/>

            <div className="mt-2">

              <span className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">

                {item.status}

              </span>

            </div>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>


  {/* // chart and analytics section */}
<div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h2 className="text-2xl font-bold text-slate-900">
        Institution Analytics
      </h2>

      <p className="text-slate-500">
        Current institutional performance vs target goals
      </p>

    </div>

    <div className="px-5 py-2 rounded-full bg-violet-50 border border-violet-100">

      <span className="text-violet-600 font-semibold">
        AI Insights
      </span>

    </div>

  </div>


  


  <div className="grid lg:grid-cols-2 gap-12">


    {/* Radar Chart */}

    <div className="h-[360px]">

      <ResponsiveContainer width="100%" height="100%">

        <RadarChart data={analyticsData}>

          <PolarGrid />

          <PolarAngleAxis dataKey="subject" />

          <PolarRadiusAxis
            angle={30}
            domain={[0,100]}
          />

          <Radar
            name="Current"
            dataKey="current"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.35}
            strokeWidth={2}
          />

          <Radar
            name="Target"
            dataKey="target"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.15}
            strokeWidth={2}
          />

        </RadarChart>

      </ResponsiveContainer>

    </div>



    {/* Right Side */}

    <div className="space-y-10">


      <div>

        <h3 className="text-lg font-semibold text-slate-800 mb-5">
          Strongest Areas
        </h3>

        {[
          ["Student Satisfaction",94],
          ["Faculty Quality",91],
          ["Placement Support",88],
          ["Campus Facilities",86],
          ["Digital Learning",84],
        ].map(([name,value],index)=>(

          <div
            key={index}
            className="flex items-center justify-between mb-5"
          >

            <span className="text-slate-700">
              {name}
            </span>

            <div className="flex items-center gap-4">

              <div className="w-32 h-2 rounded-full bg-slate-100">

                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{width:`${value}%`}}
                />

              </div>

              <span className="font-semibold text-slate-700">
                {value}%
              </span>

            </div>

          </div>

        ))}

      </div>



      <div>

        <h3 className="text-lg font-semibold text-slate-800 mb-5">
          Needs Attention
        </h3>

        {[
          ["Research Publications","42%"],
          ["Industry Partnerships","38%"],
          ["International Exchange","31%"],
          ["Innovation Labs","27%"],
          ["Startup Incubation","24%"],
        ].map(([name,value],index)=>(

          <div
            key={index}
            className="flex justify-between items-center mb-4"
          >

            <span className="text-slate-700">
              {name}
            </span>

            <span className="px-4 py-1 rounded-full bg-red-50 text-red-500 font-semibold text-sm border border-red-100">
              {value} Gap
            </span>

          </div>

        ))}

      </div>


    </div>

  </div>

</div>



<div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

    <div className="flex justify-between items-center mb-8">

        <div>

            <h2 className="text-2xl font-bold text-slate-900">
                Upcoming Campus Drives
            </h2>

            <p className="text-slate-500">
                Scheduled recruitment events
            </p>

        </div>

        <button className="text-indigo-600 font-semibold">
            View Calendar
        </button>

    </div>

    <div className="space-y-5">

        {upcomingDrives.map((item, index) => (

            <div
                key={index}
                className="border border-slate-100 rounded-2xl p-5 hover:shadow-lg transition-all"
            >

                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-5">

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">

                            <Building2 className="w-7 h-7 text-white"/>

                        </div>

                        <div>

                            <h3 className="text-lg font-bold text-slate-900">

                                {item.company}

                            </h3>

                            <p className="text-slate-500">

                                {item.role}

                            </p>

                        </div>

                    </div>

                    <div className="text-right">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">

                            <CalendarDays className="w-4 h-4"/>

                            {item.date}

                        </div>

                    </div>

                </div>

                <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-500">

                    <div className="flex items-center gap-2">

                        <GraduationCap className="w-4 h-4 text-indigo-500"/>

                        {item.branch}

                    </div>

                    <div className="flex items-center gap-2">

                        <Users className="w-4 h-4 text-violet-500"/>

                        {item.students} Registered

                    </div>

                </div>

            </div>

        ))}

    </div>

</div>




{/* // ai insights section */}

<div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">

    <div className="flex items-center justify-between mb-8">

        <div>

            <h2 className="text-2xl font-bold text-slate-900">
                AI Insights
            </h2>

            <p className="text-slate-500">
                AI powered recommendations for administrators
            </p>

        </div>

        <div className="px-4 py-2 rounded-full bg-violet-50 border border-violet-100">

            <span className="text-violet-600 font-semibold">
                Smart Suggestions
            </span>

        </div>

    </div>

    <div className="grid md:grid-cols-2 gap-5">

        {aiInsights.map((item, index) => {

            const styles = {
                emerald: {
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                    dot: "bg-emerald-500",
                },
                amber: {
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                    dot: "bg-amber-500",
                },
                indigo: {
                    bg: "bg-indigo-50",
                    border: "border-indigo-100",
                    dot: "bg-indigo-500",
                },
                violet: {
                    bg: "bg-violet-50",
                    border: "border-violet-100",
                    dot: "bg-violet-500",
                },
            };

            const style =
                styles[item.color as keyof typeof styles];

            return (

                <div
                    key={index}
                    className={`${style.bg} ${style.border} border rounded-2xl p-5 hover:shadow-md transition-all`}
                >

                    <div className="flex gap-4">

                        <div
                            className={`w-3 h-3 rounded-full mt-2 ${style.dot}`}
                        />

                        <div>

                            <h3 className="font-semibold text-slate-900">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 mt-2 text-sm">
                                {item.description}
                            </p>

                        </div>

                    </div>

                </div>

            );

        })}

    </div>

</div>










    </div> </div>  




    
  );
};