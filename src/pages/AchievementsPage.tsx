import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, Lock, Sparkles, Trophy } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useGame();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400 text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ACHIEVEMENT BADGES</h1>
              <p className="text-xs text-slate-400">
                Unlock prestigious trophies as you master real-life productivity milestones.
              </p>
            </div>
          </div>

          <div className="bg-[#080c14] border border-amber-500/40 px-4 py-2.5 rounded-2xl text-amber-300 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            🏆 {unlockedCount} / {achievements.length} UNLOCKED
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const percentage = Math.min(100, Math.round((ach.current_count / ach.required_count) * 100));

            return (
              <div
                key={ach.id}
                className={`relative bg-[#0d1322] border ${
                  ach.unlocked
                    ? 'border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                    : 'border-slate-800 opacity-60'
                } rounded-3xl p-6 flex flex-col justify-between transition`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                        ach.unlocked
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {ach.unlocked ? <Award className="w-6 h-6 animate-pulse" /> : <Lock className="w-6 h-6" />}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        ach.unlocked
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold mb-1 ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                    {ach.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mb-4 leading-relaxed">{ach.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>PROGRESS</span>
                    <span className={ach.unlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      {ach.current_count} / {ach.required_count}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ach.unlocked ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 'bg-slate-700'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
