export type UndergroundUtilityType =
  | 'water_pipeline'
  | 'sewer_line'
  | 'drainage'
  | 'gas_pipeline'
  | 'petroleum_pipeline'
  | 'fiber_optic'
  | 'telephone_cable'
  | 'high_voltage_power'
  | 'low_voltage_power'
  | 'metro_tunnel'
  | 'utility_tunnel'
  | 'planned_utility';

export interface AssetInspectionRecord {
  date: string;
  notes: string;
  inspector: string;
  rating: 'Good' | 'Fair' | 'Poor';
}

export interface AssetMaintenanceRecord {
  date: string;
  workDone: string;
  costLakhs: number;
}

export interface UndergroundAsset {
  id: string;
  assetName: string;
  utilityType: UndergroundUtilityType;
  department: string;
  gpsCoordinates: [number, number];
  polylineGeometry: [number, number][];
  depthMeters: number;
  diameterMm: number;
  material: string;
  installationDate: string;
  expectedLifeYears: number;
  remainingLifeYears: number;
  currentStatus: 'active' | 'maintenance_due' | 'critical_risk' | 'leak_detected' | 'planned';
  aiRiskScore: number; // 0 - 100
  pressureBar?: number;
  voltageKv?: number;
  capacityMbps?: number;
  currentLoadPercent?: number;
  faultHistoryCount: number;
  lastInspectionDate: string;
  inspectionHistory: AssetInspectionRecord[];
  maintenanceRecords: AssetMaintenanceRecord[];
  nearestShutoffValve?: string;
  affectedAreaRadiusKm?: number;
  emergencyContacts?: { name: string; phone: string; dept: string }[];
}

export interface DigCollisionDetail {
  assetId: string;
  assetName: string;
  utilityType: UndergroundUtilityType;
  dept: string;
  assetDepthMeters: number;
  clearanceMarginMeters: number;
  collisionRisk: 'CRITICAL_DIRECT_HIT' | 'HIGH_PROXIMITY' | 'SAFE_MARGIN';
}

export interface DigPermissionRequest {
  id: string;
  projectName: string;
  requestingDept: string;
  locationName: string;
  targetLat: number;
  targetLng: number;
  excavationLengthMeters: number;
  proposedDepthMeters: number;
  excavationWidthMeters: number;
  purpose: string;
  requestDate: string;
  status: 'Approved' | 'Approved_With_Conditions' | 'High_Risk_Rejected' | 'Under_AI_Review';
  aiRiskScore: number;
  detectedCollisions: DigCollisionDetail[];
  aiRecommendations: {
    shiftTrenchMetersEast: number;
    maxExcavationDepthMeters: number;
    estimatedSavingsLakhs: number;
    safeRouteDescription: string;
    safetyChecklist: string[];
  };
}

export interface SharedUtilityCorridor {
  id: string;
  corridorName: string;
  locationCity: string;
  lengthKm: number;
  bundledUtilities: UndergroundUtilityType[];
  participatingDepartments: string[];
  traditionalExcavationCount: number;
  proposedTunnelType: string;
  constructionCostCrores: number;
  estimatedSavingsCrores: number;
  disruptionDaysSaved: number;
  roiYears: number;
}

export interface UndergroundEmergencyIncident {
  id: string;
  title: string;
  utilityType: UndergroundUtilityType;
  assetName: string;
  locationName: string;
  coordinates: [number, number];
  severity: 'CRITICAL_LEAK' | 'CABLE_SNAP' | 'OVERLOAD_BURST' | 'PRESSURE_DROP';
  detectedAt: string;
  affectedCustomersCount: number;
  nearestShutoffValve: string;
  nearestHospitalsCount: number;
  nearestSchoolsCount: number;
  suggestedRepairCrew: string;
  bestAccessRoute: string;
  estimatedRepairHours: number;
  estimatedCostLakhs: number;
  status: 'ACTIVE_DISPATCH' | 'ISOLATED' | 'REPAIRED';
}
