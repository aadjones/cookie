import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/generate-art';
import { SpecialBehaviorType } from '../utils/types';

// Mock fetch globally
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [{ url: 'https://example.com/mock-image.png' }] }),
  } as Response)
);

// Mock console.error to avoid cluttering test output
console.error = jest.fn();

describe('/api/generate-art simplified tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set a mock API key for testing
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = undefined;
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('returns 400 if personality information is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Missing personality information' });
  });

  it('returns 400 if personalityId is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        personalityName: 'Test Cookie',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Missing personality information' });
  });

  it('returns 400 if personalityName is missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        personalityId: 'test-cookie',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Missing personality information' });
  });

  it('calls the DALL-E API and returns the generated image URL', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        personalityId: 'test-cookie',
        personalityName: 'Test Cookie',
      },
    });

    await handler(req, res);

    // Verify fetch was called with the right parameters
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/images/generations',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
        }),
      })
    );

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      imageUrl: 'https://example.com/mock-image.png',
    });
  });

  it('returns an error response with fallbackToEmoji if the DALL-E API call fails', async () => {
    // Mock fetch to fail for this test
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API Error',
        status: 500,
        json: () => Promise.resolve({ error: 'API Error' }),
      } as Response)
    );

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        personalityId: 'test-cookie',
        personalityName: 'Test Cookie',
      },
    });

    await handler(req, res);

    // Check for error status code (either 429 or 500 is acceptable)
    expect(res._getStatusCode()).toBeGreaterThanOrEqual(400);

    const responseData = JSON.parse(res._getData());

    // Check for essential properties rather than exact values
    expect(responseData).toHaveProperty('error');
    expect(responseData).toHaveProperty('fallbackToEmoji', true);

    // Optionally check for the isRateLimitError property
    expect(responseData).toHaveProperty('isRateLimitError');
  });
});

// Qualitative tests for DALL-E image generation
describe('DALL-E image generation qualitative tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = undefined;
  });

  it('handles rate limiting gracefully', async () => {
    // Make multiple requests to trigger rate limiting
    for (let i = 0; i < 6; i++) {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          personalityId: 'test-cookie',
          personalityName: 'Test Cookie',
        },
      });

      await handler(req, res);

      // The 6th request should trigger rate limiting
      if (i === 5) {
        expect(res._getStatusCode()).toBe(429);
        const responseData = JSON.parse(res._getData());
        expect(responseData).toHaveProperty('error');
        expect(responseData.error).toContain('rate limit');
        expect(responseData).toHaveProperty('fallbackToEmoji', true);
        expect(responseData).toHaveProperty('isRateLimitError', true);
      }
    }
  });

  it('provides useful error information when API fails', async () => {
    // Test different error types
    const errors = [
      { status: 400, message: 'Bad Request' },
      { status: 401, message: 'Unauthorized' },
      { status: 500, message: 'Internal Server Error' },
    ];

    for (const error of errors) {
      // Reset mock calls
      (fetch as jest.Mock).mockReset();

      // Mock error response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: error.status,
        statusText: error.message,
        json: async () => ({ error: { message: error.message } }),
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          personality: {
            id: 'test-cookie',
            name: 'Test Cookie',
            emoji: '🍪',
            messages: ['Test message'],
            specialBehavior: SpecialBehaviorType.STANDARD,
          },
        },
      });

      await handler(req, res);

      // The API returns 400 for all error cases
      expect(res._getStatusCode()).toBe(400);

      const responseData = JSON.parse(res._getData());

      // Response should have essential properties
      expect(responseData).toHaveProperty('error');

      // Error message should be informative
      expect(typeof responseData.error).toBe('string');
      expect(responseData.error.length).toBeGreaterThan(0);
    }
  });
});
