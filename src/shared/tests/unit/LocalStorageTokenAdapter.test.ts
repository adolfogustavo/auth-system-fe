import { LocalStorageTokenAdapter } from '../../infrastructure/adapters/LocalStorageTokenAdapter';

describe('The LocalStorageTokenAdapter', () => {
  const storageKey = 'auth_token';

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns none when localStorage is empty', () => {
    const adapter = new LocalStorageTokenAdapter();

    expect(adapter.getToken().isNone()).toBe(true);
  });

  it('saves token to localStorage', () => {
    const adapter = new LocalStorageTokenAdapter();

    adapter.saveToken('my-jwt-token');

    expect(localStorage.getItem(storageKey)).toBe('my-jwt-token');
  });

  it('retrieves token from localStorage', () => {
    localStorage.setItem(storageKey, 'existing-token');
    const adapter = new LocalStorageTokenAdapter();

    const token = adapter.getToken();

    expect(token.isSome()).toBe(true);
    expect(token.getOrThrow()).toBe('existing-token');
  });

  it('clears token from localStorage', () => {
    localStorage.setItem(storageKey, 'token-to-clear');
    const adapter = new LocalStorageTokenAdapter();

    adapter.clearToken();

    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(adapter.getToken().isNone()).toBe(true);
  });
});
