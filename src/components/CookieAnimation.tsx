// src/components/CookieAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Howl } from 'howler';
import { CookiePersonality, SpecialBehaviorType, ArtGenerationMode } from '../utils/types';

// Custom loader for DALL-E images
const dalleImageLoader = ({ src }: { src: string }) => {
  return src;
};

interface CookieAnimationProps {
  personality: CookiePersonality;
  artMode?: ArtGenerationMode;
  imageUrl?: string;
  isGeneratingArt?: boolean;
}

export default function CookieAnimation({
  personality,
  artMode = ArtGenerationMode.EMOJI,
  imageUrl,
  isGeneratingArt = false,
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

    // Set initial message for Matryoshka cookie
    if (personality.specialBehavior === SpecialBehaviorType.MATRYOSHKA) {
      setMatryoshkaMessage('A smaller doll appeared! Tap to open it.');
    }

    // Cleanup any timeouts when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [personality.specialBehavior]);

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

      // Set appropriate message based on level
      if (nextLevel === MAX_MATRYOSHKA_LEVEL) {
        // Final level message - stays visible
        setMatryoshkaMessage('Sorry, but your fortune is in another doll');
      } else {
        // Intermediate level message - disappears after a delay
        setMatryoshkaMessage('A smaller doll appeared! Tap to open it.');
        // Set timeout to clear message after 2 seconds
        timeoutRef.current = setTimeout(() => {
          setMatryoshkaMessage('');
        }, 2000);
      }
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

  // Render loading indicator
  const renderLoadingIndicator = () => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="text-sm">Generating art...</p>
      </div>
    );
  };

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
      case SpecialBehaviorType.MATRYOSHKA:
        return (
          <div
            onClick={handleMatryoshkaClick}
            className="cursor-pointer flex flex-col items-center"
            data-testid="matryoshka-container"
          >
            {artMode === ArtGenerationMode.EMOJI || !imageUrl ? (
              <span
                role="img"
                aria-label={`Matryoshka Doll Level ${matryoshkaLevel}`}
                className={`${getMatryoshkaFontSize()} transition-all duration-300`}
              >
                {personality.emoji}
              </span>
            ) : (
              <div className="relative transition-all duration-300">
                <Image
                  loader={dalleImageLoader}
                  src={imageUrl}
                  alt={`Matryoshka Doll Level ${matryoshkaLevel}`}
                  width={getMatryoshkaImageSize()}
                  height={getMatryoshkaImageSize()}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
            )}
            {matryoshkaMessage && <p className="text-sm mt-2 animate-fade-in text-center">{matryoshkaMessage}</p>}
          </div>
        );
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
