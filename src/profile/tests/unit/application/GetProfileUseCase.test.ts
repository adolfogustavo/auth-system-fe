import { GetProfileUseCase } from '../../../application/GetProfileUseCase';
import { InMemoryProfileRepository } from '../../../domain/repositories/ProfileRepository';
import { Profile } from '../../../domain/entities/Profile';

describe('The Profile Retrieval', () => {
  const createdAt = '2024-01-01T00:00:00.000Z';

  function repositoryWithJaneDoeProfile(): InMemoryProfileRepository {
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

  function repositoryWithEmptyContactDetails(): InMemoryProfileRepository {
    const profile = Profile.fromPrimitives({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: null,
      lastName: null,
      phone: null,
      createdAt,
    });
    return InMemoryProfileRepository.withProfile(profile);
  }

  it('provides the authenticated user profile', async () => {
    const useCase = new GetProfileUseCase(repositoryWithJaneDoeProfile());

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.profile).toEqual({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        name: 'Jane',
        lastName: 'Doe',
        phone: '612345678',
        createdAt,
      });
    }
  });

  it('reports when the profile is missing', async () => {
    const useCase = new GetProfileUseCase(InMemoryProfileRepository.empty());

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Profile not found');
    }
  });

  it('presents absent contact details as empty fields', async () => {
    const useCase = new GetProfileUseCase(repositoryWithEmptyContactDetails());

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.profile.name).toBe('');
      expect(result.profile.lastName).toBe('');
      expect(result.profile.phone).toBe('');
    }
  });
});
