import { Id } from '../../../shared/domain/value-objects/Id';
import { Maybe } from '../../../shared/domain/Maybe';
import { DomainError } from '../../../shared/domain/DomainError';
import { Phone } from '../value-objects/Phone';

export interface ProfilePrimitives {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface ProfileCreateParams {
  id: Id;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: Phone | null;
  createdAt: Date;
}

export interface ProfileUpdateParams {
  name?: string;
  lastName?: string;
  phone?: string;
}

export class Profile {
  private constructor(
    readonly id: Id,
    readonly email: string,
    private name: Maybe<string>,
    private lastName: Maybe<string>,
    private phone: Maybe<Phone>,
    readonly createdAt: Date
  ) {}

  static create(params: ProfileCreateParams): Profile {
    return new Profile(
      params.id,
      params.email,
      Maybe.fromNullable(params.name),
      Maybe.fromNullable(params.lastName),
      Maybe.fromNullable(params.phone),
      params.createdAt
    );
  }

  static fromPrimitives(primitives: ProfilePrimitives): Profile {
    return Profile.create({
      id: Id.create(primitives.id),
      email: primitives.email,
      name: primitives.name,
      lastName: primitives.lastName,
      phone: primitives.phone ? Phone.create(primitives.phone) : null,
      createdAt: new Date(primitives.createdAt),
    });
  }

  update(params: ProfileUpdateParams): void {
    const hasName = params.name !== undefined;
    const hasLastName = params.lastName !== undefined;
    const hasPhone = params.phone !== undefined;
    const hasNoFields = !hasName && !hasLastName && !hasPhone;
    if (hasNoFields) {
      throw DomainError.createValidation('At least one of name, lastName, or phone is required');
    }
    if (hasName) {
      this.name = Maybe.fromNullable(params.name ?? null);
    }
    if (hasLastName) {
      this.lastName = Maybe.fromNullable(params.lastName ?? null);
    }
    if (hasPhone) {
      this.phone = Maybe.fromNullable(params.phone ? Phone.create(params.phone) : null);
    }
  }

  toPrimitives(): ProfilePrimitives {
    return {
      id: this.id.value,
      email: this.email,
      name: this.name.fold(
        () => null,
        (value) => value
      ),
      lastName: this.lastName.fold(
        () => null,
        (value) => value
      ),
      phone: this.phone.fold(
        () => null,
        (phone) => phone.value
      ),
      createdAt: this.createdAt.toISOString(),
    };
  }
}
