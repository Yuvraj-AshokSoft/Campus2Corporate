import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Search,
  Sparkles,
  Settings,
  Shield,
  Cpu,
  Briefcase,
  Building,
  Users,
  BarChart3,
  Monitor,
  ChevronRight,
  UserCheck,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react";

const sidebarItems = [
  { label: "Admin Dashboard", icon: Cpu, path: "/admin-dashboard" },
  { label: "Student Dashboard", icon: Building, path: "/student-dashboard" },
  { label: "College Dashboard", icon: Briefcase, path: "/college-dashboard" },
  { label: "Recruiter Dashboard", icon: Users, path: "/recruiter-dashboard" },
  { label: "Mentor Dashboard", icon: UserCheck, path: "/mentor-dashboard" },
  { label: "Analytics", icon: BarChart3, path: "/admin-dashboard/analytics" },
  { label: "User Management", icon: Users, path: "/admin-dashboard/users" },
  { label: "Company Management", icon: Monitor, path: "/admin-dashboard/companies" },
  { label: "Settings", icon: Settings, path: "/admin-dashboard/settings" },
];

const stats = [
  {
    label: "Total Placements",
    value: "1,248",
    change: "+18%",
    icon: Briefcase,
    tone: "success",
  },
  {
    label: "Applications",
    value: "15,842",
    change: "+12%",
    icon: FileText,
    tone: "success",
  },
  {
    label: "Interviews",
    value: "3,926",
    change: "+9%",
    icon: Users,
    tone: "success",
  },
  {
    label: "Success Rate",
    value: "78%",
    change: "+4%",
    icon: TrendingUp,
    tone: "warning",
  },
];

const analyticsData = [
  {
    title: "Student Registrations",
    value: "8,542",
    status: "Growing",
    growth: "+14%",
  },
  {
    title: "Active Recruiters",
    value: "148",
    status: "Stable",
    growth: "+6%",
  },
  {
    title: "Campus Drives",
    value: "42",
    status: "Scheduled",
    growth: "+11%",
  },
  {
    title: "Offers Released",
    value: "1,248",
    status: "Excellent",
    growth: "+18%",
  },
  {
    title: "Pending Interviews",
    value: "386",
    status: "Review",
    growth: "-3%",
  },
  {
    title: "Placement Success",
    value: "78%",
    status: "Strong",
    growth: "+5%",
  },
];

const PulseDot = ({ color = "#10b981" }: { color?: string }) => (
  <span className="relative flex h-2 w-2">
    <span
      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
      style={{ backgroundColor: color }}
    />
    <span
      className="relative inline-flex h-2 w-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  </span>
);

const Analytics = () => {
  const [viewMode, setViewMode] = useState("overview");

  return (
    <div className="admin-dashboard min-h-screen bg-slate-50 font-sans text-slate-800">

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-500/25">

              <Cpu className="h-5 w-5 text-white" />

              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />

            </div>

            <div>

              <p className="text-sm font-black tracking-tight text-slate-900">
                C2C Admin
              </p>

              <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                Analytics Dashboard
              </p>

            </div>

          </div>

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 shadow-sm w-64 cursor-pointer hover:border-blue-200 hover:bg-blue-50/40 transition">

            <Search className="h-3.5 w-3.5" />

            <span className="text-[13px]">
              Search analytics...
            </span>

            <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              ⌘K
            </kbd>

          </div>

          <div className="flex items-center gap-2">

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition">

              <Bell className="h-4 w-4" />

              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                5
              </span>

            </button>

            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20">

              <Sparkles className="h-3.5 w-3.5" />

              Insights

            </button>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm">

              <Settings className="h-3.5 w-3.5" />

              Tools

            </button>

          </div>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="flex gap-6">

          <aside className="hidden w-56 flex-shrink-0 lg:block">

            <div className="sticky top-[76px] space-y-3">

              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg">

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">
                  Analytics Hub
                </p>

                <h2 className="mt-1.5 text-base font-black text-white">
                  C2C Platform
                </h2>

                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  Analytics workspace
                </p>

                <div className="mt-4 flex items-center gap-2">

                  <PulseDot />

                  <span className="text-[10px] font-semibold text-emerald-400">
                    Live analytics
                  </span>

                </div>

              </div>

              <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

                {sidebarItems.map((item) => {

                  const Icon = item.icon;

                  return (

                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >

                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />

                      <span className="flex-1 truncate">
                        {item.label}
                      </span>

                      {item.label === "Analytics" ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : null}

                    </NavLink>

                  );

                })}

              </nav>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">

                  <Shield className="h-3.5 w-3.5 text-blue-600" />

                  Analytics score

                </div>

                <div className="mt-3 flex items-end justify-between">

                  <span className="text-4xl font-black text-slate-900">
                    96
                  </span>

                  <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    Excellent
                  </span>

                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />

                </div>

              </div>

            </div>

          </aside>

          <main className="min-w-0 flex-1 space-y-5">

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />

              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

              <div className="relative grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">

                <div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">

                    <Sparkles className="h-3 w-3" />

                    AI Powered Analytics

                  </span>

                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">

                    Analytics Dashboard

                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

                    Monitor platform performance, placement statistics,
                    recruiter engagement, application growth,
                    interview success and overall system performance
                    from one intelligent dashboard.

                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {[
                      {
                        label: "Export Report",
                        icon: FileText,
                      },
                      {
                        label: "View Trends",
                        icon: TrendingUp,
                      },
                      {
                        label: "Generate Insights",
                        icon: Sparkles,
                      },
                      {
                        label: "Schedule Report",
                        icon: Calendar,
                      },
                    ].map((action) => (

                      <button
                        key={action.label}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition"
                      >

                        <action.icon className="h-3.5 w-3.5" />

                        {action.label}

                      </button>

                    ))}

                  </div>

                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                  <div className="flex items-center justify-between">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">

                      Analytics Overview

                    </p>

                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">

                      <PulseDot />

                      Live

                    </span>

                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {[
                      {
                        label: "Students",
                        value: "8,542",
                      },
                      {
                        label: "Recruiters",
                        value: "148",
                      },
                      {
                        label: "Applications",
                        value: "15,842",
                      },
                      {
                        label: "Placements",
                        value: "1,248",
                      },
                    ].map((metric) => (

                      <div
                        key={metric.label}
                        className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200"
                      >

                        <p className="text-[10px] font-semibold text-slate-400">

                          {metric.label}

                        </p>

                        <p className="mt-0.5 text-xl font-black text-slate-900">

                          {metric.value}

                        </p>

                      </div>

                    ))}

                  </div>

                  <div className="mt-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">

                    <div className="flex items-center justify-between text-[11px] font-semibold">

                      <span className="text-slate-500">

                        Overall Platform Score

                      </span>

                      <span className="text-blue-700">

                        94%

                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />

                    </div>

                  </div>

                </div>

              </div>

            </div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {stats.map((card) => (

                <article
                  key={card.label}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-default"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">

                      <card.icon className="h-4 w-4" />

                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        card.tone === "success"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                      }`}
                    >
                      {card.change}
                    </span>

                  </div>

                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">

                    {card.label}

                  </p>

                  <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">

                    {card.value}

                  </p>

                </article>

              ))}

            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">

                    Analytics Reports

                  </p>

                  <h2 className="mt-0.5 text-lg font-black text-slate-900">

                    Platform Performance

                  </h2>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => setViewMode("overview")}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      viewMode === "overview"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Overview
                  </button>

                  <button
                    onClick={() => setViewMode("table")}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Reports
                  </button>

                  <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition">

                    Export

                  </button>

                </div>

              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">

                <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">

                  {analyticsData.map((item) => (

                    <div
                      key={item.title}
                      className="rounded-3xl bg-white p-5 shadow-sm hover:shadow-md transition"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">

                            Metric

                          </p>

                          <h3 className="mt-2 text-lg font-black text-slate-900">

                            {item.title}

                          </h3>

                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.status === "Growing"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "Stable"
                              ? "bg-blue-50 text-blue-700"
                              : item.status === "Excellent"
                              ? "bg-purple-50 text-purple-700"
                              : item.status === "Scheduled"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.status}
                        </span>

                      </div>

                      <div className="mt-6">

                        <p className="text-4xl font-black text-slate-900">

                          {item.value}

                        </p>

                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-sm text-slate-500">

                            Monthly Growth

                          </span>

                          <span className="font-bold text-emerald-600">

                            {item.growth}

                          </span>

                        </div>

                        <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">

                          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>

                        </div>

                      </div>

                      <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition">

                        View Analytics

                      </button>

                    </div>

                  ))}

                </div>

              </div>

            </section>
                        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Recent Activity
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900">
                      Latest Platform Updates
                    </h2>

                  </div>

                  <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                    View All
                  </button>

                </div>

                <div className="mt-5 space-y-4">

                  {[
                    {
                      title: "150 new students registered",
                      time: "5 mins ago",
                      color: "bg-emerald-500",
                    },
                    {
                      title: "Google scheduled a campus drive",
                      time: "20 mins ago",
                      color: "bg-blue-500",
                    },
                    {
                      title: "42 students received offers",
                      time: "1 hour ago",
                      color: "bg-purple-500",
                    },
                    {
                      title: "Placement report generated",
                      time: "Today",
                      color: "bg-amber-500",
                    },
                    {
                      title: "Recruiter profile approved",
                      time: "Today",
                      color: "bg-rose-500",
                    },
                  ].map((activity) => (

                    <div
                      key={activity.title}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                    >

                      <div className={`h-3 w-3 rounded-full ${activity.color}`} />

                      <div className="flex-1">

                        <p className="font-semibold text-slate-800">
                          {activity.title}
                        </p>

                        <p className="text-sm text-slate-500">
                          {activity.time}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Top Performing Colleges
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Performance Ranking
                </h2>

                <div className="mt-5 space-y-5">

                  {[
                    {
                      college: "ABC Engineering",
                      score: "98%",
                    },
                    {
                      college: "XYZ Institute",
                      score: "95%",
                    },
                    {
                      college: "National College",
                      score: "93%",
                    },
                    {
                      college: "Tech University",
                      score: "90%",
                    },
                  ].map((college) => (

                    <div key={college.college}>

                      <div className="flex justify-between text-sm font-semibold">

                        <span>{college.college}</span>

                        <span>{college.score}</span>

                      </div>

                      <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: college.score }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            </div>

          </main>

        </div>

      </div>

    </div>

  );

};

export default Analytics;