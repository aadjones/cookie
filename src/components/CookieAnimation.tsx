// src/components/CookieAnimation.tsx
import React from 'react';

export default function CookieAnimation() {
  return (
    <div className="flex flex-col items-center space-y-2" data-testid="cookie-animation">
      {/* Placeholder for an animation - e.g., text or a static icon */}
      <span role="img" aria-label="Cracked Cookie" style={{ fontSize: '8rem' }}>
        🥠💥
      </span>
      <p className="text-sm">Cookie Cracked!</p>
    </div>
  );
}
