import type { NextApiRequest, NextApiResponse } from 'next';
import { DALLEResponseData } from '../../utils/types';

// Base prompt template
const basePrompt =
  'A cartoon-style fortune cookie representing {personalityName}. Simple, fun design with a clean background. No text, words, letters, numbers or writing.';

// Function to generate prompt
function generatePrompt(personalityName: string): string {
  return basePrompt.replace('{personalityName}', personalityName);
}

// Personality-specific prompts
const personalityPrompts: Record<string, string> = {
  // Standard personalities
  'toxic-positivity':
    'A cartoon-style fortune cookie with an overly cheerful, rainbow-colored appearance. Exaggerated happy face, surrounded by sparkles and hearts. Simple, clean background. No text or writing of any kind.',
  error:
    'A cartoon-style fortune cookie with glitchy, broken appearance. Error symbols, static effects, and digital artifacts. Red warning colors on a simple, clean background. No text or writing of any kind.',
  conspiracy:
    'A cartoon-style fortune cookie wearing a detective hat and holding a magnifying glass. Suspicious eyes, surrounded by question marks and conspiracy symbols. Simple, clean background. No text or writing of any kind.',
  actuarial:
    'A cartoon-style fortune cookie with graphs, charts and statistics floating around it. Mathematical symbols, calculator, and probability diagrams. Professional appearance on a simple, clean background. No text, numbers, or writing of any kind.',
  misfortune:
    'A cartoon-style fortune cookie with a sad, gloomy appearance. Rainy cloud above, tears, broken pieces, and dark colors. Melancholic expression on a simple, clean background. No text or writing of any kind.',
  gaslighting:
    'A cartoon-style fortune cookie with a deceptive, two-faced appearance. One side smiling, one side sinister. Swirling, confusing patterns around it. Disorienting design on a simple, clean background. No text or writing of any kind.',
  insightful:
    'A cartoon-style fortune cookie with a wise, philosophical appearance. Wearing glasses, surrounded by light bulbs and thought bubbles. Contemplative expression on a simple, clean background. No text or writing of any kind.',

  // Special behavior personalities
  matryoshka:
    'A cartoon-style fortune cookie designed like a Russian nesting doll. Decorative patterns, bright colors, nested layers visible. Traditional matryoshka doll aesthetic on a simple, clean background. No text or writing of any kind.',
  quantum:
    'A cartoon-style fortune cookie with a cosmic, quantum appearance. Multiple overlapping outlines, glowing with energy, existing in multiple states simultaneously. Sci-fi aesthetic on a simple, clean background. No text or writing of any kind.',
  apathetic:
    'A cartoon-style fortune cookie with a bored, disinterested expression. Slouching posture, half-lidded eyes, muted colors. Yawning or looking at a smartphone. Lazy pose on a simple, clean background. No text or writing of any kind.',
};

// Function that allows for personality-specific prompts
function getPromptForPersonality(personalityId: string, personalityName: string): string {
  return personalityPrompts[personalityId] || generatePrompt(personalityName);
}

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

// Helper function to generate DALL-E image
export async function generateDALLEImage(personalityId: string, personalityName: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is missing');
  }

  // Check for rate limiting
  if (isRateLimited()) {
    throw new Error('DALL-E rate limit reached (5 images per minute). Please try again later.');
  }

  // Generate prompt based on personality
  const prompt = getPromptForPersonality(personalityId, personalityName);

  console.log(`Generating DALL-E image for ${personalityName} (${personalityId}) with prompt: ${prompt}`);

  // Track this request
  trackRequest();

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-2',
      prompt: prompt,
      n: 1,
      size: '256x256',
      response_format: 'url',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('DALL-E API error:', response.statusText, errorData);

    // Check for rate limiting errors from OpenAI
    if (response.status === 429) {
      throw new Error('DALL-E rate limit reached. Please try again later.');
    }

    throw new Error(`DALL-E API error: ${response.statusText}`);
  }

  const data = (await response.json()) as DALLEResponseData;
  return data.data[0].url;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { personalityId, personalityName } = req.body;

  if (!personalityId || !personalityName) {
    return res.status(400).json({ error: 'Missing personality information' });
  }

  try {
    // Generate a new image every time
    const imageUrl = await generateDALLEImage(personalityId, personalityName);
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating DALL-E image:', error);

    // Check if it's a rate limit error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isRateLimitError = errorMessage.includes('rate limit');

    return res.status(isRateLimitError ? 429 : 500).json({
      error: errorMessage,
      fallbackToEmoji: true,
      isRateLimitError: isRateLimitError,
    });
  }
}
