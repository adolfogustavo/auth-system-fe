import { renderHook, act } from '@testing-library/react';
import { useProfile, useLogout } from '../../../../infrastructure/ui/Profile.hook';
import { GetProfileUseCase } from '../../../../application/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../../../application/UpdateProfileUseCase';
import { LogoutUseCase } from '../../../../../auth/application/LogoutUseCase';
import { InMemoryProfileRepository } from '../../../../domain/repositories/ProfileRepository';
import { Profile } from '../../../../domain/entities/Profile';
import { TokenPort } from '../../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../../shared/domain/Maybe';
import { DomainError } from '../../../../../shared/domain/DomainError';

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

function repositoryWithJaneDoeProfile(): InMemoryProfileRepository {
  return InMemoryProfileRepository.withProfile(janeDoeProfile());
}

function profileEditingHook(repository: InMemoryProfileRepository) {
  const getUseCase = new GetProfileUseCase(repository);
  const updateUseCase = new UpdateProfileUseCase(repository);
  return renderHook(() => useProfile(getUseCase, updateUseCase));
}

function tokenPortWithSession(initialToken?: string): TokenPort {
  let token: Maybe<string> = initialToken ? Maybe.some(initialToken) : Maybe.none();
  return {
    saveToken(value: string) {
      token = Maybe.some(value);
    },
    getToken() {
      return token;
    },
    clearToken() {
      token = Maybe.none();
    },
  };
}

describe('The Profile Editing', () => {
  it('starts without a loaded profile', () => {
    const { result } = profileEditingHook(InMemoryProfileRepository.empty());

    expect(result.current.profile.isNone()).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.saving).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('loads the profile and prefills the editable fields', async () => {
    const { result } = profileEditingHook(repositoryWithJaneDoeProfile());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.profile.isSome()).toBe(true);
    expect(result.current.name).toBe('Jane');
    expect(result.current.lastName).toBe('Doe');
    expect(result.current.phone).toBe('612345678');
    expect(result.current.profile.getOrThrow().email).toBe('user@example.com');
    expect(result.current.loading).toBe(false);
  });

  it('reports an error when the profile is missing', async () => {
    const { result } = profileEditingHook(InMemoryProfileRepository.empty());

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Profile not found');
    expect(result.current.profile.isNone()).toBe(true);
    expect(result.current.sessionInvalid).toBe(false);
  });

  it('flags an invalid session when loading fails for an expired token', async () => {
    const repository = {
      async findCurrent() {
        throw DomainError.create('Invalid or expired token');
      },
      async update() {
        throw DomainError.create('Unused');
      },
    };
    const getUseCase = new GetProfileUseCase(repository);
    const updateUseCase = new UpdateProfileUseCase(repositoryWithJaneDoeProfile());
    const { result } = renderHook(() => useProfile(getUseCase, updateUseCase));

    await act(async () => {
      await result.current.loadProfile();
    });

    expect(result.current.sessionInvalid).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Invalid or expired token');
  });

  it('keeps the editable fields in sync while typing', () => {
    const { result } = profileEditingHook(repositoryWithJaneDoeProfile());

    act(() => {
      result.current.setName('John');
      result.current.setLastName('Smith');
      result.current.setPhone('699999999');
    });

    expect(result.current.name).toBe('John');
    expect(result.current.lastName).toBe('Smith');
    expect(result.current.phone).toBe('699999999');
  });

  it('saves valid contact details successfully', async () => {
    const { result } = profileEditingHook(repositoryWithJaneDoeProfile());

    await act(async () => {
      await result.current.loadProfile();
    });
    act(() => {
      result.current.setName('John');
      result.current.setLastName('Smith');
      result.current.setPhone('699999999');
    });
    await act(async () => {
      await result.current.saveProfile();
    });

    expect(result.current.success).toBe(true);
    expect(result.current.saving).toBe(false);
    expect(result.current.profile.getOrThrow().name).toBe('John');
    expect(result.current.name).toBe('John');
  });

  it('reports an error when saving an invalid phone', async () => {
    const { result } = profileEditingHook(repositoryWithJaneDoeProfile());

    await act(async () => {
      await result.current.loadProfile();
    });
    act(() => {
      result.current.setPhone('123');
    });
    await act(async () => {
      await result.current.saveProfile();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Invalid phone format');
    expect(result.current.success).toBe(false);
  });
});

describe('The Session Logout', () => {
  it('starts without a completed logout', () => {
    const useCase = new LogoutUseCase(tokenPortWithSession('jwt-token'));

    const { result } = renderHook(() => useLogout(useCase));

    expect(result.current.success).toBe(false);
  });

  it('clears the session token after logout', () => {
    const tokenPort = tokenPortWithSession('jwt-token');
    const useCase = new LogoutUseCase(tokenPort);
    const { result } = renderHook(() => useLogout(useCase));

    act(() => {
      result.current.logout();
    });

    expect(result.current.success).toBe(true);
    expect(tokenPort.getToken().isNone()).toBe(true);
  });
});
