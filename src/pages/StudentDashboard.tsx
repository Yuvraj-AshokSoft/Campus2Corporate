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
  ChevronRight,
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
  CalendarDays,
  Upload,
  Eye,
  RefreshCw,
  Lightbulb,
  Target,
  Briefcase,

} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ─── Static Data ─────────────────────────────────────────────────────────────

const performanceData = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 90 },
];

const modules = [
  { title: 'React Development', category: 'Frontend Development', progress: 70, color: 'bg-indigo-600' },
  { title: 'Python Programming', category: 'Programming Fundamentals', progress: 45, color: 'bg-emerald-600' },
  { title: 'Data Structures & Algorithms', category: 'Technical Interview Prep', progress: 60, color: 'bg-violet-600' },
  { title: 'Aptitude Training', category: 'Placement Prep', progress: 85, color: 'bg-amber-500' },
];

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, active: true },
  { title: 'My Profile', icon: UserCheck },
  { title: 'My Courses', icon: BookOpen },
  { title: 'Assessments', icon: ClipboardCheck },
  { title: 'Placements', icon: Briefcase },
  { title: 'Mentorship', icon: Users },
  { title: 'Career Coach', icon: MessageSquareText },
  { title: 'Resume Score', icon: FileText },
  { title: 'Certificates', icon: BadgeCheck },
  { title: 'Settings', icon: Settings },
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

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = { role: 'user' | 'assistant'; content: string };

interface StudyDay { day: string; tasks: string[] }

interface ProfileResult {
  score: number;
  strengths: string[];
  gaps: string[];
  tip: string;
}

interface ATSBreakdown { label: string; score: number }

interface ATSResult {
  score: number;
  title: string;
  description: string;
  breakdown: ATSBreakdown[];
  keywords_found: string[];
  keywords_missing: string[];
  tip: string;
}

interface SkillGapResult {
  match_score: number;
  role: string;
  summary: string;
  matched_skills: string[];
  missing_skills: { skill: string; priority: 'High' | 'Medium' | 'Low' }[];
  suggested_modules: string[];
  tip: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const callClaude = async (body: object): Promise<string> => {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return (json.content ?? [])
    .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text : ''))
    .join('');
};

const parseJSON = <T,>(raw: string): T => {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
};

// ─── FEATURE 1: AI Smart Study Planner ───────────────────────────────────────

const AIStudyPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyDay[] | null>(null);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setPlan(null);
    try {
      const text = await callClaude({
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
- 3 tasks per day`,
        }],
      });
      setPlan(parseJSON<StudyDay[]>(text));
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
                <span className={`w-2 h-2 rounded-full`} />
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

// ─── FEATURE 2: AI Placement Readiness Analyzer ──────────────────────────────

const AIProfileAnalyzer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [error, setError] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const text = await callClaude({
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
${studentContext}`,
        }],
      });
      setResult(parseJSON<ProfileResult>(text));
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

// ─── FEATURE 3: AI ATS Resume Scorer ─────────────────────────────────────────

const AIATSScorer: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFileName(file.name);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setFileContent((e.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const analyze = async () => {
    if (!fileName) return;
    setLoading(true);
    setError('');
    setResult(null);

    const resumeText = fileContent
      ? fileContent.slice(0, 3000)
      : `[No extractable text — filename: ${fileName}]`;

    try {
      const text = await callClaude({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and return ONLY valid JSON — no markdown, no backticks, no extra text.

Format exactly:
{"score":72,"title":"Good ATS Match","description":"Your resume passes most ATS filters with minor gaps.","breakdown":[{"label":"Keyword density","score":80},{"label":"Format & structure","score":75},{"label":"Contact info","score":90},{"label":"Work experience","score":70},{"label":"Skills section","score":65},{"label":"Quantified results","score":55}],"keywords_found":["Python","JavaScript","SQL","React","Problem-solving"],"keywords_missing":["CI/CD","Docker","Agile","REST APIs"],"tip":"Add quantified impact metrics (e.g., 'Reduced load time by 30%') to boost recruiter attention."}

Rules:
- score: 0-100 integer
- title: 3-5 words
- description: 1 sentence under 20 words
- breakdown: exactly 6 items, label (2-3 words) and score (0-100 int)
- keywords_found: 4-6 items
- keywords_missing: 3-5 items
- tip: 1 sentence under 25 words

Resume content:
${resumeText}`,
        }],
      });
      setResult(parseJSON<ATSResult>(text));
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFileName('');
    setFileContent('');
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getScoreColor = (s: number) =>
    s >= 75 ? { ring: 'stroke-emerald-500', text: 'text-emerald-600' }
    : s >= 50 ? { ring: 'stroke-amber-500', text: 'text-amber-600' }
    : { ring: 'stroke-rose-500', text: 'text-rose-600' };

  const getBarColor = (s: number) =>
    s >= 75 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  const getScoreTag = (s: number) =>
    s >= 75
      ? { label: 'ATS Friendly', cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
      : s >= 50
      ? { label: 'Needs Improvement', cls: 'bg-amber-50 text-amber-700 border-amber-100' }
      : { label: 'Low ATS Score', cls: 'bg-rose-50 text-rose-700 border-rose-100' };

  const circumference = 2 * Math.PI * 32;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            ATS Resume Scorer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Upload your resume for an instant ATS compatibility score</p>
        </div>
        <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">AI</span>
      </div>

      {!loading && !result && (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-amber-400 bg-amber-50'
                : fileName
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <Upload className={`w-4 h-4 ${fileName ? 'text-emerald-500' : 'text-slate-400'}`} />
            </div>
            {fileName ? (
              <>
                <p className="text-xs font-semibold text-emerald-700">{fileName}</p>
                <p className="text-[11px] text-slate-400 mt-1">Click to replace</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-700">Drop your resume here or click to browse</p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, TXT, DOC · Max 5 MB</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={handleFileInput}
          />

          <button
            onClick={analyze}
            disabled={!fileName}
            className="mt-3 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze Resume
          </button>

          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-3">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="flex flex-col items-center py-8 gap-2">
          <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-400">Analyzing your resume against ATS criteria…</p>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0 w-[80px] h-[80px]">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  className={getScoreColor(result.score).ring}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * result.score) / 100}
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${getScoreColor(result.score).text}`}>{result.score}</span>
                <span className="text-[9px] text-slate-400">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{result.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{result.description}</p>
              <span className={`inline-block mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getScoreTag(result.score).cls}`}>
                {getScoreTag(result.score).label}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Score Breakdown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {result.breakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-600">{item.label}</span>
                    <span className="text-[11px] font-semibold text-slate-700">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getBarColor(item.score)} transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords found</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_found.map((k, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Keywords missing</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords_missing.map((k, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">Top recommendation</p>
              <p className="text-xs text-indigo-700">{result.tip}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <Eye className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <p className="text-[11px] text-slate-400">
              This score is visible to <span className="font-medium text-slate-500">you</span>,{' '}
              <span className="font-medium text-slate-500">recruiters</span>, and{' '}
              <span className="font-medium text-slate-500">admins</span> reviewing your profile.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full text-xs text-amber-600 hover:text-amber-700 font-medium py-2 border border-amber-100 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Score another resume
          </button>
        </div>
      )}
    </div>
  );
};

// ─── FEATURE 4: AI Job Skills & Gap Analysis Matching ────────────────────────

const popularRoles = ['Frontend Developer', 'Backend Developer', 'Data Analyst', 'Full Stack Developer'];

const AISkillGapAnalyzer: React.FC = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [error, setError] = useState('');

  const analyze = async (targetRole?: string) => {
    const roleToUse = (targetRole ?? role).trim();
    if (!roleToUse) return;
    setRole(roleToUse);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const text = await callClaude({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a job skill-gap analyzer. Compare this student's current skills against what is typically required for the target job role. Return ONLY valid JSON — no markdown, no backticks, no extra text.

Format exactly:
{"match_score":68,"role":"Frontend Developer","summary":"You meet most core requirements but lack testing and deployment experience.","matched_skills":["React","JavaScript","HTML/CSS"],"missing_skills":[{"skill":"TypeScript","priority":"High"},{"skill":"Unit Testing","priority":"Medium"}],"suggested_modules":["TypeScript Fundamentals","Testing with Jest"],"tip":"Focus on TypeScript next — it's required in 80% of frontend job postings."}

Rules:
- match_score: 0-100 integer
- role: echo back the target role name, cleaned up
- summary: 1 sentence, under 22 words
- matched_skills: 3-6 items the student already has, based on their registered modules and progress
- missing_skills: 3-5 items, each with a "skill" (1-3 words) and "priority" of "High", "Medium", or "Low"
- suggested_modules: 2-4 short course/module names to close the gap
- tip: 1 sentence, under 25 words, most impactful next step

Target job role: ${roleToUse}

Student data:
${studentContext}`,
        }],
      });
      setResult(parseJSON<SkillGapResult>(text));
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError('');
    setRole('');
  };

  const scoreColor = result
    ? result.match_score >= 75 ? 'text-emerald-600' : result.match_score >= 50 ? 'text-amber-600' : 'text-rose-600'
    : '';
  const scoreRing = result
    ? result.match_score >= 75 ? 'stroke-emerald-500' : result.match_score >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'
    : '';
  const circumference = 2 * Math.PI * 28;

  const priorityCls = (p: string) =>
    p === 'High'
      ? 'bg-rose-50 text-rose-700 border-rose-100'
      : p === 'Medium'
      ? 'bg-amber-50 text-amber-700 border-amber-100'
      : 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" />
            AI Job Skills & Gap Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">See how your skills match a target job role</p>
        </div>
        <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full">AI</span>
      </div>

      {!result && !loading && (
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs font-medium text-slate-700">Enter a target job role</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              placeholder="e.g. Frontend Developer"
              className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50"
            />
            <button
              onClick={() => analyze()}
              disabled={!role.trim()}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Analyze
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {popularRoles.map((r) => (
              <button
                key={r}
                onClick={() => analyze(r)}
                className="text-[11px] text-slate-500 bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-100 px-2.5 py-1 rounded-full transition-colors"
              >
                {r}
              </button>
            ))}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-3">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-4 px-4 bg-slate-50 rounded-xl border border-slate-100">
          <Loader2 className="w-4 h-4 text-rose-500 animate-spin flex-shrink-0" />
          <p className="text-xs text-slate-500">Matching your skills against {role}…</p>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0 w-[72px] h-[72px]">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle
                  cx="36" cy="36" r="28"
                  fill="none"
                  className={scoreRing}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * result.match_score) / 100}
                  transform="rotate(-90 36 36)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-lg font-bold ${scoreColor}`}>{result.match_score}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{result.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">{result.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Matched skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matched_skills.map((s, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Skill gaps</p>
              <div className="flex flex-col gap-1.5">
                {result.missing_skills.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-slate-700">{m.skill}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityCls(m.priority)}`}>
                      {m.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested modules to close the gap</p>
            <div className="flex flex-wrap gap-1.5">
              {result.suggested_modules.map((m, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex gap-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-0.5">Top recommendation</p>
              <p className="text-xs text-rose-700">{result.tip}</p>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full text-xs text-rose-600 hover:text-rose-700 font-medium py-2 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Check another role
          </button>
        </div>
      )}
    </div>
  );
};

// ─── FEATURE 5: AI Career Coach Chat ─────────────────────────────────────────

const AICareerCoach: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi Yuvraj! 👋 I'm your AI Career Coach. I know your profile — ask me anything about placements, interviews, or your learning path!",
    },
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
      const reply = await callClaude({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are an expert AI Career Coach for engineering students. You have access to this student's data:
${studentContext}
Be concise, warm, and actionable. Keep responses under 100 words. Use bullet points for lists. Never make up information.`,
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply || "Sorry, I couldn't respond. Try again." }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
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
          <div className="h-72 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                  }`}
                >
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

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
    <div className="h-screen bg-slate-50 flex overflow-hidden">

      {/* ── Sidebar ── */}
      <div className="w-60 h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col">

        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">C2C</h2>
              <p className="text-sm text-indigo-200">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-300
                ${
                  item.active
                    ? 'bg-gradient-to-r from-indigo-500/30 to-violet-500/20 border border-indigo-400/20 shadow-lg'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-6 h-6 ${item.active ? 'text-indigo-300' : 'text-slate-300'}`} />
                  <span className={`font-medium text-lg ${item.active ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </span>
                </div>
                {item.active && <ChevronRight className="w-5 h-5 text-indigo-300" />}
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="p-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-sm text-slate-400">Overall Progress</p>
            <h3 className="text-2xl font-bold mt-2">65%</h3>
            <div className="mt-4 h-2 rounded-full bg-slate-700">
              <div className="h-2 rounded-full w-2/3 bg-gradient-to-r from-indigo-400 to-violet-500" />
            </div>
            <p className="text-xs text-slate-400 mt-3">4th Year • Semester 8</p>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-8 py-7">
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs mb-4">
                  B.Tech CSE • 4th Year
                </div>

                <h1 className="text-3xl font-bold text-white">Welcome back, Yuvraj 👋</h1>

                <p className="text-slate-400 mt-2 max-w-xl">
                  Track your courses, placement readiness, and AI-powered career tools — all in one place.
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    YS
                  </div>
                  <div className="text-left hidden xs:block">
                    <p className="text-xs font-semibold text-white leading-tight">Yuvraj Singh</p>
                    <p className="text-[10px] text-slate-400 leading-tight">STU001</p>
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
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">Registered</p>
                <h2 className="text-3xl font-bold text-white mt-1">5</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">Completed</p>
                <h2 className="text-3xl font-bold text-emerald-300 mt-1">2</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">Pending</p>
                <h2 className="text-3xl font-bold text-amber-300 mt-1">3</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-slate-400 text-sm">Certificates</p>
                <h2 className="text-3xl font-bold text-violet-300 mt-1">1</h2>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
                React Assignment Due Jun 25
              </div>
              <div className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
                Aptitude Assessment Jun 28
              </div>
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                Mock Interview Jul 5
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-white shadow-inner">
                  YS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Yuvraj Singh</h2>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                      STU001
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">B.Tech Computer Science & Eng.</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'yuvraj@example.com' },
                  { icon: Phone, label: 'Phone', value: '+91 9876543210' },
                  { icon: GraduationCap, label: 'University', value: 'Campus2Corporate University' },
                  { icon: MapPin, label: 'DOB', value: '30-12-2000' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-400">{label}</p>
                      <p className="font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Overview */}
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
                  { label: 'Certificates', val: '1', bg: 'bg-purple-50/50', text: 'text-purple-700', border: 'border-purple-100/50' },
                ].map((stat) => (
                  <div key={stat.label} className={`p-4 rounded-xl border ${stat.bg} ${stat.border}`}>
                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.text}`}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Study Planner */}
            <AIStudyPlanner />
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Performance Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Performance Overview</h2>
                  <p className="text-xs text-slate-500">Learning score metric progression</p>
                </div>
              </div>
              <div className="w-full" style={{ height: 235 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Placement Readiness Analyzer */}
            <AIProfileAnalyzer />

          {/* AI ATS Resume Scorer */}
          <AIATSScorer />

          {/* AI Job Skills & Gap Analysis Matching */}
          <AISkillGapAnalyzer />

            {/* Modules & Learning Progress */}
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
            <div className="hidden lg:block absolute top-[26px] left-[6%] right-[6%] h-[2px] bg-slate-100" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {[
                { step: '01', title: 'Profile Building', desc: 'Secure, verified credentials.', icon: UserCheck },
                { step: '02', title: 'Skill Assessment', desc: 'AI proctored baseline tests.', icon: Brain },
                { step: '03', title: 'Learning Roadmap', desc: 'Curated targeted content.', icon: BookOpen },
                { step: '04', title: 'Mentorship', desc: 'Mock trials & expert reviews.', icon: Users },
                { step: '05', title: 'AI Matching', desc: 'Vector matching active roles.', icon: Cpu },
                { step: '06', title: 'Interview', desc: 'Calendar scheduling.', icon: Calendar },
                { step: '07', title: 'Placement', desc: 'Final contract signing.', icon: Award },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center p-4 bg-slate-50/50 rounded-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-indigo-100 hover:bg-white group"
                >
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

        {/* Upcoming Activities */}
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
              { title: 'Mock Interview', desc: 'Technical Practice', date: '05 Jul', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
            ].map((activity) => (
              <div key={activity.title} className="p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activity.color}`}>
                    {activity.date}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-800 mt-3 leading-snug">{activity.title}</h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{activity.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Career Coach */}
        <AICareerCoach />
      </div>
    </div>
  );
};

export default StudentDashboard;
