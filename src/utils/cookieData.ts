import { CookiePersonality, SpecialBehaviorType } from './types';
import { cookiePersonalities } from './fortunes';

export { cookiePersonalities };

export const getRandomCookiePersonality = (): CookiePersonality => {
  const randomIndex = Math.floor(Math.random() * cookiePersonalities.length);
  return cookiePersonalities[randomIndex];
};

export const getRandomMessage = (personality: CookiePersonality): string => {
  // Special handling for Quantum Cookie
  if (personality.specialBehavior === SpecialBehaviorType.QUANTUM) {
    if (!personality.quantumPairs || personality.quantumPairs.length === 0) {
      return 'Quantum uncertainty detected.';
    }

    // Randomly choose which pair to use
    const randomPairIndex = Math.floor(Math.random() * personality.quantumPairs.length);
    const selectedPair = personality.quantumPairs[randomPairIndex];

    return `${selectedPair.message1} / ${selectedPair.message2}`;
  }

  // Standard behavior for other cookies
  if (personality.messages.length === 0) return 'No fortune available for this cookie.';

  const randomIndex = Math.floor(Math.random() * personality.messages.length);
  return personality.messages[randomIndex];
};
