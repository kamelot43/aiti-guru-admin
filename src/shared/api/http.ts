import type { ApiError } from './types';

const BASE_URL = 'https://dummyjson.com';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
    method?: HttpMethod;
    path: string;
    body?: unknown;
    token?: string | null;
    signal?: AbortSignal;
};

export async function http<T>(opts: RequestOptions): Promise<T> {
    const { method = 'GET', path, body, token, signal } = opts;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
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
