# Digital Fortune Cookie - DALL-E Art Generation Implementation Plan

## Overview

We're adding a new feature to generate custom art for each cookie personality using DALL-E. Users will be able to toggle between the classic emoji art and AI-generated art.

## Requirements

1. ✅ Add a new toggle component for switching between emoji art and DALL-E generated art
2. ✅ Redesign the existing toggle to have a "Messages" label above it
3. ✅ Add a new toggle with an "Art" label above it
4. ✅ Implement API calls to DALL-E to generate custom art for each cookie personality

## Clarified Requirements

1. ✅ Generate new DALL-E art every time a cookie is opened (no caching)
2. ✅ Use the same OpenAI API key for both message generation and DALL-E image generation
3. ✅ Start with generic prompts but structure the code to allow for personality-specific prompts later
4. ✅ Use 256x256 image size for faster generation
5. ✅ Fall back to emoji art if the DALL-E API call fails
6. ✅ Use negative prompts to prevent text and unwanted elements in images
7. ✅ Handle DALL-E API rate limits (5 images per minute)

## Completed Tasks

### 1. Update Data Models

- [x] Create a new enum for art generation modes (Emoji vs DALL-E)
- [x] Update FortuneResponse interface to include art generation mode
- [x] Create interfaces for DALL-E API requests and responses

### 2. Create UI Components

- [x] Modify the GenerationModeToggle component to include a label
- [x] Create a new ArtModeToggle component similar to GenerationModeToggle
- [x] Update the main page to include both toggles

### 3. Implement DALL-E API Integration

- [x] Create a new API endpoint `/api/generate-art` for DALL-E image generation
- [x] Define a base prompt template that can be customized per personality
- [x] Implement error handling with fallback to emoji art
- [x] Add loading states during image generation
- [x] Add personality-specific prompts for each cookie type
- [x] Add negative prompts to prevent text and unwanted elements in images
- [x] Implement rate limiting handling for DALL-E API (5 images per minute)

### 4. Update Cookie Display Components

- [x] Modify CookieArt component to display either emoji or DALL-E image
- [x] Update CookieAnimation to work with both art types
- [x] Ensure proper loading states during image generation

### 5. User Experience Enhancements

- [x] Add loading indicators during image generation
- [x] Save user preferences for art mode in localStorage
- [x] Add error messages for failed image generation
- [x] Add user-friendly messages for rate limit errors

### 6. Next.js Configuration for External Images

- [x] Configure Next.js to handle external image domains from OpenAI
- [x] Add custom image loader for DALL-E images
- [x] Use the `unoptimized` prop for Next.js Image components to handle dynamic DALL-E URLs

### 7. Testing

- [x] Write tests for the new ArtModeToggle component
- [x] Test DALL-E API integration
- [x] Test fallback mechanisms
- [x] Ensure all existing tests still pass
- [x] Update tests to be more qualitative and less brittle

## Implementation Details

### DALL-E Prompt Strategy

We've implemented personality-specific prompts for each cookie type:

```typescript
// Personality-specific prompts
const personalityPrompts: Record<string, string> = {
  // Standard personalities
  'toxic-positivity':
    'A cartoon-style fortune cookie with an overly cheerful, rainbow-colored appearance. Exaggerated happy face, surrounded by sparkles and hearts. Simple, clean background.',
  error:
    'A cartoon-style fortune cookie with glitchy, broken appearance. Error symbols, static effects, and digital artifacts. Red warning colors on a simple, clean background.',
  conspiracy:
    'A cartoon-style fortune cookie wearing a detective hat and holding a magnifying glass. Suspicious eyes, surrounded by question marks and conspiracy symbols. Simple, clean background.',
  actuarial:
    'A cartoon-style fortune cookie with graphs, charts and statistics floating around it. Mathematical symbols, calculator, and probability diagrams. Professional appearance on a simple, clean background.',
  misfortune:
    'A cartoon-style fortune cookie with a sad, gloomy appearance. Rainy cloud above, tears, broken pieces, and dark colors. Melancholic expression on a simple, clean background.',
  gaslighting:
    'A cartoon-style fortune cookie with a deceptive, two-faced appearance. One side smiling, one side sinister. Swirling, confusing patterns around it. Disorienting design on a simple, clean background.',
  insightful:
    'A cartoon-style fortune cookie with a wise, philosophical appearance. Wearing glasses, surrounded by light bulbs and thought bubbles. Contemplative expression on a simple, clean background.',

  // Special behavior personalities
  matryoshka:
    'A cartoon-style fortune cookie designed like a Russian nesting doll. Decorative patterns, bright colors, nested layers visible. Traditional matryoshka doll aesthetic on a simple, clean background.',
  quantum:
    'A cartoon-style fortune cookie with a cosmic, quantum appearance. Multiple overlapping outlines, glowing with energy, existing in multiple states simultaneously. Sci-fi aesthetic on a simple, clean background.',
  apathetic:
    'A cartoon-style fortune cookie with a bored, disinterested expression. Slouching posture, half-lidded eyes, muted colors. Yawning or looking at a smartphone. Lazy pose on a simple, clean background.',
};
```

Each prompt is carefully crafted to match the personality's characteristics while maintaining a consistent style.

### Negative Prompts

To improve image quality and prevent unwanted elements, we've added negative prompts:

```typescript
// Negative prompts to exclude unwanted elements
const negativePrompt =
  'text, words, letters, numbers, writing, labels, watermarks, signatures, blurry, distorted, low quality, pixelated';

// Combine with positive prompt
const fullPrompt = `${prompt} Negative prompt: ${negativePrompt}`;
```

This helps ensure that:

- No text appears in the images
- Images are clear and high quality
- No watermarks or signatures are included
- The focus remains on the cookie character itself

### Rate Limiting

To handle the DALL-E API rate limit of 5 images per minute, we've implemented:

```typescript
// Simple rate limiting - track requests
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

// Check if we're rate limited
function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  const recentRequests = requestTimestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);

  // Update the timestamps array
  requestTimestamps.length = 0;
  requestTimestamps.push(...recentRequests);

  // Check if we've hit the limit
  return requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
}

// Add a timestamp for a new request
function trackRequest(): void {
  requestTimestamps.push(Date.now());
}
```

This approach:

1. Tracks timestamps of recent requests
2. Filters out requests older than the rate limit window (1 minute)
3. Checks if we've reached the maximum allowed requests (5 per minute)
4. Returns appropriate error responses with status code 429 when rate limited
5. Includes a user-friendly error message explaining the rate limit
6. Automatically falls back to emoji art when rate limited

### Error Handling

We implemented the following error handling strategy:

1. Log the error
2. Return a specific error response that indicates fallback to emoji
3. Update the UI to show emoji art instead
4. Automatically switch the toggle back to emoji mode
5. Provide specific error messages for rate limiting vs. other errors

### Performance Considerations

- Used 256x256 image size for faster generation
- Implemented proper loading states to indicate when an image is being generated

### Handling External Images in Next.js

To handle the external image URLs from the OpenAI DALL-E API, we:

1. Created a Next.js configuration file (`next.config.cjs`) with domains and remotePatterns:

   ```javascript
   const nextConfig = {
     reactStrictMode: true,
     images: {
       domains: ['oaidalleapiprodscus.blob.core.windows.net', 'oaidalleapiprodscus.azureedge.net'],
       remotePatterns: [
         {
           protocol: 'https',
           hostname: '**.blob.core.windows.net',
         },
         {
           protocol: 'https',
           hostname: '**.azureedge.net',
         },
       ],
     },
   };
   ```

2. Added a custom loader to the Image components:

   ```typescript
   const dalleImageLoader = ({ src }: { src: string }) => {
     return src;
   };

   <Image
     loader={dalleImageLoader}
     src={imageUrl}
     alt={name}
     width={128}
     height={128}
     className="rounded-lg"
     unoptimized
   />
   ```

3. Used the `unoptimized` prop to bypass Next.js image optimization for these external URLs

## Next Steps

1. ✅ Write tests for the new components and API endpoints
2. ✅ Add specific prompts for each cookie personality type
3. ✅ Add negative prompts to prevent text and unwanted elements in images
4. ✅ Implement rate limiting handling for DALL-E API
5. [ ] Consider adding a feature to save generated images
6. [ ] Add a way to share the generated art along with the fortune
7. [ ] Consider adding a gallery view of previously generated art
