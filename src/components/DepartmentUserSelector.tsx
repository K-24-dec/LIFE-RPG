import React, { useState } from 'react';
import { GOVERNMENT_DEPARTMENTS, MOCK_DEPARTMENT_USERS } from '../data/departmentData';
import { DepartmentUser, DepartmentRole } from '../types/department';
import {
  ShieldCheck,
  Building2,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';

interface DepartmentUserSelectorProps {
  currentUser: DepartmentUser;
  onSelectUser: (user: DepartmentUser) => void;
  selectedDepartmentId: string;
  onSelectDepartmentId: (deptId: string) => void;
}

export const DepartmentUserSelector: React.FC<DepartmentUserSelectorProps> = ({
  currentUser,
  onSelectUser,
  selectedDepartmentId,
  onSelectDepartmentId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentDept = GOVERNMENT_DEPARTMENTS.find((d) => d.id === selectedDepartmentId) || GOVERNMENT_DEPARTMENTS[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-md transition-all border border-slate-700/80 cursor-pointer"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
          GOI
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-extrabold">{currentDept.code}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="text-white truncate max-w-[140px] md:max-w-[180px]">{currentDept.name}</span>
          </div>
          <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>{currentUser.role}</span>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-4 text-xs space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Government Portal Switcher</h4>
                  <p className="text-[10px] text-slate-500">Role-Based Access Control (RBAC)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase">
                Active Portal
              </span>
            </div>

            {/* Department Selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Select Active Department
              </label>
              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    onSelectDepartmentId('all');
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                    selectedDepartmentId === 'all'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-bold">National Master Secretariat (All Departments)</span>
                  {selectedDepartmentId === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>

                {GOVERNMENT_DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      onSelectDepartmentId(dept.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      selectedDepartmentId === dept.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{dept.name}</div>
                      <div className="text-[10px] opacity-80">{dept.hindiName}</div>
                    </div>
                    {selectedDepartmentId === dept.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* User Role Switching */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Switch Officer Profile & RBAC Persona
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {MOCK_DEPARTMENT_USERS.map((usr) => (
                  <button
                    key={usr.id}
                    onClick={() => {
                      onSelectUser(usr);
                      onSelectDepartmentId(usr.departmentId);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl border transition-all flex items-center gap-2.5 ${
                      currentUser.id === usr.id
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs truncate">{usr.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{usr.role}</span> • <span className="font-mono text-emerald-400">{usr.badgeNumber}</span>
                      </div>
                    </div>
                    {currentUser.id === usr.id && <UserCheck className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
