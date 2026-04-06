import { DomainError } from '../../domain/DomainError';

describe('The DomainError', () => {
  it('represents a not found situation with appropriate type and message', () => {
    const error = DomainError.createNotFound('Entity not found');

    expect(error.type).toBe('notFound');
    expect(error.message).toBe('Entity not found');
    expect(error.name).toBe('DomainError');
  });

  it('represents a validation failure with appropriate type and message', () => {
    const error = DomainError.createValidation('Invalid value');

    expect(error.type).toBe('validation');
    expect(error.message).toBe('Invalid value');
    expect(error.name).toBe('DomainError');
  });

  it('represents a generic domain problem with appropriate type and message', () => {
    const error = DomainError.create('Something went wrong');

    expect(error.type).toBe('other');
    expect(error.message).toBe('Something went wrong');
    expect(error.name).toBe('DomainError');
  });

  it('is compatible with standard error handling', () => {
    const error = DomainError.create('Test');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
  });
});
