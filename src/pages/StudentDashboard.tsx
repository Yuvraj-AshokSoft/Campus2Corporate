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
  GraduationCap,
  MapPin,
  Clock,
  BookOpenCheck,
  Globe,
  Sparkles,
  PlayCircle,
  X,
  Lock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

// 100% Raw SVG Icons (Zero Lucide dependency)
const CustomGlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const CustomLinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CustomTwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// Modern Logo Component (Zero Lucide dependency)
interface LogoSVGProps {
  className?: string;
  iconColor?: string;
  textColor?: string;
}

const LogoSVG: React.FC<LogoSVGProps> = ({ className, iconColor = "text-indigo-500", textColor = "text-slate-900" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg className={`w-8 h-8 ${iconColor}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-bold text-lg tracking-tight ${textColor}`}>
        C2C
      </span>
    </div>
  );
};

const performanceData = [
  { month: "Jan", score: 65, average: 60 },
  { month: "Feb", score: 72, average: 63 },
  { month: "Mar", score: 78, average: 68 },
  { month: "Apr", score: 85, average: 70 },
  { month: "May", score: 90, average: 72 },
];

const modules = [
  { title: 'React Development', category: 'Frontend Development', progress: 70, color: 'bg-indigo-600', badge: 'React Architect' },
  { title: 'Python Programming', category: 'Programming Fundamentals', progress: 45, color: 'bg-emerald-600', badge: 'Python Core' },
  { title: 'Data Structures & Algorithms', category: 'Technical Interview Prep', progress: 60, color: 'bg-violet-600', badge: 'DSA Apprentice' },
  { title: 'Aptitude Training', category: 'Placement Prep', progress: 85, color: 'bg-amber-500', badge: 'Aptitude Pro' }
];

export const StudentDashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<number>(2); // Default to Step 3: Learning Roadmap
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profileCompleteness, setProfileCompleteness] = useState(85);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const roadmapSteps = [
    { 
      step: '01', 
      title: 'Profile Building', 
      desc: 'Secure, verified credentials.', 
      icon: UserCheck, 
      status: 'completed',
      details: 'Your profile details are complete. Resume uploaded and verified.',
      actionLabel: 'Update Resume / CV',
      onAction: () => showToast("Redirecting to Resume Builder...")
    },
    { 
      step: '02', 
      title: 'Skill Assessment', 
      desc: 'AI proctored baseline tests.', 
      icon: Brain, 
      status: 'completed',
      details: 'Baseline assessments completed for Python & Web Dev. Top 15% percentile.',
      actionLabel: 'Retake Diagnostic Test',
      onAction: () => showToast("Opening AI Proctored Portal...")
    },
    { 
      step: '03', 
      title: 'Learning Roadmap', 
      desc: 'Curated targeted content.', 
      icon: BookOpen, 
      status: 'in-progress',
      details: 'You are currently pursuing 4 modules. Target is to reach 80% average progress.',
      actionLabel: 'Resume React Module',
      onAction: () => showToast("Launching React Workspace...")
    },
    { 
      step: '04', 
      title: 'Mentorship', 
      desc: 'Mock trials & expert reviews.', 
      icon: Users, 
      status: 'locked',
      details: 'Unlocks when average module completion hits 75%. (Current: 65%)',
      actionLabel: 'Request Early Access',
      onAction: () => showToast("Early access request sent to administration.")
    },
    { 
      step: '05', 
      title: 'AI Matching', 
      desc: 'Vector matching active roles.', 
      icon: Cpu, 
      status: 'locked',
      details: 'AI job pairing algorithm based on completed verified credentials.',
      actionLabel: 'View Match Criteria',
      onAction: () => showToast("Opening AI matchmaking matrix...")
    },
    { 
      step: '06', 
      title: 'Interview', 
      desc: 'Calendars scheduling.', 
      icon: Calendar, 
      status: 'locked',
      details: 'Coordinate calendars and connect directly with hiring managers.',
      actionLabel: 'View Schedule Guidelines',
      onAction: () => showToast("Loading interview policies...")
    },
    { 
      step: '07', 
      title: 'Placement', 
      desc: 'Final contract signing.', 
      icon: Award, 
      status: 'locked',
      details: 'Receive letters of intent, contracts, and digital onboarding.',
      actionLabel: 'Connect HR Support',
      onAction: () => showToast("Contacting placement officer support...")
    }
  ];

  const recommendedJobs = [
    { title: "Frontend Developer Intern", company: "Stripe", match: 94, location: "Remote", type: "Full-Time", salary: "$4k - $6k/mo" },
    { title: "Software Engineer - Python", company: "Atlassian", match: 88, location: "San Francisco, CA", type: "Hybrid", salary: "$110k - $130k/yr" },
    { title: "React Developer", company: "Vercel", match: 85, location: "New York, NY", type: "Remote", salary: "$90k - $110k/yr" }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50  text-slate-800 antialiased font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className=" p-4 md:p-8 fixed bottom-5 right-5 z-[99999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-850 animate-slide-in">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4  h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">Yuvraj Singh</span> 👋
          </p>
        </div>

        {/* Profile Dropdown */}
        <div className="relative self-stretch sm:self-auto">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all w-full sm:w-auto"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-indigo-200">
              YS
            </div>
            <div className="text-left hidden xs:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Yuvraj Singh</p>
              <p className="text-[10px] text-slate-500 leading-tight">B.Tech CSE - 4th Year</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[9999]">  
              <div className="p-3 border-b border-slate-100">
                <h3 className="font-semibold text-sm text-slate-950">Yuvraj Singh</h3>
                <p className="text-xs text-slate-500">yuvraj@example.com</p>
              </div>
              {['My Profile', 'My Courses', 'Certificates', 'Settings'].map((item) => (
                <button key={item} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Profile & Metrics */}
        <div className="space-y-6">
          
          {/* Profile Card with Completeness Dial */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="url(#gradientColor)" strokeWidth="6" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * profileCompleteness) / 100}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute font-bold text-lg text-slate-800">
                  {profileCompleteness}%
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-4 leading-tight">Yuvraj Singh</h2>
              <p className="text-xs text-slate-500 mt-1">B.Tech Computer Science & Eng.</p>
              
              <button 
                onClick={() => {
                  setProfileCompleteness(100);
                  showToast("AI Resume analysis complete! Profile strength set to 100%");
                }}
                className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors border border-indigo-100/50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optimize Profile with AI
              </button>
            </div>

            <div className="mt-5 space-y-3.5">
              <div className="flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-semibold text-slate-700">yuvraj@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-semibold text-slate-700">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">University</p>
                  <p className="font-semibold text-slate-700">Campus2Corporate University</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Overview Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-indigo-500" />
              Registration Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Registered', val: '5', bg: 'bg-indigo-50/50', text: 'text-indigo-700', border: 'border-indigo-100/50' },
                { label: 'Completed', val: '2', bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-100/50' },
                { label: 'Pending', val: '3', bg: 'bg-amber-50/50', text: 'text-amber-700', border: 'border-amber-100/50' },
                { label: 'Certificates', val: '1', bg: 'bg-purple-50/50', text: 'text-purple-700', border: 'border-purple-100/50' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-xl border ${stat.bg} ${stat.border}`}>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Graph, Modules & AI Matching */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Performance Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Performance Overview
                </h2>
                <p className="text-xs text-slate-500">Learning score metric progression vs batch average</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>You</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>Batch Avg</span>
              </div>
            </div>

            <div className="w-full" style={{ height: 235 }}>
              <ResponsiveContainer width="100%" height="100%"> 
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="avgColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
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
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="average"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={0.5}
                    fill="url(#avgColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Combined Modules & Progress Bars */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Modules & Learning Progress</h2>
                <p className="text-xs text-slate-500">Track and monitor your course completion status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/30 group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">{mod.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">{mod.category}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-medium">
                          {mod.badge}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{mod.progress}%</span>
                  </div>
                  
                  {/* Styled Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full ${mod.color} transition-all duration-500`}
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Placement Roadmap Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6 overflow-hidden">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-lg font-bold text-slate-950">Interactive Placement Journey</h2>
          <p className="text-xs text-slate-500 mt-1">Click on each milestone to check its status, access metrics, and open actions.</p>
        </div>
          
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-[26px] left-[6%] right-[6%] h-[2px] bg-slate-100"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {roadmapSteps.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = activeRoadmapStep === idx;
              
              let borderClass = "border-slate-100 hover:border-slate-200";
              let iconClass = "bg-white border-slate-200/80 text-slate-500";
              let badgeClass = "bg-slate-100 border-slate-200 text-slate-500";
              
              if (item.status === 'completed') {
                borderClass = "border-emerald-100 hover:border-emerald-200 bg-emerald-50/20";
                iconClass = "bg-emerald-50 border-emerald-100 text-emerald-650 text-emerald-600";
                badgeClass = "bg-emerald-100 border-emerald-200 text-emerald-700";
              } else if (item.status === 'in-progress') {
                borderClass = "border-indigo-100 bg-indigo-50/10";
                iconClass = "bg-indigo-50 border-indigo-100 text-indigo-600 ring-2 ring-indigo-100";
                badgeClass = "bg-indigo-100 border-indigo-200 text-indigo-700";
              } else if (item.status === 'locked') {
                borderClass = "border-slate-100 opacity-60";
                iconClass = "bg-slate-50 border-slate-150 text-slate-400";
                badgeClass = "bg-slate-100 border-slate-150 text-slate-400";
              }

              if (isSelected) {
                borderClass = "border-indigo-400 bg-white ring-2 ring-indigo-50";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => setActiveRoadmapStep(idx)}
                  className={`relative flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 border text-left w-full ${borderClass}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative z-10 transition-all ${iconClass}`}>
                    {item.status === 'locked' ? <Lock className="w-4.5 h-4.5" /> : <IconComp className="w-5 h-5" />}
                    <span className={`absolute -top-1 -right-1 text-[8px] font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm border ${badgeClass}`}>
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-700 mt-4">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed hidden sm:block">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Dynamic Details Drawer below the roadmap */}
          <div className="mt-6 p-5 rounded-xl border border-slate-150 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  Milestone Details - {roadmapSteps[activeRoadmapStep].step}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  roadmapSteps[activeRoadmapStep].status === 'completed' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' :
                  roadmapSteps[activeRoadmapStep].status === 'in-progress' ? 'text-indigo-700 bg-indigo-50 border-indigo-100' :
                  'text-slate-500 bg-slate-100 border-slate-200'
                }`}>
                  {roadmapSteps[activeRoadmapStep].status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-2">
                {roadmapSteps[activeRoadmapStep].title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {roadmapSteps[activeRoadmapStep].details}
              </p>
            </div>
            
            <button
              onClick={roadmapSteps[activeRoadmapStep].onAction}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-indigo-600 transition-colors shadow-md w-full md:w-auto justify-center"
            >
              <PlayCircle className="w-4 h-4" />
              {roadmapSteps[activeRoadmapStep].actionLabel}
            </button>
          </div>
        </div>
      </div>

      {/* AI Job Matches & Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* AI Job Matching Deck */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                AI-Recommended Roles
              </h2>
              <p className="text-xs text-slate-500">Jobs matched directly to your verified skill portfolio</p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg">
              3 Matches Found
            </span>
          </div>

          <div className="space-y-4">
            {recommendedJobs.map((job, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:border-slate-200 transition-all flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-slate-800 leading-none">{job.title}</h3>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-500">{job.company}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{job.location}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-indigo-600">{job.salary}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{job.match}%</div>
                    <div className="text-[9px] font-medium text-emerald-600">Match</div>
                  </div>
                  
                  <button 
                    onClick={() => showToast(`Application initiated for ${job.title} at ${job.company}!`)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Activities Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Upcoming Activities
              </h2>
              <p className="text-xs text-slate-500">Upcoming assignments, assessments, and mock rounds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'React Project Submission', desc: 'Module 3 Project Capstone', date: 'Due: 25 Jun', color: 'text-rose-600 bg-rose-50 border-rose-100', action: 'Submit' },
              { title: 'Aptitude Assessment', desc: 'Placement Prep Test', date: '28 Jun', color: 'text-amber-700 bg-amber-50 border-amber-100', action: 'Practice' },
              { title: 'Mentor Session', desc: 'One-on-One Career Advice', date: '30 Jun', color: 'text-indigo-700 bg-indigo-50 border-indigo-100', action: 'Join Room' },
              { title: 'Mock Interview', desc: 'Technical & DSA Practice', date: '05 Jul', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', action: 'Prepare' }
            ].map((activity, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all bg-white group">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activity.color}`}>
                    {activity.date}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-800 mt-3 leading-snug">
                    {activity.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {activity.desc}
                  </p>
                </div>
                <button 
                  onClick={() => showToast(`Launching workspace for: ${activity.title}`)}
                  className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                >
                  {activity.action}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      
      <footer className=" w-full relative z-10 border-t border-slate-800 bg-slate-900 text-slate-400 py-16 mt-12  overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12">
            
            {/* Column 1: Brand */}
            <div className="lg:col-span-5 space-y-6">
              <LogoSVG className="h-9 w-auto" iconColor="text-indigo-500" textColor="text-white" />
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
                Bridging the gap between academic potential and corporate excellence through verifiable skill metrics, AI proctored assessments, and direct hiring pipelines.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-650 transition-all duration-300 shadow-sm" aria-label="LinkedIn">
                  <CustomLinkedinIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-500 hover:border-indigo-550 transition-all duration-300 shadow-sm" aria-label="Twitter">
                  <CustomTwitterIcon className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-650 transition-all duration-300 shadow-sm" aria-label="Website">
                  <CustomGlobeIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Platform</h4>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Resources</h4>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Whitepapers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Company</h4>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom Row */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-semibold text-slate-500">
              <span>&copy; {new Date().getFullYear()} Ashoksoft Technologies. All rights reserved.</span>
              <div className="flex space-x-3 md:border-l md:border-slate-800 md:pl-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Language/Region selector */}
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-xs text-slate-300 font-bold cursor-pointer hover:bg-slate-700 hover:text-white transition-all shadow-sm">
              <CustomGlobeIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Global (English)</span>
            </div>

          </div>

        </div>
      </footer>
      
    </div>
  );
};