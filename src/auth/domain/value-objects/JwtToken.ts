import { DomainError } from '../../../shared/domain/DomainError';

export class JwtToken {
  private constructor(
    readonly value: string,
    private readonly expirationSeconds: number
  ) {}

  static create(value: string): JwtToken {
    const segments = value.split('.');
    if (segments.length !== 3) {
      throw DomainError.createValidation('Invalid JWT format');
    }
    const payload = JwtToken.decodePayload(segments[1]);
    if (typeof payload.exp !== 'number') {
      throw DomainError.createValidation('JWT payload must include exp');
    }
    return new JwtToken(value, payload.exp);
  }

  isExpired(now: Date = new Date()): boolean {
    const nowSeconds = Math.floor(now.getTime() / 1000);
    return nowSeconds >= this.expirationSeconds;
  }

  private static decodePayload(segment: string): Record<string, unknown> {
    try {
      const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      const json = atob(padded);
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      throw DomainError.createValidation('Invalid JWT format');
    }
  }
}
