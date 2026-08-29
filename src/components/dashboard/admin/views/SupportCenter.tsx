import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Send,
  Lock,
  Search,
  Filter,
  Plus,
  Loader2,
  RefreshCw,
  X,
  UserCheck
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const SupportCenter: React.FC = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [metrics, setMetrics] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // New Ticket Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRequesterName, setNewRequesterName] = useState('');
  const [newRequesterEmail, setNewRequesterEmail] = useState('');
  const [newRequesterRole, setNewRequesterRole] = useState('Student');
  const [newPriority, setNewPriority] = useState('Standard');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSupportTickets({
        priority: selectedPriorityFilter,
        status: selectedStatusFilter,
        q: searchQuery.trim(),
      });
      if (data) {
        setMetrics(data.metrics || { open: 0, inProgress: 0, resolved: 0 });
        setTickets(data.tickets || []);

        if (data.tickets && data.tickets.length > 0 && !selectedTicketId) {
          setSelectedTicketId(data.tickets[0]._id);
          setSelectedTicket(data.tickets[0]);
        } else if (selectedTicketId) {
          const fresh = data.tickets?.find((t: any) => t._id === selectedTicketId);
          if (fresh) setSelectedTicket(fresh);
        }
      }
    } catch (error) {
      console.error('Failed to load support tickets:', error);
      triggerToast('⚠️ Unable to fetch tickets from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedPriorityFilter, selectedStatusFilter]);

  const handleSelectTicket = (t: any) => {
    setSelectedTicketId(t._id);
    setSelectedTicket(t);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket?._id) return;

    setIsSendingReply(true);
    try {
      const updated = await adminApi.replySupportTicket(selectedTicket._id, replyText.trim(), isInternalNote);
      setSelectedTicket(updated);
      setReplyText('');
      triggerToast(isInternalNote ? '📝 Internal note recorded.' : '💬 Reply sent to requester.');
      fetchTickets();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket?._id) return;
    try {
      const updated = await adminApi.updateSupportTicketStatus(selectedTicket._id, 'Resolved');
      setSelectedTicket(updated);
      triggerToast(`✅ Ticket #${selectedTicket.ticketId} marked as Resolved.`);
      fetchTickets();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to resolve ticket');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newRequesterName.trim() || !newRequesterEmail.trim()) return;

    try {
      await adminApi.createSupportTicket({
        title: newTitle.trim(),
        description: newDescription.trim(),
        requesterName: newRequesterName.trim(),
        requesterEmail: newRequesterEmail.trim(),
        requesterRole: newRequesterRole,
        priority: newPriority,
      });
      triggerToast('🎉 Support ticket created successfully.');
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewRequesterName('');
      setNewRequesterEmail('');
      fetchTickets();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner Header & Metric Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support Desk & Inquiries</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Resolve student disputes, recruiter access requests, and institutional inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
          <button
            onClick={fetchTickets}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Open Tickets</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{metrics.open}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">In Progress</span>
            <p className="text-2xl font-black text-purple-700 mt-1">{metrics.inProgress}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Resolved</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{metrics.resolved}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Split Ticket Workplace: Left List & Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tickets Directory */}
        <div className="bg-white rounded-2xl border border-purple-100/70 shadow-xs overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket ID or requester..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <select
                value={selectedPriorityFilter}
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">Priority: All</option>
                <option value="Standard">Standard</option>
                <option value="Escalated">Escalated</option>
                <option value="Critical Priority">Critical</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold text-xs">
                No tickets matching current filters.
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleSelectTicket(t)}
                  className={`p-4 hover:bg-purple-50/40 cursor-pointer transition-colors ${
                    selectedTicket?._id === t._id ? 'bg-purple-50/70 border-l-4 border-[#6D28D9]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-700 text-xs">#{t.ticketId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'In Progress'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{t.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.requesterName} ({t.requesterRole})
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Resolution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-100/70 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#6D28D9] text-xs">#{selectedTicket.ticketId}</span>
                    <h3 className="text-sm font-black text-slate-900">{selectedTicket.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Requester: <span className="font-bold text-slate-700">{selectedTicket.requesterName}</span> ({selectedTicket.requesterEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={handleResolveTicket}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Original Dispute / Request
                  </span>
                  <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>

                {selectedTicket.messages?.map((msg: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-1 ${
                      msg.isInternalNote
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : msg.senderRole === 'Admin' || msg.senderRole === 'Super Admin'
                        ? 'bg-purple-50/70 border-purple-200 text-purple-950 ml-8'
                        : 'bg-white border-slate-200 text-slate-800 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <div className="flex items-center gap-1.5">
                        {msg.isInternalNote && <Lock className="w-3 h-3 text-amber-700" />}
                        <span>{msg.senderName} ({msg.senderRole})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-3">
                <textarea
                  rows={3}
                  placeholder={
                    isInternalNote
                      ? 'Type internal note for admin staff (invisible to user)...'
                      : 'Type response to user inquiry...'
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 resize-none"
                  required
                ></textarea>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-slate-300 text-[#6D28D9] focus:ring-[#6D28D9]"
                    />
                    <span>Post as Internal Staff Note</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-4 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-70"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternalNote ? 'Save Note' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-bold text-slate-400">
              Select a ticket from the left panel to inspect thread and reply.
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-purple-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">Ticket Title</label>
                <input
                  type="text"
                  placeholder="e.g. Recruiter Company Verification Issue"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500">Requester Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newRequesterName}
                    onChange={(e) => setNewRequesterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500">Requester Email</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={newRequesterEmail}
                    onChange={(e) => setNewRequesterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500">Requester Role</label>
                  <select
                    value={newRequesterRole}
                    onChange={(e) => setNewRequesterRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="College">College</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Mentor">Mentor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Critical Priority">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  rows={4}
                  placeholder="Details of inquiry or dispute..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold rounded-xl text-xs shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCenter;
