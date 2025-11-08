import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

const mockReport = {
  status: 'ok' as const,
  timestamp: new Date().toISOString(),
  dependencies: {
    database: 'up' as const,
    redis: 'unknown' as const,
    elasticsearch: 'unknown' as const,
    ollama: 'unknown' as const
  }
};

vi.mock('../services/health.service', () => ({
  getHealthReport: vi.fn().mockResolvedValue(mockReport)
}));

import { app } from '../app';

/**
 * Basic sanity test for the health endpoint. It verifies that the route is
 * reachable and returns a JSON payload containing the expected top-level keys.
 */
describe('GET /api/v1/health', () => {
  it('responds with the mocked health payload', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(mockReport);

    const allowedStatuses = ['up', 'down', 'unknown'];
    Object.values(response.body.dependencies).forEach((value: string) => {
      expect(allowedStatuses).toContain(value);
    });
  });
});

