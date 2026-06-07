import React, { useState, useEffect, useRef } from 'react';
import audioService from '../../../services/audioService';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 15,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const onCompleteRef = useRef(onComplete);

  // Sync complete ref
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Check for prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem('husky-snow-reduced-motion');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const updatePref = () => {
      const stored = localStorage.getItem('husky-snow-reduced-motion');
      if (stored !== null) {
        setReducedMotion(stored === 'true');
      } else {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      }
    };

    window.addEventListener('husky-snow-settings-changed', updatePref);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updatePref);

    return () => {
      window.removeEventListener('husky-snow-settings-changed', updatePref);
      mediaQuery.removeEventListener('change', updatePref);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(text);
      setIsFinished(true);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    setDisplayedText('');
    setIsFinished(false);
    indexRef.current = 0;

    const tick = () => {
      if (indexRef.current < text.length) {
        const char = text[indexRef.current];
        setDisplayedText((prev) => prev + char);
        
        // Play very quiet click every 3rd character for flavor (not too frequent)
        if (indexRef.current % 4 === 0 && !audioService.isMuted()) {
          audioService.playClick();
        }
        
        indexRef.current++;
        timerRef.current = window.setTimeout(tick, speed);
      } else {
        setIsFinished(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    };

    tick();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, speed, reducedMotion]);

  const handleSkip = () => {
    if (isFinished) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setDisplayedText(text);
    setIsFinished(true);
    if (onCompleteRef.current) onCompleteRef.current();
  };

  return (
    <div 
      onClick={handleSkip} 
      className={`cursor-pointer select-text relative ${!isFinished ? 'after:content-["▊"] after:ml-0.5 after:text-indigo-400 after:animate-pulse' : ''}`}
      title={!isFinished ? "Click to skip typing effect" : undefined}
    >
      {displayedText}
    </div>
  );
};
