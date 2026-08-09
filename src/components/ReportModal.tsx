import React, { useState, useEffect } from 'react';
import { Project, RouteOption, ProjectReport } from '../types';
import { FileText, Download, X, CheckCircle2, Sparkles, Printer, Layers, Building2, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  project: Project;
  selectedRoute: RouteOption;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ project, selectedRoute, onClose }) => {
  const [reportData, setReportData] = useState<ProjectReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project, route: selectedRoute }),
        });
        const data = await res.json();
        if (data.report) {
          setReportData({
            id: `rep-${Date.now()}`,
            projectId: project.id,
            projectTitle: project.title,
            generatedAt: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            generatedBy: 'GatiAI National Master Plan Engine',
            executiveSummary: data.report.executiveSummary,
            routeComparisonSummary: data.report.routeComparisonSummary,
            riskAssessmentSummary: data.report.riskAssessmentSummary,
            environmentalClearanceSummary: data.report.environmentalClearanceSummary,
            recommendedRouteName: selectedRoute.name,
            estimatedCost: `₹${selectedRoute.estimatedCostCrores.toLocaleString('en-IN')} Cr`,
            estimatedTime: `${selectedRoute.constructionMonths} Months`,
            roiEstimate: data.report.roiEstimate || '18.5% Internal Rate of Return (IRR)',
            approvalChecklist: [
              { task: 'Stage-1 Forest Clearance (FC-1)', status: 'completed', department: 'MoEFCC' },
              { task: 'NHAI Grade Separation Interchange Authorization', status: 'completed', department: 'NHID' },
              { task: 'Inland Waterways Dredging Permit', status: 'pending', department: 'IWAI' },
              { task: 'State Railway Safety Inspector Certification', status: 'required', department: 'Indian Railways' },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to generate report', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [project, selectedRoute]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto print:max-w-none print:w-full print:h-auto print:static print:bg-white print:text-black font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">GatiAI Detailed Project Report (DPR)</h3>
              <p className="text-xs text-slate-500">Government Decision Support & Executive Clearance Brief</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" /> Export PDF / Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 print:text-slate-900 print:p-8">
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <Sparkles className="w-10 h-10 text-emerald-600 mx-auto animate-spin" />
              <div className="text-sm font-bold text-slate-900">Synthesizing Official GatiAI DPR...</div>
              <p className="text-xs text-slate-500">Cross-analyzing spatial GIS data, cost metrics, and environmental clearance requirements.</p>
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              {/* Official Header Banner */}
              <div className="border-b-2 border-emerald-600 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
                    GatiAI Multi-Modal Infrastructure Master Plan
                  </div>
                  <h1 className="text-xl font-extrabold text-slate-900 mt-0.5 print:text-black">{project.title}</h1>
                  <p className="text-xs text-slate-500">Project Code: {project.code} | Department: {project.department}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-700">Date: {reportData.generatedAt}</div>
                  <div className="text-slate-500">GatiAI Confidence: {selectedRoute.confidenceScore}%</div>
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center print:bg-slate-100 print:border-slate-300">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Selected Alignment</div>
                  <div className="text-xs font-extrabold text-emerald-700 mt-0.5">{selectedRoute.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total Capital Outlay</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5 print:text-black">{reportData.estimatedCost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Completion Horizon</div>
                  <div className="text-xs font-extrabold text-slate-900 mt-0.5 print:text-black">{reportData.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Projected ROI</div>
                  <div className="text-xs font-extrabold text-teal-700 mt-0.5">{reportData.roiEstimate}</div>
                </div>
              </div>

              {/* Executive Summary Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 1. Executive Rationale & Decision Matrix
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-white print:border-slate-200 print:text-black">
                  {reportData.executiveSummary}
                </p>
              </div>

              {/* Route & Spatial Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 2. Multi-Modal Alignment & Spatial Evaluation
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 print:bg-white print:border-slate-200 print:text-black">
                  {reportData.routeComparisonSummary}
                </p>
              </div>

              {/* Risk & Environmental Clearance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Delay & Budget Risk Assessment
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-normal">
                    {reportData.riskAssessmentSummary}
                  </p>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Environmental Clearance Roadmap
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-normal">
                    {reportData.environmentalClearanceSummary}
                  </p>
                </div>
              </div>

              {/* Inter-Departmental Approval Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> 3. Inter-Departmental Approval Clearance Matrix
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Clearance Protocol</th>
                        <th className="p-2.5">Authority</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {reportData.approvalChecklist.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-medium text-slate-800 print:text-black">{item.task}</td>
                          <td className="p-2.5 text-slate-500">{item.department}</td>
                          <td className="p-2.5 text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                item.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Seal / Signature Placeholder */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  Verified by: <strong>GatiAI Multi-Modal Spatial Optimization Engine v3.6</strong>
                </div>
                <div className="text-right">
                  Authorized Signatory: <strong>GatiAI National Secretariat</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">Failed to load report parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
};
