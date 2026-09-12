import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterCard } from '../components/CharacterCard';
import { CreateQuestModal } from '../components/CreateQuestModal';
import { EditQuestModal } from '../components/EditQuestModal';
import { QuestCompletionModal } from '../components/QuestCompletionModal';
import { QuestTimerCard } from '../components/QuestTimerCard';
import { Quest } from '../types/game';
import { Flame, Plus, Sparkles, Swords } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { character, quests, completeQuest, deleteQuest, isFirstTimeUser } = useGame();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [completingQuest, setCompletingQuest] = useState<Quest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeQuests = quests.filter((q) => !q.completed);

  const handleConfirmCompletion = async (reflectionNote?: string, proofUrl?: string) => {
    if (!completingQuest) return;
    setIsSubmitting(true);
    await completeQuest(completingQuest.id, reflectionNote, proofUrl);
    setIsSubmitting(false);
    setCompletingQuest(null);
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>
                {isFirstTimeUser
                  ? 'WELCOME ADVENTURER // YOUR JOURNEY BEGINS'
                  : `ADVENTURE HUB // REALM OF ${character.name.toUpperCase()}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {isFirstTimeUser ? 'WELCOME, ADVENTURER' : "TODAY'S MISSIONS"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-[#080c14] font-black text-xs tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] transition transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ CREATE QUEST</span>
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <CharacterCard />

            <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
                  <h3 className="text-sm font-bold text-white">WEEKLY ACTIVITY STREAK</h3>
                </div>
                <span className="text-xs text-orange-400 font-extrabold">{character.current_streak} DAY STREAK</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {daysOfWeek.map((day, idx) => {
                  const isActiveDay = character.current_streak > 0 && idx < character.current_streak;
                  return (
                    <div
                      key={day}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                        isActiveDay
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-400 shadow-[0_0_10px_rgba(255,100,0,0.3)]'
                          : 'bg-[#080c14] border-slate-800 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{day}</span>
                      <span className="text-base">{isActiveDay ? '🔥' : '░'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-cyan-400" />
                <span>ACTIVE QUEST BOARD ({activeQuests.length})</span>
              </h3>
              <button
                onClick={() => onNavigate('/quests')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
              >
                View All Quests →
              </button>
            </div>

            {activeQuests.length === 0 && (
              <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
                  <Swords className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {isFirstTimeUser ? 'YOUR ADVENTURE BEGINS HERE' : 'Your quest board is empty.'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                  {isFirstTimeUser
                    ? 'Create your first quest to start earning XP, Gold, building attributes, and leveling up your hero.'
                    : 'Every real-life hero starts with a single mission. Create a quest to begin earning XP and Gold!'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#080c14] font-black text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition transform hover:scale-105"
                >
                  + CREATE YOUR FIRST QUEST
                </button>
              </div>
            )}

            <div className="space-y-4">
              {activeQuests.map((quest) => (
                <QuestTimerCard
                  key={quest.id}
                  quest={quest}
                  onCompleteClick={(q) => setCompletingQuest(q)}
                  onEditClick={(q) => setEditingQuest(q)}
                  onDeleteClick={(id) => deleteQuest(id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CreateQuestModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <EditQuestModal quest={editingQuest} onClose={() => setEditingQuest(null)} />
      <QuestCompletionModal
        quest={completingQuest}
        isOpen={Boolean(completingQuest)}
        onClose={() => setCompletingQuest(null)}
        onConfirm={handleConfirmCompletion}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
