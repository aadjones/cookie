// src/tests/cookiePersonalities.test.tsx
import { cookiePersonalities, getRandomCookiePersonality, getRandomMessage } from '../utils/cookieData';
import { SpecialBehaviorType } from '../utils/types';

describe('Cookie Personalities', () => {
  test('should have all required cookie personalities', () => {
    // Check that we have all the required personalities
    const personalityNames = cookiePersonalities.map((p) => p.name);

    expect(personalityNames).toContain('Toxic Positivity Cookie');
    expect(personalityNames).toContain('Error Cookie');
    expect(personalityNames).toContain('Conspiracy Cookie');
    expect(personalityNames).toContain('Actuarial Cookie');
    expect(personalityNames).toContain('Misfortune Cookie');
    expect(personalityNames).toContain('Matryoshka Cookie');
    expect(personalityNames).toContain('Gaslighting Cookie');
    expect(personalityNames).toContain('Quantum Cookie');
    expect(personalityNames).toContain('Apathetic Cookie');
    expect(personalityNames).toContain('Genuinely Insightful Cookie');
  });

  test('each personality should have required properties', () => {
    cookiePersonalities.forEach((personality) => {
      expect(personality).toHaveProperty('id');
      expect(personality).toHaveProperty('name');
      expect(personality).toHaveProperty('emoji');
      expect(personality).toHaveProperty('messages');
      expect(personality).toHaveProperty('specialBehavior');

      // Check that messages is an array
      expect(Array.isArray(personality.messages)).toBe(true);
    });
  });

  test('getRandomCookiePersonality should return a valid personality', () => {
    const personality = getRandomCookiePersonality();
    expect(cookiePersonalities).toContain(personality);
  });

  test('getRandomMessage should return a message from the personality', () => {
    // Test with a personality that has messages
    const personality = cookiePersonalities.find(
      (p) => p.messages.length > 0 && p.specialBehavior === SpecialBehaviorType.STANDARD
    );
    if (personality) {
      const message = getRandomMessage(personality);
      expect(personality.messages).toContain(message);
    }
  });

  test('special behavior cookies should have the correct behavior type', () => {
    const matryoshka = cookiePersonalities.find((p) => p.id === 'matryoshka');
    expect(matryoshka?.specialBehavior).toBe(SpecialBehaviorType.MATRYOSHKA);

    const quantum = cookiePersonalities.find((p) => p.id === 'quantum');
    expect(quantum?.specialBehavior).toBe(SpecialBehaviorType.QUANTUM);

    const apathetic = cookiePersonalities.find((p) => p.id === 'apathetic');
    expect(apathetic?.specialBehavior).toBe(SpecialBehaviorType.APATHETIC);
  });

  test('quantum cookie should return paired messages', () => {
    // Get the quantum cookie
    const quantum = cookiePersonalities.find((p) => p.id === 'quantum');
    expect(quantum).toBeDefined();

    if (quantum) {
      // Define the expected pairs
      const expectedPairs = [
        `${quantum.messages[0]} / ${quantum.messages[1]}`, // "Your outlook is good / Your outlook is not so good"
        `${quantum.messages[2]} / ${quantum.messages[3]}`, // "There is no cookie / There is no you"
      ];

      // Run the test multiple times to increase confidence
      for (let i = 0; i < 20; i++) {
        const message = getRandomMessage(quantum);

        // Verify that the message contains a slash separator
        expect(message).toContain(' / ');

        // The message should be one of the expected pairs
        expect(expectedPairs).toContain(message);
      }
    }
  });
});
