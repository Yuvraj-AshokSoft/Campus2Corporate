import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  Clock, 
  Mail, 
  Phone, 
  Search, 
  Sparkles, 
  Plus, 
  PlayCircle, 
  X, 
  ChevronDown, 
  CheckCircle, 
  ChevronRight,
  Bell,
  Send,
  Upload,
  FileText,
  BookOpen,
  Settings,
  Shield,
  Star,
  MessageSquare,
  Lock
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// ─── TS Props & Schemas ──────────────────────────────────────────────────────
interface Student {
  id: string;
  name: string;
  college: string;
  role: string;
  company: string;
  progress: number;
  matchScore: number;
  avatar: string;
  avatarBg: string;
  email: string;
  phone: string;
  notes: string[];
  skills: string[];
  attendance: number;
}

interface Session {
  id: string;
  studentName: string;
  type: string;
  time: string;
  date: string;
  badgeColor: string;
  actionLabel: string;
  meetingLink?: string;
}

interface Task {
  id: string;
  name: string;
  studentName: string;
  dueDate: string;
  status: 'Pending' | 'Reviewed' | 'In Progress';
}

interface Project {
  id: string;
  name: string;
  progress: number;
  team: string[];
  attachment: string;
  githubUrl: string;
}

interface Message {
  id: string;
  sender: 'mentor' | 'student';
  text: string;
  timestamp: string;
}

interface Resource {
  id: string;
  title: string;
  category: 'PDFs' | 'Notes' | 'Videos' | 'Coding Problems' | 'Prep Kits';
  uploadedAt: string;
  size: string;
}

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

// ─── Mock Databases ──────────────────────────────────────────────────────────
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Mehta',
    college: 'Delhi Technological University',
    role: 'Frontend Developer (React)',
    company: 'Stripe',
    progress: 82,
    matchScore: 94,
    avatar: 'AM',
    avatarBg: 'bg-blue-600',
    email: 'arjun.mehta@dtu.edu',
    phone: '+91 98765 43210',
    notes: [
      'Cleared Stripe logic screening with 98% accuracy.',
      'Demonstrated excellent modular component structure during UI build mock.',
      'Needs minor improvement in CSS grid layouts under stress.'
    ],
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Redux'],
    attendance: 95
  },
  {
    id: '2',
    name: 'Priya Sharma',
    college: 'NIT Trichy',
    role: 'Full Stack Engineer',
    company: 'Atlassian',
    progress: 65,
    matchScore: 88,
    avatar: 'PS',
    avatarBg: 'bg-emerald-600',
    email: 'priya.sharma@nitt.edu',
    phone: '+91 98765 43211',
    notes: [
      'Strong Postgres index design capability.',
      'Struggles with dynamic state management hooks. Suggested targeted labs.',
      'Highly active in peer mentoring sessions.'
    ],
    skills: ['Node.js', 'PostgreSQL', 'Go', 'Docker'],
    attendance: 92
  },
  {
    id: '3',
    name: 'Rahul Sen',
    college: 'IIT Bombay',
    role: 'UI/UX Designer',
    company: 'Notion',
    progress: 80,
    matchScore: 91,
    avatar: 'RS',
    avatarBg: 'bg-indigo-600',
    email: 'rahul.sen@iitb.ac.in',
    phone: '+91 98765 43212',
    notes: [
      'Presents designs beautifully. High client affinity scores.',
      'Reviewing Figma design tokens conversion to tailwind layers.',
      'Suggested reading: Refactoring UI by Adam Wathan.'
    ],
    skills: ['Figma', 'UI Design', 'Design Systems', 'HTML/CSS'],
    attendance: 96
  },
  {
    id: '4',
    name: 'Rohan Gupta',
    college: 'BITS Pilani',
    role: 'Software Engineer (Backend)',
    company: 'Vercel',
    progress: 78,
    matchScore: 85,
    avatar: 'RG',
    avatarBg: 'bg-violet-600',
    email: 'rohan.gupta@bits.edu',
    phone: '+91 98765 43213',
    notes: [
      'Very strong with DSA and complexity logs analysis.',
      'Completed mock system architecture review with B+ tier rating.',
      'Recommended research paper on distributed caching pipelines.'
    ],
    skills: ['Java', 'Spring Boot', 'System Design', 'Redis'],
    attendance: 90
  }
];

const initialSessions: Session[] = [
  {
    id: 's1',
    studentName: 'Arjun Mehta',
    type: 'Frontend Architecture Mock',
    time: '4:00 PM - 5:00 PM',
    date: 'Today',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    actionLabel: 'Start Interview',
    meetingLink: 'https://teams.microsoft.com/mock-link-arjun'
  },
  {
    id: 's2',
    studentName: 'Priya Sharma',
    type: 'System Design Review',
    time: '2:30 PM - 3:30 PM',
    date: 'Tomorrow',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    actionLabel: 'Open Rubric',
    meetingLink: 'https://teams.microsoft.com/mock-link-priya'
  },
  {
    id: 's3',
    studentName: 'Rohan Gupta',
    type: 'DSA Mock Session',
    time: '10:00 AM - 11:00 AM',
    date: '28 Jun',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-100',
    actionLabel: 'Reschedule',
    meetingLink: 'https://teams.microsoft.com/mock-link-rohan'
  }
];

const initialTasks: Task[] = [
  { id: 't1', name: 'Project Proposal Submission', studentName: 'Rahul Sen', dueDate: '2026-06-30', status: 'Reviewed' },
  { id: 't2', name: 'UI Design Layouts & Tokens', studentName: 'Rahul Sen', dueDate: '2026-07-02', status: 'In Progress' },
  { id: 't3', name: 'Frontend Cache Implementation', studentName: 'Arjun Mehta', dueDate: '2026-06-29', status: 'Pending' },
  { id: 't4', name: 'Postgres Schema Normalization', studentName: 'Priya Sharma', dueDate: '2026-07-05', status: 'Pending' }
];

const initialProjects: Project[] = [
  { id: 'p1', name: 'Campus Connect portal', progress: 75, team: ['Arjun Mehta', 'Priya Sharma'], attachment: 'campus_proposal.pdf', githubUrl: 'https://github.com/c2c/campus-connect' },
  { id: 'p2', name: 'Enterprise Pipeline Orchestrator', progress: 40, team: ['Rohan Gupta', 'Rahul Sen'], attachment: 'pipeline_arch.pdf', githubUrl: 'https://github.com/c2c/pipeline-orchestrator' }
];

const initialResources: Resource[] = [
  { id: 'r1', title: 'Stripe Frontend Mock Rubric', category: 'PDFs', uploadedAt: '2026-06-20', size: '1.2 MB' },
  { id: 'r2', title: 'System Design Interview Cheatsheet', category: 'Prep Kits', uploadedAt: '2026-06-18', size: '3.4 MB' },
  { id: 'r3', title: 'Cosyn Embeddings cos_match calculation', category: 'Notes', uploadedAt: '2026-06-22', size: '420 KB' }
];

const initialNotifications: Notification[] = [
  { id: 'n1', text: 'Rahul Sen submitted Project Proposal Submission', time: '10m ago', read: false },
  { id: 'n2', text: 'Arjun Mehta requested early access to Vercel pipeline', time: '1h ago', read: false },
  { id: 'n3', text: 'Atlassian sync: 4 students matched criteria', time: '4h ago', read: true }
];

export const MentorDashboard: React.FC = () => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'mentees' | 'meetings' | 'tracker' | 'tasks' | 'projects' | 'communication' | 'feedback' | 'resources' | 'profile'>('overview');

  // Global UI States
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data Collections States
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects] = useState<Project[]>(initialProjects);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Tab 2: Mentee management states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const filteredStudents = students.filter((student: Student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab 3: Meetings scheduling states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSessionStudent, setNewSessionStudent] = useState('');
  const [newSessionType, setNewSessionType] = useState('Frontend Architecture Mock');
  const [newSessionTime, setNewSessionTime] = useState('4:00 PM - 5:00 PM');
  const [newSessionDate, setNewSessionDate] = useState('Today');

  // Tab 5: Task allocation states
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskStudent, setNewTaskStudent] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Tab 7: Communication states
  const [activeChatStudent, setActiveChatStudent] = useState<string>('Arjun Mehta');
  const [typedMessage, setTypedMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    'Arjun Mehta': [
      { id: '1', sender: 'student', text: 'Hey Sarah, is the mock rubric ready?', timestamp: '2:30 PM' },
      { id: '2', sender: 'mentor', text: 'Yes, just uploaded to your profile resources block.', timestamp: '2:35 PM' }
    ],
    'Priya Sharma': [
      { id: '1', sender: 'student', text: 'Hi mentor, completed the schema changes.', timestamp: 'Yesterday' }
    ]
  });
  const [isTyping, setIsTyping] = useState(false);

  // Tab 8: Feedback states
  const [feedbackStudent, setFeedbackStudent] = useState('Arjun Mehta');
  const [techRating, setTechRating] = useState(4);
  const [commRating, setCommRating] = useState(4);
  const [feedbackComments, setFeedbackComments] = useState('');

  // Tab 10: Resource upload state
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState<'PDFs' | 'Notes' | 'Videos' | 'Coding Problems' | 'Prep Kits'>('PDFs');

  // Tab 15: Settings states
  const [darkMode, setDarkMode] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [availabilitySwitch, setAvailabilitySwitch] = useState(true);

  // Helper trigger toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add notes to a student
  const handleAddNote = (studentId: string) => {
    if (!newNoteText.trim()) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, notes: [newNoteText, ...s.notes] };
      }
      return s;
    }));
    setNewNoteText('');
    triggerToast('Note successfully logged.');
  };

  // Create new session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionStudent) {
      triggerToast('Please select a student.');
      return;
    }
    const newSession: Session = {
      id: `s_${Date.now()}`,
      studentName: newSessionStudent,
      type: newSessionType,
      time: newSessionTime,
      date: newSessionDate,
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-100',
      actionLabel: 'Start Interview',
      meetingLink: 'https://teams.microsoft.com/mock-link-added'
    };
    setSessions([newSession, ...sessions]);
    setShowScheduleModal(false);
    triggerToast(`Session scheduled with ${newSessionStudent}`);
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskStudent || !newTaskName) {
      triggerToast('Please fill out all task details.');
      return;
    }
    const newTask: Task = {
      id: `t_${Date.now()}`,
      name: newTaskName,
      studentName: newTaskStudent,
      dueDate: newTaskDueDate || '2026-07-10',
      status: 'Pending'
    };
    setTasks([newTask, ...tasks]);
    setShowAddTaskModal(false);
    setNewTaskName('');
    triggerToast(`Task assigned to ${newTaskStudent}`);
  };

  // Submit Feedback
  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Evaluation feedback logged for ${feedbackStudent}`);
    setFeedbackComments('');
  };

  // Send Chat message
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: 'mentor',
      text: typedMessage,
      timestamp: 'Just now'
    };

    setChatHistory(prev => ({
      ...prev,
      [activeChatStudent]: [...(prev[activeChatStudent] || []), newMsg]
    }));
    setTypedMessage('');

    // Simulate student typing response after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoResponse: Message = {
        id: `m_${Date.now() + 1}`,
        sender: 'student',
        text: 'Thanks Sarah! Let me inspect this right now.',
        timestamp: 'Just now'
      };
      setChatHistory(prev => ({
        ...prev,
        [activeChatStudent]: [...(prev[activeChatStudent] || []), autoResponse]
      }));
    }, 2000);
  };

  // Add Resource Share
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle.trim()) return;
    const newRes: Resource = {
      id: `r_${Date.now()}`,
      title: newResourceTitle,
      category: newResourceCategory,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '1.5 MB'
    };
    setResources([newRes, ...resources]);
    setNewResourceTitle('');
    triggerToast(`Resource shared: ${newRes.title}`);
  };

  // Dismiss notification
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Toggle OKR Item
  const toggleProgressItem = (_studentId: string, _index: number) => {
    triggerToast('Milestone status toggled.');
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen font-sans antialiased text-slate-800 flex flex-col md:flex-row bg-slate-50/50`}>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-[99999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-800 animate-slide-in">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-400 shrink-0 flex flex-col justify-between border-r border-slate-800">
          <div className="p-6">
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-pink-500/20">M</div>
              <div>
                <span className="text-xs block text-slate-500 uppercase tracking-widest font-black leading-none">Ashoksoft</span>
                <span className="text-sm block text-white font-extrabold tracking-tight mt-1">C2C Mentorship</span>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'mentees', label: 'Assigned Mentees', icon: Users },
                { id: 'meetings', label: 'Meetings Calendar', icon: Calendar },
                { id: 'tracker', label: 'Progress Tracker', icon: CheckCircle },
                { id: 'tasks', label: 'Tasks & Matrix', icon: Award },
                { id: 'projects', label: 'Group Projects', icon: CpuIcon },
                { id: 'communication', label: 'Chat Center', icon: MessageSquare },
                { id: 'feedback', label: 'Student Ratings', icon: Star },
                { id: 'resources', label: 'Resource Sharing', icon: Upload },
                { id: 'profile', label: 'Profile & Preference', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/10'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6 border-t border-slate-800 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-xs">
                SJ
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sarah Jenkins</h4>
                <p className="text-[10px] text-slate-500 font-medium">Mentor ID: M-2026</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Content Space */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Bar */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 relative z-30">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
                {activeTab} Management Workspace
              </h2>
            </div>

            <div className="flex items-center gap-4">
              
              {/* Notification System */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowDropdown(false);
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 relative transition-all"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-pink-500 border border-white"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-[9999] animate-fade-in text-left">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">Live Alerts</span>
                      <button 
                        onClick={() => {
                          setNotifications([]);
                          triggerToast('Alert checklist cleared.');
                        }}
                        className="text-[10px] font-bold text-pink-600 hover:text-pink-700"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto mt-1 space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center font-medium">No active alerts</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="p-2.5 hover:bg-slate-50 rounded-lg flex justify-between gap-3 text-xs border border-transparent hover:border-slate-100/50">
                            <div>
                              <p className="text-slate-700 font-medium">{notif.text}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">{notif.time}</span>
                            </div>
                            <button 
                              onClick={() => handleDismissNotification(notif.id)}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full bg-slate-50 border border-slate-200/50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-xs">
                    SJ
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 z-[9999] animate-fade-in text-left">
                    <div className="p-3 border-b border-slate-100">
                      <h4 className="font-bold text-xs text-slate-900">Sarah Jenkins</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Principal SE • Stripe</p>
                    </div>
                    {['My profile info', 'Activity audit logs', 'Rubric settings'].map(item => (
                      <button 
                        key={item}
                        onClick={() => {
                          setShowDropdown(false);
                          triggerToast(`Opening ${item}...`);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Main Tab Screen Wrapper */}
          <main className="flex-1 p-6 overflow-y-auto">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                {/* 6 Responsive stat tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Mentees', val: `${students.length} Active`, sub: 'Assigned cohorts', icon: Users, text: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                    { label: 'Upcoming Meetings', val: `${sessions.length} Scheduled`, sub: 'Today & tomorrow', icon: Calendar, text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                    { label: 'Pending Tasks/Reviews', val: `${tasks.filter(t => t.status === 'Pending').length} Items`, sub: 'Awaiting checks', icon: Clock, text: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                    { label: 'Average Student Progress', val: '78.2%', sub: 'Target Match: 88%', icon: Award, text: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
                    { label: 'Unread Messages', val: '4 New', sub: 'From active chats', icon: MessageSquare, text: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
                    { label: 'Active Projects', val: `${projects.length} Teams`, sub: 'Under supervision', icon: Shield, text: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-xl font-black text-slate-905 text-slate-900 mt-1">{stat.val}</h3>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">{stat.sub}</span>
                      </div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.text}`}>
                        <stat.icon className="w-5.5 h-5.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-grid: Analytics Mini Reports & Bulletins Ticker */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Attendance Analytics (Visual Metrics) */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Active Mentees Attendance & Progress Overview</h3>
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div key={student.id} className="space-y-1 text-xs">
                          <div className="flex justify-between items-center font-bold text-slate-700">
                            <span>{student.name}</span>
                            <span className="font-mono text-slate-500">Readiness: {student.progress}% | Att: {student.attendance}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                            <div className="bg-pink-500 h-full rounded-l" style={{ width: `${student.progress}%` }}></div>
                            <div className="bg-emerald-500 h-full rounded-r" style={{ width: `${(student.attendance - student.progress) > 0 ? (student.attendance - student.progress) : 0}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bulletins Panel */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Global Bulletins Feed</h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Placement Mock Check-in', desc: 'Mandatory mock checks for Stripe candidates on June 29.', date: 'Today' },
                          { title: 'Vercel Pipeline Match Guidelines', desc: 'Verify Docker and system design skills portfolio links.', date: '2 days ago' }
                        ].map((bulletin, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-extrabold text-slate-800">{bulletin.title}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-150 px-1.5 py-0.5 rounded">{bulletin.date}</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed font-semibold mt-1">{bulletin.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: MENTEES MANAGEMENT */}
            {activeTab === 'mentees' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                {/* Roster & Filter */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Mentees Roster & Profile Directory</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Filter by skills or search student records.</p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search name or skill..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Roster Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-pink-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${student.avatarBg}`}>
                              {student.avatar}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-xs text-slate-900">{student.name}</h3>
                              <p className="text-[10px] text-slate-400 font-semibold">{student.college}</p>
                              <p className="text-[10px] text-pink-600 font-bold mt-1">{student.role}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-600 border rounded">
                            Match: {student.matchScore}%
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1">
                          {student.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="text-[9px] font-bold bg-white text-slate-500 border border-slate-150 px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Attendance: {student.attendance}%</span>
                          </div>
                          
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-0.5"
                          >
                            <span>Profile Metrics</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mentee Profile Modal Overlay */}
                {selectedStudent && (
                  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
                      
                      {/* Modal Header */}
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${selectedStudent.avatarBg}`}>
                            {selectedStudent.avatar}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-900">{selectedStudent.name}</h3>
                            <p className="text-[10px] text-slate-400 font-semibold">{selectedStudent.college}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedStudent(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Modal Content */}
                      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                        
                        {/* Profile metrics row */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Attendance Rate</span>
                            <p className="text-base font-black text-slate-800 mt-1">{selectedStudent.attendance}%</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Target Match</span>
                            <p className="text-base font-black text-pink-600 mt-1">{selectedStudent.matchScore}%</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Target Company</span>
                            <p className="text-base font-black text-slate-800 mt-1">{selectedStudent.company}</p>
                          </div>
                        </div>

                        {/* Portfolio Details */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">Skills & Verified Badges</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedStudent.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2.5 py-1 bg-pink-50 border border-pink-100 text-pink-700 font-bold rounded-lg uppercase tracking-wide text-[9px]">
                                {skill} Verified
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Custom notes feed */}
                        <div className="space-y-3">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">Mentor Audit Notes Log</h4>
                          <div className="space-y-2 max-h-36 overflow-y-auto">
                            {selectedStudent.notes.map((note, nIdx) => (
                              <div key={nIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100/50 text-slate-600 leading-relaxed font-semibold">
                                {note}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              placeholder="Write a custom session note..."
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"
                            />
                            <button
                              onClick={() => handleAddNote(selectedStudent.id)}
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg"
                            >
                              Add Note
                            </button>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-slate-500">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{selectedStudent.email}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{selectedStudent.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Modal Footer Actions */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(null);
                            setActiveChatStudent(selectedStudent.name);
                            setActiveTab('communication');
                          }}
                          className="px-4 py-2 border border-slate-250 hover:bg-white text-slate-700 font-bold rounded-xl"
                        >
                          Send Message
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(null);
                            setNewSessionStudent(selectedStudent.name);
                            setShowScheduleModal(true);
                          }}
                          className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-600/10"
                        >
                          Schedule Meeting
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: MEETINGS ENGINE & CALENDAR */}
            {activeTab === 'meetings' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Meetings Feed */}
                  <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-sm font-bold text-slate-905 text-slate-900">Meetings Calendar Engine</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Mock assessments scheduler.</p>
                      </div>
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors"
                      >
                        <Plus className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {sessions.map((session) => (
                        <div key={session.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-slate-900">{session.studentName}</h4>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{session.type}</p>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-white text-slate-500 border rounded">
                              {session.date}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold">
                            <span className="text-slate-400 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {session.time}
                            </span>
                            
                            {session.meetingLink && (
                              <a 
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-pink-600 hover:text-pink-700 flex items-center gap-1"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Join Teams</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Mon-Fri Weekly Calendar Grid */}
                  <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Weekly Schedule Overview (Mon - Fri)</h3>
                    
                    <div className="grid grid-cols-5 gap-3 text-center font-bold">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">{day}</div>
                          
                          {/* Calendar slots */}
                          <div className="space-y-2 min-h-[220px] bg-slate-50/50 p-1.5 rounded-xl border border-slate-100">
                            {idx === 0 && (
                              <div className="p-2 bg-pink-50 border border-pink-100 rounded-lg text-pink-700 font-extrabold text-[9px] leading-tight">
                                4 PM: Arjun Mock
                              </div>
                            )}
                            {idx === 1 && (
                              <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 font-extrabold text-[9px] leading-tight">
                                2:30 PM: Priya Design
                              </div>
                            )}
                            {idx === 4 && (
                              <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 font-extrabold text-[9px] leading-tight">
                                10 AM: Rohan DSA
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: PROGRESS TRACKER (OKR VIEW) */}
            {activeTab === 'tracker' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-sm font-bold text-slate-900">Student Progress Tracker & OKR View</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Toggle student milestones and check active pipeline statuses.</p>
                  </div>

                  <div className="space-y-6">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4 text-xs font-semibold">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${student.avatarBg}`}>
                              {student.avatar}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-slate-900">{student.name}</h3>
                              <p className="text-[10px] text-slate-400 font-medium">DTU Cohort • Stripe Pipeline</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="flex items-center gap-3 w-full sm:w-48">
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="bg-pink-600 h-full rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                            <span className="font-mono text-slate-700 font-bold">{student.progress}%</span>
                          </div>
                        </div>

                        {/* Nesting checklist OKR items mapping */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                          {[
                            { name: 'Core Web API Lab', status: student.progress >= 70 ? 'done' : 'progress' },
                            { name: 'Cosine Embedding Match', status: student.progress >= 80 ? 'done' : 'progress' },
                            { name: 'Technical Assessment Rubric', status: student.progress >= 90 ? 'done' : 'pending' }
                          ].map((milestone, mIdx) => (
                            <label key={mIdx} className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-150 cursor-pointer hover:border-pink-200 transition-colors">
                              <input
                                type="checkbox"
                                checked={milestone.status === 'done'}
                                onChange={() => toggleProgressItem(student.id, mIdx)}
                                className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 border-slate-300"
                              />
                              <div className="leading-none text-left">
                                <p className="text-[10px] font-bold text-slate-700">{milestone.name}</p>
                                <span className={`text-[8px] font-bold uppercase tracking-wider block mt-0.5 ${
                                  milestone.status === 'done' ? 'text-emerald-600' : milestone.status === 'progress' ? 'text-amber-500' : 'text-slate-400'
                                }`}>
                                  {milestone.status === 'done' ? 'Completed' : milestone.status === 'progress' ? 'In Progress' : 'Locked'}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: TASK MANAGEMENT MATRIX */}
            {activeTab === 'tasks' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                  
                  {/* Task Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-bold text-slate-905 text-slate-900">Task Management Matrix</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Assign assignments and review submission queues.</p>
                    </div>
                    <button
                      onClick={() => setShowAddTaskModal(true)}
                      className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Task</span>
                    </button>
                  </div>

                  {/* Tasks Table */}
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-widest font-black text-[9px]">
                          <th className="p-4">Task Name</th>
                          <th className="p-4">Assigned Student</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-slate-700">
                        {tasks.map((task) => (
                          <tr key={task.id} className="border-b border-slate-100/50 hover:bg-slate-50/30">
                            <td className="p-4 font-bold text-slate-900">{task.name}</td>
                            <td className="p-4">{task.studentName}</td>
                            <td className="p-4 text-slate-400 font-mono">{task.dueDate}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                task.status === 'Reviewed' 
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                  : task.status === 'In Progress' 
                                    ? 'bg-blue-50 border-blue-100 text-blue-700' 
                                    : 'bg-amber-50 border-amber-100 text-amber-700'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'Reviewed' } : t));
                                    triggerToast('Task review approved.');
                                  }}
                                  className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold"
                                  disabled={task.status === 'Reviewed'}
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => {
                                    setFeedbackStudent(task.studentName);
                                    setActiveTab('feedback');
                                  }}
                                  className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
                                >
                                  Feedback
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 6: PROJECT SUPERVISION LAYOUT */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full space-y-5 text-xs">
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-extrabold text-sm text-slate-909 text-slate-900">{project.name}</h3>
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-[10px] text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
                          >
                            <span>GitHub</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        
                        <p className="text-[10px] text-slate-400 font-bold block">Assigned Team: {project.team.join(' & ')}</p>
                      </div>

                      {/* Loading bar tracker */}
                      <div className="space-y-1.5 font-bold">
                        <div className="flex justify-between items-center text-slate-600 text-[10px]">
                          <span>Implementation Progress</span>
                          <span className="font-mono text-slate-800">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-pink-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>

                      {/* Attachments & micro actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="hover:underline cursor-pointer" onClick={() => triggerToast(`Downloading attachment ${project.attachment}...`)}>
                            {project.attachment}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => triggerToast(`Reviewing codebase deliverables for ${project.name}...`)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px]"
                        >
                          Review Deliverables
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 7: INTEGRATED COMMUNICATION CENTER */}
            {activeTab === 'communication' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex h-[500px] text-xs">
                  
                  {/* Left Rail Channels */}
                  <div className="w-64 border-r border-slate-100 bg-slate-50 flex flex-col justify-between shrink-0 p-4">
                    <div className="space-y-6">
                      <div className="px-2">
                        <h3 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Active Channels</h3>
                      </div>
                      
                      <nav className="space-y-1">
                        {students.map((student) => (
                          <button
                            key={student.id}
                            onClick={() => setActiveChatStudent(student.name)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                              activeChatStudent === student.name
                                ? 'bg-white text-pink-600 shadow border border-slate-100'
                                : 'hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            <div className="w-6.5 h-6.5 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-[9px]">
                              {student.avatar}
                            </div>
                            <span className="truncate">{student.name}</span>
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div className="p-2 border-t border-slate-200 text-[10px] text-slate-400 font-semibold tracking-wide">
                      CHANNEL: Direct Messages
                    </div>
                  </div>

                  {/* Right Rail Message Panel */}
                  <div className="flex-1 flex flex-col justify-between bg-white">
                    
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-[10px]">
                          {activeChatStudent.slice(0, 2).toUpperCase()}
                        </div>
                        <h3 className="font-extrabold text-slate-900">{activeChatStudent}</h3>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">Online</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {(chatHistory[activeChatStudent] || []).map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-2xl max-w-sm ${
                            msg.sender === 'mentor'
                              ? 'bg-pink-600 text-white rounded-tr-none'
                              : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'
                          }`}>
                            <p className="font-semibold">{msg.text}</p>
                            <span className={`text-[9px] block mt-1.5 text-right ${msg.sender === 'mentor' ? 'text-pink-100' : 'text-slate-400'}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl rounded-tl-none font-bold animate-pulse">
                            Typing message...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                      <input
                        type="text"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 8: PERFORMANCE FEEDBACK */}
            {activeTab === 'feedback' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm max-w-xl text-xs">
                  <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Performance Evaluation Review</h2>
                  
                  <form onSubmit={handleSendFeedback} className="space-y-4 font-semibold text-slate-700">
                    
                    {/* Student Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Student</label>
                      <select
                        value={feedbackStudent}
                        onChange={(e) => setFeedbackStudent(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-bold"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.college})</option>
                        ))}
                      </select>
                    </div>

                    {/* Vector Star Ratings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Technical Vector</label>
                        <div className="flex gap-1.5 items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setTechRating(star)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                techRating >= star ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-slate-200 bg-white text-slate-400'
                              }`}
                            >
                              <Star className="w-4.5 h-4.5 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Communication Vector</label>
                        <div className="flex gap-1.5 items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setCommRating(star)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                commRating >= star ? 'border-pink-300 bg-pink-50 text-pink-600' : 'border-slate-200 bg-white text-slate-400'
                              }`}
                            >
                              <Star className="w-4.5 h-4.5 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Evaluation Feedback Comments</label>
                      <textarea
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        placeholder="Write structured feedback logs here..."
                        rows={4}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-50"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg shadow-pink-600/10 cursor-pointer"
                      >
                        Submit Evaluation
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            )}

            {/* TAB 9: RESOURCE SHARING */}
            {activeTab === 'resources' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Depository */}
                  <div className="lg:col-span-8 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5 text-xs">
                    <h2 className="text-sm font-bold text-slate-900">Resource Sharing Ledger Depository</h2>
                    
                    <div className="space-y-3">
                      {resources.map((res) => (
                        <div key={res.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                              <FileText className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900">{res.title}</h4>
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">{res.category} • {res.size}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{res.uploadedAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Share form */}
                  <div className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Upload Shared Resource</h3>
                    
                    <form onSubmit={handleAddResource} className="space-y-4 font-semibold text-slate-700">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Resource Title</label>
                        <input
                          type="text"
                          value={newResourceTitle}
                          onChange={(e) => setNewResourceTitle(e.target.value)}
                          placeholder="e.g. Stripe mock API documentation"
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                        <select
                          value={newResourceCategory}
                          onChange={(e) => setNewResourceCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-bold"
                        >
                          <option value="PDFs">PDFs</option>
                          <option value="Notes">Notes</option>
                          <option value="Videos">Videos</option>
                          <option value="Coding Problems">Coding Problems</option>
                          <option value="Prep Kits">Prep Kits</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 10: PROFILE & PREFERENCE SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in text-left">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Profile Info Metadata */}
                  <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-xs space-y-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white text-xl shadow-md shadow-pink-200">
                        SJ
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900">Sarah Jenkins</h2>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Designation: Principal Software Engineer</p>
                        <p className="text-[10px] text-pink-600 font-bold uppercase tracking-wider mt-1.5">DEPARTMENT: SOURCING PIPELINES</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-slate-600 font-semibold">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Corporate Email</span>
                        <p className="text-slate-800 font-bold">sarah.jenkins@stripe.com</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Office Hours</span>
                        <p className="text-slate-800 font-bold">Mon, Wed, Fri (4:00 - 6:00 PM)</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Contact Number</span>
                        <p className="text-slate-800 font-bold">+1 (555) 019-2834</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Core Expertise</span>
                        <p className="text-slate-800 font-bold">React, Web API, Cosine Vectors</p>
                      </div>
                    </div>

                    {/* Availability Switch */}
                    <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-slate-800">Live Availability Ticker Status</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Show active booking slot scheduler to assigned cohorts.</p>
                      </div>
                      <button
                        onClick={() => {
                          setAvailabilitySwitch(!availabilitySwitch);
                          triggerToast(availabilitySwitch ? 'Availability status turned OFF' : 'Availability status turned ON');
                        }}
                        className={`w-12 h-6.5 rounded-full p-1 transition-colors flex items-center ${
                          availabilitySwitch ? 'bg-pink-600 justify-end' : 'bg-slate-200 justify-start'
                        }`}
                      >
                        <span className="w-4.5 h-4.5 rounded-full bg-white shadow"></span>
                      </button>
                    </div>
                  </div>

                  {/* Preference control panel */}
                  <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-xs space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Preference Control Panel</h3>
                    
                    <div className="space-y-4 font-semibold text-slate-700">
                      
                      {/* Language Selection */}
                      <div className="flex justify-between items-center">
                        <span>System Language</span>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => {
                            setSelectedLanguage(e.target.value);
                            triggerToast(`Language updated to ${e.target.value}`);
                          }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-slate-50 font-bold"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>

                      {/* Push Alerts Switch */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div>
                          <span>Message Push Alerts</span>
                          <span className="text-[9px] text-slate-400 block font-normal mt-0.5">Send alerts for submissions & review queues.</span>
                        </div>
                        <button
                          onClick={() => {
                            setPushAlerts(!pushAlerts);
                            triggerToast(pushAlerts ? 'Alerts muted' : 'Alerts enabled');
                          }}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                            pushAlerts ? 'bg-pink-600 justify-end' : 'bg-slate-200 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white shadow"></span>
                        </button>
                      </div>

                      {/* Dark Mode Switch */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div>
                          <span>Force System Dark Mode</span>
                          <span className="text-[9px] text-slate-400 block font-normal mt-0.5">Enforce high-contrast dark theme canvas.</span>
                        </div>
                        <button
                          onClick={() => {
                            setDarkMode(!darkMode);
                            triggerToast(darkMode ? 'Dark theme disabled' : 'Dark theme enabled');
                          }}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                            darkMode ? 'bg-pink-600 justify-end' : 'bg-slate-200 justify-start'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white shadow"></span>
                        </button>
                      </div>

                      {/* Password reset action */}
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() => triggerToast('Password reset link dispatched.')}
                          className="w-full py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-slate-400" />
                          <span>Request Password Reset</span>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

          </main>

        </div>

        {/* Schedule Mock Session Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-in text-left">
              
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-600" />
                  <span>Create Session Slot</span>
                </h3>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-750 hover:bg-slate-150 transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateSession} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Student</label>
                  <select
                    value={newSessionStudent}
                    onChange={(e) => setNewSessionStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-50 font-bold"
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.college})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Session Category</label>
                  <select
                    value={newSessionType}
                    onChange={(e) => setNewSessionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500 bg-slate-50 font-bold"
                  >
                    <option value="Frontend Architecture Mock">Frontend Architecture Mock</option>
                    <option value="System Design Review">System Design Review</option>
                    <option value="DSA Mock Session">DSA Mock Session</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Meeting Time</label>
                    <input
                      type="text"
                      value={newSessionTime}
                      onChange={(e) => setNewSessionTime(e.target.value)}
                      placeholder="e.g. 4:00 PM - 5:00 PM"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="text"
                      value={newSessionDate}
                      onChange={(e) => setNewSessionDate(e.target.value)}
                      placeholder="e.g. Today, Tomorrow, 28 Jun"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg shadow-pink-600/10 cursor-pointer"
                  >
                    Schedule Session
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Add Assignment Task Modal */}
        {showAddTaskModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in text-xs font-semibold text-slate-700">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-left animate-slide-in">
              
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-600" />
                  <span>Assign New Task</span>
                </h3>
                <button 
                  onClick={() => setShowAddTaskModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Name / Deliverable</label>
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g. Design token integration layout"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assign Student</label>
                  <select
                    value={newTaskStudent}
                    onChange={(e) => setNewTaskStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 font-bold"
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.college})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg shadow-pink-600/10 cursor-pointer"
                  >
                    Assign Task
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

// ─── Simple Wrapper for CpuIcon because Cpu lucide component was missing ───
const CpuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
  </svg>
);
