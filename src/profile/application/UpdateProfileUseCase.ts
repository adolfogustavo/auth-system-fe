import { Profile } from '../domain/entities/Profile';
import { ProfileRepository } from '../domain/repositories/ProfileRepository';
import { UpdateProfileDTO } from './dtos/UpdateProfileDTO';
import { ProfileDTO } from './dtos/ProfileDTO';
import { DomainError } from '../../shared/domain/DomainError';

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(name: string, lastName: string, phone: string): Promise<UpdateProfileDTO> {
    try {
      this.ensureAtLeastOneField(name, lastName, phone);
      const updated = await this.profileRepository.update({
        name,
        lastName,
        phone: phone || undefined,
      });
      return { success: true, profile: this.toDto(updated) };
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

  private ensureAtLeastOneField(name: string, lastName: string, phone: string): void {
    const hasNoFields = name === '' && lastName === '' && phone === '';
    if (hasNoFields) {
      throw DomainError.createValidation('At least one of name, lastName, or phone is required');
    }
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
