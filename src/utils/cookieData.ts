import { CookiePersonality, SpecialBehaviorType } from './types';

export const cookiePersonalities: CookiePersonality[] = [
  {
    id: 'toxic-positivity',
    name: 'Toxic Positivity Cookie',
    emoji: '🌈',
    messages: [
      'Your coffee may be cold and your WiFi weak, but remember: every spilled latte is a chance to remake your world into a rainbow of possibilities!',
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'error',
    name: 'Error Cookie',
    emoji: '🚫',
    messages: ['Error 404: Destiny not found.'],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'conspiracy',
    name: 'Conspiracy Cookie',
    emoji: '🕵️‍♂️',
    messages: ["If you think you're feeling hormonal lately, it's probably because THE MOON IS A HOLOGRAM!"],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'actuarial',
    name: 'Actuarial Cookie',
    emoji: '📊',
    messages: ["There's a 73% chance that you won't believe what happens 5 minutes from now!"],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'misfortune',
    name: 'Misfortune Cookie',
    emoji: '😢',
    messages: [
      "Traffic lights hate you. They stay yellow longer only when you've already decided to stop, mocking you with their smug amber little faces.",
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'matryoshka',
    name: 'Matryoshka Cookie',
    emoji: '🪆',
    messages: [''],
    specialBehavior: SpecialBehaviorType.MATRYOSHKA,
  },
  {
    id: 'gaslighting',
    name: 'Gaslighting Cookie',
    emoji: '🤯',
    messages: ["What do you mean you didn't get a fortune? You already read it!"],
    specialBehavior: SpecialBehaviorType.GASLIGHTING,
  },
  {
    id: 'quantum',
    name: 'Quantum Cookie',
    emoji: '⚛️',
    messages: ['Your outlook is good', 'Your outlook is not so good'],
    specialBehavior: SpecialBehaviorType.QUANTUM,
  },
  {
    id: 'apathetic',
    name: 'Apathetic Cookie',
    emoji: '😑',
    messages: [''],
    specialBehavior: SpecialBehaviorType.APATHETIC,
  },
  {
    id: 'insightful',
    name: 'Genuinely Insightful Cookie',
    emoji: '🧐',
    messages: [
      'Amid the absurdity of daily life, a single glance in the mirror will reveal a profound truth: sometimes, the most ordinary moments hold the key to extraordinary insights—if you dare to AAHHHH WHY WOULD YOU EAT ME?!',
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
];

export const getRandomCookiePersonality = (): CookiePersonality => {
  const randomIndex = Math.floor(Math.random() * cookiePersonalities.length);
  return cookiePersonalities[randomIndex];
};

export const getRandomMessage = (personality: CookiePersonality): string => {
  if (personality.messages.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * personality.messages.length);
  return personality.messages[randomIndex];
};
