import { CookiePersonality, SpecialBehaviorType } from '../types';

export const matryoshkaCookie: CookiePersonality = {
  id: 'matryoshka',
  name: 'Matryoshka Cookie',
  emoji: '🪆',
  messages: [
    'Your fortune is in the next cookie.',
    'Sorry, but your destiny is in another cookie.',
    'This fortune is currently inside a smaller cookie. Please try the one inside.',
    'Fortune not found. Have you checked the cookie within this cookie?',
    'Your real fortune is hiding in the cookie nested inside this one.',
    'Congratulations! You found a cookie. Your fortune is in the cookie inside this cookie.',
    'This is just the outer cookie. The fortune is several layers deeper.',
    'Your fortune is currently inception-ed in the next cookie down.',
    "Plot twist: Your fortune is in the cookie you haven't opened yet.",
    'Look deeper. Your fortune is in the cookie inside the cookie inside this cookie.',
  ],
  specialBehavior: SpecialBehaviorType.MATRYOSHKA,
};
