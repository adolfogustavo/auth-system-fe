import { HttpProfileRepository } from '../../../../infrastructure/adapters/HttpProfileRepository';
import { HttpClient, HttpClientError } from '../../../../../shared/infrastructure/http/HttpClient';
import { TokenPort } from '../../../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../../../shared/domain/Maybe';
import { DomainError } from '../../../../../shared/domain/DomainError';

function createTokenPort(initialToken = 'valid.jwt.token'): TokenPort & { cleared: boolean } {
  let token: Maybe<string> = Maybe.some(initialToken);
  const port = {
    cleared: false,
    saveToken(value: string) {
      token = Maybe.some(value);
    },
    getToken() {
      return token;
    },
    clearToken() {
      port.cleared = true;
      token = Maybe.none();
    },
  };
  return port;
}

describe('The HttpProfileRepository', () => {
  it('clears the token and raises a domain error when the API responds unauthorized', async () => {
    const tokenPort = createTokenPort();
    const httpClient = {
      get: async () => {
        throw new HttpClientError(401, 'Invalid or expired token');
      },
    } as unknown as HttpClient;
    const repository = new HttpProfileRepository(httpClient, tokenPort);

    await expect(repository.findCurrent()).rejects.toThrow('Invalid or expired token');
    expect(tokenPort.cleared).toBe(true);
    expect(tokenPort.getToken().isNone()).toBe(true);
  });

  it('clears the token on unauthorized update', async () => {
    const tokenPort = createTokenPort();
    const httpClient = {
      put: async () => {
        throw new HttpClientError(401, 'Invalid or expired token');
      },
    } as unknown as HttpClient;
    const repository = new HttpProfileRepository(httpClient, tokenPort);

    await expect(repository.update({ name: 'Jane' })).rejects.toBeInstanceOf(DomainError);
    expect(tokenPort.cleared).toBe(true);
  });
});
