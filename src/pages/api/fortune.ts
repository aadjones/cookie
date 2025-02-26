// src/pages/api/fortune.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const fortunes = [
  'You will find great wealth in unexpected places.',
  'A thrilling time is in your immediate future.',
  'Something you lost will soon turn up.',
  'Happiness begins with facing life head-on.',
  'An unexpected encounter will bring you joy.',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Pick a random fortune from the array
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  // Return it as JSON
  res.status(200).json({ fortune: randomFortune });
}
