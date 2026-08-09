import React, { useState } from 'react';
import { Project, User } from '../types';
import {
  Layers,
  MapPin,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  CloudRain,
  DollarSign,
  Award,
  Zap,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Download,
  Sliders,
} from 'lucide-react';
import { WeatherWidget } from '../components/WeatherWidget';
import { BudgetSavingsCalculator } from '../components/BudgetSavingsCalculator';
import { AIPlannerRecommendations } from '../components/AIPlannerRecommendations';
import { PriorityScoreGauge } from '../components/PriorityScoreGauge';
import { GanttTimeline } from '../components/GanttTimeline';
import { DepartmentLeaderboard } from '../components/DepartmentLeaderboard';
import { ScenarioSimulatorModal } from '../components/ScenarioSimulatorModal';
import { GatiSenseLiveDetectorPanel } from '../components/GatiSenseLiveDetectorPanel';
import { detectGatiSenseConflicts } from '../utils/gatiSenseConflictDetector';
import { DEPARTMENT_LEADERBOARD } from '../data/mockData';
import { generateProjectPDF } from '../utils/pdfGenerator';

interface DashboardPageProps {
  projects: Project[];
  currentUser: User;
  onSelectProject: (proj: Project) => void;
  onOpenPlanner: () => void;
  onCreateProject: (projData: Partial<Project>) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenPlanner,
  onCreateProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScenarioSim, setShowScenarioSim] = useState(false);
  const [simProject, setSimProject] = useState<Project>(projects[0] || {} as any);

  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('Delhi NCR (Dadri Logistics Hub)');
  const [newDest, setNewDest] = useState('Mumbai (JNPT Port)');
  const [newType, setNewType] = useState<'highway' | 'railway' | 'multimodal'>('highway');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === 'all' || p.state === selectedState;
    return matchesSearch && matchesState;
  });

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetCrores, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spentCrores, 0);
  const totalSavingsCrores = Math.round(totalBudget * 0.14);

  // GatiSense Automatic 500m Proximity & Temporal Conflict Detection
  const gatiSenseAlerts = detectGatiSenseConflicts(projects, 500);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onCreateProject({
      title: newTitle,
      sourceCity: newSource,
      destinationCity: newDest,
      infrastructureType: newType,
      department: currentUser.department,
      budgetCrores: 9500,
      assignedLead: currentUser.name,
      sourceCoords: [28.5528, 77.5539],
      destinationCoords: [18.9500, 72.9500],
    });

    setNewTitle('');
    setShowCreateModal(false);
    onOpenPlanner();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Executive Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg text-white">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-emerald-100 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" /> PM Gati Shakti National Master Plan Portal
          </div>
          <h1 className="text-2xl font-black text-white">
            National Multi-Modal Infrastructure Corridor Hub
          </h1>
          <p className="text-xs text-emerald-100/80">
            {currentUser.department} • Inter-Agency Master Plan & Spatial GIS Platform
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSimProject(projects[0]);
              setShowScenarioSim(true);
            }}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <Sliders className="w-4 h-4 text-amber-300" /> Scenario Simulator
          </button>

          <button
            onClick={() => generateProjectPDF(projects[0])}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-200" /> Export DPR Report (PDF)
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Launch Corridor
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-slate-500 text-xs font-semibold">Total Active Corridors</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{projects.length}</div>
          <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3 h-3" /> 100% GIS Synced
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-slate-500 text-xs font-semibold">Combined Outlay</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{totalBudget.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')} Cr Allocated
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-slate-500 text-xs font-semibold">AI Coordination Savings</div>
          <div className="text-2xl font-black text-teal-700 mt-1">
            ₹{totalSavingsCrores.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-teal-800 mt-1 flex items-center gap-1 font-semibold">
            <TrendingDown className="w-3 h-3" /> Zero Rework Penalty
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
          <div className="text-slate-500 text-xs font-semibold">GatiSense Auto Conflicts</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{gatiSenseAlerts.length} Active</div>
          <div className="text-[10px] text-rose-700 mt-1 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" /> 500m & Temporal Alerts
          </div>
        </div>
      </div>

      {/* GATISENSE AUTOMATIC 500m & TEMPORAL CONFLICT DETECTOR PANEL */}
      <GatiSenseLiveDetectorPanel
        alerts={gatiSenseAlerts}
        onSelectProjectOnMap={(pId) => {
          const proj = projects.find((p) => p.id === pId);
          if (proj) onSelectProject(proj);
          onOpenPlanner();
        }}
      />

      {/* UNDERGROUND UTILITY DIGITAL TWIN QUICK BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> NEW: Sub-surface 3D Digital Twin Active
          </div>
          <h3 className="text-lg font-black text-white">AI Underground Utility Intelligence Engine</h3>
          <p className="text-xs text-slate-300">
            Map buried water mains, 66kV power cables, GAIL natural gas pipelines, and NKN optical fiber in 3D prior to excavation to eliminate utility cut penalty costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPlanner()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-white" /> Open 3D Underground Twin
          </button>
        </div>
      </div>

      {/* FEATURE 2: WEATHER & MONSOON PREDICTION */}
      <WeatherWidget prediction={projects[0]?.weatherPrediction} />

      {/* FEATURE 3: BUDGET SAVINGS CALCULATOR */}
      <BudgetSavingsCalculator projects={projects} />

      {/* FEATURE 8: INTERACTIVE GANTT TIMELINE */}
      <GanttTimeline projects={projects} />

      {/* FEATURE 4 & FEATURE 5 ROW */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AIPlannerRecommendations project={projects[0]} />
        <PriorityScoreGauge scoreData={projects[0]?.priorityScore} projectTitle={projects[0]?.title} />
      </div>

      {/* MINISTRY LEADERBOARD */}
      <DepartmentLeaderboard metrics={DEPARTMENT_LEADERBOARD} />

      {/* Active Corridors Section with State & Search Filter */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Infrastructure Corridors</h2>
            <p className="text-xs text-slate-500">Click a project card to view Leaflet GIS map & spatial routing</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 shadow-2xs font-semibold"
            >
              <option value="all">All Indian States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Assam">Assam</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search corridors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const activeRoute = proj.routes.find((r) => r.id === proj.selectedRouteId) || proj.routes[0];
            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onOpenPlanner();
                }}
                className="p-5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-400 transition-all cursor-pointer group space-y-3 shadow-2xs hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    {proj.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      proj.riskLevel === 'High' || proj.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : proj.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {proj.riskLevel} Risk
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                    <span>{proj.department}</span>
                    {proj.state && <span className="font-semibold text-emerald-700">{proj.state}</span>}
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {proj.sourceCity.split(' ')[0]}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" /> {proj.destinationCity.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[9px] uppercase font-bold">Est. Outlay</div>
                    <div className="font-bold text-slate-900">₹{proj.budgetCrores.toLocaleString('en-IN')} Cr</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[9px] uppercase font-bold">Recommended</div>
                    <div className="font-bold text-emerald-700 truncate">{activeRoute?.name || 'Route B'}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-emerald-700">
                  <span>Open GIS Planner</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Simulation Modal */}
      {showScenarioSim && (
        <ScenarioSimulatorModal project={simProject} onClose={() => setShowScenarioSim(false)} />
      )}

      {/* Create New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-emerald-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Corridor Project</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visakhapatnam to Amaravati Industrial Multi-Modal Corridor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Infrastructure Mode</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="highway">Access-Controlled Highway / Expressway</option>
                  <option value="railway">Freight Railway Line</option>
                  <option value="multimodal">Multi-modal Freight Corridor</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Origin Node</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Destination Terminal</label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Generate AI Routes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
