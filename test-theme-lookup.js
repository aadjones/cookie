// Quick test of theme lookup logic
const mockPersonality = {
  id: 'insightful',
  name: 'Genuinely Insightful Cookie',
  emoji: '🧐',
  messages: ['test'],
  specialBehavior: 'standard',
};

// Simulate the theme definitions
const personalityThemes = {
  insightful: {
    background: 'bg-gradient-to-b from-amber-100 via-yellow-100 to-orange-200',
    headerBg: 'bg-gradient-to-r from-amber-600 to-orange-600',
    cookieGlow: 'shadow-amber-500/40 hover:shadow-amber-600/60',
    accent: 'text-amber-700',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-500 hover:border-orange-500',
    loadingMessage: 'Gathering wisdom...',
  },
};

const defaultTheme = {
  background: 'bg-gradient-to-b from-blue-50 to-indigo-100',
  headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
  cookieGlow: 'shadow-blue-400/30 hover:shadow-blue-500/50',
  accent: 'text-blue-600',
  textColor: 'text-blue-800',
  borderColor: 'border-blue-400 hover:border-blue-500',
  loadingMessage: 'Loading your cookie...',
};

const getPersonalityTheme = (personality) => {
  console.log('Input personality:', personality);
  if (!personality) {
    console.log('No personality, returning default theme');
    return defaultTheme;
  }

  console.log('Looking up theme for ID:', personality.id);
  const theme = personalityThemes[personality.id];
  console.log('Found theme:', theme);

  if (!theme) {
    console.log('No theme found, returning default');
    return defaultTheme;
  }

  console.log('Returning theme:', theme);
  return theme;
};

// Test cases
console.log('=== Test 1: Valid insightful personality ===');
const result1 = getPersonalityTheme(mockPersonality);
console.log('Result background:', result1.background);

console.log('\n=== Test 2: Null personality ===');
const result2 = getPersonalityTheme(null);
console.log('Result background:', result2.background);

console.log('\n=== Test 3: Invalid personality ID ===');
const invalidPersonality = { ...mockPersonality, id: 'invalid-id' };
const result3 = getPersonalityTheme(invalidPersonality);
console.log('Result background:', result3.background);
