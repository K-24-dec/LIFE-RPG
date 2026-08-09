export type DepartmentRole =
  | 'Super Admin'
  | 'Department Admin'
  | 'Director General'
  | 'Joint Secretary'
  | 'Chief Engineer'
  | 'Project Manager'
  | 'Engineer'
  | 'Field Officer'
  | 'Viewer';

export interface GovernmentDepartment {
  id: string;
  code: string;
  name: string;
  hindiName?: string;
  iconName: string;
  headName: string;
  email: string;
  phone: string;
  activeProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  delayedProjects: number;
  allocatedBudgetCrores: number;
  usedBudgetCrores: number;
  pendingApprovalsCount: number;
  activeConflictsCount: number;
  weatherAlertsCount: number;
  aiEfficiencyScore: number; // 0 - 100
  performanceScore: number; // 0 - 100
  maintenanceDueCount: number;
}

export interface DepartmentUser {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName: string;
  role: DepartmentRole;
  avatar: string;
  phone: string;
  badgeNumber: string;
}

export type ApprovalStage =
  | 'Draft'
  | 'Department Review'
  | 'AI Validation'
  | 'Conflict Resolution'
  | 'Budget Approval'
  | 'Final Approval'
  | 'Execution'
  | 'Completed';

export interface UndergroundUtilityChecklist {
  waterPipeline: boolean;
  gasPipeline: boolean;
  electricCable: boolean;
  fiberCable: boolean;
  drainage: boolean;
  sewer: boolean;
  metroTunnel: boolean;
  utilityCorridor: boolean;
  layoutFileName?: string;
}

export interface ProjectResourceAllocation {
  machineryRequired: string[];
  labourCount: number;
  contractorName: string;
  materialsList: string[];
}

export interface ProjectAttachment {
  id: string;
  name: string;
  type: 'proposal_pdf' | 'cad_drawing' | 'survey_report' | 'env_clearance' | 'tender' | 'image' | 'video';
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  sizeMb: number;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: DepartmentRole;
  departmentName: string;
  userAvatar: string;
  text: string;
  mentionedDepartments: string[];
  timestamp: string;
  attachmentName?: string;
}

export interface ApprovalHistoryItem {
  id: string;
  stage: ApprovalStage;
  departmentName: string;
  actionBy: string;
  actionByRole: DepartmentRole;
  status: 'Approved' | 'Rejected' | 'Changes Requested' | 'In Review';
  remarks: string;
  timestamp: string;
}

export interface InterDeptCollaborationRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  requestingDepartment: string;
  targetDepartment: string;
  requestType: 'Right of Way Clearance' | 'Utility Shift Permission' | 'Joint Excavation Schedule' | 'Environmental NOC' | 'Safety Inspection';
  status: 'Pending' | 'Approved' | 'Declined' | 'Clarification Requested';
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  details: string;
  requestedDate: string;
  responseDate?: string;
  responseNote?: string;
}

export interface AIProjectAnalysis {
  conflictCount: number;
  affectedDepartments: string[];
  weatherRiskLevel: 'Safe' | 'Moderate' | 'High' | 'Critical';
  budgetOptimizationSavingsCrores: number;
  priorityScore: number; // 0-100
  suggestedTimelineMonths: number;
  departmentDependencies: { dept: string; task: string; delayRiskPercent: number }[];
  safetyReportChecklist: string[];
  undergroundUtilityCollisions: { utility: string; depthMeters: number; risk: 'Direct Clashing' | 'High Proximity' }[];
  aiRecommendations: string[];
  confidencePercent: number;
}

export interface FullProjectSubmission {
  id: string;
  projectIdCode: string;
  name: string;
  description: string;
  departmentId: string;
  departmentName: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: ApprovalStage;
  
  // Location
  state: string;
  district: string;
  city: string;
  village?: string;
  lat: number;
  lng: number;
  boundaryRadiusMeters: number;

  // Timeline
  startDate: string;
  endDate: string;
  expectedDurationMonths: number;
  completionPercentage: number;

  // Budget
  estimatedCostCrores: number;
  allocatedBudgetCrores: number;
  fundingSource: string; // e.g. "Central Govt Ministry Grant", "Public-Private Partnership (PPP)", "State Govt Fund"
  expectedSavingsCrores: number;

  // Resources
  resources: ProjectResourceAllocation;

  // Underground Utilities
  undergroundChecklist: UndergroundUtilityChecklist;

  // Attachments
  attachments: ProjectAttachment[];

  // AI Analysis Results
  aiAnalysis?: AIProjectAnalysis;

  // Collaboration
  comments: ProjectComment[];
  approvalHistory: ApprovalHistoryItem[];
  collaborationRequests: InterDeptCollaborationRequest[];

  createdDate: string;
  lastUpdatedDate: string;
}
