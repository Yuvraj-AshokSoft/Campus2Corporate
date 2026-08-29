import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  Trash2,
  Ban,
  Eye,
  CheckCircle2,
  Building,
  Briefcase,
  GraduationCap,
  Loader2,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const UserManagement: React.FC = () => {
  const [activeRoleTab, setActiveRoleTab] = useState<'students' | 'colleges' | 'recruiters'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Data collections
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);

  // Modal / Detail state
  const [selectedItemDetail, setSelectedItemDetail] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      if (activeRoleTab === 'students') {
        const res = await adminApi.getStudents({
          page: currentPage,
          limit: 10,
          q: searchQuery.trim(),
          status: selectedStatusFilter,
        });
        if (res) {
          setStudents(res.students || []);
          setTotalPages(res.totalPages || 1);
          setTotalEntries(res.total || 0);
        }
      } else if (activeRoleTab === 'colleges') {
        const res = await adminApi.getColleges({
          page: currentPage,
          limit: 10,
          q: searchQuery.trim(),
          status: selectedStatusFilter,
        });
        if (res) {
          setColleges(res.colleges || []);
          setTotalPages(res.totalPages || 1);
          setTotalEntries(res.total || 0);
        }
      } else if (activeRoleTab === 'recruiters') {
        const res = await adminApi.getRecruiters({
          page: currentPage,
          limit: 10,
          q: searchQuery.trim(),
          status: selectedStatusFilter,
        });
        if (res) {
          setRecruiters(res.recruiters || []);
          setTotalPages(res.totalPages || 1);
          setTotalEntries(res.total || 0);
        }
      }
    } catch (error: any) {
      console.error('Failed to load user directory:', error);
      triggerToast('⚠️ Error loading records from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRoleTab, currentPage, selectedStatusFilter]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  // Toggle status
  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    try {
      if (activeRoleTab === 'students') {
        await adminApi.updateStudentStatus(item._id, newStatus);
      } else if (activeRoleTab === 'colleges') {
        await adminApi.updateCollegeStatus(item._id, newStatus);
      } else if (activeRoleTab === 'recruiters') {
        await adminApi.updateRecruiterStatus(item._id, newStatus);
      }
      triggerToast(`✅ Status updated to ${newStatus} for ${item.name || item.email}`);
      fetchUsers();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Delete item
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      if (activeRoleTab === 'students') {
        await adminApi.deleteStudent(id);
      } else if (activeRoleTab === 'colleges') {
        await adminApi.deleteCollege(id);
      } else if (activeRoleTab === 'recruiters') {
        await adminApi.deleteRecruiter(id);
      }
      triggerToast(`🗑️ Successfully deleted record: ${name}`);
      fetchUsers();
    } catch (err: any) {
      triggerToast(err.response?.data?.message || 'Failed to delete record');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let rows: any[] = [];
    let headers = '';

    if (activeRoleTab === 'students') {
      headers = 'ID,Name,Email,College,Branch,Percentage,Status\n';
      rows = students.map((s) => `"${s._id}","${s.name}","${s.email}","${s.college?.name || 'N/A'}","${s.branch || 'N/A'}","${s.percentage || 0}%","${s.status}"`);
    } else if (activeRoleTab === 'colleges') {
      headers = 'ID,Name,Email,Code,City,State,Verification,Status\n';
      rows = colleges.map((c) => `"${c._id}","${c.name}","${c.email}","${c.code || ''}","${c.city || ''}","${c.state || ''}","${c.verificationStatus}","${c.status}"`);
    } else {
      headers = 'ID,Name,Email,Company,Designation,Status\n';
      rows = recruiters.map((r) => `"${r._id}","${r.name}","${r.email}","${r.company?.name || 'N/A'}","${r.designation}","${r.status}"`);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `C2C_${activeRoleTab}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`📥 Exported ${rows.length} ${activeRoleTab} records.`);
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

      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User & Institution Management</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Master directory oversight for Students, Partner Colleges, and Corporate Recruiters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 focus:border-[#6D28D9] shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </form>
          <button
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Role Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100/70 pb-3">
        {[
          { id: 'students' as const, label: 'Students', icon: GraduationCap },
          { id: 'colleges' as const, label: 'Colleges', icon: Building },
          { id: 'recruiters' as const, label: 'Recruiters', icon: Briefcase },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeRoleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveRoleTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#6D28D9] text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-500 bg-white hover:bg-purple-50 hover:text-purple-900 border border-slate-200/60'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Toolbar & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100/70 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Master Directory Data Table */}
      <div className="bg-white rounded-2xl border border-purple-100/70 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading {activeRoleTab} directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* STUDENTS TABLE */}
            {activeRoleTab === 'students' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">College / Branch</th>
                    <th className="py-3.5 px-4">Percentage</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    students.map((row) => (
                      <tr key={row._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{row.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{row.email}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{row.college?.name || 'Direct Candidate'}</p>
                          <p className="text-[10px] text-slate-400">{row.branch || 'General'}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {row.percentage ? `${row.percentage}%` : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedItemDetail(row)}
                              className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(row)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                              title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row._id, row.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* COLLEGES TABLE */}
            {activeRoleTab === 'colleges' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">College Name</th>
                    <th className="py-3.5 px-4">Code / City</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {colleges.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        No colleges found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    colleges.map((row) => (
                      <tr key={row._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {row.name}
                          <p className="text-[10px] text-slate-400 font-normal">{row.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-purple-700">{row.code || 'N/A'}</span>
                          <p className="text-[10px] text-slate-400">{row.city || 'N/A'}, {row.state || ''}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.phone}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.verificationStatus === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {row.verificationStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedItemDetail(row)}
                              className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(row)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                              title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row._id, row.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* RECRUITERS TABLE */}
            {activeRoleTab === 'recruiters' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">Recruiter</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recruiters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                        No recruiters found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    recruiters.map((row) => (
                      <tr key={row._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{row.name}</p>
                          <p className="text-[10px] text-slate-400">{row.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-purple-700">
                          {row.company?.name || 'Independent Partner'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.designation}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.verificationStatus === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {row.verificationStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedItemDetail(row)}
                              className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(row)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                              title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row._id, row.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Showing page {currentPage} of {totalPages} ({totalEntries} total entries)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-[#6D28D9] text-white rounded-lg font-bold">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Item Detail Inspector Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-purple-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Inspection</h3>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl font-mono">
              <pre className="overflow-x-auto text-[11px] text-slate-700">
                {JSON.stringify(selectedItemDetail, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 bg-[#6D28D9] text-white font-bold rounded-xl text-xs hover:bg-[#5B21B6] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
