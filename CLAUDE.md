# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run clean` - Remove .next build directory

### Testing

- `npm test` - Run test suite (Jest with React Testing Library)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- Coverage thresholds: 80% for branches, functions, lines, and statements

### Code Quality

- `npm run lint` - ESLint check (TypeScript, React hooks, Prettier integration)
- `npm run format` - Format code with Prettier
- `npm run check-types` - TypeScript type checking without emit

### Special Scripts

- `npm run force-cookie <personality>` - Force specific cookie personality for testing
- `npm run restore-cookie` - Restore random cookie behavior

## Architecture Overview

This is a **Next.js 13** application built with **TypeScript** and **Tailwind CSS** that creates a digital fortune cookie experience with unique cookie personalities.

### Project Structure

```
src/
├── pages/           # Next.js pages and API routes
│   ├── index.tsx    # Main application page
│   ├── _app.tsx     # App wrapper
│   └── api/         # Serverless API functions
│       ├── fortune.ts          # Classic fortune retrieval
│       ├── generate-fortune.ts # AI-generated fortunes (OpenAI)
│       └── generate-art.ts     # DALL-E image generation
├── components/      # React components
│   ├── CookieAnimation.tsx     # Main cookie cracking animation
│   ├── CookieArt.tsx          # Cookie visual display
│   ├── FortuneMessage.tsx     # Fortune text display
│   ├── GenerationModeToggle.tsx # AI vs Classic mode toggle
│   ├── ArtModeToggle.tsx      # DALL-E image toggle
│   └── Header.tsx / ShareButtons.tsx
├── utils/
│   ├── cookieData.ts          # Cookie personalities and fortunes
│   ├── aiPromptTemplates.ts   # OpenAI prompt templates
│   └── types.ts              # TypeScript type definitions
└── tests/           # Jest test files
```

### Core Features

**Cookie Personalities**: Each cookie has a unique personality (Toxic Positivity, Quantum, Matryoshka, etc.) with custom behaviors:

- 10 curated fortune messages per personality
- Custom animations and special behaviors
- AI-generated alternatives using personality-specific prompts

**Two Generation Modes**:

- **Classic Mode**: Pre-written messages from `src/utils/cookieData.ts`
- **AI Mode**: Dynamic generation using OpenAI GPT-4o with personality-aware prompts

**Optional DALL-E Integration**: Generate custom cookie art images

### Environment Setup

Required environment variables in `.env`:

- `OPENAI_API_KEY` - Required for AI-generated fortunes and DALL-E art
- `ENABLE_DALL_E=true` - Enable DALL-E image generation

### Key Implementation Details

- **State Management**: React hooks for cookie selection, animation states, generation modes
- **API Integration**: Next.js API routes for OpenAI services with rate limiting
- **Testing**: Jest with SWC transform, React Testing Library, 80% coverage requirements
- **Animation System**: CSS transitions with special behaviors for unique personalities
- **Type Safety**: Full TypeScript coverage with strict mode enabled

### Special Behaviors

Some cookie personalities have custom behaviors beyond standard fortune display:

- **Matryoshka Cookie**: Reveals nested cookies
- **Quantum Cookie**: Shows superimposed flickering messages
- **Apathetic Cookie**: Shows no message
- **Error Cookie**: Displays error-style messages

### Development Notes

- Path aliases: `@/*` maps to `src/*`
- Husky pre-commit hooks for linting
- Uses SWC for fast Jest transforms
- Tailwind for utility-first styling
- Sound effects via Howler.js library

Refer to `docs/specs.md` for detailed feature specifications and `README.md` for setup instructions.
