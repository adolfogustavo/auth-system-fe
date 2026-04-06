import { HttpClient } from './http/HttpClient';
import { HealthRepository } from '../../health/domain/repositories/HealthRepository';
import { HttpHealthRepository } from '../../health/infrastructure/adapters/HttpHealthRepository';
import { HealthUseCase } from '../../health/application/HealthUseCase';

export class Factory {
  private static readonly apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
  private static httpClient: HttpClient | null = null;
  private static healthRepository: HealthRepository | null = null;

  static getHttpClient(): HttpClient {
    if (!this.httpClient) {
      this.httpClient = new HttpClient(this.apiBaseUrl);
    }
    return this.httpClient;
  }

  static getHealthRepository(): HealthRepository {
    if (!this.healthRepository) {
      this.healthRepository = new HttpHealthRepository(this.getHttpClient());
    }
    return this.healthRepository;
  }

  static createHealthUseCase(): HealthUseCase {
    return new HealthUseCase(this.getHealthRepository());
  }
}
