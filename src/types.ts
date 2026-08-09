export type UserRole = 'planner' | 'environmental_officer' | 'logistics_head' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export interface GISPoint {
  lat: number;
  lng: number;
  name?: string;
}

export type InfrastructureType = 'highway' | 'railway' | 'multimodal' | 'waterway' | 'pipeline';

export interface StepPlanItem {
  stepNumber: number;
  title: string;
  dept: string;
  durationDays: number;
  action: string;
  status: 'Pre-Approved' | 'Synchronized' | 'Pending' | 'Ready' | 'In Progress';
}

export interface DetailedConflictResolution {
  conflictId: string;
  conflictSummary: string;
  reasonOfConflict: string;
  departmentsInvolved: string[];
  estimatedImpact: string;
  delayProbability: number; // percentage
  budgetImpactCrores: number;
  recommendedResolution: string;
  stepByStepPlan: StepPlanItem[];
  alternativeSchedule: string;
  expectedSavingsCrores: number;
  timeSavedDays: number;
  riskAfterResolution: 'Low' | 'Medium' | 'High';
  confidenceScore: number;
}

export interface ConflictZone {
  id: string;
  name: string;
  type: 'forest' | 'river' | 'protected_area' | 'urban' | 'highway_crossing' | 'railway_crossing' | 'utility_corridor' | 'airport_buffer';
  severity: 'high' | 'medium' | 'low';
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  impactScore: number; // 1-100
  mitigationSuggestion: string;
  detailedResolution?: DetailedConflictResolution;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'shortest' | 'eco_friendly' | 'infrastructure_optimized' | 'cost_optimized';
  color: string;
  dashArray?: string;
  distanceKm: number;
  estimatedCostCrores: number;
  constructionMonths: number;
  terrainDifficulty: 'Low' | 'Moderate' | 'High' | 'Very High';
  terrainDifficultyScore: number; // 1-100
  environmentalImpactScore: number; // 1-100 (lower is better eco)
  travelEfficiencyScore: number; // 1-100 (higher is better)
  landAcquisitionComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Severe';
  landAcquisitionScore: number; // 1-100
  delayProbability: number; // percentage e.g. 18%
  budgetOverrunRisk: number; // percentage e.g. 12%
  approvalRiskScore: number; // 1-100
  co2EmissionsTonsPerYear: number;
  confidenceScore: number; // 1-100 (AI recommendation confidence)
  isRecommended: boolean;
  recommendationReason: string;
  waypoints: [number, number][]; // Array of [lat, lng]
  conflicts: ConflictZone[];
  elevationProfile: { distance: number; elevation: number }[];
}

export interface GanttMilestone {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  completionPercent: number;
  department: string;
  hasConflict?: boolean;
  dependencies?: string[];
}

export interface PriorityFactor {
  name: string;
  score: number;
  weight: number;
  impact: string;
}

export interface PriorityScoreBreakdown {
  score: number; // 0-100
  label: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendation: string;
  factors: PriorityFactor[];
}

export interface WeatherPrediction {
  location: string;
  currentTempC: number;
  condition: string;
  rainProbability7Days: number;
  windSpeedKmh: number;
  monsoonAlertLevel: 'Safe to Start' | 'Moderate Risk' | 'High Risk' | 'Critical Delay Expected';
  asphaltRecommendation: string;
  suggestedStartDate: string;
  costImpactPercent: number;
  delayDays: number;
  forecast7Days: { day: string; temp: number; rainProb: number; condition: string }[];
}

export interface Project {
  id: string;
  title: string;
  code: string;
  department: string;
  infrastructureType: InfrastructureType;
  state?: string; // e.g. "Andhra Pradesh", "Maharashtra", "Gujarat", "Delhi NCR"
  sourceCity: string;
  destinationCity: string;
  sourceCoords: [number, number];
  destinationCoords: [number, number];
  status: 'planning' | 'under_review' | 'approved' | 'in_execution' | 'delayed' | 'completed';
  budgetCrores: number;
  spentCrores: number;
  timelineMonths: number;
  startDate: string;
  completionDate: string;
  assignedLead: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  priorityScore?: PriorityScoreBreakdown;
  weatherPrediction?: WeatherPrediction;
  selectedRouteId?: string;
  routes: RouteOption[];
  ganttMilestones?: GanttMilestone[];
  description: string;
  lastUpdated: string;
}

export type MapTileMode = 'dark' | 'satellite' | 'terrain' | 'hybrid';

export * from './types/underground';

export interface GISLayerState {
  forests: boolean;
  rivers: boolean;
  protectedAreas: boolean;
  existingHighways: boolean;
  railwayNetwork: boolean;
  airports: boolean;
  urbanClusters: boolean;
  utilityCorridors: boolean;
  weatherRadar: boolean;
  trafficCongestion: boolean;
  constructionActivity: boolean;
  conflictHeatmap: boolean;
  // Underground 3D/2D Layer Toggles
  undergroundView?: boolean;
  ugWater?: boolean;
  ugSewer?: boolean;
  ugGas?: boolean;
  ugPower?: boolean;
  ugFiber?: boolean;
  ugMetro?: boolean;
  ugPlanned?: boolean;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  type: 'conflict' | 'weather' | 'budget' | 'delay' | 'resolution' | 'report' | 'ai_plan';
  read: boolean;
  projectId?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionExecuted?: string;
  widgetData?: any;
}

export interface ProjectReport {
  id: string;
  projectId: string;
  projectTitle: string;
  generatedAt: string;
  generatedBy: string;
  executiveSummary: string;
  routeComparisonSummary: string;
  riskAssessmentSummary: string;
  environmentalClearanceSummary: string;
  recommendedRouteName: string;
  estimatedCost: string;
  estimatedTime: string;
  roiEstimate: string;
  approvalChecklist: { task: string; status: 'completed' | 'pending' | 'required'; department: string }[];
}

export interface ExecutionPlanSequence {
  week: number;
  title: string;
  dept: string;
  phase: string;
  bufferDays: number;
  status: string;
}

export interface DepartmentPerfMetric {
  department: string;
  code: string;
  activeProjects: number;
  onTimeRate: number; // percentage
  conflictsResolved: number;
  savingsGeneratedCrores: number;
  rank: number;
}
