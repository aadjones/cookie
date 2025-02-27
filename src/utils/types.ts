// Shared TypeScript types

export enum SpecialBehaviorType {
  STANDARD = 'standard',
  MATRYOSHKA = 'matryoshka',
  QUANTUM = 'quantum',
  GASLIGHTING = 'gaslighting',
  APATHETIC = 'apathetic',
}

export interface CookiePersonality {
  id: string;
  name: string;
  emoji: string;
  messages: string[];
  specialBehavior: SpecialBehaviorType;
}

export interface FortuneResponse {
  personality: CookiePersonality;
  message: string;
}
