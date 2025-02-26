// src/components/CookieAnimation.tsx
import React, { useEffect } from 'react';
import { Howl } from 'howler';
import { CookiePersonality, SpecialBehaviorType } from '../utils/types';

interface CookieAnimationProps {
  personality: CookiePersonality;
}

export default function CookieAnimation({ personality }: CookieAnimationProps) {
  useEffect(() => {
    // Only play sound in non-test environments
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      const sound = new Howl({
        src: ['/sounds/crack.mp3'],
      });
      sound.play();
    }
  }, []);

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
          <>
            <span role="img" aria-label="Matryoshka Cookie" className="text-8xl">
              {personality.emoji}
            </span>
            <span role="img" aria-label="Smaller Cookie" className="text-4xl -mt-8">
              🥠
            </span>
            <p className="text-sm">A smaller cookie appeared!</p>
          </>
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
      default:
        return (
          <>
            <span role="img" aria-label="Cracked Cookie" className="text-8xl">
              🥠💥
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
