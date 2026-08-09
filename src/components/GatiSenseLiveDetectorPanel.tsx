import React, { useState } from 'react';
import { GatiSenseConflictAlert } from '../utils/gatiSenseConflictDetector';
import {
  ShieldAlert,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Sparkles,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface GatiSenseLiveDetectorPanelProps {
  alerts: GatiSenseConflictAlert[];
  onSelectProjectOnMap?: (projectId: string) => void;
  onAutoSyncConflict?: (alertId: string) => void;
}

export const GatiSenseLiveDetectorPanel: React.FC<GatiSenseLiveDetectorPanelProps> = ({
  alerts,
  onSelectProjectOnMap,
  onAutoSyncConflict,
}) => {
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | '500M' | 'TEMPORAL'>('ALL');

  const handleResolve = (id: string) => {
    setResolvedIds((prev) => [...prev, id]);
    if (onAutoSyncConflict) {
      onAutoSyncConflict(id);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === '500M') return a.isWithin500m;
    if (filterType === 'TEMPORAL') return a.hasTemporalOverlap;
    return true;
  });

  return (
    <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-md font-['Plus_Jakarta_Sans',sans-serif] space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white font-black shadow-md shadow-emerald-600/20 animate-pulse">
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-600" /> GatiSense Auto Proximity Engine
            </div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
              GatiSense 500m & Temporal Conflict Detector
            </h2>
            <p className="text-xs text-slate-500">
              Real-time GIS spatial scanning across all registered project corridors & timetables
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-emerald-50/80 p-1 rounded-xl border border-emerald-200">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterType('500M')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === '500M'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Within 500m ({alerts.filter((a) => a.isWithin500m).length})
          </button>
          <button
            onClick={() => setFilterType('TEMPORAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'TEMPORAL'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Same Schedule ({alerts.filter((a) => a.hasTemporalOverlap).length})
          </button>
        </div>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 bg-emerald-50/30 rounded-2xl border border-emerald-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          No proximity or temporal conflicts detected for the selected filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isResolved = resolvedIds.includes(alert.id);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isResolved
                    ? 'bg-emerald-50/30 border-emerald-200 text-slate-500'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-400'
                    : 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {alert.conflictType.replace('_', ' & ')}
                    </span>

                    {/* 500 Meter Distance Tag */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        alert.distanceMeters <= 500
                          ? 'bg-rose-600 text-white border-rose-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <MapPin className="w-3 h-3 inline mr-1 text-rose-100" />
                      {alert.distanceMeters} meters distance {alert.distanceMeters <= 500 ? '(CRITICAL < 500m)' : ''}
                    </span>

                    {/* Temporal Tag */}
                    {alert.hasTemporalOverlap && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-300">
                        <Clock className="w-3 h-3 inline mr-1 text-teal-700" />
                        Same Timeframe Overlap
                      </span>
                    )}
                  </div>

                  {isResolved ? (
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Synchronized
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{alert.detectedAt}</span>
                  )}
                </div>

                {/* Conflict Description & Projects Involved */}
                <div className="grid md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Project A (Corridor 1)</div>
                    <div className="font-bold text-slate-900 line-clamp-1">{alert.project1.title}</div>
                    <div className="text-[10px] text-teal-700 font-semibold">{alert.project1.dept}</div>
                  </div>

                  <div className="space-y-1 md:border-l md:border-slate-200 md:pl-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Project B (Corridor 2)</div>
                    <div className="font-bold text-slate-900 line-clamp-1">{alert.project2.title}</div>
                    <div className="text-[10px] text-amber-700 font-semibold">{alert.project2.dept}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {alert.description}
                </p>

                {/* AI Recommendation Box */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GatiSense Auto Mitigation Strategy
                    </span>
                    <span className="text-emerald-800 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Est. Savings: ₹{alert.potentialSavingsCrores} Cr | {alert.timeSavedDays} Days Saved
                    </span>
                  </div>
                  <p className="text-slate-700 font-normal">{alert.aiMitigationRecommendation}</p>
                </div>

                {/* Action Row */}
                {!isResolved && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-100">
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Location: <span className="text-slate-800">{alert.locationName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onSelectProjectOnMap && (
                        <button
                          onClick={() => onSelectProjectOnMap(alert.project1.id)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-600" /> Focus on GIS Map
                        </button>
                      )}

                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Auto-Synchronize (GatiSense AI)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
