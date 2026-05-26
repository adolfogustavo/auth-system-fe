import { TokenPort } from '../../application/ports/TokenPort';
import { Maybe } from '../../domain/Maybe';

export class LocalStorageTokenAdapter implements TokenPort {
  private readonly storageKey = 'auth_token';

  saveToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): Maybe<string> {
    const token = localStorage.getItem(this.storageKey);
    return Maybe.fromNullable(token);
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }
}
