import { RequestOtpUseCase } from '../../../application/RequestOtpUseCase';
import { AuthPort } from '../../../application/ports/AuthPort';

describe('The Request OTP', () => {
  it('returns success when OTP is sent', async () => {
    let calledWithEmail = '';
    const authPort: AuthPort = {
      async register(email) {
        return { id: 'user-id', email: email.value };
      },
      async requestOtp(email) {
        calledWithEmail = email.value;
      },
      async verifyOtp() {
        return '';
      },
    };
    const useCase = new RequestOtpUseCase(authPort);

    const result = await useCase.execute('user@example.com');

    expect(result.success).toBe(true);
    expect(calledWithEmail).toBe('user@example.com');
  });

  it('returns failure when email format is invalid', async () => {
    const authPort: AuthPort = {
      async register(email) {
        return { id: 'user-id', email: email.value };
      },
      async requestOtp() {},
      async verifyOtp() {
        return '';
      },
    };
    const useCase = new RequestOtpUseCase(authPort);

    const result = await useCase.execute('invalid-email');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid email format');
    }
  });

  it('returns failure when auth port fails', async () => {
    const authPort: AuthPort = {
      async register(email) {
        return { id: 'user-id', email: email.value };
      },
      async requestOtp() {
        throw new Error('User not found');
      },
      async verifyOtp() {
        return '';
      },
    };
    const useCase = new RequestOtpUseCase(authPort);

    const result = await useCase.execute('user@example.com');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('User not found');
    }
  });
});
