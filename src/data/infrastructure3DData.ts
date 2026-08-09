import { UndergroundUtilityType } from '../types/underground';

export interface InfrastructureProject3D {
  id: string;
  code: string;
  name: string;
  type: 'road' | 'water' | 'power' | 'telecom' | 'drainage' | 'rail' | 'building' | 'construction';
  department: string;
  departmentCode: string;
  budgetCrores: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  coords3D: [number, number, number]; // [x, y, z] in 3D world space
  depthMeters: number; // 0 for surface, negative for underground, positive for elevation
  aiRecommendation: string;
  conflictingProjectIds: string[];
  conflictDetails?: {
    score: number;
    delayDays: number;
    costImpactLakhs: number;
    type: string;
    description: string;
  };
}

export interface Infrastructure3DLayerState {
  roads: boolean;
  water: boolean;
  power: boolean;
  telecom: boolean;
  drainage: boolean;
  rail: boolean;
  buildings: boolean;
  construction: boolean;
  riskHeatmap: boolean;
  subterraneanView: boolean;
}

export interface SequenceStep {
  stepNumber: number;
  title: string;
  department: string;
  phase: string;
  durationWeeks: number;
  status: 'Unsynchronized' | 'AI Optimized' | 'In Execution';
  notes: string;
}

export const DEMO_CENTRAL_CORRIDOR_PROJECTS: InfrastructureProject3D[] = [
  {
    id: 'cc-proj-1',
    code: 'MORTH-NH91-2026',
    name: 'NH-91 Delhi-Noida-Dadri Expressway 6-Lane Expansion (Ch. 12+000 to 18+500)',
    type: 'road',
    department: 'Ministry of Road Transport & Highways (NHAI)',
    departmentCode: 'MoRTH',
    budgetCrores: 850,
    startDate: '2026-09-01',
    endDate: '2028-12-31',
    progressPercent: 35,
    riskLevel: 'Critical',
    riskScore: 91,
    coords3D: [0, 0, 0],
    depthMeters: 0,
    aiRecommendation: 'Defer surface paving at Ch. 14+200 by 21 days until Jal Shakti feeder pipe trenching & UPPTCL ducting are completed in joint corridor.',
    conflictingProjectIds: ['cc-proj-2', 'cc-proj-3'],
    conflictDetails: {
      score: 91,
      delayDays: 18,
      costImpactLakhs: 98,
      type: 'Expressway Expansion ↔ Bulk Water Feeder & Power Duct',
      description: 'Planned asphalt road excavation at NH-91 Dadri Junction overlaps with 450mm DI water feeder pipeline shifting and UPPTCL 33kV high-voltage power cable laying.',
    },
  },
  {
    id: 'cc-proj-2',
    code: 'JAL-DADRI-PIPE-2026',
    name: 'Dadri Multi-Modal Freight Hub Bulk Water Main (Jal Jeevan Mission)',
    type: 'water',
    department: 'Jal Shakti Ministry / UP Jal Nigam',
    departmentCode: 'JAL',
    budgetCrores: 240,
    startDate: '2026-08-15',
    endDate: '2027-06-30',
    progressPercent: 48,
    riskLevel: 'High',
    riskScore: 78,
    coords3D: [4, -3.5, 2],
    depthMeters: -3.5,
    aiRecommendation: 'Shift alignment by 2.2m southwards into green belt easement and lower depth to -5.5m to bypass NH-91 flyover bridge pier P-4 foundations.',
    conflictingProjectIds: ['cc-proj-1', 'cc-proj-4'],
    conflictDetails: {
      score: 78,
      delayDays: 14,
      costImpactLakhs: 65,
      type: 'Water Feeder Trunk ↔ BharatNet Fiber Spine',
      description: 'Proposed 450mm DI water main path directly crosses BSNL 288-core optical fiber duct bank at Dadri Ch. 14+200.',
    },
  },
  {
    id: 'cc-proj-3',
    code: 'POWER-33KV-DUCT-2026',
    name: 'UPPTCL Dadri Substation 33kV Underground Cable Duct Network',
    type: 'power',
    department: 'UP Power Transmission Corp (UPPTCL)',
    departmentCode: 'POWER',
    budgetCrores: 180,
    startDate: '2026-10-01',
    endDate: '2027-09-15',
    progressPercent: 20,
    riskLevel: 'Medium',
    riskScore: 58,
    coords3D: [-6, -5, -4],
    depthMeters: -5.0,
    aiRecommendation: 'Synchronize joint trenching with Jal Shakti pipe laying to share single excavation corridor at Ch. 14+200 and eliminate duplicate digging.',
    conflictingProjectIds: ['cc-proj-1'],
    conflictDetails: {
      score: 58,
      delayDays: 10,
      costImpactLakhs: 42,
      type: '33kV Cable Duct ↔ Expressway Foundation',
      description: 'Power duct trenching scheduled after road compaction would destroy newly laid sub-base at Dadri Junction.',
    },
  },
  {
    id: 'cc-proj-4',
    code: 'DOT-FIBER-SPINE-2026',
    name: 'BharatNet Dadri-Jewar Airport Armored Fiber Cable Spine',
    type: 'telecom',
    department: 'Department of Telecommunications (BSNL/BBNL)',
    departmentCode: 'DOT',
    budgetCrores: 95,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    progressPercent: 62,
    riskLevel: 'Medium',
    riskScore: 45,
    coords3D: [8, -2, -8],
    depthMeters: -2.0,
    aiRecommendation: 'Encase optical fiber bundle in HDPE armored conduit before Jal Shakti heavy machinery excavation begins near Sector 12.',
    conflictingProjectIds: ['cc-proj-2'],
  },
  {
    id: 'cc-proj-5',
    code: 'DRAIN-STORM-CULVERT-2026',
    name: 'Greater Noida Sector 12 Stormwater Trunk Drainage Culvert',
    type: 'drainage',
    department: 'Greater Noida Industrial Development Authority (GNIDA)',
    departmentCode: 'UID',
    budgetCrores: 130,
    startDate: '2026-06-01',
    endDate: '2027-03-31',
    progressPercent: 80,
    riskLevel: 'Low',
    riskScore: 22,
    coords3D: [-12, -8, 10],
    depthMeters: -8.0,
    aiRecommendation: 'Pre-cast concrete culverts installed at -8.0m depth. Vertical clearance verified with zero collision risks with surface highway.',
    conflictingProjectIds: [],
  },
  {
    id: 'cc-proj-6',
    code: 'METRO-AQUA-EXT-2026',
    name: 'Noida Metro Aqua Line Extension Underground Subterranean Tunnel',
    type: 'rail',
    department: 'Noida Metro Rail Corporation (NMRC / DMRC)',
    departmentCode: 'MOR',
    budgetCrores: 1450,
    startDate: '2025-01-10',
    endDate: '2028-06-30',
    progressPercent: 55,
    riskLevel: 'Low',
    riskScore: 28,
    coords3D: [0, -15, 0],
    depthMeters: -15.0,
    aiRecommendation: 'Tunnel Boring Machine (TBM) operating at -15.0m in bedrock. Safe buffer of 7m beneath storm drainage and utility ducts.',
    conflictingProjectIds: [],
  },
];

export const DEMO_BEFORE_SEQUENCE: SequenceStep[] = [
  {
    stepNumber: 1,
    title: 'MoRTH Road Paving & Asphalt Sub-base',
    department: 'Ministry of Road Transport',
    phase: 'Phase A',
    durationWeeks: 6,
    status: 'Unsynchronized',
    notes: 'Paves road surface first without underground utility clearances.',
  },
  {
    stepNumber: 2,
    title: 'Jal Shakti 450mm Feeder Trench Excavation',
    department: 'Jal Shakti Water',
    phase: 'Phase B',
    durationWeeks: 4,
    status: 'Unsynchronized',
    notes: 'Breaks freshly laid road asphalt to dig water feeder trench (₹98L waste).',
  },
  {
    stepNumber: 3,
    title: 'Power Grid 33kV Cable Ducting Digging',
    department: 'Ministry of Power',
    phase: 'Phase C',
    durationWeeks: 3,
    status: 'Unsynchronized',
    notes: 'Digs parallel trench 2 weeks later causing 2nd traffic blockade.',
  },
];

export const DEMO_AI_OPTIMIZED_SEQUENCE: SequenceStep[] = [
  {
    stepNumber: 1,
    title: 'Joint Sub-Surface Conduit Trenching (Power & Water)',
    department: 'Power Grid & Jal Shakti Joint Venture',
    phase: 'Phase 1 (Synchronized)',
    durationWeeks: 4,
    status: 'AI Optimized',
    notes: 'Single shared excavation for 33kV power ducts and 450mm water feeder at -4.5m.',
  },
  {
    stepNumber: 2,
    title: 'HDPE Fiber Armoring & Drainage Culvert Tie-in',
    department: 'DoT & Urban Drainage',
    phase: 'Phase 2 (Synchronized)',
    durationWeeks: 2,
    status: 'AI Optimized',
    notes: 'Utility duct bank sealed and backfilled with soil compaction testing.',
  },
  {
    stepNumber: 3,
    title: 'MoRTH 6-Lane Surface Asphalt Compaction & Paving',
    department: 'Ministry of Road Transport',
    phase: 'Phase 3 (Final)',
    durationWeeks: 5,
    status: 'AI Optimized',
    notes: 'Final road surface laid ONCE over fully completed utility corridor (Zero re-excavation).',
  },
];
