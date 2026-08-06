import { TokenPort } from '../../shared/application/ports/TokenPort';
import { JwtToken } from '../domain/value-objects/JwtToken';
import { ValidateSessionDTO } from './dtos/ValidateSessionDTO';

export class ValidateSessionUseCase {
  constructor(private readonly tokenPort: TokenPort) {}

  execute(): ValidateSessionDTO {
    const maybeToken = this.tokenPort.getToken();
    if (maybeToken.isNone()) {
      return { isValid: false };
    }
    try {
      const jwtToken = JwtToken.create(maybeToken.getOrThrow());
      if (jwtToken.isExpired()) {
        this.tokenPort.clearToken();
        return { isValid: false };
      }
      return { isValid: true };
    } catch {
      this.tokenPort.clearToken();
      return { isValid: false };
    }
  }
}
