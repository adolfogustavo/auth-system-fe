import { HealthRepository, InMemoryHealthRepository } from '../../health/domain/repositories/HealthRepository';
import { HealthUseCase } from '../../health/application/HealthUseCase';
import { Health } from '../../health/domain/entities/Health';
import { Id } from '../domain/value-objects/Id';

export class Factory {
  private static healthRepository?: HealthRepository;

  static getHealthRepository(): HealthRepository {
    if (!this.healthRepository) {
      const now = new Date();
      const initialHealth = Health.create(Id.generate(), now, now);
      this.healthRepository = InMemoryHealthRepository.withHealth(initialHealth);
    }
    return this.healthRepository;
  }

  static createHealthUseCase(): HealthUseCase {
    return new HealthUseCase(this.getHealthRepository());
  }
}
