import { HttpClient } from './http/HttpClient';
import { HealthRepository } from '../../health/domain/repositories/HealthRepository';
import { HttpHealthRepository } from '../../health/infrastructure/adapters/HttpHealthRepository';
import { HealthUseCase } from '../../health/application/HealthUseCase';
import { AuthPort } from '../../auth/application/ports/AuthPort';
import { HttpAuthAdapter } from '../../auth/infrastructure/adapters/HttpAuthAdapter';
import { RequestOtpUseCase } from '../../auth/application/RequestOtpUseCase';
import { RegisterUserUseCase } from '../../auth/application/RegisterUserUseCase';
import { VerifyOtpUseCase } from '../../auth/application/VerifyOtpUseCase';
import { LogoutUseCase } from '../../auth/application/LogoutUseCase';
import { TokenPort } from '../application/ports/TokenPort';
import { LocalStorageTokenAdapter } from './adapters/LocalStorageTokenAdapter';
import { ProfileRepository } from '../../profile/domain/repositories/ProfileRepository';
import { HttpProfileRepository } from '../../profile/infrastructure/adapters/HttpProfileRepository';
import { GetProfileUseCase } from '../../profile/application/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../profile/application/UpdateProfileUseCase';

export class Factory {
  private static readonly apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
  private static httpClient?: HttpClient;
  private static healthRepository?: HealthRepository;
  private static profileRepository?: ProfileRepository;
  private static authPort?: AuthPort;
  private static tokenPort?: TokenPort;

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

  static getAuthPort(): AuthPort {
    if (!this.authPort) {
      this.authPort = new HttpAuthAdapter(this.getHttpClient());
    }
    return this.authPort;
  }

  static getTokenPort(): TokenPort {
    if (!this.tokenPort) {
      this.tokenPort = new LocalStorageTokenAdapter();
    }
    return this.tokenPort;
  }

  static createRegisterUserUseCase(): RegisterUserUseCase {
    return new RegisterUserUseCase(this.getAuthPort());
  }

  static createRequestOtpUseCase(): RequestOtpUseCase {
    return new RequestOtpUseCase(this.getAuthPort());
  }

  static createVerifyOtpUseCase(): VerifyOtpUseCase {
    return new VerifyOtpUseCase(this.getAuthPort());
  }

  static createLogoutUseCase(): LogoutUseCase {
    return new LogoutUseCase(this.getTokenPort());
  }

  static getProfileRepository(): ProfileRepository {
    if (!this.profileRepository) {
      this.profileRepository = new HttpProfileRepository(this.getHttpClient(), this.getTokenPort());
    }
    return this.profileRepository;
  }

  static createGetProfileUseCase(): GetProfileUseCase {
    return new GetProfileUseCase(this.getProfileRepository());
  }

  static createUpdateProfileUseCase(): UpdateProfileUseCase {
    return new UpdateProfileUseCase(this.getProfileRepository());
  }
}
