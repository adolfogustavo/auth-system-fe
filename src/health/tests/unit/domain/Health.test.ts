import { Health } from '../../../domain/entities/Health';
import { Id } from '../../../../shared/domain/value-objects/Id';

describe('The Health', () => {
  const jan1At10am = new Date('2026-01-01T10:00:00.000Z');
  const jan1At10am5min = new Date('2026-01-01T10:05:00.000Z');
  const fiveMinutesInSeconds = 300;

  it('preserves the provided id and timestamps', () => {
    const id = Id.generate();

    const health = Health.create(id, jan1At10am, jan1At10am5min);
    const primitives = health.toPrimitives();

    expect(primitives.id).toBe(id.value);
    expect(primitives.createdAt).toBe(jan1At10am.toISOString());
    expect(primitives.lastCheckedAt).toBe(jan1At10am5min.toISOString());
  });

  it('rejects creation when last check is before creation time', () => {
    expect(() => Health.create(Id.generate(), jan1At10am5min, jan1At10am)).toThrow(
      'lastCheckedAt cannot be before createdAt'
    );
  });

  it('advances the last check timestamp on update', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);

    health.update(jan1At10am5min);
    const primitives = health.toPrimitives();

    expect(primitives.createdAt).toBe(jan1At10am.toISOString());
    expect(primitives.lastCheckedAt).toBe(jan1At10am5min.toISOString());
  });

  it('rejects updates that would set last check before creation time', () => {
    const health = Health.create(Id.generate(), jan1At10am5min, jan1At10am5min);

    expect(() => health.update(jan1At10am)).toThrow('lastCheckedAt cannot be before createdAt');
  });

  it('calculates uptime as the difference between creation and last check', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am5min);

    expect(health.uptime()).toBe(fiveMinutesInSeconds);
  });

  it('reports zero uptime when last check equals creation time', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);

    expect(health.uptime()).toBe(0);
  });

  it('considers two health records with same id and timestamps as equal', () => {
    const id = Id.generate();
    const health1 = Health.create(id, jan1At10am, jan1At10am5min);
    const health2 = Health.create(id, jan1At10am, jan1At10am5min);

    expect(health1.equals(health2)).toBe(true);
  });

  it('considers health records with different ids as distinct', () => {
    const health1 = Health.create(Id.generate(), jan1At10am, jan1At10am5min);
    const health2 = Health.create(Id.generate(), jan1At10am, jan1At10am5min);

    expect(health1.equals(health2)).toBe(false);
  });

  it('considers health records with different creation times as distinct', () => {
    const id = Id.generate();
    const health1 = Health.create(id, jan1At10am, jan1At10am5min);
    const health2 = Health.create(id, jan1At10am5min, jan1At10am5min);

    expect(health1.equals(health2)).toBe(false);
  });

  it('considers health records with different last check times as distinct', () => {
    const id = Id.generate();
    const health1 = Health.create(id, jan1At10am, jan1At10am);
    const health2 = Health.create(id, jan1At10am, jan1At10am5min);

    expect(health1.equals(health2)).toBe(false);
  });

  it('formats uptime in seconds when less than a minute', () => {
    const createdAt = new Date('2026-01-01T10:00:00.000Z');
    const lastCheckedAt = new Date('2026-01-01T10:00:45.000Z');
    const health = Health.create(Id.generate(), createdAt, lastCheckedAt);

    expect(health.formattedUptime()).toBe('45s');
  });

  it('formats uptime in minutes and seconds when less than an hour', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am5min);

    expect(health.formattedUptime()).toBe('5m 0s');
  });

  it('formats uptime in hours and minutes when an hour or more', () => {
    const createdAt = new Date('2026-01-01T10:00:00.000Z');
    const lastCheckedAt = new Date('2026-01-01T12:30:00.000Z');
    const health = Health.create(Id.generate(), createdAt, lastCheckedAt);

    expect(health.formattedUptime()).toBe('2h 30m');
  });

  it('formats zero uptime as 0s', () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);

    expect(health.formattedUptime()).toBe('0s');
  });
});
