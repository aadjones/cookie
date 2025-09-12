import { CookiePersonality, SpecialBehaviorType } from './types';

export const cookiePersonalities: CookiePersonality[] = [
  {
    id: 'toxic-positivity',
    name: 'Toxic Positivity Cookie',
    emoji: '🌈',
    messages: [
      'Your coffee may be cold and your WiFi weak, but remember: every spilled latte is a chance to remake your world into a rainbow of possibilities!',
      'Even if your toast burns and your day seems gray, remember: every charred crumb is a lesson in resilience!',
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'error',
    name: 'Error Cookie',
    emoji: '🚫',
    messages: ['Error 404: Destiny not found.', 'Fatal out-of-cheese error (511). Please try again later.'],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'conspiracy',
    name: 'Conspiracy Cookie',
    emoji: '🕵️‍♂️',
    messages: [
      "If you think you're feeling hormonal lately, it's probably because THE MOON IS A HOLOGRAM!",
      "I wouldn't advise getting that haircut tomorrow—unless you want the government to harvest your DNA.",
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'actuarial',
    name: 'Actuarial Cookie',
    emoji: '📊',
    messages: [
      "There's a 73% chance that you won't believe what happens 5 minutes from now!",
      "The next time you do your laundry, you'll find the missing sock of your dreams.",
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'misfortune',
    name: 'Misfortune Cookie',
    emoji: '😢',
    messages: [
      "Traffic lights hate you. They stay yellow longer only when you've already decided to stop, mocking you with their smug amber little faces.",
      'Today, fate might trip you up—a spilled drink or a missing pen could be your unwelcome harbinger of chaos.',
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
    messages: [
      "What do you mean you didn't get a fortune? You already read it!",
      'You must have missed it—your destiny was clearly outlined in that fortune you already read, even if you pretend otherwise.',
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
  {
    id: 'quantum',
    name: 'Quantum Cookie',
    emoji: '⚛️',
    messages: ['Your outlook is good', 'Your outlook is not so good', 'There is no cookie', 'There is no you'],
    specialBehavior: SpecialBehaviorType.QUANTUM,
  },
  {
    id: 'apathetic',
    name: 'Apathetic Cookie',
    emoji: '😑',
    messages: ['', '...huh? You wanted a fortune? Who has the time?'],
    specialBehavior: SpecialBehaviorType.APATHETIC,
  },
  {
    id: 'insightful',
    name: 'Genuinely Insightful Cookie',
    emoji: '🧐',
    messages: [
      'Amid the absurdity of daily life, a single glance in the mirror will reveal a profound truth: sometimes, the most ordinary moments hold the key to extraordinary insights—if you dare to AAHHHH WHY WOULD YOU EAT ME?!',
      "Much as it seems simpler to crack open a cookie to find the answers, the truth lies within yourself. So yeah, you're gonna have to crack yourself open.",
    ],
    specialBehavior: SpecialBehaviorType.STANDARD,
  },
];

export const getRandomCookiePersonality = (): CookiePersonality => {
  const randomIndex = Math.floor(Math.random() * cookiePersonalities.length);
  return cookiePersonalities[randomIndex];
};

export const getRandomMessage = (personality: CookiePersonality): string => {
  if (personality.messages.length === 0) return 'No fortune available for this cookie.';

  // Special handling for Quantum Cookie
  if (personality.specialBehavior === SpecialBehaviorType.QUANTUM) {
    // For the Quantum Cookie, we have two specific pairs:
    // 1. "Your outlook is good" / "Your outlook is not so good"
    // 2. "There is no cookie" / "There is no you"

    // Randomly choose which pair to use (0 or 1)
    const pairChoice = Math.random() < 0.5 ? 0 : 1;

    if (pairChoice === 0) {
      // First pair: "Your outlook is good" / "Your outlook is not so good"
      return `${personality.messages[0]} / ${personality.messages[1]}`;
    } else {
      // Second pair: "There is no cookie" / "There is no you"
      return `${personality.messages[2]} / ${personality.messages[3]}`;
    }
  }

  // Standard behavior for other cookies
  const randomIndex = Math.floor(Math.random() * personality.messages.length);
  return personality.messages[randomIndex];
};
