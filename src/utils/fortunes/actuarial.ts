import { CookiePersonality, SpecialBehaviorType } from '../types';

export const actuarialCookie: CookiePersonality = {
  id: 'actuarial',
  name: 'Actuarial Cookie',
  emoji: '📊',
  messages: [
    "There's a 73% chance that you won't believe what happens 5 minutes from now!",
    "The next time you do your laundry, you'll find the missing sock of your dreams.",
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};
