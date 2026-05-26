import { DomainError } from '../../../shared/domain/DomainError';

export class Email {
  private constructor(readonly value: string) {}

  static create(value: string): Email {
    if (!Email.isValid(value)) {
      throw DomainError.createValidation('Invalid email format');
    }
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private static isValid(value: string): boolean {
    if (!value || !value.includes('@')) {
      return false;
    }
    const [localPart, domain] = value.split('@');
    return localPart.length > 0 && domain.length > 0;
  }
}
