import React from 'react';
import { useGame } from '../context/GameContext';
import { Check, Shield, Sparkles } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { character, marketItems, inventory, equipCosmetic } = useGame();

  const ownedItems = marketItems.filter((item) => inventory.includes(item.id));

  const isEquipped = (item: typeof marketItems[0]) => {
    switch (item.type) {
      case 'avatar':
        return character.equipped_avatar === item.id;
      case 'frame':
        return character.equipped_frame === item.id;
      case 'theme':
        return character.equipped_theme === item.id;
      case 'title':
        return character.equipped_title === item.name;
      default:
        return false;
    }
  };

  const handleEquip = (item: typeof marketItems[0]) => {
    equipCosmetic(item.type as 'avatar' | 'frame' | 'theme' | 'title', item.type === 'title' ? item.name : item.id);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-mono pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header */}
        <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400 text-cyan-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">YOUR ARSENAL</h1>
              <p className="text-xs text-slate-400">
                View owned items and equip custom avatars, frames, themes, and legendary titles.
              </p>
            </div>
          </div>
        </div>

        {ownedItems.length === 0 ? (
          <div className="bg-[#0d1322] border border-cyan-500/20 rounded-3xl p-12 text-center space-y-4">
            <Shield className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">Your arsenal is empty.</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
              Complete quests, earn Gold, and visit the Guild Market to collect cosmetics!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedItems.map((item) => {
              const equipped = isEquipped(item);

              return (
                <div
                  key={item.id}
                  className={`bg-[#0d1322] border ${
                    equipped ? 'border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)]' : 'border-cyan-500/20'
                  } rounded-3xl p-6 shadow-lg flex flex-col justify-between transition`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase">{item.type}</span>
                      {equipped && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400 px-2 py-0.5 rounded-full font-bold">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-sans mb-6">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handleEquip(item)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      equipped
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 cursor-default'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-[#080c14] hover:from-cyan-300 hover:to-blue-400 shadow-md'
                    }`}
                  >
                    {equipped ? 'EQUIPPED ON CHARACTER' : 'EQUIP ITEM'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
