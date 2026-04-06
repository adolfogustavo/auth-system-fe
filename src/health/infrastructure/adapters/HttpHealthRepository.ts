import { HealthRepository } from '../../domain/repositories/HealthRepository';
import { Health } from '../../domain/entities/Health';
import { Maybe } from '../../../shared/domain/Maybe';
import { HttpClient, HttpClientError } from '../../../shared/infrastructure/http/HttpClient';
import { Id } from '../../../shared/domain/value-objects/Id';
import { Endpoints } from '../../../shared/infrastructure/http/endpoints';

interface HealthResponse {
  id: string;
  status: 'healthy';
  createdAt: string;
  lastCheckedAt: string;
}

export class HttpHealthRepository implements HealthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async find(): Promise<Maybe<Health>> {
    try {
      const response = await this.httpClient.get<HealthResponse>(Endpoints.Health);
      const health = Health.create(
        Id.create(response.id),
        new Date(response.createdAt),
        new Date(response.lastCheckedAt)
      );
      return Maybe.some(health);
    } catch (error) {
      if (HttpClientError.isNotFoundError(error)) {
        return Maybe.none();
      }
      throw error;
    }
  }
}
