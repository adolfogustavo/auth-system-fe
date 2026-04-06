import { Health } from '../domain/entities/Health';
import { HealthRepository } from '../domain/repositories/HealthRepository';
import { HealthDTO } from './HealthDTO';
import { DomainError } from '../../shared/domain/DomainError';

export class HealthUseCase {
  constructor(private readonly healthRepository: HealthRepository) {}

  async execute(): Promise<HealthDTO> {
    const maybeHealth = await this.healthRepository.find();
    return maybeHealth.fold(
      () => {
        throw DomainError.createNotFound('Health status not available');
      },
      (health) => this.toDto(health)
    );
  }

  private toDto(health: Health): HealthDTO {
    const primitives = health.toPrimitives();
    return {
      id: primitives.id,
      status: 'healthy',
      formattedCreatedAt: health.formattedCreatedAt(),
      formattedLastCheckedAt: health.formattedLastCheckedAt(),
      formattedUptime: health.formattedUptime(),
    };
  }
}
