// src/components/CookieAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { CookiePersonality, SpecialBehaviorType } from '../utils/types';

interface CookieAnimationProps {
  personality: CookiePersonality;
}

export default function CookieAnimation({ personality }: CookieAnimationProps) {
  const [matryoshkaLevel, setMatryoshkaLevel] = useState(1);
  const [matryoshkaMessage, setMatryoshkaMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum level for matryoshka dolls (smallest size)
  const MAX_MATRYOSHKA_LEVEL = 5;

  // Initial setup when component mounts
  useEffect(() => {
    // Only play sound in non-test environments
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      const sound = new Howl({
        src: ['/sounds/crack.mp3'],
      });
      sound.play();
    }

    // Set initial message for Matryoshka cookie
    if (personality.specialBehavior === SpecialBehaviorType.MATRYOSHKA) {
      setMatryoshkaMessage('A smaller doll appeared! Click to open it.');
    }

    // Cleanup any timeouts when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [personality.specialBehavior]);

  // Handle click for Matryoshka cookie
  const handleMatryoshkaClick = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (matryoshkaLevel < MAX_MATRYOSHKA_LEVEL) {
      const nextLevel = matryoshkaLevel + 1;
      setMatryoshkaLevel(nextLevel);

      // Play sound if not in test environment
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
        const sound = new Howl({
          src: ['/sounds/crack.mp3'],
        });
        sound.play();
      }

      // Set appropriate message based on level
      if (nextLevel === MAX_MATRYOSHKA_LEVEL) {
        // Final level message - stays visible
        setMatryoshkaMessage('Sorry, but your fortune is in another doll');
      } else {
        // Intermediate level message - disappears after a delay
        setMatryoshkaMessage('A smaller doll appeared! Click to open it.');
        // Set timeout to clear message after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setMatryoshkaMessage('');
        }, 2000);
      }
    }
  };

  // Calculate font size for matryoshka doll based on level
  const getMatryoshkaFontSize = () => {
    const baseSizes = ['text-8xl', 'text-7xl', 'text-6xl', 'text-5xl', 'text-4xl'];
    return baseSizes[matryoshkaLevel - 1] || 'text-4xl';
  };

  // Determine what to display based on the personality's special behavior
  const renderAnimation = () => {
    switch (personality.specialBehavior) {
      case SpecialBehaviorType.STANDARD:
        return (
          <>
            <span role="img" aria-label="Cracked Cookie" className="text-8xl">
              {personality.emoji}💥
            </span>
            <p className="text-sm">Cookie Cracked!</p>
          </>
        );
      case SpecialBehaviorType.MATRYOSHKA:
        return (
          <div onClick={handleMatryoshkaClick} className="cursor-pointer flex flex-col items-center">
            <span
              role="img"
              aria-label={`Matryoshka Doll Level ${matryoshkaLevel}`}
              className={`${getMatryoshkaFontSize()} transition-all duration-300`}
            >
              {personality.emoji}
            </span>
            {matryoshkaMessage && <p className="text-sm mt-2 animate-fade-in text-center">{matryoshkaMessage}</p>}
          </div>
        );
      case SpecialBehaviorType.QUANTUM:
        return (
          <>
            <span role="img" aria-label="Quantum Cookie" className="text-8xl animate-quantum-flicker">
              {personality.emoji}💫
            </span>
            <p className="text-sm">The cookie exists in multiple states!</p>
          </>
        );
      case SpecialBehaviorType.APATHETIC:
        return (
          <>
            <span role="img" aria-label="Apathetic Cookie" className="text-8xl">
              {personality.emoji}😴
            </span>
            <p className="text-sm">This cookie couldn&apos;t care less...</p>
          </>
        );
      default:
        return (
          <>
            <span role="img" aria-label="Cracked Cookie" className="text-8xl">
              {personality.emoji}💥
            </span>
            <p className="text-sm">Cookie Cracked!</p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="cookie-animation">
      {renderAnimation()}
    </div>
  );
}
