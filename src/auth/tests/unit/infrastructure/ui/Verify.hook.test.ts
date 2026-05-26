import { renderHook, act } from '@testing-library/react';
import { useVerify } from '../../../../infrastructure/ui/Verify.hook';
import { VerifyOtpUseCase } from '../../../../application/VerifyOtpUseCase';
import { AuthPort } from '../../../../application/ports/AuthPort';
import { TokenPort } from '../../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../../shared/domain/Maybe';

function createAuthPort(overrides?: Partial<AuthPort>): AuthPort {
  return {
    async requestOtp() {},
    async verifyOtp() {
      return 'test-token';
    },
    ...overrides,
  };
}

function createTokenPort(): TokenPort & { savedToken: Maybe<string> } {
  let token: Maybe<string> = Maybe.none();
  return {
    get savedToken() {
      return token;
    },
    saveToken(t: string) {
      token = Maybe.some(t);
    },
    getToken() {
      return token;
    },
    clearToken() {
      token = Maybe.none();
    },
  };
}

describe('The useVerify hook', () => {
  it('initializes with empty otp and idle state', () => {
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(createAuthPort());

    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    expect(result.current.otp).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error.isNone()).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('updates otp when setOtp is called', () => {
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(createAuthPort());
    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    act(() => {
      result.current.setOtp('123456');
    });

    expect(result.current.otp).toBe('123456');
  });

  it('saves token and sets success when verification succeeds', async () => {
    const authPort = createAuthPort({
      async verifyOtp() {
        return 'jwt-token-123';
      },
    });
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(authPort);
    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    act(() => {
      result.current.setOtp('123456');
    });

    await act(async () => {
      await result.current.verifyOtp();
    });

    expect(tokenPort.getToken().isSome()).toBe(true);
    expect(tokenPort.getToken().getOrThrow()).toBe('jwt-token-123');
    expect(result.current.success).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('sets error when OTP format is invalid', async () => {
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(createAuthPort());
    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    act(() => {
      result.current.setOtp('12345');
    });

    await act(async () => {
      await result.current.verifyOtp();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('OTP must be 6 numeric digits');
  });

  it('sets error when verification fails', async () => {
    const authPort = createAuthPort({
      async verifyOtp() {
        throw new Error('Invalid OTP');
      },
    });
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(authPort);
    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    act(() => {
      result.current.setOtp('123456');
    });

    await act(async () => {
      await result.current.verifyOtp();
    });

    expect(result.current.error.isSome()).toBe(true);
    expect(result.current.error.getOrThrow()).toBe('Invalid OTP');
    expect(tokenPort.getToken().isNone()).toBe(true);
  });

  it('clears error on successful retry', async () => {
    let shouldFail = true;
    const authPort = createAuthPort({
      async verifyOtp() {
        if (shouldFail) {
          throw new Error('Network error');
        }
        return 'success-token';
      },
    });
    const tokenPort = createTokenPort();
    const useCase = new VerifyOtpUseCase(authPort);
    const { result } = renderHook(() => useVerify(useCase, tokenPort, 'user@example.com'));

    act(() => {
      result.current.setOtp('123456');
    });

    await act(async () => {
      await result.current.verifyOtp();
    });
    expect(result.current.error.isSome()).toBe(true);

    shouldFail = false;
    await act(async () => {
      await result.current.verifyOtp();
    });

    expect(result.current.error.isNone()).toBe(true);
    expect(tokenPort.getToken().isSome()).toBe(true);
  });
});
