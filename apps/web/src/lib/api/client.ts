import { env } from '../env';

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
