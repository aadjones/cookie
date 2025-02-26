// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';
import { CookiePersonality } from '../utils/types';

export default function Home() {
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPersonality, setCurrentPersonality] = useState<CookiePersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch a cookie personality when the page loads
  useEffect(() => {
    fetchCookiePersonality();
  }, []);

  // Function to fetch a cookie personality
  const fetchCookiePersonality = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fortune');
      if (!response.ok) throw new Error('Failed to fetch fortune');

      const data = await response.json();
      setCurrentPersonality(data.personality);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cookie personality:', err);
      setIsLoading(false);
    }
  };

  const handleCookieClick = async () => {
    // Ignore if already cracked
    if (isCookieCracked) return;

    try {
      // Use a message from the current personality instead of fetching a new one
      if (currentPersonality) {
        // If we have messages in the personality, randomly select one
        if (currentPersonality.messages && currentPersonality.messages.length > 0) {
          const randomIndex = Math.floor(Math.random() * currentPersonality.messages.length);
          setMessage(currentPersonality.messages[randomIndex]);
        } else {
          // Fallback in case there are no messages
          setMessage('No fortune available for this cookie.');
        }
      }
    } catch (err) {
      setMessage('Error generating fortune. Please try again.');
    }

    setIsCookieCracked(true);
  };

  const handleNewCookie = () => {
    setIsCookieCracked(false);
    setMessage('');
    // Fetch a new cookie personality
    fetchCookiePersonality();
  };

  const handleShare = () => {
    if (!currentPersonality) return;

    const shareText = `I cracked open a ${currentPersonality.name} and got: "${message}"`;

    // Check if the Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: 'My Digital Fortune Cookie',
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Sharing fortune: "${shareText}"`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Header />
      {/* Main content in the center */}
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {/* Show loading state while fetching cookie personality */}
        {isLoading && (
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-4">Loading your cookie...</span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Show cookie art if not cracked and not loading */}
        {!isCookieCracked && !isLoading && currentPersonality && (
          <CookieArt onClick={handleCookieClick} personality={currentPersonality} />
        )}

        {/* If cracked, show the animation */}
        {isCookieCracked && currentPersonality && <CookieAnimation personality={currentPersonality} />}

        {/* If there's a message and personality, show it below the animation */}
        {message && currentPersonality && isCookieCracked && (
          <div className="mt-4" data-testid="fortune-wrapper">
            <FortuneMessage message={message} personality={currentPersonality} />
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
        {message && currentPersonality && (
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
