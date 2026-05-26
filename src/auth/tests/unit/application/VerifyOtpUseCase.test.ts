import { VerifyOtpUseCase } from '../../../application/VerifyOtpUseCase';
import { AuthPort } from '../../../application/ports/AuthPort';

describe('The Verify OTP', () => {
  it('returns success with token when OTP is valid', async () => {
    const authPort: AuthPort = {
      async requestOtp() {},
      async verifyOtp() {
        return 'jwt-token-123';
      },
    };
    const useCase = new VerifyOtpUseCase(authPort);

    const result = await useCase.execute('user@example.com', '123456');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.token).toBe('jwt-token-123');
    }
  });

  it('returns failure when email format is invalid', async () => {
    const authPort: AuthPort = {
      async requestOtp() {},
      async verifyOtp() {
        return '';
      },
    };
    const useCase = new VerifyOtpUseCase(authPort);

    const result = await useCase.execute('invalid-email', '123456');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid email format');
    }
  });

  it('returns failure when OTP format is invalid', async () => {
    const authPort: AuthPort = {
      async requestOtp() {},
      async verifyOtp() {
        return '';
      },
    };
    const useCase = new VerifyOtpUseCase(authPort);

    const result = await useCase.execute('user@example.com', '12345');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('OTP must be 6 numeric digits');
    }
  });

  it('returns failure when auth port fails', async () => {
    const authPort: AuthPort = {
      async requestOtp() {},
      async verifyOtp() {
        throw new Error('Invalid OTP');
      },
    };
    const useCase = new VerifyOtpUseCase(authPort);

    const result = await useCase.execute('user@example.com', '123456');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid OTP');
    }
  });
});
