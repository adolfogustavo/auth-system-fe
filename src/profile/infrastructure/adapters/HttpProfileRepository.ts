import { ProfileRepository } from '../../domain/repositories/ProfileRepository';
import { Profile, ProfileUpdateParams } from '../../domain/entities/Profile';
import { Maybe } from '../../../shared/domain/Maybe';
import { HttpClient, HttpClientError } from '../../../shared/infrastructure/http/HttpClient';
import { TokenPort } from '../../../shared/application/ports/TokenPort';
import { Endpoints } from '../../../shared/infrastructure/http/endpoints';
import { DomainError } from '../../../shared/domain/DomainError';

interface ProfileResponse {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export class HttpProfileRepository implements ProfileRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly tokenPort: TokenPort
  ) {}

  async findCurrent(): Promise<Maybe<Profile>> {
    try {
      const response = await this.httpClient.get<ProfileResponse>(Endpoints.ProfileMe, {
        headers: this.authorizationHeader(),
      });
      return Maybe.some(this.toDomain(response));
    } catch (error) {
      if (HttpClientError.isNotFoundError(error)) {
        return Maybe.none();
      }
      this.rethrowAfterUnauthorized(error);
    }
  }

  async update(data: ProfileUpdateParams): Promise<Profile> {
    try {
      const response = await this.httpClient.put<ProfileResponse>(Endpoints.ProfileMe, data, {
        headers: this.authorizationHeader(),
      });
      return this.toDomain(response);
    } catch (error) {
      this.rethrowAfterUnauthorized(error);
    }
  }

  private rethrowAfterUnauthorized(error: unknown): never {
    if (HttpClientError.isUnauthorizedError(error)) {
      this.tokenPort.clearToken();
      throw DomainError.create('Invalid or expired token');
    }
    throw error;
  }

  private authorizationHeader(): Record<string, string> {
    return this.tokenPort.getToken().fold(
      () => {
        throw DomainError.create('Authorization token required');
      },
      (token) => ({ Authorization: `Bearer ${token}` })
    );
  }

  private toDomain(response: ProfileResponse): Profile {
    return Profile.fromPrimitives({
      id: response.id,
      email: response.email,
      name: response.name,
      lastName: response.lastName,
      phone: response.phone,
      createdAt: response.createdAt,
    });
  }
}
