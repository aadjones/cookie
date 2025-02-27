import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the API route file
const apiFilePath = path.resolve(__dirname, '../src/pages/api/fortune.ts');

// Read the current API file
let apiFileContent = fs.readFileSync(apiFilePath, 'utf8');

// First, clean up any duplicate comments
apiFileContent = apiFileContent.replace(
  /\/\/ Get a random cookie personality(\s*\/\/ Get a random cookie personality)*/g,
  '// Get a random cookie personality'
);

// Check if the file has our modification
if (apiFileContent.includes('// FORCE_COOKIE')) {
  // Remove the modification
  apiFileContent = apiFileContent.replace(
    /\n\s*\/\/ FORCE_COOKIE[\s\S]*?const personality = forcedCookie;?/g,
    '\n    // Get a random cookie personality\n    const personality = getRandomCookiePersonality()'
  );

  // Write the modified content back to the file
  fs.writeFileSync(apiFilePath, apiFileContent);

  console.log('API restored to original behavior.');
} else {
  console.log('No modifications found. API is already in its original state.');
}
