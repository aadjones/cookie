// src/components/CookieAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Howl } from 'howler';
import { CookiePersonality, SpecialBehaviorType, ArtGenerationMode } from '../utils/types';
import { getPersonalityTheme } from '../utils/personalityThemes';

// Custom loader for DALL-E images
const dalleImageLoader = ({ src }: { src: string }) => {
  return src;
};

interface CookieAnimationProps {
  personality: CookiePersonality;
  message?: string;
  artMode?: ArtGenerationMode;
  imageUrl?: string;
  isGeneratingArt?: boolean;
  onMatryoshkaLevelChange?: (level: number) => void;
}

export default function CookieAnimation({
  personality,
  message,
  artMode = ArtGenerationMode.EMOJI,
  imageUrl,
  isGeneratingArt = false,
  onMatryoshkaLevelChange,
}: CookieAnimationProps) {
  const [matryoshkaLevel, setMatryoshkaLevel] = useState(1);
  const [matryoshkaMessage, setMatryoshkaMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum level for matryoshka dolls (smallest size)
  const MAX_MATRYOSHKA_LEVEL = 5;

  // Initial setup when component mounts
  useEffect(() => {
    // Only play sound in non-test environments
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
      try {
        const sound = new Howl({
          src: ['/sounds/crack.mp3'],
        });
        sound.play();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }

    // Set initial message for Matryoshka cookie - only show at the end
    if (personality.specialBehavior === SpecialBehaviorType.MATRYOSHKA) {
      setMatryoshkaMessage(''); // No message initially
    }

    // Cleanup any timeouts when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [personality.specialBehavior, message]);

  // Handle click for Matryoshka cookie
  const handleMatryoshkaClick = (e: React.MouseEvent) => {
    // Prevent event propagation
    e.stopPropagation();

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (matryoshkaLevel < MAX_MATRYOSHKA_LEVEL) {
      const nextLevel = matryoshkaLevel + 1;
      setMatryoshkaLevel(nextLevel);

      // Notify parent component of level change
      if (onMatryoshkaLevelChange) {
        onMatryoshkaLevelChange(nextLevel);
      }

      // Play sound if not in test environment
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
        try {
          const sound = new Howl({
            src: ['/sounds/crack.mp3'],
          });
          sound.play();
        } catch (error) {
          console.error('Error playing sound:', error);
        }
      }

      // For matryoshka cookies, never show messages in the animation area
      // The FortuneMessage component will handle displaying the final message
      setMatryoshkaMessage('');
    }
  };

  // Calculate font size for matryoshka doll based on level
  const getMatryoshkaFontSize = () => {
    const baseSizes = ['text-8xl', 'text-7xl', 'text-6xl', 'text-5xl', 'text-4xl'];
    return baseSizes[matryoshkaLevel - 1] || 'text-4xl';
  };

  // Get image size for matryoshka doll based on level
  const getMatryoshkaImageSize = () => {
    const baseSizes = [128, 112, 96, 80, 64];
    return baseSizes[matryoshkaLevel - 1] || 64;
  };

  // Get container size for matryoshka doll based on level (for circular background)
  const getMatryoshkaSize = () => {
    const baseSizes = [
      'w-40 h-40 sm:w-48 sm:h-48',
      'w-36 h-36 sm:w-44 sm:h-44',
      'w-32 h-32 sm:w-40 sm:h-40',
      'w-28 h-28 sm:w-36 sm:h-36',
      'w-24 h-24 sm:w-32 sm:h-32',
    ];
    return baseSizes[matryoshkaLevel - 1] || 'w-24 h-24 sm:w-32 sm:h-32';
  };

  // Render loading indicator
  const renderLoadingIndicator = () => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="text-sm">Generating art...</p>
      </div>
    );
  };

  // Get theme for the personality
  const theme = getPersonalityTheme(personality);

  // Determine what to display based on the personality's special behavior
  const renderAnimation = () => {
    // Check if we should show loading indicator
    if (artMode === ArtGenerationMode.DALL_E && (isGeneratingArt || !imageUrl)) {
      return renderLoadingIndicator();
    }

    // Helper function to render either emoji or image
    const renderArt = (emoji: string, additionalEmoji?: string, className?: string) => {
      if (artMode === ArtGenerationMode.EMOJI || !imageUrl) {
        return (
          <span role="img" aria-label="Cookie Art" className={className || 'text-8xl'}>
            {emoji}
            {additionalEmoji || ''}
          </span>
        );
      } else {
        return (
          <div className="relative">
            <Image
              loader={dalleImageLoader}
              src={imageUrl}
              alt="Cookie Art"
              width={128}
              height={128}
              className="rounded-lg"
              unoptimized
            />
            {additionalEmoji && <span className="absolute top-0 right-0 text-4xl">{additionalEmoji}</span>}
          </div>
        );
      }
    };

    switch (personality.specialBehavior) {
      case SpecialBehaviorType.STANDARD:
        return renderArt(personality.emoji, '💥');
      case SpecialBehaviorType.MATRYOSHKA: {
        const isMaxLevel = matryoshkaLevel === MAX_MATRYOSHKA_LEVEL;
        return (
          <div
            onClick={!isMaxLevel ? handleMatryoshkaClick : undefined}
            className={`flex flex-col items-center ${!isMaxLevel ? 'cursor-pointer group' : ''}`}
            data-testid="matryoshka-container"
          >
            {artMode === ArtGenerationMode.EMOJI || !imageUrl ? (
              <div
                className={`
                  relative 
                  flex items-center justify-center
                  transition-all duration-300 ease-out
                  ${
                    !isMaxLevel
                      ? `
                    rounded-full
                    transform hover:scale-110 active:scale-95
                    ${theme.cookieGlow} shadow-2xl
                    border-4 border-dashed ${theme.borderColor}
                    bg-gradient-to-br from-white/40 to-white/10
                    backdrop-blur-sm
                    ${getMatryoshkaSize()}
                  `
                      : ''
                  }
                `}
                aria-label={
                  isMaxLevel ? `Final Matryoshka Doll` : `Matryoshka Doll Level ${matryoshkaLevel} - Click to open`
                }
              >
                <span
                  role="img"
                  className={`${getMatryoshkaFontSize()} filter drop-shadow-lg transition-transform duration-300 ${!isMaxLevel ? 'group-hover:rotate-2' : ''}`}
                >
                  {personality.emoji}
                </span>
              </div>
            ) : (
              <div
                className={`
                  relative transition-all duration-300 rounded-lg
                  ${
                    !isMaxLevel
                      ? `
                    transform hover:scale-110 active:scale-95
                    ${theme.cookieGlow} shadow-2xl
                    border-4 border-dashed ${theme.borderColor}
                  `
                      : ''
                  }
                `}
                aria-label={
                  isMaxLevel ? `Final Matryoshka Doll` : `Matryoshka Doll Level ${matryoshkaLevel} - Click to open`
                }
              >
                <Image
                  loader={dalleImageLoader}
                  src={imageUrl}
                  alt={`Matryoshka Doll Level ${matryoshkaLevel}`}
                  width={getMatryoshkaImageSize()}
                  height={getMatryoshkaImageSize()}
                  className={`rounded-lg filter drop-shadow-lg transition-transform duration-300 ${!isMaxLevel ? 'group-hover:rotate-2' : ''}`}
                  unoptimized
                />
              </div>
            )}
            {matryoshkaMessage && <p className="text-sm mt-2 animate-fade-in text-center">{matryoshkaMessage}</p>}
          </div>
        );
      }
      case SpecialBehaviorType.QUANTUM:
        return renderArt(personality.emoji, '💫', 'text-8xl animate-quantum-flicker');
      case SpecialBehaviorType.APATHETIC:
        return renderArt(personality.emoji, '😴');
      default:
        return renderArt(personality.emoji, '💥');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2" data-testid="cookie-animation">
      {renderAnimation()}
    </div>
  );
}
