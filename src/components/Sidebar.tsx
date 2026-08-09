import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FilePlus,
  Users,
  ShieldCheck,
  Map,
  GitCompare,
  Bot,
  FileSpreadsheet,
  Settings,
  Info,
  ChevronRight,
  Route,
  Layers,
} from 'lucide-react';

export type ActivePage =
  | 'department_portal'
  | 'submit_project'
  | 'collaboration_hub'
  | 'admin_portal'
  | 'dashboard'
  | 'map'
  | 'infrastructure3d'
  | 'underground'
  | 'analysis'
  | 'ai_assistant'
  | 'reports'
  | 'settings'
  | 'about';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const departmentPortalItems = [
    { id: 'department_portal' as ActivePage, label: 'Department Portal', icon: Building2, badge: '10 Depts' },
    { id: 'submit_project' as ActivePage, label: 'New Project Submission', icon: FilePlus, badge: 'Submit' },
    { id: 'collaboration_hub' as ActivePage, label: 'Collaboration Hub', icon: Users, badge: 'Workflow' },
  ];

  const menuItems = [
    { id: 'dashboard' as ActivePage, label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'infrastructure3d' as ActivePage, label: '3D Infrastructure Map', icon: Map, badge: '3D Command' },
    { id: 'map' as ActivePage, label: 'GIS Map Planner', icon: Route, badge: '2D GIS' },
    { id: 'underground' as ActivePage, label: 'Underground Twin', icon: Layers, badge: 'Sub-surface' },
    { id: 'analysis' as ActivePage, label: 'Route Analysis', icon: GitCompare },
    { id: 'ai_assistant' as ActivePage, label: 'AI Assistant', icon: Bot, badge: 'Gemini 3.6' },
    { id: 'reports' as ActivePage, label: 'DPR Reports', icon: FileSpreadsheet },
  ];

  const secondaryItems = [
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings },
    { id: 'about' as ActivePage, label: 'About & GatiAI', icon: Info },
  ];

  return (
    <aside className="w-64 bg-white border-r border-emerald-100 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none z-30 shadow-xs">
      <div className="p-3 space-y-5 overflow-y-auto">
        {/* Inter-Department Portal Section */}
        <div>
          <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest px-3 mb-2 flex items-center justify-between">
            <span>Inter-Dept Portal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <nav className="space-y-1">
            {departmentPortalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-md shadow-emerald-600/20'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-indigo-600 group-hover:text-emerald-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-800/60 text-white border border-emerald-400/40'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Master Planning Core Section */}
        <div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Master Planning Core
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-700/50 text-white border border-emerald-400/40' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Menu */}
        <div>
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
            System & Reference
          </div>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer GatiAI Banner */}
      <div className="p-3 m-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
          <Route className="w-4 h-4 text-emerald-600" />
          <span>7 Engines of Growth</span>
        </div>
        <p className="text-[10px] text-slate-600 leading-tight">
          Railways, Roads, Ports, Waterways, Airports, Mass Transport, Logistics Infrastructure
        </p>
      </div>
    </aside>
  );
};
