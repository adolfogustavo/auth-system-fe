import { HttpHealthRepository } from '../../infrastructure/adapters/HttpHealthRepository';
import { HttpClient } from '../../../shared/infrastructure/http/HttpClient';

/**
 * Integration tests for HttpHealthRepository.
 * These tests require the backend-template to be running on http://localhost:8080
 *
 * To run these tests:
 * 1. Start the backend: cd backend-template && npm run start
 * 2. Run integration tests: npm run test:integration
 *
 * Note: These tests are skipped by default in CI environments without a running backend.
 */
describe('The Health API Client', () => {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:8080';
  const httpClient = new HttpClient(baseUrl);
  const repository = new HttpHealthRepository(httpClient);

  const conditionalIt = process.env.CI ? it.skip : it;

  conditionalIt('retrieves health status from the backend', async () => {
    const result = await repository.find();

    expect(result.isSome()).toBe(true);
    const health = result.getOrThrow();
    const primitives = health.toPrimitives();
    expect(primitives.id).toBeDefined();
    expect(primitives.createdAt).toBeDefined();
    expect(primitives.lastCheckedAt).toBeDefined();
  });

  conditionalIt('throws error when backend is unreachable', async () => {
    const badClient = new HttpClient('http://localhost:9999');
    const badRepository = new HttpHealthRepository(badClient);

    await expect(badRepository.find()).rejects.toThrow();
  });

  conditionalIt('advances the last check timestamp on each request', async () => {
    const result1 = await repository.find();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const result2 = await repository.find();

    expect(result1.isSome()).toBe(true);
    expect(result2.isSome()).toBe(true);
    const health1 = result1.getOrThrow().toPrimitives();
    const health2 = result2.getOrThrow().toPrimitives();
    expect(health1.id).toBe(health2.id);
    expect(new Date(health2.lastCheckedAt).getTime()).toBeGreaterThanOrEqual(new Date(health1.lastCheckedAt).getTime());
  });
});
