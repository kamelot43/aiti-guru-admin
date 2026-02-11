export type LoginRequest = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type AuthMeResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

const BASE_URL = 'https://dummyjson.com';

export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || 'Ошибка авторизации';
    throw new Error(message);
  }

  return data as LoginResponse;
}

export async function authMeApi(accessToken: string): Promise<AuthMeResponse> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || 'Не удалось получить пользователя';
    throw new Error(message);
  }

  return data as AuthMeResponse;
}
