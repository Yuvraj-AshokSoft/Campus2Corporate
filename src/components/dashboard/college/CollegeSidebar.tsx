import React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Building,
  FileText,
  TrendingUp,
  AlertTriangle,
  LineChart,
  BarChart2,
  CheckSquare,
  UserCheck,
  FileBarChart,
  MessageSquare,
  Settings,
  Plus,
  Sparkles
} from "lucide-react";

export type ViewType =
  | "dashboard"
  | "students"
  | "departments"
  | "placement-cell"
  | "companies"
  | "jobs"
  | "readiness"
  | "at-risk"
  | "forecast"
  | "comparisons"
  | "assessments"
  | "mentors"
  | "reports"
  | "communications"
  | "settings";

interface CollegeSidebarProps {
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  onNewDriveClick: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface MenuItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const CORE_MENU: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "departments", label: "Departments", icon: Building2 },
  { id: "placement-cell", label: "Placement Cell", icon: Briefcase },
  { id: "companies", label: "Companies", icon: Building },
  { id: "jobs", label: "Jobs", icon: FileText },
  { id: "readiness", label: "Readiness", icon: TrendingUp },
  { id: "at-risk", label: "At Risk", icon: AlertTriangle, badge: "8", badgeColor: "bg-amber-100 text-amber-700" },
];

const ANALYTICS_MENU: MenuItem[] = [
  { id: "forecast", label: "Forecast", icon: LineChart },
  { id: "comparisons", label: "Comparisons", icon: BarChart2 },
  { id: "assessments", label: "Assessments", icon: CheckSquare },
  { id: "mentors", label: "Mentors", icon: UserCheck },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export const CollegeSidebar: React.FC<CollegeSidebarProps> = ({
  activeView,
  onSelectView,
  onNewDriveClick,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const handleItemClick = (id: ViewType) => {
    onSelectView(id);
    if (onCloseMobile) onCloseMobile();
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;

    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all group cursor-pointer ${
          isActive
            ? "bg-purple-100/80 text-purple-700 font-semibold shadow-xs"
            : "text-slate-600 hover:bg-purple-50/60 hover:text-purple-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-1 rounded-lg transition-colors ${
              isActive
                ? "text-purple-700"
                : "text-slate-400 group-hover:text-purple-600"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span>{item.label}</span>
        </div>

        {item.badge ? (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              item.badgeColor || "bg-purple-100 text-purple-700"
            }`}
          >
            {item.badge}
          </span>
        ) : isActive ? (
          <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
        ) : null}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-200 pr-1">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900 bg-clip-text text-transparent">
                  C2C
                </span>
                <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-1">
                  College Dashboard
                </span>
              </div>
            </div>

            <div className="lg:hidden">
              <button
                onClick={onCloseMobile}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Core Menu */}
          <div className="space-y-1">
            {CORE_MENU.map(renderMenuItem)}
          </div>

          {/* Analytics Category */}
          <div className="pt-2">
            <div className="px-3 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                Analytics
              </span>
            </div>
            <div className="space-y-1">
              {ANALYTICS_MENU.map(renderMenuItem)}
            </div>
          </div>
        </div>

        {/* Primary Action Button CTA */}
        <div className="pt-4 border-t border-slate-100 bg-white">
          <button
            onClick={onNewDriveClick}
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer text-xs md:text-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Placement Drive</span>
          </button>
        </div>
      </aside>
    </>
  );
};
