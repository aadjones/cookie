# Digital Fortune Cookie - AI-Generated Fortunes Implementation Plan

## Overview

We need to implement a toggle feature that allows users to switch between pre-written fortune messages and AI-generated messages. The AI-generated messages will be created on-the-fly using an API call to an LLM like GPT-4o, with custom prompts tailored to each cookie personality.

## Current Implementation

- The app currently uses pre-written messages stored in `cookieData.ts` for each cookie personality
- The `/api/fortune` endpoint returns a random cookie personality
- The `getRandomMessage` function selects a random message from the personality's message list
- Special behaviors (Quantum, Matryoshka, Apathetic) have custom message handling

## Tasks

### 1. Define Data Models

- [x] Update TypeScript interfaces to support AI-generated messages
- [x] Define a new enum for message generation modes (PRE_WRITTEN, AI_GENERATED)
- [x] Create interfaces for AI prompt templates

### 2. Create AI Prompt Templates

- [x] Create a data file with custom prompts for each cookie personality
- [x] Design prompts that capture the essence and tone of each personality
- [x] Ensure prompts are concise but descriptive enough for the LLM

### 3. Implement API Endpoint for AI-Generated Fortunes

- [x] Complete the `/api/generate-fortune.ts` endpoint
- [x] Add environment variables for API keys
- [x] Implement error handling and rate limiting
- [x] ~~Create a caching mechanism to reduce API calls~~ (Removed to ensure fresh messages each time)

### 4. Update UI Components

- [x] Add a toggle switch in the UI for switching between generation modes
- [x] Update the state management to track the current generation mode
- [x] Modify the fortune fetching logic based on the selected mode
- [x] Add loading indicators for AI-generated messages

### 5. Modify Fortune Generation Logic

- [x] Update the `getRandomMessage` function to handle both modes
- [x] Create a new function for fetching AI-generated messages
- [x] Ensure special behaviors still work with AI-generated messages
- [x] Handle edge cases (API failures, timeouts, etc.)

### 6. Add User Preferences

- [x] Store the user's preferred generation mode in localStorage
- [x] Restore the preference when the user returns to the app
- [ ] Add a settings panel for additional customization options (future enhancement)

### 7. Testing

- [x] Write unit tests for the new API endpoint
- [x] Test the toggle functionality
- [x] Ensure both generation modes work correctly
- [x] Test error handling and fallback mechanisms

### 8. Refinement

- [x] ~~Optimize API calls to minimize costs (implemented caching)~~ (Removed caching to ensure fresh messages)
- [ ] Add analytics to track usage of each generation mode (future enhancement)
- [ ] Implement feedback mechanism for AI-generated fortunes (future enhancement)
- [ ] Consider adding a "save favorite" feature for memorable fortunes (future enhancement)

## Implementation Details

### Updated Type Definitions

```typescript
// New enum for message generation modes
export enum MessageGenerationMode {
  PRE_WRITTEN = 'pre-written',
  AI_GENERATED = 'ai-generated',
}

// Interface for AI prompt templates
export interface AIPromptTemplate {
  personalityId: string;
  systemPrompt: string;
  userPrompt: string;
}

// Updated FortuneResponse interface
export interface FortuneResponse {
  personality: CookiePersonality;
  message: string;
  generationMode: MessageGenerationMode;
}
```

### AI Prompt Template Example

```typescript
export const aiPromptTemplates: AIPromptTemplate[] = [
  {
    personalityId: 'toxic-positivity',
    systemPrompt:
      "You are a 'Toxic Positivity Cookie' that gives overly optimistic advice that ignores real problems. Your tone is sickeningly sweet and you use excessive exclamation points.",
    userPrompt:
      "Generate a short fortune cookie message (max 2 sentences) that's excessively positive and ignores any potential downsides or difficulties in life.",
  },
  // Templates for other personalities...
];
```

### Toggle Component

```tsx
interface GenerationModeToggleProps {
  mode: MessageGenerationMode;
  onChange: (mode: MessageGenerationMode) => void;
}

function GenerationModeToggle({ mode, onChange }: GenerationModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className={mode === MessageGenerationMode.PRE_WRITTEN ? 'font-bold' : ''}>Classic</span>
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          mode === MessageGenerationMode.AI_GENERATED ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        onClick={() =>
          onChange(
            mode === MessageGenerationMode.PRE_WRITTEN
              ? MessageGenerationMode.AI_GENERATED
              : MessageGenerationMode.PRE_WRITTEN
          )
        }
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            mode === MessageGenerationMode.AI_GENERATED ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={mode === MessageGenerationMode.AI_GENERATED ? 'font-bold' : ''}>AI-Generated</span>
    </div>
  );
}
```

## Completed Implementation

We have successfully implemented the AI-generated fortunes feature with the following components:

1. **Updated Type Definitions**: Added new types for message generation modes and AI prompt templates.

2. **AI Prompt Templates**: Created custom prompts for each cookie personality that capture their unique tone and style.

3. **Generate Fortune API Endpoint**: Implemented a new API endpoint that generates fortunes using the OpenAI API, ensuring a fresh message is generated each time.

4. **Toggle Component**: Added a UI toggle for switching between pre-written and AI-generated fortunes.

5. **Updated Home Page**: Modified the main page to handle both generation modes and display appropriate loading states.

6. **User Preferences**: Added localStorage support to remember the user's preferred generation mode.

7. **Tests**: Created comprehensive tests for the new components and API endpoint.

## Next Steps

1. **API Key Management**: Provide clear instructions for users to add their own OpenAI API key.

2. **Analytics**: Consider adding analytics to track usage of each generation mode.

3. **Feedback Mechanism**: Implement a way for users to provide feedback on AI-generated fortunes.

4. **Favorites**: Add a feature to save favorite fortunes.

5. **Settings Panel**: Create a more comprehensive settings panel for additional customization options.
