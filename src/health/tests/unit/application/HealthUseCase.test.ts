import { HealthUseCase } from '../../../application/HealthUseCase';
import { InMemoryHealthRepository } from '../../../domain/repositories/HealthRepository';
import { Health } from '../../../domain/entities/Health';
import { Id } from '../../../../shared/domain/value-objects/Id';

describe('The Health Check', () => {
  const jan1At10am = new Date('2026-01-01T10:00:00.000Z');
  const jan1At10am5min = new Date('2026-01-01T10:05:00.000Z');

  it('reports the system as healthy when health is available', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    const result = await useCase.execute();

    expect(result.status).toBe('healthy');
  });

  it('throws error when health is not available', async () => {
    const repository = InMemoryHealthRepository.empty();
    const useCase = new HealthUseCase(repository);

    await expect(useCase.execute()).rejects.toThrow('Health status not available');
  });

  it('returns the health id from the repository', async () => {
    const id = Id.generate();
    const health = Health.create(id, jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    const result = await useCase.execute();

    expect(result.id).toBe(id.value);
  });

  it('includes formatted uptime in the response', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am5min);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    const result = await useCase.execute();

    expect(result.formattedUptime).toBe('5m 0s');
  });

  it('includes formatted timestamps in the response', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    const result = await useCase.execute();

    expect(result.formattedCreatedAt).toBeDefined();
    expect(result.formattedLastCheckedAt).toBeDefined();
  });
});
