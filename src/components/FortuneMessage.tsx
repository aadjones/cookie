// src/components/FortuneMessage.tsx
import React, { useEffect, useState } from 'react';
import { CookiePersonality, SpecialBehaviorType } from '../utils/types';

interface FortuneMessageProps {
  message: string;
  personality: CookiePersonality;
}

export default function FortuneMessage({ message, personality }: FortuneMessageProps) {
  const [displayMessage, setDisplayMessage] = useState(message);
  const [isFlickering, setIsFlickering] = useState(false);

  // Handle special behaviors for message display
  useEffect(() => {
    if (personality.specialBehavior === SpecialBehaviorType.QUANTUM && personality.messages.length >= 2) {
      // For quantum cookies, alternate between two messages
      setIsFlickering(true);
      const interval = setInterval(() => {
        setDisplayMessage((prev) =>
          prev === personality.messages[0] ? personality.messages[1] : personality.messages[0]
        );
      }, 800);

      return () => clearInterval(interval);
    } else if (personality.specialBehavior === SpecialBehaviorType.GASLIGHTING) {
      // For gaslighting cookies, show the message briefly then hide it
      const timeout = setTimeout(() => {
        setDisplayMessage('');
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      setDisplayMessage(message);
      setIsFlickering(false);
    }
  }, [message, personality]);

  // For apathetic cookies, don't show any message
  if (personality.specialBehavior === SpecialBehaviorType.APATHETIC) {
    return null;
  }

  // For matryoshka cookies, show a different style message
  if (personality.specialBehavior === SpecialBehaviorType.MATRYOSHKA) {
    return (
      <div
        className="p-4 bg-white shadow rounded text-center max-w-sm border-2 border-dashed border-amber-500"
        data-testid="fortune-message"
      >
        <p className="text-lg font-medium">Crack open the smaller cookie to reveal your fortune!</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white shadow rounded text-center max-w-sm ${isFlickering ? 'animate-pulse' : ''}`}
      data-testid="fortune-message"
    >
      <p className="text-lg font-medium">{displayMessage}</p>
    </div>
  );
}
