import React, { useState } from 'react';
import { Project, RouteOption } from '../types';
import { ReportModal } from '../components/ReportModal';
import { FileSpreadsheet, Download, CheckCircle2, FileText, ArrowUpRight, Sparkles, Clock } from 'lucide-react';

interface ReportsPageProps {
  projects: Project[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const selectedRoute =
    selectedProject.routes.find((r) => r.id === selectedProject.selectedRouteId) ||
    selectedProject.routes[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Detailed Project Report (DPR) Central Vault
          </div>
          <h1 className="text-2xl font-black text-slate-900">GatiAI Official Reports</h1>
          <p className="text-xs text-slate-500">Generate, view, and export executive clearance DPR documents</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const route = proj.routes.find((r) => r.id === proj.selectedRouteId) || proj.routes[0];
          return (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {proj.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Ready for Stage-1
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-500">{proj.department}</p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Selected Route</div>
                  <div className="font-bold text-emerald-700">{route?.name}</div>
                  <div className="text-[11px] text-slate-700">
                    ₹{route?.estimatedCostCrores} Cr | {route?.distanceKm} km | {route?.constructionMonths} Mos
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProject(proj);
                  setShowReportModal(true);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Generate DPR Brief
              </button>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          project={selectedProject}
          selectedRoute={selectedRoute}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
