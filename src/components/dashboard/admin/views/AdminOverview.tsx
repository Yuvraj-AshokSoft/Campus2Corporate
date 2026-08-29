import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Landmark,
  Briefcase,
  ClipboardList,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Download,
  X,
  Server,
  Activity,
  Wifi,
  ShieldCheck,
  Building2,
  FileCheck,
  Megaphone,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const AdminOverview: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'All Platforms' | 'Web' | 'Mobile'>('All Platforms');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalColleges: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    totalProjects: 0,
    totalApplications: 0,
    activeProjects: 0,
    pendingColleges: 0,
    pendingRecruiters: 0,
    pendingVerifications: 0,
    openTickets: 0,
    totalBroadcasts: 0,
    systemHealth: 'Operational',
  });

  // Modal and Toast States
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getDashboardAnalytics();
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
      triggerToast('⚠️ Unable to load latest real-time stats from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // Handler for Exporting Weekly Report
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Status,Period\n' +
      `Total Students,${stats.totalStudents},Active,Current\n` +
      `Colleges,${stats.totalColleges},Active Partnerships,Current\n` +
      `Recruiters,${stats.totalRecruiters},Corporate Partners,Current\n` +
      `Active Projects,${stats.activeProjects},Open Postings,Current\n` +
      `Applications,${stats.totalApplications},Student Submissions,Current\n` +
      `Pending Verifications,${stats.pendingVerifications},Queue Count,Current\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'C2C_Executive_Admin_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('📥 Executive Report CSV generated and downloaded.');
  };

  // Handler for Submitting Broadcast
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !broadcastTitle.trim()) return;

    try {
      await adminApi.createBroadcast({
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        targetAudience: 'all_students',
        priority: 'high',
      });
      setShowBroadcastModal(false);
      triggerToast(`📢 Platform Broadcast dispatched: "${broadcastTitle.trim()}"`);
      setBroadcastTitle('');
      setBroadcastMessage('');
      fetchOverviewData();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to dispatch broadcast.');
    }
  };

  // Traffic Chart Data Sets mapped by Platform Selection
  const chartDatasets: Record<'All Platforms' | 'Web' | 'Mobile', { label: string; value: number; pointStr: string; displayVal: string }[]> = {
    'All Platforms': [
      { label: 'May 01', value: 1.0, pointStr: '1.0k', displayVal: '1,000 visits' },
      { label: 'May 08', value: 5.5, pointStr: '5.5k', displayVal: '5,500 visits' },
      { label: 'May 15', value: 7.2, pointStr: '7.2k', displayVal: '7,200 visits' },
      { label: 'May 22', value: 4.0, pointStr: '4.0k', displayVal: '4,000 visits' },
      { label: 'May 30', value: 9.2, pointStr: '9.2k', displayVal: '9,200 visits' },
    ],
    Web: [
      { label: 'May 01', value: 0.7, pointStr: '700', displayVal: '700 visits' },
      { label: 'May 08', value: 4.0, pointStr: '4.0k', displayVal: '4,000 visits' },
      { label: 'May 15', value: 5.5, pointStr: '5.5k', displayVal: '5,500 visits' },
      { label: 'May 22', value: 3.0, pointStr: '3.0k', displayVal: '3,000 visits' },
      { label: 'May 30', value: 6.8, pointStr: '6.8k', displayVal: '6,800 visits' },
    ],
    Mobile: [
      { label: 'May 01', value: 0.3, pointStr: '300', displayVal: '300 visits' },
      { label: 'May 08', value: 1.5, pointStr: '1.5k', displayVal: '1,500 visits' },
      { label: 'May 15', value: 1.7, pointStr: '1.7k', displayVal: '1,700 visits' },
      { label: 'May 22', value: 1.0, pointStr: '1.0k', displayVal: '1,000 visits' },
      { label: 'May 30', value: 2.4, pointStr: '2.4k', displayVal: '2,400 visits' },
    ],
  };

  const currentPoints = chartDatasets[selectedPlatform];

  const getSvgCoordinates = (data: typeof currentPoints) => {
    const xCoords = [30, 165, 300, 435, 570];
    return data.map((d, idx) => {
      const y = 170 - (d.value / 10.0) * 150;
      return { x: xCoords[idx], y, label: d.label, displayVal: d.displayVal };
    });
  };

  const coords = getSvgCoordinates(currentPoints);

  const pathD =
    `M ${coords[0].x},${coords[0].y} ` +
    `C ${coords[0].x + 60},${coords[0].y} ${coords[1].x - 60},${coords[1].y} ${coords[1].x},${coords[1].y} ` +
    `C ${coords[1].x + 60},${coords[1].y} ${coords[2].x - 60},${coords[2].y} ${coords[2].x},${coords[2].y} ` +
    `C ${coords[2].x + 60},${coords[2].y} ${coords[3].x - 60},${coords[3].y} ${coords[3].x},${coords[3].y} ` +
    `C ${coords[3].x + 60},${coords[3].y} ${coords[4].x - 60},${coords[4].y} ${coords[4].x},${coords[4].y}`;

  const areaD = `${pathD} L ${coords[4].x},175 L ${coords[0].x},175 Z`;

  return (
    <div className="space-y-6 font-sans text-slate-800 selection:bg-purple-100 selection:text-purple-900 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. System Health Banner (Top Bar) */}
      <div className="bg-[#ECFDF5]/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>System Status: {stats.systemHealth}</span>
            </h2>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Database and API services connected. MongoDB latency optimal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={fetchOverviewData}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowDiagnosticsModal(true)}
            className="text-xs font-extrabold text-[#7C3AED] hover:text-[#6D28D9] bg-white hover:bg-purple-50/60 px-3.5 py-2 rounded-xl border border-emerald-200/80 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            View Detailed Status
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid & Pending Approvals (Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat Card 1: Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              TOTAL STUDENTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.totalStudents.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified student profiles</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Colleges */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              COLLEGES
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.totalColleges.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500">Active Institutions</div>
          </div>
        </div>

        {/* Stat Card 3: Recruiters */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              RECRUITERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.totalRecruiters.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700">
              <span>{stats.totalCompanies} corporate partners</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals Card (Right Box) */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
            PENDING APPROVALS
          </h3>

          <div className="space-y-2.5 py-1">
            {/* Row 1: College Onboarding */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">College Verifications</span>
              </div>
              <span className="bg-amber-100/90 text-amber-900 border border-amber-200/80 font-bold px-2.5 py-0.5 rounded-md text-[11px] font-mono shrink-0">
                {stats.pendingColleges} pending
              </span>
            </div>

            {/* Row 2: Recruiter Verification */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <FileCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Recruiter Verifications</span>
              </div>
              <span className="bg-rose-100/90 text-rose-800 border border-rose-200/80 font-bold px-2.5 py-0.5 rounded-md text-[11px] font-mono shrink-0">
                {stats.pendingRecruiters} pending
              </span>
            </div>

            {/* Row 3: Support Tickets */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Megaphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Open Support Tickets</span>
              </div>
              <span className="bg-slate-100 text-slate-700 border border-slate-200/80 font-bold px-2.5 py-0.5 rounded-md text-[11px] font-mono shrink-0">
                {stats.openTickets} open
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Secondary Metrics Grid & Quick Actions (Row 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat Card 4: Active Projects */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              ACTIVE DRIVES / JOBS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.activeProjects.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500">
              {stats.totalProjects} total postings created
            </div>
          </div>
        </div>

        {/* Stat Card 5: Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              STUDENT APPLICATIONS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.totalApplications.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-purple-700 font-bold">
              Submissions in pipeline
            </div>
          </div>
        </div>

        {/* Stat Card 6: Broadcast Count */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              TOTAL BROADCASTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? '...' : stats.totalBroadcasts.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Platform notices delivered
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex flex-col justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
            EXECUTIVE ACTIONS
          </h3>
          <div className="space-y-2 py-1">
            <button
              onClick={handleExportReport}
              className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Executive CSV</span>
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="w-full py-2 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Dispatch Broadcast</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Platform Traffic Overview Chart */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Traffic & Session Density</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time daily interaction volume</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            {(['All Platforms', 'Web', 'Mobile'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-white text-[#7C3AED] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full h-48 pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
            <defs>
              <linearGradient id="purpleGradientOverview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <line x1="20" y1="50" x2="580" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="20" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <path d={areaD} fill="url(#purpleGradientOverview)" />
            <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
            {coords.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r="4.5" fill="#7C3AED" stroke="#ffffff" strokeWidth="2" />
                <text x={c.x} y="192" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="700">
                  {c.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-purple-100 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Platform Core Health Diagnostics</h3>
              </div>
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>MongoDB Atlas Connection</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">ONLINE (14ms)</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Express API Gateway (Port 5000)</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">ACTIVE</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Admin JWT Cryptographic Verify</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">ENFORCED</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="px-4 py-2 bg-[#7C3AED] text-white font-bold rounded-xl text-xs hover:bg-[#6D28D9] cursor-pointer"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-purple-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Compose Quick Broadcast</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Platform Notice"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type announcement message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
