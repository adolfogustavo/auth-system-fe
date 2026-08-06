import { Profile } from '../domain/entities/Profile';
import { ProfileRepository } from '../domain/repositories/ProfileRepository';
import { DomainError } from '../../shared/domain/DomainError';
import { GetProfileDTO } from './dtos/GetProfileDTO';
import { ProfileDTO } from './dtos/ProfileDTO';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(): Promise<GetProfileDTO> {
    try {
      const maybeProfile = await this.profileRepository.findCurrent();
      if (maybeProfile.isNone()) {
        return { success: false, error: 'Profile not found' };
      }
      return { success: true, profile: this.toDto(maybeProfile.getOrThrow()) };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (this.isSessionInvalid(error)) {
        return { success: false, error: message, sessionInvalid: true };
      }
      return { success: false, error: message };
    }
  }

  private isSessionInvalid(error: unknown): boolean {
    return error instanceof DomainError && error.message === 'Invalid or expired token';
  }

  private toDto(profile: Profile): ProfileDTO {
    const primitives = profile.toPrimitives();
    return {
      id: primitives.id,
      email: primitives.email,
      name: primitives.name ?? '',
      lastName: primitives.lastName ?? '',
      phone: primitives.phone ?? '',
      createdAt: primitives.createdAt,
    };
  }
}
