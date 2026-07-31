import React from "react";
import { Search, Plus, HelpCircle, Menu } from "lucide-react";

interface CollegeHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickActionClick: () => void;
  onOpenMobileSidebar?: () => void;
  userName?: string;
  userRole?: string;
}

export const CollegeHeader: React.FC<CollegeHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onQuickActionClick,
  onOpenMobileSidebar,
  userName = "Dr. Sarah Jenkins",
  userRole = "Chief TPO & Admin",
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left section: Mobile menu toggle & title context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold tracking-wider text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/60">
              Campus Governance
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search insights..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs md:text-sm pl-10 pr-4 py-2 rounded-full border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right controls: Quick Add (+), Help (?), Profile Avatar (AD) */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Add Button (+) */}
        <button
          onClick={onQuickActionClick}
          title="Quick Action"
          className="w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Help Button (?) */}
        <button
          title="Help & Documentation"
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar (AD) */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200/80">
          <div className="relative cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all">
              AD
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {userName}
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              {userRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
