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

// New enum for art generation modes
export enum ArtGenerationMode {
  EMOJI = 'emoji',
  DALL_E = 'dall-e',
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
  artMode?: ArtGenerationMode;
  artUrl?: string; // URL to the generated DALL-E image
}

// DALL-E API interfaces
export interface DALLERequestBody {
  model: string; // e.g., "dall-e-2"
  prompt: string;
  n: number; // Number of images to generate
  size: string; // "256x256" for faster generation
}

export interface DALLEResponseData {
  created: number;
  data: {
    url: string;
    revised_prompt?: string;
  }[];
}
