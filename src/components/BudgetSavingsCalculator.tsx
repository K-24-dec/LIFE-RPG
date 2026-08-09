import React from 'react';
import { Project } from '../types';
import {
  DollarSign,
  TrendingDown,
  Clock,
  Leaf,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Award,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface BudgetSavingsCalculatorProps {
  projects: Project[];
}

export const BudgetSavingsCalculator: React.FC<BudgetSavingsCalculatorProps> = ({ projects }) => {
  const totalBudget = projects.reduce((acc, p) => acc + p.budgetCrores, 0);

  // Math metrics for Feature #3
  const withoutCoordinationCost = Math.round(totalBudget * 1.18); // +18% due to spatial conflicts & digging loops
  const withAIPanningCost = totalBudget;
  const netSavings = withoutCoordinationCost - withAIPanningCost;

  const totalTimeWithout = 180; // Days avg
  const totalTimeWithAI = 142; // Days avg
  const daysSaved = totalTimeWithout - totalTimeWithAI;

  const carbonReductionPercent = 18; // % CO2 reduction

  const pieData = [
    { name: 'Direct Execution', value: Math.round(totalBudget * 0.82), color: '#10b981' },
    { name: 'AI Coordination Savings', value: netSavings, color: '#3b82f6' },
    { name: 'Rework Cost Avoided', value: Math.round(totalBudget * 0.08), color: '#8b5cf6' },
  ];

  const barData = [
    { name: 'Traditional Silos', Cost: withoutCoordinationCost, Days: totalTimeWithout },
    { name: 'GatiAI Master Plan', Cost: withAIPanningCost, Days: totalTimeWithAI },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">Multi-Ministry Budget Savings Engine</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Feature #3 Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">Comparing Traditional Department Silos vs GatiAI Master Plan</p>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Without Coordination</div>
          <div className="text-xl font-black text-rose-600">
            ₹{withoutCoordinationCost.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Traditional Rework Overhead</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">With AI Planning</div>
          <div className="text-xl font-black text-emerald-700">
            ₹{withAIPanningCost.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-emerald-800 font-bold">Synchronized Execution</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 text-center space-y-1 shadow-2xs">
          <div className="text-[10px] text-emerald-800 font-bold uppercase">Net Financial Savings</div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{netSavings.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-emerald-800 font-bold flex items-center justify-center gap-1">
            <TrendingDown className="w-3 h-3" /> 18% Outlay Reduced
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Time Saved & CO2</div>
          <div className="text-xl font-black text-amber-700">{daysSaved} Days</div>
          <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3" /> {carbonReductionPercent}% CO2 Reduction
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        {/* Cost Comparison Bar Chart */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Capital Outlay Comparison (₹ Crores)
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '11px', color: '#0f172a' }}
                />
                <Bar dataKey="Cost" fill="#059669" radius={[6, 6, 0, 0]} name="Project Outlay (Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Breakdown Pie Chart */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-teal-600" /> Savings Allocation Distribution
            </span>
          </div>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontSize: '11px', color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[10px] text-slate-600 font-semibold">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
