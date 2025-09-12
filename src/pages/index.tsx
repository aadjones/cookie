// src/pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';
// import GenerationModeToggle from '../components/GenerationModeToggle';
// import ArtModeToggle from '../components/ArtModeToggle';
import { CookiePersonality, ArtGenerationMode } from '../utils/types';
import { getRandomMessage } from '../utils/cookieData';
import { getPersonalityTheme } from '../utils/personalityThemes';

export default function Home() {
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPersonality, setCurrentPersonality] = useState<CookiePersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Always use pre-written messages - no AI generation toggle
  const [isGeneratingMessage] = useState(false);
  // Always use emoji art mode for current cookie
  const currentCookieArtMode = ArtGenerationMode.EMOJI;

  // Function to fetch a cookie personality
  const fetchCookiePersonality = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/fortune');
      if (!response.ok) throw new Error('Failed to fetch fortune');

      const data = await response.json();
      console.log('Cookie personality fetched:', data.personality.name);
      console.log('Full personality data:', data.personality);
      console.log('Personality ID:', data.personality.id);
      setCurrentPersonality(data.personality);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cookie personality:', err);
      setIsLoading(false);
    }
  }, []); // No dependencies needed since we're always using emoji mode

  // Fetch a cookie personality when the page loads
  useEffect(() => {
    fetchCookiePersonality();
  }, [fetchCookiePersonality]);

  // AI functionality removed - using pre-written fortunes only

  const handleCookieClick = async () => {
    // Ignore if already cracked
    if (isCookieCracked) return;

    try {
      // Use a message from the current personality
      if (currentPersonality) {
        // Always use pre-written messages
        setMessage(getRandomMessage(currentPersonality));
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

  const handleShare = async () => {
    if (!currentPersonality) return;

    const shareText = `I cracked open a ${currentPersonality.name} and got: "${message}"`;

    // Check if the Web Share API is available
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: 'My Digital Fortune Cookie',
          text: shareText,
          url: window.location.href,
        };

        // No image sharing since we're using emoji only

        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      let shareMessage = `Sharing fortune: "${shareText}"`;
      if (currentPersonality.emoji) {
        shareMessage += `\nCookie emoji: ${currentPersonality.emoji}`;
      }
      alert(shareMessage);
    }
  };

  // Get theme based on current personality
  const theme = getPersonalityTheme(currentPersonality);
  console.log('Current personality for theming:', currentPersonality);
  console.log('Calculated theme:', theme);
  console.log('Theme background class:', theme.background);

  return (
    <div className={`relative min-h-screen ${theme.background} flex flex-col transition-colors duration-500`}>
      <Header personality={currentPersonality} />

      {/* Removed toggles - using pre-written fortunes and emoji art only */}

      {/* Main content optimized for mobile thumb zones */}
      <main className="flex-grow px-4 pt-8 pb-32 sm:pb-24 flex flex-col items-center justify-start min-h-0">
        {/* Show loading state while fetching cookie personality */}
        {isLoading && (
          <div className="flex flex-col items-center mt-16 mb-8">
            <span className={`text-xl sm:text-2xl mb-4 font-semibold ${theme.textColor} text-center px-4`}>
              {theme.loadingMessage}
            </span>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
          </div>
        )}

        {/* Show cookie art positioned for thumb-friendly interaction */}
        {!isCookieCracked && !isLoading && currentPersonality && (
          <div className="mt-16 mb-8 flex flex-col items-center">
            <CookieArt
              onClick={handleCookieClick}
              personality={currentPersonality}
              artMode={currentCookieArtMode}
              imageUrl={undefined}
              isGeneratingArt={false}
            />
          </div>
        )}

        {/* If cracked, show the animation in the same thumb-friendly position */}
        {isCookieCracked && currentPersonality && (
          <div className="mt-16 mb-8 flex flex-col items-center">
            <CookieAnimation
              personality={currentPersonality}
              artMode={currentCookieArtMode}
              imageUrl={undefined}
              isGeneratingArt={false}
            />
          </div>
        )}

        {/* If there's a message and personality, show it below the animation */}
        {isCookieCracked && currentPersonality && (
          <div className="mt-4" data-testid="fortune-wrapper">
            {isGeneratingMessage ? (
              <div className="flex flex-col items-center p-4 bg-white shadow rounded text-center max-w-sm">
                <span className="text-lg mb-2">Generating your fortune...</span>
                <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ) : message ? (
              <FortuneMessage message={message} personality={currentPersonality} />
            ) : null}
          </div>
        )}
      </main>

      {/* Mobile-optimized bottom bar with safe area padding */}
      <div
        className={`w-full ${theme.headerBg} shadow-lg py-3 px-4 sm:px-6 fixed bottom-0 left-0 flex items-center justify-between transition-colors duration-500 pb-safe`}
      >
        {/* Left: Get New Cookie - mobile-optimized button */}
        <button
          className="px-4 py-3 sm:px-6 sm:py-2 bg-white/90 text-gray-800 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors min-h-[44px] min-w-[120px] text-sm sm:text-base"
          onClick={handleNewCookie}
          disabled={isLoading || isGeneratingMessage}
          data-testid="new-cookie-button"
        >
          Get New Cookie
        </button>

        {/* Right: Share only if there's a fortune - mobile-optimized */}
        {message && currentPersonality && !isGeneratingMessage && (
          <button
            className="px-4 py-3 sm:px-6 sm:py-2 bg-white/90 text-gray-800 rounded-lg font-semibold flex items-center space-x-2 hover:bg-white transition-colors min-h-[44px] min-w-[100px] text-sm sm:text-base"
            onClick={handleShare}
          >
            <span role="img" aria-label="Share icon">
              📤
            </span>
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
}
