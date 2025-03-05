# Digital Fortune Cookie

A fun web app that generates fortune cookie messages with different personalities.

## Features

- Various cookie personalities, each with their own tone and style
- Special cookie behaviors (Matryoshka, Quantum, Apathetic, etc.)
- Toggle between pre-written and AI-generated fortune messages
- Responsive design that works on mobile and desktop
- Animations and sound effects for breaking the cookie
- DALL-E image generation for cookie art (optional)

## AI-Generated Fortunes

The app supports two modes for generating fortune messages:

1. **Classic Mode**: Uses pre-written messages from our database
2. **AI-Generated Mode**: Creates unique, personalized messages on-the-fly using OpenAI's GPT-4o

### Setting Up Your OpenAI API Key (Required for AI Mode)

To use the AI-generated mode or DALL-E image generation, you'll need an OpenAI API key:

1. Sign up for an OpenAI account at [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an API key at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Copy the `.env.example` file to `.env` in the root directory of the project
4. Add your API key: `OPENAI_API_KEY=your_actual_api_key_here`
5. Set `ENABLE_DALL_E=true` if you want to enable DALL-E image generation

⚠️ **Security Note**:

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Your API key is only used server-side and is not exposed to the client
- The app includes rate limiting to prevent abuse of your API key

Each cookie personality has custom prompt templates designed to capture their unique tone and style, ensuring that AI-generated messages maintain the personality's character.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```

The tests use mock API responses and don't make actual calls to the OpenAI API, so you don't need a real API key for testing.

## Special Scripts

The app includes special scripts to help with development and testing:

```bash
# Force a specific cookie personality for testing
npm run force-cookie quantum

# Restore normal random cookie behavior
npm run restore-cookie
```

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Howler.js (for sound effects)
- OpenAI API (for AI-generated fortunes and DALL-E images)

## License

MIT
