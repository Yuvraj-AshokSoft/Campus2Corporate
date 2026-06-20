import React from 'react';

type IconName =
  | 'activity'
  | 'alert'
  | 'arrow-up'
  | 'bell'
  | 'briefcase'
  | 'building'
  | 'check'
  | 'clock'
  | 'dashboard'
  | 'graduation'
  | 'search'
  | 'settings'
  | 'shield'
  | 'sparkles'
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
    graduation: (
      <>
        <path d="m22 10-10-5-10 5 10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
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

const stats = [
  {
    label: 'Active students',
    value: '18,420',
    change: '+12.4%',
    icon: 'users',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    label: 'Partner colleges',
    value: '126',
    change: '+8 this month',
    icon: 'building',
    tone: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    label: 'Open drives',
    value: '74',
    change: '19 closing soon',
    icon: 'briefcase',
    tone: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  {
    label: 'Verified mentors',
    value: '382',
    change: '+31 pending',
    icon: 'graduation',
    tone: 'bg-violet-50 text-violet-700 ring-violet-100',
  },
] satisfies Array<{
  label: string;
  value: string;
  change: string;
  icon: IconName;
  tone: string;
}>;

const approvals = [
  { title: 'Recruiter verification', count: 18, meta: 'KYC and role validation', severity: 'High' },
  { title: 'College onboarding', count: 7, meta: 'Principal approval letters', severity: 'Medium' },
  { title: 'Mentor profile audit', count: 31, meta: 'Credentials and availability', severity: 'Normal' },
];

const activity = [
  {
    title: 'Infosys spring drive published',
    detail: 'Eligible for 24 colleges across Karnataka and Maharashtra',
    time: '12 min ago',
    icon: 'briefcase',
  },
  {
    title: 'Placement readiness score refreshed',
    detail: '8,942 student profiles recalculated overnight',
    time: '46 min ago',
    icon: 'sparkles',
  },
  {
    title: 'Bulk college import completed',
    detail: '412 departments mapped with no duplicate records',
    time: '2 hrs ago',
    icon: 'check',
  },
] satisfies Array<{
  title: string;
  detail: string;
  time: string;
  icon: IconName;
}>;



          </div>
        </section>
      </div>
    </div>
  );
};
