import { AuthPort } from './ports/AuthPort';
import { Email } from '../domain/value-objects/Email';
import { RequestOtpDTO } from './dtos/RequestOtpDTO';

export class RequestOtpUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(emailValue: string): Promise<RequestOtpDTO> {
    try {
      const email = Email.create(emailValue);
      await this.authPort.requestOtp(email);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
