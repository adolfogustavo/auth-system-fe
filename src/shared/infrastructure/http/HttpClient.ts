export interface HttpClientOptions {
  headers?: Record<string, string>;
}

export class HttpClientError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpClientError';
  }

  isBadRequest(): boolean {
    return this.status === 400;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  static isNotFoundError(error: unknown): boolean {
    return error instanceof HttpClientError && error.isNotFound();
  }

  static isBadRequestError(error: unknown): boolean {
    return error instanceof HttpClientError && error.isBadRequest();
  }
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return this.handleResponse(response);
  }

  async post<T>(path: string, body?: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse(response);
  }

  async put<T>(path: string, body: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async patch<T>(path: string, body: unknown, options?: HttpClientOptions): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse(response);
  }

  async delete(path: string, options?: HttpClientOptions): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    await this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = 'Request failed';
      try {
        const body = await response.json();
        message = body.error || response.statusText || message;
      } catch {
        message = response.statusText || message;
      }
      throw new HttpClientError(response.status, message);
    }
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    return JSON.parse(text);
  }
}
