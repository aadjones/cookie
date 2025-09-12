// src/components/CookieArt.tsx
import React from 'react';
import Image from 'next/image';
import { CookiePersonality, ArtGenerationMode } from '../utils/types';
import { getPersonalityTheme } from '../utils/personalityThemes';

// Custom loader for DALL-E images
const dalleImageLoader = ({ src }: { src: string }) => {
  return src;
};

interface CookieArtProps {
  onClick: () => void;
  personality?: CookiePersonality;
  artMode?: ArtGenerationMode;
  imageUrl?: string;
  isGeneratingArt?: boolean;
}

export default function CookieArt({
  onClick,
  personality,
  artMode = ArtGenerationMode.EMOJI,
  imageUrl,
  isGeneratingArt = false,
}: CookieArtProps) {
  // Default emoji if no personality is provided
  const emoji = personality?.emoji || '🥠';
  const name = personality?.name || 'Fortune Cookie';

  // Get theme for this personality
  const theme = getPersonalityTheme(personality || null);

  // Loading indicator for AI art generation
  const renderLoadingIndicator = () => (
    <div
      className="w-32 h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center shadow-md"
      data-testid="art-loading"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
      <span className="text-sm text-gray-600">Generating art...</span>
    </div>
  );

  return (
    <div
      className="cursor-pointer flex flex-col items-center group"
      onClick={onClick}
      aria-label={`${name} - Click to crack open`}
      data-testid="cookie-art"
    >
      {/* Display based on art mode and generation state */}
      {artMode === ArtGenerationMode.EMOJI ? (
        // Emoji mode - highly visible interactive container
        <div
          className={`
          relative w-40 h-40 sm:w-48 sm:h-48 rounded-full 
          flex items-center justify-center
          transition-all duration-300 ease-out
          transform hover:scale-110 active:scale-95
          ${theme.cookieGlow} shadow-2xl
          border-4 border-dashed ${theme.borderColor}
          bg-gradient-to-br from-white/40 to-white/10
          backdrop-blur-sm
          animate-pulse hover:animate-none
          before:absolute before:inset-0 before:rounded-full 
          before:bg-gradient-to-br before:from-white/20 before:to-transparent
          before:opacity-50 before:transition-opacity before:duration-300
          hover:before:opacity-100
          touch-manipulation
          ring-2 ring-white/30 hover:ring-white/50
        `}
        >
          <span
            role="img"
            aria-hidden="true"
            className="text-6xl sm:text-8xl filter drop-shadow-lg transition-transform duration-300 group-hover:rotate-2"
            data-testid="emoji-art"
          >
            {emoji}
          </span>
          {/* Add subtle shine effect */}
          <div
            className="
            absolute inset-0 rounded-full 
            bg-gradient-to-tr from-white/30 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300
          "
          ></div>
        </div>
      ) : (
        // DALL-E mode
        <div className="w-32 h-32 relative" data-testid="dalle-art">
          {isGeneratingArt ? (
            // Show loading indicator when generating
            renderLoadingIndicator()
          ) : imageUrl ? (
            // Show the generated image when available
            <Image
              loader={dalleImageLoader}
              src={imageUrl}
              alt={name}
              width={128}
              height={128}
              className="rounded-lg"
              unoptimized
            />
          ) : (
            // Show loading indicator when in DALL-E mode but no image yet
            renderLoadingIndicator()
          )}
        </div>
      )}
      {/* Display the personality name with responsive styling */}
      <p className={`mt-4 sm:mt-6 text-lg sm:text-2xl font-bold text-center ${theme.textColor} tracking-wide px-4`}>
        {name}
      </p>
      {/* Subtle hint for interactivity */}
      <p
        className={`mt-2 text-xs sm:text-sm ${theme.accent} font-medium opacity-75 group-hover:opacity-100 transition-opacity`}
      >
        Tap to crack open
      </p>
    </div>
  );
}
