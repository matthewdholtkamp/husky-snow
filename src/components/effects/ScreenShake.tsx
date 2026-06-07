import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ScreenShakeProps {
  children: React.ReactNode;
  trigger: boolean;
  intensity?: 'soft' | 'hard';
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ children, trigger, intensity = 'soft' }) => {
  const [isShaking, setIsShaking] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }

    if (trigger) {
      setIsShaking(true);
      timerRef.current = window.setTimeout(() => {
        setIsShaking(false);
        timerRef.current = undefined;
      }, 500);
    } else {
      setIsShaking(false);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [trigger]);

  const shakeVariants = {
    idle: { x: 0, y: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      y: [0, 5, -5, 5, -5, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={shakeVariants}
      animate={isShaking ? 'shake' : 'idle'}
      className="w-full h-full"
    >
      {/* Red Overlay for Damage Flash */}
      {isShaking && (
        <div className="fixed inset-0 bg-red-500/10 pointer-events-none z-50 animate-pulse" />
      )}
      {children}
    </motion.div>
  );
};
