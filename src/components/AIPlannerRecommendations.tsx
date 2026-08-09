import React, { useState } from 'react';
import { Project } from '../types';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Wrench,
  Boxes,
  ShieldCheck,
  ArrowRight,
  Bot,
  AlertCircle,
} from 'lucide-react';

interface AIPlannerRecommendationsProps {
  project?: Project;
}

export const AIPlannerRecommendations: React.FC<AIPlannerRecommendationsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'sequence' | 'resources' | 'materials'>('sequence');

  const executionSequence = [
    { week: 'Week 1–2', dept: 'Ministry of Jal Shakti', phase: 'Utility Relocation', task: 'Water Pipeline & Canal Diversion', bufferDays: 4, status: 'Pre-Approved' },
    { week: 'Week 3–4', dept: 'Dept of Telecommunications', phase: 'Digital Backbone', task: 'BSNL Optical Fiber Ducting', bufferDays: 3, status: 'Synchronized' },
    { week: 'Week 5–8', dept: 'MoEFCC / Forest Dept', phase: 'Eco Corridor', task: 'Elevated Wildlife Eco-Duct Viaduct', bufferDays: 7, status: 'In Progress' },
    { week: 'Week 9–14', dept: 'NHID', phase: 'Sub-Base Surface', task: 'Bituminous Asphalt Road Paving', bufferDays: 5, status: 'Scheduled' },
    { week: 'Week 15–16', dept: 'State Power Discom', phase: 'Smart Grid', task: 'Solar Street Lights & Highway Sensors', bufferDays: 2, status: 'Scheduled' },
  ];

  const resourceAllocation = [
    { category: 'Heavy Machinery', name: 'Caterpillar Asphalt Pavers & Rollers', count: 18, unit: 'Units' },
    { category: 'Hydraulic Piling Rigs', name: 'Bauer Bridge Pier Drilling Rigs', count: 8, unit: 'Rigs' },
    { category: 'Engineering Workforce', name: 'Certified Structural & Highway Engineers', count: 140, unit: 'Engineers' },
    { category: 'Skilled Operators', name: 'Precision GPS Machinery Operators', count: 280, unit: 'Personnel' },
  ];

  const materialPlanning = [
    'Pre-cast High Strength M60 Grade Concrete Viaduct Girders (Off-site fabricated)',
    'Low-noise Bituminous Polymer Modified Asphalt (SMA Grade)',
    'Subterranean Armored Fiber Conduit Pipes (HDPE 110mm)',
    'Automated Scour & Hydro-dynamic Bridge Pier Monitoring Sensors',
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">AI Project Execution & Sequencing Planner</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Feature #4 Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Gemini Recommended Execution Sequence, Resource Allocation & Material Flow</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sequence')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sequence' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Execution Sequence
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'resources' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resource Allocation
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'materials' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Material Logistics
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === 'sequence' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span>Inter-Ministry Multi-Stage Waterfall Sequence</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="space-y-2.5">
            {executionSequence.map((seq, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {seq.week}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{seq.task}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {seq.dept}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Phase: {seq.phase}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right self-end sm:self-center">
                  <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                    + {seq.bufferDays} Buffer Days
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {seq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid sm:grid-cols-2 gap-3 animate-fadeIn text-xs">
          {resourceAllocation.map((res, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] text-emerald-700 font-bold uppercase">{res.category}</div>
              <div className="font-extrabold text-sm text-slate-900">{res.name}</div>
              <div className="text-base font-black text-emerald-700 mt-1">
                {res.count} <span className="text-xs font-normal text-slate-500">{res.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-2 animate-fadeIn text-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Optimized Material Dispatch Plan
          </div>
          <div className="space-y-2">
            {materialPlanning.map((mat, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-800">
                <Boxes className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{mat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
