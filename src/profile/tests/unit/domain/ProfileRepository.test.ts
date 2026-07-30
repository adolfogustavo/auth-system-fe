import { Profile } from '../../../domain/entities/Profile';
import { InMemoryProfileRepository } from '../../../domain/repositories/ProfileRepository';

describe('The Profile Repository', () => {
  const createdAt = '2024-01-01T00:00:00.000Z';

  function janeDoeProfile(): Profile {
    return Profile.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'Jane',
      lastName: 'Doe',
      phone: '612345678',
      createdAt,
    });
  }

  it('provides the current profile when one exists', async () => {
    const profile = janeDoeProfile();
    const repository = InMemoryProfileRepository.withProfile(profile);

    const current = await repository.findCurrent();

    expect(current.isSome()).toBe(true);
    expect(current.getOrThrow().toPrimitives()).toEqual(profile.toPrimitives());
  });

  it('has no current profile when empty', async () => {
    const repository = InMemoryProfileRepository.empty();

    const current = await repository.findCurrent();

    expect(current.isNone()).toBe(true);
  });

  it('persists updates to the current profile', async () => {
    const repository = InMemoryProfileRepository.withProfile(janeDoeProfile());

    const updated = await repository.update({
      name: 'John',
      lastName: 'Smith',
      phone: '699999999',
    });

    expect(updated.toPrimitives().name).toBe('John');
    expect(updated.toPrimitives().lastName).toBe('Smith');
    expect(updated.toPrimitives().phone).toBe('699999999');
    const current = await repository.findCurrent();
    expect(current.getOrThrow().toPrimitives().name).toBe('John');
  });
});
