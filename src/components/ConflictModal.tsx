import React, { useState } from 'react';
import { ConflictZone } from '../types';
import {
  ShieldAlert,
  X,
  AlertTriangle,
  CheckCircle2,
  Trees,
  Waves,
  Building2,
  Zap,
  Plane,
  Sparkles,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Clock,
  ShieldCheck,
  Bot,
} from 'lucide-react';

interface ConflictModalProps {
  conflicts: ConflictZone[];
  routeName: string;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({ conflicts, routeName, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inspections' | 'resolution'>('resolution');
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'forest':
        return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'river':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'urban':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      case 'utility_corridor':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'airport_buffer':
        return <Plane className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  const executionSteps = [
    {
      step: 'Step 1',
      dept: 'Jal Shakti & Utility Authority',
      title: 'Water Pipeline & Canal Relocation',
      duration: '12 Days',
      status: 'Pre-Approved',
      details: 'Relocate feeder pipe 15 meters east prior to heavy ground excavation.',
    },
    {
      step: 'Step 2',
      dept: 'MoEFCC & Forestry Department',
      title: 'Elevated Eco-Duct Viaduct Construction',
      duration: '25 Days',
      status: 'Zero Forest Cut',
      details: 'Erect pre-cast concrete piers over 2.8 km tiger migration buffer.',
    },
    {
      step: 'Step 3',
      dept: 'Telecom & BSNL Corridor',
      title: 'Optical Fiber Duct Underground Trenching',
      duration: '8 Days',
      status: 'Synchronized',
      details: 'Lay utility ducts simultaneously within roadway shoulder to avoid future re-digging.',
    },
    {
      step: 'Step 4',
      dept: 'NHID / Railways Authority',
      title: 'Final Surface Paving & Signal Calibration',
      duration: '15 Days',
      status: 'Ready',
      details: 'Lay high-durability bituminous surface with automated smart sensors.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-md">
              <ShieldAlert className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">AI Spatial Conflict Intelligence</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Feature #1 Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">{routeName} • Inter-Departmental Resolution Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200 text-xs font-bold p-1 gap-1">
          <button
            onClick={() => setActiveTab('resolution')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'resolution'
                ? 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> AI Engineering Resolution Plan
          </button>
          <button
            onClick={() => setActiveTab('inspections')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'inspections'
                ? 'bg-white text-emerald-800 border border-slate-200 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-emerald-600" /> Spatial Intersections ({conflicts.length})
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'resolution' ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Savings & Impact Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Estimated Savings</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">₹2.8 Crore</div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-0.5 flex items-center justify-center gap-1">
                    <TrendingDown className="w-3 h-3" /> No Rework Penalty
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Time Saved</div>
                  <div className="text-xl font-black text-teal-700 mt-0.5">18 Days</div>
                  <div className="text-[10px] text-teal-800 font-semibold mt-0.5 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> Zero Digging Loops
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Post-Resolution Risk</div>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">8% (Low)</div>
                  <div className="text-[10px] text-emerald-800 font-semibold mt-0.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Stage-1 Fast-Track
                  </div>
                </div>
              </div>

              {/* Department Coordination Rationale */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Bot className="w-4 h-4 text-emerald-700" />
                  <span>Gemini Inter-Ministry Execution Rationale</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Instead of halting construction due to pipeline and forest corridor overlaps, GatiAI recommends a synchronized sequence: complete water pipeline diversion first, followed by optical fiber ducting, and finally road surface paving. This eliminates future road cutting and prevents ₹2.8 Cr in rework costs.
                </p>
              </div>

              {/* Step-by-Step Flowchart Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span>Sequential Execution Sequence</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="space-y-2.5">
                  {executionSteps.map((st, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 relative">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{st.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shrink-0">
                            {st.dept}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{st.details}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-extrabold text-emerald-700">{st.duration}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase">{st.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              {conflicts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="font-bold text-slate-900 text-base">Zero High-Risk Spatial Conflicts</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    This alignment successfully bypasses reserve forests, protected sanctuaries, and congested urban zones under GatiAI guidelines.
                  </p>
                </div>
              ) : (
                conflicts.map((cf) => (
                  <div key={cf.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                          {getConflictIcon(cf.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{cf.name}</h4>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                                cf.severity === 'high'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : cf.severity === 'medium'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              {cf.severity} Severity
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{cf.locationName}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-slate-500">Impact Score</div>
                        <div className="font-bold text-sm text-rose-600">{cf.impactScore}/100</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                      {cf.description}
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-slate-800 space-y-0.5">
                      <div className="font-bold text-[11px] text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AI Recommended Mitigation Protocol
                      </div>
                      <p className="text-[11px] text-slate-700">{cf.mitigationSuggestion}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GatiAI Compliant Resolution Strategy
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Close Resolution Plan
          </button>
        </div>
      </div>
    </div>
  );
};

