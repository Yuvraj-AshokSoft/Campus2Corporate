import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Award, 
  Clock, 
  Mail, 
  Phone, 
  GraduationCap, 
  Search, 
  Sparkles, 
  Plus, 
  PlayCircle, 
  X, 
  ChevronDown, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

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
}

interface Session {
  id: string;
  studentName: string;
  type: string;
  time: string;
  date: string;
  badgeColor: string;
  actionLabel: string;
}

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
    phone: '+91 98765 43210'
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
    phone: '+91 98765 43211'
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    college: 'BITS Pilani',
    role: 'Software Engineer (Backend)',
    company: 'Vercel',
    progress: 78,
    matchScore: 85,
    avatar: 'RG',
    avatarBg: 'bg-violet-600',
    email: 'rohan.gupta@bits.edu',
    phone: '+91 98765 43212'
  },
  {
    id: '4',
    name: 'Divya Iyer',
    college: 'IIT Madras',
    role: 'Data Scientist',
    company: 'Google',
    progress: 90,
    matchScore: 92,
    avatar: 'DI',
    avatarBg: 'bg-amber-600',
    email: 'divya.iyer@iitm.ac.in',
    phone: '+91 98765 43213'
  }
];

const upcomingSessionsList: Session[] = [
  {
    id: 's1',
    studentName: 'Arjun Mehta',
    type: 'Frontend Architecture Mock',
    time: '4:00 PM - 5:00 PM',
    date: 'Today',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-100/80',
    actionLabel: 'Start Interview'
  },
  {
    id: 's2',
    studentName: 'Priya Sharma',
    type: 'System Design Review',
    time: '2:30 PM - 3:30 PM',
    date: 'Tomorrow',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100/80',
    actionLabel: 'Open Rubric'
  },
  {
    id: 's3',
    studentName: 'Rohan Gupta',
    type: 'DSA Mock Session',
    time: '10:00 AM - 11:00 AM',
    date: '28 Jun',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-105',
    actionLabel: 'Reschedule'
  }
];

export const MentorDashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [students] = useState<Student[]>(initialStudents);
  const [sessions, setSessions] = useState<Session[]>(upcomingSessionsList);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New session state parameters
  const [newSessionStudent, setNewSessionStudent] = useState('');
  const [newSessionType, setNewSessionType] = useState('Frontend Architecture Mock');
  const [newSessionTime, setNewSessionTime] = useState('11:00 AM - 12:00 PM');
  const [newSessionDate, setNewSessionDate] = useState('Today');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionStudent) {
      triggerToast("Please select a student for the session");
      return;
    }
    const newSession: Session = {
      id: `s_${Date.now()}`,
      studentName: newSessionStudent,
      type: newSessionType,
      time: newSessionTime,
      date: newSessionDate,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-100/80',
      actionLabel: 'Start Interview'
    };
    setSessions([newSession, ...sessions]);
    setShowScheduleModal(false);
    triggerToast(`Scheduled session with ${newSessionStudent} successfully!`);
    // Reset state
    setNewSessionStudent('');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 text-slate-800 antialiased font-sans">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-[99999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-800 animate-slide-in">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mentor Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-700">Sarah Jenkins</span> 👋
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative self-stretch sm:self-auto">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition-all w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-pink-200">
                SJ
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 leading-tight">Principal SE • Stripe</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-[9999]">  
                <div className="p-3 border-b border-slate-100">
                  <h3 className="font-semibold text-sm text-slate-950">Sarah Jenkins</h3>
                  <p className="text-xs text-slate-500">sarah.jenkins@example.com</p>
                </div>
                {['My Profile', 'Assigned Cohorts', 'Rubrics & Logs', 'Settings'].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => {
                      setShowDropdown(false);
                      triggerToast(`Navigating to ${item}...`);
                    }} 
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Active Mentees', val: students.length, bg: 'bg-blue-50/50', text: 'text-blue-700', border: 'border-blue-100/50', icon: Users },
            { label: 'Completed Mock Interviews', val: '48', bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-100/50', icon: Award },
            { label: 'Pending Profile Reviews', val: '5', bg: 'bg-amber-50/50', text: 'text-amber-700', border: 'border-amber-100/50', icon: Clock }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-2xl border bg-white shadow-sm flex items-center justify-between`}>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-black mt-2 ${stat.text}`}>{stat.val}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.text} border ${stat.border}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </section>

        {/* Main Grid: Student Roster (Left) & Session Calendar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Student Roster List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              
              {/* Roster Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Assigned Students Roster</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Track student progress, match scores, and review portfolios.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4.5 w-4.5 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search name or college..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200/80 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Roster Table / List */}
              <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No students found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div 
                      key={student.id} 
                      className={`p-4 rounded-xl border border-slate-100 bg-white hover:border-pink-200 hover:shadow-md transition-all duration-300 group ${
                        selectedStudent?.id === student.id ? 'ring-2 ring-pink-500/20 border-pink-300' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        {/* Student Main Details */}
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${student.avatarBg}`}>
                            {student.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{student.name}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100/50">
                                Match: {student.matchScore}%
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 font-medium">
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5" /> {student.college}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700">{student.role}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress and Actions */}
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="w-32 sm:w-28 text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Readiness</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-pink-500 h-full rounded-full" style={{ width: `${student.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-700 font-mono">{student.progress}%</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                            className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 hover:text-pink-500 transition-colors"
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${selectedStudent?.id === student.id ? 'rotate-90 text-pink-500' : ''}`} />
                          </button>
                        </div>

                      </div>

                      {/* Extended Profile Info */}
                      {selectedStudent?.id === student.id && (
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-slate-50/50 p-3 rounded-lg animate-fade-in">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <a href={`mailto:${student.email}`} className="hover:underline">{student.email}</a>
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <a href={`tel:${student.phone}`} className="hover:underline">{student.phone}</a>
                            </p>
                          </div>
                          <div className="space-y-2.5">
                            <p className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-pink-400" />
                              <span>Target Placement: <strong className="text-slate-800">{student.company}</strong></span>
                            </p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => triggerToast(`Reviewing resume portfolio for ${student.name}...`)}
                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold transition-all text-[10px]"
                              >
                                Review Resume
                              </button>
                              <button 
                                onClick={() => {
                                  setNewSessionStudent(student.name);
                                  setShowScheduleModal(true);
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold transition-all text-[10px]"
                              >
                                Schedule Session
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Session Calendar & Action Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upcoming Sessions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Mock panels and advisory syncs.</p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-100 flex items-center justify-center text-pink-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Sessions List */}
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{session.studentName}</h3>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{session.type}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200">
                        {session.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.time}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (session.actionLabel === 'Start Interview') {
                            triggerToast(`Starting AI-Proctored Mock Interview room for ${session.studentName}...`);
                          } else if (session.actionLabel === 'Open Rubric') {
                            triggerToast(`Opening score review Rubric for ${session.studentName}...`);
                          } else {
                            triggerToast(`Reschedule requested for session with ${session.studentName}.`);
                          }
                        }}
                        className="inline-flex items-center gap-1 font-bold text-pink-600 hover:text-pink-700 text-xs transition-colors cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {session.actionLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Simulated Live Activity Ticker (Ecosystem Pulse) */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ecosystem Activity Logs</span>
              </div>
              <div className="space-y-3.5 font-semibold text-xs leading-relaxed text-slate-300">
                <p>💡 <span className="text-slate-400 font-normal">Sarah Jenkins approved 3 resume reviews for</span> Arjun Mehta</p>
                <p>💼 <span className="text-slate-400 font-normal">Stripe recruitment pipeline sync:</span> DTU Cohort SE-L4 active</p>
                <p>🏆 <span className="text-slate-400 font-normal">Priya Sharma matched</span> Atlassian pipeline (88% Cosine Similarity)</p>
              </div>
            </div>
          </div>

        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-in">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  <span>Schedule Mentor Session</span>
                </h3>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleAddSession} className="p-5 space-y-4">
                
                {/* Student Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Student</label>
                  <select
                    value={newSessionStudent}
                    onChange={(e) => setNewSessionStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-slate-50 font-medium"
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.college})</option>
                    ))}
                  </select>
                </div>

                {/* Session Type Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session Category</label>
                  <select
                    value={newSessionType}
                    onChange={(e) => setNewSessionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-slate-50 font-medium"
                  >
                    <option value="Frontend Architecture Mock">Frontend Architecture Mock</option>
                    <option value="System Design Review">System Design Review</option>
                    <option value="DSA Mock Session">DSA Mock Session</option>
                    <option value="General Portfolio Guidance">General Portfolio Guidance</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Time Range */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session Time</label>
                    <input
                      type="text"
                      value={newSessionTime}
                      onChange={(e) => setNewSessionTime(e.target.value)}
                      placeholder="e.g. 4:00 PM - 5:00 PM"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-slate-50 font-medium"
                      required
                    />
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Session Date</label>
                    <input
                      type="text"
                      value={newSessionDate}
                      onChange={(e) => setNewSessionDate(e.target.value)}
                      placeholder="e.g. Today, Tomorrow, 29 Jun"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-slate-50 font-medium"
                      required
                    />
                  </div>

                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-600/10 hover:shadow-pink-600/20 transition-all cursor-pointer"
                  >
                    Create Session
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
