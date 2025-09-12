import { CookiePersonality, SpecialBehaviorType } from '../types';

export const errorCookie: CookiePersonality = {
  id: 'error',
  name: 'Error Cookie',
  emoji: '🚫',
  messages: ['Error 404: Destiny not found.', 'Fatal out-of-cheese error (511). Please try again later.'],
  specialBehavior: SpecialBehaviorType.STANDARD,
};
