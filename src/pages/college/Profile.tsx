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

export const CollegeProfile = () => {
  const { currentUser } = useAuth();
  const fullName = currentUser?.fullName || "BITS Pilani Placement Cell Admin";
  const email = currentUser?.email || "placement@pilani.bits-pilani.ac.in";
  const phone = currentUser?.phone || "+91 9876543210";

  return (
    <CollegeLayout
      sidebarItems={sidebarItems}
      sidebarHighlight="Profile"
      userSummary={{ fullName, role: "Training & Placement Officer", status: "Placement cycle active" }}
    >
      <div className="space-y-6">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] opacity-60 [background-size:18px_18px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
              BP
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">BITS Pilani, Pilani Campus</h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">Training and Placement Division</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5"><Icon name="map-pin" className="h-3.5 w-3.5 text-blue-500" /> Rajasthan, India</span>
                <span className="flex items-center gap-1.5"><Icon name="graduation" className="h-3.5 w-3.5 text-indigo-500" /> Tier-1 Institute</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Admin info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-4">Placement Office Contacts</h2>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3">
                <Icon name="mail" className="h-4.5 w-4.5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-700">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="phone" className="h-4.5 w-4.5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phone Number</p>
                  <p className="font-semibold text-slate-700">{phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-4">Key Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Branches</p>
                <p className="text-2xl font-black text-slate-950 mt-1">12</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Verified Skills</p>
                <p className="text-2xl font-black text-slate-950 mt-1">94%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollegeLayout>
  );
};

export default CollegeProfile;
