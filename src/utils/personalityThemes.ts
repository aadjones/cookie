import { CookiePersonality } from './types';

export interface PersonalityTheme {
  background: string;
  headerBg: string;
  cookieGlow: string;
  accent: string;
  textColor: string;
  borderColor: string;
  loadingMessage: string;
}

export const personalityThemes: Record<string, PersonalityTheme> = {
  'toxic-positivity': {
    background: 'bg-pink-100',
    headerBg: 'bg-pink-500',
    cookieGlow: 'shadow-pink-500',
    accent: 'text-pink-600',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-500',
    loadingMessage: 'Manifesting rainbows...',
  },
  error: {
    background: 'bg-red-50',
    headerBg: 'bg-red-600',
    cookieGlow: 'shadow-red-500',
    accent: 'text-red-600',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    loadingMessage: 'Debugging fate.exe...',
  },
  conspiracy: {
    background: 'bg-gray-800',
    headerBg: 'bg-gray-900',
    cookieGlow: 'shadow-green-500',
    accent: 'text-green-400',
    textColor: 'text-green-300',
    borderColor: 'border-green-500',
    loadingMessage: 'Decrypting your destiny...',
  },
  actuarial: {
    background: 'bg-indigo-50',
    headerBg: 'bg-indigo-600',
    cookieGlow: 'shadow-indigo-500',
    accent: 'text-indigo-600',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-500',
    loadingMessage: 'Calculating probabilities...',
  },
  misfortune: {
    background: 'bg-gray-600',
    headerBg: 'bg-gray-800',
    cookieGlow: 'shadow-gray-700',
    accent: 'text-gray-300',
    textColor: 'text-gray-200',
    borderColor: 'border-gray-500',
    loadingMessage: 'Brewing misfortune...',
  },
  matryoshka: {
    background: 'bg-yellow-100',
    headerBg: 'bg-yellow-500',
    cookieGlow: 'shadow-yellow-500',
    accent: 'text-red-600',
    textColor: 'text-red-800',
    borderColor: 'border-yellow-500',
    loadingMessage: 'Nesting your destiny...',
  },
  gaslighting: {
    background: 'bg-purple-100',
    headerBg: 'bg-purple-600',
    cookieGlow: 'shadow-purple-500',
    accent: 'text-purple-600',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-500',
    loadingMessage: 'Wait, what were you expecting?',
  },
  quantum: {
    background: 'bg-violet-100',
    headerBg: 'bg-violet-600',
    cookieGlow: 'shadow-violet-500',
    accent: 'text-violet-600',
    textColor: 'text-violet-800',
    borderColor: 'border-violet-500',
    loadingMessage: 'Collapsing wave functions...',
  },
  apathetic: {
    background: 'bg-gray-200',
    headerBg: 'bg-gray-500',
    cookieGlow: 'shadow-gray-500',
    accent: 'text-gray-600',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-500',
    loadingMessage: 'Meh... loading...',
  },
  insightful: {
    background: 'bg-amber-50',
    headerBg: 'bg-amber-600',
    cookieGlow: 'shadow-amber-500',
    accent: 'text-amber-700',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-500',
    loadingMessage: 'Gathering wisdom...',
  },
};

export const defaultTheme: PersonalityTheme = {
  background: 'bg-blue-50',
  headerBg: 'bg-blue-600',
  cookieGlow: 'shadow-blue-500',
  accent: 'text-blue-600',
  textColor: 'text-blue-800',
  borderColor: 'border-blue-500',
  loadingMessage: 'Loading your cookie...',
};

export const getPersonalityTheme = (personality: CookiePersonality | null): PersonalityTheme => {
  if (!personality) return defaultTheme;
  return personalityThemes[personality.id] || defaultTheme;
};
