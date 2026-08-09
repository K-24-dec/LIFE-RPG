import React, { useState } from 'react';
import { Project, GanttMilestone } from '../types';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ZoomIn,
  ZoomOut,
  Layers,
  Building2,
} from 'lucide-react';

interface GanttTimelineProps {
  projects: Project[];
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ projects }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Collect all milestones from projects
  const allMilestones: { projectTitle: string; milestone: GanttMilestone }[] = [];

  projects.forEach((p) => {
    if (p.ganttMilestones) {
      p.ganttMilestones.forEach((m) => {
        allMilestones.push({ projectTitle: p.title, milestone: m });
      });
    } else {
      // Create fallback milestone
      allMilestones.push({
        projectTitle: p.title,
        milestone: {
          id: `m-fallback-${p.id}`,
          name: `${p.title} Full Phase`,
          startDate: p.startDate,
          endDate: p.completionDate,
          completionPercent: 35,
          department: p.department,
          hasConflict: p.riskLevel === 'High' || p.riskLevel === 'Critical',
        },
      });
    }
  });

  const filtered = allMilestones.filter(
    (item) => selectedDept === 'all' || item.milestone.department.includes(selectedDept)
  );

  return (
    <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">Interactive Gantt & Conflict Timeline</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Feature #8 Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Inter-Departmental Overlap Radar • Red Highlight = Spatial Conflict</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none font-semibold text-xs"
            >
              <option value="all">All Ministries</option>
              <option value="Road">NHID Highways</option>
              <option value="Railways">Indian Railways</option>
              <option value="Jal Shakti">Jal Shakti Water</option>
              <option value="Environment">MoEFCC Forestry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Bar Headers */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 overflow-x-auto">
        <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[700px]">
          <div className="col-span-4">Corridor Phase / Task</div>
          <div className="col-span-2 text-center">Ministry</div>
          <div className="col-span-4 text-center">Gantt Schedule Bar (2026–2028)</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Milestone Rows */}
        <div className="divide-y divide-slate-200 min-w-[700px] space-y-2 pt-1">
          {filtered.map((item, idx) => {
            const m = item.milestone;
            return (
              <div
                key={m.id || idx}
                className={`py-3 grid grid-cols-12 items-center text-xs transition-all rounded-xl px-2 ${
                  m.hasConflict
                    ? 'bg-rose-50 border border-rose-200'
                    : 'hover:bg-emerald-50/50'
                }`}
              >
                {/* Title & Project */}
                <div className="col-span-4 space-y-0.5">
                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    {m.hasConflict && (
                      <span className="p-0.5 bg-rose-600 text-white rounded animate-pulse" title="Spatial Conflict Overlap Detected!">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    )}
                    <span>{m.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{item.projectTitle}</div>
                </div>

                {/* Dept Badge */}
                <div className="col-span-2 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {m.department}
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="col-span-4 px-3">
                  <div className="w-full bg-slate-200 h-4 rounded-lg p-0.5 relative overflow-hidden border border-slate-300">
                    <div
                      className={`h-full rounded-md transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-black text-white ${
                        m.hasConflict
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      }`}
                      style={{ width: `${Math.max(m.completionPercent, 18)}%` }}
                    >
                      {m.completionPercent}%
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="col-span-2 text-right">
                  {m.hasConflict ? (
                    <span className="text-[10px] font-bold text-rose-700 flex items-center justify-end gap-1">
                      <AlertTriangle className="w-3 h-3" /> Conflict Overlap
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" /> On Schedule
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
