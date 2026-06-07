import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';

interface ObjectiveTrackerProps {
  chapterTitle: string;
  objectiveText: string;
}

export const ObjectiveTracker: React.FC<ObjectiveTrackerProps> = ({
  chapterTitle,
  objectiveText,
}) => {
  return (
    <div className="w-full bg-slate-900/55 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg select-none">
      <div className="flex items-start gap-3">
        {/* Icon with pulsing background glow */}
        <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span className="absolute inset-0 w-full h-full rounded-lg bg-indigo-400/10 animate-ping pointer-events-none" />
        </div>

        {/* Content with Animating text on change */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapterTitle}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-400">
                  Current Quest
                </span>
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              </div>
              
              <h3 className="text-xs font-serif font-bold text-white tracking-wide truncate">
                {chapterTitle}
              </h3>
              
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                {objectiveText}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
