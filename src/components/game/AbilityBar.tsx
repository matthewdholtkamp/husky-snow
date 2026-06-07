import React from 'react';
import { motion } from 'framer-motion';
import { ABILITIES } from '../../game/magic';
import { Sparkles, Compass } from 'lucide-react';

interface AbilityBarProps {
  charId: string; // 'shiver', 'oak', 'glacier', 'flurry'
  cooldownChapter?: string;
  currentChapterId: string;
  onUseAbility: () => void;
  disabled?: boolean;
}

export const AbilityBar: React.FC<AbilityBarProps> = ({
  charId,
  cooldownChapter,
  currentChapterId,
  onUseAbility,
  disabled = false,
}) => {
  const ability = ABILITIES[charId];

  if (!ability) return null;

  const isOnCooldown = cooldownChapter === currentChapterId;

  return (
    <div className="w-full bg-slate-900/40 border border-white/5 rounded-xl p-3 select-none flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
            Spirit Surge
          </span>
        </div>
        
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
          isOnCooldown 
            ? 'bg-slate-800 text-slate-500' 
            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
        }`}>
          {isOnCooldown ? 'ON COOLDOWN' : 'READY TO CAST'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white tracking-wide truncate">
            {ability.name} <span className="text-[10px] text-slate-400 font-normal">({ability.element})</span>
          </h4>
          <p className="text-[10px] text-slate-300 leading-normal mt-0.5">
            {ability.description}
          </p>
        </div>

        <button
          onClick={onUseAbility}
          disabled={disabled || isOnCooldown}
          className={`shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            isOnCooldown || disabled
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 active:scale-95'
          }`}
        >
          Cast Surge
        </button>
      </div>
    </div>
  );
};
