// src/pages/index.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';

export default function Home() {
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  const [fortune, setFortune] = useState('');

  const handleCookieClick = async () => {
    // Ignore if already cracked
    if (isCookieCracked) return;

    try {
      const response = await fetch('/api/fortune');
      if (!response.ok) throw new Error('Failed to fetch fortune');
      const data = await response.json();
      setFortune(data.fortune);
    } catch (err) {
      setFortune('Error generating fortune. Please try again.');
    }

    setIsCookieCracked(true);
  };

  const handleNewCookie = () => {
    setIsCookieCracked(false);
    setFortune('');
  };

  const handleShare = () => {
    alert(`Sharing fortune: "${fortune}"`);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Header />
      {/* Main content in the center */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {/* Show cookie art if not cracked */}
        {!isCookieCracked && <CookieArt onClick={handleCookieClick} />}

        {/* If cracked, show the animation */}
        {isCookieCracked && <CookieAnimation />}

        {/* If there's a fortune, show it below the animation */}
        {fortune && (
          <div className="mt-4" data-testid="fortune-wrapper">
            <FortuneMessage message={fortune} />
          </div>
        )}
      </main>

      {/* Fixed bottom bar for "Get New Cookie" (left) and optional "Share" (right) */}
      <div className="w-full bg-white shadow-md py-4 px-6 fixed bottom-0 left-0 flex items-center justify-between">
        {/* Left: Get New Cookie */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleNewCookie}>
          Get New Cookie
        </button>

        {/* Right: Share only if there's a fortune */}
        {fortune && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2"
            onClick={handleShare}
          >
            <span role="img" aria-label="Share icon">
              🔗
            </span>
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
}
