// src/components/CookieArt.tsx
import React from 'react';

interface CookieArtProps {
  onClick: () => void;
}

export default function CookieArt({ onClick }: CookieArtProps) {
  return (
    <div className="w-12 h-12 cursor-pointer" onClick={onClick} aria-label="Cookie Art">
      {/* Placeholder cookie icon (Emoji or image) */}
      <span role="img" aria-hidden="true" style={{ fontSize: '8rem' }}>
        🥠
      </span>
    </div>
  );
}
