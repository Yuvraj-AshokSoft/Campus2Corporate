import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays
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

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const data = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 78 },
  { month: "Apr", score: 85 },
  { month: "May", score: 90 },
];

const modules = [
  { 
    title: 'React Development', 
    category: 'Frontend Development', 
    progress: 70, 
    color: 'bg-indigo-600',
    track: 'indigo'
  },
  { 
    title: 'Python Programming', 
    category: 'Programming Fundamentals', 
    progress: 45, 
    color: 'bg-emerald-600',
    track: 'emerald'
  },
  { 
    title: 'Data Structures & Algorithms', 
    category: 'Technical Interview Prep', 
    progress: 60, 
    color: 'bg-violet-600',
    track: 'violet'
  },
  { 
    title: 'Aptitude Training', 
    category: 'Placement Prep', 
    progress: 85, 
    color: 'bg-amber-500',
    track: 'amber'
  }
];

const studentContext = `
Student: Yuvraj Singh
Degree: B.Tech Computer Science & Engineering, 4th Year
University: Campus2Corporate University
Registered Modules: React Development (70%), Python Programming (45%), Data Structures & Algorithms (60%), Aptitude Training (85%)
Completed: 2 courses | Pending: 3 courses | Certificates: 1
Performance Score Trend: Jan 65 → May 90 (improving)
Upcoming: React Assignment Due Jun 25, Aptitude Assessment Jun 28, Mentor Session Jun 30, Mock Interview Jul 5
`;

// ─── FEATURE 1: AI Smart Study Planner ───────────────────────────────────────
const AIStudyPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<null | { day: string; tasks: string[] }[]>(null);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are an AI study planner. Based on this student's data, generate a 5-day study plan (Mon–Fri) for this week. Respond ONLY with valid JSON — no preamble, no markdown, no backticks. Format:
[{"day":"Monday","tasks":["task 1","task 2","task 3"]},...]

Student context:
${studentContext}

Rules:
- Focus on weaker areas (Python 45%, DSA 60%)
- Include aptitude prep (assessment Jun 28)
- Keep tasks short (max 10 words each)
- 3 tasks per day`
          }]
        })
      });
      const json = await res.json();
      const text = json.content?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '').join('') ?? '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      setPlan(JSON.parse(cleaned));
      setGenerated(true);
    } catch {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dayColors = ['bg-indigo-50 border-indigo-100', 'bg-violet-50 border-violet-100', 'bg-emerald-50 border-emerald-100', 'bg-amber-50 border-amber-100', 'bg-rose-50 border-rose-100'];
  const dayDotColors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-violet-500" />
            AI Smart Study Planner
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Personalized weekly schedule based on your progress</p>
        </div>
        <span className="text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full">AI</span>
      </div>

      {!generated && !loading && (
        <div className="text-center py-4">
          <div className="w-10 h-10 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Get a personalized 5-day study plan tailored to your weak areas and upcoming deadlines.
          </p>
          <button
            onClick={generatePlan}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-full"
          >
            Generate My Study Plan
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-6 gap-2">
          <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
          <p className="text-xs text-slate-400">Building your plan…</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {plan && (
        <div className="space-y-3">
          {plan.map((day, i) => (
            <div key={i} className={`rounded-xl border p-3 ${dayColors[i]}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${dayDotColors[i]}`} />
                <span className="text-xs font-semibold text-slate-700">{day.day}</span>
              </div>
              <ul className="space-y-1">
                {day.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={generatePlan}
            className="w-full text-xs text-violet-600 hover:text-violet-700 font-medium py-1.5 border border-violet-100 rounded-lg hover:bg-violet-50 transition-colors mt-1"
          >
            Regenerate Plan
          </button>
        </div>
      )}
    </div>
  );
};

// ─── FEATURE 2: AI Profile / Resume Analyzer ─────────────────────────────────
const AIProfileAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { score: number; strengths: string[]; gaps: string[]; tip: string }>(null);
  const [error, setError] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a placement readiness analyzer. Analyze this student profile and return ONLY valid JSON — no markdown, no backticks, no extra text.

Format: {"score":75,"strengths":["strength 1","strength 2","strength 3"],"gaps":["gap 1","gap 2"],"tip":"One actionable tip under 20 words."}

Rules:
- score: 0-100 integer (placement readiness)
- strengths: exactly 3 items, each under 8 words
- gaps: exactly 2 items, each under 8 words
- tip: single most impactful next step

Student data:
${studentContext}`
          }]
        })
      });
      const json = await res.json();
      const text = json.content?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '').join('') ?? '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      setResult(JSON.parse(cleaned));
      setAnalyzed(true);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result
    ? result.score >= 75 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-600' : 'text-rose-600'
    : '';
  const scoreRing = result
    ? result.score >= 75 ? 'stroke-emerald-500' : result.score >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'
    : '';
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            AI Placement Readiness Analyzer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Instant AI analysis of your profile and gaps</p>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">AI</span>
      </div>

      {!analyzed && !loading && (
        <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-100 p-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Analyze your placement readiness</p>
            <p className="text-xs text-slate-400 mt-0.5">Get strengths, skill gaps & top priority action</p>
          </div>
          <button
            onClick={analyzeProfile}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-3"
          >
            Analyze Now
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4 px-4 bg-slate-50 rounded-xl border border-slate-100">
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin flex-shrink-0" />
          <p className="text-xs text-slate-500">Analyzing your profile…</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Score Ring */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="28"
                fill="none"
                className={scoreRing}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * result.score) / 100}
                transform="rotate(-90 36 36)"
              />
            </svg>
            <p className={`text-2xl font-bold -mt-12 ${scoreColor}`}>{result.score}</p>
            <p className="text-[10px] text-slate-400 mt-8 font-medium">Readiness Score</p>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Strengths</p>
              <div className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Skill Gaps</p>
              <div className="space-y-1.5">
                {result.gaps.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    {g}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Top Priority</p>
              <p className="text-xs text-indigo-700 font-medium">{result.tip}</p>
            </div>
          </div>
        </div>
      )}

      {analyzed && (
        <button
          onClick={analyzeProfile}
          className="w-full text-xs text-emerald-600 hover:text-emerald-700 font-medium py-2 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors mt-4"
        >
          Re-analyze Profile
        </button>
      )}
    </div>
  );
};

// ─── FEATURE 3: AI Career Coach Chat ─────────────────────────────────────────
type Message = { role: 'user' | 'assistant'; content: string };

const AICareerCoach: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi Yuvraj! 👋 I'm your AI Career Coach. I know your profile — ask me anything about placements, interviews, or your learning path!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are an expert AI Career Coach for engineering students. You have access to this student's data:
${studentContext}
Be concise, warm, and actionable. Keep responses under 100 words. Use bullet points for lists. Never make up information.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const json = await res.json();
      const reply = json.content?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '').join('') ?? "Sorry, I couldn't respond. Try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['How do I crack placement interviews?', 'What should I focus on this week?', 'Review my weak areas'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            AI Career Coach
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Ask anything about your career, placements, or interviews</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">AI</span>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            {open ? 'Minimize' : 'Open Chat'}
          </button>
        </div>
      </div>

      {!open && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setOpen(true); setInput(s); }}
              className="text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="mt-4">
          {/* Messages */}
          <div className="h-72 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Brain className="w-2.5 h-2.5 text-indigo-600" />
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-500">AI Coach</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                  <span className="text-xs text-slate-400">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips when chat is open */}
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="text-[11px] text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your career coach…"
              className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export const StudentDashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
 
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 text-slate-800 antialiased">
      
      {/* Premium Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">Yuvraj Singh</span> 👋
          </p>
        </div>

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
        
        {/* Left Side: Profile & Metrics (Col Span 1) */}
        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-white shadow-inner">
                YS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    Yuvraj Singh
                  </h2>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                    STU001
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">B.Tech Computer Science & Eng.</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-medium text-slate-700">yuvraj@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">Phone</p>
                  <p className="font-medium text-slate-700">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">University</p>
                  <p className="font-medium text-slate-700">Campus2Corporate University</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-400">DOB</p>
                  <p className="font-medium text-slate-700">30-12-2000</p>
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

          {/* ✅ AI FEATURE 1: Smart Study Planner — placed after Registration Overview in left column */}
          <AIStudyPlanner />
        </div>

        {/* Right Side: Graph & Modules (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Performance Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Performance Overview
                </h2>
                <p className="text-xs text-slate-500">Learning score metric progression</p>
              </div>
            </div>

            <div className="w-full" style={{ height: 235 }}>
              <ResponsiveContainer width="100%" height="100%"> 
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ✅ AI FEATURE 2: Placement Readiness Analyzer — placed between Performance Chart and Modules */}
          <AIProfileAnalyzer />

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
                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800">{mod.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{mod.category}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{mod.progress}%</span>
                  </div>
                  
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

      {/* Roadmap Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6 overflow-hidden">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-lg font-bold text-slate-950">Roadmap to Placement</h2>
          <p className="text-xs text-slate-500 mt-1">Navigate through step-by-step career readiness milestones</p>
        </div>
          
        <div className="relative">
          <div className="hidden lg:block absolute top-[26px] left-[6%] right-[6%] h-[2px] bg-slate-100"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {[
              { step: '01', title: 'Profile Building', desc: 'Secure, verified credentials.', icon: UserCheck },
              { step: '02', title: 'Skill Assessment', desc: 'AI proctored baseline tests.', icon: Brain },
              { step: '03', title: 'Learning Roadmap', desc: 'Curated targeted content.', icon: BookOpen },
              { step: '04', title: 'Mentorship', desc: 'Mock trials & expert reviews.', icon: Users },
              { step: '05', title: 'AI Matching', desc: 'Vector matching active roles.', icon: Cpu },
              { step: '06', title: 'Interview', desc: 'Calendars scheduling.', icon: Calendar },
              { step: '07', title: 'Placement', desc: 'Final contract signing.', icon: Award }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-4 bg-slate-50/50 rounded-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-indigo-100 hover:bg-white group">
                <div className="w-12 h-12 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-sm relative z-10 group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                  <item.icon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 text-[8px] bg-slate-100 border border-slate-200 text-slate-500 font-mono w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-slate-700 mt-4 group-hover:text-slate-900 transition-colors">{item.title}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Activities Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
        <h2 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Upcoming Activities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'React Assignment Submission', desc: 'Module 3 Project Submission', date: 'Due: 25 Jun', color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { title: 'Aptitude Assessment', desc: 'Placement Prep Test', date: '28 Jun', color: 'text-amber-700 bg-amber-50 border-amber-100' },
            { title: 'Mentor Session', desc: 'One-on-One Career Guidance', date: '30 Jun', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
            { title: 'Mock Interview', desc: 'Technical Practice', date: '05 Jul', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
          ].map((activity, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activity.color}`}>
                  {activity.date}
                </span>
                <h3 className="font-semibold text-sm text-slate-800 mt-3 leading-snug">
                  {activity.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {activity.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ AI FEATURE 3: AI Career Coach Chat — placed after Upcoming Activities at the bottom */}
      <AICareerCoach />

    </div>
  );
};