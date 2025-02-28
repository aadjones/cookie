// TODO: Implement API route for fortune generation

import type { NextApiRequest, NextApiResponse } from 'next';
import { getPromptTemplateForPersonality } from '../../utils/aiPromptTemplates';
import { CookiePersonality, FortuneResponse, MessageGenerationMode, SpecialBehaviorType } from '../../utils/types';

// Simple in-memory rate limiting
// In a production app, you would use a more robust solution like Redis
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const ipRequestCounts: Record<string, { count: number; resetTime: number }> = {};

// Export the function for testing purposes
export async function generateAIMessage(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    // Check if we have an API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('No OpenAI API key found or using placeholder. Using fallback message.');
      return 'AI-generated fortunes are currently unavailable. Please try again later.';
    }

    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'AI-generated fortunes are currently unavailable. Please try again later.';
  }
}

// Helper function to check rate limits
function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  Object.keys(ipRequestCounts).forEach((key) => {
    if (ipRequestCounts[key].resetTime < now) {
      delete ipRequestCounts[key];
    }
  });

  // Initialize or get the current count for this IP
  if (!ipRequestCounts[ip] || ipRequestCounts[ip].resetTime < now) {
    ipRequestCounts[ip] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  // Increment the count
  ipRequestCounts[ip].count++;

  // Check if over limit
  return ipRequestCounts[ip].count <= MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FortuneResponse | { message: string }>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Get client IP for rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const clientIp = Array.isArray(ip) ? ip[0] : ip;

  // Check rate limit
  if (!checkRateLimit(clientIp.toString())) {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
    return;
  }

  try {
    const { personality } = req.body as { personality: CookiePersonality };

    // Validate request body
    if (!personality || !personality.id) {
      res.status(400).json({ message: 'Missing personality data' });
      return;
    }

    // Special handling for special behavior cookies
    if (personality.specialBehavior === SpecialBehaviorType.MATRYOSHKA) {
      // For Matryoshka cookies, we don't generate a message
      res.status(200).json({
        personality,
        message: '',
        generationMode: MessageGenerationMode.AI_GENERATED,
      });
      return;
    }

    if (personality.specialBehavior === SpecialBehaviorType.APATHETIC) {
      // For Apathetic cookies, we return an empty or minimal message
      const apathyMessages = ['', '...', 'whatever', 'meh'];
      const message = apathyMessages[Math.floor(Math.random() * apathyMessages.length)];

      res.status(200).json({
        personality,
        message,
        generationMode: MessageGenerationMode.AI_GENERATED,
      });
      return;
    }

    // Get the prompt template for this personality
    const promptTemplate = getPromptTemplateForPersonality(personality.id);
    if (!promptTemplate) {
      res.status(404).json({ message: `No prompt template found for personality: ${personality.id}` });
      return;
    }

    // Special handling for Quantum cookies
    if (personality.specialBehavior === SpecialBehaviorType.QUANTUM) {
      // For Quantum cookies, we need to generate two contradictory messages
      const message = await generateAIMessage(promptTemplate.systemPrompt, promptTemplate.userPrompt);

      // Split the message into two parts if it contains a separator
      const parts = message.split(/[/\n]/).filter((part) => part.trim().length > 0);
      let finalMessage = message;

      if (parts.length >= 2) {
        // Use the first two parts as our quantum superposition
        finalMessage = `${parts[0].trim()} / ${parts[1].trim()}`;
      }

      res.status(200).json({
        personality,
        message: finalMessage,
        generationMode: MessageGenerationMode.AI_GENERATED,
      });
      return;
    }

    // Generate the AI message for standard cookies
    const message = await generateAIMessage(promptTemplate.systemPrompt, promptTemplate.userPrompt);

    res.status(200).json({
      personality,
      message,
      generationMode: MessageGenerationMode.AI_GENERATED,
    });
  } catch (error) {
    console.error('Error generating AI fortune:', error);
    res.status(500).json({ message: 'Error generating AI fortune' });
  }
}
