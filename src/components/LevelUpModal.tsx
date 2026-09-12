import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Award, Crown, Sparkles, Zap } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpInfo, dismissLevelUp } = useGame();

  if (!levelUpInfo) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          className="relative w-full max-w-lg bg-[#0d1322] border-2 border-cyan-400 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(0,240,255,0.5)] overflow-hidden"
        >
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent animate-pulse pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-600 p-[3px] shadow-[0_0_40px_rgba(0,240,255,0.6)]">
            <div className="w-full h-full bg-[#080c14] rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-[#080c14] font-black text-xs font-mono px-3 py-0.5 rounded-full border border-amber-300 shadow">
              LEVEL UP!
            </div>
          </div>

          {/* Level Transition Title */}
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-sky-300 font-mono tracking-wider mb-2">
            ✨ LEVEL UP ✨
          </h2>

          <div className="text-2xl font-black font-mono text-cyan-400 mb-2 flex items-center justify-center gap-3">
            <span className="text-slate-400">LVL {levelUpInfo.oldLevel}</span>
            <span className="text-amber-400">→</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 text-3xl">
              LVL {levelUpInfo.newLevel}
            </span>
          </div>

          <p className="text-sm text-slate-300 font-sans italic mb-6">
            "Your relentless discipline and quest victories have awakened new potential."
          </p>

          {/* Stat Rewards Grid */}
          <div className="bg-[#080c14]/80 border border-cyan-500/30 rounded-2xl p-4 mb-6 space-y-3 font-mono text-left">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest text-center mb-2">
              ATTRIBUTES & REWARDS UNLOCKED
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-xl text-cyan-300">
                <span>INTELLIGENCE</span>
                <span className="font-bold text-cyan-400">+2</span>
              </div>
              <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-xl text-purple-300">
                <span>WISDOM</span>
                <span className="font-bold text-purple-400">+1</span>
              </div>
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl text-red-300">
                <span>STRENGTH</span>
                <span className="font-bold text-red-400">+1</span>
              </div>
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-emerald-300">
                <span>AGILITY</span>
                <span className="font-bold text-emerald-400">+1</span>
              </div>
            </div>

            {/* Level Bonus Gold */}
            <div className="mt-3 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-xl text-amber-300 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span>🪙 LEVEL-UP GOLD BONUS</span>
              </div>
              <span className="text-sm font-extrabold text-amber-400">+{levelUpInfo.goldBonus} GOLD</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={dismissLevelUp}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#080c14] font-black font-mono tracking-widest text-sm shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all transform hover:scale-[1.02]"
          >
            CLAIM REWARDS & CONTINUE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
