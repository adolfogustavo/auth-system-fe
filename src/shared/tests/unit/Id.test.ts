import { Id } from '../../domain/value-objects/Id';

describe('The Id', () => {
  it('preserves the provided string value', () => {
    const id = Id.create('abc-123');

    expect(id.value).toBe('abc-123');
  });

  it('produces different values on each generation', () => {
    const id1 = Id.generate();
    const id2 = Id.generate();

    expect(id1.value).not.toBe(id2.value);
  });

  it('considers two ids with the same value as equal', () => {
    const id1 = Id.create('same-value');
    const id2 = Id.create('same-value');

    expect(id1.equals(id2)).toBe(true);
  });

  it('considers two ids with different values as distinct', () => {
    const id1 = Id.create('value-1');
    const id2 = Id.create('value-2');

    expect(id1.equals(id2)).toBe(false);
  });

  it('generates values in valid UUID v4 format', () => {
    const id = Id.generate();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(id.value).toMatch(uuidRegex);
  });
});
