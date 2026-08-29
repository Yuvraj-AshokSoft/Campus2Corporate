import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const VerificationQueue: React.FC = () => {
  const [activeQueueTab, setActiveQueueTab] = useState<'colleges' | 'recruiters' | 'projects'>('colleges');
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    colleges: 0,
    recruiters: 0,
    projects: 0,
    totalPending: 0,
  });

  const [colleges, setColleges] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getVerificationQueue();
      if (data) {
        setCounts(data.counts || { colleges: 0, recruiters: 0, projects: 0, totalPending: 0 });
        setColleges(data.colleges || []);
        setRecruiters(data.recruiters || []);
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to load verification queue:', error);
      triggerToast('⚠️ Unable to fetch verification queue from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerifyCollege = async (id: string, name: string) => {
    try {
      await adminApi.verifyCollege(id, 'Verified', 'Approved by Admin');
      triggerToast(`✅ College "${name}" has been verified and approved.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Verification failed.');
    }
  };

  const handleRejectCollege = async (id: string, name: string) => {
    const reason = window.prompt(`Please provide a rejection note for ${name}:`, 'Documents insufficient');
    if (reason === null) return;

    try {
      await adminApi.verifyCollege(id, 'Rejected', reason);
      triggerToast(`❌ College "${name}" has been rejected.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Rejection failed.');
    }
  };

  const handleVerifyRecruiter = async (id: string, name: string) => {
    try {
      await adminApi.verifyRecruiter(id, 'Verified', 'Approved by Admin');
      triggerToast(`✅ Recruiter "${name}" has been verified and approved.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Verification failed.');
    }
  };

  const handleRejectRecruiter = async (id: string, name: string) => {
    const reason = window.prompt(`Please provide a rejection note for ${name}:`, 'Corporate email mismatch');
    if (reason === null) return;

    try {
      await adminApi.verifyRecruiter(id, 'Rejected', reason);
      triggerToast(`❌ Recruiter "${name}" has been rejected.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Rejection failed.');
    }
  };

  const handleApproveProject = async (id: string, title: string) => {
    try {
      await adminApi.approveProject(id);
      triggerToast(`✅ Drive "${title}" approved and published.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Approval failed.');
    }
  };

  const handleRejectProject = async (id: string, title: string) => {
    try {
      await adminApi.rejectProject(id);
      triggerToast(`❌ Drive "${title}" rejected.`);
      fetchQueue();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-800 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Admin &gt; Oversight &gt; Verification Queue
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Verification Queue</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage and audit pending institutional approvals, recruiters, and placement drives.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          disabled={isLoading}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-purple-700 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Queue Filter Pills */}
      <div className="flex items-center gap-3 border-b border-purple-100/70 pb-3">
        {[
          { id: 'colleges' as const, label: 'Pending Colleges', count: counts.colleges },
          { id: 'recruiters' as const, label: 'Pending Recruiters', count: counts.recruiters },
          { id: 'projects' as const, label: 'Pending Drives / Jobs', count: counts.projects },
        ].map((pill) => {
          const isActive = activeQueueTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveQueueTab(pill.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#6D28D9] text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200/60'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Split Layout: Left Summary & Right Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Queue Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Queue Summary</h3>
            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Colleges Waiting</span>
                <span className="font-mono text-purple-700 font-extrabold">{counts.colleges}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Recruiters Waiting</span>
                <span className="font-mono text-purple-700 font-extrabold">{counts.recruiters}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Drives Pending</span>
                <span className="font-mono text-purple-700 font-extrabold">{counts.projects}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Total Action Items</span>
                <span className="font-mono text-emerald-600 font-extrabold">{counts.totalPending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Cards Feed */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="p-12 bg-white rounded-2xl border border-purple-100/70 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin" />
              <p className="text-xs font-bold text-slate-500">Loading pending items from database...</p>
            </div>
          ) : (
            <>
              {/* COLLEGES QUEUE */}
              {activeQueueTab === 'colleges' && (
                <div className="space-y-4">
                  {colleges.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-purple-100/70 text-center text-slate-400 font-bold text-xs">
                      🎉 No pending college verifications in the queue.
                    </div>
                  ) : (
                    colleges.map((college) => (
                      <div
                        key={college._id}
                        className="bg-white rounded-2xl p-6 border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-base font-black text-slate-900">{college.name}</h3>
                            <p className="text-xs text-slate-400 font-medium">
                              Code: {college.code || 'N/A'} • {college.email} • {college.phone}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold self-start">
                            Pending Review
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p><span className="font-bold">University:</span> {college.university || 'Not Specified'}</p>
                          <p><span className="font-bold">Location:</span> {college.city || 'N/A'}, {college.state || 'N/A'}</p>
                          {college.website && (
                            <a
                              href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-700 hover:underline flex items-center gap-1 font-bold pt-1"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleRejectCollege(college._id, college.name)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs border border-red-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleVerifyCollege(college._id, college.name)}
                            className="px-4 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-white" />
                            <span>Quick Verify & Approve</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* RECRUITERS QUEUE */}
              {activeQueueTab === 'recruiters' && (
                <div className="space-y-4">
                  {recruiters.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-purple-100/70 text-center text-slate-400 font-bold text-xs">
                      🎉 No pending recruiter verifications in the queue.
                    </div>
                  ) : (
                    recruiters.map((recruiter) => (
                      <div
                        key={recruiter._id}
                        className="bg-white rounded-2xl p-6 border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-base font-black text-slate-900">{recruiter.name}</h3>
                            <p className="text-xs text-slate-400 font-medium">
                              {recruiter.designation} • {recruiter.email} • {recruiter.phone}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold self-start">
                            Pending Review
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p><span className="font-bold">Company:</span> {recruiter.company?.name || 'Independent'}</p>
                          <p><span className="font-bold">Industry:</span> {recruiter.company?.industry || 'Technology'}</p>
                          {recruiter.linkedin && (
                            <a
                              href={recruiter.linkedin.startsWith('http') ? recruiter.linkedin : `https://${recruiter.linkedin}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-700 hover:underline flex items-center gap-1 font-bold pt-1"
                            >
                              <span>LinkedIn Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleRejectRecruiter(recruiter._id, recruiter.name)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs border border-red-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleVerifyRecruiter(recruiter._id, recruiter.name)}
                            className="px-4 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-white" />
                            <span>Quick Verify & Approve</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROJECTS QUEUE */}
              {activeQueueTab === 'projects' && (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="p-12 bg-white rounded-2xl border border-purple-100/70 text-center text-slate-400 font-bold text-xs">
                      🎉 No pending drives or job postings awaiting approval.
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white rounded-2xl p-6 border border-purple-100/80 hover:border-purple-300 transition-all shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-base font-black text-slate-900">{project.title}</h3>
                            <p className="text-xs text-slate-400 font-medium">
                              Company: {project.company?.name || 'N/A'} • Recruiter: {project.recruiter?.name || 'N/A'}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold self-start">
                            Pending Approval
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <p><span className="font-bold">Description:</span> {project.description}</p>
                          <p><span className="font-bold">Location & Mode:</span> {project.location} ({project.mode})</p>
                          <p><span className="font-bold">Stipend / Package:</span> ${project.stipend}</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => handleRejectProject(project._id, project.title)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs border border-red-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveProject(project._id, project.title)}
                            className="px-4 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Approve & Publish</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationQueue;
