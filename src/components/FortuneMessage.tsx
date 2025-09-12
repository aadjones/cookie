// src/components/FortuneMessage.tsx
import React, { useEffect, useState } from 'react';
import { CookiePersonality, SpecialBehaviorType } from '../utils/types';

interface FortuneMessageProps {
  message: string;
  personality: CookiePersonality;
}

export default function FortuneMessage({ message, personality }: FortuneMessageProps) {
  const [displayMessage, setDisplayMessage] = useState(message);

  // Handle special behaviors for message display
  useEffect(() => {
    if (personality.specialBehavior === SpecialBehaviorType.QUANTUM) {
      // For quantum cookies, we need to alternate between the two messages

      // Split the paired message (e.g., "A / B") into individual messages
      const messageParts = message.split(' / ');
      if (messageParts.length === 2) {
        // Set up an interval to alternate between the two messages
        let showFirst = true;
        setDisplayMessage(messageParts[0]);

        const interval = setInterval(() => {
          showFirst = !showFirst;
          setDisplayMessage(showFirst ? messageParts[0] : messageParts[1]);
        }, 800);

        return () => clearInterval(interval);
      } else {
        // Fallback if the message doesn't have the expected format
        setDisplayMessage(message);
      }
    } else {
      setDisplayMessage(message);
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
      className="px-4 py-3 sm:px-6 sm:py-2 bg-white/90 text-gray-800 rounded-lg font-semibold"
      data-testid="fortune-message"
    >
      <p>{displayMessage}</p>
    </div>
  );
}
