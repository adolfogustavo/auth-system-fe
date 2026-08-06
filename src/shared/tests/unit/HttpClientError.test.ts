import { HttpClientError } from '../../infrastructure/http/HttpClient';

describe('The HttpClientError', () => {
  it('identifies unauthorized responses', () => {
    const error = new HttpClientError(401, 'Invalid or expired token');

    expect(error.isUnauthorized()).toBe(true);
    expect(HttpClientError.isUnauthorizedError(error)).toBe(true);
  });

  it('does not treat other statuses as unauthorized', () => {
    const error = new HttpClientError(404, 'Not found');

    expect(error.isUnauthorized()).toBe(false);
    expect(HttpClientError.isUnauthorizedError(error)).toBe(false);
  });
});
