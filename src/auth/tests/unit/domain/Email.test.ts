import { Email } from '../../../domain/value-objects/Email';

describe('The Email', () => {
  it('creates email from valid email string', () => {
    const email = Email.create('user@example.com');

    expect(email.value).toBe('user@example.com');
  });

  it('rejects empty string', () => {
    expect(() => Email.create('')).toThrow('Invalid email format');
  });

  it('rejects string without @', () => {
    expect(() => Email.create('userexample.com')).toThrow('Invalid email format');
  });

  it('rejects string without domain', () => {
    expect(() => Email.create('user@')).toThrow('Invalid email format');
  });

  it('rejects string without local part', () => {
    expect(() => Email.create('@example.com')).toThrow('Invalid email format');
  });

  it('considers two emails with same value as equal', () => {
    const email1 = Email.create('user@example.com');
    const email2 = Email.create('user@example.com');

    expect(email1.equals(email2)).toBe(true);
  });

  it('considers two emails with different values as distinct', () => {
    const email1 = Email.create('user@example.com');
    const email2 = Email.create('other@example.com');

    expect(email1.equals(email2)).toBe(false);
  });
});
