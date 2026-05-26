import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../../../../infrastructure/ui/Login.hook';
import { RequestOtpUseCase } from '../../../../application/RequestOtpUseCase';
import { AuthPort } from '../../../../application/ports/AuthPort';

function createAuthPort(overrides?: Partial<AuthPort>): AuthPort {
  return {
    async requestOtp() {},
    async verifyOtp() {
      return '';
    },
    ...overrides,
  };
}

describe('The useLogin hook', () => {
  it('initializes with empty email and idle state', () => {
    const useCase = new RequestOtpUseCase(createAuthPort());

    const { result } = renderHook(() => useLogin(useCase));

    expect(result.current.email).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('updates email when setEmail is called', () => {
    const useCase = new RequestOtpUseCase(createAuthPort());
    const { result } = renderHook(() => useLogin(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    expect(result.current.email).toBe('user@example.com');
  });

  it('sets success to true when OTP is sent', async () => {
    const useCase = new RequestOtpUseCase(createAuthPort());
    const { result } = renderHook(() => useLogin(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.requestOtp();
    });

    expect(result.current.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
  });

  it('sets error when email is invalid', async () => {
    const useCase = new RequestOtpUseCase(createAuthPort());
    const { result } = renderHook(() => useLogin(useCase));

    act(() => {
      result.current.setEmail('invalid-email');
    });

    await act(async () => {
      await result.current.requestOtp();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Invalid email format');
    expect(result.current.success).toBe(false);
  });

  it('sets error when auth port fails', async () => {
    const authPort = createAuthPort({
      async requestOtp() {
        throw new Error('User not found');
      },
    });
    const useCase = new RequestOtpUseCase(authPort);
    const { result } = renderHook(() => useLogin(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.requestOtp();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('User not found');
  });

  it('clears previous error on successful retry', async () => {
    let shouldFail = true;
    const authPort = createAuthPort({
      async requestOtp() {
        if (shouldFail) {
          throw new Error('Network error');
        }
      },
    });
    const useCase = new RequestOtpUseCase(authPort);
    const { result } = renderHook(() => useLogin(useCase));

    act(() => {
      result.current.setEmail('user@example.com');
    });

    await act(async () => {
      await result.current.requestOtp();
    });
    expect(result.current.error.isSome()).toBe(true);

    shouldFail = false;
    await act(async () => {
      await result.current.requestOtp();
    });

    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.success).toBe(true);
  });
});
