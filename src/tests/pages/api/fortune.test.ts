// src/tests/pages/api/fortune.test.ts
import { createMocks } from 'node-mocks-http';
import fortuneHandler from '@/pages/api/fortune';
import { CookiePersonality } from '@/utils/types';

describe('Fortune API', () => {
  test('returns a random cookie personality and message', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await fortuneHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());

    // Check for personality and message properties
    expect(data).toHaveProperty('personality');
    expect(data).toHaveProperty('message');

    // Verify personality has the required properties
    const personality = data.personality as CookiePersonality;
    expect(personality).toHaveProperty('id');
    expect(personality).toHaveProperty('name');
    expect(personality).toHaveProperty('emoji');
    expect(personality).toHaveProperty('messages');
    expect(personality).toHaveProperty('specialBehavior');

    // Verify message is a string
    expect(typeof data.message).toBe('string');
  });

  it('returns 405 for non-GET requests', () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    fortuneHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
