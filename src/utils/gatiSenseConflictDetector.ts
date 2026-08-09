import { Project, SmartNotification } from '../types';

export interface GatiSenseConflictAlert {
  id: string;
  project1: { id: string; title: string; code: string; dept: string };
  project2: { id: string; title: string; code: string; dept: string };
  conflictType: 'SPATIAL_AND_TEMPORAL' | 'SPATIAL_500M' | 'TEMPORAL_OVERLAP';
  distanceMeters: number;
  isWithin500m: boolean;
  hasTemporalOverlap: boolean;
  conflictCoordinates: [number, number];
  locationName: string;
  timeOverlapWindow: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  aiMitigationRecommendation: string;
  potentialSavingsCrores: number;
  timeSavedDays: number;
  status: 'Detected' | 'Auto-Synchronized' | 'Resolved' | 'Ignored';
  detectedAt: string;
}

// Calculate Haversine Distance in meters between two lat/lng points
export function getHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Check if two date ranges overlap
export function checkTemporalOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): { overlaps: boolean; overlapDays: number } {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  if (isNaN(s1) || isNaN(e1) || isNaN(s2) || isNaN(e2)) {
    return { overlaps: true, overlapDays: 180 };
  }

  const overlapStart = Math.max(s1, s2);
  const overlapEnd = Math.min(e1, e2);

  if (overlapStart <= overlapEnd) {
    const diffTime = Math.abs(overlapEnd - overlapStart);
    const overlapDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { overlaps: true, overlapDays };
  }

  return { overlaps: false, overlapDays: 0 };
}

// Extract all coordinate points (source, destination, waypoints) from a project
function getProjectAllPoints(p: Project): [number, number][] {
  const points: [number, number][] = [p.sourceCoords, p.destinationCoords];

  const selectedRoute = p.routes.find((r) => r.id === p.selectedRouteId) || p.routes[0];
  if (selectedRoute && selectedRoute.waypoints) {
    points.push(...selectedRoute.waypoints);
  }

  return points;
}

// Main GatiSense Automated Conflict Detector Function
export function detectGatiSenseConflicts(
  projects: Project[],
  distanceThresholdMeters: number = 500
): GatiSenseConflictAlert[] {
  const alerts: GatiSenseConflictAlert[] = [];

  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const p1 = projects[i];
      const p2 = projects[j];

      const p1Points = getProjectAllPoints(p1);
      const p2Points = getProjectAllPoints(p2);

      let minDistance = Infinity;
      let closestPt1: [number, number] = p1.sourceCoords;
      let closestPt2: [number, number] = p2.sourceCoords;

      for (const pt1 of p1Points) {
        for (const pt2 of p2Points) {
          const dist = getHaversineDistanceMeters(pt1[0], pt1[1], pt2[0], pt2[1]);
          if (dist < minDistance) {
            minDistance = dist;
            closestPt1 = pt1;
            closestPt2 = pt2;
          }
        }
      }

      const { overlaps: hasTemporalOverlap, overlapDays } = checkTemporalOverlap(
        p1.startDate,
        p1.completionDate,
        p2.startDate,
        p2.completionDate
      );

      const isWithin500m = minDistance <= distanceThresholdMeters;

      // Trigger GatiSense alert if:
      // 1. Within 500m threshold
      // OR 2. Within 2000m AND temporal overlap exists
      if (isWithin500m || (minDistance <= 2000 && hasTemporalOverlap)) {
        let conflictType: 'SPATIAL_AND_TEMPORAL' | 'SPATIAL_500M' | 'TEMPORAL_OVERLAP' = 'SPATIAL_500M';
        let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'MEDIUM';

        if (isWithin500m && hasTemporalOverlap) {
          conflictType = 'SPATIAL_AND_TEMPORAL';
          severity = 'CRITICAL';
        } else if (isWithin500m) {
          conflictType = 'SPATIAL_500M';
          severity = 'HIGH';
        } else {
          conflictType = 'TEMPORAL_OVERLAP';
          severity = 'MEDIUM';
        }

        const conflictCoords: [number, number] = [
          (closestPt1[0] + closestPt2[0]) / 2,
          (closestPt1[1] + closestPt2[1]) / 2,
        ];

        const locationName = `${p1.sourceCity.split(' ')[0]} - ${p2.sourceCity.split(' ')[0]} Hub Junction`;

        const alert: GatiSenseConflictAlert = {
          id: `gatisense-${p1.id}-${p2.id}`,
          project1: { id: p1.id, title: p1.title, code: p1.code, dept: p1.department },
          project2: { id: p2.id, title: p2.title, code: p2.code, dept: p2.department },
          conflictType,
          distanceMeters: minDistance,
          isWithin500m,
          hasTemporalOverlap,
          conflictCoordinates: conflictCoords,
          locationName,
          timeOverlapWindow: hasTemporalOverlap
            ? `Concurrent construction window: ~${overlapDays} days (${p1.startDate} to ${p2.startDate})`
            : 'Slightly staggered construction schedules',
          severity,
          description: isWithin500m
            ? `AUTOMATIC ALERT: Projects "${p1.code}" and "${p2.code}" are located only ${minDistance} meters apart (under the 500m GatiSense threshold)! ${
                hasTemporalOverlap ? 'Simultaneous execution will cause massive road closures and trenching re-work.' : 'Sequential work requires easement pre-alignment.'
              }`
            : `TEMPORAL COLLISION: Projects "${p1.code}" and "${p2.code}" operate in adjacent corridors with overlapping construction schedules (${overlapDays} days).`,
          aiMitigationRecommendation: `Synchronize common utility ducting between ${p1.department} and ${p2.department}. Issue joint right-of-way easement permit to execute foundation work in a single unified window.`,
          potentialSavingsCrores: Math.round((p1.budgetCrores + p2.budgetCrores) * 0.08),
          timeSavedDays: Math.min(60, Math.round(overlapDays * 0.4)),
          status: 'Detected',
          detectedAt: 'Just now (GatiSense Auto-Scan)',
        };

        alerts.push(alert);
      }
    }
  }

  return alerts;
}

// Convert GatiSense alerts into SmartNotifications for the notification panel
export function convertGatiSenseAlertsToNotifications(
  alerts: GatiSenseConflictAlert[]
): SmartNotification[] {
  return alerts.map((a) => ({
    id: `notif-gatisense-${a.id}`,
    title: a.severity === 'CRITICAL' ? '🚨 GatiSense Critical Proximity Alert' : '⚠ GatiSense Spatial Conflict',
    message: `${a.project1.code} & ${a.project2.code} are ${a.distanceMeters}m apart. ${a.isWithin500m ? '[Within 500m Threshold]' : ''} ${a.hasTemporalOverlap ? '[Same Construction Schedule]' : ''}`,
    timestamp: 'Just now',
    severity: a.severity === 'CRITICAL' ? 'critical' : 'warning',
    type: 'conflict',
    read: false,
    projectId: a.project1.id,
  }));
}
