import React, { useState } from 'react';
import { Project } from '../types';
import { X, Sliders, AlertTriangle, TrendingUp, DollarSign, Clock, Layers } from 'lucide-react';

interface ScenarioSimulatorModalProps {
  project: Project;
  onClose: () => void;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({ project, onClose }) => {
  const [delayDays, setDelayDays] = useState<number>(30);
  const [rawMaterialInflation, setRawMaterialInflation] = useState<number>(5);

  const originalCost = project.budgetCrores;

  // Scenario Math calculations
  const dailyEscalationCost = (originalCost * 0.0004); // ₹ Crores per day
  const totalDelayEscalation = Math.round(dailyEscalationCost * delayDays);
  const totalInflationEscalation = Math.round(originalCost * (rawMaterialInflation / 100));
  const newProjectCost = originalCost + totalDelayEscalation + totalInflationEscalation;
  const costDifference = newProjectCost - originalCost;

  const affectedDownstreamProjects = [
    { title: 'JNPT Port Container Terminal Expansion', impact: `Delayed by ${Math.round(delayDays * 0.8)} days` },
    { title: 'Vadodara Industrial Freight Hub Logistics Line', impact: `Freight capacity throttled by 25%` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-md">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Interactive Scenario Simulator</h3>
              <p className="text-xs text-slate-500">Simulate Delay & Cost Escalation Ripple Effects</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-200/60 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders & Controls */}
        <div className="p-6 space-y-6">
          {/* Slider 1: Project Delay Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Simulated Construction Delay (Days)
              </span>
              <span className="text-amber-700 font-extrabold text-sm font-mono">+{delayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={delayDays}
              onChange={(e) => setDelayDays(parseInt(e.target.value))}
              className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Raw Material Inflation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-600" /> Steel & Cement Price Inflation (%)
              </span>
              <span className="text-rose-700 font-extrabold text-sm font-mono">+{rawMaterialInflation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={rawMaterialInflation}
              onChange={(e) => setRawMaterialInflation(parseInt(e.target.value))}
              className="w-full accent-rose-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Original Outlay</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">₹{originalCost.toLocaleString('en-IN')} Cr</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-[10px] text-rose-700 font-bold uppercase">Escalated Outlay</div>
              <div className="text-xl font-black text-rose-800 mt-0.5">₹{newProjectCost.toLocaleString('en-IN')} Cr</div>
              <div className="text-[10px] text-rose-700 font-bold mt-0.5">+₹{costDifference.toLocaleString('en-IN')} Cr Cost Overrun</div>
            </div>
          </div>

          {/* Downstream Impact List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Predicted Inter-Ministry Downstream Impact
            </div>
            <div className="space-y-2 text-xs">
              {affectedDownstreamProjects.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{p.title}</span>
                  <span className="text-rose-700 font-bold text-[11px]">{p.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
