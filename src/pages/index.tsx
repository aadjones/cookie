// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CookieArt from '../components/CookieArt';
import CookieAnimation from '../components/CookieAnimation';
import FortuneMessage from '../components/FortuneMessage';
import GenerationModeToggle from '../components/GenerationModeToggle';
import { CookiePersonality, MessageGenerationMode } from '../utils/types';
import { getRandomMessage } from '../utils/cookieData';

export default function Home() {
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPersonality, setCurrentPersonality] = useState<CookiePersonality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generationMode, setGenerationMode] = useState<MessageGenerationMode>(MessageGenerationMode.PRE_WRITTEN);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  // Load user preferences from localStorage on initial render
  useEffect(() => {
    const savedMode = localStorage.getItem('fortuneGenerationMode');
    if (savedMode && Object.values(MessageGenerationMode).includes(savedMode as MessageGenerationMode)) {
      setGenerationMode(savedMode as MessageGenerationMode);
    }
  }, []);

  // Save user preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fortuneGenerationMode', generationMode);
  }, [generationMode]);

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

  const handleGenerationModeChange = (newMode: MessageGenerationMode) => {
    setGenerationMode(newMode);

    // If the cookie is already cracked, regenerate the message with the new mode
    if (isCookieCracked && currentPersonality) {
      if (newMode === MessageGenerationMode.AI_GENERATED) {
        generateAIMessage(currentPersonality);
      } else {
        setMessage(getRandomMessage(currentPersonality));
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Generation mode toggle in the top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <GenerationModeToggle
          mode={generationMode}
          onChange={handleGenerationModeChange}
          disabled={isLoading || isGeneratingMessage}
        />
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
          <CookieArt onClick={handleCookieClick} personality={currentPersonality} />
        )}

        {/* If cracked, show the animation */}
        {isCookieCracked && currentPersonality && <CookieAnimation personality={currentPersonality} />}

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
          disabled={isLoading || isGeneratingMessage}
        >
          Get New Cookie
        </button>

        {/* Right: Share only if there's a fortune */}
        {message && currentPersonality && !isGeneratingMessage && (
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
