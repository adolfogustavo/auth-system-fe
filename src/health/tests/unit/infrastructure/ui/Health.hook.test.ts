import { renderHook, act } from '@testing-library/react';
import { useHealth } from '../../../../infrastructure/ui/Health.hook';
import { HealthUseCase } from '../../../../application/HealthUseCase';
import { InMemoryHealthRepository } from '../../../../domain/repositories/HealthRepository';
import { Health } from '../../../../domain/entities/Health';
import { Id } from '../../../../../shared/domain/value-objects/Id';

describe('The Health Status Hook', () => {
  const jan1At10am = new Date('2026-01-01T10:00:00.000Z');

  it('initializes with no data and idle state', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);

    const { result } = renderHook(() => useHealth(useCase));

    expect(result.current.health.isNone()).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
  });

  it('fetches health status when requested', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);
    const { result } = renderHook(() => useHealth(useCase));

    await act(async () => {
      await result.current.loadHealthStatus();
    });

    expect(result.current.health.isSome()).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('provides healthy status from health record', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    const repository = InMemoryHealthRepository.withHealth(health);
    const useCase = new HealthUseCase(repository);
    const { result } = renderHook(() => useHealth(useCase));

    await act(async () => {
      await result.current.loadHealthStatus();
    });

    expect(result.current.health.isSome()).toBe(true);
    const dto = result.current.health.getOrThrow();
    expect(dto.status).toBe('healthy');
  });

  it('captures error when health is not available', async () => {
    const repository = InMemoryHealthRepository.empty();
    const useCase = new HealthUseCase(repository);
    const { result } = renderHook(() => useHealth(useCase));

    await act(async () => {
      await result.current.loadHealthStatus();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow().message).toBe('Health status not available');
    expect(result.current.loading).toBe(false);
  });

  it('captures errors when repository fails', async () => {
    const failingRepository = {
      async find() {
        throw new Error('Network error');
      },
    };
    const useCase = new HealthUseCase(failingRepository);
    const { result } = renderHook(() => useHealth(useCase));

    await act(async () => {
      await result.current.loadHealthStatus();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow().message).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('clears previous error when retrying successfully', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    let callCount = 0;
    const repository = {
      async find() {
        callCount++;
        if (callCount === 1) {
          throw new Error('First error');
        }
        return InMemoryHealthRepository.withHealth(health).find();
      },
    };
    const useCase = new HealthUseCase(repository);
    const { result } = renderHook(() => useHealth(useCase));

    await act(async () => {
      await result.current.loadHealthStatus();
    });
    expect(result.current.error.isSome()).toBe(true);

    await act(async () => {
      await result.current.loadHealthStatus();
    });
    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.health.isSome()).toBe(true);
  });
});
