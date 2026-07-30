import { renderHook, act } from '@testing-library/react';
import { useRegister } from '../../../../infrastructure/ui/Register.hook';
import { RegisterUserUseCase } from '../../../../application/RegisterUserUseCase';
import { AuthPort } from '../../../../application/ports/AuthPort';

function createAuthPort(overrides?: Partial<AuthPort>): AuthPort {
  return {
    async register(email) {
      return { id: 'user-id', email: email.value };
    },
    async requestOtp() {},
    async verifyOtp() {
      return '';
    },
    ...overrides,
  };
}

describe('The useRegister hook', () => {
  it('updates email when setEmail is called', () => {
    const useCase = new RegisterUserUseCase(createAuthPort());
    const { result } = renderHook(() => useRegister(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    expect(result.current.email).toBe('user@example.com');
  });

  it('sets success to true when registration succeeds', async () => {
    const useCase = new RegisterUserUseCase(createAuthPort());
    const { result } = renderHook(() => useRegister(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.register();
    });

    expect(result.current.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
  });

  it('exposes the error when registration fails', async () => {
    const authPort = createAuthPort({
      async register() {
        throw new Error('Email already registered');
      },
    });
    const useCase = new RegisterUserUseCase(authPort);
    const { result } = renderHook(() => useRegister(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.register();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Email already registered');
    expect(result.current.success).toBe(false);
  });

  it('clears the error when the email is edited', async () => {
    const authPort = createAuthPort({
      async register() {
        throw new Error('Email already registered');
      },
    });
    const useCase = new RegisterUserUseCase(authPort);
    const { result } = renderHook(() => useRegister(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.register();
    });
    expect(result.current.error.isSome()).toBe(true);

    act(() => {
      result.current.setEmail('other@example.com');
    });

    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.email).toBe('other@example.com');
  });
});
