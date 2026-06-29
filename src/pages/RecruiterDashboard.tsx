import React, { useState } from 'react';
import {
  Brain,
  UserCheck,
  BookOpen,
  Users,
  Cpu,
  Calendar,
  Award,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Clock,
  BookOpenCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  skills: string[];
  interviewStatus: string;
  hiringStatus: string;
  statusBadge: string;
}

interface Application {
  id: string;
  name: string;
  role: string;
  submitted: string;
  interview: string;
  hiring: string;
  score: number;
}

const analyticsData = [
  { month: 'Jan', score: 68 },
  { month: 'Feb', score: 74 },
  { month: 'Mar', score: 79 },
  { month: 'Apr', score: 86 },
  { month: 'May', score: 91 },
];

const recruiterStats = [
  { label: 'Active Roles', value: '12', bg: 'bg-indigo-50/60', text: 'text-indigo-700', border: 'border-indigo-100/60' },
  { label: 'Pipeline', value: '34', bg: 'bg-emerald-50/60', text: 'text-emerald-700', border: 'border-emerald-100/60' },
  { label: 'Interviews', value: '16', bg: 'bg-amber-50/60', text: 'text-amber-700', border: 'border-amber-100/60' },
  { label: 'Offers', value: '8', bg: 'bg-purple-50/60', text: 'text-purple-700', border: 'border-purple-100/60' }
];

const topCandidates: Candidate[] = [
  {
    id: 'C-001',
    name: 'Aarav Patel',
    role: 'Full Stack Developer',
    score: 92,
    skills: ['React', 'Node.js', 'TypeScript'],
    interviewStatus: 'Scheduled',
    hiringStatus: 'Pending',
    statusBadge: 'bg-slate-100 text-slate-700'
  },
  {
    id: 'C-002',
    name: 'Neha Sharma',
    role: 'Data Analyst',
    score: 88,
    skills: ['Python', 'SQL', 'Tableau'],
    interviewStatus: 'Completed',
    hiringStatus: 'Offer',
    statusBadge: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 'C-003',
    name: 'Riya Mehta',
    role: 'UI/UX Designer',
    score: 85,
    skills: ['Figma', 'CSS', 'Accessibility'],
    interviewStatus: 'Screening',
    hiringStatus: 'Pending',
    statusBadge: 'bg-amber-100 text-amber-700'
  },
  {
    id: 'C-004',
    name: 'Karan Joshi',
    role: 'Cloud Engineer',
    score: 82,
    skills: ['AWS', 'Docker', 'Kubernetes'],
    interviewStatus: 'Scheduled',
    hiringStatus: 'Pending',
    statusBadge: 'bg-slate-100 text-slate-700'
  }
];

const recentApplications: Application[] = [
  {
    id: 'A-101',
    name: 'Mira Kapoor',
    role: 'Backend Engineer',
    submitted: '2 days ago',
    interview: 'Pending',
    hiring: 'Pending',
    score: 76
  },
  {
    id: 'A-102',
    name: 'Vikram Reddy',
    role: 'Machine Learning Intern',
    submitted: '3 days ago',
    interview: 'Scheduled',
    hiring: 'Pending',
    score: 83
  },
  {
    id: 'A-103',
    name: 'Sana Khan',
    role: 'Frontend Engineer',
    submitted: '5 days ago',
    interview: 'Completed',
    hiring: 'Offer',
    score: 89
  },
  {
    id: 'A-104',
    name: 'Rahul Verma',
    role: 'DevOps Specialist',
    submitted: '6 days ago',
    interview: 'Screening',
    hiring: 'Pending',
    score: 80
  }
];

export const RecruiterDashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 text-slate-800 antialiased">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recruiter Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">Aarav Mehta</span> 👋
          </p>
        </div>

        <div className="relative self-stretch sm:self-auto">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all w-full sm:w-auto"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-indigo-200">
              AM
            </div>
            <div className="text-left hidden xs:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Aarav Mehta</p>
              <p className="text-[10px] text-slate-500 leading-tight">Senior Recruiter</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[9999]">
              <div className="p-3 border-b border-slate-100">
                <h3 className="font-semibold text-sm text-slate-950">Aarav Mehta</h3>
                <p className="text-xs text-slate-500">aarav.mehta@corp.com</p>
              </div>
              {['My Profile', 'Candidates', 'Job Postings', 'Settings'].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-white shadow-inner">AM</div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">Aarav Mehta</h2>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-100">REC-21</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Campus2Corporate Talent Team</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-medium text-slate-700">aarav.mehta@corp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-medium text-slate-700">+91 91234 56789</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Users className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Team</p>
                  <p className="font-medium text-slate-700">Talent Acquisition</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="font-medium text-slate-700">Bengaluru, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-indigo-500" />
              Recruitment Statistics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {recruiterStats.map((stat) => (
                <div key={stat.label} className={`p-4 rounded-xl border ${stat.bg} ${stat.border}`}>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Candidate Score Analytics</h2>
                <p className="text-xs text-slate-500">Track average candidate performance across the recruitment pipeline</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">Score Trend</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">Hiring Readiness</span>
              </div>
            </div>

            <div className="w-full" style={{ height: 235 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Top Candidates</h2>
                <p className="text-xs text-slate-500">Review prioritized student profiles, skills, and hiring readiness</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">{candidate.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{candidate.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-1">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
                      <p className="text-2xl font-bold text-slate-900">{candidate.score}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {candidate.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl bg-white p-3 border border-slate-100 text-[11px] text-slate-600">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Interview</p>
                      <p className="mt-1 font-semibold text-slate-900">{candidate.interviewStatus}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3 border border-slate-100 text-[11px] text-slate-600">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Hiring</p>
                      <p className="mt-1 font-semibold text-slate-900">{candidate.hiringStatus}</p>
                    </div>
                    <div className={
                      `rounded-2xl p-3 text-[11px] font-semibold ${candidate.statusBadge} border ${candidate.statusBadge.includes('emerald') ? 'border-emerald-200' : candidate.statusBadge.includes('amber') ? 'border-amber-200' : 'border-slate-200'}`
                    }>
                      <p>Profile</p>
                      <p className="mt-1 text-slate-800">{candidate.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6 overflow-hidden">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-lg font-bold text-slate-950">Skill Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">Analyze the skill readiness and shortlist capability across student segments</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[26px] left-[6%] right-[6%] h-[2px] bg-slate-100"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {[
              { step: '01', title: 'Talent Discovery', desc: 'Source best-fit candidates.', icon: Users },
              { step: '02', title: 'Skills Mapping', desc: 'Match candidates to roles.', icon: Brain },
              { step: '03', title: 'Screening', desc: 'Align assessments and fit.', icon: BookOpen },
              { step: '04', title: 'Shortlisting', desc: 'Prioritize top performers.', icon: UserCheck },
              { step: '05', title: 'Interview', desc: 'Sync calendar availability.', icon: Calendar },
              { step: '06', title: 'Offer Planning', desc: 'Finalize compensation fit.', icon: Cpu },
              { step: '07', title: 'Hiring', desc: 'Convert-ready candidates.', icon: Award }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-4 bg-slate-50/50 rounded-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-indigo-100 hover:bg-white group">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-sm relative z-10 group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                  <item.icon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 text-[8px] bg-slate-100 border border-slate-200 text-slate-500 font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-slate-700 mt-4 group-hover:text-slate-900 transition-colors">{item.title}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
        <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Recent Applications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentApplications.map((application) => (
            <div key={application.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{application.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{application.role}</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-700">{application.submitted}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-3 border border-slate-100 text-[11px] text-slate-600">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Interview</p>
                  <p className="mt-1 font-semibold text-slate-900">{application.interview}</p>
                </div>
                <div className="rounded-2xl bg-white p-3 border border-slate-100 text-[11px] text-slate-600">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Hiring</p>
                  <p className="mt-1 font-semibold text-slate-900">{application.hiring}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <p>Candidate score</p>
                <p className="font-semibold text-slate-900">{application.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
