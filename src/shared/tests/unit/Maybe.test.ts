import { Maybe } from '../../domain/Maybe';

describe('The Maybe', () => {
  describe('when containing a value', () => {
    it('recognizes itself as present', () => {
      const maybe = Maybe.some('value');

      expect(maybe.isSome()).toBe(true);
      expect(maybe.isNone()).toBe(false);
    });

    it('provides the contained value when a default is offered', () => {
      const maybe = Maybe.some('value');

      expect(maybe.getOrElse('default')).toBe('value');
    });

    it('provides the contained value when extraction is required', () => {
      const maybe = Maybe.some('value');

      expect(maybe.getOrThrow()).toBe('value');
    });

    it('transforms the contained value through mapping', () => {
      const maybe = Maybe.some(5);

      const result = maybe.map((x) => x * 2);

      expect(result.getOrElse(0)).toBe(10);
    });

    it('chains transformations that produce new Maybes', () => {
      const maybe = Maybe.some(5);

      const result = maybe.flatMap((x) => Maybe.some(x * 2));

      expect(result.getOrElse(0)).toBe(10);
    });

    it('executes the present branch when folding', () => {
      const maybe = Maybe.some('value');

      const result = maybe.fold(
        () => 'none',
        (v) => `some: ${v}`
      );

      expect(result).toBe('some: value');
    });
  });

  describe('when empty', () => {
    it('recognizes itself as absent', () => {
      const maybe = Maybe.none<string>();

      expect(maybe.isNone()).toBe(true);
      expect(maybe.isSome()).toBe(false);
    });

    it('provides the default value when one is offered', () => {
      const maybe = Maybe.none<string>();

      expect(maybe.getOrElse('default')).toBe('default');
    });

    it('fails extraction when no value exists', () => {
      const maybe = Maybe.none<string>();

      expect(() => maybe.getOrThrow()).toThrow('Cannot get value from None');
    });

    it('fails extraction with custom error when no value exists', () => {
      const maybe = Maybe.none<string>();

      expect(() => maybe.getOrThrow(new Error('Custom error'))).toThrow('Custom error');
    });

    it('remains empty after mapping', () => {
      const maybe = Maybe.none<number>();

      const result = maybe.map((x) => x * 2);

      expect(result.isNone()).toBe(true);
    });

    it('remains empty after chaining transformations', () => {
      const maybe = Maybe.none<number>();

      const result = maybe.flatMap((x) => Maybe.some(x * 2));

      expect(result.isNone()).toBe(true);
    });

    it('executes the absent branch when folding', () => {
      const maybe = Maybe.none<string>();

      const result = maybe.fold(
        () => 'none',
        (v) => `some: ${v}`
      );

      expect(result).toBe('none');
    });
  });

  describe('when created from nullable values', () => {
    it('contains the value when given a non-null input', () => {
      const maybe = Maybe.fromNullable('value');

      expect(maybe.isSome()).toBe(true);
      expect(maybe.getOrElse('')).toBe('value');
    });

    it('is empty when given null', () => {
      const maybe = Maybe.fromNullable(null);

      expect(maybe.isNone()).toBe(true);
    });

    it('is empty when given undefined', () => {
      const maybe = Maybe.fromNullable(undefined);

      expect(maybe.isNone()).toBe(true);
    });
  });
});
