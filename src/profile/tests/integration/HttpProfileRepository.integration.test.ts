import { execSync } from 'child_process';
import { HttpProfileRepository } from '../../infrastructure/adapters/HttpProfileRepository';
import { HttpAuthAdapter } from '../../../auth/infrastructure/adapters/HttpAuthAdapter';
import { HttpClient } from '../../../shared/infrastructure/http/HttpClient';
import { Email } from '../../../auth/domain/value-objects/Email';
import { OtpCode } from '../../../auth/domain/value-objects/OtpCode';
import { TokenPort } from '../../../shared/application/ports/TokenPort';
import { Maybe } from '../../../shared/domain/Maybe';

describe('The Profile API Client', () => {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:8080';
  const httpClient = new HttpClient(apiUrl);
  const authAdapter = new HttpAuthAdapter(httpClient);
  // CI platforms set CI=true; skip here because these tests need a live API (and Mongo for OTP).
  const conditionalIt = process.env.CI ? it.skip : it;

  function tokenPortWithBearer(token: string): TokenPort & { cleared: boolean } {
    let current: Maybe<string> = Maybe.some(token);
    const port = {
      cleared: false,
      saveToken(value: string) {
        current = Maybe.some(value);
      },
      getToken() {
        return current;
      },
      clearToken() {
        port.cleared = true;
        current = Maybe.none();
      },
    };
    return port;
  }

  function readOtpFromDatabase(email: string): string {
    const command = `docker exec mongo mongosh --quiet backend-template --eval "db.otp_sessions.findOne({_id: '${email}'}).otp"`;
    return execSync(command, { encoding: 'utf-8' }).trim();
  }

  async function authenticatedSession(emailValue: string): Promise<string> {
    const email = Email.create(emailValue);
    await authAdapter.register(email);
    await authAdapter.requestOtp(email);
    const otp = OtpCode.create(readOtpFromDatabase(emailValue));
    return authAdapter.verifyOtp(email, otp);
  }

  conditionalIt('provides the current profile for an authenticated user', async () => {
    const uniqueEmail = `profile-get-${Date.now()}@example.com`;
    const token = await authenticatedSession(uniqueEmail);
    const repository = new HttpProfileRepository(httpClient, tokenPortWithBearer(token));

    const current = await repository.findCurrent();

    expect(current.isSome()).toBe(true);
    const primitives = current.getOrThrow().toPrimitives();
    expect(primitives.email).toBe(uniqueEmail);
    expect(primitives.id.length).toBeGreaterThan(0);
  });

  conditionalIt('persists contact detail updates for the authenticated user', async () => {
    const uniqueEmail = `profile-put-${Date.now()}@example.com`;
    const token = await authenticatedSession(uniqueEmail);
    const repository = new HttpProfileRepository(httpClient, tokenPortWithBearer(token));

    const updated = await repository.update({
      name: 'Jane',
      lastName: 'Doe',
      phone: '612345678',
    });

    expect(updated.toPrimitives().name).toBe('Jane');
    expect(updated.toPrimitives().lastName).toBe('Doe');
    expect(updated.toPrimitives().phone).toBe('612345678');
  });

  conditionalIt('rejects access with an invalid session token', async () => {
    const tokenPort = tokenPortWithBearer('invalid.jwt.token');
    const repository = new HttpProfileRepository(httpClient, tokenPort);

    await expect(repository.findCurrent()).rejects.toThrow('Invalid or expired token');
    expect(tokenPort.cleared).toBe(true);
  });
});
