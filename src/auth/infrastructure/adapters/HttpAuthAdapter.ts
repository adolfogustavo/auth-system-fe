import { AuthPort, RegisteredUser } from '../../application/ports/AuthPort';
import { Email } from '../../domain/value-objects/Email';
import { OtpCode } from '../../domain/value-objects/OtpCode';
import { HttpClient } from '../../../shared/infrastructure/http/HttpClient';
import { Endpoints } from '../../../shared/infrastructure/http/endpoints';

interface RegisterResponse {
  id: string;
  email: string;
}

interface LoginResponse {
  message: string;
}

interface VerifyResponse {
  token: string;
}

export class HttpAuthAdapter implements AuthPort {
  constructor(private readonly httpClient: HttpClient) {}

  async register(email: Email): Promise<RegisteredUser> {
    return this.httpClient.post<RegisterResponse>(Endpoints.AuthRegister, {
      email: email.value,
    });
  }

  async requestOtp(email: Email): Promise<void> {
    await this.httpClient.post<LoginResponse>(Endpoints.AuthLogin, {
      email: email.value,
    });
  }

  async verifyOtp(email: Email, otp: OtpCode): Promise<string> {
    const response = await this.httpClient.post<VerifyResponse>(Endpoints.AuthVerify, {
      email: email.value,
      otp: otp.value,
    });
    return response.token;
  }
}
