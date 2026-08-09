import React, { useState } from 'react';
import { WeatherPrediction } from '../types';
import {
  CloudRain,
  Wind,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  ChevronRight,
  Sun,
  CloudLightning,
} from 'lucide-react';

interface WeatherWidgetProps {
  prediction?: WeatherPrediction;
  locationName?: string;
  onToggleRainRadar?: () => void;
  showRadarActive?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  prediction,
  locationName = 'Western Ghats / Surat Bypass Corridor',
  onToggleRainRadar,
  showRadarActive = false,
}) => {
  const [activeTab, setActiveTab] = useState<'forecast' | 'monsoon_calendar' | 'radar'>('forecast');

  // Fallback defaults if prediction not provided
  const wx: WeatherPrediction = prediction || {
    location: locationName,
    currentTempC: 29,
    condition: 'Southwest Monsoon Downpour',
    rainProbability7Days: 88,
    windSpeedKmh: 42,
    monsoonAlertLevel: 'High Risk',
    asphaltRecommendation: 'Pause heavy earthwork & bituminous asphalt paving between Km 140–185. Proceed with bridge pier curing.',
    suggestedStartDate: 'July 19, 2026',
    costImpactPercent: 14,
    delayDays: 14,
    forecast7Days: [
      { day: 'Mon', temp: 30, rainProb: 45, condition: 'Scattered Showers' },
      { day: 'Tue', temp: 28, rainProb: 75, condition: 'Heavy Rain' },
      { day: 'Wed', temp: 27, rainProb: 88, condition: 'Cloudburst Warning' },
      { day: 'Thu', temp: 28, rainProb: 82, condition: 'Heavy Downpour' },
      { day: 'Fri', temp: 29, rainProb: 60, condition: 'Moderate Rain' },
      { day: 'Sat', temp: 31, rainProb: 35, condition: 'Partly Cloudy' },
      { day: 'Sun', temp: 32, rainProb: 15, condition: 'Clear Sky' },
    ],
  };

  const monsoonMonths = [
    { name: 'May', risk: 'Low', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', workAllowed: 'Full Scale Construction' },
    { name: 'June', risk: 'Moderate', color: 'bg-amber-100 text-amber-800 border-amber-300', workAllowed: 'Earthwork Caution' },
    { name: 'July', risk: 'High / Critical', color: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse', workAllowed: 'Pause Asphalt & Earthwork' },
    { name: 'August', risk: 'High', color: 'bg-rose-100 text-rose-800 border-rose-300', workAllowed: 'Bridge Substructures Only' },
    { name: 'September', risk: 'Moderate', color: 'bg-amber-100 text-amber-800 border-amber-300', workAllowed: 'Gradual Resumption' },
    { name: 'October', risk: 'Low', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', workAllowed: 'Full Scale Construction' },
  ];

  return (
    <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-md space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
            <CloudRain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">Weather & Monsoon Delay Intelligence</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Feature #2 Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">OpenWeather Live Synced • Regional Delay Index</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleRainRadar && (
            <button
              onClick={onToggleRainRadar}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                showRadarActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> GIS Rain Radar Overlay
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'forecast'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          7-Day Forecast & Delay Gauge
        </button>
        <button
          onClick={() => setActiveTab('monsoon_calendar')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'monsoon_calendar'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          Monsoon Season Calendar
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'forecast' ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Risk Badge Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Alert Level</div>
              <div className="font-black text-rose-700 text-sm mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> {wx.monsoonAlertLevel}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Rain Probability</div>
              <div className="font-black text-teal-800 text-sm mt-0.5">{wx.rainProbability7Days}% High</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Potential Delay</div>
              <div className="font-black text-amber-800 text-sm mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" /> +{wx.delayDays} Days
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Cost Impact</div>
              <div className="font-black text-emerald-800 text-sm mt-0.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> +{wx.costImpactPercent}% Overrun
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              7-Day Micro-Climate Forecast ({wx.location})
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
              {wx.forecast7Days.map((fc, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border transition-all ${
                    fc.rainProb > 70
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : fc.rainProb > 40
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50/30 border-emerald-100 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-[11px] text-slate-500">{fc.day}</div>
                  <div className="my-1">
                    {fc.rainProb > 70 ? (
                      <CloudLightning className="w-5 h-5 mx-auto text-rose-600" />
                    ) : fc.rainProb > 40 ? (
                      <CloudRain className="w-5 h-5 mx-auto text-amber-600" />
                    ) : (
                      <Sun className="w-5 h-5 mx-auto text-amber-500" />
                    )}
                  </div>
                  <div className="font-extrabold text-xs">{fc.temp}°C</div>
                  <div className="text-[9px] font-bold text-teal-700 mt-0.5">{fc.rainProb}% Rain</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Directive Protocol */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> GatiAI Monsoon Construction Directive
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">Suggested Start: {wx.suggestedStartDate}</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px] font-medium">{wx.asphaltRecommendation}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 animate-fadeIn text-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Southwest & Northeast Monsoon Calendar Guidelines (India Region)
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {monsoonMonths.map((m, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${m.color}`}>
                    {m.risk} Risk
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                  <strong>Permitted Work:</strong> {m.workAllowed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
