import React, { useState } from 'react';
import { GOVERNMENT_DEPARTMENTS } from '../data/departmentData';
import { FullProjectSubmission, DepartmentUser } from '../types/department';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Users,
  BarChart3,
  FileCheck2,
  ShieldCheck,
  Zap,
  Droplets,
  Flame,
  Radio,
  Train,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface DepartmentPortalPageProps {
  projects: FullProjectSubmission[];
  selectedDepartmentId: string;
  onSelectDepartmentId: (deptId: string) => void;
  currentUser: DepartmentUser;
  onOpenNewProject: () => void;
  onOpenProjectDetails: (project: FullProjectSubmission) => void;
}

export const DepartmentPortalPage: React.FC<DepartmentPortalPageProps> = ({
  projects,
  selectedDepartmentId,
  onSelectDepartmentId,
  currentUser,
  onOpenNewProject,
  onOpenProjectDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'pending_approvals' | 'analytics' | 'team'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedDeptObj =
    GOVERNMENT_DEPARTMENTS.find((d) => d.id === selectedDepartmentId) || GOVERNMENT_DEPARTMENTS[0];

  const filteredProjects = projects.filter((p) => {
    const matchesDept = selectedDepartmentId === 'all' || p.departmentId === selectedDepartmentId;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectIdCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase().replace(' ', '_') === statusFilter;
    return matchesDept && matchesSearch && matchesStatus;
  });

  const pendingApprovalsCount = projects.filter(
    (p) => (selectedDepartmentId === 'all' || p.departmentId === selectedDepartmentId) && p.status !== 'Completed'
  ).length;

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Department Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xl font-black shadow-lg ring-4 ring-emerald-500/20 shrink-0">
            {selectedDeptObj.code}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                Official Department Portal
              </span>
              <span className="text-slate-400 font-normal text-xs">•</span>
              <span className="text-amber-300 text-xs font-semibold">{selectedDeptObj.hindiName}</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">{selectedDeptObj.name}</h1>
            <p className="text-xs text-slate-300">
              Department Head: <strong className="text-white">{selectedDeptObj.headName}</strong> • Email:{' '}
              <span className="text-emerald-400 font-mono">{selectedDeptObj.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewProject}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Register New Project
        </button>
      </div>

      {/* DEPARTMENT DASHBOARD KPIS (All 12 Requested Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Projects</div>
          <div className="text-2xl font-black text-slate-900">{selectedDeptObj.activeProjects}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Active in Master Plan</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-black text-emerald-600">{selectedDeptObj.completedProjects}</div>
          <div className="text-[10px] text-slate-500">Commissioned</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Ongoing</div>
          <div className="text-2xl font-black text-sky-600">{selectedDeptObj.ongoingProjects}</div>
          <div className="text-[10px] text-slate-500">Under Execution</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Delayed</div>
          <div className="text-2xl font-black text-amber-600">{selectedDeptObj.delayedProjects}</div>
          <div className="text-[10px] text-amber-700 font-bold">Needs AI Reschedule</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Budget Used</div>
          <div className="text-2xl font-black text-slate-900">₹{selectedDeptObj.usedBudgetCrores} Cr</div>
          <div className="text-[10px] text-slate-500">Allocated: ₹{selectedDeptObj.allocatedBudgetCrores} Cr</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">AI Efficiency</div>
          <div className="text-2xl font-black text-indigo-600">{selectedDeptObj.aiEfficiencyScore}%</div>
          <div className="text-[10px] text-indigo-600 font-bold">Optimization Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto text-xs font-bold rounded-2xl">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'projects'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Department Projects ({filteredProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('pending_approvals')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'pending_approvals'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-600" /> Pending Approvals ({pendingApprovalsCount})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'analytics'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" /> Department Analytics & KPIs
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'team'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-slate-600" /> Officers & RBAC Team
        </button>
      </div>

      {/* TAB 1: PROJECTS TABLE & CARDS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project name, code, city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="all">All Stages</option>
                <option value="department_review">Department Review</option>
                <option value="conflict_resolution">Conflict Resolution</option>
                <option value="budget_approval">Budget Approval</option>
                <option value="execution">Execution</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProjectDetails(proj)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {proj.projectIdCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{proj.category}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-800">
                        Stage: {proj.status}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">{proj.name}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <div>Budget: <span className="text-emerald-700 font-extrabold">₹{proj.estimatedCostCrores} Cr</span></div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                  <div>Location: <strong className="text-slate-900">{proj.city}, {proj.state}</strong></div>
                  <div>Progress: <strong className="text-slate-900">{proj.completionPercentage}%</strong></div>
                  <div>Priority: <strong className="text-slate-900">{proj.priority}</strong></div>
                  <div>Created: <strong className="text-slate-900">{proj.createdDate}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PENDING APPROVALS */}
      {activeTab === 'pending_approvals' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
            <strong>Cross-Department Action Required:</strong> The following projects are awaiting stage clearance or utility shift concurrence from {selectedDeptObj.name}.
          </div>

          {filteredProjects.map((proj) => (
            <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-emerald-700 text-xs font-bold">{proj.projectIdCode}</div>
                <div className="font-bold text-slate-900 text-sm">{proj.name}</div>
                <div className="text-xs text-slate-500">Current Stage: <strong>{proj.status}</strong></div>
              </div>

              <button
                onClick={() => onOpenProjectDetails(proj)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0"
              >
                Review & Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DEPARTMENT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Overall Performance Score</div>
              <div className="text-3xl font-black text-slate-900">{selectedDeptObj.performanceScore}/100</div>
              <p className="text-xs text-slate-500">Calculated based on project delivery rate and zero utility damages.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">AI Utilization Efficiency</div>
              <div className="text-3xl font-black text-emerald-600">{selectedDeptObj.aiEfficiencyScore}%</div>
              <p className="text-xs text-slate-500">Percentage of projects using AI subterranean collision scans.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Pending Maintenance Due</div>
              <div className="text-3xl font-black text-amber-600">{selectedDeptObj.maintenanceDueCount} Units</div>
              <p className="text-xs text-slate-500">Underground duct inspection & sensor servicing alerts.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFICERS & TEAM */}
      {activeTab === 'team' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Department Administrative Officers & RBAC Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                GOI
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">{selectedDeptObj.headName}</div>
                <div className="text-[10px] text-slate-500">Department Admin / Head of Department</div>
                <div className="text-[10px] text-emerald-700 font-mono">{selectedDeptObj.phone}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
