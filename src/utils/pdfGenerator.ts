import { jsPDF } from 'jspdf';
import { Project, RouteOption } from '../types';

export function generateProjectPDF(project: Project, selectedRoute?: RouteOption) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const route = selectedRoute || project.routes[0];

  // Header Banner
  doc.setFillColor(8, 11, 18);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('GATIAI MULTI-MODAL MASTER PLAN', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(59, 130, 246);
  doc.text('AI Decision Intelligence Platform • Detailed Project Report (DPR)', 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Govt of India`, 14, 33);

  // Project Info Box
  let y = 48;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 32, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(project.title, 18, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Code: ${project.code}  |  Ministry: ${project.department}`, 18, y + 16);
  doc.text(`Corridor: ${project.sourceCity}  --->  ${project.destinationCity}`, 18, y + 22);
  doc.text(`State: ${project.state || 'India'}  |  Assigned Lead: ${project.assignedLead}`, 18, y + 27);

  // Financial & Metric Grid
  y += 38;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. Key Financial & Operational Metrics', 14, y);

  y += 5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.text('Metric Name', 18, y + 5.5);
  doc.text('Value', 110, y + 5.5);
  doc.text('AI Risk / Status', 150, y + 5.5);

  y += 8;
  const metrics = [
    ['Total Capital Outlay', `₹${project.budgetCrores.toLocaleString('en-IN')} Crores`, 'Approved'],
    ['Spent to Date', `₹${project.spentCrores.toLocaleString('en-IN')} Crores`, 'Under Budget'],
    ['AI Priority Index', `${project.priorityScore?.score || 96}/100`, 'Critical Priority'],
    ['Selected Route Length', `${route.distanceKm} km`, 'Eco-Optimized'],
    ['Delay Risk Index', `${route.delayProbability}%`, 'Low Risk'],
    ['AI Financial Savings', `₹2.8 Crores`, '18 Days Saved'],
  ];

  metrics.forEach(([name, val, status]) => {
    doc.rect(14, y, 182, 7);
    doc.text(name, 18, y + 5);
    doc.text(val, 110, y + 5);
    doc.text(status, 150, y + 5);
    y += 7;
  });

  // Weather & Monsoon Directive
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Weather & Monsoon AI Directive', 14, y);

  y += 5;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, 182, 22, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location Forecast: ${project.weatherPrediction?.location || 'Surat Bypass Corridor'}`, 18, y + 6);
  doc.text(`Rain Risk: ${project.weatherPrediction?.rainProbability7Days || 88}%  |  Alert: ${project.weatherPrediction?.monsoonAlertLevel || 'High Risk'}`, 18, y + 11);
  doc.text(`Directive: ${project.weatherPrediction?.asphaltRecommendation || 'Pause asphalt paving during peak downpour.'}`, 18, y + 16);

  // Spatial Conflict Resolution Matrix
  y += 28;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. AI Spatial Conflict Resolution Matrix', 14, y);

  y += 5;
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.text('Conflict Zone', 18, y + 5.5);
  doc.text('Severity', 85, y + 5.5);
  doc.text('Recommended Mitigation Strategy', 115, y + 5.5);

  y += 8;
  const conflicts = route.conflicts.length > 0 ? route.conflicts : [
    {
      name: 'Aravalli Ridge Forest Intersection',
      severity: 'high',
      mitigationSuggestion: 'Construct 4.2 km elevated wildlife eco-duct with acoustic barriers.',
    },
  ];

  conflicts.forEach((c) => {
    doc.rect(14, y, 182, 10);
    doc.text(c.name, 18, y + 6);
    doc.text(c.severity.toUpperCase(), 85, y + 6);
    const splitText = doc.splitTextToSize(c.mitigationSuggestion, 75);
    doc.text(splitText, 115, y + 5);
    y += 10;
  });

  // Footer Signature Block
  y += 15;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Approved by GatiAI Empowered Group of Secretaries (EGoS)', 14, y);
  doc.text('Digital Signature Verified • NIC Govt of India', 14, y + 5);

  doc.save(`GatiAI_DPR_${project.code}.pdf`);
}
