import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CheckCircle2, Flame, Info, Sparkles, X } from 'lucide-react';

export const CompletionBanner: React.FC = () => {
  const { activeFeedback, errorMessage, dismissFeedback, dismissError } = useGame();

  useEffect(() => {
    if (activeFeedback) {
      const timer = setTimeout(() => {
        dismissFeedback();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeFeedback, dismissFeedback]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        dismissError();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, dismissError]);

  return (
    <AnimatePresence>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto space-y-3"
      >
        {/* Error / Speed-Bump Toast */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            role="alert"
            className="relative bg-[#0d1322]/95 backdrop-blur-xl border-2 border-amber-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] font-mono text-xs flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block mb-1">
                  QUEST SPEED BUMP
                </span>
                <p className="text-slate-200 font-sans">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={dismissError}
              aria-label="Dismiss error"
              className="text-slate-400 hover:text-white p-1 focus:ring-2 focus:ring-amber-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Completion Feedback Card */}
        {activeFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            role="status"
            className="relative bg-[#0d1322]/95 backdrop-blur-xl border-2 border-cyan-500/50 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,240,255,0.35)] overflow-hidden font-mono"
          >
            {/* Glowing Animated Background Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-sky-400/10 to-amber-500/10 animate-pulse pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    QUEST COMPLETE!
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-[240px]">
                    {activeFeedback.questTitle}
                  </h4>
                </div>
              </div>
              <button
                onClick={dismissFeedback}
                aria-label="Dismiss completion feedback"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition focus:ring-2 focus:ring-cyan-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-3 gap-2 relative z-10 text-center">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-bold">XP GAINED</span>
                <span className="text-base font-extrabold text-cyan-300">+{activeFeedback.xpAwarded}</span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] text-amber-400 font-bold">GOLD REWARD</span>
                <span className="text-base font-extrabold text-amber-300">+{activeFeedback.goldAwarded}</span>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-2 flex flex-col items-center justify-center">
                <span className="text-[10px] text-purple-400 font-bold uppercase">{activeFeedback.attributeBoosted}</span>
                <span className="text-base font-extrabold text-purple-300">+{activeFeedback.attributeAmount}</span>
              </div>
            </div>

            {/* Streak Status */}
            <div className="mt-3 flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 relative z-10">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                <span>STREAK: {activeFeedback.streak} DAYS</span>
              </div>
              {activeFeedback.streakContinued && (
                <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">
                  🔥 STREAK CONTINUES!
                </span>
              )}
            </div>

            {/* Soft Anomaly Encouragement Nudge */}
            {activeFeedback.anomalyNudge && (
              <div className="mt-3 bg-gradient-to-r from-sky-500/15 to-cyan-500/15 border border-cyan-500/30 rounded-xl p-2.5 flex items-center gap-2 relative z-10">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span className="text-[11px] text-cyan-200 font-sans leading-tight">
                  {activeFeedback.anomalyNudge}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
