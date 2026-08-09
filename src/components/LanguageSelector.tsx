import React from 'react';
import { LanguageCode } from '../types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onSelectLang }) => {
  return (
    <div className="flex items-center gap-1.5 bg-[#080b12] p-1 rounded-xl border border-slate-800 text-xs">
      <Globe className="w-3.5 h-3.5 text-blue-400 ml-1.5 shrink-0" />
      <button
        onClick={() => onSelectLang('en')}
        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
          currentLang === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onSelectLang('hi')}
        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
          currentLang === 'hi'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        हिन्दी
      </button>
      <button
        onClick={() => onSelectLang('te')}
        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
          currentLang === 'te'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        తెలుగు
      </button>
    </div>
  );
};
