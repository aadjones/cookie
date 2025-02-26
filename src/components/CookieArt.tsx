// src/components/CookieArt.tsx
import React from 'react';
import { CookiePersonality } from '../utils/types';

interface CookieArtProps {
  onClick: () => void;
  personality?: CookiePersonality;
}

export default function CookieArt({ onClick, personality }: CookieArtProps) {
  // Default emoji if no personality is provided
  const emoji = personality?.emoji || '🥠';
  const name = personality?.name || 'Fortune Cookie';

  return (
    <div
      className="cursor-pointer flex flex-col items-center"
      onClick={onClick}
      aria-label={`${name} - Click to crack open`}
    >
      {/* Display the personality-specific emoji */}
      <span role="img" aria-hidden="true" style={{ fontSize: '8rem' }}>
        {emoji}
      </span>
      {/* Display the personality name */}
      <p className="mt-4 text-xl font-medium text-center">{name}</p>
    </div>
  );
}
