import { CookiePersonality, SpecialBehaviorType } from '../types';

export const apatheticCookie: CookiePersonality = {
  id: 'apathetic',
  name: 'Apathetic Cookie',
  emoji: '😑',
  messages: ['', '...huh? You wanted a fortune? Who has the time?'],
  specialBehavior: SpecialBehaviorType.APATHETIC,
};
