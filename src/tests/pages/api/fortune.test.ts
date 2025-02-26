// src/tests/pages/api/fortune.test.ts
import { createMocks } from 'node-mocks-http';
import fortuneHandler from '@/pages/api/fortune';

describe('Fortune API', () => {
  test('returns a random fortune', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await fortuneHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('fortune');
    expect(typeof data.fortune).toBe('string');
  });

  it('returns 405 for non-GET requests', () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    fortuneHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
