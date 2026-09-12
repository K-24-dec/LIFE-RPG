import React from 'react';
import { useGame } from '../context/GameContext';
import { StatProgressBar } from './StatProgressBar';
import { Award, BookOpen, Brain, Cpu, Dumbbell, Flame, Shield, Sparkles, Swords, User, Zap } from 'lucide-react';

export const CharacterCard: React.FC = () => {
  const { character } = useGame();

  const xpPercentage = Math.min(100, Math.round((character.xp / character.xp_to_next_level) * 100));

  // Determine avatar icon based on equipped avatar
  const getAvatarIcon = () => {
    switch (character.equipped_avatar) {
      case 'avatar_shadow_ninja':
        return <User className="w-10 h-10 text-cyan-300" />;
      case 'avatar_arcane_mage':
        return <Sparkles className="w-10 h-10 text-purple-300" />;
      case 'avatar_mech_warrior':
        return <Cpu className="w-10 h-10 text-rose-300" />;
      case 'avatar_void_lord':
        return <Award className="w-10 h-10 text-amber-300 animate-pulse" />;
      case 'avatar_cyber_hero':
      default:
        return <Shield className="w-10 h-10 text-cyan-400" />;
    }
  };

  // Determine frame border styling
  const getFrameStyle = () => {
    switch (character.equipped_frame) {
      case 'frame_solar_gold':
        return 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]';
      case 'frame_cyber_pink':
        return 'border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse';
      case 'frame_void_flame':
        return 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.7)]';
      case 'frame_neon_cyan':
      default:
        return 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]';
    }
  };

  return (
    <div className="relative bg-[#0d1322]/90 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.6)] overflow-hidden font-mono">
      {/* Background Neon Accent Radial */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header section: Avatar + Title + Level */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-slate-800/80">
        {/* Avatar Ring */}
        <div className={`relative w-24 h-24 rounded-2xl bg-[#080c14] border-2 ${getFrameStyle()} flex items-center justify-center p-3 transition-all duration-300`}>
          {getAvatarIcon()}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-[#080c14] font-black text-xs px-2.5 py-0.5 rounded-lg shadow border border-cyan-300">
            LVL {character.level}
          </div>
        </div>

        {/* Character Bio Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-1">
            ✨ {character.equipped_title || 'Novice Adventurer'}
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">{character.name}</h2>

          {/* XP Progress Bar */}
          <div className="mt-3 w-full">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>PROGRESS TO LEVEL {character.level + 1}</span>
              <span className="text-cyan-400 font-bold">
                {character.xp} / {character.xp_to_next_level} XP ({xpPercentage}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-700"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards (Gold + Streak) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#080c14] border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="text-2xl">🪙</div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase">GUILD TREASURY</div>
            <div className="text-lg font-extrabold text-amber-300">{character.gold.toLocaleString()} GOLD</div>
          </div>
        </div>

        <div className="bg-[#080c14] border border-orange-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-bounce" />
          <div>
            <div className="text-[10px] text-orange-400 font-bold uppercase">CURRENT STREAK</div>
            <div className="text-lg font-extrabold text-orange-300">{character.current_streak} DAYS</div>
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
          <span>CHARACTER ATTRIBUTES</span>
          <span className="text-cyan-400 text-[10px]">SERVERSIDE AUTHORITATIVE</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatProgressBar
            label="INTELLIGENCE"
            value={character.intelligence}
            max={150}
            color="cyan"
            icon={<Brain className="w-4 h-4" />}
            description="Boosted by Coding & Study Quests"
          />
          <StatProgressBar
            label="STRENGTH"
            value={character.strength}
            max={150}
            color="rose"
            icon={<Dumbbell className="w-4 h-4" />}
            description="Boosted by Fitness & Workout Quests"
          />
          <StatProgressBar
            label="WISDOM"
            value={character.wisdom}
            max={150}
            color="purple"
            icon={<BookOpen className="w-4 h-4" />}
            description="Boosted by Reading & Creative Quests"
          />
          <StatProgressBar
            label="AGILITY"
            value={character.agility}
            max={150}
            color="emerald"
            icon={<Zap className="w-4 h-4" />}
            description="Boosted by Running & Health Quests"
          />
          <StatProgressBar
            label="DISCIPLINE"
            value={character.discipline}
            max={150}
            color="amber"
            icon={<Shield className="w-4 h-4" />}
            description="Boosted by Meditation & Personal Quests"
          />
        </div>
      </div>
    </div>
  );
};
