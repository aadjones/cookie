import { CookiePersonality, SpecialBehaviorType } from '../types';

export const conspiracyCookie: CookiePersonality = {
  id: 'conspiracy',
  name: 'Conspiracy Cookie',
  emoji: '🕵️‍♂️',
  messages: [
    "If you think you're feeling hormonal lately, it's probably because THE MOON IS A HOLOGRAM!",
    "I wouldn't advise getting that haircut tomorrow—unless you want the government to harvest your DNA.",
  ],
  specialBehavior: SpecialBehaviorType.STANDARD,
};
