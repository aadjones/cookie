// src/components/ShareButtons.tsx
import React from 'react';

interface ShareButtonsProps {
  fortune: string;
}

export default function ShareButtons({ fortune }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    // For now, just log the fortune or show an alert.
    // Later, you could implement real share functionality.
    alert(`Sharing fortune on ${platform}: "${fortune}"`);
  };

  return (
    <div className="flex space-x-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleShare('Twitter')}>
        Share
      </button>
    </div>
  );
}
