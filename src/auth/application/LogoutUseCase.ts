import { TokenPort } from '../../shared/application/ports/TokenPort';
import { LogoutDTO } from './dtos/LogoutDTO';

export class LogoutUseCase {
  constructor(private readonly tokenPort: TokenPort) {}

  execute(): LogoutDTO {
    this.tokenPort.clearToken();
    return { success: true };
  }
}
