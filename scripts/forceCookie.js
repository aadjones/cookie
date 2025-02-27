import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the API route file
const apiFilePath = path.resolve(__dirname, '../src/pages/api/fortune.ts');

// Get the cookie ID from command line arguments
const cookieId = process.argv[2];

// List of available cookie IDs
const availableCookieIds = [
  'toxic-positivity',
  'error',
  'conspiracy',
  'actuarial',
  'misfortune',
  'matryoshka',
  'gaslighting',
  'quantum',
  'apathetic',
  'insightful',
];

// If no cookie ID is provided, list available options and exit
if (!cookieId) {
  console.log('Please provide a cookie ID as an argument.');
  console.log('Available cookie IDs:');
  availableCookieIds.forEach((id) => console.log(`- ${id}`));
  process.exit(1);
}

// Check if the provided cookie ID is valid
if (!availableCookieIds.includes(cookieId)) {
  console.log(`Invalid cookie ID: ${cookieId}`);
  console.log('Available cookie IDs:');
  availableCookieIds.forEach((id) => console.log(`- ${id}`));
  process.exit(1);
}

// Read the current API file
let apiFileContent = fs.readFileSync(apiFilePath, 'utf8');

// First, clean up any previous modifications that might have gone wrong
apiFileContent = apiFileContent.replace(
  /\/\/ Get a random cookie personality(\s*\/\/ Get a random cookie personality)*/g,
  '// Get a random cookie personality'
);

// Check if the file already has our modification
if (apiFileContent.includes('// FORCE_COOKIE')) {
  // Remove the existing modification
  apiFileContent = apiFileContent.replace(
    /\n\s*\/\/ FORCE_COOKIE[\s\S]*?const personality = forcedCookie;?/g,
    '\n    // Get a random cookie personality\n    const personality = getRandomCookiePersonality()'
  );
}

// Make sure cookiePersonalities is imported
if (!apiFileContent.includes('import { cookiePersonalities')) {
  // Add the import for cookiePersonalities
  apiFileContent = apiFileContent.replace(
    'import { getRandomCookiePersonality, getRandomMessage }',
    'import { cookiePersonalities, getRandomCookiePersonality, getRandomMessage }'
  );
}

// Find the position to insert our code (right after the try block starts)
const tryBlockPos = apiFileContent.indexOf('try {');
const getPersonalityPos = apiFileContent.indexOf('const personality = getRandomCookiePersonality()', tryBlockPos);

if (tryBlockPos === -1 || getPersonalityPos === -1) {
  console.error('Could not find the necessary positions in the API file.');
  process.exit(1);
}

// Insert our code to force a specific cookie personality
const modifiedContent =
  apiFileContent.slice(0, getPersonalityPos) +
  `    // FORCE_COOKIE - This code was added by the forceCookie script
    // To restore original behavior, run: npm run restore-cookie
    const forcedCookieId = '${cookieId}';
    const forcedCookie = cookiePersonalities.find((c) => c.id === forcedCookieId);
    if (!forcedCookie) {
      console.error(\`Cookie personality with ID \${forcedCookieId} not found\`);
      return res.status(500).json({ message: 'Forced cookie personality not found' });
    }
    const personality = forcedCookie` +
  apiFileContent.slice(getPersonalityPos + 'const personality = getRandomCookiePersonality()'.length);

// Write the modified content back to the file
fs.writeFileSync(apiFilePath, modifiedContent);

console.log(`API modified to always return the "${cookieId}" cookie personality.`);
console.log('Run "npm run dev" to start the development server.');
console.log('To restore original behavior, run: npm run restore-cookie');
