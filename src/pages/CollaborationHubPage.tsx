import React, { useState } from 'react';
import { FullProjectSubmission, InterDeptCollaborationRequest } from '../types/department';
import {
  Users,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Building2,
  ChevronRight,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface CollaborationHubPageProps {
  projects: FullProjectSubmission[];
  onOpenProjectDetails: (project: FullProjectSubmission) => void;
}

export const CollaborationHubPage: React.FC<CollaborationHubPageProps> = ({
  projects,
  onOpenProjectDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'requests' | 'meetings'>('pipeline');

  // Extract all collaboration requests from all projects
  const allRequests: InterDeptCollaborationRequest[] = projects.flatMap((p) => p.collaborationRequests || []);

  const stages = [
    'Department Review',
    'AI Validation',
    'Conflict Resolution',
    'Budget Approval',
    'Final Approval',
    'Execution',
  ];

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Users className="w-4 h-4 text-indigo-400" /> Cross-Department Inter-Agency Coordination
          </div>
          <h1 className="text-2xl font-black text-white">Multi-Department Collaboration Hub</h1>
          <p className="text-xs text-slate-300">
            Real-time inter-ministry clearance pipeline, right-of-way NOC requests, and joint trenching coordination
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto text-xs font-bold rounded-2xl">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'pipeline'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitPullRequest className="w-4 h-4" /> Multi-Stage Project Pipeline Board
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'requests'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-600" /> Inter-Dept Clearance Requests ({allRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'meetings'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600" /> Joint Coordination Meetings
        </button>
      </div>

      {/* TAB 1: KANBAN STAGE PIPELINE BOARD */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto">
          {stages.map((stg) => {
            const stageProjects = projects.filter((p) => p.status === stg);

            return (
              <div key={stg} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3 min-w-[200px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-extrabold text-slate-900 text-xs truncate">{stg}</h3>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-black text-[10px]">
                    {stageProjects.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {stageProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onOpenProjectDetails(proj)}
                      className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 shadow-2xs cursor-pointer transition-all space-y-1.5 text-xs"
                    >
                      <div className="font-mono text-[10px] text-emerald-700 font-bold">{proj.projectIdCode}</div>
                      <div className="font-extrabold text-slate-900 leading-snug line-clamp-2">{proj.name}</div>
                      <div className="text-[10px] text-slate-500">{proj.departmentName}</div>
                      <div className="text-[10px] text-emerald-700 font-extrabold">₹{proj.estimatedCostCrores} Cr</div>
                    </div>
                  ))}
                  {stageProjects.length === 0 && (
                    <div className="text-center py-6 text-[10px] text-slate-400">No active projects in this stage.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INTER-DEPT CLEARANCE REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {allRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {req.requestType}
                  </span>
                  <span className="text-xs font-bold text-amber-700 uppercase">Urgency: {req.urgency}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{req.projectTitle}</h4>
                <p className="text-xs text-slate-600">
                  From: <strong className="text-slate-900">{req.requestingDepartment}</strong> → To:{' '}
                  <strong className="text-slate-900">{req.targetDepartment}</strong>
                </p>
                <div className="text-xs text-slate-500 mt-1">{req.details}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: JOINT MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">AI Suggested Multi-Ministry Joint Excavation Meetings</h3>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 text-xs text-indigo-950">
            <div className="font-bold">Next Recommended Meeting: Aug 05, 2026 at 11:00 AM IST</div>
            <div>Stakeholders: Road Transport, Jal Shakti Water, GAIL Gas, Power Grid</div>
            <p className="text-slate-600">Agenda: Synchronize NH-16 service road trenching and 450mm feeder pipeline shifting to avoid double excavation along Dadri corridor.</p>
          </div>
        </div>
      )}
    </div>
  );
};
