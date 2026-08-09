import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Layers,
  Route,
  ShieldCheck,
  ArrowRight,
  Bot,
  Building2,
  Globe,
  Bell,
  FileSpreadsheet,
  Zap,
  Droplets,
  Train,
  Plane,
  Anchor,
  Box,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Map as MapIcon,
  Search,
} from 'lucide-react';

interface LandingPageProps {
  onNavigatePage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigatePage }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'engines' | 'projects'>('overview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      {/* Official Government Tricolour Top Ribbon */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />

      {/* Official Government Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 lg:px-12 flex flex-wrap items-center justify-between border-b border-slate-800 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span>Government of India</span>
          </div>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-300 hidden md:inline">
            गति शक्ति राष्ट्रीय मास्टर प्लान | PM Gati Shakti National Master Plan
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-300">
          <div className="hidden sm:flex items-center gap-2">
            <span>Accessibility:</span>
            <button className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">A-</button>
            <button className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">A</button>
            <button className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">A+</button>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            <select className="bg-slate-800 text-slate-200 border-0 rounded px-1.5 py-0.5 text-[10px]">
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Government Portal Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-12 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Official Emblem & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white font-black shadow-md border border-emerald-600/40">
              <span className="text-lg font-black text-amber-400">GOI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  PM Gati<span className="text-emerald-700">Shakti</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
                  National Portal
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-bold hidden sm:block">
                Integrated Multi-Modal Infrastructure & Inter-Agency Master Plan
              </p>
            </div>
          </div>

          {/* Quick Header Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            <button
              onClick={() => onNavigatePage('department_portal')}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Department Portal
            </button>
            <button
              onClick={() => onNavigatePage('infrastructure3d')}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center gap-1 text-indigo-700 font-extrabold"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              3D Spatial Twin
            </button>
            <button
              onClick={() => onNavigatePage('map')}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              GIS Route Planner
            </button>
            <button
              onClick={() => onNavigatePage('underground')}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              Underground Twin
            </button>
            <button
              onClick={() => onNavigatePage('reports')}
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              DPR Reports
            </button>
          </nav>

          {/* Enter Portal Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigatePage('department_portal')}
              className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-emerald-800/20 cursor-pointer"
            >
              <span>Access Master Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Official Government Live Announcement Ticker Bar */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 lg:px-12 py-2 text-xs flex items-center gap-3 text-amber-950 font-medium">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-600 text-white font-extrabold text-[10px] uppercase shrink-0">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>Latest Official Update</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <p className="inline-block animate-marquee text-xs font-semibold text-slate-800">
            • <strong className="text-amber-900">Cabinet Clearance:</strong> CCEA approves ₹18,500 Cr Multi-Modal Freight Extension along Dadri-Jewar Airport Corridor &nbsp;&nbsp;&nbsp;&nbsp;
            • <strong className="text-emerald-900">3D GIS Spatial Twin:</strong> Sub-surface utility conflict scan active across 10 Central Infrastructure Ministries &nbsp;&nbsp;&nbsp;&nbsp;
            • <strong className="text-indigo-900">Joint Trench Protocol:</strong> Integrated road paving and pipeline laying enabled to eliminate road re-excavation.
          </p>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white py-16 px-4 lg:px-12 border-b border-slate-800 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>PM Gati Shakti National Master Plan Portal</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Unified Multi-Modal Infrastructure & Inter-Agency Master Plan
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Empowering 10 Central Infrastructure Ministries and 36 States/UTs with real-time 3D spatial GIS conflict detection, subterranean utility mapping, automated route optimization, and single-window inter-agency clearances.
            </p>
          </div>

          {/* Quick Gateway Cards (4 Core Portals) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Gateway 1: 3D Spatial Twin */}
            <div
              onClick={() => onNavigatePage('infrastructure3d')}
              className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/40 hover:border-indigo-400 transition-all cursor-pointer group hover:bg-slate-800 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md">
                  <MapIcon className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                  3D Command
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  3D Spatial Twin <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Interactive WebGL 3D view of surface roads, buildings, water mains, power ducts, fiber, & metro tunnels.
                </p>
              </div>
            </div>

            {/* Gateway 2: Inter-Dept Portal */}
            <div
              onClick={() => onNavigatePage('department_portal')}
              className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer group hover:bg-slate-800 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  10 Ministries
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                  Inter-Department Portal <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Single-window inter-agency clearance, project submissions, NOC approvals, & collaboration hub.
                </p>
              </div>
            </div>

            {/* Gateway 3: GIS Map Planner */}
            <div
              onClick={() => onNavigatePage('map')}
              className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-teal-500/40 hover:border-teal-400 transition-all cursor-pointer group hover:bg-slate-800 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-teal-600 text-white shadow-md">
                  <Route className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                  2D GIS Engine
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-teal-300 transition-colors flex items-center gap-1">
                  GIS Route Planner <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Multi-modal route optimization, forest & river conflict scans, elevation profiling, & terrain analysis.
                </p>
              </div>
            </div>

            {/* Gateway 4: Underground Twin */}
            <div
              onClick={() => onNavigatePage('underground')}
              className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group hover:bg-slate-800 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-amber-600 text-white shadow-md">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  Sub-surface
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                  Underground Twin <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Ground penetrating radar (GPR) sub-surface mapping, dig permission engine, & safety compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">10</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Central Ministries Integrated</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-teal-400">12+</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Integrated GIS Data Layers</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">₹2,400 Cr</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Cost Overrun Risk Saved</div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-indigo-400">Zero</div>
              <div className="text-xs text-slate-400 font-bold mt-1">Eco-Forest Disruption</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 ENGINES OF GROWTH (PM GATI SHAKTI FRAMEWORK) */}
      <section className="py-12 px-4 lg:px-12 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
            PM Gati Shakti Architecture
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            Driven by 7 Engines of Economic Growth
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Synchronizing multi-modal connectivity infrastructure across key economic sectors to deliver world-class logistics speed and efficiency.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Engine 1: Roads */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Route className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Roadways</h4>
            <span className="inline-block text-[10px] text-amber-800 bg-amber-50 font-bold px-2 py-0.5 rounded">MoRTH</span>
          </div>

          {/* Engine 2: Railways */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Train className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Railways</h4>
            <span className="inline-block text-[10px] text-blue-800 bg-blue-50 font-bold px-2 py-0.5 rounded">Railways</span>
          </div>

          {/* Engine 3: Mass Transport */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Mass Transit</h4>
            <span className="inline-block text-[10px] text-indigo-800 bg-indigo-50 font-bold px-2 py-0.5 rounded">Metro Corp</span>
          </div>

          {/* Engine 4: Waterways */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Droplets className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Waterways</h4>
            <span className="inline-block text-[10px] text-cyan-800 bg-cyan-50 font-bold px-2 py-0.5 rounded">Jal Shakti</span>
          </div>

          {/* Engine 5: Airports */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Plane className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Airports</h4>
            <span className="inline-block text-[10px] text-sky-800 bg-sky-50 font-bold px-2 py-0.5 rounded">Civil Aviation</span>
          </div>

          {/* Engine 6: Ports */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Anchor className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Ports</h4>
            <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded">Shipping</span>
          </div>

          {/* Engine 7: Logistics */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Box className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">Logistics</h4>
            <span className="inline-block text-[10px] text-teal-800 bg-teal-50 font-bold px-2 py-0.5 rounded">DPIIT</span>
          </div>
        </div>
      </section>

      {/* OFFICIAL GOVERNMENT FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">
                GOI
              </div>
              <span>PM Gati Shakti Master Plan</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              National Portal for Multi-Modal Infrastructure Connectivity and Inter-Departmental Clearance. Designed & maintained by the National Master Plan Secretariat in collaboration with NIC.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-extrabold text-xs uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigatePage('department_portal')} className="hover:text-emerald-400">Department Portal</button></li>
              <li><button onClick={() => onNavigatePage('infrastructure3d')} className="hover:text-emerald-400">3D Spatial Twin Engine</button></li>
              <li><button onClick={() => onNavigatePage('map')} className="hover:text-emerald-400">GIS Route Planner</button></li>
              <li><button onClick={() => onNavigatePage('underground')} className="hover:text-emerald-400">Sub-Surface Underground Twin</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-extrabold text-xs uppercase tracking-wider">Government Guidelines</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-emerald-400">National Master Plan Principles</a></li>
              <li><a href="#" className="hover:text-emerald-400">Joint Utility Trenching Standard Operating Procedure</a></li>
              <li><a href="#" className="hover:text-emerald-400">Environmental & Forest Clearance NOC Workflow</a></li>
              <li><a href="#" className="hover:text-emerald-400">PM Gati Shakti NMP Guidelines 2026</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-extrabold text-xs uppercase tracking-wider">Helpdesk & Support</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              National Master Plan Secretariat<br />
              Udyog Bhawan, New Delhi - 110011<br />
              Toll Free: 1800-11-2026<br />
              Email: helpdesk-gatishakti@gov.in
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-950 py-4 px-4 lg:px-12 border-t border-slate-800 text-[11px] text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div>
              © 2026 National Master Plan Secretariat, Government of India. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Hyperlinking Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">NIC Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

