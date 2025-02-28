// src/pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';
import GenerationModeToggle from '../components/GenerationModeToggle';
import ArtModeToggle from '../components/ArtModeToggle';
import { CookiePersonality, MessageGenerationMode, ArtGenerationMode } from '../utils/types';
import { getRandomMessage } from '../utils/cookieData';

export default function Home() {
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPersonality, setCurrentPersonality] = useState<CookiePersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generationMode, setGenerationMode] = useState<MessageGenerationMode>(MessageGenerationMode.PRE_WRITTEN);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  // This is the setting for FUTURE cookies only
  const [artMode, setArtMode] = useState<ArtGenerationMode>(ArtGenerationMode.EMOJI);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artUrl, setArtUrl] = useState<string | undefined>(undefined);
  // This tracks which art mode was used for the CURRENT cookie only
  const [currentCookieArtMode, setCurrentCookieArtMode] = useState<ArtGenerationMode>(ArtGenerationMode.EMOJI);

  // Function to fetch a cookie personality
  const fetchCookiePersonality = useCallback(async () => {
    console.log('fetchCookiePersonality called:', {
      artMode,
      isLoading,
      isCookieCracked,
    });

    setIsLoading(true);
    setArtUrl(undefined); // Clear any existing art URL

    // Apply the current artMode setting to this new cookie
    // This is where the toggle setting actually takes effect - on new cookies only
    const newCookieArtMode = artMode;
    setCurrentCookieArtMode(newCookieArtMode);

    try {
      const response = await fetch('/api/fortune');
      if (!response.ok) throw new Error('Failed to fetch fortune');

      const data = await response.json();
      console.log('Cookie personality fetched:', data.personality.name);
      setCurrentPersonality(data.personality);

      // Generate art for the new cookie if the art mode is DALL-E
      if (newCookieArtMode === ArtGenerationMode.DALL_E) {
        await generateArt(data.personality);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cookie personality:', err);
      setIsLoading(false);
    }
  }, [artMode]); // artMode is needed here to ensure we use the latest value

  // Fetch a cookie personality when the page loads
  useEffect(() => {
    fetchCookiePersonality();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Log when artMode changes
  useEffect(() => {
    console.log('artMode changed in useEffect:', {
      artMode,
      currentCookieArtMode,
      currentPersonality: currentPersonality?.name,
      artUrl,
      isCookieCracked,
    });
  }, [artMode, currentCookieArtMode, currentPersonality, artUrl, isCookieCracked]);

  // Function to generate art using the DALL-E API
  const generateArt = async (personality: CookiePersonality) => {
    console.log('generateArt called:', {
      personality: personality.name,
      artMode,
      currentCookieArtMode,
      isCookieCracked,
    });

    // We need to check the passed-in newCookieArtMode from fetchCookiePersonality
    // instead of relying on the currentCookieArtMode state which might not be updated yet

    setIsGeneratingArt(true);
    try {
      const response = await fetch('/api/generate-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalityId: personality.id,
          personalityName: personality.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate art');

      const data = await response.json();
      console.log('Art generated successfully:', data.imageUrl);
      setArtUrl(data.imageUrl);
    } catch (err) {
      console.error('Error generating art:', err);
      // Fall back to emoji art for the current cookie only
      setCurrentCookieArtMode(ArtGenerationMode.EMOJI);
      // Don't change the artMode setting for future cookies
    } finally {
      setIsGeneratingArt(false);
    }
  };

  // Function to generate a message using the AI API
  const generateAIMessage = async (personality: CookiePersonality) => {
    setIsGeneratingMessage(true);
    try {
      const response = await fetch('/api/generate-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personality }),
      });

      if (!response.ok) throw new Error('Failed to generate AI fortune');

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error('Error generating AI fortune:', err);
      setMessage('Error generating AI fortune. Please try again.');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleCookieClick = async () => {
    // Ignore if already cracked
    if (isCookieCracked) return;

    try {
      // Use a message from the current personality
      if (currentPersonality) {
        if (generationMode === MessageGenerationMode.AI_GENERATED) {
          // Generate message using AI
          await generateAIMessage(currentPersonality);
        } else {
          // Use pre-written message
          setMessage(getRandomMessage(currentPersonality));
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

        // If we have an image URL and it's from DALL-E, try to include it
        if (artUrl && currentCookieArtMode === ArtGenerationMode.DALL_E) {
          try {
            // Fetch the image and convert it to a blob for sharing
            const response = await fetch(artUrl);
            const blob = await response.blob();
            const file = new File([blob], 'fortune-cookie.png', { type: 'image/png' });

            // Add the file to the share data
            shareData.files = [file];
          } catch (imageError) {
            console.error('Error preparing image for sharing:', imageError);
            // Continue without the image if there's an error
          }
        }

        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      let shareMessage = `Sharing fortune: "${shareText}"`;
      if (artUrl && currentCookieArtMode === ArtGenerationMode.DALL_E) {
        shareMessage += `\nCookie image: ${artUrl}`;
      } else if (currentPersonality.emoji) {
        shareMessage += `\nCookie emoji: ${currentPersonality.emoji}`;
      }
      alert(shareMessage);
    }
  };

  const handleGenerationModeChange = (newMode: MessageGenerationMode) => {
    // Just update the mode without regenerating the message
    setGenerationMode(newMode);
    // No longer regenerate message for current cookie
  };

  const handleArtModeChange = (newMode: ArtGenerationMode) => {
    // ONLY update the artMode setting for FUTURE cookies
    // This has NO EFFECT on the current cookie and does NOT trigger any API calls
    console.log('Art mode changed:', {
      from: artMode,
      to: newMode,
    });

    setArtMode(newMode);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Toggles in a sleek container */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <GenerationModeToggle
                mode={generationMode}
                onChange={handleGenerationModeChange}
                disabled={isLoading || isGeneratingMessage}
                showLabel={true}
              />
            </div>
            <div className="w-full h-px bg-gray-200"></div>
            <div className="flex flex-col">
              <ArtModeToggle
                mode={artMode}
                onChange={handleArtModeChange}
                disabled={isLoading || isGeneratingArt}
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

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
          <CookieArt
            onClick={handleCookieClick}
            personality={currentPersonality}
            artMode={currentCookieArtMode}
            imageUrl={currentCookieArtMode === ArtGenerationMode.DALL_E ? artUrl : undefined}
            isGeneratingArt={isGeneratingArt}
          />
        )}

        {/* If cracked, show the animation */}
        {isCookieCracked && currentPersonality && (
          <CookieAnimation
            personality={currentPersonality}
            artMode={currentCookieArtMode}
            imageUrl={currentCookieArtMode === ArtGenerationMode.DALL_E ? artUrl : undefined}
            isGeneratingArt={isGeneratingArt}
          />
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

      {/* Fixed bottom bar for "Get New Cookie" (left) and optional "Share" (right) */}
      <div className="w-full bg-white shadow-md py-4 px-6 fixed bottom-0 left-0 flex items-center justify-between">
        {/* Left: Get New Cookie */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNewCookie}
          disabled={isLoading || isGeneratingMessage || isGeneratingArt}
          data-testid="new-cookie-button"
        >
          {isGeneratingArt ? 'Generating Art...' : 'Get New Cookie'}
        </button>

        {/* Right: Share only if there's a fortune */}
        {message && currentPersonality && !isGeneratingMessage && (
          <button
            className={`px-4 py-2 ${currentCookieArtMode === ArtGenerationMode.DALL_E && artUrl ? 'bg-purple-500' : 'bg-green-500'} text-white rounded flex items-center space-x-2 hover:opacity-90 transition-opacity`}
            onClick={handleShare}
          >
            <span role="img" aria-label="Share icon">
              {currentCookieArtMode === ArtGenerationMode.DALL_E && artUrl ? '🖼️' : '🔗'}
            </span>
            <span>{currentCookieArtMode === ArtGenerationMode.DALL_E && artUrl ? 'Share with Image' : 'Share'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
