import { RegisterUserUseCase } from '../../../application/RegisterUserUseCase';
import { AuthPort } from '../../../application/ports/AuthPort';

function authPortThatAcceptsRegistration(): AuthPort {
  return {
    async register(email) {
      return { id: '550e8400-e29b-41d4-a716-446655440000', email: email.value };
    },
    async requestOtp() {},
    async verifyOtp() {
      return '';
    },
  };
}

function authPortThatRejectsDuplicateEmail(): AuthPort {
  return {
    async register() {
      throw new Error('Email already registered');
    },
    async requestOtp() {},
    async verifyOtp() {
      return '';
    },
  };
}

describe('The User Registration', () => {
  it('registers a user with a valid email', async () => {
    const useCase = new RegisterUserUseCase(authPortThatAcceptsRegistration());

    const result = await useCase.execute('user@example.com');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.email).toBe('user@example.com');
    }
  });

  it('rejects registration when email format is invalid', async () => {
    const useCase = new RegisterUserUseCase(authPortThatAcceptsRegistration());

    const result = await useCase.execute('invalid-email');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid email format');
    }
  });

  it('rejects registration when email is already registered', async () => {
    const useCase = new RegisterUserUseCase(authPortThatRejectsDuplicateEmail());

    const result = await useCase.execute('user@example.com');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Email already registered');
    }
  });
});
