import { UpdateProfileUseCase } from '../../../application/UpdateProfileUseCase';
import { InMemoryProfileRepository } from '../../../domain/repositories/ProfileRepository';
import { Profile } from '../../../domain/entities/Profile';

describe('The Profile Update', () => {
  const createdAt = '2024-01-01T00:00:00.000Z';

  function repositoryWithExistingProfile(): InMemoryProfileRepository {
    const profile = Profile.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'Jane',
      lastName: 'Doe',
      phone: '612345678',
      createdAt,
    });
    return InMemoryProfileRepository.withProfile(profile);
  }

  it('updates the profile with valid contact details', async () => {
    const useCase = new UpdateProfileUseCase(repositoryWithExistingProfile());

    const result = await useCase.execute('John', 'Smith', '699999999');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.profile.name).toBe('John');
      expect(result.profile.lastName).toBe('Smith');
      expect(result.profile.phone).toBe('699999999');
    }
  });

  it('rejects an update without any contact detail', async () => {
    const useCase = new UpdateProfileUseCase(repositoryWithExistingProfile());

    const result = await useCase.execute('', '', '');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('At least one of name, lastName, or phone is required');
    }
  });

  it('rejects an update with an invalid phone', async () => {
    const useCase = new UpdateProfileUseCase(repositoryWithExistingProfile());

    const result = await useCase.execute('John', 'Smith', '123');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid phone format');
    }
  });

  it('rejects an update when the profile is missing', async () => {
    const useCase = new UpdateProfileUseCase(InMemoryProfileRepository.empty());

    const result = await useCase.execute('John', 'Smith', '699999999');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Profile not found');
    }
  });
});
