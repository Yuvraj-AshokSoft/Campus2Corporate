import React from 'react';
type IconName =
  | 'activity'
  | 'alert'
  | 'arrow-up'
  | 'bell'
  | 'briefcase'
  | 'building'
  | 'calendar'
  | 'chart'
  | 'check'
  | 'clock'
  | 'dashboard'
  | 'database'
  | 'file'
  | 'graduation'
  | 'lock'
  | 'plug'
  | 'search'
  | 'settings'
  | 'shield'
  | 'sparkles'
  | 'target'
  | 'user-check'
  | 'users';

interface DashboardIconProps {
  name: IconName;
  className?: string;
}

const DashboardIcon: React.FC<DashboardIconProps> = ({ name, className }) => {
  const paths: Record<IconName, React.ReactNode> = {
    activity: (
      <>
        <path d="M4 12h3l2-6 4 12 2-6h5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4 3.5 18.5h17L12 4Z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </>
    ),
    'arrow-up': (
      <>
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </>
    ),
    briefcase: (
      <>
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path d="M4 12h16" />
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
        <path d="M9 15h1" />
        <path d="M14 15h1" />
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
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-7" />
      </>
    ),
    check: (
      <>
        <path d="M21 12a9 9 0 1 1-5-8" />
        <path d="m9 12 2 2 6-7" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
        <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
        <path d="M14 3v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </>
    ),
    graduation: (
      <>
        <path d="m22 10-10-5-10 5 10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    plug: (
      <>
        <path d="M8 3v5" />
        <path d="M16 3v5" />
        <path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" />
        <path d="M12 18v3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7.5 7.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2-1.2L14.2 3h-4.4l-.3 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7.5 7.5 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2 1.2l.3 2.6h4.4l.3-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" />
        <path d="m9 12 2 2 4-5" />
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
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </>
    ),
    'user-check': (
      <>
        <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="m16 11 2 2 4-5" />
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

const AdminLogo: React.FC = () => (
  <div className="flex items-center gap-3">
    <svg className="h-9 w-auto" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="28" height="28" rx="8" className="fill-blue-50 stroke-blue-600" strokeWidth="2" />
      <path d="M12 24C12 18.4772 16.4772 14 22 14" className="stroke-blue-600" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 16C24 21.5228 19.5228 26 14 26" className="stroke-blue-600" strokeWidth="3" strokeLinecap="round" />
      <text x="42" y="26" className="fill-slate-900" fontSize="19" fontWeight="800" letterSpacing="-0.03em">
        C2C
      </text>
    </svg>
    <div className="hidden border-l border-slate-300 pl-3 sm:block">
      <span className="block text-[9px] font-semibold uppercase leading-none tracking-widest text-slate-500">Ashoksoft</span>
      <span className="mt-0.5 block text-[9px] font-semibold uppercase leading-none tracking-widest text-slate-500">Admin</span>
    </div>
  </div>
);

const sidebarItems = [
  { label: 'Command Center', icon: 'dashboard', active: true },
  { label: 'User Roles', icon: 'users' },
  { label: 'Approvals', icon: 'user-check' },
  { label: 'Integrations', icon: 'plug' },
  { label: 'Audit Logs', icon: 'file' },
  { label: 'Security', icon: 'shield' },
] satisfies Array<{ label: string; icon: IconName; active?: boolean }>;

const stats = [
  { label: 'Total users', value: '24,918', change: '+14.8%', icon: 'users', color: 'blue' },
  { label: 'Active institutions', value: '126', change: '+8 added', icon: 'building', color: 'emerald' },
  { label: 'Open placement drives', value: '74', change: '19 urgent', icon: 'briefcase', color: 'amber' },
  { label: 'System health', value: '99.98%', change: 'Stable', icon: 'activity', color: 'violet' },
] satisfies Array<{ label: string; value: string; change: string; icon: IconName; color: 'blue' | 'emerald' | 'amber' | 'violet' }>;

const approvalQueue = [
  { title: 'Recruiter verification', owner: 'Enterprise team', items: 18, sla: '4h SLA', tone: 'High' },
  { title: 'College onboarding', owner: 'Institution success', items: 7, sla: '1d SLA', tone: 'Medium' },
  { title: 'Mentor profile audit', owner: 'Community ops', items: 31, sla: '2d SLA', tone: 'Normal' },
  { title: 'Flagged student reports', owner: 'Trust and safety', items: 5, sla: '2h SLA', tone: 'High' },
];

const roleMatrix = [
  { role: 'Students', total: '18.4k', active: '91%', access: 'Learning, assessments, jobs', risk: 'Low' },
  { role: 'Recruiters', total: '842', active: '78%', access: 'Drive creation, talent search', risk: 'Medium' },
  { role: 'Colleges', total: '126', active: '88%', access: 'Roster, analytics, reports', risk: 'Low' },
  { role: 'Mentors', total: '382', active: '64%', access: 'Reviews, sessions, feedback', risk: 'Normal' },
];

const integrations = [
  { name: 'ATS Sync', status: 'Connected', detail: 'Greenhouse, Lever, Workday', icon: 'plug' },
  { name: 'AI Scoring Engine', status: 'Live', detail: 'Resume, mock interview, skills', icon: 'sparkles' },
  { name: 'Data Warehouse', status: 'Healthy', detail: 'Nightly placement analytics', icon: 'database' },
];

const auditEvents = [
  { event: 'Admin role policy updated', user: 'Super Admin', time: '09:42 AM', status: 'Reviewed' },
  { event: 'Bulk student import approved', user: 'College Ops', time: '08:15 AM', status: 'Synced' },
  { event: 'Recruiter account escalated', user: 'Trust Team', time: 'Yesterday', status: 'Open' },
  { event: 'API key rotated for ATS Sync', user: 'Security Bot', time: 'Yesterday', status: 'Closed' },
];

const readinessSegments = [
  { label: 'Profile verified', value: '92%', width: 'w-[92%]', color: 'bg-blue-600' },
  { label: 'Placement ready', value: '76%', width: 'w-[76%]', color: 'bg-emerald-600' },
  { label: 'Interview scheduled', value: '58%', width: 'w-[58%]', color: 'bg-violet-600' },
  { label: 'Offer pipeline', value: '41%', width: 'w-[41%]', color: 'bg-amber-500' },
];

const quickActions = [
  { label: 'Approve recruiters', icon: 'user-check' },
  { label: 'Create admin role', icon: 'lock' },
  { label: 'Export reports', icon: 'file' },
  { label: 'Schedule audit', icon: 'calendar' },
] satisfies Array<{ label: string; icon: IconName }>;

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  violet: 'bg-violet-50 text-violet-700 border-violet-100',
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-blue-50 selection:text-blue-700">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <AdminLogo />

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm md:flex">
            <DashboardIcon name="search" className="h-4 w-4" />
            <span>Search users, drives, colleges...</span>
            <span className="ml-10 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Ctrl K
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50" aria-label="Notifications">
              <DashboardIcon name="bell" className="h-5 w-5" />
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700">
              <DashboardIcon name="settings" className="h-4 w-4" />
              Admin Tools
            </button>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] opacity-70 [background-size:16px_16px]" />
        <div className="pointer-events-none absolute left-[12%] top-[-120px] h-80 w-80 rounded-full bg-blue-50/80 blur-[90px]" />
        <div className="pointer-events-none absolute right-[8%] top-12 h-72 w-72 rounded-full bg-slate-100/90 blur-[90px]" />

        <main className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60">
            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Admin Portal</p>
              <h2 className="mt-2 text-lg font-extrabold tracking-tight">C2C Control Hub</h2>
              <p className="mt-2 text-xs leading-5 text-slate-300">Govern users, verify partners, and monitor platform reliability.</p>
            </div>

            <nav className="mt-4 space-y-1 text-sm">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold transition ${
                    item.active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <DashboardIcon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                <DashboardIcon name="shield" className="h-4 w-4" />
                Security score
              </div>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-extrabold text-slate-900">94</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">Strong</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full w-[94%] rounded-full bg-blue-600" />
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <DashboardIcon name="sparkles" className="h-3.5 w-3.5" />
                    Enterprise admin workspace
                  </span>
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Platform Command Center
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Manage roles, onboarding, placement operations, integrations, and compliance from a dashboard styled like the main C2C admin experience.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {quickActions.map((action) => (
                      <button key={action.label} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                        <DashboardIcon name={action.icon} className="h-4 w-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Ops</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900">Today at a glance</h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">Online</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                      <span className="text-xs font-semibold text-slate-500">Approvals</span>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">61</p>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                      <span className="text-xs font-semibold text-slate-500">Alerts</span>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">7</p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Data sync completion</span>
                        <span className="text-blue-700">88%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-[88%] rounded-full bg-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colorMap[item.color]}`}>
                      <DashboardIcon name={item.icon} className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                      <DashboardIcon name="arrow-up" className="h-3.5 w-3.5" />
                      {item.change}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{item.value}</p>
                </article>
              ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Review Queue</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">Approvals needing admin action</h2>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    View all tasks
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                  {approvalQueue.map((item, index) => (
                    <div key={item.title} className={`grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center ${index !== approvalQueue.length - 1 ? 'border-b border-slate-200' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                          <DashboardIcon name="clock" className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.tone === 'High' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-100' : 'bg-slate-100 text-slate-600'}`}>
                              {item.tone}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{item.owner} - {item.sla}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span className="text-2xl font-extrabold text-slate-900">{item.items}</span>
                        <button className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200">AI Governance</p>
                    <h2 className="mt-1 text-xl font-extrabold">Readiness funnel</h2>
                  </div>
                  <DashboardIcon name="target" className="h-6 w-6 text-blue-300" />
                </div>

                <div className="mt-6 space-y-5">
                  {readinessSegments.map((segment) => (
                    <div key={segment.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-300">{segment.label}</span>
                        <span className="font-extrabold text-white">{segment.value}</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${segment.color} ${segment.width}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="flex items-start gap-3">
                    <DashboardIcon name="alert" className="mt-0.5 h-5 w-5 text-amber-200" />
                    <div>
                      <p className="text-sm font-bold">2 scoring rules need review</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">Resume keyword weighting changed for three active drives.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Access Control</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">Role and permission matrix</h2>
                  </div>
                  <DashboardIcon name="lock" className="h-5 w-5 text-slate-400" />
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                  {roleMatrix.map((role, index) => (
                    <div key={role.role} className={`grid gap-3 p-4 ${index !== roleMatrix.length - 1 ? 'border-b border-slate-200' : ''}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{role.role}</h3>
                          <p className="mt-1 text-xs text-slate-500">{role.access}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{role.risk}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <span className="block text-xs font-semibold text-slate-500">Accounts</span>
                          <span className="font-extrabold text-slate-900">{role.total}</span>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <span className="block text-xs font-semibold text-slate-500">Active</span>
                          <span className="font-extrabold text-slate-900">{role.active}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Connected Systems</p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">Integrations and audit trail</h2>
                  </div>
                  <DashboardIcon name="plug" className="h-5 w-5 text-slate-400" />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {integrations.map((item) => (
                    <article key={item.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 ring-1 ring-slate-200">
                        <DashboardIcon name={item.icon as IconName} className="h-4 w-4" />
                      </div>
                      <h3 className="mt-3 text-sm font-extrabold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                      <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
                        {item.status}
                      </span>
                    </article>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-slate-200">
                  {auditEvents.map((item, index) => (
                    <div key={item.event} className={`grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center ${index !== auditEvents.length - 1 ? 'border-b border-slate-200' : ''}`}>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{item.event}</h3>
                        <p className="mt-1 text-xs text-slate-500">{item.user} - {item.time}</p>
                      </div>
                      <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">{item.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Placement Intelligence</p>
                  <h2 className="mt-1 text-xl font-extrabold text-slate-900">Cross-platform operations snapshot</h2>
                </div>
                <DashboardIcon name="chart" className="h-5 w-5 text-slate-400" />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                {[
                  ['Assessment completion', '86%', 'bg-blue-600'],
                  ['Recruiter response SLA', '92%', 'bg-emerald-600'],
                  ['College data freshness', '79%', 'bg-violet-600'],
                  ['Mentor session fill rate', '68%', 'bg-amber-500'],
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </main>
     </div>
     
    </div>
  );
};
