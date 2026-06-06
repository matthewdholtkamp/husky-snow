import React, { useState, useEffect, useCallback } from 'react';
import type { Message, Character, Player, InventoryItem, Badge } from '../../src/types';

// UI Components
import { BackgroundLayer } from './ui/BackgroundLayer';
import { FrostContainer } from './ui/FrostContainer';
import { CharacterSheet } from './game/CharacterSheet';
import { InventoryGrid } from './game/InventoryGrid';
import { MessageLog } from './game/MessageLog';
import { ActionBar } from './game/ActionBar';
import { Dice3D } from './effects/Dice3D';
import { ScreenShake } from './effects/ScreenShake';
import { Dice5, LogOut, RefreshCw } from 'lucide-react';

interface GameScreenProps {
  messages: Message[];
  selectedChar: Character;
  suggestions: string[];
  isThinking: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onRoll: (result?: number, outcome?: string, rollText?: string) => Promise<void>;
  onLeaveGame: () => void;
  onRetry: () => void;
  gameId: string | null;
  players: Player[];
  playerRole: 'host' | 'player' | 'spectator';
  modeNotice?: string | null;
}

export default function GameScreen({
  messages,
  selectedChar,
  suggestions,
  isThinking,
  onSendMessage,
  onRoll,
  onLeaveGame,
  onRetry,
  gameId,
  players,
  playerRole,
  modeNotice
}: GameScreenProps) {

  // Local State
  const [showDice, setShowDice] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);
  const [localBadges, setLocalBadges] = useState<Badge[]>([]);

  // Sync Inventory/Badges from Players List
  useEffect(() => {
    if (!players) return;
    const myPlayer = players.find(p => p.charName === selectedChar.name);
    if (myPlayer) {
      if (myPlayer.inventory) setLocalInventory(myPlayer.inventory);
      if (myPlayer.badges) setLocalBadges(myPlayer.badges);
    }
  }, [players, selectedChar.name]);


  // --- Action Handlers ---

  const handleAction = async (actionText: string) => {
    await onSendMessage(actionText);
  };

  const handleRollComplete = async (result: number) => {
    setShowDice(false);

    // Determine outcome
    let outcome = "Failure";
    if (result > 15) outcome = "Critical Success!";
    else if (result > 10) outcome = "Success";
    else if (result === 1) outcome = "Critical Fail!";

    const rollText = `*Rolls D20... Result: ${result}* (${outcome})`;

    await onRoll(result, outcome, rollText);

    // Trigger Screen Shake on low rolls (damage implication)
    if (result <= 5) {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  const triggerDice = () => {
    setShowDice(true);
  };

  const canRoll = playerRole !== 'spectator' && !isThinking;
  const aiRequestedRoll = messages.length > 0 && messages[messages.length - 1].text.includes("Roll the D20");

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-slate-200">
      <BackgroundLayer scene="default" />

      <ScreenShake trigger={shakeTrigger}>
        <div className="relative z-10 w-full h-full min-h-0 box-border flex flex-col md:flex-row p-3 md:p-4 gap-3 md:gap-4">

          {/* LEFT COLUMN: Character & Stats (Hidden on mobile, drawer optional?) */}
          <div className="hidden md:flex w-1/4 min-h-0 flex-col gap-4">
             <CharacterSheet character={selectedChar} earnedBadges={localBadges} />
             <InventoryGrid items={localInventory} />
          </div>

          {/* CENTER: Main Game Area */}
          <div className="flex-1 h-full min-h-0 flex flex-col gap-3 md:gap-4 min-w-0">
             {/* Header */}
             <div className="shrink-0 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="min-w-0">
                  <h1 className="text-lg font-serif font-bold text-white tracking-widest truncate">
                    Husky's Snow <span className="text-slate-400 text-xs font-sans font-normal">| {playerRole.toUpperCase()}</span>
                  </h1>
                  {gameId && <p className="text-[10px] text-slate-500 font-mono truncate">Game {gameId.slice(0, 12)}</p>}
                </div>
                <div className="flex gap-2">
                   {playerRole === 'host' && (
                     <button onClick={onRetry} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Retry AI Response">
                       <RefreshCw className="w-4 h-4 text-slate-300" />
                     </button>
                   )}
                   <button onClick={onLeaveGame} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-400" title="Leave Game">
                     <LogOut className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {modeNotice && (
               <div className="shrink-0 bg-amber-950/70 border border-amber-700/50 text-amber-100 text-sm rounded-lg px-4 py-3">
                 {modeNotice}
               </div>
             )}

             <div className="shrink-0 md:hidden grid grid-cols-3 gap-2 text-center text-xs">
               <div className="bg-black/35 border border-white/10 rounded-lg px-3 py-2">
                 <div className="text-slate-400 uppercase tracking-wider">Pup</div>
                 <div className="font-bold text-white truncate">{selectedChar.name}</div>
               </div>
               <div className="bg-black/35 border border-white/10 rounded-lg px-3 py-2">
                 <div className="text-slate-400 uppercase tracking-wider">Items</div>
                 <div className="font-bold text-white">{localInventory.reduce((total, item) => total + item.quantity, 0)}</div>
               </div>
               <div className="bg-black/35 border border-white/10 rounded-lg px-3 py-2">
                 <div className="text-slate-400 uppercase tracking-wider">Badges</div>
                 <div className="font-bold text-white">{localBadges.length}</div>
               </div>
             </div>

             {/* Chat / Story Log */}
             <MessageLog messages={messages} />

             {/* Action Bar */}
             <div className="shrink-0">
               <FrostContainer className="p-4" noBorder>
                  {/* If AI asks for roll, we could inject a special button here or relying on suggestions */}
                  {canRoll ? (
                     <button
                       onClick={triggerDice}
                       className={`w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 mb-4 flex items-center justify-center gap-2 ${aiRequestedRoll ? 'animate-bounce' : ''}`}
                     >
                       <Dice5 className="w-5 h-5" /> Roll D20
                     </button>
                  ) : null}

                  <ActionBar
                    suggestions={suggestions}
                    onAction={handleAction}
                    characterName={selectedChar.name}
                    isThinking={isThinking}
                  />
               </FrostContainer>
             </div>
          </div>

          {/* RIGHT COLUMN: Mobile Inventory / Extra Info (Optional, keeping simple for now) */}
          {/* Could be used for Party Status in future */}
        </div>
      </ScreenShake>

      {/* Overlays */}
      <Dice3D isRolling={showDice} onRollComplete={handleRollComplete} />

    </div>
  );
}
