import { CookiePersonality, SpecialBehaviorType } from '../types';

export const quantumCookie: CookiePersonality = {
  id: 'quantum',
  name: 'Quantum Cookie',
  emoji: '⚛️',
  messages: ['Your outlook is good', 'Your outlook is not so good', 'There is no cookie', 'There is no you'],
  specialBehavior: SpecialBehaviorType.QUANTUM,
};
