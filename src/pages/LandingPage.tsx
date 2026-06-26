import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <rect x="4" y="6" width="28" height="28" rx="8" className={`fill-blue-50/50 stroke-current ${iconColor}`} strokeWidth="2" />
      <path d="M12 24C12 18.4772 16.4772 14 22 14" className={`stroke-current ${iconColor}`} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 16C24 21.5228 19.5228 26 14 26" className={`stroke-current ${iconColor}`} strokeWidth="3" strokeLinecap="round" />
      <text x="42" y="26" className={`fill-current ${textColor}`} fontSize="19" fontWeight="800" letterSpacing="-0.04em">C2C</text>
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

const HERO_PHRASES = ["Empower Students", "Accelerate Hiring", "Scale Placement"];

const TICKER_EVENTS = [
  { text: "Student from DTU cleared Advanced Logic assessment", icon: "🟢" },
  { text: "Amazon Recruiter updated 3 job pipelines", icon: "💼" },
  { text: "Candidate from NIT Trichy unlocked Frontend Architecture badge", icon: "🏆" },
  { text: "Placement cell synced 450 verified student profiles at Delhi Tech", icon: "⚡" },
  { text: "Mentor Sarah Jenkins approved 3 resume reviews", icon: "🎓" }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDashboardTab, setActiveDashboardTab] = useState<'student' | 'recruiter' | 'college'>('student');
  const [hoveredStakeholder, setHoveredStakeholder] = useState<string | null>(null);

  // Hero phrase rotation state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPhraseTransitioning, setIsPhraseTransitioning] = useState(false);

  // Platform event activity ticker state
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerTransitioning, setIsTickerTransitioning] = useState(false);

  useEffect(() => {
    let phraseTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let tickerTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const phraseInterval = setInterval(() => {
      setIsPhraseTransitioning(true);
      phraseTimeoutId = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        setIsPhraseTransitioning(false);
      }, 300);
    }, 3000);

    const tickerInterval = setInterval(() => {
      setIsTickerTransitioning(true);
      tickerTimeoutId = setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % TICKER_EVENTS.length);
        setIsTickerTransitioning(false);
      }, 400);
    }, 4000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(tickerInterval);
      if (phraseTimeoutId) clearTimeout(phraseTimeoutId);
      if (tickerTimeoutId) clearTimeout(tickerTimeoutId);
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
    <div className="min-h-screen bg-slate-50/30 text-slate-808 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-800 overflow-x-hidden relative">
      
      {/* Background decoration elements (Delicate Dot Matrix Canvas & Glowing Lights) */}
      <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none overflow-hidden z-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70">
        <div className="absolute top-[-15%] left-[10%] w-[700px] h-[700px] rounded-full bg-blue-100/30 blur-[130px]"></div>
        <div className="absolute top-[20%] right-[5%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-[120px]"></div>
      </div>

      {/* Header / Navbar */}
      <header className="relative z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-md sticky top-0 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <LogoSVG iconColor="text-blue-600" textColor="text-slate-900" />
            <div className="hidden md:block border-l border-slate-200 pl-4">
              <span className="text-[10px] block text-slate-400 uppercase tracking-widest font-bold leading-none">Ashoksoft</span>
              <span className="text-[10px] block text-slate-400 uppercase tracking-widest font-bold leading-none mt-1">Technologies</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#problem" className="hover:text-blue-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300">
              Problem
            </a>

            <a href="#solution" className="hover:text-blue-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300">
              Solution
            </a>

            {/* Core Features Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 cursor-pointer">
                Core Features
                <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400 group-hover:text-blue-600 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-md border border-slate-200/70 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                <a href="#" className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Resume Analyzer</a>
                <a href="#" className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">AI Mock Interviews</a>
                <a href="#" className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Skill Assessments</a>
                <a href="#" className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Placement Monitoring</a>
                <a href="#" className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Learning Roadmaps</a>
              </div>
            </div>

            <a href="#ecosystem" className="hover:text-blue-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300">
              Ecosystem
            </a>

            <a href="#ai" className="hover:text-blue-600 transition-colors py-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300">
              AI Engine
            </a>

            {/* Dashboards Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 cursor-pointer">
                Dashboards
                <ChevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400 group-hover:text-blue-600 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/student-dashboard" className="block px-4 py-2 hover:bg-slate-808 hover:bg-slate-800">
                  Student Dashboard
                </Link>
                <Link to="/college-dashboard" className="block px-4 py-2 hover:bg-slate-808 hover:bg-slate-800">
                  College Dashboard
                </Link>
                <Link to="/recruiter-dashboard" className="block px-4 py-2 hover:bg-slate-808 hover:bg-slate-800">
                  Recruiter Dashboard
                </Link>
                <Link to="/mentor-dashboard" className="block px-4 py-2 hover:bg-slate-808 hover:bg-slate-800">
                  Mentor Dashboard
                </Link>
                <Link to="/admin-dashboard" className="block px-4 py-2 hover:bg-slate-808 hover:bg-slate-800">
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-5">
            <button className="hidden sm:inline-flex text-sm text-slate-600 hover:text-slate-900 transition-colors font-semibold cursor-pointer">
              Sign In
            </button>
            <a 
              href="#cta"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
            >
              Demo Access
            </a>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative z-10 pt-20 pb-28 md:pt-28 md:pb-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col space-y-8 text-center sm:text-left items-center sm:items-start">
            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-blue-50/60 border border-blue-100/80 text-xs font-bold text-blue-700 shadow-sm animate-fade-in backdrop-blur-sm">
              <LogoSVG className="h-4.5 w-auto" iconColor="text-blue-600" textColor="text-blue-700" />
              <span className="border-l border-blue-200/80 pl-2">Next-Gen Employability Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 leading-[1.1] max-w-3xl">
              The Next-Gen System to <br className="hidden sm:inline" />
              <span className="relative inline-block text-blue-600 overflow-hidden align-bottom pb-2">
                <span className={`inline-block transition-all duration-500 ease-in-out transform ${
                  isPhraseTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}>
                  {HERO_PHRASES[phraseIndex]}
                </span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              An AI-powered employability ecosystem connecting students, colleges, mentors, recruiters, and companies through learning, assessment, mentorship, hiring, and placement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <a 
                href="#cta"
                className="group inline-flex items-center justify-center px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-base font-semibold text-white shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a 
                href="#solution"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                Explore Platform
              </a>
            </div>

            {/* Quick Metrics banner */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-200/80 w-full max-w-2xl">
              <div>
                <span className="block text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">98%</span>
                <span className="block text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-bold mt-1.5">ATS Match Rate</span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">10x</span>
                <span className="block text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-bold mt-1.5">Faster Sourcing</span>
              </div>
              <div>
                <span className="block text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">100%</span>
                <span className="block text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-bold mt-1.5">Verified Profiles</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Floating Live Activity Ticker Container */}
      <div className="relative z-20 -mt-12 mb-16 max-w-4xl mx-auto px-4 flex justify-center">
        <div className="inline-flex items-center space-x-3 bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-full px-5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 group hover:-translate-y-0.5">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="relative w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 pr-3 mr-1 shrink-0">Ecosystem Pulse</span>
          <div className="h-6 overflow-hidden flex items-center">
            <div className={`transition-all duration-500 ease-out transform flex items-center gap-2 ${
              isTickerTransitioning ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              <span className="text-base shrink-0">{TICKER_EVENTS[tickerIndex].icon}</span>
              <span className="text-xs font-semibold text-slate-705 text-slate-700">{TICKER_EVENTS[tickerIndex].text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Trusted Value Section */}
      <ScrollReveal className="relative z-10 py-24 bg-slate-50/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Multi-Stakeholder Architecture</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">Connecting the Entire Employability Ecosystem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Student Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Students</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Learn, Grow & Get Placed. Utilize AI maps to level up skills, build verified profiles, and lock down top roles.
              </p>
            </div>

            {/* College Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <Building className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Colleges</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Track Performance & Improve Outcomes. Aggregate student readiness scores and streamline placement drives.
              </p>
            </div>

            {/* Recruiter Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-5 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <Briefcase className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Recruiters</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Discover Verified Talent. Shortlist pre-assessed candidates with transparent background verification scores.
              </p>
            </div>

            {/* Mentor Card */}
            <Link to="/mentor-dashboard" className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-pink-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm block text-left">
              <div className="w-11 h-11 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <Users className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Mentors</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Guide Future Professionals. Review mock coding interviews, guide portfolios, and earn industry credits.
              </p>
            </Link>

            {/* Company Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <Target className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Companies</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Build Future Workforce. Anchor long-term campus programs, brand internships, and target matching cohorts.
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 3. Problem Section */}
      <ScrollReveal id="problem" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-bold text-red-700 shadow-sm">
            The Industry Bottleneck
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 tracking-tight leading-tight">
            The Gap Between Campus and Corporate Is Real
          </h2>
          <p className="text-slate-500 mt-4 text-base font-medium leading-relaxed">
            Students struggle with direction, while hiring managers are buried under unverified noise. Current processes are fragmented.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Problem 1 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-350 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-50/50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-305"></div>
            <div className="text-red-700 text-xs font-mono font-black tracking-widest mb-4">01 / DISORIENTATION</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">Students lack career direction</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Curriculums lack modular alignment to dynamic market profiles, leading graduates to apply blindly to random roles.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-350 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-50/50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-305"></div>
            <div className="text-red-700 text-xs font-mono font-black tracking-widest mb-4">02 / DARK PIPELINE</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">Colleges lack placement visibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Administrators lack unified dashboards to monitor readiness analytics or audit manual student progression metrics.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-350 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-50/50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-305"></div>
            <div className="text-red-700 text-xs font-mono font-black tracking-widest mb-4">03 / NOISE OVERHEAD</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">Recruiters waste time screening</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Recruiters spend up to 70% of sourcing time weeding out candidate resumes with unverified credentials and fake skills.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-350 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-36 h-36 bg-red-50/50 rounded-full blur-xl pointer-events-none group-hover:bg-red-100/50 transition-all duration-305"></div>
            <div className="text-red-700 text-xs font-mono font-black tracking-widest mb-4">04 / DEFICIT GAP</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2.5 tracking-tight">Companies face skill mismatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              New hires take months to onboard, incurring substantial post-hire training and cohort transition costs.
            </p>
          </div>

        </div>
      </ScrollReveal>

      {/* 4. Solution Section */}
      <ScrollReveal id="solution" className="relative z-10 py-24 bg-slate-50/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 shadow-sm">
              Integrated Solution
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 tracking-tight leading-tight">
              One Platform. Complete Career Journey.
            </h2>
            <p className="text-slate-500 mt-4 text-base font-medium leading-relaxed">
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
                <div key={idx} className="relative flex flex-col items-center text-center bg-white border border-slate-200/80 hover:border-slate-350 hover:shadow-xl rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 text-[9px] bg-blue-50 border border-blue-100 text-blue-700 font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-305">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-808 text-slate-800 mt-4 tracking-tight">{item.title}</h3>
                  <p className="text-[10px] text-slate-505 text-slate-500 mt-2.5 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Core Features Section (Asymmetric Bento Grid Layout) */}
      <ScrollReveal id="features" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-95">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-bold text-cyan-700 shadow-sm">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 tracking-tight">
            Engineered for Placement Excellence
          </h2>
          <p className="text-slate-500 mt-4 text-base font-medium leading-relaxed">
            Structured into a high-performance grid, C2C offers robust tools configured to scale from college cohorts to global talent acquisition teams.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1 - ATS Analysis (Span 2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-blue-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 lg:p-8 group flex flex-col justify-between min-h-[260px] lg:col-span-2 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-blue-505 text-blue-500/10 pointer-events-none transform group-hover:scale-105 group-hover:rotate-6 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="25" y1="35" x2="75" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="25" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <line x1="25" y1="65" x2="75" y2="65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">AI Resume ATS Analysis</h3>
              <p className="text-xs text-slate-550 text-slate-500 leading-relaxed font-medium max-w-2xl">
                Leverage real-time semantic parsing to audit resume formatting, keyword frequencies, and target matches against active company profiles. Neutralize layout biases automatically and ensure maximum structural compatibility with ATS engines.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1 relative z-10 uppercase tracking-wide">Advanced Parser • Standardized Audit Trail</span>
          </div>

          {/* Card 2 - Skill Assessment (Span 1, Tall Card / row-span-2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-indigo-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 group flex flex-col justify-between lg:row-span-2 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-indigo-505 text-indigo-500/10 pointer-events-none transform group-hover:scale-105 group-hover:-rotate-6 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
                <path d="M50 15 L50 85 M15 50 L85 50" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2.5 tracking-tight">Skill Assessment</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Standardized assessments covering technical stacks and behavioral frameworks with automated browser lock and proctor auditing. Built to detect cognitive anomalies and verify technical competence with high-fidelity validation.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 mt-4 block relative z-10 uppercase tracking-wide">Proctor Shield Enabled</span>
          </div>

          {/* Card 3 - Learning Roadmap (Span 1) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-cyan-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 group flex flex-col justify-between col-span-1 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-cyan-505 text-cyan-500/10 pointer-events-none transform group-hover:scale-105 group-hover:rotate-12 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 Q 40 20, 60 50 T 80 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="80" cy="20" r="6" fill="currentColor" />
                <circle cx="20" cy="80" r="6" fill="currentColor" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-5 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2.5 tracking-tight">Learning Roadmap</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Dynamically generates personalized video playlists and repository exercises to bridge precise core competency deficits.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-cyan-705 text-cyan-700 mt-4 block relative z-10 uppercase tracking-wide">Adaptive Curriculum</span>
          </div>

          {/* Card 6 - College Analytics (Span 1) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-emerald-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 group flex flex-col justify-between col-span-1 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-emerald-505 text-emerald-500/10 pointer-events-none transform group-hover:scale-105 group-hover:translate-x-1 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="45" width="15" height="40" rx="2" fill="currentColor" />
                <rect x="42" y="25" width="15" height="60" rx="2" fill="currentColor" />
                <rect x="70" y="10" width="15" height="75" rx="2" fill="currentColor" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-905 text-slate-900 mb-2.5 tracking-tight">College Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Track student enrollment readiness, aggregate assessment parameters, and audit recruitment company logs from a unified dashboard.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 mt-4 block relative z-10 uppercase tracking-wide">Systemic Audit Logs</span>
          </div>

          {/* Card 7 - Mentorship Tracking (Span 1, Tall Card / row-span-2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-amber-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 group flex flex-col justify-between lg:row-span-2 col-span-1 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-amber-505 text-amber-500/10 pointer-events-none transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="40" r="15" stroke="currentColor" strokeWidth="2" />
                <circle cx="65" cy="40" r="15" stroke="currentColor" strokeWidth="2" />
                <path d="M15 80 C 15 65, 55 65, 55 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M45 80 C 45 68, 85 68, 85 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2.5 tracking-tight">Mentorship Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Coordinate booking calendars, mock coding feedback sessions, and profile rating indicators within an integrated audit trail. Connect with elite mentors who offer specialized, corporate-grade code reviews and architectural training.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 mt-4 block relative z-10 uppercase tracking-wide">Feedback Logs</span>
          </div>

          {/* Card 4 - Candidate Matching (Span 2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-blue-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 lg:p-8 group flex flex-col justify-between min-h-[220px] lg:col-span-2 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-blue-550 text-blue-500/10 pointer-events-none transform group-hover:scale-105 group-hover:rotate-45 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,15 85,75 15,75" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">Candidate Vector Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-2xl">
                Vector matching filters out unqualified applications by scoring real-time technical logic indicators, bypassing keyword stuffing. Map candidate embeddings directly against structural requirements of modern enterprise roles.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1 relative z-10 uppercase tracking-wide">Cognitive Vectors • 99.4% Matching Accuracy</span>
          </div>

          {/* Card 5 - Recruiter Hub (Span 2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-pink-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 lg:p-8 group flex flex-col justify-between min-h-[220px] lg:col-span-2 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-pink-500/10 pointer-events-none transform group-hover:scale-105 group-hover:scale-110 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="38" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="62" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">Recruiter Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-2xl">
                Direct pipeline filtering, interview scheduling coordinates, background check status updates, and cohort communication suites. Simplify sourcing times by up to 10x with pre-screened talent listings.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-pink-600 mt-4 flex items-center gap-1 relative z-10 uppercase tracking-wide">Structured Sourcing Pipeline</span>
          </div>

          {/* Card 8 - Placement Monitoring (Span 1) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-teal-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 group flex flex-col justify-between col-span-1 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-teal-500/10 pointer-events-none transform group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M50 35 L50 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="50" cy="65" r="4" fill="currentColor" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-5 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2.5 tracking-tight">Placement Monitoring</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Audit offers, track letter of intent updates, verify onboarding checks, and generate annual placement validation reports.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-teal-700 mt-4 block relative z-10 uppercase tracking-wide">Compliance Assured</span>
          </div>

          {/* Card 9 - AI Mock Interviews (Span 2) */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200 hover:border-blue-500/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 lg:p-8 group flex flex-col justify-between min-h-[220px] lg:col-span-2 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-4 right-4 w-24 h-24 text-blue-500/10 pointer-events-none transform group-hover:scale-105 group-hover:translate-y-[-2px] transition-all duration-500 ease-out">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 50 C 25 30, 75 30, 75 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <rect x="40" y="55" width="20" height="25" rx="4" fill="currentColor" />
                <line x1="50" y1="80" x2="50" y2="90" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight">AI Mock Interviews</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-2xl">
                Practice real interview questions, get instant feedback, improve communication skills, and boost confidence before actual interviews. Utilize deep speech analytics to correct pacing and vocabularies.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 mt-4 flex items-center gap-1 relative z-10 uppercase tracking-wide">Speech Analysis Engine</span>
          </div>

          {/* Card 10 - Book A Demo (Span 3 / Full Width Bento Bottom Banner) */}
          <div className="bg-slate-900 border border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 lg:p-8 group col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Decorative SVG Graphic Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none transform group-hover:scale-110 transition-transform duration-505"></div>
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-900 text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-wide">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span>Executive Presentation</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">Book A Demo Session</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Schedule a customized enterprise demo with our solutions engineer to see how our platform can aggregate student verification details, automate placements, and optimize hiring timelines for your cohort.
              </p>
            </div>
            <a 
              href="#cta" 
              className="group inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all duration-300 shadow-lg shadow-blue-600/10 shrink-0 w-full md:w-auto hover:scale-[1.03] active:scale-[0.98] relative z-10"
            >
              Schedule Review
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

        </div>
      </ScrollReveal>

      {/* 6. Stakeholder Ecosystem Section */}
      <ScrollReveal id="ecosystem" className="relative z-10 py-24 bg-slate-50/50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left text column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 w-fit shadow-sm">
                Network Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                A Unified Cognitive Network
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed">
                Campus recruitment is not a linear chain, it is a web. C2C serves as the central orchestration engine that connects students, colleges, mentors, recruiters, and companies seamlessly.
              </p>
              
              <div className="space-y-4">
                {stakeholders.map((sh) => (
                  <div 
                    key={sh.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      hoveredStakeholder === sh.id 
                        ? 'bg-white border-blue-400 shadow-xl translate-x-1' 
                        : 'bg-white/60 border-slate-200/80 hover:border-slate-350 hover:bg-white'
                    }`}
                    onMouseEnter={() => setHoveredStakeholder(sh.id)}
                    onMouseLeave={() => setHoveredStakeholder(null)}
                    onClick={() => {
                      if (sh.id === 'mentor') {
                        navigate('/mentor-dashboard');
                      } else if (sh.id === 'student') {
                        navigate('/student-dashboard');
                      } else if (sh.id === 'college') {
                        navigate('/college-dashboard');
                      } else if (sh.id === 'recruiter') {
                        navigate('/recruiter-dashboard');
                      } else if (sh.id === 'admin') {
                        navigate('/admin-dashboard');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{sh.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-colors ${hoveredStakeholder === sh.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    {hoveredStakeholder === sh.id && (
                      <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium transition-opacity duration-300">
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
              <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main Visual Node Map container */}
              <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl">
                
                {/* Center Core Engine Node */}
                <div className="absolute w-28 h-28 rounded-full bg-blue-600 flex flex-col items-center justify-center shadow-2xl shadow-blue-500/20 z-20 border-4 border-white">
                  <span className="text-white font-extrabold text-2xl tracking-tighter leading-none">C2C</span>
                  <span className="text-[8px] text-blue-100 uppercase tracking-widest font-black mt-1.5">Core Engine</span>
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
                      className={`absolute flex flex-col items-center ${node.pos} transition-all duration-350 z-10 ${
                        isActive ? 'scale-110' : 'opacity-75 scale-100'
                      }`}
                      onMouseEnter={() => setHoveredStakeholder(node.id)}
                      onMouseLeave={() => setHoveredStakeholder(null)}
                      onClick={() => {
                        if (node.id === 'mentor') {
                          navigate('/mentor-dashboard');
                        } else if (node.id === 'student') {
                          navigate('/student-dashboard');
                        } else if (node.id === 'college') {
                          navigate('/college-dashboard');
                        } else if (node.id === 'recruiter') {
                          navigate('/recruiter-dashboard');
                        } else if (node.id === 'admin') {
                          navigate('/admin-dashboard');
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-slate-50 border ${isActive ? 'border-blue-600 shadow-xl bg-white' : 'border-slate-200'} flex items-center justify-center text-slate-700 transition-all duration-305 shadow-sm`}>
                        <node.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-[10px] font-bold mt-2 px-2.5 py-1 rounded-lg border shadow-sm transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200/80 text-slate-700'}`}>
                        {node.name}
                      </span>
                    </div>
                  );
                })}

                {/* Animated grid background effect inside node panel */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] rounded-3xl opacity-40 pointer-events-none z-0"></div>

              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 7. AI Intelligence Section */}
      <ScrollReveal id="ai" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: AI Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-blue-50/50 rounded-3xl blur-3xl pointer-events-none"></div>
            
            {/* The main AI intelligence mockup */}
            <div className="relative bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xl">
              
              <div className="flex items-center space-x-2 pb-5 border-b border-slate-100">
                <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Vector Engine Analytics</span>
              </div>

              {/* Skill gap radar visualization mockup */}
              <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner">
                <div className="flex items-center justify-between text-xs mb-3 font-semibold">
                  <span className="text-slate-500">Cognitive Fitment Vector</span>
                  <span className="text-blue-705 text-blue-700 font-mono font-black">Matched: 94.2%</span>
                </div>
                
                {/* Clean reports / calculations logs */}
                <div className="font-mono text-[10px] text-slate-650 text-slate-600 space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 max-h-[170px] overflow-hidden shadow-sm leading-relaxed">
                  <div>&gt; Loading candidate node YS-2026...</div>
                  <div>&gt; Extracting semantic experience embeddings...</div>
                  <div className="text-blue-600 font-semibold">&gt; Match weight: React [1.0], TS [0.95], System Design [0.82]</div>
                  <div>&gt; Executing cosine similarity on Job-Stripe-SE-L4...</div>
                  <div className="text-emerald-700 font-semibold">&gt; Similarity score: 0.9423 (Excellent Match)</div>
                  <div>&gt; Detected Skill Gap: Kubernetes deployment configurations</div>
                  <div className="text-amber-705 text-amber-700 font-semibold">&gt; Queued Content: 'K8s for Frontend Developers' (2 hours)</div>
                </div>
              </div>

              {/* Output analysis boxes */}
              <div className="grid grid-cols-2 gap-4 mt-5">
                
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Rank Status</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Top 2%</span>
                    <span className="text-[9px] text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100/80 font-bold uppercase tracking-wider">High Priority</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Employability Score</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">A+ Tier</span>
                    <span className="text-[9px] text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-100/80 font-bold uppercase tracking-wider">Verified</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: AI Explanations */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-bold text-cyan-700 w-fit shadow-sm">
              AI Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI That Understands Skills, Jobs and Career Readiness
            </h2>
            <p className="text-slate-500 text-base font-medium leading-relaxed">
              C2C is powered by a proprietary matching model that evaluates students beyond keywords. We track technical logical thinking, real-time code audit assessments, and soft skills to map readiness.
            </p>

            <div className="space-y-5 pt-2">
              
              <div className="flex items-start space-x-3.5">
                <div className="w-5.5 h-5.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Resume analysis</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Extracts structured skill trees from resumes, neutralizing bias and verifying academic grades automatically.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-5.5 h-5.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Skill gap detection</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Tracks student assessment errors and triggers curated, 10-minute micro-learning modules to plug precise knowledge leaks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-5.5 h-5.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Job recommendations</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Evaluates job specifications using semantic mappings to align roles that match the student’s functional capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-5.5 h-5.5 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 mt-1 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-tight">Candidate ranking</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Ranks portfolios dynamically based on pre-assessed verification logs, helping recruiters hire in hours instead of weeks.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 8. Dashboard Preview Section */}
      <ScrollReveal id="previews" className="relative z-10 py-24 bg-slate-50/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 shadow-sm">
              Interactive Previews
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 tracking-tight">
              Explore Our Stakeholder Dashboards
            </h2>
            <p className="text-slate-550 text-slate-500 mt-4 text-base font-medium leading-relaxed">
              Unified, data-backed interfaces built for fast navigation, deep analysis, and micro-metric monitoring.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-2 mb-12 bg-slate-200/40 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200 shadow-sm backdrop-blur-sm">
            {[
              { id: 'student', label: 'Student Portal' },
              { id: 'recruiter', label: 'Recruiter Hub' },
              { id: 'college', label: 'College Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardTab(tab.id as 'student' | 'recruiter' | 'college')}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeDashboardTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md border border-slate-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboards Mockup Grid container */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {/* Student Dashboard Tab */}
            {activeDashboardTab === 'student' && (
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                
                {/* Enterprise Dashboard Sidebar Mockup */}
                <div className="w-full lg:w-60 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 px-2">
                      <div className="w-6.5 h-6.5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-sm shadow-blue-500/20">S</div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Student Portal</span>
                    </div>
                    <nav className="space-y-1.5 text-xs font-semibold">
                      <div className="px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 cursor-pointer flex items-center gap-2.5 transition-colors">
                        <GraduationCap className="w-4 h-4 text-blue-600" /> Overview
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <BookOpen className="w-4 h-4 text-slate-400" /> Skill Roadmaps
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Calendar className="w-4 h-4 text-slate-400" /> Interviews
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Mic className="w-4 h-4 text-slate-400" /> Mock Trials
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <UserCheck className="w-4 h-4 text-slate-400" /> Portfolio
                      </div>
                    </nav>
                  </div>
                  <div className="pt-5 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    User: Yuvraj Singh
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-10 space-y-8">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Welcome back, Yuvraj</h3>
                      <p className="text-xs text-slate-505 text-slate-500 mt-1 font-medium">Here is your roadmap performance checklist for today.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200/80 w-fit shadow-inner">
                      <span className="text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-black pl-2">Job Matches</span>
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">12 New</span>
                    </div>
                  </div>

                  {/* Dashboard core grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Stats & progress */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Roadmaps */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Core Skill Roadmaps</h4>
                        <div className="space-y-4 font-semibold">
                          
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-slate-700">React & Frontend Architecture</span>
                              <span className="text-slate-500 font-bold">82% Completed</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-slate-700">Data Structures & Analysis (TS)</span>
                              <span className="text-slate-500 font-bold">65% Completed</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Open interviews table */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Upcoming Interview Stages</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-405 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="font-semibold text-slate-700">
                              <tr className="border-b border-slate-200/50">
                                <td className="py-3.5 font-bold text-slate-900">Stripe</td>
                                <td className="py-3.5">Software Engineer (L4)</td>
                                <td className="py-3.5 text-slate-400">June 24, 2026</td>
                                <td className="py-3.5">
                                  <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100/80 font-bold text-[9px] uppercase tracking-wider">Technical Round 1</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3.5 font-bold text-slate-900">Notion</td>
                                <td className="py-3.5">Frontend Developer</td>
                                <td className="py-3.5 text-slate-400">June 29, 2026</td>
                                <td className="py-3.5">
                                  <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100/80 font-bold text-[9px] uppercase tracking-wider">Review Portfolio</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: AI Feed */}
                    <div className="space-y-6">
                      
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">AI Skill Insights</h4>
                        <div className="space-y-4 font-semibold">
                          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/80 text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold text-blue-700 block mb-1 uppercase tracking-wider text-[9px]">Upgrade Alert</span>
                            We detected a minor gap in your GraphQL schema design performance. Check out the 5-min roadmap to boost match index by +3.1%.
                          </div>
                          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100/80 text-xs text-slate-705 text-slate-700 leading-relaxed font-medium">
                            <span className="font-bold text-emerald-700 block mb-1 uppercase tracking-wider text-[9px]">ATS Optimization</span>
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
                <div className="w-full lg:w-60 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 px-2">
                      <div className="w-6.5 h-6.5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-sm shadow-blue-500/20">R</div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Recruiter Hub</span>
                    </div>
                    <nav className="space-y-1.5 text-xs font-semibold">
                      <div className="px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 cursor-pointer flex items-center gap-2.5 transition-colors">
                        <Briefcase className="w-4 h-4 text-blue-600" /> Candidates
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Building className="w-4 h-4 text-slate-400" /> Campus Drives
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Calendar className="w-4 h-4 text-slate-400" /> Scheduler
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Users className="w-4 h-4 text-slate-400" /> Team Members
                      </div>
                    </nav>
                  </div>
                  <div className="pt-5 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    Stripe Sourcing Unit
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-10 space-y-8">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Corporate Recruiting Portal</h3>
                      <p className="text-xs text-slate-555 text-slate-500 mt-1 font-medium">Audit matching profiles across partnered college campuses in real time.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200/80 w-fit shadow-inner">
                      <span className="text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-black pl-2">Total Candidates</span>
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">2,410 Verified</span>
                    </div>
                  </div>

                  {/* Candidate list table */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Top AI Job Matches - Software Engineer</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-405 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                            <th className="pb-3">Candidate</th>
                            <th className="pb-3">College</th>
                            <th className="pb-3">ATS Match %</th>
                            <th className="pb-3">Assessment Log</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="font-semibold text-slate-700">
                          <tr className="border-b border-slate-200/50">
                            <td className="py-3.5">
                              <div className="font-bold text-slate-900">Yuvraj Singh</div>
                              <div className="text-[10px] text-slate-400">yuvraj@c2c.edu</div>
                            </td>
                            <td className="py-3.5 text-slate-700 font-bold">IIT Delhi</td>
                            <td className="py-3.5 font-black text-emerald-700">97% Match</td>
                            <td className="py-3.5 text-slate-500 font-medium">94th percentile (A+)</td>
                            <td className="py-3.5 text-right">
                              <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer">
                                Request Interview
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-200/50">
                            <td className="py-3.5">
                              <div className="font-bold text-slate-900">Ananya Sharma</div>
                              <div className="text-[10px] text-slate-400">ananya@c2c.edu</div>
                            </td>
                            <td className="py-3.5 text-slate-700 font-bold">BITS Pilani</td>
                            <td className="py-3.5 font-black text-emerald-700">92% Match</td>
                            <td className="py-3.5 text-slate-500 font-medium">89th percentile (A)</td>
                            <td className="py-3.5 text-right">
                              <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer">
                                Request Interview
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3.5">
                              <div className="font-bold text-slate-900">Rahul Verma</div>
                              <div className="text-[10px] text-slate-400">rahul@c2c.edu</div>
                            </td>
                            <td className="py-3.5 text-slate-700 font-bold">NIT Trichy</td>
                            <td className="py-3.5 font-black text-blue-700">89% Match</td>
                            <td className="py-3.5 text-slate-500 font-medium">88th percentile (A)</td>
                            <td className="py-3.5 text-right">
                              <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all shadow-sm shadow-blue-500/10 cursor-pointer">
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
                <div className="w-full lg:w-60 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-3 px-2">
                      <div className="w-6.5 h-6.5 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white font-black shadow-sm shadow-blue-500/20">C</div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">College Admin</span>
                    </div>
                    <nav className="space-y-1.5 text-xs font-semibold">
                      <div className="px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 cursor-pointer flex items-center gap-2.5 transition-colors">
                        <Database className="w-4 h-4 text-blue-600" /> Analytics Overview
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <GraduationCap className="w-4 h-4 text-slate-400" /> Student Roster
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <Briefcase className="w-4 h-4 text-slate-400" /> Placement Drives
                      </div>
                      <div className="px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer flex items-center gap-2.5 transition-all">
                        <FileText className="w-4 h-4 text-slate-400" /> Reports
                      </div>
                    </nav>
                  </div>
                  <div className="pt-5 border-t border-slate-200 text-[10px] text-slate-400 px-2 font-mono">
                    IIT Delhi Admin Portal
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 lg:p-10 space-y-8">
                  
                  {/* Header widget */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">College Placement Dashboard</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Campus-wide candidate analytics, readiness progress, and company drive updates.</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200/80 w-fit shadow-inner">
                      <span className="text-[10px] text-slate-405 text-slate-400 uppercase tracking-widest font-black pl-2">Active Drive</span>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm">Stripe, Notion, Linear</span>
                    </div>
                  </div>

                  {/* Key Metrics Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    <div className="bg-slate-50 border border-slate-205 border-slate-200/80 rounded-2xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-405 text-slate-400 block mb-2 font-bold uppercase tracking-wider">Campus Placement Rate</span>
                      <span className="text-3xl font-black text-slate-900">84.2%</span>
                      <div className="text-[10px] text-emerald-700 mt-3 font-bold bg-emerald-50 border border-emerald-100/80 py-1.5 rounded-lg w-fit mx-auto px-2.5">+5.4% YoY increase</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-205 border-slate-200/80 rounded-2xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-405 text-slate-400 block mb-2 font-bold uppercase tracking-wider">Mean Job Readiness Score</span>
                      <span className="text-3xl font-black text-slate-900">78.5%</span>
                      <div className="text-[10px] text-indigo-700 mt-3 font-bold bg-indigo-50 border border-indigo-100/80 py-1.5 rounded-lg w-fit mx-auto px-2.5">Class Avg (B+ tier)</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-205 border-slate-200/80 rounded-2xl p-5 text-center shadow-sm">
                      <span className="text-xs text-slate-405 text-slate-400 block mb-2 font-bold uppercase tracking-wider">Assessed Students</span>
                      <span className="text-3xl font-black text-slate-900">1,120</span>
                      <div className="text-[10px] text-cyan-800 mt-3 font-bold bg-cyan-50 border border-cyan-100/80 py-1.5 rounded-lg w-fit mx-auto px-2.5 font-black uppercase tracking-wider">96% of class active</div>
                    </div>

                  </div>

                  {/* Department placement performance */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">Placements by Specialization</h4>
                    <div className="space-y-4 font-semibold text-slate-705">
                      
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-700">Computer Science & Engineering</span>
                          <span className="text-slate-900 font-bold">96% Placed</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-700">Electronics & Communication</span>
                          <span className="text-slate-900 font-bold">82% Placed</span>
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
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-xl pointer-events-none"></div>

          </div>
        </div>
      </ScrollReveal>

      {/* 10. CTA Section */}
      <ScrollReveal id="cta" className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-16 text-center shadow-2xl">
          
          {/* Subtle decoration gradients */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {"Let's Build the Future of Student Employability"}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              From learning to earning, C2C creates a measurable path for every student, college, recruiter, and enterprise.
            </p>
            <div className="pt-6">
              <button className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                Start Building
                <Zap className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* ENTERPRISE-GRADE DIRECTORY FOOTER */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900 text-slate-400 py-20">
        <div className="w-full px-8 md:px-12 lg:px-16 xl:px-20">

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-14">

            {/* Brand Section */}
            <div className="lg:col-span-5 xl:col-span-6 space-y-8">
              <LogoSVG
                className="h-12 w-auto"
                iconColor="text-blue-500"
                textColor="text-white"
              />

              <p className="text-base text-slate-400 leading-8 max-w-lg font-medium">
                Bridging the gap between academic potential and corporate
                excellence through verifiable skill metrics, AI proctored
                assessments, and direct hiring pipelines.
              </p>

              <div className="flex items-center space-x-5 pt-2">
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>

                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300"
                  aria-label="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Platform
              </h4>

              <ul className="space-y-5 text-base font-medium text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Resources
              </h4>

              <ul className="space-y-5 text-base font-medium text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Whitepapers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Company
              </h4>

              <ul className="space-y-5 text-base font-medium text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-800 pt-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

              <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium text-slate-500">
                <span>
                  © {new Date().getFullYear()} Ashoksoft Technologies.
                  All rights reserved.
                </span>

                <div className="flex items-center gap-4 md:border-l md:border-slate-700 md:pl-4">
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>

                  <span>•</span>

                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-sm text-slate-300 font-semibold hover:bg-slate-700 hover:text-white transition-all cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>Global (English)</span>
              </div>

            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};