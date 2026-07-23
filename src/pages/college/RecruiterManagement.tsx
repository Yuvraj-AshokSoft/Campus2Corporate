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

export const CollegeRecruiterManagement = () => {
  const { currentUser } = useAuth();
  const fullName = currentUser?.fullName || "BITS Pilani Placement Cell Admin";

  const recruiters = [
    { name: "Google", domain: "Tech / Software", activeDrives: 2, placementRate: "88%", status: "Onboarded" },
    { name: "Microsoft", domain: "Tech / Cloud", activeDrives: 1, placementRate: "82%", status: "Onboarded" },
    { name: "TCS", domain: "IT / Services", activeDrives: 1, placementRate: "65%", status: "In-Progress" },
    { name: "Infosys", domain: "IT / Services", activeDrives: 1, placementRate: "70%", status: "Upcoming" },
  ];

  return (
    <CollegeLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Recruiter Management"
      userSummary={{ fullName, role: "Training & Placement Officer", status: "Placement cycle active" }}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Recruiter Management</h1>
            <p className="text-sm text-slate-500 mt-1">Coordinate placement drives and audit metrics with enterprise hiring partners.</p>
          </div>
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Recruiters Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500 border-collapse">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Company Name</th>
                  <th className="px-6 py-4">Industry Domain</th>
                  <th className="px-6 py-4">Active Drives</th>
                  <th className="px-6 py-4">Placement Rate</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {recruiters.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-extrabold">
                        {rec.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{rec.name}</span>
                    </td>
                    <td className="px-6 py-4">{rec.domain}</td>
                    <td className="px-6 py-4">{rec.activeDrives}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{rec.placementRate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === "Onboarded" ? "bg-emerald-50 text-emerald-700" :
                        rec.status === "In-Progress" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
};

export default CollegeRecruiterManagement;
