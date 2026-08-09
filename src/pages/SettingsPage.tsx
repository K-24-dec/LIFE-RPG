import React, { useState } from 'react';
import { Settings, Shield, CheckCircle2, Sparkles, Layers, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiKeySet, setApiKeySet] = useState<boolean>(true);
  const [autoAnalysis, setAutoAnalysis] = useState<boolean>(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-emerald-600" /> Platform Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage GIS spatial defaults, AI engine preferences, and GatiAI delegation rules</p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Gemini Integration Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Gemini AI Engine Status
          </h3>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xs">Gemini 3.6 Flash Server-Side Model</div>
              <div className="text-[10px] text-slate-500">Environment secret injected automatically via AI Studio</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
            </span>
          </div>
        </div>

        {/* GIS Layer Defaults */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" /> Default GIS Layers on Startup
          </h3>
          <p className="text-slate-500">Specify which spatial datasets render automatically when launching new corridor planners.</p>

          <div className="space-y-2 pt-2">
            <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <span className="text-slate-800 font-medium">Auto-detect Forest Reserve Intersections</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-0" />
            </label>
            <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <span className="text-slate-800 font-medium">Highlight Eco-Sensitive Protected Areas</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-0" />
            </label>
            <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <span className="text-slate-800 font-medium">Show Existing Dedicated Freight Corridors (DFCCIL)</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-0" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
