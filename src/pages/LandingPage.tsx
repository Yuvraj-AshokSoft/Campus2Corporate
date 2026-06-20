<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
>>>>>>> e26e572c082fc8a0a61ea7233110efd8410cc1cd
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  UserCheck, 
  Brain, 
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
  Globe,
} from 'lucide-react';

// Custom Reusable Brand Logo component representing Campus2Corporate
const LogoSVG: React.FC<{ className?: string; iconColor?: string; textColor?: string }> = ({ 
  className = "h-8 w-auto", 
  iconColor = "text-blue-600", 
  textColor = "text-slate-900" 
}) => {
  return (
    <svg className={className} viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="28" height="28" rx="8" className={`fill-blue-50 stroke-current ${iconColor}`} strokeWidth="2" />
      <path d="M12 24C12 18.4772 16.4772 14 22 14" className={`stroke-current ${iconColor}`} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 16C24 21.5228 19.5228 26 14 26" className={`stroke-current ${iconColor}`} strokeWidth="3" strokeLinecap="round" />
      <text x="42" y="26" className={`fill-current ${textColor}`} fontSize="19" fontWeight="800" letterSpacing="-0.03em">C2C</text>
    </svg>
  );
};

// Inline SVG replacement for Linkedin icon since the project's outdated lucide-react package does not export it
const Linkedin: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Inline SVG replacement for Twitter icon since the project's outdated lucide-react package does not export it
const Twitter: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// Reusable Scroll Reveal component using IntersectionObserver
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = "", id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentDom = domRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (currentDom) observer.unobserve(currentDom);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (currentDom) {
      observer.observe(currentDom);
    }

    return () => {
      if (currentDom) {
        observer.unobserve(currentDom);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      id={id}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<'student' | 'recruiter' | 'college'>('student');
  const [hoveredStakeholder, setHoveredStakeholder] = useState<string | null>(null);

  // Hero phrase rotation state
  const heroPhrases = ["Empower Students", "Accelerate Hiring", "Scale Placement"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPhraseTransitioning, setIsPhraseTransitioning] = useState(false);

  // Platform event activity ticker state
  const tickerEvents = [
    { text: "A sophomore from Tech University just cleared Advanced Coding Assessment", icon: "🟢" },
    { text: "HR Manager from Horizon Corp opened 12 new corporate pipelines", icon: "💼" },
    { text: "Mentor Sarah Jenkins approved 3 technical resume reviews", icon: "🎓" },
    { text: "Placement cell synced 450 verified student profiles at Delhi Tech", icon: "⚡" },
    { text: "Candidate from NIT Trichy unlocked Frontend Architecture badge", icon: "🏆" }
  ];
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerTransitioning, setIsTickerTransitioning] = useState(false);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setIsPhraseTransitioning(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
        setIsPhraseTransitioning(false);
      }, 300);
    }, 3000);

    const tickerInterval = setInterval(() => {
      setIsTickerTransitioning(true);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerEvents.length);
        setIsTickerTransitioning(false);
      }, 400);
    }, 4000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const stakeholders = [
    { id: 'student', name: 'Student', desc: 'Builds skills, takes assessments, and matches with ideal corporate opportunities.', color: 'from-blue-500 to-cyan-400' },
    { id: 'college', name: 'College', desc: 'Monitors student performance, schedules drives, and gains real-time readiness analytics.', color: 'from-purple-500 to-indigo-400' },
    { id: 'mentor', name: 'Mentor', desc: 'Provides industry-relevant feedback, reviews mock interviews, and guides career roadmaps.', color: 'from-pink-500 to-rose-400' },
    { id: 'recruiter', name: 'Recruiter', desc: 'Finds verified candidates with exact matching skills, reducing sourcing overhead.', color: 'from-emerald-500 to-teal-400' },
    { id: 'company', name: 'Company', desc: 'Builds structured talent pipelines directly through campus engagement campaigns.', color: 'from-amber-500 to-orange-400' },
    { id: 'admin', name: 'Admin', desc: 'Orchestrates systemic parameters, manages integrations, and audits platform safety.', color: 'from-gray-500 to-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-50 selection:text-blue-700 overflow-x-hidden relative">
      
      {/* Background decoration elements (Sophomore Dot Matrix Canvas) */}
      <div className="absolute top-0 left-0 right-0 h-[650px] pointer-events-none overflow-hidden z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-80">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-[130px]"></div>
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-slate-100/60 blur-[110px]"></div>
      </div>

      {/* Header / Navbar */}
      <header className="relative z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoSVG iconColor="text-blue-600" textColor="text-slate-900" />
            <div className="hidden sm:block border-l border-slate-300 pl-3">
              <span className="text-[9px] block text-slate-500 uppercase tracking-widest font-semibold leading-none">Ashoksoft</span>
              <span className="text-[9px] block text-slate-500 uppercase tracking-widest font-semibold leading-none mt-0.5">Technologies</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#problem" className="hover:text-blue-600 transition-colors">
              Problem
            </a>

            <a href="#solution" className="hover:text-blue-600 transition-colors">
              Solution
            </a>

            {/* Core Features Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1 py-2 cursor-pointer">
                Core Features
              </button>

              <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                <a href="#" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">Resume Analyzer</a>
                <a href="#" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">AI Mock Interviews</a>
                <a href="#" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">Skill Assessments</a>
                <a href="#" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">Placement Monitoring</a>
                <a href="#" className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors">Learning Roadmaps</a>
              </div>
            </div>

            <a href="#ecosystem" className="hover:text-blue-600 transition-colors">
              Ecosystem
            </a>

            <a href="#ai" className="hover:text-blue-600 transition-colors">
              AI Engine
            </a>

            {/* Dashboards Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1 py-2 cursor-pointer">
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
            <button className="hidden sm:inline-flex text-sm text-slate-650 hover:text-slate-900 transition-colors font-semibold cursor-pointer">
              Sign In
            </button>
            <a 
              href="#cta"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              Demo Access
            </a>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Left Column: Heading and copy */}
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 w-fit animate-fade-in">
              <LogoSVG className="h-4.5 w-auto" iconColor="text-blue-600" textColor="text-blue-700" />
              <span className="border-l border-blue-200 pl-2">Next-Gen Employability Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              The Next-Gen System to <br className="hidden sm:inline" />
              <span className="relative inline-block text-blue-600 overflow-hidden w-[280px] sm:w-[450px] lg:w-[520px] text-left align-bottom">
                <span className={`inline-block transition-all duration-300 transform ${
                  isPhraseTransitioning ? 'opacity-0 translate-y-3 blur-[2px]' : 'opacity-100 translate-y-0 blur-none'
                }`}>
                  {heroPhrases[phraseIndex]}
                </span>
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              An AI-powered employability ecosystem connecting students, colleges, mentors, recruiters, and companies through learning, assessment, mentorship, hiring, and placement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a 
                  href="#cta"
                  className="group inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a 
                  href="#solution"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm"
                >
                  Explore Platform
                </a>
              </div>
            </div>

            {/* Live-Simulated Ticker */}
            <div className="pt-2 flex justify-start">
              <div className="inline-flex items-center space-x-3 bg-slate-900/[0.03] backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm hover:bg-slate-900/[0.05] transition-colors duration-200 max-w-full">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></div>
                <div className="h-5 overflow-hidden flex items-center">
                  <span className={`text-xs font-semibold text-slate-700 transition-all duration-450 transform flex items-center gap-1.5 ${
                    isTickerTransitioning ? 'opacity-0 -translate-y-2 blur-[1px]' : 'opacity-100 translate-y-0 blur-none'
                  }`}>
                    <span className="text-sm shrink-0">{tickerEvents[tickerIndex].icon}</span>
                    <span>{tickerEvents[tickerIndex].text}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics banner */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200 max-w-xl">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">98%</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">ATS Match Rate</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">10x</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Faster Sourcing</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100%</span>
                <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Verified Profiles</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Trusted Value Section */}
      <ScrollReveal className="relative z-10 py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Multi-Stakeholder Architecture</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">Connecting the Entire Employability Ecosystem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Student Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-300 group shadow-sm hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Students</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Learn, Grow & Get Placed. Utilize AI maps to level up skills, build verified profiles, and lock down top roles.
              </p>
            </div>

            {/* College Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group shadow-sm hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Colleges</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Track Performance & Improve Outcomes. Aggregate student readiness scores and streamline placement drives.
              </p>
            </div>

            {/* Recruiter Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-cyan-400 hover:shadow-md transition-all duration-300 group shadow-sm hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Recruiters</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Discover Verified Talent. Shortlist pre-assessed candidates with transparent background verification scores.
              </p>
            </div>

            {/* Mentor Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-pink-400 hover:shadow-md transition-all duration-300 group shadow-sm hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 mb-4 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Mentors</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Guide Future Professionals. Review mock coding interviews, guide portfolios, and earn industry credits.
              </p>
            </div>

            {/* Company Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-amber-400 hover:shadow-md transition-all duration-300 group shadow-sm hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Companies</h3>
              <p className="text-xs text-slate-655 leading-relaxed">
                Build Future Workforce. Anchor long-term campus programs, brand internships, and target matching cohorts.
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 3. Problem Section */}
      <ScrollReveal id="problem" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-700">
            The Industry Bottleneck
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            The Gap Between Campus and Corporate Is Real
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            Students struggle with direction, while hiring managers are buried under unverified noise. Current processes are fragmented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Problem 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-300"></div>
            <div className="text-red-700 text-xs font-mono font-bold mb-3">01 / DISORIENTATION</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Students lack career direction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curriculums lack modular alignment to dynamic market profiles, leading graduates to apply blindly to random roles.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-300"></div>
            <div className="text-red-700 text-xs font-mono font-bold mb-3">02 / DARK PIPELINE</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Colleges lack placement visibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Administrators lack unified dashboards to monitor readiness analytics or audit manual student progression metrics.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-300"></div>
            <div className="text-red-700 text-xs font-mono font-bold mb-3">03 / NOISE OVERHEAD</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Recruiters waste time screening</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recruiters spend up to 70% of sourcing time weeding out candidate resumes with unverified credentials and fake skills.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-300"></div>
            <div className="text-red-700 text-xs font-mono font-bold mb-3">04 / DEFICIT GAP</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Companies face skill mismatch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New hires take months to onboard, incurring substantial post-hire training and cohort transition costs.
            </p>
          </div>

        </div>
      </ScrollReveal>

      {/* 4. Solution Section */}
      <ScrollReveal id="solution" className="relative z-10 py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              Integrated Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              One Platform. Complete Career Journey.
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              C2C unifies the lifecycle from baseline assessment to final placement into a single digital ledger, aligning all parties.
            </p>
          </div>

          {/* Solution Path Flow */}
          <div className="relative">
            {/* Connection line in background */}
            <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-0.5 bg-slate-200"></div>
            
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
                <div key={idx} className="relative flex flex-col items-center text-center bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 mt-4">{item.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Core Features Section (Asymmetric Bento Grid Layout) */}
      <ScrollReveal id="features" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-semibold text-cyan-700">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Engineered for Placement Excellence
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            Structured into a high-performance grid, C2C offers robust tools configured to scale from college cohorts to global talent acquisition teams.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 - ATS Analysis (Span 2) */}
          <div className="bg-white border border-slate-200 hover:border-blue-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 lg:p-8 group transition-all duration-300 md:col-span-2 flex flex-col justify-between min-h-[240px] hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Resume ATS Analysis</h3>
              <p className="text-xs text-slate-650 leading-relaxed max-w-2xl">
                Leverage real-time semantic parsing to audit resume formatting, keyword frequencies, and target matches against active company profiles. Neutralize layout biases automatically and ensure maximum structural compatibility with ATS engines.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1">Advanced Parser • Standardized Audit Trail</span>
          </div>

          {/* Card 2 - Skill Assessment (Span 1, Tall Card / row-span-2) */}
          <div className="bg-white border border-slate-200 hover:border-indigo-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 group transition-all duration-300 md:row-span-2 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Skill Assessment</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Standardized assessments covering technical stacks and behavioral frameworks with automated browser lock and proctor auditing. Built to detect cognitive anomalies and verify technical competence with high-fidelity validation.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 mt-4 block">Proctor Shield Enabled</span>
          </div>

          {/* Card 3 - Learning Roadmap (Span 1) */}
          <div className="bg-white border border-slate-200 hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-5 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Learning Roadmap</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Dynamically generates personalized video playlists and repository exercises to bridge precise core competency deficits.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-cyan-700 mt-4 block">Adaptive Curriculum</span>
          </div>

          {/* Card 6 - College Analytics (Span 1) */}
          <div className="bg-white border border-slate-200 hover:border-emerald-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">College Analytics</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Track student enrollment readiness, aggregate assessment parameters, and audit recruitment company logs from a unified dashboard.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 mt-4 block">Systemic Audit Logs</span>
          </div>

          {/* Card 7 - Mentorship Tracking (Span 1, Tall Card / row-span-2) */}
          <div className="bg-white border border-slate-200 hover:border-amber-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 group transition-all duration-300 md:row-span-2 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Mentorship Tracking</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Coordinate booking calendars, mock coding feedback sessions, and profile rating indicators within an integrated audit trail. Connect with elite mentors who offer specialized, corporate-grade code reviews and architectural training.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 mt-4 block">Feedback Logs</span>
          </div>

          {/* Card 4 - Candidate Matching (Span 2) */}
          <div className="bg-white border border-slate-200 hover:border-blue-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 lg:p-8 group transition-all duration-300 md:col-span-2 flex flex-col justify-between min-h-[220px] hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Candidate Vector Matching</h3>
              <p className="text-xs text-slate-655 leading-relaxed max-w-2xl">
                Vector matching filters out unqualified applications by scoring real-time technical logic indicators, bypassing keyword stuffing. Map candidate embeddings directly against structural requirements of modern enterprise roles.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1">Cognitive Vectors • 99.4% Matching Accuracy</span>
          </div>

          {/* Card 5 - Recruiter Hub (Span 2) */}
          <div className="bg-white border border-slate-200 hover:border-pink-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 lg:p-8 group transition-all duration-300 md:col-span-2 flex flex-col justify-between min-h-[220px] hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-650 text-pink-600 mb-5 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Recruiter Hub</h3>
              <p className="text-xs text-slate-655 leading-relaxed max-w-2xl">
                Direct pipeline filtering, interview scheduling coordinates, background check status updates, and cohort communication suites. Simplify sourcing times by up to 10x with pre-screened talent listings.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-pink-600 mt-4 flex items-center gap-1">Structured Sourcing Pipeline</span>
          </div>

          {/* Card 8 - Placement Monitoring (Span 1) */}
          <div className="bg-white border border-slate-200 hover:border-teal-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-5 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Placement Monitoring</h3>
              <p className="text-xs text-slate-650 leading-relaxed">
                Audit offers, track letter of intent updates, verify onboarding checks, and generate annual placement validation reports.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-teal-700 mt-4 block">Compliance Assured</span>
          </div>

          {/* Card 9 - AI Mock Interviews (Span 2) */}
          <div className="bg-white border border-slate-200 hover:border-blue-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-2xl p-6 lg:p-8 group transition-all duration-300 md:col-span-2 flex flex-col justify-between min-h-[220px] hover:-translate-y-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Mock Interviews</h3>
              <p className="text-xs text-slate-655 leading-relaxed max-w-2xl">
                Practice real interview questions, get instant feedback, improve communication skills, and boost confidence before actual interviews. Utilize deep speech analytics to correct pacing and vocabularies.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1">Speech Analysis Engine</span>
          </div>

          {/* Card 10 - Book A Demo (Span 3 / Full Width Bento Bottom Banner) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 group transition-all duration-300 md:col-span-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl hover:-translate-y-1">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-900 text-[10px] font-bold text-blue-400 mb-3">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span>Executive Presentation</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Book A Demo Session</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Schedule a customized enterprise demo with our solutions engineer to see how our platform can aggregate student verification details, automate placements, and optimize hiring timelines for your cohort.
              </p>
            </div>
            <a 
              href="#cta" 
              className="group inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all duration-300 shadow-sm shrink-0 w-full md:w-auto hover:scale-[1.03] active:scale-[0.98]"
            >
              Schedule Review
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

        </div>
      </ScrollReveal>

      {/* 6. Stakeholder Ecosystem Section */}
      <ScrollReveal id="ecosystem" className="relative z-10 py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 w-fit">
                Network Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                A Unified Cognitive Network
              </h2>
              <p className="text-slate-655 text-slate-600 text-base leading-relaxed">
                Campus recruitment is not a linear chain, it is a web. C2C serves as the central orchestration engine that connects students, colleges, mentors, recruiters, and companies seamlessly.
              </p>
              
              <div className="space-y-4">
                {stakeholders.map((sh) => (
                  <div 
                    key={sh.id}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      hoveredStakeholder === sh.id 
                        ? 'bg-white border-blue-400 shadow-md translate-x-1' 
                        : 'bg-white/60 border-slate-200 hover:border-slate-350'
                    }`}
                    onMouseEnter={() => setHoveredStakeholder(sh.id)}
                    onMouseLeave={() => setHoveredStakeholder(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{sh.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-colors ${hoveredStakeholder === sh.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    {hoveredStakeholder === sh.id && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
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
              <div className="absolute inset-0 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main Visual Node Map container */}
              <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
                
                {/* Center Core Engine Node */}
                <div className="absolute w-28 h-28 rounded-full bg-blue-600 flex flex-col items-center justify-center shadow-xl shadow-blue-500/10 z-20 border-4 border-white">
                  <span className="text-white font-extrabold text-2xl tracking-tighter leading-none">C2C</span>
                  <span className="text-[8px] text-blue-100 uppercase tracking-widest font-bold mt-1">Core Engine</span>
                </div>

                {/* Satellite Nodes layout in a circle */}
                {[
                  { id: 'student', name: 'Student', pos: 'top-6 left-6', icon: GraduationCap },
                  { id: 'college', name: 'College', pos: 'top-6 right-6', icon: Building },
                  { id: 'mentor', name: 'Mentor', pos: 'bottom-6 left-6', icon: Users },
                  { id: 'recruiter', name: 'Recruiter', pos: 'bottom-6 right-6', icon: Briefcase },
                  { id: 'company', name: 'Company', pos: 'top-1/2 left-4 -translate-y-1/2', icon: Target },
                  { id: 'admin', name: 'Admin', pos: 'top-1/2 right-4 -translate-y-1/2', icon: UserCheck },
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
                      <div className={`w-14 h-14 rounded-2xl bg-slate-50 border ${isActive ? 'border-blue-600 shadow-md bg-white border-blue-650' : 'border-slate-200'} flex items-center justify-center text-slate-655 transition-all`}>
                        <node.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded border shadow-sm transition-colors ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                        {node.name}
                      </span>
                    </div>
                  );
                })}

                {/* Animated grid background effect inside node panel */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl opacity-50 pointer-events-none z-0"></div>

              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 7. AI Intelligence Section */}
      <ScrollReveal id="ai" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: AI Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-blue-50 rounded-3xl blur-3xl pointer-events-none"></div>
            
            {/* The main AI intelligence mockup */}
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
              
              <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">AI Vector Engine Analytics</span>
              </div>

              {/* Skill gap radar visualization mockup */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-655 text-slate-600 font-semibold">Cognitive Fitment Vector</span>
                  <span className="text-blue-700 font-mono font-bold">Matched: 94.2%</span>
                </div>
                
                {/* Clean reports / calculations logs */}
                <div className="font-mono text-[9.5px] text-slate-605 text-slate-600 space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 max-h-[150px] overflow-hidden shadow-sm">
                  <div>&gt; Loading candidate node YS-2026...</div>
                  <div>&gt; Extracting semantic experience embeddings...</div>
                  <div className="text-blue-600 font-semibold">&gt; Match weight: React [1.0], TS [0.95], System Design [0.82]</div>
                  <div>&gt; Executing cosine similarity on Job-Stripe-SE-L4...</div>
                  <div className="text-emerald-700 font-semibold">&gt; Similarity score: 0.9423 (Excellent Match)</div>
                  <div>&gt; Detected Skill Gap: Kubernetes deployment configurations</div>
                  <div className="text-amber-700 font-semibold">&gt; Queued Content: 'K8s for Frontend Developers' (2 hours)</div>
                </div>
              </div>

              {/* Output analysis boxes */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                  <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Rank Status</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Top 2%</span>
                    <span className="text-[9px] text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 font-semibold">High priority</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm">
                  <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Employability Score</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">A+ Tier</span>
                    <span className="text-[9px] text-blue-700 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 font-semibold">Verified</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: AI Explanations */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <span className="px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-semibold text-cyan-700 w-fit">
              AI Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              AI That Understands Skills, Jobs and Career Readiness
            </h2>
            <p className="text-slate-655 text-slate-600 text-base leading-relaxed">
              C2C is powered by a proprietary matching model that evaluates students beyond keywords. We track technical logical thinking, real-time code audit assessments, and soft skills to map readiness.
            </p>

            <div className="space-y-4">
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Resume analysis</h3>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Extracts structured skill trees from resumes, neutralizing bias and verifying academic grades automatically.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Skill gap detection</h3>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Tracks student assessment errors and triggers curated, 10-minute micro-learning modules to plug specific knowledge leaks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Job recommendations</h3>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Evaluates job specifications using semantic mappings to align roles that match the student’s functional capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Candidate ranking</h3>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">Ranks portfolios dynamically based on pre-assessed verification logs, helping recruiters hire in hours instead of weeks.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 8. Dashboard Preview Section */}
      <ScrollReveal id="previews" className="relative z-10 py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              Interactive Previews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              Explore Our Stakeholder Dashboards
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              Unified, data-backed interfaces built for fast navigation, deep analysis, and micro-metric monitoring.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-2 mb-10 bg-slate-200/50 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200 shadow-sm">
            {[
              { id: 'student', label: 'Student Portal' },
              { id: 'recruiter', label: 'Recruiter Hub' },
              { id: 'college', label: 'College Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardTab(tab.id as 'student' | 'recruiter' | 'college')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeDashboardTab === tab.id
                    ? 'bg-white text-blue-700 shadow-md border border-slate-200/40'
                    : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100/50 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboards Mockup Grid container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl relative overflow-hidden">
            
            {/* Student Dashboard Tab */}
            {activeDashboardTab === 'student' && (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                
                {/* Enterprise Dashboard Sidebar Mockup */}
                <div className="w-full lg:w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">S</div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Student Portal</span>
                    </div>
                    <nav className="space-y-1 text-xs">
                      <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold cursor-pointer flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Overview
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> Skill Roadmaps
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Interviews
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5" /> Mock Trials
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5" /> Portfolio
                      </div>
                    </nav>
                  </div>
                  <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    User: Yuvraj Singh
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-8 space-y-6">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Welcome back, Yuvraj</h3>
                      <p className="text-xs text-slate-500 mt-1">Here is your roadmap performance checklist for today.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold pl-2">Job Matches</span>
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">12 New</span>
                    </div>
                  </div>

                  {/* Dashboard core grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Stats & progress */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Roadmaps */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4">Core Skill Roadmaps</h4>
                        <div className="space-y-4">
                          
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-700 font-bold">React & Frontend Architecture</span>
                              <span className="text-slate-505 text-slate-500 font-medium">82% Completed</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-700 font-bold">Data Structures & Analysis (TS)</span>
                              <span className="text-slate-505 text-slate-500 font-medium">65% Completed</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Open interviews table */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-805 text-slate-800 mb-4">Upcoming Interview Stages</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-bold text-[10px]">
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-200/60">
                                <td className="py-3 font-bold text-slate-900">Stripe</td>
                                <td className="py-3 text-slate-700">Software Engineer (L4)</td>
                                <td className="py-3 text-slate-500">June 24, 2026</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px]">Technical Round 1</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3 font-bold text-slate-900">Notion</td>
                                <td className="py-3 text-slate-700">Frontend Developer</td>
                                <td className="py-3 text-slate-500">June 29, 2026</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px]">Review Portfolio</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: AI Feed */}
                    <div className="space-y-6">
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4">AI Skill Insights</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-slate-705 text-slate-700 leading-relaxed">
                            <span className="font-bold text-blue-700 block mb-1">Upgrade Alert</span>
                            We detected a minor gap in your GraphQL schema design performance. Check out the 5-min roadmap to boost match index by +3.1%.
                          </div>
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-slate-705 text-slate-700 leading-relaxed">
                            <span className="font-bold text-emerald-700 block mb-1">ATS Optimization</span>
                            Adding "Tailwind CSS v4" to your verified portfolio keywords increased candidate search visibility index by +12.4%.
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Recruiter Hub Tab */}
            {activeDashboardTab === 'recruiter' && (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                
                {/* Enterprise Dashboard Sidebar Mockup */}
                <div className="w-full lg:w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">R</div>
                      <span className="text-xs font-bold text-slate-805 text-slate-800 uppercase tracking-wider">Recruiter Hub</span>
                    </div>
                    <nav className="space-y-1 text-xs">
                      <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold cursor-pointer flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" /> Candidates
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Building className="w-3.5 h-3.5" /> Campus Drives
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Scheduler
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" /> Team Members
                      </div>
                    </nav>
                  </div>
                  <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    Stripe Sourcing Unit
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-8 space-y-6">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Corporate Recruiting Portal</h3>
                      <p className="text-xs text-slate-505 text-slate-500 mt-1">Audit matching profiles across partnered college campuses in real time.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold pl-2">Total Candidates</span>
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">2,410 Verified</span>
                    </div>
                  </div>

                  {/* Candidate list table */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-805 text-slate-800 mb-4">Top AI Job Matches - Software Engineer</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-widest font-bold text-[10px]">
                            <th className="pb-3">Candidate</th>
                            <th className="pb-3">College</th>
                            <th className="pb-3">ATS Match %</th>
                            <th className="pb-3">Assessment Log</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200/60">
                            <td className="py-3">
                              <div className="font-bold text-slate-900">Yuvraj Singh</div>
                              <div className="text-[10px] text-slate-500">yuvraj@c2c.edu</div>
                            </td>
                            <td className="py-3 text-slate-700 font-medium">IIT Delhi</td>
                            <td className="py-3 font-bold text-emerald-700">97% Match</td>
                            <td className="py-3 text-slate-600">94th percentile (A+)</td>
                            <td className="py-3 text-right">
                              <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors shadow-sm cursor-pointer">
                                Request Interview
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200/60">
                            <td className="py-3">
                              <div className="font-bold text-slate-900">Ananya Sharma</div>
                              <div className="text-[10px] text-slate-500">ananya@c2c.edu</div>
                            </td>
                            <td className="py-3 text-slate-700 font-medium">BITS Pilani</td>
                            <td className="py-3 font-bold text-emerald-700">92% Match</td>
                            <td className="py-3 text-slate-600">89th percentile (A)</td>
                            <td className="py-3 text-right">
                              <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors shadow-sm cursor-pointer">
                                Request Interview
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3">
                              <div className="font-bold text-slate-900">Rahul Verma</div>
                              <div className="text-[10px] text-slate-500">rahul@c2c.edu</div>
                            </td>
                            <td className="py-3 text-slate-700 font-medium">NIT Trichy</td>
                            <td className="py-3 font-bold text-blue-700">89% Match</td>
                            <td className="py-3 text-slate-600">88th percentile (A)</td>
                            <td className="py-3 text-right">
                              <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors shadow-sm cursor-pointer">
                                Request Interview
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* College Analytics Tab */}
            {activeDashboardTab === 'college' && (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                
                {/* Enterprise Dashboard Sidebar Mockup */}
                <div className="w-full lg:w-56 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">C</div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">College Admin</span>
                    </div>
                    <nav className="space-y-1 text-xs">
                      <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold cursor-pointer flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" /> Analytics Overview
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Student Roster
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" /> Placement Drives
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Reports
                      </div>
                    </nav>
                  </div>
                  <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    IIT Delhi Admin Portal
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-8 space-y-6">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">College Placement Dashboard</h3>
                      <p className="text-xs text-slate-500 mt-1">Campus-wide candidate analytics, readiness progress, and company drive updates.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold pl-2">Active Drive</span>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Stripe, Notion, Linear</span>
                    </div>
                  </div>

                  {/* Key Metrics Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-500 block mb-1 font-semibold">Campus Placement Rate</span>
                      <span className="text-3xl font-extrabold text-slate-900">84.2%</span>
                      <div className="text-[10px] text-emerald-700 mt-2 font-bold bg-emerald-50 py-0.5 rounded border border-emerald-100 w-fit mx-auto px-1.5">+5.4% YoY increase</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-500 block mb-1 font-semibold">Mean Job Readiness Score</span>
                      <span className="text-3xl font-extrabold text-slate-900">78.5%</span>
                      <div className="text-[10px] text-indigo-700 mt-2 font-bold bg-indigo-50 py-0.5 rounded border border-indigo-100 w-fit mx-auto px-1.5">Class Avg (B+ tier)</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-500 block mb-1 font-semibold">Assessed Students</span>
                      <span className="text-3xl font-extrabold text-slate-900">1,120</span>
                      <div className="text-[10px] text-cyan-800 mt-2 font-bold bg-cyan-50 py-0.5 rounded border border-cyan-100 w-fit mx-auto px-1.5 font-semibold">96% of class active</div>
                    </div>

                  </div>

                  {/* Department placement performance */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Placements by Specialization</h4>
                    <div className="space-y-4">
                      
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-700 font-bold">Computer Science & Engineering</span>
                          <span className="text-slate-800 font-bold">96% Placed</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-700 font-bold">Electronics & Communication</span>
                          <span className="text-slate-805 text-slate-800 font-bold">82% Placed</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Corner highlight graphics */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-xl pointer-events-none"></div>

          </div>
        </div>
      </ScrollReveal>

      {/* 9. Roadmap Section */}
      <ScrollReveal id="roadmap" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            Development Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Platform Development Roadmap
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            How we are evolving C2C into a comprehensive global ecosystem for employability verification.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="relative">
          {/* Central alignment line for timeline */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 pointer-events-none"></div>

          <div className="space-y-12">
            
            {/* Phase 1 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 shadow-sm">
                  Phase 1: Completed
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Frontend MVP Setup</h3>
                <p className="text-xs text-slate-505 text-slate-500 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Scaffolded React + Vite + TS framework. Installed Tailwind CSS and created stakeholder folder structures and placeholders.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

            {/* Phase 2 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="hidden md:block w-1/2 pr-12 text-right"></div>
              <div className="w-full md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700 shadow-sm animate-pulse">
                  Phase 2: In Progress
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Backend & Authentication</h3>
                <p className="text-xs text-slate-550 text-slate-500 mt-1 leading-relaxed max-w-md">
                  Setting up API servers, user roles (Students, Recruiters, Colleges, Mentors, Admins), and secure login pipelines.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-sm"></div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                  Phase 3: Q3 2026
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">AI Matching Engine</h3>
                <p className="text-xs text-slate-505 text-slate-500 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Integrating semantic parsing engines, scoring indicators, cosine similarity vectors, and skill path suggestions.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

            {/* Phase 4 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-sm"></div>
              <div className="hidden md:block w-1/2 pr-12 text-right"></div>
              <div className="w-full md:w-1/2 md:pl-12 mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                  Phase 4: Q4 2026
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">College Pilot Launch</h3>
                <p className="text-xs text-slate-550 text-slate-500 mt-1 leading-relaxed max-w-md">
                  Deploying C2C to pilot institutions to sync drive schedules, verify profiles, and iterate recruiter matchmaking.
                </p>
              </div>
            </div>

            {/* Phase 5 */}
            <div className="relative flex flex-col md:flex-row md:items-center">
              <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center shadow-sm"></div>
              <div className="w-full md:w-1/2 md:pr-12 md:text-right mt-6 md:mt-0">
                <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 shadow-sm">
                  Phase 5: 2027
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Scale Across Institutions</h3>
                <p className="text-xs text-slate-550 text-slate-500 mt-1 leading-relaxed md:ml-auto max-w-md">
                  Opening open API schemas for direct ATS integrations and expanding learning content partnerships.
                </p>
              </div>
              <div className="hidden md:block w-1/2 pl-12"></div>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 10. CTA Section */}
      <ScrollReveal id="cta" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-16 text-center shadow-xl">
          
          {/* Subtle decoration gradients */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Let’s Build the Future of Student Employability
            </h2>
            <p className="text-lg text-slate-350 leading-relaxed max-w-2xl mx-auto text-slate-300">
              From learning to earning, C2C creates a measurable path for every student, college, recruiter, and enterprise.
            </p>
            <div className="pt-6">
              <button className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                Start Building
                <Zap className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* ENTERPRISE-GRADE DIRECTORY FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
            
            {/* Column 1: Brand (logo, description, social) */}
            <div className="lg:col-span-5 space-y-5">
              <LogoSVG className="h-9 w-auto" iconColor="text-blue-500" textColor="text-white" />
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Bridging the gap between academic potential and corporate excellence through verifiable skill metrics, AI proctored assessments, and direct hiring pipelines.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-all" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all" aria-label="Website">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Platform */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Whitepapers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom Row */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col md:flex-row items-center gap-4 text-xs">
              <span className="text-slate-500">&copy; {new Date().getFullYear()} Ashoksoft Technologies. All rights reserved.</span>
              <div className="flex space-x-3 md:border-l md:border-slate-800 md:pl-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Language/Region selector */}
            <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-300 font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition-all shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>Global (English)</span>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
};
