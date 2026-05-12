import { env } from '../env';

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiRequestError(
      res.status,
      body?.error?.code,
      body?.error?.message ?? `${res.status} ${res.statusText}`,
    );
  }
  return res.json() as Promise<T>;
}
