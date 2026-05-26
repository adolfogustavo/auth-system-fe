import { Maybe } from '../../domain/Maybe';

export interface TokenPort {
  saveToken(token: string): void;
  getToken(): Maybe<string>;
  clearToken(): void;
}
