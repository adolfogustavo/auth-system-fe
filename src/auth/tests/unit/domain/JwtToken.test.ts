import { JwtToken } from '../../../domain/value-objects/JwtToken';

function encodeBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createJwt(payload: Record<string, unknown>): string {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64Url(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('The JwtToken', () => {
  it('creates from a well-formed JWT with a future expiration', () => {
    const futureExpiration = Math.floor(Date.now() / 1000) + 3600;
    const rawToken = createJwt({ email: 'user@example.com', exp: futureExpiration });

    const token = JwtToken.create(rawToken);

    expect(token.value).toBe(rawToken);
  });

  it('rejects a string that does not have three segments', () => {
    expect(() => JwtToken.create('not-a-jwt')).toThrow('Invalid JWT format');
  });

  it('rejects a payload without exp', () => {
    const rawToken = createJwt({ email: 'user@example.com' });

    expect(() => JwtToken.create(rawToken)).toThrow('JWT payload must include exp');
  });

  it('reports expired when exp is in the past', () => {
    const pastExpiration = Math.floor(Date.now() / 1000) - 60;
    const token = JwtToken.create(createJwt({ email: 'user@example.com', exp: pastExpiration }));

    expect(token.isExpired()).toBe(true);
  });

  it('reports not expired when exp is in the future', () => {
    const futureExpiration = Math.floor(Date.now() / 1000) + 3600;
    const token = JwtToken.create(createJwt({ email: 'user@example.com', exp: futureExpiration }));

    expect(token.isExpired()).toBe(false);
  });
});
