import React from 'react';
import { Layers } from 'lucide-react';
import { DepartmentUserSelector } from './DepartmentUserSelector';
import { DepartmentUser } from '../types/department';

interface NavbarProps {
  currentUser: DepartmentUser;
  onSelectUser: (user: DepartmentUser) => void;
  selectedDepartmentId: string;
  onSelectDepartmentId: (deptId: string) => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  selectedDepartmentId,
  onSelectDepartmentId,
  onNavigateHome,
}) => {
  return (
    <header className="relative h-16 bg-white border-b border-emerald-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs backdrop-blur-md">
      {/* Official Government Tricolour Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Brand & Title */}
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 shadow-md text-white ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
          <Layers className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
              Gati<span className="text-emerald-600">AI</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
              भारत सरकार | GOI
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold hidden sm:block">
            PM Gati Shakti Multi-Modal Infrastructure Portal
          </p>
        </div>
      </button>

      {/* Right side: Department Selector & Persona Switcher */}
      <div className="flex items-center gap-3">
        <DepartmentUserSelector
          currentUser={currentUser}
          onSelectUser={onSelectUser}
          selectedDepartmentId={selectedDepartmentId}
          onSelectDepartmentId={onSelectDepartmentId}
        />
      </div>
    </header>
  );
};
