import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DemoReelModal } from './DemoReelModal';
import {
  Award,
  BookOpen,
  Compass,
  Flame,
  History,
  LogOut,
  Shield,
  ShoppingBag,
  Sparkles,
  Swords,
  User,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { character, isAuthenticated, logoutUser } = useGame();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const navLinks = [
    { name: 'Adventure', path: '/dashboard', icon: Compass },
    { name: 'Quests', path: '/quests', icon: Swords },
    { name: 'Character', path: '/character', icon: User },
    { name: 'Chronicle', path: '/chronicle', icon: History },
    { name: 'Market', path: '/market', icon: ShoppingBag },
    { name: 'Arsenal', path: '/inventory', icon: Shield },
    { name: 'Trophies', path: '/achievements', icon: Award },
  ];

  const xpPercentage = Math.min(100, Math.round((character.xp / character.xp_to_next_level) * 100));

  return (
    <>
      {/* Game HUD Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#050814]/90 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(0,240,255,0.15)] rpg-hud-border font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Rank */}
          <div
            onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-300 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.5)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400">
                  LIFE RPG
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  HUD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">REAL-LIFE GAME INTERFACE</p>
            </div>
          </div>

          {/* Game HUD User Stats Bar */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-5">
              {/* Level & XP Gauge */}
              <div className="flex items-center gap-3 bg-[#080c14] border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-inner">
                <div className="flex items-center gap-1.5 font-extrabold text-cyan-400">
                  <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                  <span>LVL {character.level}</span>
                </div>
                <div className="w-32 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>XP</span>
                    <span className="text-cyan-300 font-bold">
                      {character.xp} / {character.xp_to_next_level}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gold Treasury */}
              <div className="flex items-center gap-2 bg-[#080c14] border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-amber-300 font-extrabold text-xs shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="text-base">💰</span>
                <span>{character.gold.toLocaleString()} GOLD</span>
              </div>

              {/* Streak Flame */}
              <div className="flex items-center gap-2 bg-[#080c14] border border-orange-500/40 px-3.5 py-1.5 rounded-xl text-orange-400 font-extrabold text-xs shadow-[0_0_15px_rgba(255,100,0,0.2)]">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                <span>🔥 {character.current_streak} DAY STREAK</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPath === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => onNavigate(link.path)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    logoutUser();
                    onNavigate('/');
                  }}
                  title="Logout"
                  className="p-2 ml-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 transition-all duration-200 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>🎬 DEMO REEL</span>
                </button>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-400 hover:text-white border border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-4 py-2 rounded-xl text-xs font-black text-[#050814] bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-white shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-200"
                >
                  ⚔ START JOURNEY
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <DemoReelModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050814]/95 backdrop-blur-xl border-t border-cyan-500/30 px-2 py-2 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.8)] font-mono">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-[56px]">{link.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
