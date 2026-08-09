import React, { useState, useEffect } from 'react';
import { User, Project } from './types';
import { SAMPLE_USERS, SAMPLE_PROJECTS } from './data/mockData';
import { MOCK_DEPARTMENT_USERS, GOVERNMENT_DEPARTMENTS, INITIAL_FULL_PROJECTS } from './data/departmentData';
import { DepartmentUser, FullProjectSubmission } from './types/department';
import { Navbar } from './components/Navbar';
import { Sidebar, ActivePage } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPlannerPage } from './pages/MapPlannerPage';
import { Infrastructure3DMapPage } from './pages/Infrastructure3DMapPage';
import { UndergroundIntelligencePage } from './pages/UndergroundIntelligencePage';
import { RouteAnalysisPage } from './pages/RouteAnalysisPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

// Multi-Department Portal Pages & Modals
import { DepartmentPortalPage } from './pages/DepartmentPortalPage';
import { ProjectSubmissionPage } from './pages/ProjectSubmissionPage';
import { CollaborationHubPage } from './pages/CollaborationHubPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<DepartmentUser>(MOCK_DEPARTMENT_USERS[0]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<ActivePage | 'landing'>('landing');

  // Legacy & Full Projects State
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [fullProjects, setFullProjects] = useState<FullProjectSubmission[]>(INITIAL_FULL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(SAMPLE_PROJECTS[0]);

  // Selected project for detailed modal view
  const [modalProject, setModalProject] = useState<FullProjectSubmission | null>(null);

  // Load from backend if available
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProject(data.projects[0]);
        }
      } catch (err) {
        console.warn('Using local sample projects fallback', err);
      }
    }
    loadProjects();
  }, []);

  const handleUpdateProjectRoute = (routeId: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          selectedRouteId: routeId,
        };
      }
      return p;
    });
    setProjects(updated);
    setActiveProject((prev) => ({ ...prev, selectedRouteId: routeId }));

    fetch(`/api/projects/${activeProject.id}/select-route`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId }),
    }).catch((err) => console.warn('Route update failed on backend', err));
  };

  const handleCreateProject = (newProjData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      code: `PMGS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'planning',
      spentCrores: 0,
      timelineMonths: 36,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: '2028-12-31',
      riskLevel: 'Medium',
      riskScore: 35,
      lastUpdated: new Date().toISOString().split('T')[0],
      routes: [],
      description: 'Newly generated GatiAI multi-modal freight corridor.',
      title: newProjData.title || 'New Corridor Project',
      department: newProjData.department || currentUser.departmentName,
      infrastructureType: newProjData.infrastructureType || 'highway',
      sourceCity: newProjData.sourceCity || 'Delhi NCR',
      destinationCity: newProjData.destinationCity || 'Mumbai',
      sourceCoords: newProjData.sourceCoords || [28.5528, 77.5539],
      destinationCoords: newProjData.destinationCoords || [18.9500, 72.9500],
      budgetCrores: newProjData.budgetCrores || 9500,
      assignedLead: currentUser.name,
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
  };

  const handleNewFullProjectSubmission = (newFullProj: FullProjectSubmission) => {
    setFullProjects((prev) => [newFullProj, ...prev]);
    setModalProject(newFullProj);
    setCurrentPage('department_portal');
  };

  const handleUpdateFullProject = (updated: FullProjectSubmission) => {
    setFullProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setModalProject(updated);
  };

  const selectedRoute =
    activeProject.routes.find((r) => r.id === activeProject.selectedRouteId) ||
    activeProject.routes[0];

  // Render standalone Landing page
  if (currentPage === 'landing') {
    return <LandingPage onNavigatePage={(page) => setCurrentPage(page as any)} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50/20 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={(usr) => setCurrentUser(usr)}
        selectedDepartmentId={selectedDepartmentId}
        onSelectDepartmentId={(deptId) => setSelectedDepartmentId(deptId)}
        onNavigateHome={() => setCurrentPage('landing')}
      />

      {/* Main Body split into Sidebar + Workspace Page */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activePage={currentPage} onNavigate={(page) => setCurrentPage(page)} />

        <main className="flex-1 overflow-y-auto bg-slate-50/80 p-4 md:p-6">
          {currentPage === 'department_portal' && (
            <DepartmentPortalPage
              projects={fullProjects}
              selectedDepartmentId={selectedDepartmentId}
              onSelectDepartmentId={(deptId) => setSelectedDepartmentId(deptId)}
              currentUser={currentUser}
              onOpenNewProject={() => setCurrentPage('submit_project')}
              onOpenProjectDetails={(p) => setModalProject(p)}
            />
          )}

          {currentPage === 'submit_project' && (
            <ProjectSubmissionPage
              onSubmitSuccess={handleNewFullProjectSubmission}
              onCancel={() => setCurrentPage('department_portal')}
            />
          )}

          {currentPage === 'collaboration_hub' && (
            <CollaborationHubPage
              projects={fullProjects}
              onOpenProjectDetails={(p) => setModalProject(p)}
            />
          )}

          {currentPage === 'admin_portal' && (
            <AdminPortalPage
              projects={fullProjects}
              currentUser={currentUser}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              projects={projects}
              currentUser={{
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                role: 'admin',
                department: currentUser.departmentName,
                avatar: currentUser.avatar,
              }}
              onSelectProject={(proj) => setActiveProject(proj)}
              onOpenPlanner={() => setCurrentPage('map')}
              onCreateProject={handleCreateProject}
            />
          )}

          {currentPage === 'infrastructure3d' && <Infrastructure3DMapPage />}

          {currentPage === 'map' && (
            <MapPlannerPage
              activeProject={activeProject}
              allProjects={projects}
              onUpdateProjectRoute={handleUpdateProjectRoute}
              onOpenAIAssistant={() => setCurrentPage('ai_assistant')}
            />
          )}

          {currentPage === 'underground' && (
            <UndergroundIntelligencePage onOpenAIAssistant={() => setCurrentPage('ai_assistant')} />
          )}

          {currentPage === 'analysis' && (
            <RouteAnalysisPage
              activeProject={activeProject}
              onSelectRoute={handleUpdateProjectRoute}
              onOpenPlanner={() => setCurrentPage('map')}
            />
          )}

          {currentPage === 'ai_assistant' && (
            <AIAssistantPage activeProject={activeProject} selectedRoute={selectedRoute} />
          )}

          {currentPage === 'reports' && <ReportsPage projects={projects} />}

          {currentPage === 'settings' && <SettingsPage />}

          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>

      {/* Global Project Details Modal */}
      {modalProject && (
        <ProjectDetailsModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          onUpdateProject={handleUpdateFullProject}
        />
      )}
    </div>
  );
}
