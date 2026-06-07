import React from 'react';
import { SPIRIT_CARDS, SpiritCard } from '../../constants';
import { CHAPTERS } from '../../game/chapters';
import { FrostContainer } from '../ui/FrostContainer';
import { X, Lock, BookOpen } from 'lucide-react';

interface SpiritCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
}

export const SpiritCollection: React.FC<SpiritCollectionProps> = ({
  isOpen,
  onClose,
  chapterId,
}) => {
  if (!isOpen) return null;

  const currentChapterIdx = CHAPTERS.findIndex((c) => c.id === chapterId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <FrostContainer className="max-w-4xl w-full max-h-[85vh] p-6 relative flex flex-col animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 shrink-0 border-b border-white/5 pb-3">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <h2 className="font-serif text-xl text-white font-extrabold tracking-wider">
            Ancient Spirits of Moonshine River
          </h2>
        </div>

        {/* Card Grid Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPIRIT_CARDS.map((card) => {
              const cardChapterIdx = CHAPTERS.findIndex((c) => c.id === card.unlockedAtChapter);
              const isUnlocked = currentChapterIdx >= cardChapterIdx;

              if (!isUnlocked) {
                const chapterNum = card.unlockedAtChapter.replace('chapter_', '');
                return (
                  <div
                    key={card.id}
                    className="p-5 rounded-xl border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center h-48 select-none"
                  >
                    <Lock className="w-8 h-8 text-slate-600 mb-3" />
                    <span className="font-serif text-sm text-slate-500 font-bold uppercase tracking-wider">
                      Locked Spirit
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono mt-1">
                      Unlocks in Chapter {chapterNum}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-xl border flex flex-col h-auto transition-all hover:scale-[1.02] duration-300 ${card.color}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-serif text-base text-slate-100 font-bold">
                      {card.name}
                    </span>
                    <span className="text-2xl filter drop-shadow-md select-none">
                      {card.sigil}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-white/5 pb-1 mb-2">
                    {card.element.toUpperCase()} ELEMENT
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed font-serif italic mt-auto">
                    "{card.lore}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </FrostContainer>
    </div>
  );
};
