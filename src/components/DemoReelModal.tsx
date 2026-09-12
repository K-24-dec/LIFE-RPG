import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Sparkles, Swords, Trophy, Crown, ShoppingBag, Shield, CheckCircle2 } from 'lucide-react';

interface DemoReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoReelModal: React.FC<DemoReelModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoSteps = [
    {
      time: '0:00 - 0:20',
      title: 'THE HOOK // THE PROBLEM',
      subtitle: '80% of productivity apps fail because they feel like cold, boring to-do lists.',
      narration: '"80% of productivity apps are abandoned in 30 days. We built Life RPG to fix that by turning your actual life into an adventure game you want to keep playing."',
      stage: 'landing',
    },
    {
      time: '0:20 - 0:40',
      title: 'THE SOLUTION // ADVENTURER COMMAND HUB',
      subtitle: 'Real-world habits converted into active RPG quests with XP, Gold & Streaks.',
      narration: '"Life RPG turns real-life tasks into active quests. Complete them, earn XP and Gold, build your attributes, maintain your streak, and level up your hero."',
      stage: 'dashboard',
    },
    {
      time: '0:40 - 0:55',
      title: 'CREATING A QUEST // MISSION PARAMETERS',
      subtitle: 'Set quest difficulty, attribute focus, timer duration, and rewards.',
      narration: '"Let\'s create a quest: \'Master Async JavaScript\'. Hard difficulty, 45-minute timer. It automatically calculates rewards: +75 XP, +35 Gold, and +5 Intelligence."',
      stage: 'create_quest',
    },
    {
      time: '0:55 - 1:20',
      title: 'TIMER & PROOF VERIFICATION // NO CHEATING',
      subtitle: 'Real-time countdown timer with verified reflection & photo uploads.',
      narration: '"Once started, the real-time timer tracks progress. When finished, upload a photo or reflection note to verify the achievement — zero cheating allowed."',
      stage: 'complete_quest',
    },
    {
      time: '1:20 - 1:45',
      title: 'LEVEL UP CELEBRATION // REWARD LOOP',
      subtitle: 'Instant floating XP, Gold, Attribute gains, and Rank promotion.',
      narration: '"The moment I complete it, I get instant XP and Gold, my Intelligence rises, my streak hits 7 days, and BOOM — LEVEL UP to Level 6!"',
      stage: 'level_up',
    },
    {
      time: '1:45 - 2:00',
      title: 'GUILD MARKET & ARSENAL // COSMETICS',
      subtitle: 'Spend earned Gold on avatars, titles, and legendary borders.',
      narration: '"Now I spend earned Gold in the Guild Market to acquire the Solar Gold Frame and equip it directly onto my Hero Profile."',
      stage: 'market',
    },
    {
      time: '2:00 - 2:30',
      title: 'TECH ARCHITECTURE // AUTHORITATIVE ENGINE',
      subtitle: 'React 19 + TypeScript + 60fps Canvas + Express Server + Supabase DB.',
      narration: '"Built on React 19, TypeScript, and 60fps Canvas with an authoritative Node server and Supabase persistence for multi-account isolation."',
      stage: 'tech',
    },
    {
      time: '2:30 - 2:45',
      title: 'CONCLUSION // READY FOR Q&A',
      subtitle: 'Making real-life progress visible, exciting, and unstoppable.',
      narration: '"Life RPG makes consistency feel like progress you can see. Thank you — happy to answer your questions!"',
      stage: 'close',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, 4500);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, step]);

  if (!isOpen) return null;

  const current = demoSteps[step];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-[#0d1322] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,240,255,0.4)] overflow-hidden font-mono text-left"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wider">HACKATHON DEMO REEL WALKTHROUGH</h3>
                <p className="text-[10px] text-cyan-400">AUTOMATED SCREEN RECORDING ASSISTANT</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button
                onClick={() => setStep(0)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                title="Restart Demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Step Indicators */}
          <div className="grid grid-cols-8 gap-1.5 mb-6">
            {demoSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === step
                    ? 'bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.8)] scale-y-125'
                    : idx < step
                    ? 'bg-cyan-600/60'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Live Stage Frame Showcase */}
          <div className="bg-[#080c14] border border-cyan-500/30 rounded-2xl p-6 mb-6 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-amber-400 font-extrabold px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                ⏱ {current.time}
              </span>
              <span className="text-cyan-400 font-bold">STEP {step + 1} OF 8</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-2">{current.title}</h2>
              <p className="text-xs text-cyan-300 font-bold mb-4">{current.subtitle}</p>

              {/* Speech / Narration Box */}
              <div className="bg-[#0d1322] border border-cyan-500/20 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-sans italic leading-relaxed">
                💬 <span className="font-mono text-cyan-400 font-bold not-italic">JUDGES NARRATION: </span>
                {current.narration}
              </div>
            </div>

            {/* Visual Icon Badge */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span>RECORD WITH: Windows Game Bar (Win+Alt+R), Loom, or OBS</span>
              <span className="text-emerald-400 font-bold">✓ PERFECT 2:30 TIMING</span>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-400">
              Press <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">Win</kbd> + <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">Alt</kbd> + <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">R</kbd> to record video
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold disabled:opacity-40"
              >
                ← PREV STEP
              </button>
              <button
                onClick={() => setStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
                disabled={step === demoSteps.length - 1}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-[#080c14] font-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-40"
              >
                NEXT STEP →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
