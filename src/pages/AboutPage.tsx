import React from 'react';
import { Info, Layers, Route, Sparkles, CheckCircle2, Shield, Code, Server, GitBranch, Cpu, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Sparkles className="w-3 h-3 text-emerald-600" /> GatiAI Multi-Modal Master Plan
        </div>
        <h1 className="text-2xl font-black text-slate-900">About GatiAI – AI Infrastructure Planning Assistant</h1>
        <p className="text-xs text-slate-500">
          GatiAI is a multi-modal AI infrastructure decision support engine engineered to revolutionize how government planners select, evaluate, and approve major national freight & transit corridors.
        </p>
      </div>

      {/* GatiAI 7 Engines */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Route className="w-5 h-5 text-emerald-600" /> The 7 Engines of Multi-Modal Growth
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { name: 'Roadways', desc: 'Expressways, National Highways & Border Connectivity' },
            { name: 'Railways', desc: 'Dedicated Freight Corridors & Semi-High Speed Lines' },
            { name: 'Airports', desc: 'Air Cargo Terminals & Regional Heliports' },
            { name: 'Ports', desc: 'Sagarmala Coastal Corridors & Inland Water Terminals' },
            { name: 'Mass Transport', desc: 'Metro Rail & Regional Rapid Transit Systems (RRTS)' },
            { name: 'Waterways', desc: 'Inland National Waterways (NW-1, NW-2, NW-5)' },
            { name: 'Logistics Infra', desc: 'Multi-Modal Logistics Parks (MMLPs) & Dry Ports' },
          ].map((engine, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs hover:border-slate-300 transition-colors">
              <div className="font-bold text-emerald-800 text-xs">{idx + 1}. {engine.name}</div>
              <div className="text-[11px] text-slate-500">{engine.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Architecture & Deployment Guide */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" /> System Architecture & CI/CD Pipeline
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-emerald-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-600" /> Full-Stack Architecture
            </h3>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li>• <strong>Frontend:</strong> React 19 + Vite + TypeScript + Tailwind CSS</li>
              <li>• <strong>GIS Engine:</strong> Leaflet + OpenStreetMap Vector Overlays</li>
              <li>• <strong>Backend:</strong> Express.js Node.js Server</li>
              <li>• <strong>AI Engine:</strong> @google/genai SDK (Gemini 3.6 Flash)</li>
              <li>• <strong>Analytics:</strong> Recharts Multi-Metric Visualizers</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-emerald-800 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-emerald-600" /> Vercel / Render Deployment Workflow
            </h3>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li>• <strong>Build Script:</strong> <code className="text-slate-900 font-mono font-bold bg-slate-200 px-1 py-0.5 rounded">npm run build</code></li>
              <li>• <strong>Dev Script:</strong> <code className="text-slate-900 font-mono font-bold bg-slate-200 px-1 py-0.5 rounded">npm run dev</code></li>
              <li>• <strong>Environment Vars:</strong> Declare <code className="text-slate-900 font-mono font-bold bg-slate-200 px-1 py-0.5 rounded">GEMINI_API_KEY</code></li>
              <li>• <strong>Production Start:</strong> <code className="text-slate-900 font-mono font-bold bg-slate-200 px-1 py-0.5 rounded">node dist/server.cjs</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
