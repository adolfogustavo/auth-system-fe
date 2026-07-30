import { LogoutUseCase } from '../../../application/LogoutUseCase';
import { TokenPort } from '../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../shared/domain/Maybe';

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

describe('The Logout', () => {
  it('clears the session token', () => {
    const tokenPort = createTokenPort('jwt-token');
    const useCase = new LogoutUseCase(tokenPort);

    useCase.execute();

    expect(tokenPort.getToken().isNone()).toBe(true);
  });

  it('reports a successful logout', () => {
    const useCase = new LogoutUseCase(createTokenPort('jwt-token'));

    const result = useCase.execute();

    expect(result.success).toBe(true);
  });
});
