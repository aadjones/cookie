// Shared TypeScript types

export enum SpecialBehaviorType {
  STANDARD = 'standard',
  MATRYOSHKA = 'matryoshka',
  QUANTUM = 'quantum',
  GASLIGHTING = 'gaslighting',
  APATHETIC = 'apathetic',
}

// New enum for message generation modes
export enum MessageGenerationMode {
  PRE_WRITTEN = 'pre-written',
  AI_GENERATED = 'ai-generated',
}

export interface CookiePersonality {
  id: string;
  name: string;
  emoji: string;
  messages: string[];
  specialBehavior: SpecialBehaviorType;
}

// Interface for AI prompt templates
export interface AIPromptTemplate {
  personalityId: string;
  systemPrompt: string;
  userPrompt: string;
}

export interface FortuneResponse {
  personality: CookiePersonality;
  message: string;
  generationMode?: MessageGenerationMode;
}
