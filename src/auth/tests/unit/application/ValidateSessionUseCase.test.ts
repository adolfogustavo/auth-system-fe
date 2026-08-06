import { ValidateSessionUseCase } from '../../../application/ValidateSessionUseCase';
import { TokenPort } from '../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../shared/domain/Maybe';

function encodeBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createJwt(payload: Record<string, unknown>): string {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64Url(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

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

describe('The ValidateSession', () => {
  it('reports invalid session when there is no token', () => {
    const useCase = new ValidateSessionUseCase(createTokenPort());

    const result = useCase.execute();

    expect(result.isValid).toBe(false);
  });

  it('reports valid session for a non-expired token', () => {
    const futureExpiration = Math.floor(Date.now() / 1000) + 3600;
    const token = createJwt({ email: 'user@example.com', exp: futureExpiration });
    const useCase = new ValidateSessionUseCase(createTokenPort(token));

    const result = useCase.execute();

    expect(result.isValid).toBe(true);
  });

  it('clears storage and reports invalid when the token is expired', () => {
    const pastExpiration = Math.floor(Date.now() / 1000) - 60;
    const token = createJwt({ email: 'user@example.com', exp: pastExpiration });
    const tokenPort = createTokenPort(token);
    const useCase = new ValidateSessionUseCase(tokenPort);

    const result = useCase.execute();

    expect(result.isValid).toBe(false);
    expect(tokenPort.getToken().isNone()).toBe(true);
  });

  it('clears storage and reports invalid when the token is malformed', () => {
    const tokenPort = createTokenPort('not-a-jwt');
    const useCase = new ValidateSessionUseCase(tokenPort);

    const result = useCase.execute();

    expect(result.isValid).toBe(false);
    expect(tokenPort.getToken().isNone()).toBe(true);
  });
});
