import { renderHook, act } from '@testing-library/react';
import { useLogout } from '../../../../infrastructure/ui/Profile.hook';
import { LogoutUseCase } from '../../../../../auth/application/LogoutUseCase';
import { TokenPort } from '../../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../../shared/domain/Maybe';

function createTokenPort(initialToken?: string): TokenPort {
  let token: Maybe<string> = initialToken ? Maybe.some(initialToken) : Maybe.none();
  return {
    saveToken(value: string) {
      token = Maybe.some(value);
    },
    getToken() {
      return token;
    },
    clearToken() {
      token = Maybe.none();
    },
  };
}

describe('The useLogout hook', () => {
  it('starts idle without success', () => {
    const useCase = new LogoutUseCase(createTokenPort('jwt-token'));

    const { result } = renderHook(() => useLogout(useCase));

    expect(result.current.success).toBe(false);
  });

  it('marks success and clears the token after logout', () => {
    const tokenPort = createTokenPort('jwt-token');
    const useCase = new LogoutUseCase(tokenPort);
    const { result } = renderHook(() => useLogout(useCase));

    act(() => {
      result.current.logout();
    });

    expect(result.current.success).toBe(true);
    expect(tokenPort.getToken().isNone()).toBe(true);
  });
});
