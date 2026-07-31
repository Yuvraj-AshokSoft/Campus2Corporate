import React from "react";

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">College Settings & Governance Rules</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage institution credentials, automated placement policies, and API keys.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-lg">
            A
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Apex Institute of Technology & Engineering</h2>
            <p className="text-xs text-slate-500 font-medium">AISHE Code: C-41209 • Autonomous Status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Placement Policy Cut-off GPA</label>
            <input type="text" defaultValue="6.5 CGPA" className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Maximum Allowed Offers Per Candidate</label>
            <input type="text" defaultValue="2 Active Offers" className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
