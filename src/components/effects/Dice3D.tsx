import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Dice3DProps {
  onRollComplete: (result: number) => void;
  isRolling: boolean;
  statAbbr?: string;
  modifier?: number;
}

export const Dice3D: React.FC<Dice3DProps> = ({
  onRollComplete,
  isRolling,
  statAbbr = '',
  modifier = 0,
}) => {
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentRollingNumber, setCurrentRollingNumber] = useState(10);
  const onRollCompleteRef = useRef(onRollComplete);

  // Check for prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    onRollCompleteRef.current = onRollComplete;
  }, [onRollComplete]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Number cycle effect during rolling
  useEffect(() => {
    if (!isRolling) return;
    
    const interval = setInterval(() => {
      setCurrentRollingNumber(Math.floor(Math.random() * 20) + 1);
    }, 75);

    return () => clearInterval(interval);
  }, [isRolling]);

  useEffect(() => {
    if (!isRolling) return;

    setIsVisible(true);
    setShowResult(false);
    setResult(null);

    let completeTimer: number | undefined;
    const rollTimer = window.setTimeout(() => {
      const outcome = Math.floor(Math.random() * 20) + 1;
      setResult(outcome);
      setShowResult(true);

      completeTimer = window.setTimeout(() => {
        setIsVisible(false);
        setShowResult(false);
        onRollCompleteRef.current(outcome);
      }, 1800); // 1.8 seconds to view results and math
    }, 1800); // 1.8 seconds of tumbling

    return () => {
      window.clearTimeout(rollTimer);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, [isRolling]);

  if (!isVisible) return null;

  const isCritSuccess = result === 20;
  const isCritFail = result === 1;
  const total = result !== null ? result + modifier : 0;
  const modifierSign = modifier >= 0 ? '+' : '-';
  const displayModifier = Math.abs(modifier);

  // Color mapping based on roll outcome
  let outcomeText = '';
  let outcomeColorClass = 'text-white';
  if (result !== null) {
    if (isCritSuccess) {
      outcomeText = 'CRITICAL SUCCESS!';
      outcomeColorClass = 'text-amber-400 font-serif drop-shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse';
    } else if (isCritFail) {
      outcomeText = 'CRITICAL FAIL!';
      outcomeColorClass = 'text-red-500 font-serif drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]';
    } else if (total >= 16) {
      outcomeText = 'SUCCESS!';
      outcomeColorClass = 'text-emerald-400';
    } else if (total >= 11) {
      outcomeText = 'SUCCESS';
      outcomeColorClass = 'text-emerald-500';
    } else {
      outcomeText = 'FAILURE';
      outcomeColorClass = 'text-slate-400';
    }
  }

  // Animation values
  const rollAnimation = prefersReducedMotion
    ? { scale: [0.9, 1.05, 1], opacity: [0, 1] }
    : {
        rotate: [0, 360, 720, 1080],
        scale: [0.6, 1.2, 0.9, 1.1, 1],
        x: [0, -30, 20, -10, 0],
        y: [0, -50, 10, -5, 0],
      };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
      
      {/* Critique Flash effects */}
      {showResult && isCritSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/35 to-amber-500/20 pointer-events-none z-10"
        />
      )}

      {showResult && isCritFail && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-red-600/20 pointer-events-none z-10"
        />
      )}

      <div className="relative flex flex-col items-center gap-6">
        
        {/* Glowing Background Ring */}
        <div className={`absolute w-48 h-48 rounded-full filter blur-3xl opacity-30 transition-colors duration-500 ${
          showResult
            ? isCritSuccess
              ? 'bg-amber-400'
              : isCritFail
              ? 'bg-red-600'
              : total >= 11
              ? 'bg-emerald-500'
              : 'bg-indigo-600'
            : 'bg-indigo-500'
        }`} />

        {/* The D20 SVG Silhouette */}
        <motion.div
          animate={showResult ? { rotate: 0 } : rollAnimation}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="relative w-40 h-40 flex items-center justify-center cursor-default z-20"
        >
          <svg
            viewBox="0 0 200 200"
            className={`w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${
              showResult
                ? isCritSuccess
                  ? 'text-amber-500'
                  : isCritFail
                  ? 'text-red-700'
                  : total >= 11
                  ? 'text-emerald-600'
                  : 'text-indigo-700'
                : 'text-indigo-600'
            }`}
          >
            {/* Inner Triangles / Facets */}
            {/* Center face */}
            <polygon points="100,60 65.36,120 134.64,120" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
            
            {/* Surrounding faces */}
            <polygon points="100,20 169.28,60 100,60" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="169.28,60 134.64,120 100,60" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="169.28,60 169.28,140 134.64,120" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="169.28,140 100,180 134.64,120" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="100,180 65.36,120 134.64,120" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="100,180 30.72,140 65.36,120" fill="currentColor" fillOpacity="0.32" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="30.72,140 30.72,60 65.36,120" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="30.72,60 100,60 65.36,120" fill="currentColor" fillOpacity="0.26" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="30.72,60 100,20 100,60" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2.5" />
          </svg>

          {/* D20 Number in the center */}
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.span
                  key="rolling"
                  className="text-3xl font-bold font-mono text-indigo-200"
                >
                  {currentRollingNumber}
                </motion.span>
              ) : (
                <motion.span
                  key="result"
                  initial={{ scale: 0.3, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    duration: prefersReducedMotion ? 0.3 : 0.6 
                  }}
                  className={`text-4xl font-extrabold font-serif tracking-wider ${
                    isCritSuccess
                      ? 'text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]'
                      : isCritFail
                      ? 'text-red-400 drop-shadow-[0_2px_8px_rgba(220,38,38,0.8)]'
                      : 'text-white'
                  }`}
                >
                  {result}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Outcomes and Math Overlays */}
        <div className="h-24 flex flex-col items-center justify-start text-center z-20">
          <AnimatePresence>
            {showResult && result !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1"
              >
                {/* Result Math */}
                {statAbbr ? (
                  <div className="text-sm tracking-wide text-slate-400 font-mono">
                    {result} ({statAbbr}) {modifierSign} {displayModifier} = <span className="text-white font-bold">{total}</span>
                  </div>
                ) : (
                  <div className="text-sm tracking-wide text-slate-400 font-mono">
                    Roll: <span className="text-white font-bold">{result}</span>
                  </div>
                )}

                {/* Outcome Label */}
                <div className={`text-xl font-bold tracking-widest uppercase ${outcomeColorClass}`}>
                  {outcomeText}
                </div>

                {/* Crit celebration badge */}
                {isCritSuccess && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-1 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-[10px] font-bold text-amber-300 tracking-widest uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  >
                    ★ Awesome Critical Roll ★
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
