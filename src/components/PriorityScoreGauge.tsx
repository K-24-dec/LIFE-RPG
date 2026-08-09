import React from 'react';
import { PriorityScoreBreakdown } from '../types';
import { Award, AlertTriangle, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

interface PriorityScoreGaugeProps {
  scoreData?: PriorityScoreBreakdown;
  scoreNumber?: number;
  projectTitle?: string;
}

export const PriorityScoreGauge: React.FC<PriorityScoreGaugeProps> = ({
  scoreData,
  scoreNumber = 96,
  projectTitle = 'Delhi-Mumbai Green Express Freight Corridor',
}) => {
  const data: PriorityScoreBreakdown = scoreData || {
    score: scoreNumber,
    label: scoreNumber > 90 ? 'Critical' : scoreNumber > 75 ? 'High' : 'Medium',
    recommendation: 'Immediate fast-track approval under GatiAI Empowered Group of Secretaries (EGoS).',
    factors: [
      { name: 'National Strategic Importance', score: 98, weight: 0.25, impact: 'Primary West Coast Freight Spine' },
      { name: 'Population & Economic Coverage', score: 95, weight: 0.2, impact: 'Serves 6 crore industrial populace' },
      { name: 'Spatial Conflict Severity', score: 42, weight: 0.2, impact: 'Aravalli Forest Clearance Required' },
      { name: 'Monsoon Climate Risk', score: 85, weight: 0.15, impact: 'Southwest monsoon cloudburst alert' },
      { name: 'Completion Velocity', score: 78, weight: 0.2, impact: 'On schedule' },
    ],
  };

  const getHeatColor = (score: number) => {
    if (score >= 90) return 'text-rose-800 bg-rose-100 border-rose-300';
    if (score >= 75) return 'text-amber-800 bg-amber-100 border-amber-300';
    return 'text-emerald-800 bg-emerald-100 border-emerald-300';
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">AI Project Priority Score Index</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Feature #5 Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Multi-Factor Weighting Algorithm (0–100 Rating)</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${getHeatColor(data.score)}`}>
          ★★★★★ {data.score}/100 {data.label}
        </div>
      </div>

      {/* Main Meter Row */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        {/* Gauge Meter Circle */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={data.score >= 90 ? 'text-rose-600' : data.score >= 75 ? 'text-amber-600' : 'text-emerald-600'}
              strokeDasharray={`${data.score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900">{data.score}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">OUT OF 100</span>
          </div>
        </div>

        {/* Priority Details & Factors */}
        <div className="flex-1 space-y-3 w-full">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">{projectTitle}</h4>
            <p className="text-xs text-emerald-800 font-bold mt-0.5">{data.recommendation}</p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Factor Weighting Breakdown
            </div>
            {data.factors.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{f.name} (Weight: {f.weight * 100}%)</span>
                  <span className="font-mono text-emerald-700 font-bold">{f.score}/100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
