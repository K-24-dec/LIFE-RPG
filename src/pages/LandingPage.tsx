import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Flame,
  Shield,
  ShoppingBag,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, character } = useGame();

  const handleStart = () => {
    if (isAuthenticated) {
      onNavigate('/dashboard');
    } else {
      onNavigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono relative overflow-hidden">
      {/* Background Neon Grid & Particle Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#080c14] to-[#080c14] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center z-10">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>GAMIFIED PRODUCTIVITY SYSTEM</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          LIFE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500">RPG</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-bold text-slate-200 mb-4 max-w-3xl mx-auto font-sans">
          "Turn your real life into an adventure."
        </p>

        {/* Supporting text */}
        <p className="text-sm sm:text-base text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Transform daily chores into real quests. Earn XP, collect Gold, build your attributes, maintain your streak, and level up your real-world character.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#080c14] font-black tracking-widest text-base shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <span>START YOUR JOURNEY</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('/quests')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0d1322] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold tracking-wider text-base transition-all hover:bg-cyan-500/10 flex items-center justify-center gap-2"
          >
            <span>EXPLORE THE WORLD</span>
          </button>
        </div>

        {/* Interactive Visual RPG Preview Showcase */}
        <div className="max-w-5xl mx-auto bg-[#0d1322]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,240,255,0.25)] backdrop-blur-xl text-left relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-mono ml-2">LIFE_RPG_SYSTEM // ADVENTURE_HUB_PREVIEW</span>
            </div>
            <div className="text-xs text-cyan-400 font-mono font-bold">LVL {character.level} HERO</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Character Preview */}
            <div className="bg-[#080c14] border border-cyan-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{character.name}</h4>
                  <p className="text-[10px] text-cyan-400">✨ {character.equipped_title}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>XP PROGRESS</span>
                  <span className="text-cyan-400">450 / 800 XP</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="w-[56%] h-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
                </div>
              </div>
            </div>

            {/* Quests Preview */}
            <div className="bg-[#080c14] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-4 h-4 text-cyan-400" /> ACTIVE QUEST
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  HARD
                </span>
              </div>
              <p className="text-xs font-bold text-white">⚔️ Master Async JavaScript Patterns</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-cyan-400">+75 XP • +35 GOLD</span>
                <span className="text-purple-400">INTELLIGENCE +5</span>
              </div>
            </div>

            {/* Streak & Treasury Preview */}
            <div className="bg-[#080c14] border border-cyan-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" /> STREAK
                </span>
                <span className="text-sm font-extrabold text-orange-400">🔥 5 DAYS</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-amber-400">GOLD TREASURY</span>
                <span className="text-sm font-extrabold text-amber-300">🪙 380 GOLD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core RPG Loop Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 relative">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-12 font-mono">
          THE REAL-LIFE PROGRESSION LOOP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/50 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 mb-4">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">1. CREATE QUESTS</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Convert mundane work, fitness, coding, and study goals into categorized RPG missions.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/50 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">2. EARN XP & GOLD</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Complete quests to trigger instant floating reward feedback, XP gain, and Gold earnings.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/50 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400 mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">3. LEVEL ATTRIBUTES</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Watch your Strength, Intelligence, Wisdom, Agility, and Discipline stats grow deterministically.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/50 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">4. UNLOCK REWARDS</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Spend Gold in the Guild Market to acquire avatars, titles, frames, and legendary cosmetic themes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
