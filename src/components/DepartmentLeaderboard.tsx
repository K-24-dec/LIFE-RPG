import React from 'react';
import { DepartmentPerfMetric } from '../types';
import { Award, Trophy, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';

interface DepartmentLeaderboardProps {
  metrics: DepartmentPerfMetric[];
}

export const DepartmentLeaderboard: React.FC<DepartmentLeaderboardProps> = ({ metrics }) => {
  return (
    <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Ministry Performance Leaderboard</h3>
            <p className="text-xs text-slate-500">Ranked by Inter-Departmental Coordination & Savings Realized</p>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {metrics.map((dept) => (
          <div
            key={dept.code}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                  dept.rank === 1
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : dept.rank === 2
                    ? 'bg-slate-200 text-slate-800'
                    : dept.rank === 3
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                #{dept.rank}
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{dept.department}</h4>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {dept.activeProjects} Active Projects • {dept.conflictsResolved} Conflicts Resolved
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right shrink-0">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">On-Time Rate</div>
                <div className="font-black text-emerald-700 text-xs">{dept.onTimeRate}%</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Savings Realized</div>
                <div className="font-black text-teal-700 text-xs">₹{dept.savingsGeneratedCrores} Cr</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
