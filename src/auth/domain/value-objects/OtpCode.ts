import { DomainError } from '../../../shared/domain/DomainError';

export class OtpCode {
  private constructor(readonly value: string) {}

  static create(value: string): OtpCode {
    const sixDigitPattern = /^\d{6}$/;
    if (!sixDigitPattern.test(value)) {
      throw DomainError.createValidation('OTP must be 6 numeric digits');
    }
    return new OtpCode(value);
  }

  equals(other: OtpCode): boolean {
    return this.value === other.value;
  }
}
