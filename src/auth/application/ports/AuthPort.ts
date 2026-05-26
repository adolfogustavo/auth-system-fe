import { Email } from '../../domain/value-objects/Email';
import { OtpCode } from '../../domain/value-objects/OtpCode';

export interface AuthPort {
  requestOtp(email: Email): Promise<void>;
  verifyOtp(email: Email, otp: OtpCode): Promise<string>;
}
