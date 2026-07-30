import { Email } from '../../domain/value-objects/Email';
import { OtpCode } from '../../domain/value-objects/OtpCode';

export interface RegisteredUser {
  id: string;
  email: string;
}

export interface AuthPort {
  register(email: Email): Promise<RegisteredUser>;
  requestOtp(email: Email): Promise<void>;
  verifyOtp(email: Email, otp: OtpCode): Promise<string>;
}
