import { OtpCode } from '../../../domain/value-objects/OtpCode';

describe('The OtpCode', () => {
  it('creates code from valid 6 digit string', () => {
    const otp = OtpCode.create('123456');

    expect(otp.value).toBe('123456');
  });

  it('rejects empty string', () => {
    expect(() => OtpCode.create('')).toThrow('OTP must be 6 numeric digits');
  });

  it('rejects code with less than 6 digits', () => {
    expect(() => OtpCode.create('12345')).toThrow('OTP must be 6 numeric digits');
  });

  it('rejects code with more than 6 digits', () => {
    expect(() => OtpCode.create('1234567')).toThrow('OTP must be 6 numeric digits');
  });

  it('rejects code with non-numeric characters', () => {
    expect(() => OtpCode.create('12345a')).toThrow('OTP must be 6 numeric digits');
  });

  it('considers two codes with same value as equal', () => {
    const otp1 = OtpCode.create('123456');
    const otp2 = OtpCode.create('123456');

    expect(otp1.equals(otp2)).toBe(true);
  });
});
