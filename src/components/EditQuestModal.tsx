import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Quest, QuestCategory, QuestDifficulty } from '../types/game';
import { Edit3, X } from 'lucide-react';

interface EditQuestModalProps {
  quest: Quest | null;
  onClose: () => void;
}

export const EditQuestModal: React.FC<EditQuestModalProps> = ({ quest, onClose }) => {
  const { updateQuest } = useGame();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Coding');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setCategory(quest.category);
      setDifficulty(quest.difficulty);
      setDescription(quest.description || '');
    }
  }, [quest]);

  if (!quest) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateQuest(quest.id, {
      title: title.trim(),
      category,
      difficulty,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0d1322] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">REFORGE QUEST</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">QUEST TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as QuestCategory)}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white"
            >
              <option value="Easy">Easy (+20 XP, +10 Gold)</option>
              <option value="Medium">Medium (+40 XP, +20 Gold)</option>
              <option value="Hard">Hard (+75 XP, +35 Gold)</option>
              <option value="Epic">Epic (+150 XP, +75 Gold)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080c14] font-bold"
            >
              UPDATE QUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
