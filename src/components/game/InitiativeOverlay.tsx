import React, { useState } from 'react';
import { FrostContainer } from '../ui/FrostContainer';
import { Dice5, Sparkles, Check } from 'lucide-react';
import type { Player } from '../../types';

interface InitiativeOverlayProps {
  players: Player[];
  currentUserCharName: string;
  onRoll: (result: number) => void;
  isSinglePlayer: boolean;
  phase: 'initiative' | 'playing';
}

export const InitiativeOverlay: React.FC<InitiativeOverlayProps> = ({
  players,
  currentUserCharName,
  onRoll,
  phase,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);

  const currentPlayer = players.find(p => p.charName === currentUserCharName);
  const alreadyRolled = currentPlayer?.initiativeRoll !== undefined || rollResult !== null;

  const handleRoll = () => {
    if (isRolling || alreadyRolled) return;
    setIsRolling(true);
    
    // Simulate D20 roll animation
    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setRollResult(result);
      setIsRolling(false);
      onRoll(result);
    }, 1500);
  };

  // Sort players by initiativeRoll descending.
  // Those who haven't rolled yet go to the bottom.
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.initiativeRoll !== undefined && b.initiativeRoll !== undefined) {
      if (b.initiativeRoll === a.initiativeRoll) {
        return a.charName.localeCompare(b.charName); // Tie-breaker: alphabetical character name
      }
      return b.initiativeRoll - a.initiativeRoll;
    }
    if (a.initiativeRoll !== undefined) return -1;
    if (b.initiativeRoll !== undefined) return 1;
    return a.charName.localeCompare(b.charName);
  });

  const allPlayersRolled = players.every(p => p.initiativeRoll !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <FrostContainer className="max-w-md w-full p-8 relative flex flex-col justify-between min-h-[400px] shadow-2xl border-indigo-500/20">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-3 animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="font-serif text-2xl text-white font-extrabold tracking-wider">
            {phase === 'initiative' ? "Roll for Initiative!" : "Late Joiner Roll!"}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {phase === 'initiative' 
              ? "Establish the turn order for the adventure. Highest D20 roll goes first."
              : "Roll a D20 to determine where you slot into the active turn order."}
          </p>
        </div>

        {/* Core status or roll button */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          {!alreadyRolled ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className={`text-5xl my-2 select-none ${isRolling ? 'animate-spin' : 'animate-bounce'}`}>
                🎲
              </div>
              <button
                onClick={handleRoll}
                disabled={isRolling}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:opacity-50 text-white font-serif font-bold text-lg rounded-xl shadow-lg shadow-indigo-600/30 transform active:scale-95 transition-all flex items-center gap-2"
              >
                <Dice5 className="w-5 h-5 animate-pulse" />
                {isRolling ? "Rolling..." : "Roll D20!"}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {/* Current user's roll announcement */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 text-center animate-fade-in-up">
                <div className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Your Roll</div>
                <div className="text-4xl font-extrabold text-white font-serif mt-1">
                  {currentPlayer?.initiativeRoll ?? rollResult}
                </div>
              </div>

              {/* Player List and Status */}
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Turn Order / Rolls</h3>
                {sortedPlayers.map((p, idx) => {
                  const hasRolled = p.initiativeRoll !== undefined;
                  const isCurrent = p.charName === currentUserCharName;
                  const isFirst = hasRolled && idx === 0 && allPlayersRolled;

                  return (
                    <div 
                      key={p.userId} 
                      className={`flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                        isCurrent ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFirst ? (
                          <span className="bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded text-xs border border-amber-500/30">1st</span>
                        ) : hasRolled && allPlayersRolled ? (
                          <span className="bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded text-xs">{idx + 1}</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        )}
                        <span className={`font-semibold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {p.charName} {isCurrent && <span className="text-xs text-indigo-400 font-normal">(You)</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        {hasRolled ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> D20: {p.initiativeRoll}
                          </span>
                        ) : (
                          <span className="text-slate-500 animate-pulse">Waiting...</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Waiting status message */}
              <div className="text-center pt-2">
                {allPlayersRolled ? (
                  <p className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> All rolls complete! Commencing...
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic animate-pulse">
                    Waiting for remaining players to roll initiative...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </FrostContainer>
    </div>
  );
};
