import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComponentType } from 'react';
import {
  MapPin,
  Wallet,
  CalendarClock,
  ArrowLeft,
  ArrowRight,
  Clock,
  HelpCircle,
  Gauge,
  ShieldCheck,
  Camera,
  Maximize2,
  Mic,
  Check,
  LayoutGrid,
  ScanFace,
  Users,
  Wifi,
  WifiOff,
  ClipboardList,
  Info,
  GraduationCap,
  UserRound,
  Hash,
  CalendarDays,
  Wallet2,
  Video,
  AlertTriangle,
  RotateCcw,
  Flag,
  Send,
  Trophy,
  XCircle,
  CheckCircle2,
  Loader2,
  Eye,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type RoundStatus = 'completed' | 'current' | 'upcoming';
type OverviewStatus = 'ready' | 'pending' | 'in-progress' | 'completed';

interface TimelineStep {
  id: string;
  label: string;
  status: RoundStatus;
}

interface RoundOverviewData {
  id: string;
  name: string;
  tag: string;
  duration?: string;
  metric?: string;
  passingPercent?: number;
  status: OverviewStatus;
}

type IconType = ComponentType<{ className?: string }>;

// Assessment flow types ------------------------------------------------------

type FlowStage =
  | 'idle'
  | 'resume'
  | 'permissions'
  | 'preview'
  | 'fullscreen-error'
  | 'countdown'
  | 'assessment'
  | 'terminated'
  | 'result';

type PermState = 'idle' | 'requesting' | 'granted' | 'denied';

type QuestionCategory =
  | 'Quantitative Aptitude'
  | 'Logical Reasoning'
  | 'Verbal Ability'
  | 'General Awareness';

interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  options: string[];
  correctIndex: number;
}

type ViolationKey =
  | 'tabSwitch'
  | 'fullscreenExit'
  | 'windowBlur'
  | 'copyAttempt'
  | 'pasteAttempt'
  | 'rightClick'
  | 'escapePress'
  | 'f11Press';

type ViolationCounts = Record<ViolationKey, number>;

type ResultStatus = 'passed' | 'failed' | 'terminated';

interface AssessmentResult {
  correct: number;
  total: number;
  status: ResultStatus;
}

type PaletteStatus = 'current' | 'answered-review' | 'review' | 'answered' | 'unanswered';

interface SavedAssessmentState {
  answers: Record<number, number | null>;
  markedForReview: Record<number, boolean>;
  currentQuestionIndex: number;
  timeLeft: number;
  strikes: number;
  violationCounts: ViolationCounts;
  savedAt: number;
}

// ============================================================================
// Dummy data (replace with real API data later)
// ============================================================================

const DRIVE = {
  company: 'Google',
  role: 'Software Engineer',
  location: 'Bangalore',
  packageLabel: '₹32 LPA',
  deadline: '5 Aug 2026',
  status: 'Application Active',
  currentRoundIndex: 0,
  totalRounds: 5,
};

const CANDIDATE_NAME = 'Aarav Mehta';

const INITIAL_TIMELINE_STEPS: TimelineStep[] = [
  { id: 'applied', label: 'Application Submitted', status: 'completed' },
  { id: 'aptitude', label: 'Aptitude Test', status: 'current' },
  { id: 'tech1', label: 'Technical Round 1', status: 'upcoming' },
  { id: 'tech2', label: 'Technical Round 2', status: 'upcoming' },
  { id: 'hr', label: 'HR Interview', status: 'upcoming' },
  { id: 'offer', label: 'Offer Letter', status: 'upcoming' },
];

const ACTIVE_ASSESSMENT = {
  title: 'Aptitude Assessment',
  duration: '45 Minutes',
  questions: '30',
  passingScore: '70%',
  difficulty: 'Medium',
  aiMonitoring: 'Enabled',
  webcam: 'Required',
  fullscreen: 'Required',
  microphone: 'Required',
};

const MONITORING_RULES: { icon: IconType; label: string }[] = [
  { icon: Camera, label: 'Webcam must remain ON' },
  { icon: Maximize2, label: 'Fullscreen mode mandatory' },
  { icon: ScanFace, label: 'Face detection enabled' },
  { icon: LayoutGrid, label: 'No tab switching' },
  { icon: Users, label: 'One person only' },
  { icon: Mic, label: 'Microphone enabled' },
  { icon: Wifi, label: 'Stable internet required' },
  { icon: ShieldCheck, label: 'Browser permissions required' },
];

const INSTRUCTIONS: string[] = [
  'Read each question carefully.',
  'Do not leave fullscreen.',
  'Camera must remain enabled.',
  'Suspicious activity will be recorded.',
  'Passing score is 70%.',
];

const INITIAL_ROUND_OVERVIEW: RoundOverviewData[] = [
  {
    id: 'aptitude',
    name: 'Aptitude',
    tag: 'Online Test',
    duration: '45 mins',
    metric: '30 Questions',
    passingPercent: 70,
    status: 'ready',
  },
  { id: 'tech1', name: 'Technical Round 1', tag: 'Coding Assessment', status: 'pending' },
  { id: 'tech2', name: 'Technical Round 2', tag: 'Technical Interview', status: 'pending' },
  { id: 'hr', name: 'HR Round', tag: 'Interview', status: 'pending' },
];

const COMPANY_INFO = {
  company: 'Google',
  package: '₹32 LPA',
  location: 'Bangalore, India',
  eligibility: '7.5+ CGPA, no active backlogs',
  hiringManager: 'To be assigned',
  applicants: '214',
  hiringBatch: '2027',
  applicationId: 'C2C-GOOG-2026-0341',
};

// Assessment engine constants -------------------------------------------------

const ASSESSMENT_DURATION_SECONDS = 45 * 60;
const PASSING_PERCENT = 70;
const AUTOSAVE_KEY = 'hiring-process-assessment-autosave-v1';
const STRIKE_DEBOUNCE_MS = 1500;
const AUTOSAVE_INTERVAL_MS = 10000;

const INITIAL_VIOLATIONS: ViolationCounts = {
  tabSwitch: 0,
  fullscreenExit: 0,
  windowBlur: 0,
  copyAttempt: 0,
  pasteAttempt: 0,
  rightClick: 0,
  escapePress: 0,
  f11Press: 0,
};

const VIOLATION_LABELS: Record<ViolationKey, string> = {
  tabSwitch: 'Tab Switch',
  fullscreenExit: 'Fullscreen Exit',
  windowBlur: 'Window Minimized',
  copyAttempt: 'Copy Attempt',
  pasteAttempt: 'Paste Attempt',
  rightClick: 'Right Click',
  escapePress: 'Escape Key',
  f11Press: 'F11 Key',
};

// 30 dummy aptitude questions covering quant, logical, verbal & general topics
const QUESTIONS: Question[] = [
  // Quantitative Aptitude
  {
    id: 1,
    category: 'Quantitative Aptitude',
    text: 'A train travels 60 km in 45 minutes. What is its average speed in km/h?',
    options: ['70 km/h', '75 km/h', '80 km/h', '90 km/h'],
    correctIndex: 2,
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    text: 'The average of five consecutive integers is 21. What is the largest of these integers?',
    options: ['21', '22', '23', '24'],
    correctIndex: 2,
  },
  {
    id: 3,
    category: 'Quantitative Aptitude',
    text: 'A shopkeeper marks an item 25% above its cost price and then offers a 10% discount. What is his profit percentage?',
    options: ['10%', '12.5%', '15%', '20%'],
    correctIndex: 1,
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    text: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually?',
    options: ['₹2,000', '₹2,100', '₹2,200', '₹2,500'],
    correctIndex: 1,
  },
  {
    id: 5,
    category: 'Quantitative Aptitude',
    text: 'If 8 workers can complete a task in 15 days, how many days will 12 workers take to complete the same task?',
    options: ['8 days', '10 days', '12 days', '15 days'],
    correctIndex: 1,
  },
  {
    id: 6,
    category: 'Quantitative Aptitude',
    text: 'Simplify: (12 + 8) ÷ 4 × 2',
    options: ['5', '8', '10', '40'],
    correctIndex: 2,
  },
  {
    id: 7,
    category: 'Quantitative Aptitude',
    text: 'A sum of money doubles itself in 8 years at simple interest. What is the annual rate of interest?',
    options: ['10%', '12.5%', '15%', '20%'],
    correctIndex: 1,
  },
  {
    id: 8,
    category: 'Quantitative Aptitude',
    text: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    correctIndex: 2,
  },
  // Logical Reasoning
  {
    id: 9,
    category: 'Logical Reasoning',
    text: 'All roses are flowers. Some flowers fade quickly. Which conclusion can be drawn?',
    options: ['All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'All flowers are roses'],
    correctIndex: 1,
  },
  {
    id: 10,
    category: 'Logical Reasoning',
    text: "Pointing to a photograph, a man says, \"She is the daughter of my grandfather's only son.\" How is the woman related to the man?",
    options: ['Sister', 'Mother', 'Cousin', 'Aunt'],
    correctIndex: 0,
  },
  {
    id: 11,
    category: 'Logical Reasoning',
    text: 'Find the odd one out.',
    options: ['Apple', 'Banana', 'Carrot', 'Mango'],
    correctIndex: 2,
  },
  {
    id: 12,
    category: 'Logical Reasoning',
    text: 'If CAT is coded as 3-1-20 (A=1, B=2, C=3 ...), how is DOG coded using the same logic?',
    options: ['4-15-7', '4-16-5', '4-25-7', '4-7-15'],
    correctIndex: 0,
  },
  {
    id: 13,
    category: 'Logical Reasoning',
    text: 'In a certain code, each letter is shifted forward by one position, so SUN becomes TVO. Using the same rule, how is MOON written?',
    options: ['NPPO', 'NPPP', 'MPPO', 'NPOP'],
    correctIndex: 0,
  },
  {
    id: 14,
    category: 'Logical Reasoning',
    text: 'A is taller than B. C is shorter than B. D is taller than A. Who is the tallest among the four?',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 3,
  },
  {
    id: 15,
    category: 'Logical Reasoning',
    text: 'Complete the analogy: Doctor is to Hospital as Teacher is to ?',
    options: ['Book', 'School', 'Student', 'Chalk'],
    correctIndex: 1,
  },
  {
    id: 16,
    category: 'Logical Reasoning',
    text: 'Statement: All cars are vehicles. Some vehicles are trucks. Which conclusion follows?',
    options: ['All trucks are cars', 'Some cars are trucks', 'No definite conclusion can be drawn', 'All vehicles are cars'],
    correctIndex: 2,
  },
  // Verbal Ability
  {
    id: 17,
    category: 'Verbal Ability',
    text: "Choose the word closest in meaning to 'Meticulous'.",
    options: ['Careless', 'Precise', 'Hasty', 'Vague'],
    correctIndex: 1,
  },
  {
    id: 18,
    category: 'Verbal Ability',
    text: "Choose the word most opposite in meaning to 'Benevolent'.",
    options: ['Kind', 'Generous', 'Malicious', 'Charitable'],
    correctIndex: 2,
  },
  {
    id: 19,
    category: 'Verbal Ability',
    text: 'Fill in the blank: Despite the heavy rain, the match ___ as scheduled.',
    options: ['was cancelled', 'proceeded', 'postponed', 'delayed'],
    correctIndex: 1,
  },
  {
    id: 20,
    category: 'Verbal Ability',
    text: 'Identify the correctly spelled word.',
    options: ['Recieve', 'Receive', 'Receeve', 'Receve'],
    correctIndex: 1,
  },
  {
    id: 21,
    category: 'Verbal Ability',
    text: "Choose the word closest in meaning to 'Ephemeral'.",
    options: ['Permanent', 'Fleeting', 'Ancient', 'Sturdy'],
    correctIndex: 1,
  },
  {
    id: 22,
    category: 'Verbal Ability',
    text: 'Select the grammatically correct sentence.',
    options: ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", 'He not like coffee.'],
    correctIndex: 2,
  },
  {
    id: 23,
    category: 'Verbal Ability',
    text: "Choose the one-word substitute for 'a person who talks excessively'.",
    options: ['Introvert', 'Loquacious', 'Reticent', 'Taciturn'],
    correctIndex: 1,
  },
  {
    id: 24,
    category: 'Verbal Ability',
    text: "Identify the figure of speech used in the sentence: 'Time is a thief.'",
    options: ['Simile', 'Metaphor', 'Alliteration', 'Personification'],
    correctIndex: 1,
  },
  // General Awareness
  {
    id: 25,
    category: 'General Awareness',
    text: 'Which data structure follows the First In First Out (FIFO) principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctIndex: 1,
  },
  {
    id: 26,
    category: 'General Awareness',
    text: 'What does the acronym CPU stand for?',
    options: ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Central Processor Utility'],
    correctIndex: 0,
  },
  {
    id: 27,
    category: 'General Awareness',
    text: 'Which of the following is not a programming language?',
    options: ['Python', 'HTML', 'Java', 'C++'],
    correctIndex: 1,
  },
  {
    id: 28,
    category: 'General Awareness',
    text: 'In computer networking, what does HTTP stand for?',
    options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Path', 'Host Transfer Text Protocol'],
    correctIndex: 0,
  },
  {
    id: 29,
    category: 'General Awareness',
    text: 'Which sorting algorithm generally has the best average-case time complexity?',
    options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
    correctIndex: 2,
  },
  {
    id: 30,
    category: 'General Awareness',
    text: 'Which company developed the Android operating system?',
    options: ['Apple', 'Microsoft', 'Google', 'Amazon'],
    correctIndex: 2,
  },
];

// ============================================================================
// Small pure helpers
// ============================================================================

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60).toString().padStart(2, '0');
  const seconds = Math.floor(clamped % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function readSavedAssessment(): SavedAssessmentState | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedAssessmentState;
  } catch {
    return null;
  }
}

// ============================================================================
// Small local building blocks
// Kept in this file per the single-file requirement, but written as
// self-contained functions so they're easy to lift into their own
// components later if the page needs to be split up.
// ============================================================================

function TimelineStepDot({ status }: { status: RoundStatus }) {
  if (status === 'completed') {
    return (
      <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm shadow-blue-600/30">
        <Check className="h-4 w-4 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (status === 'current') {
    return (
      <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm shadow-blue-600/30">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-blue-400"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50">
      <span className="h-2 w-2 rounded-full bg-slate-300" />
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50">
      <Icon className="h-4 w-4 text-blue-600" />
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MonitoringRuleRow({ icon: Icon, label }: { icon: IconType; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="flex items-center gap-2.5 text-sm text-slate-700">
        <Icon className="h-4 w-4 flex-shrink-0 text-blue-600" />
        {label}
      </span>
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
      </span>
    </div>
  );
}

function InstructionRow({ index, text }: { index: number; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
    >
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
        {index + 1}
      </span>
      <p className="text-sm text-slate-700">{text}</p>
    </motion.div>
  );
}

const overviewStatusStyles: Record<OverviewStatus, string> = {
  ready: 'bg-blue-50 text-blue-700 border-blue-100',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending: 'bg-slate-100 text-slate-500 border-slate-200',
};

const overviewStatusLabel: Record<OverviewStatus, string> = {
  ready: 'Ready',
  'in-progress': 'In Progress',
  completed: 'Completed',
  pending: 'Pending',
};

function RoundOverviewCard({ round, index }: { round: RoundOverviewData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 * index }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{round.name}</p>
          <p className="text-xs text-slate-400">{round.tag}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${overviewStatusStyles[round.status]}`}
        >
          {overviewStatusLabel[round.status]}
        </span>
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
        {round.duration && <p>{round.duration}</p>}
        {round.metric && <p>{round.metric}</p>}
        {typeof round.passingPercent === 'number' && <p>Passing: {round.passingPercent}%</p>}
      </div>
    </motion.div>
  );
}

function CompanyInfoRow({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <dt className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function PermissionRow({
  icon: Icon,
  label,
  status,
  actionLabel,
  onRequest,
}: {
  icon: IconType;
  label: string;
  status: PermState;
  actionLabel: string;
  onRequest: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="flex items-center gap-2.5 text-sm text-slate-700">
        <Icon className="h-4 w-4 flex-shrink-0 text-blue-600" />
        {label}
      </span>
      {status === 'granted' && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Granted
        </span>
      )}
      {status === 'denied' && (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
            <XCircle className="h-4 w-4" /> Not Granted
          </span>
          <button
            type="button"
            onClick={onRequest}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {actionLabel}
          </button>
        </div>
      )}
      {(status === 'idle' || status === 'requesting') && (
        <button
          type="button"
          onClick={onRequest}
          disabled={status === 'requesting'}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {status === 'requesting' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const paletteColorMap: Record<PaletteStatus, string> = {
  current: 'bg-blue-600 text-white ring-2 ring-blue-200',
  'answered-review': 'bg-purple-500 text-white',
  review: 'bg-amber-400 text-white',
  answered: 'bg-emerald-500 text-white',
  unanswered: 'bg-slate-100 text-slate-500 border border-slate-200',
};

function PaletteButton({
  index,
  status,
  onClick,
}: {
  index: number;
  status: PaletteStatus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-105 ${paletteColorMap[status]}`}
    >
      {index + 1}
    </button>
  );
}

function ViolationRow({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${count > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{count}</span>
    </div>
  );
}

function OptionRow({
  letter,
  label,
  selected,
  onClick,
}: {
  letter: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
        selected
          ? 'border-blue-600 bg-blue-50 text-blue-900'
          : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          selected ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-500'
        }`}
      >
        {letter}
      </span>
      {label}
    </button>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function HiringProcess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------
  // Flow / stage state
  // ---------------------------------------------------------------------
  const [stage, setStage] = useState<FlowStage>(() => (readSavedAssessment() ? 'resume' : 'idle'));
  const [restoredData] = useState<SavedAssessmentState | null>(() => readSavedAssessment());

  // Permission / device state
  const [cameraStatus, setCameraStatus] = useState<PermState>('idle');
  const [micStatus, setMicStatus] = useState<PermState>('idle');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () => typeof document !== 'undefined' && !!document.fullscreenElement,
  );
  const [fullscreenDenied, setFullscreenDenied] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<'countdown' | 'assessment'>('countdown');
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  // Countdown state
  const [countdownValue, setCountdownValue] = useState(3);

  // Exam progress state (seeded from any restored autosave)
  const [answers, setAnswers] = useState<Record<number, number | null>>(() => restoredData?.answers ?? {});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>(
    () => restoredData?.markedForReview ?? {},
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() =>
    Math.min(Math.max(restoredData?.currentQuestionIndex ?? 0, 0), QUESTIONS.length - 1),
  );
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    Math.min(Math.max(restoredData?.timeLeft ?? ASSESSMENT_DURATION_SECONDS, 0), ASSESSMENT_DURATION_SECONDS),
  );
  const [strikes, setStrikes] = useState<number>(() => Math.min(Math.max(restoredData?.strikes ?? 0, 0), 2));
  const [violationCounts, setViolationCounts] = useState<ViolationCounts>(
    () => restoredData?.violationCounts ?? INITIAL_VIOLATIONS,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [activeWarningNumber, setActiveWarningNumber] = useState<number | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Hiring progress state (updated once the aptitude round is passed)
  const [aptitudePassed, setAptitudePassed] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(DRIVE.currentRoundIndex);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>(INITIAL_TIMELINE_STEPS);
  const [roundOverview, setRoundOverview] = useState<RoundOverviewData[]>(INITIAL_ROUND_OVERVIEW);

  const [showComingSoonToast, setShowComingSoonToast] = useState(false);

  // ---------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastStrikeRef = useRef(0);
  const prevFullscreenRef = useRef(isFullscreen);
  const latestRef = useRef({ answers, markedForReview, currentQuestionIndex, timeLeft, strikes, violationCounts });

  useEffect(() => {
    latestRef.current = { answers, markedForReview, currentQuestionIndex, timeLeft, strikes, violationCounts };
  });

  const roundLabel = useMemo(
    () => `Round ${currentRoundIndex + 1} of ${DRIVE.totalRounds}`,
    [currentRoundIndex],
  );

  // ---------------------------------------------------------------------
  // Global listeners: fullscreen + network status (always mounted)
  // ---------------------------------------------------------------------
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Bind the live MediaStream to whichever <video> element is mounted for
  // the current stage (preview screen or in-exam monitoring thumbnail).
  useEffect(() => {
    if ((stage === 'preview' || stage === 'assessment') && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [stage]);

  // ---------------------------------------------------------------------
  // Scoring / termination / submission (stable callbacks, read state via ref)
  // ---------------------------------------------------------------------
  const computeScore = useCallback(() => {
    const { answers: latestAnswers } = latestRef.current;
    let correct = 0;
    QUESTIONS.forEach((q) => {
      if (latestAnswers[q.id] === q.correctIndex) correct += 1;
    });
    return correct;
  }, []);

  const stopMonitoringAndFullscreen = useCallback(() => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        /* noop */
      });
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const finishAssessment = useCallback(
    (correct: number, status: ResultStatus) => {
      setResult({ correct, total: QUESTIONS.length, status });
      setStage('result');
      stopMonitoringAndFullscreen();
      try {
        window.localStorage.removeItem(AUTOSAVE_KEY);
      } catch {
        /* noop */
      }
    },
    [stopMonitoringAndFullscreen],
  );

  const submitFinal = useCallback(() => {
    const correct = computeScore();
    const percent = (correct / QUESTIONS.length) * 100;
    const status: ResultStatus = percent >= PASSING_PERCENT ? 'passed' : 'failed';

    if (status === 'passed') {
      setAptitudePassed(true);
      setCurrentRoundIndex(1);
      setTimelineSteps((prev) =>
        prev.map((step) => {
          if (step.id === 'aptitude') return { ...step, status: 'completed' };
          if (step.id === 'tech1') return { ...step, status: 'current' };
          return step;
        }),
      );
      setRoundOverview((prev) =>
        prev.map((round) => {
          if (round.id === 'aptitude') return { ...round, status: 'completed' };
          if (round.id === 'tech1') return { ...round, status: 'ready' };
          return round;
        }),
      );
    }

    finishAssessment(correct, status);
  }, [computeScore, finishAssessment]);

  const terminateAssessment = useCallback(() => {
    const correct = computeScore();
    setResult({ correct, total: QUESTIONS.length, status: 'terminated' });
    setStage('terminated');
    stopMonitoringAndFullscreen();
    try {
      window.localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      /* noop */
    }
  }, [computeScore, stopMonitoringAndFullscreen]);

  // ---------------------------------------------------------------------
  // AI Monitoring: violation tracking + 3-strike pause/terminate system
  // ---------------------------------------------------------------------
  const registerViolation = useCallback(
    (type: ViolationKey) => {
      setViolationCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));

      const isMajor = type === 'tabSwitch' || type === 'fullscreenExit' || type === 'windowBlur';
      if (!isMajor) return;

      const now = Date.now();
      if (now - lastStrikeRef.current < STRIKE_DEBOUNCE_MS) return;
      lastStrikeRef.current = now;

      setStrikes((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          terminateAssessment();
        } else {
          setActiveWarningNumber(next);
          setIsPaused(true);
        }
        return next;
      });
    },
    [terminateAssessment],
  );

  // Detect fullscreen exits while the exam is active
  useEffect(() => {
    if (stage === 'assessment' && prevFullscreenRef.current && !isFullscreen) {
      registerViolation('fullscreenExit');
    }
    prevFullscreenRef.current = isFullscreen;
  }, [isFullscreen, stage, registerViolation]);

  // Tab switch / window blur / copy / paste / right-click / key monitoring
  useEffect(() => {
    if (stage !== 'assessment') return;

    const onVisibility = () => {
      if (document.hidden) registerViolation('tabSwitch');
    };
    const onBlur = () => registerViolation('windowBlur');
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation('copyAttempt');
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation('pasteAttempt');
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerViolation('rightClick');
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') registerViolation('escapePress');
      if (e.key === 'F11') {
        e.preventDefault();
        registerViolation('f11Press');
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [stage, registerViolation]);

  // ---------------------------------------------------------------------
  // 45-minute timer (auto-submits at zero, pauses during warnings)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'assessment' || isPaused) return;
    if (timeLeft <= 0) {
      submitFinal();
      return;
    }
    const timeout = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timeout);
  }, [stage, isPaused, timeLeft, submitFinal]);

  // ---------------------------------------------------------------------
  // Auto-save every 10 seconds while the assessment is active
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'assessment') return;
    const interval = setInterval(() => {
      try {
        const snapshot: SavedAssessmentState = { ...latestRef.current, savedAt: Date.now() };
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snapshot));
      } catch {
        /* noop */
      }
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [stage]);

  // ---------------------------------------------------------------------
  // Countdown (3, 2, 1 -> assessment)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'countdown') return;
    setCountdownValue(3);
    const interval = setInterval(() => {
      setCountdownValue((v) => Math.max(0, v - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'countdown' || countdownValue !== 0) return;
    const timeout = setTimeout(() => setStage('assessment'), 500);
    return () => clearTimeout(timeout);
  }, [stage, countdownValue]);

  // ---------------------------------------------------------------------
  // Permission + fullscreen request handlers
  // ---------------------------------------------------------------------
  const requestCameraAndMic = async () => {
    setCameraStatus('requesting');
    setMicStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setCameraStatus('granted');
      setMicStatus('granted');
    } catch {
      setCameraStatus('denied');
      setMicStatus('denied');
    }
  };

  const handleRequestFullscreenPermission = () => {
    try {
      document.documentElement
        .requestFullscreen()
        .then(() => setFullscreenDenied(false))
        .catch(() => setFullscreenDenied(true));
    } catch {
      setFullscreenDenied(true);
    }
  };

  const attemptFullscreen = useCallback((target: 'countdown' | 'assessment') => {
    if (document.fullscreenElement) {
      setStage(target);
      return;
    }
    try {
      document.documentElement
        .requestFullscreen()
        .then(() => setStage(target))
        .catch(() => {
          setPendingTarget(target);
          setStage('fullscreen-error');
        });
    } catch {
      setPendingTarget(target);
      setStage('fullscreen-error');
    }
  }, []);

  const proceedToExam = () => attemptFullscreen('countdown');

  const resumeAssessment = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setCameraStatus('granted');
      setMicStatus('granted');
    } catch {
      /* continue anyway - other monitoring signals remain active */
    }
    attemptFullscreen('assessment');
  };

  const cancelPreAssessment = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStatus('idle');
    setMicStatus('idle');
    setStage('idle');
  };

  const handleReturnFromWarning = () => {
    setActiveWarningNumber(null);
    if (!document.fullscreenElement) {
      try {
        document.documentElement.requestFullscreen().catch(() => {
          /* noop */
        });
      } catch {
        /* noop */
      }
    }
    setIsPaused(false);
  };

  const resetExamState = () => {
    setAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setTimeLeft(ASSESSMENT_DURATION_SECONDS);
    setStrikes(0);
    setViolationCounts(INITIAL_VIOLATIONS);
    setResult(null);
    setCameraStatus('idle');
    setMicStatus('idle');
    setIsPaused(false);
    setActiveWarningNumber(null);
    try {
      window.localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      /* noop */
    }
  };

  const handlePrimaryCta = () => {
    if (aptitudePassed) {
      setShowComingSoonToast(true);
      window.setTimeout(() => setShowComingSoonToast(false), 2600);
      return;
    }
    console.debug('Starting assessment for drive', id);
    setStage('permissions');
  };

  const handleBack = () => navigate(-1);

  // ---------------------------------------------------------------------
  // In-exam navigation & answer handlers
  // ---------------------------------------------------------------------
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const answeredCount = QUESTIONS.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== null,
  ).length;
  const reviewCount = QUESTIONS.filter((q) => markedForReview[q.id]).length;
  const unansweredCount = QUESTIONS.length - answeredCount;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100);
  const timerDanger = timeLeft <= 300;

  const selectOption = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const goToNext = () => setCurrentQuestionIndex((i) => Math.min(i + 1, QUESTIONS.length - 1));
  const goToPrev = () => setCurrentQuestionIndex((i) => Math.max(i - 1, 0));

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }));
  };

  const handleSaveAndNext = () => {
    try {
      const snapshot: SavedAssessmentState = { ...latestRef.current, savedAt: Date.now() };
      window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snapshot));
    } catch {
      /* noop */
    }
    goToNext();
  };

  const handleSubmit = (auto: boolean) => {
    if (auto) {
      submitFinal();
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    submitFinal();
  };

  const getPaletteStatus = (index: number): PaletteStatus => {
    const q = QUESTIONS[index];
    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
    const isReview = !!markedForReview[q.id];
    if (index === currentQuestionIndex) return 'current';
    if (isAnswered && isReview) return 'answered-review';
    if (isReview) return 'review';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  // ========================================================================
  // Stage: Assessment (full-page replacement)
  // ========================================================================
  if (stage === 'assessment') {
    return (
      <div className="min-h-screen bg-slate-50 pb-10">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Question {currentQuestionIndex + 1} / {QUESTIONS.length}
              </p>
              <div className="mt-1.5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  timerDanger ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> {formatTime(timeLeft)} Remaining
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                AI Monitoring Active
              </span>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Send className="h-3.5 w-3.5" /> Submit
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <section className="space-y-6 lg:col-span-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {currentQuestion.category}
                  </span>
                  <button
                    type="button"
                    onClick={toggleMarkForReview}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      markedForReview[currentQuestion.id]
                        ? 'bg-amber-400 text-white'
                        : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}
                  </button>
                </div>
                <p className="mt-5 text-base font-medium leading-relaxed text-slate-900 sm:text-lg">
                  {currentQuestion.text}
                </p>
                <div className="mt-6 space-y-3">
                  {currentQuestion.options.map((opt, i) => (
                    <OptionRow
                      key={i}
                      letter={String.fromCharCode(65 + i)}
                      label={opt}
                      selected={answers[currentQuestion.id] === i}
                      onClick={() => selectOption(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={currentQuestionIndex === 0}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAndNext}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    Save &amp; Next
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={currentQuestionIndex === QUESTIONS.length - 1}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-1">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Eye className="h-3.5 w-3.5 text-blue-600" /> Live Monitoring
                </div>
                <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-slate-900">
                  <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Question Palette</p>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {QUESTIONS.map((q, index) => (
                    <PaletteButton
                      key={q.id}
                      index={index}
                      status={getPaletteStatus(index)}
                      onClick={() => setCurrentQuestionIndex(index)}
                    />
                  ))}
                </div>
                <div className="mt-4 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-emerald-500" /> Answered
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-amber-400" /> Marked for Review
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded border border-slate-200 bg-slate-100" /> Unanswered
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-blue-600" /> Current
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Warnings ({strikes}/3)
                </div>
                <div className="mt-3 space-y-1.5">
                  {(Object.keys(VIOLATION_LABELS) as ViolationKey[]).map((key) => (
                    <ViolationRow key={key} label={VIOLATION_LABELS[key]} count={violationCounts[key]} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <AnimatePresence>
          {activeWarningNumber !== null && (
            <motion.div
              key="warning-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">Warning {activeWarningNumber} of 3</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Return immediately. Further violations will terminate the assessment.
                </p>
                <button
                  type="button"
                  onClick={handleReturnFromWarning}
                  className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Return to Assessment
                </button>
              </motion.div>
            </motion.div>
          )}

          {showSubmitConfirm && (
            <motion.div
              key="submit-confirm-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl"
              >
                <h2 className="text-lg font-semibold text-slate-900">Submit Assessment?</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/70 px-3 py-2">
                    <span className="text-slate-500">Unanswered Questions</span>
                    <span className="font-semibold text-slate-900">{unansweredCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/70 px-3 py-2">
                    <span className="text-slate-500">Marked for Review</span>
                    <span className="font-semibold text-slate-900">{reviewCount}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmSubmit}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ========================================================================
  // Stage: Terminated (full-page replacement)
  // ========================================================================
  if (stage === 'terminated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-slate-900">Assessment Terminated</h1>
          <p className="mt-2 text-sm text-slate-500">
            Multiple proctoring violations were detected and the session was ended automatically to preserve
            assessment integrity.
          </p>
          <button
            type="button"
            onClick={() => setStage('result')}
            className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            View Result
          </button>
        </motion.div>
      </div>
    );
  }

  // ========================================================================
  // Stage: Result (full-page replacement)
  // ========================================================================
  if (stage === 'result' && result) {
    const percent = Math.round((result.correct / result.total) * 100);
    const passed = result.status === 'passed';
    const terminated = result.status === 'terminated';

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm sm:p-10"
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              passed ? 'bg-emerald-50' : 'bg-rose-50'
            }`}
          >
            {terminated ? (
              <AlertTriangle className="h-8 w-8 text-rose-600" />
            ) : passed ? (
              <Trophy className="h-8 w-8 text-emerald-600" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-600" />
            )}
          </div>
          <p className="mt-6 text-sm font-medium text-slate-500">Score</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">
            {result.correct} / {result.total}
          </p>
          <p className="mt-1 text-lg font-medium text-slate-500">{percent}%</p>
          <span
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${
              passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {terminated ? 'Terminated' : passed ? 'Passed' : 'Failed'}
          </span>

          {passed && (
            <div className="mt-8 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-left text-sm text-slate-600">
              <p className="font-semibold text-slate-900">What&apos;s next</p>
              <p>Your hiring timeline has been updated. Technical Round 1 is now unlocked.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (!passed) resetExamState();
              setStage('idle');
            }}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700"
          >
            {passed ? 'Continue to Technical Round 1' : 'Retry Assessment'}
          </button>
        </motion.div>
      </div>
    );
  }

  // ========================================================================
  // Stage: idle / resume / permissions / preview / fullscreen-error / countdown
  // (overview page stays mounted underneath any overlay)
  // ========================================================================
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Back link */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hiring
        </button>

        {/* ---------------------------------------------------------------- */}
        {/* 1. Hero section */}
        {/* ---------------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="flex gap-4">
              {/* Company logo placeholder */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600">
                {DRIVE.company.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">{DRIVE.company}</p>
                <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {DRIVE.role}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {DRIVE.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-slate-400" />
                    {DRIVE.packageLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-slate-400" />
                    Deadline: {DRIVE.deadline}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {DRIVE.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              {roundLabel}
            </div>
          </div>
        </motion.section>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Horizontal hiring timeline */}
        {/* ---------------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-start overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {timelineSteps.map((step, index) => {
              const isLast = index === timelineSteps.length - 1;
              return (
                <div
                  key={step.id}
                  className="flex min-w-[100px] flex-1 flex-col items-center last:min-w-0 last:flex-none sm:min-w-[120px]"
                >
                  <div className="flex w-full items-center">
                    {index !== 0 && (
                      <div className={`h-0.5 flex-1 ${step.status !== 'upcoming' ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    )}
                    <TimelineStepDot status={step.status} />
                    {!isLast && (
                      <div
                        className={`h-0.5 flex-1 ${step.status === 'completed' ? 'bg-blue-600' : 'bg-slate-200'}`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-3 max-w-[96px] text-center text-xs font-medium leading-tight sm:text-sm ${
                      step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* ------------------------------------------------------------ */}
            {/* 3. Active assessment card */}
            {/* ------------------------------------------------------------ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  {ACTIVE_ASSESSMENT.title}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    aptitudePassed ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {aptitudePassed ? 'Completed' : 'Current Round'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatTile icon={Clock} label="Duration" value={ACTIVE_ASSESSMENT.duration} />
                <StatTile icon={HelpCircle} label="Questions" value={ACTIVE_ASSESSMENT.questions} />
                <StatTile icon={Gauge} label="Passing Score" value={ACTIVE_ASSESSMENT.passingScore} />
                <StatTile icon={Gauge} label="Difficulty" value={ACTIVE_ASSESSMENT.difficulty} />
                <StatTile icon={ShieldCheck} label="AI Monitoring" value={ACTIVE_ASSESSMENT.aiMonitoring} />
                <StatTile icon={Camera} label="Webcam" value={ACTIVE_ASSESSMENT.webcam} />
                <StatTile icon={Maximize2} label="Fullscreen" value={ACTIVE_ASSESSMENT.fullscreen} />
                <StatTile icon={Mic} label="Microphone" value={ACTIVE_ASSESSMENT.microphone} />
              </div>

              <motion.button
                type="button"
                onClick={handlePrimaryCta}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700 sm:w-auto sm:px-8"
              >
                {aptitudePassed ? 'Continue to Technical Round 1' : 'Start Assessment'}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.section>

            {/* ------------------------------------------------------------ */}
            {/* 4. AI monitoring card */}
            {/* ------------------------------------------------------------ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">AI Monitoring</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                This assessment is proctored end-to-end. Keep these requirements in mind before you begin.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {MONITORING_RULES.map((rule) => (
                  <MonitoringRuleRow key={rule.label} icon={rule.icon} label={rule.label} />
                ))}
              </div>
            </motion.section>

            {/* ------------------------------------------------------------ */}
            {/* 5. Assessment instructions */}
            {/* ------------------------------------------------------------ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Assessment Instructions</h2>
              </div>
              <div className="mt-5 space-y-3">
                {INSTRUCTIONS.map((text, index) => (
                  <InstructionRow key={text} index={index} text={text} />
                ))}
              </div>
            </motion.section>

            {/* ------------------------------------------------------------ */}
            {/* 6. Round overview */}
            {/* ------------------------------------------------------------ */}
            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">Round Overview</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {roundOverview.map((round, index) => (
                  <RoundOverviewCard key={round.id} round={round} index={index} />
                ))}
              </div>
            </section>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            {/* ------------------------------------------------------------ */}
            {/* 7. Company information card */}
            {/* ------------------------------------------------------------ */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold tracking-tight text-slate-900">Company Information</h2>
              <dl className="mt-4 divide-y divide-slate-100">
                <CompanyInfoRow icon={Wallet2} label="Company" value={COMPANY_INFO.company} />
                <CompanyInfoRow icon={Wallet} label="Package" value={COMPANY_INFO.package} />
                <CompanyInfoRow icon={MapPin} label="Location" value={COMPANY_INFO.location} />
                <CompanyInfoRow icon={GraduationCap} label="Eligibility" value={COMPANY_INFO.eligibility} />
                <CompanyInfoRow icon={UserRound} label="Hiring Manager" value={COMPANY_INFO.hiringManager} />
                <CompanyInfoRow icon={Users} label="Applicants" value={COMPANY_INFO.applicants} />
                <CompanyInfoRow icon={CalendarDays} label="Hiring Batch" value={COMPANY_INFO.hiringBatch} />
                <CompanyInfoRow icon={Hash} label="Application ID" value={COMPANY_INFO.applicationId} />
              </dl>
            </motion.section>

            {/* ------------------------------------------------------------ */}
            {/* 8. Important notice banner */}
            {/* ------------------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
              className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5"
            >
              <Info className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800">
                Complete every round in sequence. Technical Round 1 will unlock only after passing Aptitude.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Sticky bottom action bar */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-400">Current Round:</span>
            <span className="font-semibold text-slate-900">{ACTIVE_ASSESSMENT.title}</span>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:flex-none"
            >
              Back
            </button>
            <motion.button
              type="button"
              onClick={handlePrimaryCta}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700 sm:flex-none sm:px-8"
            >
              {aptitudePassed ? 'Continue to Technical Round 1' : 'Start Assessment'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pre-assessment overlays: permissions, preview, fullscreen, countdown */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {stage === 'resume' && (
          <motion.div
            key="resume-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Resume Assessment</h2>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                We found an assessment in progress. Would you like to resume where you left off?
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <p className="text-xs text-slate-500">Time Remaining</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatTime(restoredData?.timeLeft ?? ASSESSMENT_DURATION_SECONDS)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <p className="text-xs text-slate-500">Answered</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {restoredData
                      ? Object.values(restoredData.answers).filter((v) => v !== null && v !== undefined).length
                      : 0}{' '}
                    / {QUESTIONS.length}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetExamState();
                    setStage('idle');
                  }}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  Discard &amp; Start Over
                </button>
                <button
                  type="button"
                  onClick={resumeAssessment}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Resume Assessment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'permissions' && (
          <motion.div
            key="permissions-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Assessment Permissions</h2>
              </div>
              <p className="mt-1.5 text-sm text-slate-500">
                Grant the following permissions to begin the proctored assessment.
              </p>

              <div className="mt-5 space-y-3">
                <PermissionRow
                  icon={Video}
                  label="Webcam Access"
                  status={cameraStatus}
                  actionLabel="Grant Access"
                  onRequest={requestCameraAndMic}
                />
                <PermissionRow
                  icon={Mic}
                  label="Microphone Access"
                  status={micStatus}
                  actionLabel="Grant Access"
                  onRequest={requestCameraAndMic}
                />
                <PermissionRow
                  icon={Maximize2}
                  label="Fullscreen Mode"
                  status={isFullscreen ? 'granted' : fullscreenDenied ? 'denied' : 'idle'}
                  actionLabel="Enable Fullscreen"
                  onRequest={handleRequestFullscreenPermission}
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={cancelPreAssessment}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStage('preview')}
                  disabled={!(cameraStatus === 'granted' && micStatus === 'granted' && isFullscreen)}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'preview' && (
          <motion.div
            key="preview-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-slate-900">
                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                AI Monitoring Active
              </div>
              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Candidate</dt>
                  <dd className="font-medium text-slate-900">{CANDIDATE_NAME}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Company</dt>
                  <dd className="font-medium text-slate-900">{DRIVE.company}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Round</dt>
                  <dd className="font-medium text-slate-900">{ACTIVE_ASSESSMENT.title}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Network</dt>
                  <dd
                    className={`flex items-center gap-1.5 font-medium ${
                      isOnline ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                    {isOnline ? 'Stable' : 'Unstable'}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={cancelPreAssessment}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={proceedToExam}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Begin Assessment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'fullscreen-error' && (
          <motion.div
            key="fullscreen-error-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-xl sm:p-8"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                <AlertTriangle className="h-6 w-6 text-rose-600" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700">
                Assessment cannot begin until fullscreen mode is enabled.
              </p>
              <button
                type="button"
                onClick={() => attemptFullscreen(pendingTarget)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
            </motion.div>
          </motion.div>
        )}

        {stage === 'countdown' && (
          <motion.div
            key="countdown-overlay"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-medium uppercase tracking-widest text-slate-300">Assessment begins in</p>
            <AnimatePresence mode="wait">
              <motion.span
                key={countdownValue}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mt-4 text-8xl font-bold text-white"
              >
                {countdownValue > 0 ? countdownValue : 'Go'}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComingSoonToast && (
          <motion.div
            key="coming-soon-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg"
          >
            Technical Round 1 assessment will be available soon.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}