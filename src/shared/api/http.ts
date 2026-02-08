import type { ApiError } from './types';

const BASE_URL = 'https://dummyjson.com';

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  const data = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message:
        (typeof data === 'object' && data && 'message' in data && String((data as any).message)) ||
        res.statusText ||
        'Request error',
      raw: data,
    };
    throw err;
  }

  return data as T;
}
