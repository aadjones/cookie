import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/generate-fortune';
import { CookiePersonality, SpecialBehaviorType } from '../utils/types';

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: false,
    status: 500,
    json: async () => ({ error: 'API error' }),
  });
});

// Suppress console output during tests
console.error = jest.fn();
console.warn = jest.fn();

// Mock the aiPromptTemplates module
jest.mock('../utils/aiPromptTemplates', () => ({
  getPromptTemplateForPersonality: jest.fn().mockImplementation((personalityId) => {
    return {
      personalityId,
      systemPrompt: 'Test system prompt',
      userPrompt: 'Test user prompt',
    };
  }),
}));

describe('/api/generate-fortune - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set a mock API key for all tests
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterAll(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it('handles API errors gracefully', async () => {
    const personality: CookiePersonality = {
      id: 'toxic-positivity',
      name: 'Toxic Positivity Cookie',
      emoji: '🌈',
      messages: [
        'Your coffee may be cold and your WiFi weak, but remember: every spilled latte is a chance to remake your world into a rainbow of possibilities!',
      ],
      specialBehavior: SpecialBehaviorType.STANDARD,
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: { personality },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('AI-generated fortunes are currently unavailable. Please try again later.');
  });
});
