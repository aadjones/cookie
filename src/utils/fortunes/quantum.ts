import { CookiePersonality, SpecialBehaviorType } from '../types';

export const quantumCookie: CookiePersonality = {
  id: 'quantum',
  name: 'Quantum Cookie',
  emoji: '⚛️',
  messages: [], // Legacy field, kept empty for quantum cookies
  quantumPairs: [
    { message1: 'Your outlook is good', message2: 'Your outlook is not so good' },
    { message1: 'There is no cookie', message2: 'There is no you' },
    { message1: 'You exist', message2: "You don't exist" },
    { message1: 'Everything is predetermined', message2: 'Free will is real' },
    { message1: "You're being observed", message2: 'No one is watching' },
    { message1: 'The future is fixed', message2: 'All possibilities remain open' },
    { message1: 'You have control', message2: 'You are powerless' },
    { message1: 'This moment is eternal', message2: 'This moment never happened' },
    { message1: 'You are the center', message2: 'You are nothing' },
    { message1: 'Truth is absolute', message2: 'Truth is relative' },
  ],
  specialBehavior: SpecialBehaviorType.QUANTUM,
};
