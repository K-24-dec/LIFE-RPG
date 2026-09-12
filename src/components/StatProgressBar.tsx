import React from 'react';

interface StatProgressBarProps {
  label: string;
  value: number;
  max?: number;
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'blue';
  description?: string;
}

export const StatProgressBar: React.FC<StatProgressBarProps> = ({
  label,
  value,
  max = 100,
  icon,
  color = 'cyan',
  description,
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  const colorStyles = {
    cyan: {
      bar: 'from-cyan-500 to-sky-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    purple: {
      bar: 'from-purple-500 to-indigo-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
    },
    amber: {
      bar: 'from-amber-500 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
    emerald: {
      bar: 'from-emerald-500 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    rose: {
      bar: 'from-rose-500 to-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.5)]',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
    },
    blue: {
      bar: 'from-blue-500 to-cyan-300 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
    },
  };

  const style = colorStyles[color];

  return (
    <div className={`p-3.5 rounded-2xl border ${style.bg} font-mono transition-all duration-300 hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {icon && <span className={style.text}>{icon}</span>}
          <span className="text-xs font-extrabold tracking-wider text-white uppercase">{label}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <span className={style.text}>{value}</span>
          <span className="text-slate-500">/ {max}</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {description && <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">{description}</p>}
    </div>
  );
};
