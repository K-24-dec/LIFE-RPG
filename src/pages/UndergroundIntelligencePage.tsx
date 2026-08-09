import React, { useState } from 'react';
import {
  MOCK_UNDERGROUND_ASSETS,
  MOCK_DIG_PERMISSIONS,
  MOCK_SHARED_CORRIDORS,
  MOCK_EMERGENCY_INCIDENTS,
  UTILITY_COLORS,
  UTILITY_NAMES,
} from '../data/undergroundData';
import { UndergroundAsset, DigPermissionRequest, UndergroundUtilityType } from '../types/underground';
import { Underground3DDigitalTwin } from '../components/Underground3DDigitalTwin';
import { jsPDF } from 'jspdf';
import {
  Layers,
  ShieldAlert,
  Zap,
  Activity,
  Compass,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Download,
  Search,
  Plus,
  Radio,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Droplets,
  Network,
  ChevronRight,
  ShieldCheck,
  Building2,
  Wrench,
  Siren,
  HelpCircle,
} from 'lucide-react';

interface UndergroundIntelligencePageProps {
  onOpenAIAssistant?: (initialPrompt?: string) => void;
}

export const UndergroundIntelligencePage: React.FC<UndergroundIntelligencePageProps> = ({
  onOpenAIAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<
    'digital_twin' | 'dig_permission' | 'cable_pipeline' | 'corridor_route' | 'emergency_maint'
  >('digital_twin');

  const [assets, setAssets] = useState<UndergroundAsset[]>(MOCK_UNDERGROUND_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<UndergroundAsset | null>(MOCK_UNDERGROUND_ASSETS[0]);
  const [digRequests, setDigRequests] = useState<DigPermissionRequest[]>(MOCK_DIG_PERMISSIONS);

  // Excavation Clearance Simulator Form State
  const [excavationForm, setExcavationForm] = useState({
    projectName: 'National Highway NH-16 Service Road Trenching',
    department: 'National Highways & Infrastructure Development (NHID)',
    locationName: 'Dadri Sector 12 Junction',
    depthMeters: 2.5,
    lengthMeters: 50,
    widthMeters: 2.0,
    purpose: 'Optical Fiber Duct & Storm Drain Extension',
  });

  const [simulatedNoc, setSimulatedNoc] = useState<DigPermissionRequest | null>(MOCK_DIG_PERMISSIONS[0]);
  const [isSimulatingNoc, setIsSimulatingNoc] = useState<boolean>(false);

  // New Route Optimizer Form State
  const [routeOptForm, setRouteOptForm] = useState({
    utilityType: 'gas_pipeline' as UndergroundUtilityType,
    startPoint: 'Dadri North Rail Hub',
    endPoint: 'Sector 8 Industrial Zone',
    depth: 1.8,
  });

  const [optResult, setOptResult] = useState<{
    originalCost: number;
    optimizedCost: number;
    savings: number;
    conflictsAvoided: number;
    recommendedPath: string;
  } | null>({
    originalCost: 14.8,
    optimizedCost: 9.2,
    savings: 5.6,
    conflictsAvoided: 3,
    recommendedPath: 'Route via North Railway Buffer Green Belt (Depth -1.8m). Bypasses 66kV power cable and metro shaft.',
  });

  // Calculate KPIs
  const totalLengthKm = assets.reduce((sum, a) => sum + 12.5, 0); // approx total km
  const waterAssets = assets.filter((a) => a.utilityType === 'water_pipeline');
  const gasAssets = assets.filter((a) => a.utilityType === 'gas_pipeline');
  const powerAssets = assets.filter((a) => a.utilityType.includes('power'));
  const fiberAssets = assets.filter((a) => a.utilityType === 'fiber_optic');
  const highRiskAssets = assets.filter((a) => a.aiRiskScore > 50 || a.currentStatus === 'maintenance_due');

  const handleSimulateNoc = () => {
    setIsSimulatingNoc(true);
    setTimeout(() => {
      // Simulate AI excavation collision engine
      const collisions = assets
        .filter((a) => Math.abs(a.depthMeters - excavationForm.depthMeters) <= 1.2)
        .map((a) => ({
          assetId: a.id,
          assetName: a.assetName,
          utilityType: a.utilityType,
          dept: a.department,
          assetDepthMeters: a.depthMeters,
          clearanceMarginMeters: parseFloat((a.depthMeters - excavationForm.depthMeters).toFixed(1)),
          collisionRisk:
            Math.abs(a.depthMeters - excavationForm.depthMeters) < 0.5
              ? ('CRITICAL_DIRECT_HIT' as const)
              : ('HIGH_PROXIMITY' as const),
        }));

      const isHighRisk = collisions.some((c) => c.collisionRisk === 'CRITICAL_DIRECT_HIT');

      const newNoc: DigPermissionRequest = {
        id: `dig-req-${Date.now().toString().slice(-3)}`,
        projectName: excavationForm.projectName,
        requestingDept: excavationForm.department,
        locationName: excavationForm.locationName,
        targetLat: 28.5375,
        targetLng: 77.392,
        excavationLengthMeters: excavationForm.lengthMeters,
        proposedDepthMeters: excavationForm.depthMeters,
        excavationWidthMeters: excavationForm.widthMeters,
        purpose: excavationForm.purpose,
        requestDate: '2026-08-01',
        status: isHighRisk ? 'Approved_With_Conditions' : 'Approved',
        aiRiskScore: isHighRisk ? 85 : 15,
        detectedCollisions: collisions,
        aiRecommendations: {
          shiftTrenchMetersEast: isHighRisk ? 2.5 : 0.0,
          maxExcavationDepthMeters: Math.max(0.8, excavationForm.depthMeters - 1.2),
          estimatedSavingsLakhs: isHighRisk ? 42 : 12,
          safeRouteDescription: isHighRisk
            ? 'Shift excavation axis 2.5 meters East into utility buffer zone. Limit mechanized digging depth to 1.0m, hand excavation required below.'
            : 'Clear excavation trajectory. Proceed with standard safety protocols.',
          safetyChecklist: [
            'Mandatory Ground-Penetrating Radar (GPR) scan prior to mechanized excavation',
            'Deploy certified gas and high-voltage line sensor monitoring team on site',
            'Hand-digging mandatory for first 1.2m depth layer',
            '24-hour advance alert sent to department leads',
          ],
        },
      };

      setSimulatedNoc(newNoc);
      setDigRequests([newNoc, ...digRequests]);
      setIsSimulatingNoc(false);
    }, 800);
  };

  const handleDownloadNocPdf = (noc: DigPermissionRequest) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(2, 132, 199);
    doc.text('GATI AI MULTI-MODAL MASTER PLAN', 15, 20);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('AI UNDERGROUND EXCAVATION SAFETY & NOC CLEARANCE', 15, 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Clearance ID: ${noc.id} | Date: ${noc.requestDate}`, 15, 38);
    doc.text(`Project: ${noc.projectName}`, 15, 45);
    doc.text(`Requesting Department: ${noc.requestingDept}`, 15, 52);
    doc.text(`Location: ${noc.locationName}`, 15, 59);

    doc.setFont('helvetica', 'bold');
    doc.text('EXCAVATION SAFETY ASSESSMENT:', 15, 70);

    doc.setFont('helvetica', 'normal');
    doc.text(`Approval Status: ${noc.status.replace(/_/g, ' ')}`, 15, 78);
    doc.text(`AI Dig Risk Score: ${noc.aiRiskScore}/100`, 15, 85);
    doc.text(`Proposed Depth: ${noc.proposedDepthMeters}m | Recommended Max Depth: ${noc.aiRecommendations.maxExcavationDepthMeters}m`, 15, 92);
    doc.text(`Recommended Trench Offset: Shift ${noc.aiRecommendations.shiftTrenchMetersEast}m East`, 15, 99);
    doc.text(`Estimated Infrastructure Loss Prevention Savings: Rs. ${noc.aiRecommendations.estimatedSavingsLakhs} Lakhs`, 15, 106);

    doc.setFont('helvetica', 'bold');
    doc.text('DETECTED SUB-SURFACE UTILITIES AT DEPTH:', 15, 120);

    let y = 128;
    noc.detectedCollisions.forEach((col, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`${idx + 1}. ${col.assetName} (${col.dept}) - Depth: -${col.assetDepthMeters}m [${col.collisionRisk}]`, 15, y);
      y += 7;
    });

    doc.setFont('helvetica', 'bold');
    doc.text('MANDATORY EXCAVATION SAFETY PROTOCOLS:', 15, y + 10);

    y += 18;
    noc.aiRecommendations.safetyChecklist.forEach((chk, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`[X] ${chk}`, 15, y);
      y += 7;
    });

    doc.save(`GatiAI_Dig_NOC_${noc.id}.pdf`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 p-4 md:p-6 font-['Plus_Jakarta_Sans',sans-serif] space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              ISRO & GatiAI GIS Twin
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold">
              AI Dig Clearance Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            AI Underground Utility Intelligence & Digital Twin
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            3D Sub-surface mapping, collision detection, dig permissions, cable/pipeline predictive maintenance, and shared utility corridor planning across all ministries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAIAssistant?.("What utilities exist below Dadri Logistics Hub and where is the safest excavation route?")}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" /> Ask AI Utility Planner
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Total Utilities</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">75.2 <span className="text-xs font-medium text-slate-500">km</span></div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Mapped in 3D Twin</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Water Mains</span>
            <Droplets className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">18.4 <span className="text-xs font-medium text-slate-500">km</span></div>
          <div className="text-[10px] text-sky-600 font-bold mt-0.5">Jal Shakti Network</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Gas Pipelines</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">12.1 <span className="text-xs font-medium text-slate-500">km</span></div>
          <div className="text-[10px] text-amber-600 font-bold mt-0.5">GAIL 24-bar Grid</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Power & Fiber</span>
            <Zap className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">32.8 <span className="text-xs font-medium text-slate-500">km</span></div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">66kV & NKN Fiber</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>AI Risk Score</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-600 mt-1">28<span className="text-xs font-medium text-slate-500">/100</span></div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Low Overall Risk</div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Dig Clearance NOC</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">{digRequests.length} <span className="text-xs font-medium text-slate-500">Approved</span></div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">₹63 Lakhs Saved</div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs font-bold shadow-2xs">
        <button
          onClick={() => setActiveTab('digital_twin')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'digital_twin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Underground 3D Digital Twin</span>
        </button>

        <button
          onClick={() => setActiveTab('dig_permission')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'dig_permission'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>AI Dig Permission & Safety NOC</span>
        </button>

        <button
          onClick={() => setActiveTab('cable_pipeline')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'cable_pipeline'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Cable & Pipeline Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('corridor_route')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'corridor_route'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Route Optimization & Corridor</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency_maint')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'emergency_maint'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Siren className="w-4 h-4 text-rose-500" />
          <span>Emergency Response & Maintenance</span>
        </button>
      </div>

      {/* TAB 1: 3D DIGITAL TWIN VIEWER */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4">
          <div className="h-[600px] w-full">
            <Underground3DDigitalTwin
              assets={assets}
              selectedAssetId={selectedAsset?.id}
              onSelectAsset={(a) => setSelectedAsset(a)}
              highlightClashes={true}
            />
          </div>

          {/* Subterranean Asset Catalog Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Underground Asset Catalog</h3>
                <p className="text-xs text-slate-500">Live depth, pressure, diameter, and remaining life matrix</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
                    <th className="p-3 rounded-l-xl">Asset Name</th>
                    <th className="p-3">Utility Type</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Depth</th>
                    <th className="p-3">Diameter/Size</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">AI Risk Score</th>
                    <th className="p-3 rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: UTILITY_COLORS[asset.utilityType] }}
                        />
                        <span>{asset.assetName}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        {UTILITY_NAMES[asset.utilityType]}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{asset.department}</td>
                      <td className="p-3 font-mono font-bold text-sky-700">-{asset.depthMeters} m</td>
                      <td className="p-3 font-mono text-slate-700">{asset.diameterMm} mm</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            asset.currentStatus === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asset.currentStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 font-bold">
                        <span
                          className={`${
                            asset.aiRiskScore > 70
                              ? 'text-rose-600'
                              : asset.aiRiskScore > 40
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {asset.aiRiskScore}/100
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                        >
                          Inspect 3D
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI DIG PERMISSION & EXCAVATION SAFETY NOC */}
      {activeTab === 'dig_permission' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Excavation Request Simulator Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Submit Excavation Clearance Request</h3>
                <p className="text-xs text-slate-500">AI auto-collision check against buried pipelines & cables</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project / Trench Title</label>
                <input
                  type="text"
                  value={excavationForm.projectName}
                  onChange={(e) => setExcavationForm({ ...excavationForm, projectName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Requesting Department</label>
                <input
                  type="text"
                  value={excavationForm.department}
                  onChange={(e) => setExcavationForm({ ...excavationForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location Coordinates</label>
                  <input
                    type="text"
                    value={excavationForm.locationName}
                    onChange={(e) => setExcavationForm({ ...excavationForm, locationName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proposed Depth (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={excavationForm.depthMeters}
                    onChange={(e) =>
                      setExcavationForm({ ...excavationForm, depthMeters: parseFloat(e.target.value) || 1.0 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Length (meters)</label>
                  <input
                    type="number"
                    value={excavationForm.lengthMeters}
                    onChange={(e) =>
                      setExcavationForm({ ...excavationForm, lengthMeters: parseInt(e.target.value) || 10 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trench Width (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={excavationForm.widthMeters}
                    onChange={(e) =>
                      setExcavationForm({ ...excavationForm, widthMeters: parseFloat(e.target.value) || 1.0 })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSimulateNoc}
                disabled={isSimulatingNoc}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className={`w-4 h-4 ${isSimulatingNoc ? 'animate-spin' : ''}`} />
                <span>{isSimulatingNoc ? 'Analyzing Sub-surface Vectors...' : 'Run AI Collision Scan & Generate NOC'}</span>
              </button>
            </div>
          </div>

          {/* Right: AI Dig Clearance Assessment & Certificate */}
          <div className="lg:col-span-7 space-y-4">
            {simulatedNoc ? (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {simulatedNoc.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">NOC ID: {simulatedNoc.id}</span>
                    </div>
                    <h3 className="font-black text-slate-900 text-base">{simulatedNoc.projectName}</h3>
                    <p className="text-xs text-slate-500">{simulatedNoc.locationName}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadNocPdf(simulatedNoc)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" /> Export PDF NOC
                  </button>
                </div>

                {/* AI Safety Assessment Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                    <div className="text-[10px] font-extrabold text-rose-800 uppercase">AI Dig Risk Score</div>
                    <div className="text-xl font-black text-rose-700 mt-1">{simulatedNoc.aiRiskScore}/100</div>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                    <div className="text-[10px] font-extrabold text-indigo-800 uppercase">Recommended Shift</div>
                    <div className="text-lg font-black text-indigo-700 mt-1">
                      +{simulatedNoc.aiRecommendations.shiftTrenchMetersEast}m East
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <div className="text-[10px] font-extrabold text-emerald-800 uppercase">Loss Prevention</div>
                    <div className="text-lg font-black text-emerald-700 mt-1">
                      ₹{simulatedNoc.aiRecommendations.estimatedSavingsLakhs} Lakhs
                    </div>
                  </div>
                </div>

                {/* Detected Underground Utility Collisions */}
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> Detected Buried Asset Collisions
                  </h4>
                  <div className="space-y-2">
                    {simulatedNoc.detectedCollisions.map((col, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: UTILITY_COLORS[col.utilityType] }}
                            />
                            <span>{col.assetName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{col.dept} • Depth: -{col.assetDepthMeters}m</div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                          {col.collisionRisk.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mandatory Safety Protocols */}
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">
                    Mandatory On-Site Safety Protocols
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    {simulatedNoc.aiRecommendations.safetyChecklist.map((chk, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
                <FileCheck2 className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-800">No Excavation Scan Active</h4>
                <p className="text-xs">Submit trench parameters on the left to run AI subterranean collision check.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CABLE & PIPELINE INTELLIGENCE */}
      {activeTab === 'cable_pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Underground Cables Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Underground Cable Intelligence</h3>
                <p className="text-xs text-slate-500">66kV power feeders & 288-core fiber load monitoring</p>
              </div>
            </div>

            <div className="space-y-3">
              {assets
                .filter((a) => a.utilityType.includes('power') || a.utilityType.includes('fiber'))
                .map((cable) => (
                  <div key={cable.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-black text-slate-900">{cable.assetName}</div>
                        <div className="text-[10px] text-slate-500">{cable.department} • Depth: -{cable.depthMeters}m</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800">
                        {cable.voltageKv ? `${cable.voltageKv}kV HV Cable` : `${cable.capacityMbps} Mbps Fiber`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Current Operational Load</span>
                        <span className="font-mono text-rose-600">{cable.currentLoadPercent || 68}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${cable.currentLoadPercent || 68}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 text-[10px] text-slate-600">
                      <div>Fault History: <strong className="text-slate-900">{cable.faultHistoryCount} Events</strong></div>
                      <div>Remaining Life: <strong className="text-indigo-600">{cable.remainingLifeYears} Years</strong></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Underground Pipelines Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Droplets className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Pipeline Predictive Intelligence</h3>
                <p className="text-xs text-slate-500">Water main & natural gas pressure, corrosion, burst probability</p>
              </div>
            </div>

            <div className="space-y-3">
              {assets
                .filter((a) => a.utilityType.includes('water') || a.utilityType.includes('gas') || a.utilityType.includes('sewer'))
                .map((pipe) => (
                  <div key={pipe.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-black text-slate-900">{pipe.assetName}</div>
                        <div className="text-[10px] text-slate-500">{pipe.department} • Depth: -{pipe.depthMeters}m</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800">
                        {pipe.pressureBar ? `${pipe.pressureBar} Bar Pressure` : `${pipe.diameterMm}mm Trunk`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-400">Material</div>
                        <div className="font-bold text-slate-800">{pipe.material}</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-400">Burst Risk</div>
                        <div className="font-bold text-emerald-600">Low (&lt;12%)</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-slate-400">Next Audit</div>
                        <div className="font-bold text-indigo-600">Nov 2026</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROUTE OPTIMIZATION & SHARED CORRIDOR */}
      {activeTab === 'corridor_route' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Underground Route Generator */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">AI Underground Cable/Pipe Route Optimizer</h3>
                <p className="text-xs text-slate-500">Generates zero-collision path bypassing existing utilities & metro</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Utility Asset Type</label>
                <select
                  value={routeOptForm.utilityType}
                  onChange={(e) => setRouteOptForm({ ...routeOptForm, utilityType: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="gas_pipeline">Natural Gas Pipeline</option>
                  <option value="fiber_optic">Optic Fiber Duct</option>
                  <option value="high_voltage_power">High-Voltage Power Cable</option>
                  <option value="water_pipeline">Water Distribution Main</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Terminal</label>
                  <input
                    type="text"
                    value={routeOptForm.startPoint}
                    onChange={(e) => setRouteOptForm({ ...routeOptForm, startPoint: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Terminal</label>
                  <input
                    type="text"
                    value={routeOptForm.endPoint}
                    onChange={(e) => setRouteOptForm({ ...routeOptForm, endPoint: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {optResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-extrabold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> AI Recommended Underground Path
                    </span>
                    <span>₹{optResult.savings} Cr Saved</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{optResult.recommendedPath}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shared Utility Corridor Planner */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Shared Utility Corridor Proposal</h3>
                <p className="text-xs text-slate-500">Co-locate water, gas, fiber & power in a single multi-duct tunnel</p>
              </div>
            </div>

            {MOCK_SHARED_CORRIDORS.map((corridor) => (
              <div key={corridor.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{corridor.corridorName}</h4>
                    <div className="text-[11px] text-slate-500">{corridor.locationCity} • Length: {corridor.lengthKm} km</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    ROI: {corridor.roiYears} Years
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-slate-400">Road Digs Reduced</div>
                    <div className="font-black text-emerald-700 text-sm">{corridor.traditionalExcavationCount} → 1 Tunnel</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-slate-400">Cost Savings</div>
                    <div className="font-black text-emerald-700 text-sm">₹{corridor.estimatedSavingsCrores} Cr</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="text-slate-400">Disruption Days Saved</div>
                    <div className="font-black text-indigo-700 text-sm">{corridor.disruptionDaysSaved} Days</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-800 font-extrabold">Participating Ministries:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {corridor.participatingDepartments.map((dept, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EMERGENCY RESPONSE & MAINTENANCE CALENDAR */}
      {activeTab === 'emergency_maint' && (
        <div className="space-y-6">
          {/* Active Emergency Alert Banner */}
          {MOCK_EMERGENCY_INCIDENTS.map((inc) => (
            <div key={inc.id} className="bg-rose-950/90 border-2 border-rose-500 p-5 rounded-2xl text-white space-y-3 shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-600 rounded-2xl animate-pulse">
                    <Siren className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-rose-300 tracking-wider">
                      CRITICAL SUB-SURFACE EMERGENCY ALERT
                    </div>
                    <h3 className="font-black text-lg text-white">{inc.title}</h3>
                    <p className="text-xs text-rose-200">{inc.locationName}</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-full uppercase">
                  {inc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-rose-900/60 p-3 rounded-xl border border-rose-800">
                <div>
                  <div className="text-rose-300 text-[10px]">Isolation Switch</div>
                  <div className="font-bold text-white">{inc.nearestShutoffValve}</div>
                </div>
                <div>
                  <div className="text-rose-300 text-[10px]">Affected Customers</div>
                  <div className="font-bold text-amber-300">{inc.affectedCustomersCount.toLocaleString()} Users</div>
                </div>
                <div>
                  <div className="text-rose-300 text-[10px]">Dispatch Crew</div>
                  <div className="font-bold text-white">{inc.suggestedRepairCrew}</div>
                </div>
                <div>
                  <div className="text-rose-300 text-[10px]">Est. Repair Time</div>
                  <div className="font-bold text-emerald-300">{inc.estimatedRepairHours} Hours</div>
                </div>
              </div>
            </div>
          ))}

          {/* Maintenance Calendar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Subterranean Maintenance Calendar 2026</h3>
                  <p className="text-xs text-slate-500">Scheduled desilting, ultrasonic scans, and cathodic protection audits</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">GAIL Cathodic Protection Audit</div>
                <div className="text-[10px] text-slate-500">Date: Aug 18, 2026 • GAIL Team</div>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                  Scheduled
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">Jal Shakti Main Desilting</div>
                <div className="text-[10px] text-slate-500">Date: Sep 02, 2026 • Water Board</div>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800">
                  Confirmed
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">Transco Joint Thermal Resealing</div>
                <div className="text-[10px] text-slate-500">Date: Sep 15, 2026 • Transco Team</div>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                  High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
