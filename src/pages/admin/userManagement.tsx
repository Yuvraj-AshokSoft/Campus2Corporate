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
  Monitor,
  ChevronRight,
  UserCheck,
  Calendar,
  FileText,
  UserPlus,
  BarChart3,
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
    label: "Total Users",
    value: "12,540",
    change: "+10%",
    icon: Users,
    tone: "success",
  },
  {
    label: "Students",
    value: "9,842",
    change: "+8%",
    icon: Building,
    tone: "success",
  },
  {
    label: "Recruiters",
    value: "432",
    change: "+5%",
    icon: Briefcase,
    tone: "success",
  },
  {
    label: "Mentors",
    value: "180",
    change: "+3%",
    icon: UserCheck,
    tone: "warning",
  },
];

const users = [
  {
    name: "Rahul Sharma",
    role: "Student",
    college: "ABC Engineering",
    status: "Active",
  },
  {
    name: "Priya Verma",
    role: "Recruiter",
    college: "Infosys",
    status: "Active",
  },
  {
    name: "Amit Kumar",
    role: "Mentor",
    college: "C2C Platform",
    status: "Pending",
  },
  {
    name: "Sneha Patel",
    role: "Student",
    college: "XYZ Institute",
    status: "Active",
  },
  {
    name: "Rohit Singh",
    role: "Admin",
    college: "C2C Platform",
    status: "Active",
  },
  {
    name: "Neha Gupta",
    role: "Recruiter",
    college: "Google",
    status: "Onboarding",
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

const UserManagement = () => {
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
                User Management
              </p>

            </div>

          </div>

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-400 shadow-sm w-64">

            <Search className="h-3.5 w-3.5" />

            <span className="text-[13px]">
              Search users...
            </span>

            <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              ⌘K
            </kbd>

          </div>

          <div className="flex items-center gap-2">

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm">

              <Bell className="h-4 w-4" />

              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                6
              </span>

            </button>

            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-3.5 py-2 text-sm font-bold text-white">

              <Sparkles className="h-3.5 w-3.5" />

              Insights

            </button>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700">

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
                  User Hub
                </p>

                <h2 className="mt-1.5 text-base font-black text-white">
                  C2C Platform
                </h2>

                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  User administration workspace
                </p>

                <div className="mt-4 flex items-center gap-2">

                  <PulseDot />

                  <span className="text-[10px] font-semibold text-emerald-400">
                    All users online
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

                      {item.label === "User Management" ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : null}

                    </NavLink>

                  );

                })}

              </nav>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">

                  <Shield className="h-3.5 w-3.5 text-blue-600" />

                  User Health Score

                </div>

                <div className="mt-3 flex items-end justify-between">

                  <span className="text-4xl font-black text-slate-900">
                    98
                  </span>

                  <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    Excellent
                  </span>

                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />

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

                    AI Powered User Administration

                  </span>

                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">

                    User Management Center

                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">

                    Manage students, recruiters, mentors,
                    colleges and administrators from one
                    centralized dashboard with real-time
                    monitoring and access control.

                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {[
                      {
                        label: "Add User",
                        icon: UserPlus,
                      },
                      {
                        label: "Approve Users",
                        icon: UserCheck,
                      },
                      {
                        label: "Export Users",
                        icon: FileText,
                      },
                      {
                        label: "Manage Roles",
                        icon: Shield,
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

                      User Overview

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
                        value: "9842",
                      },
                      {
                        label: "Recruiters",
                        value: "432",
                      },
                      {
                        label: "Mentors",
                        value: "180",
                      },
                      {
                        label: "Admins",
                        value: "18",
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

                        Active Users

                      </span>

                      <span className="text-blue-700">

                        97%

                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div className="h-full w-[97%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />

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

                    User Directory

                  </p>

                  <h2 className="mt-0.5 text-lg font-black text-slate-900">

                    Platform Users

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
                    Cards
                  </button>

                  <button
                    onClick={() => setViewMode("table")}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Table
                  </button>

                  <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition">

                    <UserPlus className="mr-2 inline h-4 w-4" />

                    Add User

                  </button>

                </div>

              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">

                <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">

                  {users.map((user) => (

                    <div
                      key={user.name}
                      className="rounded-3xl bg-white p-5 shadow-sm hover:shadow-md transition"
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                            <Users className="h-6 w-6" />

                          </div>

                          <div>

                            <h3 className="text-lg font-black text-slate-900">

                              {user.name}

                            </h3>

                            <p className="text-sm text-slate-500">

                              {user.role}

                            </p>

                          </div>

                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : user.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.status}
                        </span>

                      </div>

                      <div className="mt-6 space-y-3 text-sm">

                        <div className="flex justify-between">

                          <span className="text-slate-500">
                            Organization
                          </span>

                          <span className="font-semibold text-slate-900">
                            {user.college}
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-slate-500">
                            Role
                          </span>

                          <span className="font-semibold text-slate-900">
                            {user.role}
                          </span>

                        </div>

                      </div>

                      <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition">

                        View Profile

                      </button>

                    </div>

                  ))}

                </div>

              </div>

            </section>
                        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">

              {/* Recent User Activity */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Recent Activity
                    </p>

                    <h2 className="mt-1 text-lg font-black text-slate-900">
                      Latest User Updates
                    </h2>

                  </div>

                  <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                    View All
                  </button>

                </div>

                <div className="mt-5 space-y-4">

                  {[
                    {
                      title: "Rahul Sharma registered as Student",
                      time: "5 mins ago",
                      color: "bg-emerald-500",
                    },
                    {
                      title: "Google Recruiter approved",
                      time: "18 mins ago",
                      color: "bg-blue-500",
                    },
                    {
                      title: "Mentor profile updated",
                      time: "45 mins ago",
                      color: "bg-purple-500",
                    },
                    {
                      title: "Admin created new role",
                      time: "Today",
                      color: "bg-amber-500",
                    },
                    {
                      title: "25 students verified",
                      time: "Today",
                      color: "bg-rose-500",
                    },
                  ].map((activity) => (

                    <div
                      key={activity.title}
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                    >

                      <div
                        className={`h-3 w-3 rounded-full ${activity.color}`}
                      />

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

              {/* User Roles */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  User Distribution
                </p>

                <h2 className="mt-1 text-lg font-black text-slate-900">
                  Role Statistics
                </h2>

                <div className="mt-5 space-y-5">

                  {[
                    {
                      role: "Students",
                      percent: "78%",
                    },
                    {
                      role: "Recruiters",
                      percent: "11%",
                    },
                    {
                      role: "Mentors",
                      percent: "7%",
                    },
                    {
                      role: "Admins",
                      percent: "4%",
                    },
                  ].map((item) => (

                    <div key={item.role}>

                      <div className="flex justify-between text-sm font-semibold">

                        <span>{item.role}</span>

                        <span>{item.percent}</span>

                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: item.percent }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-4">

                  <h3 className="text-sm font-bold text-slate-800">

                    Quick Actions

                  </h3>

                  <div className="mt-4 space-y-2">

                    <button className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
                      Create User
                    </button>

                    <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                      Assign Roles
                    </button>

                    <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                      Export Users
                    </button>

                  </div>

                </div>

              </section>

            </div>

          </main>

        </div>

      </div>

    </div>

  );

};

export default UserManagement;