// src/pages/api/fortune.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { cookiePersonalities, getRandomMessage } from '../../utils/cookieData';
import { FortuneResponse } from '../../utils/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<FortuneResponse | { message: string }>) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    // Get a random cookie personality
    // Get a random cookie personality
    // FORCE_COOKIE - This code was added by the forceCookie script
    // To restore original behavior, run: npm run restore-cookie
    const forcedCookieId = 'apathetic';
    const forcedCookie = cookiePersonalities.find((c) => c.id === forcedCookieId);
    if (!forcedCookie) {
      console.error(`Cookie personality with ID ${forcedCookieId} not found`);
      return res.status(500).json({ message: 'Forced cookie personality not found' });
    }
    const personality = forcedCookie;

    // Get a random message from that personality
    const message = getRandomMessage(personality);

    // Return the personality and message
    res.status(200).json({
      personality,
      message,
    });
  } catch (error) {
    console.error('Error generating fortune:', error);
    res.status(500).json({ message: 'Error generating fortune' });
  }
}
