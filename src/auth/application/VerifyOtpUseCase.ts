import { AuthPort } from './ports/AuthPort';
import { Email } from '../domain/value-objects/Email';
import { OtpCode } from '../domain/value-objects/OtpCode';
import { VerifyOtpDTO } from './dtos/VerifyOtpDTO';

export class VerifyOtpUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(emailValue: string, otpValue: string): Promise<VerifyOtpDTO> {
    try {
      const email = Email.create(emailValue);
      const otp = OtpCode.create(otpValue);
      const token = await this.authPort.verifyOtp(email, otp);
      return { success: true, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }
}
