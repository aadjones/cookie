// src/pages/index.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';
import ShareButtons from '../components/ShareButtons';

export default function Home() {
  // Whether the cookie has been cracked
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  // The fortune that appears after cracking the cookie
  const [fortune, setFortune] = useState('');

  // Handle user clicking on the cookie
  const handleCookieClick = async () => {
    try {
      // Fetch a random fortune from our API
      const response = await fetch('/api/fortune');
      if (!response.ok) {
        throw new Error('Failed to fetch fortune');
      }
      const data = await response.json();
      setFortune(data.fortune);
    } catch (err) {
      // If there's an error, show a fallback fortune
      setFortune('Error generating fortune. Please try again.');
    }

    // Once the fortune is retrieved, mark the cookie as cracked
    setIsCookieCracked(true);
  };

  // Reset everything so we start from scratch
  const handleNewCookie = () => {
    setIsCookieCracked(false);
    setFortune('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-6">
        {/* Cookie Art is always shown */}
        <CookieArt onClick={handleCookieClick} />

        {/* If the cookie is cracked, show animation + fortune + share */}
        {isCookieCracked && (
          <div className="flex flex-col items-center space-y-4">
            <CookieAnimation />
            {fortune && <FortuneMessage message={fortune} />}
            {fortune && <ShareButtons fortune={fortune} />}
          </div>
        )}

        {/* "Get New Cookie" button below */}
        <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleNewCookie}>
          Get New Cookie
        </button>
      </main>
    </div>
  );
}
