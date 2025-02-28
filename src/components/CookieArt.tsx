// src/components/CookieArt.tsx
import React from 'react';
import Image from 'next/image';
import { CookiePersonality, ArtGenerationMode } from '../utils/types';

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
      className="cursor-pointer flex flex-col items-center"
      onClick={onClick}
      aria-label={`${name} - Click to crack open`}
      data-testid="cookie-art"
    >
      {/* Display based on art mode and generation state */}
      {artMode === ArtGenerationMode.EMOJI ? (
        // Emoji mode - always show emoji
        <span role="img" aria-hidden="true" style={{ fontSize: '8rem' }} data-testid="emoji-art">
          {emoji}
        </span>
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
      {/* Display the personality name */}
      <p className="mt-4 text-xl font-medium text-center">{name}</p>
    </div>
  );
}
