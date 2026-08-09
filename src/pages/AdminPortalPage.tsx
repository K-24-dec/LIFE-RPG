import React, { useState } from 'react';
import { GOVERNMENT_DEPARTMENTS, MOCK_DEPARTMENT_USERS } from '../data/departmentData';
import { FullProjectSubmission, DepartmentUser, DepartmentRole } from '../types/department';
import {
  ShieldCheck,
  Building2,
  Users,
  FileCheck2,
  Lock,
  Plus,
  CheckCircle2,
  History,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

interface AdminPortalPageProps {
  projects: FullProjectSubmission[];
  currentUser: DepartmentUser;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ projects, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'departments' | 'users_rbac' | 'audit_logs'>('departments');

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Super Admin Governance Portal
          </div>
          <h1 className="text-2xl font-black text-white">National Master Plan Admin Control</h1>
          <p className="text-xs text-slate-300">
            Manage government departments, user roles, RBAC matrix, and system security audit logs
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto text-xs font-bold rounded-2xl">
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'departments'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Government Departments ({GOVERNMENT_DEPARTMENTS.length})
        </button>

        <button
          onClick={() => setActiveTab('users_rbac')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users_rbac'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" /> Users & RBAC Permissions Matrix
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit_logs'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-amber-600" /> System Security Audit Trail
        </button>
      </div>

      {/* TAB 1: DEPARTMENTS LIST */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GOVERNMENT_DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {dept.code}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{dept.name}</h3>
                  <div className="text-xs text-slate-500">{dept.hindiName}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">Budget Allocated</div>
                  <div className="text-sm font-black text-emerald-600">₹{dept.allocatedBudgetCrores} Cr</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>Head: <strong className="text-slate-900">{dept.headName}</strong></div>
                <div>Email: <span className="font-mono text-emerald-700">{dept.email}</span></div>
                <div>Phone: <span className="font-mono text-slate-800">{dept.phone}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: USERS & RBAC MATRIX */}
      {activeTab === 'users_rbac' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Role-Based Access Control (RBAC) Permissions Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-bold">Role</th>
                    <th className="p-2.5 font-bold">Create Projects</th>
                    <th className="p-2.5 font-bold">Approve Stage</th>
                    <th className="p-2.5 font-bold">Post Comments</th>
                    <th className="p-2.5 font-bold">AI Analysis</th>
                    <th className="p-2.5 font-bold">Super Admin Config</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-2.5 font-bold text-amber-700">Super Admin</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Full Control</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-emerald-700">Department Admin</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Dept Level</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-rose-500">❌ No</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-700">Project Manager</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-rose-500">❌ Review Only</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-emerald-600">✔ Yes</td>
                    <td className="p-2.5 text-rose-500">❌ No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm">System Audit Log</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
              <div>[2026-08-01 14:30:11] USER: Smt. Kavitha Reddy (Jal Shakti) &rarr; POSTED comment on GATIAI-NH16-TRENCH-2026</div>
              <span className="text-emerald-600 font-bold">200 OK</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
              <div>[2026-08-01 11:05:00] GATIAI AI ENGINE &rarr; EXECUTED 3D Sub-surface collision scan on GATIAI-NH16-TRENCH-2026</div>
              <span className="text-emerald-600 font-bold">200 OK</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
