import { Phone } from '../../../domain/value-objects/Phone';

describe('The Phone', () => {
  it('accepts a number with between 7 and 15 digits', () => {
    const phone = Phone.create('612345678');

    expect(phone.value).toBe('612345678');
  });

  it('rejects an empty value', () => {
    expect(() => Phone.create('')).toThrow('Invalid phone format');
  });

  it('rejects a number shorter than 7 digits', () => {
    expect(() => Phone.create('123456')).toThrow('Invalid phone format');
  });

  it('rejects a number longer than 15 digits', () => {
    expect(() => Phone.create('1234567890123456')).toThrow('Invalid phone format');
  });

  it('rejects a number with non-numeric characters', () => {
    expect(() => Phone.create('+612345678')).toThrow('Invalid phone format');
  });

  it('considers two phones with the same value as equal', () => {
    const phone = Phone.create('612345678');
    const samePhone = Phone.create('612345678');

    expect(phone.equals(samePhone)).toBe(true);
  });
});
