import { CookiePersonality, SpecialBehaviorType } from '../types';

export const misfortuneCookie: CookiePersonality = {
  id: 'misfortune',
  name: 'Misfortune Cookie',
  emoji: '😢',
  messages: [
    'Traffic lights hate you. They stay yellow longer only when you have already decided to stop, mocking you with their smug amber little faces.',
    'Today, fate might trip you up—a spilled drink or a missing pen could be your unwelcome harbinger of chaos.',
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};
