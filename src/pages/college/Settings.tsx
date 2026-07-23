import { useAuth } from "../../context/AuthContext";
import CollegeLayout from "../../components/college/CollegeLayout";

import { Icon, type IconName } from "../../components/college/CollegeIcons";

const sidebarItems = [
  { label: "Dashboard", icon: "dashboard" as IconName, route: "/college-dashboard" },
  { label: "Student Management", icon: "users" as IconName, route: "/college/students-management" },
  { label: "Recruiter Management", icon: "building" as IconName, route: "/college/recruiter-management" },
  { label: "Placement Statistics", icon: "briefcase" as IconName, route: "/college/placement-statistics", badge: 5 },
  { label: "Notifications", icon: "bell" as IconName, route: "/college/notifications", badge: 3 },
  { label: "Profile", icon: "settings" as IconName, route: "/college/profile" },
  { label: "Setting", icon: "settings" as IconName, route: "/college/setting" },
];

export const CollegeSettings = () => {
  const { currentUser } = useAuth();
  const fullName = currentUser?.fullName || "BITS Pilani Placement Cell Admin";

  return (
    <CollegeLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Setting"
      userSummary={{ fullName, role: "Training & Placement Officer", status: "Placement cycle active" }}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-black text-slate-900">Placement Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure AI automated pipelines, verification parameters, and alerts.</p>
        </div>

        {/* Configurations List */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Icon name="sparkles" className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Placement Coaching</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Enable interactive mock interview simulations and coaching for eligible students.</p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-purple-55 border border-purple-100 bg-purple-50 text-purple-700 text-xs font-bold">Enabled</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon name="shield" className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Proctored Aptitude Auditing</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Enforce automated verification of coding tasks and project repositories.</p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold">Active</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Icon name="plug" className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recruiter Sync Webhooks</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Automatically sync shortlisted students to enterprise ATS partners.</p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">Connected</button>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
};

export default CollegeSettings;
