import { DomainError } from '../../../shared/domain/DomainError';

export class Phone {
  private constructor(readonly value: string) {}

  static create(value: string): Phone {
    if (!Phone.isValid(value)) {
      throw DomainError.createValidation('Invalid phone format');
    }
    return new Phone(value);
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  private static isValid(value: string): boolean {
    return /^\d{7,15}$/.test(value);
  }
}
