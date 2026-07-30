import { HttpAuthAdapter } from '../../infrastructure/adapters/HttpAuthAdapter';
import { HttpClient } from '../../../shared/infrastructure/http/HttpClient';
import { Email } from '../../domain/value-objects/Email';
import { OtpCode } from '../../domain/value-objects/OtpCode';

describe('The HttpAuthAdapter', () => {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:8080';
  const httpClient = new HttpClient(apiUrl);
  const adapter = new HttpAuthAdapter(httpClient);

  describe('register', () => {
    it('creates a user in the API and returns id and email', async () => {
      const uniqueEmail = `register-${Date.now()}@example.com`;
      const email = Email.create(uniqueEmail);

      const registeredUser = await adapter.register(email);

      expect(registeredUser.id.length).toBeGreaterThan(0);
      expect(registeredUser.email).toBe(uniqueEmail);
    });

    it('throws an error when the email is already registered', async () => {
      const uniqueEmail = `duplicate-${Date.now()}@example.com`;
      const email = Email.create(uniqueEmail);
      await adapter.register(email);

      await expect(adapter.register(email)).rejects.toThrow('Email already registered');
    });
  });

  describe('requestOtp', () => {
    it('sends OTP request to the API for registered user', async () => {
      const email = Email.create('test@example.com');

      await expect(adapter.requestOtp(email)).resolves.not.toThrow();
    });

    it('throws error when user is not found', async () => {
      const email = Email.create('nonexistent@example.com');

      await expect(adapter.requestOtp(email)).rejects.toThrow('User not found');
    });
  });

  describe('verifyOtp', () => {
    it('returns token when OTP is valid', async () => {
      const email = Email.create('test@example.com');
      const otp = OtpCode.create('123456');

      const token = await adapter.verifyOtp(email, otp);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('throws error when OTP is invalid', async () => {
      const email = Email.create('test@example.com');
      const otp = OtpCode.create('000000');

      await expect(adapter.verifyOtp(email, otp)).rejects.toThrow();
    });
  });
});
