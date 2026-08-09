import React, { useState } from 'react';
import { Infrastructure3DMap } from '../components/Infrastructure3DMap';
import {
  Scan,
  Sparkles,
  ShieldAlert,
  Building2,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Share2,
  HelpCircle,
  Activity,
  Layers,
  MapPin,
} from 'lucide-react';

export const Infrastructure3DMapPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string>('central_corridor');

  return (
    <div className="space-y-5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* PAGE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Decorative Mesh Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              <Scan className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>GatiAI WebGL 3D Spatial Twin Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              3D Infrastructure Command Center
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Real-time multi-layer 3D GIS spatial visualization representing surface roads, 3D buildings, underground water pipelines, power conduits, telecom fiber, drainage culverts, and rapid transit rail networks along the <strong>Delhi-Noida-Dadri PM Gati Shakti Infrastructure Corridor</strong>.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 font-extrabold uppercase">Dadri Corridor</div>
              <div className="text-lg font-black text-emerald-400">6 Projects</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-500/40 text-center">
              <div className="text-[10px] text-rose-300 font-extrabold uppercase">3D Conflicts</div>
              <div className="text-lg font-black text-rose-400">3 Detected</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/40 text-center">
              <div className="text-[10px] text-amber-300 font-extrabold uppercase">Cost Savings</div>
              <div className="text-lg font-black text-amber-300">₹98 Lakh</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN 3D MAP WORKSPACE COMPONENT */}
      <Infrastructure3DMap />

      {/* FOOTER FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <Layers className="w-4 h-4" />
            <span>Subterranean Layer Slicing</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Visually inspect utility depths from 0m to -25m below ground. TBM metro tunnels operate safely at -15m while utility ducts run between -2m and -5m.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>GatiSense Spatial Collision Engine</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Identifies spatio-temporal overlaps between surface asphalt compaction and sub-surface feeder trenching across MoRTH, Jal Shakti, and Power Grid.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Synchronized Joint Trench Protocol</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            AI What-If simulation aligns multi-agency schedules to execute joint trenching in a single phase, saving ₹98 Lakh and eliminating road re-excavation.
          </p>
        </div>
      </div>
    </div>
  );
};
