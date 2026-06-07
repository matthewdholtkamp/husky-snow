import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type VFXType = 'blue_orbs' | 'wind_streaks' | 'ice_shards' | 'gold_motes' | 'crit_gold' | 'orange_embers' | 'red_bolts';

interface MagicBurstProps {
  trigger: number;
  type: VFXType;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  duration: number;
  color: string;
  shape: 'circle' | 'streak' | 'shard' | 'sparkle' | 'bolt';
}

export const MagicBurst: React.FC<MagicBurstProps> = ({ trigger, type, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    // Generate particles
    const newParticles: Particle[] = [];
    const count = type === 'crit_gold' ? 35 : 20;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Explode outwards at random distances
      const distance = 40 + Math.random() * 120;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      let color = '#ffffff';
      let shape: Particle['shape'] = 'circle';
      let duration = 0.8 + Math.random() * 0.7;

      switch (type) {
        case 'blue_orbs':
          color = `hsl(${190 + Math.random() * 40}, 90%, 65%)`; // icy blue
          shape = 'circle';
          break;
        case 'wind_streaks':
          color = '#f1f5f9'; // white/slate-100
          shape = 'streak';
          duration = 0.5 + Math.random() * 0.4;
          break;
        case 'ice_shards':
          color = `hsl(${180 + Math.random() * 20}, 40%, 80%)`; // silver/ice
          shape = 'shard';
          break;
        case 'orange_embers':
          color = `hsl(${15 + Math.random() * 25}, 95%, 55%)`; // fire orange
          shape = Math.random() > 0.5 ? 'sparkle' : 'circle';
          break;
        case 'red_bolts':
          color = `hsl(${340 + Math.random() * 20}, 95%, 55%)`; // red lightning
          shape = 'bolt';
          break;
        case 'gold_motes':
        case 'crit_gold':
          color = `hsl(${45 + Math.random() * 15}, 95%, 60%)`; // gold
          shape = 'sparkle';
          break;
      }

      newParticles.push({
        id: i,
        x,
        y,
        scale: 0.2 + Math.random() * 1.0,
        rotate: Math.random() * 360,
        opacity: 0.9,
        duration,
        color,
        shape
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, type, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none z-45 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.9, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0.5, p.scale, 0],
              opacity: [0.9, p.opacity, 0],
              rotate: p.rotate + (p.shape === 'shard' || p.shape === 'bolt' ? 180 : 0)
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: "easeOut" }}
            style={{
              position: 'absolute',
              backgroundColor: p.shape === 'streak' ? 'transparent' : p.color,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'sparkle' ? '25%' : '0%',
              boxShadow: p.shape === 'streak' ? 'none' : `0 0 10px ${p.color}`,
              width: p.shape === 'streak' ? '30px' : p.shape === 'shard' || p.shape === 'bolt' ? '12px' : '8px',
              height: p.shape === 'streak' ? '3px' : p.shape === 'shard' || p.shape === 'bolt' ? '12px' : '8px',
              ...(p.shape === 'streak' && {
                borderBottom: `2px solid ${p.color}`,
                transform: `rotate(${Math.atan2(p.y, p.x)}rad)`
              }),
              ...(p.shape === 'shard' && {
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // pentagon shard
              }),
              ...(p.shape === 'bolt' && {
                clipPath: 'polygon(40% 0%, 100% 0%, 50% 45%, 80% 45%, 10% 100%, 40% 55%, 20% 55%)', // lightning bolt
              })
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
