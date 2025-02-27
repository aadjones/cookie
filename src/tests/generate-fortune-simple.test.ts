import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/generate-fortune';
import { CookiePersonality, MessageGenerationMode, SpecialBehaviorType } from '../utils/types';

// Simplify by just mocking the fetch function at the global level
global.fetch = jest.fn();

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

describe('/api/generate-fortune - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the fetch mock
    (global.fetch as jest.Mock).mockReset();
    // Set a mock API key for all tests
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterAll(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Method Not Allowed' });
  });

  it('returns 400 if personality is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Missing personality data' });
  });

  it('handles Matryoshka cookies correctly', async () => {
    const personality: CookiePersonality = {
      id: 'matryoshka',
      name: 'Matryoshka Cookie',
      emoji: '🪆',
      messages: [''],
      specialBehavior: SpecialBehaviorType.MATRYOSHKA,
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: { personality },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('');
  });

  it('handles Apathetic cookies correctly', async () => {
    const personality: CookiePersonality = {
      id: 'apathetic',
      name: 'Apathetic Cookie',
      emoji: '😑',
      messages: [''],
      specialBehavior: SpecialBehaviorType.APATHETIC,
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: { personality },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(['', '...', 'whatever', 'meh']).toContain(data.message);
  });

  it('returns fallback message when API key is missing', async () => {
    // Temporarily remove API key
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const personality: CookiePersonality = {
      id: 'standard',
      name: 'Standard Cookie',
      emoji: '🍪',
      messages: ['A standard message'],
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

    // Restore API key
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  it('calls OpenAI API for standard cookies', async () => {
    // Mock a successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'This is a generated message!',
            },
          },
        ],
      }),
    });

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
    expect(data.message).toBe('This is a generated message!');
    expect(data.generationMode).toBe(MessageGenerationMode.AI_GENERATED);

    // Verify the API was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles Quantum cookies correctly', async () => {
    // Mock a successful API response with two parts
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: 'Positive message\nNegative message',
            },
          },
        ],
      }),
    });

    const personality: CookiePersonality = {
      id: 'quantum',
      name: 'Quantum Cookie',
      emoji: '⚛️',
      messages: ['Your outlook is good', 'Your outlook is not so good'],
      specialBehavior: SpecialBehaviorType.QUANTUM,
    };

    const { req, res } = createMocks({
      method: 'POST',
      body: { personality },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Positive message / Negative message');
    expect(data.generationMode).toBe(MessageGenerationMode.AI_GENERATED);

    // Verify the API was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
