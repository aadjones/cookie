# Digital Fortune Cookie - Cookie Personalities Implementation Plan

## Overview

We need to implement different cookie personalities as specified in the specs.md document. Each personality has:

- Custom art (placeholder emoji for now)
- A list of fortune messages (currently one per personality, but will be expanded)
- Some personalities have special behaviors

## Tasks

### 1. Define Data Models

- [x] Create TypeScript interfaces for cookie personalities
- [x] Define special behavior types
- [x] Update types.ts with these interfaces

### 2. Create Cookie Personalities Data

- [x] Create a data file with all cookie personalities from specs.md
- [x] Include emoji art, messages, and special behavior flags

### 3. Update API Endpoint

- [x] Modify the /api/fortune endpoint to return a random cookie personality
- [x] Ensure it returns all necessary data (personality name, art, messages, behavior)

### 4. Update Components

- [x] Modify CookieArt to display the personality-specific emoji
- [x] Update CookieAnimation to handle different animations based on personality
- [x] Enhance FortuneMessage to display personality-specific messages

### 5. Implement Special Behaviors

- [x] Create a behavior handler system
- [x] Implement Matryoshka Cookie behavior (reveals smaller cookie)
- [x] Implement Quantum Cookie behavior (superimposed flickering messages)
- [x] Implement other special behaviors as needed

### 6. Update Main Page

- [x] Modify the Home component to handle different personalities
- [x] Update state management to track current personality
- [x] Ensure "Get New Cookie" button selects a new random personality

### 7. Testing

- [x] Write unit tests for personality selection
- [x] Test special behaviors
- [x] Ensure all personalities display correctly
- [x] Fix failing tests after API changes

### 8. Refinement

- [ ] Add proper error handling
- [ ] Optimize performance
- [ ] Ensure accessibility

## Implementation Details

### Cookie Personality Interface

```typescript
interface CookiePersonality {
  id: string;
  name: string;
  emoji: string;
  messages: string[];
  specialBehavior?: SpecialBehaviorType;
}

enum SpecialBehaviorType {
  MATRYOSHKA = 'matryoshka',
  QUANTUM = 'quantum',
  // Add other special behaviors as needed
}
```

### Component Updates

We'll need to modify the following components:

- Home (src/pages/index.tsx)
- CookieArt (src/components/CookieArt.tsx)
- CookieAnimation (src/components/CookieAnimation.tsx)
- FortuneMessage (src/components/FortuneMessage.tsx)

And create new components:

- SpecialBehaviorHandler
- MatryoshkaCookie
- QuantumCookie
- Other special behavior components as needed

## Recent Fixes

- Updated API tests to check for new response format (personality and message)
- Updated Home page tests to mock API calls and check for correct elements
- Added conditional sound playing in CookieAnimation to prevent test failures
- Fixed test environment issues with Howler library

## Next Steps

- Add more messages to each personality
- Refine the special behaviors
- Improve the animations and visual feedback
- Add proper error handling
- Optimize performance
- Ensure accessibility
