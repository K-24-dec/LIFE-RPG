import React from 'react';
import { Project, RouteOption } from '../types';
import { Sparkles, GitCompare, CheckCircle2, ShieldAlert, ArrowRight, DollarSign, Clock, Mountain, Leaf, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface RouteAnalysisPageProps {
  activeProject: Project;
  onSelectRoute: (routeId: string) => void;
  onOpenPlanner: () => void;
}

export const RouteAnalysisPage: React.FC<RouteAnalysisPageProps> = ({
  activeProject,
  onSelectRoute,
  onOpenPlanner,
}) => {
  const routes = activeProject.routes;

  const chartData = routes.map((r) => ({
    name: r.name.split(':')[0],
    Cost: r.estimatedCostCrores,
    Distance: r.distanceKm,
    EcoScore: r.environmentalImpactScore,
    DelayRisk: r.delayProbability,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <GitCompare className="w-3.5 h-3.5" /> Multi-Metric Route Rationale Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900">{activeProject.title}</h1>
          <p className="text-xs text-slate-500">Comparing {routes.length} generated route alignments across GatiAI decision parameters</p>
        </div>

        <button
          onClick={onOpenPlanner}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          View on GIS Map <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Comparative Matrix</span>
          <span className="text-xs text-slate-500">Lower Eco Impact & Lower Delay Risk is Preferred</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200 font-bold">
                <th className="p-3.5">Route Option</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Est. Cost</th>
                <th className="p-3.5">Timeline</th>
                <th className="p-3.5">Terrain</th>
                <th className="p-3.5">Eco Score</th>
                <th className="p-3.5">Delay Risk</th>
                <th className="p-3.5">Conflicts</th>
                <th className="p-3.5 text-center">AI Rating</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routes.map((rt) => {
                const isSelected = rt.id === activeProject.selectedRouteId;
                return (
                  <tr
                    key={rt.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-emerald-50/70 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rt.color }} />
                        {rt.name}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{rt.recommendationReason}</div>
                    </td>

                    <td className="p-3.5 font-bold text-slate-800">{rt.distanceKm} km</td>

                    <td className="p-3.5 font-bold text-emerald-700">
                      ₹{rt.estimatedCostCrores.toLocaleString('en-IN')} Cr
                    </td>

                    <td className="p-3.5 text-slate-700">{rt.constructionMonths} Mos</td>

                    <td className="p-3.5 text-amber-800 font-semibold">{rt.terrainDifficulty}</td>

                    <td className="p-3.5 font-bold text-emerald-700">{rt.environmentalImpactScore}/100</td>

                    <td className="p-3.5 font-bold text-rose-700">{rt.delayProbability}%</td>

                    <td className="p-3.5">
                      {rt.conflicts.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> {rt.conflicts.length}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> None
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="font-extrabold text-xs text-emerald-800">{rt.confidenceScore}%</span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          onSelectRoute(rt.id);
                          onOpenPlanner();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cost vs Distance Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Capital Cost Comparison (₹ Crores)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="Cost" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#059669' : '#0d9488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Risk Probability */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" /> Delay Probability (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="DelayRisk" fill="#e11d48" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
