import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getDefaultDurationForCategory, QuestCategory, QuestDifficulty } from '../types/game';
import { Clock, Plus, Swords, X } from 'lucide-react';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose }) => {
  const { createQuest } = useGame();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Coding');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [durationMinutes, setDurationMinutes] = useState<number>(45); // Default for Coding
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories: QuestCategory[] = [
    'Coding',
    'Study',
    'Fitness',
    'Reading',
    'Health',
    'Creativity',
    'Mindfulness',
    'Personal',
    'Work',
    'Other',
  ];

  const difficulties: { label: QuestDifficulty; xp: number; gold: number; color: string }[] = [
    { label: 'Easy', xp: 20, gold: 10, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { label: 'Medium', xp: 40, gold: 20, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
    { label: 'Hard', xp: 75, gold: 35, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { label: 'Epic', xp: 150, gold: 75, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  ];

  const durationOptions = [
    { label: '15 Minutes (Mindfulness/Quick)', value: 15 },
    { label: '30 Minutes (Workout/Reading)', value: 30 },
    { label: '45 Minutes (Coding/Creative)', value: 45 },
    { label: '60 Minutes (Study/Focus)', value: 60 },
    { label: '90 Minutes (Deep Work/Assignment)', value: 90 },
    { label: '120 Minutes (Epic Mission)', value: 120 },
  ];

  const handleCategoryChange = (newCat: QuestCategory) => {
    setCategory(newCat);
    setDurationMinutes(getDefaultDurationForCategory(newCat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Quest title is required!');
      return;
    }
    if (title.trim().length < 3) {
      setError('Quest title must be at least 3 characters long.');
      return;
    }

    createQuest(
      title.trim(),
      category,
      difficulty,
      description.trim(),
      dueDate,
      true,
      durationMinutes
    );

    setTitle('');
    setDescription('');
    setDueDate('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-lg bg-[#0d1322] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">FORGE NEW QUEST</h3>
              <p className="text-xs text-slate-400">Define your real-life productivity mission</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">QUEST TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master JavaScript Async Patterns"
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as QuestCategory)}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} (Default: {getDefaultDurationForCategory(cat)} Min)
                </option>
              ))}
            </select>
          </div>

          {/* Quest Duration Picker */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>ESTIMATED QUEST DURATION</span>
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white cursor-pointer"
            >
              {durationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-2">DIFFICULTY & SERVER REWARD</label>
            <div className="grid grid-cols-2 gap-2">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.label;
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setDifficulty(d.label)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? `${d.color} font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]`
                        : 'border-slate-800 bg-[#080c14] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-extrabold">{d.label.toUpperCase()}</div>
                    <div className="text-[10px] opacity-80 mt-1">
                      +{d.xp} XP • +{d.gold} GOLD
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">DESCRIPTION (OPTIONAL)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe victory criteria..."
              rows={2}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#080c14] font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              FORGE QUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
