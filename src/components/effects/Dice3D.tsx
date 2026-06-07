import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Dice3DProps {
  onRollComplete: (result: number) => void;
  isRolling: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ onRollComplete, isRolling }) => {
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const onRollCompleteRef = useRef(onRollComplete);

  useEffect(() => {
    onRollCompleteRef.current = onRollComplete;
  }, [onRollComplete]);

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
      }, 1500);
    }, 2000);

    return () => {
      window.clearTimeout(rollTimer);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, [isRolling]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="perspective-1000 w-32 h-32 relative">
         <motion.div
           className="w-full h-full relative preserve-3d"
           animate={showResult ? { rotateX: 360, rotateY: 360 } : { rotateX: [0, 720, 1440], rotateY: [0, 720, 1440] }}
           transition={showResult ? { duration: 0.5 } : { duration: 2, ease: "linear", repeat: Infinity }}
           style={{ transformStyle: 'preserve-3d' }}
         >
           {/* Simple Cube for D20 representation (D20 is hard in pure CSS, using Cube for abstraction) */}
           {/* Front */}
           <div className="absolute inset-0 bg-indigo-900/90 border-2 border-indigo-400 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] translate-z-16">
             {showResult ? result : '?'}
           </div>
           {/* Back */}
           <div className="absolute inset-0 bg-indigo-900/90 border-2 border-indigo-400 translate-z-negative-16 rotate-y-180" />
           {/* Right */}
           <div className="absolute inset-0 bg-indigo-800/90 border-2 border-indigo-400 rotate-y-90 translate-x-16" />
           {/* Left */}
           <div className="absolute inset-0 bg-indigo-800/90 border-2 border-indigo-400 rotate-y-negative-90 translate-x-negative-16" />
           {/* Top */}
           <div className="absolute inset-0 bg-indigo-700/90 border-2 border-indigo-400 rotate-x-90 translate-y-negative-16" />
           {/* Bottom */}
           <div className="absolute inset-0 bg-indigo-700/90 border-2 border-indigo-400 rotate-x-negative-90 translate-y-16" />
         </motion.div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .translate-z-16 { transform: translateZ(4rem); }
        .translate-z-negative-16 { transform: translateZ(-4rem); }
        .translate-x-16 { transform: translateX(4rem) rotateY(90deg); }
        .translate-x-negative-16 { transform: translateX(-4rem) rotateY(-90deg); }
        .translate-y-negative-16 { transform: translateY(-4rem) rotateX(90deg); }
        .translate-y-16 { transform: translateY(4rem) rotateX(-90deg); }
      `}</style>
    </div>
  );
};
