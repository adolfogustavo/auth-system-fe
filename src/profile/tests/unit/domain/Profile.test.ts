import { Profile } from '../../../domain/entities/Profile';
import { Id } from '../../../../shared/domain/value-objects/Id';
import { Phone } from '../../../domain/value-objects/Phone';

describe('The Profile', () => {
  const profileId = Id.create('550e8400-e29b-41d4-a716-446655440000');
  const createdAt = new Date('2024-01-01T00:00:00.000Z');

  function profileWithoutContactDetails(): Profile {
    return Profile.fromPrimitives({
      id: profileId.value,
      email: 'user@example.com',
      name: null,
      lastName: null,
      phone: null,
      createdAt: createdAt.toISOString(),
    });
  }

  function profileWithContactDetails(): Profile {
    return Profile.fromPrimitives({
      id: profileId.value,
      email: 'user@example.com',
      name: 'Jane',
      lastName: 'Doe',
      phone: '612345678',
      createdAt: createdAt.toISOString(),
    });
  }

  it('preserves identity and contact details when created', () => {
    const profile = Profile.create({
      id: profileId,
      email: 'user@example.com',
      name: 'Jane',
      lastName: 'Doe',
      phone: Phone.create('612345678'),
      createdAt,
    });

    const primitives = profile.toPrimitives();

    expect(primitives.id).toBe(profileId.value);
    expect(primitives.email).toBe('user@example.com');
    expect(primitives.name).toBe('Jane');
    expect(primitives.lastName).toBe('Doe');
    expect(primitives.phone).toBe('612345678');
    expect(primitives.createdAt).toBe(createdAt.toISOString());
  });

  it('allows optional contact details to be absent', () => {
    const profile = profileWithoutContactDetails();

    const primitives = profile.toPrimitives();

    expect(primitives.name).toBeNull();
    expect(primitives.lastName).toBeNull();
    expect(primitives.phone).toBeNull();
  });

  it('updates name, last name and phone together', () => {
    const profile = profileWithoutContactDetails();

    profile.update({ name: 'Jane', lastName: 'Doe', phone: '612345678' });

    const primitives = profile.toPrimitives();
    expect(primitives.name).toBe('Jane');
    expect(primitives.lastName).toBe('Doe');
    expect(primitives.phone).toBe('612345678');
  });

  it('does not allow an update without any field', () => {
    const profile = profileWithContactDetails();

    expect(() => profile.update({})).toThrow('At least one of name, lastName, or phone is required');
  });

  it('does not allow an invalid phone on update', () => {
    const profile = profileWithContactDetails();

    expect(() => profile.update({ phone: '123' })).toThrow('Invalid phone format');
  });

  it('keeps untouched fields when updating only the name', () => {
    const profile = profileWithContactDetails();

    profile.update({ name: 'John' });

    const primitives = profile.toPrimitives();
    expect(primitives.name).toBe('John');
    expect(primitives.lastName).toBe('Doe');
    expect(primitives.phone).toBe('612345678');
  });
});
