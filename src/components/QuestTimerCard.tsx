import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Quest, QuestState } from '../types/game';
import { getQuestState } from '../lib/gameEngine';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Dumbbell,
  Edit3,
  Lock,
  Play,
  Shield,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';

interface QuestTimerCardProps {
  quest: Quest;
  onCompleteClick: (quest: Quest) => void;
  onEditClick: (quest: Quest) => void;
  onDeleteClick: (questId: string) => void;
}

export const QuestTimerCard: React.FC<QuestTimerCardProps> = ({
  quest,
  onCompleteClick,
  onEditClick,
  onDeleteClick,
}) => {
  const { startQuestTimer } = useGame();
  const [questState, setQuestState] = useState<QuestState>(() => getQuestState(quest));
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const durationSec = quest.min_duration_seconds || (quest.duration_minutes ? quest.duration_minutes * 60 : 1800);

  useEffect(() => {
    const updateState = () => {
      const currentState = getQuestState(quest);
      setQuestState(currentState);

      if (quest.started_at && !quest.completed) {
        const elapsed = Math.max(0, Date.now() - new Date(quest.started_at).getTime());
        setElapsedMs(elapsed);
      }
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [quest]);

  const elapsedSecondsTotal = Math.floor(elapsedMs / 1000);
  const remainingSecondsTotal = Math.max(0, durationSec - elapsedSecondsTotal);
  const progressPercentage = Math.min(100, Math.round((elapsedSecondsTotal / durationSec) * 100));

  const formatMinSec = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'hard':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'epic':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Coding':
      case 'Study':
        return <Brain className="w-4 h-4 text-cyan-400" />;
      case 'Fitness':
        return <Dumbbell className="w-4 h-4 text-rose-400" />;
      case 'Reading':
      case 'Creativity':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'Health':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      default:
        return <Shield className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="group bg-[#0d1322] hover:bg-[#11192e] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-5 shadow-lg transition-all duration-200 font-mono flex flex-col justify-between">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#080c14] border border-slate-800 flex items-center justify-center">
              {getCategoryIcon(quest.category)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {quest.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {quest.duration_minutes || Math.ceil(durationSec / 60)} MIN
                </span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                {quest.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
            {!quest.completed && (
              <button
                onClick={() => onEditClick(quest)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Edit Quest"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeleteClick(quest.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
              title="Delete Quest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {quest.description && (
          <p className="text-xs text-slate-400 font-sans mb-4 pl-12 leading-relaxed">
            {quest.description}
          </p>
        )}

        {/* Real-Time Timer UI (ACTIVE state) */}
        {questState === 'ACTIVE' && (
          <div className="mb-4 bg-[#080c14] border border-cyan-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                QUEST IN PROGRESS
              </span>
              <span className="text-slate-300 font-extrabold text-sm">{formatMinSec(elapsedSecondsTotal)}</span>
            </div>

            {/* Cyberpunk Progress Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-300 to-blue-500 shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Required: {formatMinSec(durationSec)}</span>
              <span className="text-amber-400 font-bold">Remaining: {formatMinSec(remainingSecondsTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rewards & State Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-cyan-400 font-bold">
            ⚡ +{quest.difficulty === 'Easy' ? 20 : quest.difficulty === 'Medium' ? 40 : quest.difficulty === 'Hard' ? 75 : 150} XP
          </span>
          <span className="text-amber-400 font-bold">
            🪙 +{quest.difficulty === 'Easy' ? 10 : quest.difficulty === 'Medium' ? 20 : quest.difficulty === 'Hard' ? 35 : 75} GOLD
          </span>
        </div>

        {/* State Machine Action Button */}
        <div>
          {questState === 'READY' && (
            <button
              onClick={() => startQuestTimer(quest.id)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] transition transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>[ START QUEST ]</span>
            </button>
          )}

          {questState === 'ACTIVE' && (
            <button
              disabled
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>COMPLETE QUEST (Locked - {formatMinSec(remainingSecondsTotal)})</span>
            </button>
          )}

          {questState === 'COMPLETABLE' && (
            <button
              onClick={() => onCompleteClick(quest)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-[#080c14] font-black text-xs tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] transition transform hover:scale-[1.03] flex items-center justify-center gap-2 animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>[ COMPLETE QUEST ]</span>
            </button>
          )}

          {questState === 'COMPLETED' && (
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> COMPLETED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
