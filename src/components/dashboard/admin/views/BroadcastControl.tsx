import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Send,
  Save,
  Building2,
  CheckCircle2,
  Trash2,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const BroadcastControl: React.FC = () => {
  const [targetAudience, setTargetAudience] = useState('all_students');
  const [priorityLevel, setPriorityLevel] = useState('standard');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchBroadcasts = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await adminApi.getBroadcasts({ limit: 20 });
      if (data && data.broadcasts) {
        setBroadcasts(data.broadcasts);
      }
    } catch (error) {
      console.error('Failed to load broadcasts:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !messageContent.trim()) return;

    setIsSending(true);
    try {
      await adminApi.createBroadcast({
        title: broadcastTitle.trim(),
        message: messageContent.trim(),
        targetAudience,
        priority: priorityLevel,
        status: 'Delivered',
      });
      triggerToast('🎉 Platform Broadcast dispatched successfully to target audience!');
      setBroadcastTitle('');
      setMessageContent('');
      fetchBroadcasts();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete broadcast "${title}"?`)) return;
    try {
      await adminApi.deleteBroadcast(id);
      triggerToast('🗑️ Broadcast removed from history.');
      fetchBroadcasts();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to delete broadcast');
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

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Broadcast & Communication Center</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Issue platform-wide announcements, emergency notices, and monitor delivery logs.
        </p>
      </div>

      {/* Main Grid: Left Composer & Right College Oversight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Composer Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-purple-100/70 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm border-b border-purple-50 pb-3">
            <Send className="w-4 h-4" />
            <h2>Send Platform-Wide Broadcast</h2>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs font-bold text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 cursor-pointer"
                >
                  <option value="all_students">All Registered Students (Global)</option>
                  <option value="all_colleges">All Partner Institutions</option>
                  <option value="all_recruiters">All Corporate Recruiters</option>
                  <option value="mentors">Mentors & Advisors</option>
                  <option value="all">Entire Platform (All Roles)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                  Priority Level
                </label>
                <select
                  value={priorityLevel}
                  onChange={(e) => setPriorityLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 cursor-pointer"
                >
                  <option value="standard">Standard Notification</option>
                  <option value="high">High Priority Banner</option>
                  <option value="urgent">Urgent System Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                Broadcast Title
              </label>
              <input
                type="text"
                placeholder="e.g. Q3 Placement Guidelines Released"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
                Message Content
              </label>
              <textarea
                rows={5}
                placeholder="Compose announcement message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 resize-none"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-70"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4 fill-white" />
                    <span>Broadcast Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Broadcast Notice Info */}
        <div className="bg-white rounded-2xl p-6 border border-purple-100/70 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="w-4 h-4 text-purple-700" />
              <h3>Broadcast Guidelines</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Platform-wide broadcasts are delivered instantly to candidate dashboards and notification centers.
            </p>

            <div className="space-y-3 pt-4 text-xs text-slate-600">
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                <p className="font-bold text-purple-900">High Priority</p>
                <p className="text-[11px] text-purple-700 mt-0.5">Displays persistent top banner on target user portals.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="font-bold text-slate-900">Standard Notification</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Appears in notification dropdown and email digest.</p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchBroadcasts}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Broadcast Logs</span>
          </button>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-2xl border border-purple-100/70 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Broadcast Delivery History</h3>
          <span className="text-xs font-bold text-slate-400">{broadcasts.length} entries</span>
        </div>

        {isLoadingHistory ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#6D28D9] animate-spin" />
            <span className="text-xs text-slate-400 font-bold">Loading broadcast history...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Target Audience</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Dispatched At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      No broadcast announcements recorded yet.
                    </td>
                  </tr>
                ) : (
                  broadcasts.map((row) => (
                    <tr key={row._id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.title}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">{row.targetAudience}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            row.priority === 'urgent'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : row.priority === 'high'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(row.sentAt || row.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(row._id, row.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Broadcast"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastControl;
