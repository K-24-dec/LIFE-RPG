import React, { useState } from 'react';
import { SmartNotification } from '../types';
import {
  Bell,
  X,
  AlertTriangle,
  CloudRain,
  DollarSign,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  Clock,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: SmartNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onClearAll,
  onSelectProject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter(
    (n) => filterSeverity === 'all' || n.severity === filterSeverity
  );

  const getIcon = (type: string, severity: string) => {
    switch (type) {
      case 'conflict':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-amber-400" />;
      case 'budget':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'resolution':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      case 'ai_plan':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Trigger Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[#080b12] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
        title="Smart AI Notifications"
      >
        <Bell className="w-4 h-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#080b12] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c121d] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="p-3.5 bg-[#080b12] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="font-extrabold text-white text-sm">GatiAI Smart Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Clear All"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Severity Filters */}
          <div className="p-2 bg-[#080b12]/50 border-b border-slate-800 flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterSeverity === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterSeverity === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Warning
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No alerts to display</div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkRead(n.id);
                    if (n.projectId && onSelectProject) onSelectProject(n.projectId);
                  }}
                  className={`p-3 rounded-xl transition-all cursor-pointer space-y-1 ${
                    !n.read ? 'bg-blue-950/20 hover:bg-blue-950/30' : 'hover:bg-slate-800/40 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#080b12] border border-slate-800">
                        {getIcon(n.type, n.severity)}
                      </div>
                      <span className="font-bold text-slate-100">{n.title}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0">{n.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 pl-7 leading-normal">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
