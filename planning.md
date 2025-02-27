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
- [x] Fix Matryoshka Cookie message visibility issues
- [x] Fix Quantum Cookie message pairing behavior

### 6. Update Main Page

- [x] Modify the Home component to handle different personalities
- [x] Update state management to track current personality
- [x] Ensure "Get New Cookie" button selects a new random personality

### 7. Testing

- [x] Write unit tests for personality selection
- [x] Test special behaviors
- [x] Ensure all personalities display correctly
- [x] Fix failing tests after API changes
- [x] Add test for Matryoshka Cookie message visibility
- [x] Add test for Quantum Cookie message pairing

### 8. Refinement

- [x] Add proper error handling
- [x] Optimize performance
- [x] Ensure accessibility
- [x] Fix string delimiter issues in cookieData.ts
- [x] Fix linter errors throughout the codebase
- [x] Create scripts for forcing specific cookie personalities for testing

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
  STANDARD = 'standard',
  MATRYOSHKA = 'matryoshka',
  QUANTUM = 'quantum',
  GASLIGHTING = 'gaslighting',
  APATHETIC = 'apathetic'
}
```

### Component Updates

We've modified the following components:

- Home (src/pages/index.tsx)
- CookieArt (src/components/CookieArt.tsx)
- CookieAnimation (src/components/CookieAnimation.tsx)
- FortuneMessage (src/components/FortuneMessage.tsx)

## Recent Fixes

- Updated API tests to check for new response format (personality and message)
- Updated Home page tests to mock API calls and check for correct elements
- Added conditional sound playing in CookieAnimation to prevent test failures
- Fixed test environment issues with Howler library
- Fixed Matryoshka Cookie message visibility issues by completely rewriting the animation logic
- Added a test to verify that the Matryoshka Cookie message stays visible at the maximum level
- Fixed Quantum Cookie message pairing to ensure it selects between pairs of messages
- Fixed Quantum Cookie message display to properly alternate between the paired messages instead of showing them with a slash
- Added a test to verify the Quantum Cookie message pairing behavior
- Fixed string delimiter issues in cookieData.ts
- Fixed linter errors throughout the codebase

## Next Steps

- Consider adding more visual feedback for special behaviors
- Explore adding more cookie personalities
- Consider adding user preferences for favorite cookie personalities
- Add analytics to track which personalities are most popular
- Improve mobile responsiveness
