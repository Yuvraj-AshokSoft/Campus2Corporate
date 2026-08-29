import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  Award,
  Calendar as CalendarIcon,
  Download,
  Search,
  MoreVertical,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';

export const PlacementOversight: React.FC = () => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [searchDriveQuery, setSearchDriveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState({
    activeDrives: 0,
    participatingColleges: 0,
    totalApplicants: 0,
    offersExtended: 0,
  });

  const [drives, setDrives] = useState<any[]>([]);

  const fetchPlacementData = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getPlacementOversight();
      if (data) {
        setSummary(data.summary || { activeDrives: 0, participatingColleges: 0, totalApplicants: 0, offersExtended: 0 });
        setDrives(data.drives || []);
      }
    } catch (error) {
      console.error('Failed to load placement oversight:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      !searchDriveQuery.trim() ||
      d.title?.toLowerCase().includes(searchDriveQuery.toLowerCase()) ||
      d.company?.name?.toLowerCase().includes(searchDriveQuery.toLowerCase());
    return matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Drive ID,Title,Company,Location,Mode,Openings,Applicants,Status\n';
    const rows = filteredDrives.map(
      (d) =>
        `"${d._id}","${d.title}","${d.company?.name || 'N/A'}","${d.location}","${d.mode}","${d.openings}","${d.applicantsCount || 0}","${d.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `C2C_Placement_Drives_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans text-slate-800 pb-12">
      {/* Header Banner & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Placement Oversight</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Master control for all ongoing and upcoming placement drives and candidate pipelines.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchPlacementData}
            disabled={isLoading}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Drives Report</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Tiles (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              <span>Active Drives</span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {isLoading ? '...' : summary.activeDrives.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Participating Colleges</span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {isLoading ? '...' : summary.participatingColleges.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Total Applications</span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {isLoading ? '...' : summary.totalApplicants.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Offers Extended / Selected</span>
            </div>
            <p className="text-2xl font-black text-slate-900">
              {isLoading ? '...' : summary.offersExtended.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Active Drives Oversight Table */}
      <div className="bg-white rounded-2xl border border-purple-100/70 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Active Placement Drives Oversight</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Filter drives or companies..."
              value={searchDriveQuery}
              onChange={(e) => setSearchDriveQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#6D28D9] animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading active placement drives...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Drive Title</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Location / Mode</th>
                  <th className="py-3.5 px-4">Stipend</th>
                  <th className="py-3.5 px-4 font-mono">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrives.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                      No placement drives recorded in database.
                    </td>
                  </tr>
                ) : (
                  filteredDrives.map((drive) => (
                    <tr key={drive._id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{drive.title}</td>
                      <td className="py-3.5 px-4 font-bold text-purple-700">
                        {drive.company?.name || 'Corporate Partner'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {drive.location} ({drive.mode})
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">${drive.stipend}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {drive.applicantsCount || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            drive.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {drive.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            drive.approvalStatus === 'Approved'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : drive.approvalStatus === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {drive.approvalStatus || 'Approved'}
                        </span>
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

export default PlacementOversight;
