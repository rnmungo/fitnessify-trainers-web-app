import axios, { AxiosInstance } from 'axios';

type HeaderValue = boolean | number | string;

class RestClientFactory {
  private headers: Record<string, HeaderValue> = {
    'X-Caller-Scopes': 'fitnessify-tenant-ui',
    'X-Scope-Id': 'fitnessify-tenant-ui',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  private timeout: number = 10000;
  private baseUrl: string = '';

  constructor(url: string = '') {
    this.baseUrl = url;
  }

  setHeaders(headers: Record<string, HeaderValue>): this {
    this.headers = headers;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  setBaseUrl(baseUrl: string): this {
    this.baseUrl = baseUrl;
    return this;
  }

  extendHeaders(headers: Record<string, HeaderValue>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  create(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: this.headers,
    });
  }
}

export default RestClientFactory;
