import React, { useState } from 'react';
import { Quest } from '../types/game';
import { Camera, CheckCircle2, MessageSquare, Sparkles, Swords, X } from 'lucide-react';

interface QuestCompletionModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reflectionNote?: string, proofUrl?: string) => void;
  isSubmitting?: boolean;
}

export const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  quest,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  const [reflectionNote, setReflectionNote] = useState('');
  const [proofUrl, setProofUrl] = useState('');

  if (!isOpen || !quest) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reflectionNote.trim() || undefined, proofUrl.trim() || undefined);
    setReflectionNote('');
    setProofUrl('');
  };

  const handleSkip = () => {
    onConfirm(undefined, undefined);
    setReflectionNote('');
    setProofUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-md bg-[#0d1322] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,240,255,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">COMPLETE QUEST</h3>
              <p className="text-[10px] text-cyan-400 truncate max-w-[220px]">{quest.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          {/* Feature 1: Reflection Note Input */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>REFLECTION NOTE (OPTIONAL)</span>
              </span>
              <span className="text-[10px] text-slate-500">{reflectionNote.length} / 280</span>
            </label>
            <textarea
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value.slice(0, 280))}
              placeholder="What did you do? Briefly reflect on your real-world victory..."
              rows={3}
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none transition resize-none font-sans"
            />
          </div>

          {/* Feature 4: Proof Attachment */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>PROOF ATTACHMENT / IMAGE URL (OPTIONAL)</span>
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://example.com/proof-photo.jpg"
              className="w-full bg-[#080c14] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none transition"
            />
            {proofUrl.trim() && (
              <div className="mt-2 relative w-full h-24 rounded-xl border border-amber-500/30 overflow-hidden bg-[#080c14]">
                <img
                  src={proofUrl}
                  alt="Proof preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition font-bold"
            >
              SKIP & CLAIM
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-[#080c14] font-black text-xs tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition transform hover:scale-[1.02]"
            >
              {isSubmitting ? 'VERIFYING...' : 'CONFIRM VICTORY'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
