import React from 'react';
import { useGame } from '../context/GameContext';
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

  const navLinks = [
    { name: 'Adventure Hub', path: '/dashboard', icon: Compass },
    { name: 'Quests', path: '/quests', icon: Swords },
    { name: 'Character', path: '/character', icon: User },
    { name: 'Chronicle', path: '/chronicle', icon: History },
    { name: 'Guild Market', path: '/market', icon: ShoppingBag },
    { name: 'Arsenal', path: '/inventory', icon: Shield },
    { name: 'Badges', path: '/achievements', icon: Award },
  ];

  const xpPercentage = Math.min(100, Math.round((character.xp / character.xp_to_next_level) * 100));

  return (
    <>
      {/* Desktop & Laptop Header Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080c14]/85 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[2px] shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0d1322] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400 font-mono">
                  LIFE RPG
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Turn life into an adventure</p>
            </div>
          </div>

          {/* User Stats & Badges Header Bar */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-6">
              {/* Level & XP */}
              <div className="flex items-center gap-3 bg-[#0d1322] border border-cyan-500/20 px-3.5 py-1.5 rounded-xl shadow-inner">
                <div className="flex items-center gap-1.5 font-bold font-mono text-cyan-400">
                  <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                  <span>LVL {character.level}</span>
                </div>
                <div className="w-28 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>XP</span>
                    <span>{character.xp} / {character.xp_to_next_level}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-[1px] border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Gold Counter */}
              <div className="flex items-center gap-2 bg-[#0d1322] border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 font-mono font-bold text-sm shadow-[0_0_12px_rgba(255,215,0,0.15)]">
                <span className="text-lg">🪙</span>
                <span>{character.gold.toLocaleString()} GOLD</span>
              </div>

              {/* Streak Counter */}
              <div className="flex items-center gap-2 bg-[#0d1322] border border-orange-500/30 px-3 py-1.5 rounded-xl text-orange-400 font-mono font-bold text-sm shadow-[0_0_12px_rgba(255,100,0,0.15)]">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                <span>{character.current_streak} DAYS</span>
              </div>
            </div>
          )}

          {/* Navigation Items (Desktop) */}
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide font-mono transition-all duration-200 ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                  onClick={() => onNavigate('/login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold font-mono text-cyan-400 hover:text-white border border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold font-mono text-[#080c14] bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-white shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-200"
                >
                  START JOURNEY
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-lg border-t border-cyan-500/20 px-2 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-mono font-medium transition-all ${
                  isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-[56px]">{link.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
