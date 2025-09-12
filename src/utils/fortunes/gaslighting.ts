import { CookiePersonality, SpecialBehaviorType } from '../types';

export const gaslightingCookie: CookiePersonality = {
  id: 'gaslighting',
  name: 'Gaslighting Cookie',
  emoji: '🤯',
  messages: [
    "What do you mean you didn't get a fortune? You already read it!",
    'You must have missed it—your destiny was clearly outlined in that fortune you already read, even if you pretend otherwise.',
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};
