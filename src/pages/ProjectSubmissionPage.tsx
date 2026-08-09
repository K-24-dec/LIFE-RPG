import React, { useState } from 'react';
import { GOVERNMENT_DEPARTMENTS } from '../data/departmentData';
import { FullProjectSubmission, AIProjectAnalysis } from '../types/department';
import {
  FilePlus,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Wrench,
  Layers,
  Paperclip,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  ShieldCheck,
  Zap,
  Droplets,
  Flame,
  Radio,
  Train,
  Check,
  FileText,
} from 'lucide-react';

interface ProjectSubmissionPageProps {
  onSubmitSuccess: (newProject: FullProjectSubmission) => void;
  onCancel: () => void;
}

export const ProjectSubmissionPage: React.FC<ProjectSubmissionPageProps> = ({
  onSubmitSuccess,
  onCancel,
}) => {
  // Form States
  const [name, setName] = useState('');
  const [projectIdCode, setProjectIdCode] = useState(`GATIAI-${Math.floor(1000 + Math.random() * 9000)}-2026`);
  const [departmentId, setDepartmentId] = useState(GOVERNMENT_DEPARTMENTS[0].id);
  const [category, setCategory] = useState('Corridor Widening & Ducting');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [description, setDescription] = useState('');

  // Location
  const [stateName, setStateName] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Krishna');
  const [city, setCity] = useState('Vijayawada');
  const [village, setVillage] = useState('Kankipadu');
  const [lat, setLat] = useState(16.5062);
  const [lng, setLng] = useState(80.6480);
  const [boundaryRadius, setBoundaryRadius] = useState(500);

  // Timeline
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2027-05-31');
  const [durationMonths, setDurationMonths] = useState(9);

  // Budget
  const [estimatedCost, setEstimatedCost] = useState(120);
  const [allocatedBudget, setAllocatedBudget] = useState(120);
  const [fundingSource, setFundingSource] = useState('Central Master Plan Infra Grant');

  // Resources
  const [machinery, setMachinery] = useState('CAT Excavators, Trenchless HDD Machine, GPR Scanner');
  const [labour, setLabour] = useState(120);
  const [contractor, setContractor] = useState('Larsen & Toubro Ltd.');
  const [materials, setMaterials] = useState('Concrete Box Culverts, HDPE Ducts, Steel Rebars');

  // Underground Utility Checkboxes
  const [waterPipeline, setWaterPipeline] = useState(true);
  const [gasPipeline, setGasPipeline] = useState(false);
  const [electricCable, setElectricCable] = useState(true);
  const [fiberCable, setFiberCable] = useState(true);
  const [drainage, setDrainage] = useState(true);
  const [sewer, setSewer] = useState(false);
  const [metroTunnel, setMetroTunnel] = useState(false);
  const [utilityCorridor, setUtilityCorridor] = useState(true);

  // Attachments simulation
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'Project_Proposal_DPR_v1.pdf',
    'CAD_SubSurface_Layout_2026.dwg',
    'GPR_Soil_Survey_Report.pdf',
  ]);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIProjectAnalysis | null>(null);

  const selectedDeptObj = GOVERNMENT_DEPARTMENTS.find((d) => d.id === departmentId) || GOVERNMENT_DEPARTMENTS[0];

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Simulate real-time GatiAI spatial scan
      const affectedDepts = ['Road Transport & Highways Department'];
      if (waterPipeline) affectedDepts.push('Water Supply Department (Jal Shakti)');
      if (gasPipeline) affectedDepts.push('Gas Pipeline Authority (GAIL Grid)');
      if (electricCable) affectedDepts.push('Electricity & Power Grid Department');
      if (fiberCable) affectedDepts.push('Fiber Optic & BharatNet Authority');

      const mockAnalysis: AIProjectAnalysis = {
        conflictCount: affectedDepts.length - 1,
        affectedDepartments: affectedDepts,
        weatherRiskLevel: 'Moderate',
        budgetOptimizationSavingsCrores: Math.round(estimatedCost * 0.16 * 10) / 10,
        priorityScore: 93,
        suggestedTimelineMonths: Math.max(3, durationMonths - 1.5),
        departmentDependencies: [
          { dept: 'Water Supply Department (Jal Shakti)', task: 'Verify 350mm main feeder clearance', delayRiskPercent: 8 },
          { dept: 'Electricity & Power Grid Department', task: 'Joint trenching for 33kV cable', delayRiskPercent: 11 },
        ],
        safetyReportChecklist: [
          'Compulsory GPR ground scan prior to heavy excavation',
          'Deploy gas leak detection monitors if within 20m of GAIL trunk line',
          'Notify Power Grid load dispatch prior to drilling near 33kV cables',
        ],
        undergroundUtilityCollisions: waterPipeline
          ? [
              { utility: '350mm Jal Shakti Feeder Line', depthMeters: 1.4, risk: 'High Proximity' },
              { utility: '33kV Power Grid Cable', depthMeters: 1.8, risk: 'Direct Clashing' },
            ]
          : [],
        aiRecommendations: [
          `Shift trenching axis by 2.0 meters East into utility buffer strip to avoid 33kV cable.`,
          `Synchronize fiber duct placement with water pipe encasing for single joint excavation.`,
          `Estimated budget savings of ₹${(estimatedCost * 0.16).toFixed(1)} Crores achieved through joint procurement.`,
        ],
        confidencePercent: 96,
      };

      setAiResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: FullProjectSubmission = {
      id: `proj-sub-${Date.now()}`,
      projectIdCode,
      name,
      description: description || 'Multi-modal government infrastructure project.',
      departmentId,
      departmentName: selectedDeptObj.name,
      category,
      priority,
      status: 'Department Review',

      state: stateName,
      district,
      city,
      village,
      lat,
      lng,
      boundaryRadiusMeters: boundaryRadius,

      startDate,
      endDate,
      expectedDurationMonths: durationMonths,
      completionPercentage: 0,

      estimatedCostCrores: estimatedCost,
      allocatedBudgetCrores: allocatedBudget,
      fundingSource,
      expectedSavingsCrores: aiResult ? aiResult.budgetOptimizationSavingsCrores : 0,

      resources: {
        machineryRequired: machinery.split(',').map((s) => s.trim()),
        labourCount: labour,
        contractorName: contractor,
        materialsList: materials.split(',').map((s) => s.trim()),
      },

      undergroundChecklist: {
        waterPipeline,
        gasPipeline,
        electricCable,
        fiberCable,
        drainage,
        sewer,
        metroTunnel,
        utilityCorridor,
      },

      attachments: uploadedFiles.map((fn, idx) => ({
        id: `att-${idx}`,
        name: fn,
        type: fn.endsWith('.dwg') ? 'cad_drawing' : 'proposal_pdf',
        fileUrl: '#',
        uploadedBy: selectedDeptObj.headName,
        uploadedAt: new Date().toISOString().split('T')[0],
        sizeMb: 5.4,
      })),

      aiAnalysis: aiResult || undefined,

      comments: [
        {
          id: `cmt-${Date.now()}`,
          projectId: `proj-sub-${Date.now()}`,
          userId: 'usr-admin',
          userName: selectedDeptObj.headName,
          userRole: 'Department Admin',
          departmentName: selectedDeptObj.name,
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          text: 'Project submitted to the Central Master Plan Portal. Pending cross-department AI validation.',
          mentionedDepartments: [],
          timestamp: 'Just now',
        },
      ],

      approvalHistory: [
        {
          id: `app-init-${Date.now()}`,
          stage: 'Draft',
          departmentName: selectedDeptObj.name,
          actionBy: selectedDeptObj.headName,
          actionByRole: 'Department Admin',
          status: 'Approved',
          remarks: 'Project created and verified.',
          timestamp: new Date().toLocaleString(),
        },
      ],

      collaborationRequests: aiResult
        ? aiResult.affectedDepartments
            .filter((d) => d !== selectedDeptObj.name)
            .map((targetDept, idx) => ({
              id: `collab-${Date.now()}-${idx}`,
              projectId: `proj-sub-${Date.now()}`,
              projectTitle: name,
              requestingDepartment: selectedDeptObj.name,
              targetDepartment: targetDept,
              requestType: 'Right of Way Clearance' as const,
              status: 'Pending' as const,
              urgency: priority === 'Critical' ? 'Critical' : 'High',
              details: `Auto-generated clearance request for sub-surface utility alignment near ${city}.`,
              requestedDate: new Date().toISOString().split('T')[0],
            }))
        : [],

      createdDate: new Date().toISOString().split('T')[0],
      lastUpdatedDate: new Date().toISOString().split('T')[0],
    };

    onSubmitSuccess(newProject);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <FilePlus className="w-4 h-4 text-emerald-400" /> New Government Project Registration
          </div>
          <h1 className="text-2xl font-black text-white">Submit Infrastructure Master Plan</h1>
          <p className="text-xs text-slate-300">
            Official multi-department submission portal with real-time AI cross-department collision scan & utility analysis
          </p>
        </div>

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors self-start md:self-auto"
        >
          Back to Portal
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: BASIC DETAILS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">1. Basic Project Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. NH-16 Service Road & Fiber Optic Trenching Line"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Project Code (ID)</label>
              <input
                type="text"
                value={projectIdCode}
                onChange={(e) => setProjectIdCode(e.target.value)}
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl font-mono text-emerald-700 font-extrabold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Submitting Department *</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 text-xs"
              >
                {GOVERNMENT_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Project Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Mass Transit, Highway, Water Trunk Line"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="Critical">🚨 Critical Priority</option>
                <option value="High">⚡ High Priority</option>
                <option value="Medium">🔹 Medium Priority</option>
                <option value="Low">🔸 Low Priority</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="block font-bold text-slate-700">Project Description & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the multi-modal alignment scope, right-of-way width, and expected civic impact..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATION & GEOGRAPHIC PIN */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">2. Geographic Location & GIS Coordinates</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">City / Industrial Hub</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Village / Sector</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Latitude (°N)</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Longitude (°E)</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Buffer Boundary Radius (Meters)</label>
              <input
                type="number"
                value={boundaryRadius}
                onChange={(e) => setBoundaryRadius(parseInt(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TIMELINE, BUDGET & RESOURCES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">3. Timeline & Duration</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Target End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="block font-bold text-slate-700">Expected Duration (Months)</label>
                <input
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseFloat(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900">4. Budget & Funding</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Estimated Cost (₹ Cr)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(parseFloat(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Allocated Budget (₹ Cr)</label>
                <input
                  type="number"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(parseFloat(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-emerald-700"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="block font-bold text-slate-700">Funding Source / Ministry Scheme</label>
                <input
                  type="text"
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: SUB-SURFACE UNDERGROUND UTILITIES CHECKLIST */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">5. Underground Utilities Checkboxes & Sub-surface Ducts</h3>
          </div>

          <p className="text-xs text-slate-500">
            Check all existing or planned subterranean utility assets present within the 500m project corridor:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${waterPipeline ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={waterPipeline} onChange={(e) => setWaterPipeline(e.target.checked)} className="rounded text-emerald-600" />
              <Droplets className="w-4 h-4 text-sky-600" /> Water Pipeline
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${gasPipeline ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={gasPipeline} onChange={(e) => setGasPipeline(e.target.checked)} className="rounded text-emerald-600" />
              <Flame className="w-4 h-4 text-amber-600" /> Gas Pipeline
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${electricCable ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={electricCable} onChange={(e) => setElectricCable(e.target.checked)} className="rounded text-emerald-600" />
              <Zap className="w-4 h-4 text-amber-500" /> Electric Power Cable
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${fiberCable ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={fiberCable} onChange={(e) => setFiberCable(e.target.checked)} className="rounded text-emerald-600" />
              <Radio className="w-4 h-4 text-purple-600" /> Fiber Optic Cable
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${drainage ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={drainage} onChange={(e) => setDrainage(e.target.checked)} className="rounded text-emerald-600" />
              <Layers className="w-4 h-4 text-teal-600" /> Storm Drainage
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${sewer ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={sewer} onChange={(e) => setSewer(e.target.checked)} className="rounded text-emerald-600" />
              <Wrench className="w-4 h-4 text-slate-600" /> Sewer Line
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${metroTunnel ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={metroTunnel} onChange={(e) => setMetroTunnel(e.target.checked)} className="rounded text-emerald-600" />
              <Train className="w-4 h-4 text-indigo-600" /> Metro Tunnel
            </label>

            <label className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${utilityCorridor ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <input type="checkbox" checked={utilityCorridor} onChange={(e) => setUtilityCorridor(e.target.checked)} className="rounded text-emerald-600" />
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Shared Utility Corridor
            </label>
          </div>
        </div>

        {/* SECTION 5: AI ANALYSIS ENGINE BUTTON */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white border border-emerald-700/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> GatiAI Intelligent Cross-Department Scan
              </div>
              <h3 className="text-lg font-black text-white mt-1">Run Real-time AI Collision & Risk Analysis</h3>
              <p className="text-xs text-emerald-100/80">
                Detects utility clashes across all 10 departments, calculates weather impact, and optimizes budget savings before submitting
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Scanning GIS Twin...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run AI Analysis Engine
                </>
              )}
            </button>
          </div>

          {/* AI Analysis Result Display */}
          {aiResult && (
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-500/30 text-xs space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Affected Departments</div>
                  <div className="text-lg font-black text-emerald-400">{aiResult.affectedDepartments.length}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Sub-surface Clashes</div>
                  <div className="text-lg font-black text-rose-400">{aiResult.undergroundUtilityCollisions.length}</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Expected Cost Savings</div>
                  <div className="text-lg font-black text-emerald-400">₹{aiResult.budgetOptimizationSavingsCrores} Cr</div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">AI Confidence Score</div>
                  <div className="text-lg font-black text-indigo-400">{aiResult.confidencePercent}%</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-emerald-300 uppercase text-[10px]">AI Strategic Recommendations:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-200">
                  {aiResult.aiRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit Official Project to Master Secretariat
          </button>
        </div>
      </form>
    </div>
  );
};
