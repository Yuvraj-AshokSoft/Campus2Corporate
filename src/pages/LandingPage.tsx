import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Brain, 
  TrendingUp, 
  Calendar, 
  Cpu, 
  Award, 
  BookOpen, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Check, 
  BarChart3, 
  Database, 
  MessageSquare,
  Building,
  Target,
  Sparkles,
  Zap,
  Mic,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<'student' | 'recruiter' | 'college'>('student');
  const [hoveredStakeholder, setHoveredStakeholder] = useState<string | null>(null);

  const stakeholders = [
    { id: 'student', name: 'Student', desc: 'Builds skills, takes assessments, and matches with ideal corporate opportunities.', color: 'from-blue-500 to-cyan-400' },
    { id: 'college', name: 'College', desc: 'Monitors student performance, schedules drives, and gains real-time readiness analytics.', color: 'from-purple-500 to-indigo-400' },
    { id: 'mentor', name: 'Mentor', desc: 'Provides industry-relevant feedback, reviews mock interviews, and guides career roadmaps.', color: 'from-pink-500 to-rose-400' },
    { id: 'recruiter', name: 'Recruiter', desc: 'Finds verified candidates with exact matching skills, reducing sourcing overhead.', color: 'from-emerald-500 to-teal-400' },
    { id: 'company', name: 'Company', desc: 'Builds structured talent pipelines directly through campus engagement campaigns.', color: 'from-amber-500 to-orange-400' },
    { id: 'admin', name: 'Admin', desc: 'Orchestrates systemic parameters, manages integrations, and audits platform safety.', color: 'from-gray-500 to-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden">
      
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]"></div>
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px]"></div>
        <div className="absolute top-[30%] left-[5%] w-[300px] h-[300px] rounded-full bg-cyan-600/5 blur-[100px]"></div>
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-extrabold text-xl tracking-tighter">C2C</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">C2C – Campus to Corporate</span>
              <span className="block text-[10px] mt-1 text-slate-400 uppercase tracking-widest font-semibold leading-none">by Ashoksoft Technologies</span>
            </div>
          </div>
          {/* //// navbar.... */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
  <a href="#problem" className="hover:text-blue-400 transition-colors">
    Problem
  </a>

  <a href="#solution" className="hover:text-blue-400 transition-colors">
    Solution
  </a>

  {/* Core Features Dropdown */}
  <div className="relative group">
    <button className="hover:text-blue-400 transition-colors">
      Core Features
    </button>

    <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Resume Analyzer</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">AI Mock Interviews</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Skill Assessments</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Placement Monitoring</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Learning Roadmaps</a>
    
    </div>
  </div>

  <a href="#ecosystem" className="hover:text-blue-400 transition-colors">
    Ecosystem
  </a>

  <a href="#ai" className="hover:text-blue-400 transition-colors">
    AI Engine
  </a>

  {/* Dashboards Dropdown */}
  <div className="relative group">
    <button className="hover:text-blue-400 transition-colors">
      Dashboards
    </button>

    <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Student Dashboard</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">College Dashboard</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Recruiter Dashboard</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Mentor Dashboard</a>
      <a href="#" className="block px-4 py-2 hover:bg-slate-800">Admin Dashboard</a>
    </div>
  </div>
</nav>

          <div className="flex items-center space-x-4">
            <button className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white transition-colors font-medium">
              Sign In
            </button>
            <a 
              href="#cta"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              Demo Access
            </a>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading and copy */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Employability Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Transforming Students into <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Industry-Ready</span> Professionals
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              An AI-powered employability ecosystem connecting students, colleges, mentors, recruiters, and companies through learning, assessment, mentorship, hiring, and placement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#cta"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="#solution"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800 text-base font-semibold text-slate-200 hover:bg-slate-900 transition-all"
              >
                Explore Platform
              </a>
            </div>

            {/* Quick Metrics banner */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900 max-w-xl">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">98%</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-medium">ATS Match Rate</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">10x</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Faster Sourcing</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">100%</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-medium">Verified Profiles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Dashboard Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl pointer-events-none"></div>
            
            {/* The main dashboard mockup */}
            <div className="relative bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  C2C-COGNITIVE-v1.4
                </div>
              </div>

              {/* Student Profile Info */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-white font-semibold">YS</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Yuvraj Singh</h3>
                    <p className="text-xs text-slate-400">B.Tech CSE - Final Year</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active Pipeline
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                
                {/* Profile score */}
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Ready Score</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-bold text-white">94%</span>
                    <span className="text-[10px] text-emerald-400 flex items-center font-medium">
                      +4.2% <TrendingUp className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                {/* ATS score */}
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">ATS Resume Score</span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-2xl font-bold text-white">88<span className="text-xs text-slate-400">/100</span></span>
                    <span className="text-[10px] text-blue-400 font-medium">High Match</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

              </div>

              {/* AI Job Match Widget */}
              <div className="mt-6 bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-white font-semibold flex items-center">
                    <Brain className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    AI Best Matches
                  </span>
                  <span className="text-[10px] text-slate-400">Real-time calculations</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Software Engineer (L4) - Stripe</span>
                    <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">97% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Full Stack Engineer - Notion</span>
                    <span className="font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10">92% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">React Frontend Dev - Linear</span>
                    <span className="font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">89% Match</span>
                  </div>
                </div>
              </div>

              {/* Placement progress tracker */}
              <div className="mt-6">
                <span className="text-xs text-slate-400 font-medium block mb-3">Placement Milestone Progress</span>
                <div className="relative pl-6 space-y-4 border-l-2 border-slate-800">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-none">Assessment Complete</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Scored 92nd percentile in Technical Logic</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white leading-none">AI Profile Matching</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Resume processed & keywords synchronized</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center border-4 border-slate-950">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-blue-400 leading-none">Interview Pipeline</h4>
                      <p className="text-[10px] text-slate-400 mt-1">2 technical rounds scheduled with Stripe team</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Trusted Value Section */}
      <section className="relative z-10 py-16 bg-slate-950/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Multi-Stakeholder Architecture</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Connecting the Entire Employability Ecosystem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Student Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-blue-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Students</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn, Grow & Get Placed. Utilize AI maps to level up skills, build verified profiles, and lock down top roles.
              </p>
            </div>

            {/* College Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-indigo-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Colleges</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track Performance & Improve Outcomes. Aggregate student readiness scores and streamline placement drives.
              </p>
            </div>

            {/* Recruiter Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-cyan-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Recruiters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover Verified Talent. Shortlist pre-assessed candidates with transparent background verification scores.
              </p>
            </div>

            {/* Mentor Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-pink-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 group-hover:bg-pink-600 group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Mentors</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guide Future Professionals. Review mock coding interviews, guide portfolios, and earn industry credits.
              </p>
            </div>

            {/* Company Card */}
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Companies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build Future Workforce. Anchor long-term campus programs, brand internships, and target matching cohorts.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="problem" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            The Industry Bottleneck
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            The Gap Between Campus and Corporate Is Real
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Students struggle with direction, while hiring managers are buried under unverified noise. Current processes are fragmented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Problem 1 */}
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all"></div>
            <div className="text-red-400 text-sm font-mono font-bold mb-3">01 / DISORIENTATION</div>
            <h3 className="text-base font-bold text-white mb-2">Students lack career direction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curriculums lack modular alignment to dynamic market profiles, leading graduates to apply blindly to random roles.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all"></div>
            <div className="text-red-400 text-sm font-mono font-bold mb-3">02 / DARK PIPELINE</div>
            <h3 className="text-base font-bold text-white mb-2">Colleges lack placement visibility</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Administrators lack unified dashboards to monitor readiness analytics or audit manual student progression metrics.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all"></div>
            <div className="text-red-400 text-sm font-mono font-bold mb-3">03 / NOISE OVERHEAD</div>
            <h3 className="text-base font-bold text-white mb-2">Recruiters waste time screening</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recruiters spend up to 70% of sourcing time weeding out candidate resumes with unverified credentials and fake skills.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all"></div>
            <div className="text-red-400 text-sm font-mono font-bold mb-3">04 / DEFICIT GAP</div>
            <h3 className="text-base font-bold text-white mb-2">Companies face skill mismatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New hires take months to onboard, incurring substantial post-hire training and cohort transition costs.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Solution Section */}
      <section id="solution" className="relative z-10 py-20 bg-slate-950/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              Integrated Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              One Platform. Complete Career Journey.
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              C2C unifies the lifecycle from baseline assessment to final placement into a single digital ledger, aligning all parties.
            </p>
          </div>

          {/* Solution Path Flow */}
          <div className="relative">
            {/* Connection line in background */}
            <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-blue-500/10 via-indigo-500 to-cyan-500/10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
              
              {[
                { step: '01', title: 'Profile Building', desc: 'Secure, verified portfolio credentials.', icon: UserCheck },
                { step: '02', title: 'Skill Assessment', desc: 'AI proctored baseline tests.', icon: Brain },
                { step: '03', title: 'Learning Roadmap', desc: 'AI-curated targeted content gaps.', icon: BookOpen },
                { step: '04', title: 'Mentorship', desc: 'Mock trials & expert review logs.', icon: Users },
                { step: '05', title: 'AI Matching', desc: 'Vector alignment to active roles.', icon: Cpu },
                { step: '06', title: 'Interview', desc: 'Sync calendars and scheduling.', icon: Calendar },
                { step: '07', title: 'Placement', desc: 'Final contract signing and onboard.', icon: Award }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center bg-slate-900/25 border border-slate-900 hover:border-slate-800 rounded-xl p-5 hover:translate-y-[-4px] transition-all">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 shadow-md relative z-10">
                    <item.icon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-[9px] bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-4">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Features Section */}
      <section id="features" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Engineered for Placement Excellence
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            No placeholders. C2C offers robust tools configured to scale from college cohorts to global talent acquisition teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-blue-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI Resume ATS Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leverage real-time semantic parsing to audit resume formatting, keyword frequencies, and target matches against active company profiles.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-indigo-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Skill Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized assessments covering technical stacks and behavioral frameworks with automated browser lock and proctor auditing.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-cyan-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Learning Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically generates personalized video playlists and repository exercises to bridge precise core competency deficits.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-purple-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Candidate Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vector matching filters out unqualified applications by scoring real-time technical logic indicators, bypassing keyword stuffing.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-pink-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-5 group-hover:bg-pink-600 group-hover:text-white transition-all">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Recruiter Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct pipeline filtering, interview scheduling coordinates, background check status updates, and cohort communication suites.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-emerald-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">College Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track student enrollment readiness, aggregate assessment parameters, and audit recruitment company logs from a unified dashboard.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-amber-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Mentorship Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinate booking calendars, mock coding feedback sessions, and profile rating indicators within an integrated audit trail.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-slate-950 border border-slate-900 hover:border-teal-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-5 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Placement Monitoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit offers, track letter of intent updates, verify onboarding checks, and generate annual placement validation reports.
            </p>
          </div>


          {/* ////////// feature - 9  /// */}
        
          <div className="bg-slate-950 border border-slate-900 hover:border-blue-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
              < Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI Mock Interviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice real interview questions, get instant feedback, improve communication skills, and boost confidence before actual interviews.
            </p>

              {/* Feature 10*/}
            
          </div>
          <div className="bg-slate-950 border border-slate-900 hover:border-blue-500/20 rounded-2xl p-6 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
              < Calendar  className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Book A Demo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Schedule a personalized demo to see how our platform can help you achieve your career goals.
            </p>
            
          </div>


          
          

        </div>
      </section>

      {/* 6. Stakeholder Ecosystem Section */}
      <section id="ecosystem" className="relative z-10 py-20 bg-slate-950/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 w-fit">
                Network Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                A Unified Cognitive Network
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Campus recruitment is not a linear chain, it is a web. C2C serves as the central orchestration engine that connects students, colleges, mentors, recruiters, and companies seamlessly.
              </p>
              
              <div className="space-y-4">
                {stakeholders.map((sh) => (
                  <div 
                    key={sh.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      hoveredStakeholder === sh.id 
                        ? 'bg-slate-900 border-slate-700 shadow-lg' 
                        : 'bg-slate-900/20 border-slate-900'
                    }`}
                    onMouseEnter={() => setHoveredStakeholder(sh.id)}
                    onMouseLeave={() => setHoveredStakeholder(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{sh.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    {hoveredStakeholder === sh.id && (
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {sh.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right mesh grid layout */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              
              {/* Radial background blur */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main Visual Node Map container */}
              <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-slate-950/80 border border-slate-900 rounded-3xl p-8">
                
                {/* Center Core Engine Node */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex flex-col items-center justify-center shadow-xl shadow-blue-500/20 z-20 border border-blue-400/20">
                  <span className="text-white font-extrabold text-2xl tracking-tighter leading-none">C2C</span>
                  <span className="text-[8px] text-blue-100 uppercase tracking-widest font-semibold mt-1">Core Engine</span>
                </div>

                {/* Satellite Nodes layout in a circle */}
                {[
                  { id: 'student', name: 'Student', pos: 'top-6 left-6', icon: GraduationCap, color: 'from-blue-500 to-cyan-400' },
                  { id: 'college', name: 'College', pos: 'top-6 right-6', icon: Building, color: 'from-purple-500 to-indigo-400' },
                  { id: 'mentor', name: 'Mentor', pos: 'bottom-6 left-6', icon: Users, color: 'from-pink-500 to-rose-400' },
                  { id: 'recruiter', name: 'Recruiter', pos: 'bottom-6 right-6', icon: Briefcase, color: 'from-emerald-500 to-teal-400' },
                  { id: 'company', name: 'Company', pos: 'top-1/2 left-4 -translate-y-1/2', icon: Target, color: 'from-amber-500 to-orange-400' },
                  { id: 'admin', name: 'Admin', pos: 'top-1/2 right-4 -translate-y-1/2', icon: UserCheck, color: 'from-gray-500 to-slate-400' },
                ].map((node) => {
                  const isActive = hoveredStakeholder === node.id;
                  return (
                    <div 
                      key={node.id}
                      className={`absolute flex flex-col items-center ${node.pos} transition-all duration-300 z-10 ${
                        isActive ? 'scale-110' : 'opacity-70 scale-100'
                      }`}
                      onMouseEnter={() => setHoveredStakeholder(node.id)}
                      onMouseLeave={() => setHoveredStakeholder(null)}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-slate-900 border ${isActive ? 'border-blue-400 shadow-md' : 'border-slate-800'} flex items-center justify-center text-slate-300 transition-all`}>
                        <node.icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-900">
                        {node.name}
                      </span>
                    </div>
                  );
                })}

                {/* Animated grid background effect inside node panel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl opacity-20 pointer-events-none z-0"></div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. AI Intelligence Section */}
      <section id="ai" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: AI Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl pointer-events-none"></div>
            
            {/* The main AI intelligence mockup */}
            <div className="relative bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
              
              <div className="flex items-center space-x-2 pb-4 border-b border-slate-900">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">AI Vector Engine Analytics</span>
              </div>

              {/* Skill gap radar visualization mockup */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-300">Cognitive Fitment Vector</span>
                  <span className="text-cyan-400 font-mono">Matched: 94.2%</span>
                </div>
                
                {/* Fake code block / neural computation logs */}
                <div className="font-mono text-[9px] text-slate-400 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-900 max-h-[140px] overflow-hidden">
                  <div>&gt; Loading candidate node YS-2026...</div>
                  <div>&gt; Extracting semantic experience embeddings...</div>
                  <div className="text-blue-400">&gt; Match weight: React [1.0], TS [0.95], System Design [0.82]</div>
                  <div>&gt; Executing cosine similarity on Job-Stripe-SE-L4...</div>
                  <div className="text-emerald-400">&gt; Similarity score: 0.9423 (Excellent Match)</div>
                  <div>&gt; Detected Skill Gap: Kubernetes deployment configurations</div>
                  <div className="text-yellow-400">&gt; Queued Content: 'K8s for Frontend Developers' (2 hours)</div>
                </div>
              </div>

              {/* Output analysis boxes */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 block mb-1">Rank Status</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Top 2%</span>
                    <span className="text-[9px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">High priority</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">
                  <span className="text-[10px] text-slate-400 block mb-1">Employability Score</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">A+ Tier</span>
                    <span className="text-[9px] text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10">Verified</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: AI Explanations */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 w-fit">
              AI Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI That Understands Skills, Jobs and Career Readiness
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              C2C is powered by a proprietary matching model that evaluates students beyond keywords. We track technical logical thinking, real-time code audit assessments, and soft skills to map readiness.
            </p>

            <div className="space-y-4">
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Resume analysis</h3>
                  <p className="text-xs text-slate-400 mt-1">Extracts structured skill trees from resumes, neutralizing bias and verifying academic grades automatically.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Skill gap detection</h3>
                  <p className="text-xs text-slate-400 mt-1">Tracks student assessment errors and triggers curated, 10-minute micro-learning modules to plug specific knowledge leaks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Job recommendations</h3>
                  <p className="text-xs text-slate-400 mt-1">Evaluates job specifications using semantic mappings to align roles that match the student’s functional capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Candidate ranking</h3>
                  <p className="text-xs text-slate-400 mt-1">Ranks portfolios dynamically based on pre-assessed verification logs, helping recruiters hire in hours instead of weeks.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 8. Dashboard Preview Section */}
      <section id="previews" className="relative z-10 py-20 bg-slate-950/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              Interactive Previews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              Explore Our Stakeholder Dashboards
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              Unified, data-backed interfaces built for fast navigation, deep analysis, and micro-metric monitoring.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-3 mb-10">
            {[
              { id: 'student', label: 'Student Portal' },
              { id: 'recruiter', label: 'Recruiter Hub' },
              { id: 'college', label: 'College Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardTab(tab.id as 'student' | 'recruiter' | 'college')}
                className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  activeDashboardTab === tab.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboards Mockup Grid container */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative">
            
            {activeDashboardTab === 'student' && (
              <div className="space-y-6">
                
                {/* Header widget */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Welcome back, Yuvraj</h3>
                    <p className="text-xs text-slate-400">Here is your roadmap performance checklist for today.</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-900 p-2 rounded-xl border border-slate-800 w-fit">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold pl-2">Job Matches</span>
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">12 New</span>
                  </div>
                </div>

                {/* Dashboard core grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Stats & progress */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Roadmaps */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-4">Core Skill Roadmaps</h4>
                      <div className="space-y-4">
                        
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300 font-semibold">React & Frontend Architecture</span>
                            <span className="text-slate-400">82% Completed</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300 font-semibold">Data Structures & Analysis (TS)</span>
                            <span className="text-slate-400">65% Completed</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Open interviews table */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-4">Upcoming Interview Stages</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-850 text-slate-400 uppercase tracking-widest font-bold">
                              <th className="pb-3">Company</th>
                              <th className="pb-3">Role</th>
                              <th className="pb-3">Date</th>
                              <th className="pb-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-900">
                              <td className="py-3 font-semibold text-white">Stripe</td>
                              <td className="py-3 text-slate-300">Software Engineer (L4)</td>
                              <td className="py-3 text-slate-400">June 24, 2026</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">Technical Round 1</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-white">Notion</td>
                              <td className="py-3 text-slate-300">Frontend Developer</td>
                              <td className="py-3 text-slate-400">June 29, 2026</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold">Review Portfolio</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: AI Feed */}
                  <div className="space-y-6">
                    
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-white mb-4">AI Skill Insights</h4>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-xs">
                          <span className="font-semibold text-blue-400 block mb-1">Upgrade Alert</span>
                          We detected a minor gap in your GraphQL schema design performance. Check out the 5-min roadmap to boost match index by +3.1%.
                        </div>
                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-xs">
                          <span className="font-semibold text-emerald-400 block mb-1">ATS Optimization</span>
                          Adding "Tailwind CSS v4" to your verified portfolio keywords increased candidate search visibility index by +12.4%.
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {activeDashboardTab === 'recruiter' && (
              <div className="space-y-6">
                
                {/* Header widget */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Corporate Recruiting Portal</h3>
                    <p className="text-xs text-slate-400">Audit matching profiles across partnered college campuses in real time.</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-900 p-2 rounded-xl border border-slate-800 w-fit">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold pl-2">Total Candidates</span>
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">2,410 Verified</span>
                  </div>
                </div>

                {/* Candidate list table */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4">Top AI Job Matches - Software Engineer</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-400 uppercase tracking-widest font-bold">
                          <th className="pb-3">Candidate</th>
                          <th className="pb-3">College</th>
                          <th className="pb-3">ATS Match %</th>
                          <th className="pb-3">Assessment Log</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-900">
                          <td className="py-3">
                            <div className="font-semibold text-white">Yuvraj Singh</div>
                            <div className="text-[10px] text-slate-400">yuvraj@c2c.edu</div>
                          </td>
                          <td className="py-3 text-slate-300">IIT Delhi</td>
                          <td className="py-3 font-bold text-emerald-400">97% Match</td>
                          <td className="py-3 text-slate-400">94th percentile (A+)</td>
                          <td className="py-3 text-right">
                            <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-colors">
                              Request Interview
                            </button>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-900">
                          <td className="py-3">
                            <div className="font-semibold text-white">Ananya Sharma</div>
                            <div className="text-[10px] text-slate-400">ananya@c2c.edu</div>
                          </td>
                          <td className="py-3 text-slate-300">BITS Pilani</td>
                          <td className="py-3 font-bold text-emerald-400">92% Match</td>
                          <td className="py-3 text-slate-400">89th percentile (A)</td>
                          <td className="py-3 text-right">
                            <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-colors">
                              Request Interview
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">
                            <div className="font-semibold text-white">Rahul Verma</div>
                            <div className="text-[10px] text-slate-400">rahul@c2c.edu</div>
                          </td>
                          <td className="py-3 text-slate-300">NIT Trichy</td>
                          <td className="py-3 font-bold text-blue-400">89% Match</td>
                          <td className="py-3 text-slate-400">88th percentile (A)</td>
                          <td className="py-3 text-right">
                            <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-colors">
                              Request Interview
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {activeDashboardTab === 'college' && (
              <div className="space-y-6">
                
                {/* Header widget */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">College Placement Dashboard</h3>
                    <p className="text-xs text-slate-400">Campus-wide candidate analytics, readiness progress, and company drive updates.</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-900 p-2 rounded-xl border border-slate-800 w-fit">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold pl-2">Active Drive</span>
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">Stripe, Notion, Linear</span>
                  </div>
                </div>

                {/* Key Metrics Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Campus Placement Rate</span>
                    <span className="text-3xl font-extrabold text-white">84.2%</span>
                    <div className="text-[10px] text-emerald-400 mt-2 font-medium">+5.4% YoY increase</div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Mean Job Readiness Score</span>
                    <span className="text-3xl font-extrabold text-white">78.5%</span>
                    <div className="text-[10px] text-indigo-400 mt-2 font-medium">Class Avg (B+ tier)</div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Assessed Students</span>
                    <span className="text-3xl font-extrabold text-white">1,120</span>
                    <div className="text-[10px] text-cyan-400 mt-2 font-medium">96% of class active</div>
                  </div>

                </div>

                {/* Department placement performance */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-4">Placements by Specialization</h4>
                  <div className="space-y-4">
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-semibold">Computer Science & Engineering</span>
                        <span className="text-white font-bold">96% Placed</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300 font-semibold">Electronics & Communication</span>
                        <span className="text-white font-bold">82% Placed</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Corner highlight graphics */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>

          </div>
        </div>
      </section>

      {/* 9. Roadmap Section */}
      <section id="roadmap" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            Development Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Platform Development Roadmap
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            How we are evolving C2C into a comprehensive global ecosystem for employability verification.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="relative">
          {/* Central alignment line for timeline */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-800 pointer-events-none"></div>

          <div className="space-y-12">
            
            {/* Phase 1 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  Phase 1: Completed
                </span>
                <h3 className="text-base font-bold text-white mt-2">Frontend MVP Setup</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Scaffolded React + Vite + TS framework. Installed Tailwind CSS and created stakeholder folder structures and placeholders.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

            {/* Phase 2 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 border-4 border-slate-950 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="hidden md:block w-1/2 pr-12 text-right"></div>
              <div className="w-full md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                  Phase 2: In Progress
                </span>
                <h3 className="text-base font-bold text-white mt-2">Backend & Authentication</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                  Setting up API servers, user roles (Students, Recruiters, Colleges, Mentors, Admins), and secure login pipelines.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center"></div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                  Phase 3: Q3 2026
                </span>
                <h3 className="text-base font-bold text-white mt-2">AI Matching Engine</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Integrating semantic parsing engines, scoring indicators, cosine similarity vectors, and skill path suggestions.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

            {/* Phase 4 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center"></div>
              <div className="hidden md:block w-1/2 pr-12 text-right"></div>
              <div className="w-full md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                  Phase 4: Q4 2026
                </span>
                <h3 className="text-base font-bold text-white mt-2">College Pilot Launch</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">
                  Deploying C2C to pilot institutions to sync drive schedules, verify profiles, and iterate recruiter matchmaking.
                </p>
              </div>
            </div>

            {/* Phase 5 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center"></div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                  Phase 5: 2027
                </span>
                <h3 className="text-base font-bold text-white mt-2">Scale Across Institutions</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Opening open API schemas for direct ATS integrations and expanding learning content partnerships.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. CTA Section */}
      <section id="cta" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-950 via-slate-950 to-indigo-950 border border-slate-800 p-8 md:p-16 text-center">
          
          {/* Blurs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Let’s Build the Future of Student Employability
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              From learning to earning, C2C creates a measurable path for every student, college, recruiter, and enterprise.
            </p>
            <div className="pt-6">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.02]">
                Start Building
                <Zap className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-extrabold text-sm tracking-tighter">C2C</span>
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white">C2C – Campus to Corporate</span>
                <span className="block text-[8px] mt-1 text-slate-400 uppercase tracking-widest font-semibold leading-none">by Ashoksoft Technologies</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>

            <div className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Ashoksoft Technologies. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
