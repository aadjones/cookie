import { CookiePersonality, SpecialBehaviorType } from './types';
import { cookiePersonalities } from './fortunes';

export { cookiePersonalities };

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
