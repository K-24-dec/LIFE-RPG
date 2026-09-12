import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Award, Check, Crown, Shield, ShoppingBag, Sparkles, Zap } from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { character, marketItems, inventory, buyMarketItem } = useGame();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [purchaseNotice, setPurchaseNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const types = ['All', 'avatar', 'frame', 'title', 'theme'];

  const filteredItems = marketItems.filter((item) => selectedType === 'All' || item.type === selectedType);

  const handleBuy = (itemId: string) => {
    const res = buyMarketItem(itemId);
    setPurchaseNotice({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
    setTimeout(() => setPurchaseNotice(null), 4000);
  };

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'EPIC':
        return 'text-purple-400 border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'RARE':
        return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,240,255,0.3)]';
      case 'UNCOMMON':
        return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
      case 'COMMON':
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400 text-amber-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">GUILD MARKET</h1>
              <p className="text-xs text-slate-400">
                Spend earned Gold to acquire legendary avatars, frames, titles, and themes.
              </p>
            </div>
          </div>

          {/* User Gold Balance Card */}
          <div className="bg-[#080c14] border border-amber-500/40 px-4 py-2.5 rounded-2xl text-amber-300 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <span className="text-xl">🪙</span>
            <span>{character.gold.toLocaleString()} GOLD AVAILABLE</span>
          </div>
        </div>

        {/* Purchase Toast Notice */}
        {purchaseNotice && (
          <div
            className={`p-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-between transition-all ${
              purchaseNotice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}
          >
            <span>{purchaseNotice.message}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {types.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0d1322] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type === 'All' ? 'ALL ITEMS' : `${type}S`}
              </button>
            );
          })}
        </div>

        {/* Market Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            const canAfford = character.gold >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-[#0d1322] border border-cyan-500/20 hover:border-cyan-400/40 rounded-3xl p-6 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  {/* Top Badge & Rarity */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.type}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getRarityStyle(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mb-6 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price & Buy Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-amber-400 font-bold text-sm flex items-center gap-1">
                    <span className="text-base">🪙</span>
                    <span>{item.cost === 0 ? 'FREE' : `${item.cost} GOLD`}</span>
                  </div>

                  {isOwned ? (
                    <span className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> OWNED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={!canAfford}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-[#080c14] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {canAfford ? '[ BUY ITEM ]' : 'NEED GOLD'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
