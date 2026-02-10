const LS_KEY = 'auth_token';
const SS_KEY = 'auth_token_session';

export type PersistMode = 'persist' | 'session';

export function saveToken(token: string, mode: PersistMode) {
  clearToken();
  if (mode === 'persist') localStorage.setItem(LS_KEY, token);
  else sessionStorage.setItem(SS_KEY, token);
}

export function readToken(): string | null {
  return localStorage.getItem(LS_KEY) || sessionStorage.getItem(SS_KEY);
}

export function clearToken() {
  localStorage.removeItem(LS_KEY);
  sessionStorage.removeItem(SS_KEY);
}

export function isPersistedToken(): boolean {
  return Boolean(localStorage.getItem(LS_KEY));
}
