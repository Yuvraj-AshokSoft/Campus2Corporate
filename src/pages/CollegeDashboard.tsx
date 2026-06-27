import React from "react";
import {
  Users,
  UserCheck,
  Award,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const CollegeDashboard: React.FC = () => {

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
    <div className="min-h-screen bg-slate-50 p-6 ">
   <div className=" relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-8 py-7 ">

  {/* Glow */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full" />

  <div className="relative z-10">

    <div className="flex flex-wrap items-center justify-between gap-4">

      <div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs mb-4">
          Academic Year 2025–26
        </div>

        {/* Preview Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400 tracking-wider uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          Preview Version
        </span>

        {/* Title & Description */}
        <h1 className="text-2xl font-black tracking-tight text-white mb-3">
          College Dashboard
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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


    </div>
  );
};
