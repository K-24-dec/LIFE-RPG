import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, Calendar, Camera, CheckCircle2, History, MessageSquare, Sparkles, Swords, Zap } from 'lucide-react';

export const ChroniclePage: React.FC = () => {
  const { completions } = useGame();

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400 text-cyan-400">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">THE CHRONICLE</h1>
              <p className="text-xs text-slate-400">
                Immutable activity timeline of your real-world quest victories, reflections, and proof history.
              </p>
            </div>
          </div>
        </div>

        {completions.length === 0 ? (
          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-12 text-center space-y-4">
            <History className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No chronicle history recorded yet.</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              Complete your first quest from the Adventure Hub to log your real-world progression!
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-6 space-y-6 pl-6 sm:pl-8">
            {completions.map((comp) => {
              const formattedDate = new Date(comp.completed_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={comp.id} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#080c14] border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:scale-125 transition" />

                  <div className="bg-[#0d1322] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-5 shadow-md transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> QUEST COMPLETED
                        </span>
                        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {comp.category}
                        </span>
                        {comp.verified_via === 'proof_upload' && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Camera className="w-3 h-3 text-amber-400" /> PROOF VERIFIED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{comp.quest_title}</h4>

                    {/* Reflection Note Box */}
                    {comp.reflection_note && (
                      <div className="bg-[#080c14] border border-cyan-500/20 rounded-xl p-3 text-xs text-slate-300 font-sans italic flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-cyan-400 font-mono font-bold block uppercase not-italic">
                            HERO REFLECTION
                          </span>
                          "{comp.reflection_note}"
                        </div>
                      </div>
                    )}

                    {/* Proof Image Attachment */}
                    {comp.proof_url && (
                      <div className="mt-2 relative max-w-sm rounded-xl overflow-hidden border border-amber-500/30">
                        <img
                          src={comp.proof_url}
                          alt="Verification Proof"
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Rewards Summary */}
                    <div className="flex flex-wrap items-center gap-3 text-xs bg-[#080c14] p-3 rounded-xl border border-slate-800">
                      <span className="text-cyan-400 font-bold">⚡ +{comp.xp_awarded} XP</span>
                      <span className="text-amber-400 font-bold">🪙 +{comp.gold_awarded} GOLD</span>
                      <span className="text-purple-400 font-bold uppercase">
                        ✨ {comp.attribute_boosted} +{comp.attribute_amount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
