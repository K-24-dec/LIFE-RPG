import React, { useState } from 'react';
import { FullProjectSubmission, ProjectComment, ApprovalStage } from '../types/department';
import { Underground3DDigitalTwin } from './Underground3DDigitalTwin';
import { MOCK_UNDERGROUND_ASSETS } from '../data/undergroundData';
import {
  X,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  FileText,
  MessageSquare,
  History,
  Send,
  Download,
  ShieldCheck,
  Check,
  Clock,
  Zap,
  Droplets,
  Flame,
  Radio,
  FileCheck2,
  UserCheck,
} from 'lucide-react';

interface ProjectDetailsModalProps {
  project: FullProjectSubmission | null;
  onClose: () => void;
  onUpdateProject?: (updated: FullProjectSubmission) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
  onUpdateProject,
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'map_subsurface' | 'conflicts' | 'comments' | 'approval_history'>('overview');
  const [commentText, setCommentText] = useState('');
  const [targetMention, setTargetMention] = useState('All Departments');

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: ProjectComment = {
      id: `cmt-${Date.now()}`,
      projectId: project.id,
      userId: 'usr-current',
      userName: 'Active Officer',
      userRole: 'Department Admin',
      departmentName: project.departmentName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      text: commentText,
      mentionedDepartments: targetMention !== 'All Departments' ? [targetMention] : [],
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const updatedProject: FullProjectSubmission = {
      ...project,
      comments: [newComment, ...project.comments],
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setCommentText('');
  };

  const handleStageAdvance = (nextStage: ApprovalStage) => {
    const newHistoryItem = {
      id: `app-${Date.now()}`,
      stage: nextStage,
      departmentName: project.departmentName,
      actionBy: 'Officer In-Charge',
      actionByRole: 'Department Admin' as const,
      status: 'Approved' as const,
      remarks: `Advanced project workflow stage to ${nextStage}.`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedProject: FullProjectSubmission = {
      ...project,
      status: nextStage,
      approvalHistory: [newHistoryItem, ...project.approvalHistory],
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
  };

  const stagesSequence: ApprovalStage[] = [
    'Draft',
    'Department Review',
    'AI Validation',
    'Conflict Resolution',
    'Budget Approval',
    'Final Approval',
    'Execution',
    'Completed',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 text-white flex items-start justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                {project.projectIdCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-extrabold">
                {project.departmentName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase">
                Stage: {project.status}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">{project.name}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{project.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Stages Progress Bar */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 shrink-0 overflow-x-auto">
          <div className="flex items-center min-w-max gap-2 text-[10px] font-extrabold">
            {stagesSequence.map((stg, idx) => {
              const currentIdx = stagesSequence.indexOf(project.status);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={stg} className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStageAdvance(stg)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : isPast
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : isCurrent ? (
                      <Sparkles className="w-3 h-3 text-white animate-spin" />
                    ) : (
                      <Clock className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{stg}</span>
                  </button>
                  {idx < stagesSequence.length - 1 && <span className="text-slate-300 font-bold">→</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-5 pt-3 flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Summary & Financials
          </button>

          <button
            onClick={() => setActiveTab('map_subsurface')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'map_subsurface'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> 3D Sub-surface Map
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'conflicts'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" /> AI Cross-Dept Analysis
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'comments'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" /> Inter-Dept Discussions ({project.comments.length})
          </button>

          <button
            onClick={() => setActiveTab('approval_history')}
            className={`pb-3 border-b-2 px-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'approval_history'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4 text-amber-600" /> Audit Trail & History
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
          {/* TAB 1: SUMMARY & FINANCIALS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase">Estimated Cost</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">₹{project.estimatedCostCrores} Cr</div>
                  <div className="text-[10px] text-slate-500">Allocated: ₹{project.allocatedBudgetCrores} Cr</div>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-extrabold uppercase">AI Savings Realized</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">₹{project.expectedSavingsCrores} Cr</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Joint Execution</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-extrabold uppercase">Completion Progress</div>
                  <div className="text-xl font-black text-slate-900 mt-0.5">{project.completionPercentage}%</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${project.completionPercentage}%` }} />
                  </div>
                </div>

                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
                  <div className="text-[10px] text-indigo-800 font-extrabold uppercase">AI Priority Score</div>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{project.aiAnalysis?.priorityScore || 92}/100</div>
                  <div className="text-[10px] text-indigo-600 font-bold">High Master Priority</div>
                </div>
              </div>

              {/* Location & Resource Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Geographic Location Details
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <div>State: <strong className="text-slate-900">{project.state}</strong></div>
                    <div>District: <strong className="text-slate-900">{project.district}</strong></div>
                    <div>City / Village: <strong className="text-slate-900">{project.city} {project.village ? `(${project.village})` : ''}</strong></div>
                    <div>Coordinates: <strong className="font-mono text-sky-700">{project.lat}, {project.lng}</strong></div>
                    <div>Project Buffer Radius: <strong className="text-slate-900">{project.boundaryRadiusMeters} meters</strong></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> Resources & Contractor
                  </h4>
                  <div className="space-y-1 text-slate-600">
                    <div>Contractor: <strong className="text-slate-900">{project.resources.contractorName}</strong></div>
                    <div>Funding Source: <strong className="text-slate-900">{project.fundingSource}</strong></div>
                    <div>Manpower On-Site: <strong className="text-slate-900">{project.resources.labourCount} Workers</strong></div>
                    <div>Machinery Deployed: <span className="font-medium text-slate-800">{project.resources.machineryRequired.join(', ')}</span></div>
                  </div>
                </div>
              </div>

              {/* Underground Utilities Checkboxes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Sub-surface Underground Utilities Present
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Water Pipeline', active: project.undergroundChecklist.waterPipeline, icon: Droplets },
                    { label: 'Gas Pipeline', active: project.undergroundChecklist.gasPipeline, icon: Flame },
                    { label: 'Electric Power Line', active: project.undergroundChecklist.electricCable, icon: Zap },
                    { label: 'Fiber Cable', active: project.undergroundChecklist.fiberCable, icon: Radio },
                  ].map((ut, idx) => {
                    const Icon = ut.icon;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold ${
                          ut.active
                            ? 'bg-white border-emerald-300 text-emerald-900 shadow-2xs'
                            : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${ut.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{ut.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D MAP & SUB-SURFACE */}
          {activeTab === 'map_subsurface' && (
            <div className="space-y-4">
              <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200">
                <Underground3DDigitalTwin
                  assets={MOCK_UNDERGROUND_ASSETS}
                  highlightClashes={true}
                />
              </div>
            </div>
          )}

          {/* TAB 3: CROSS-DEPARTMENT CONFLICTS */}
          {activeTab === 'conflicts' && (
            <div className="space-y-4">
              {project.aiAnalysis ? (
                <div className="space-y-4">
                  {/* Affected Departments */}
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                    <h4 className="font-black text-indigo-950 text-xs uppercase">
                      Affected Stakeholder Departments
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.aiAnalysis.affectedDepartments.map((dept, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-indigo-200 rounded-xl text-indigo-900 font-extrabold text-xs shadow-2xs">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Underground Clashes */}
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                    <h4 className="font-black text-rose-950 text-xs uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Detected Sub-surface Utility Clashes
                    </h4>
                    <div className="space-y-2">
                      {project.aiAnalysis.undergroundUtilityCollisions.map((col, idx) => (
                        <div key={idx} className="p-3 bg-white border border-rose-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900">{col.utility}</div>
                            <div className="text-[10px] text-slate-500">Depth Layer: -{col.depthMeters} meters</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                            {col.risk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <h4 className="font-black text-emerald-950 text-xs uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> AI Master Plan Recommendations
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                      {project.aiAnalysis.aiRecommendations.map((rec, idx) => (
                        <li key={idx} className="leading-relaxed font-medium">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No AI conflict report generated yet.</div>
              )}
            </div>
          )}

          {/* TAB 4: INTER-DEPARTMENT DISCUSSIONS & COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs">Post Inter-Department Comment or @Mention</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tag Department:</span>
                    <select
                      value={targetMention}
                      onChange={(e) => setTargetMention(e.target.value)}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      <option value="All Departments">@All Departments</option>
                      <option value="Water Supply Department (Jal Shakti)">@Water Supply (Jal Shakti)</option>
                      <option value="Gas Pipeline Authority (GAIL Grid)">@Gas Pipeline Authority</option>
                      <option value="Electricity & Power Grid Department">@Electricity & Power Grid</option>
                      <option value="Fiber Optic & BharatNet Authority">@Fiber Optic & BharatNet</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type technical notes, clearance remarks, or request coordinate shift..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 text-xs"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Remark
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3">
                {project.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{comment.userName}</div>
                          <div className="text-[10px] text-slate-500">{comment.departmentName} • {comment.userRole}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-10 font-medium">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT TRAIL & APPROVAL HISTORY */}
          {activeTab === 'approval_history' && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Official Government Approval Audit History
              </h4>
              <div className="space-y-2">
                {project.approvalHistory.map((hist) => (
                  <div key={hist.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{hist.stage}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                          {hist.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">{hist.remarks}</div>
                      <div className="text-[10px] text-slate-400">By: {hist.actionBy} ({hist.departmentName})</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{hist.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
