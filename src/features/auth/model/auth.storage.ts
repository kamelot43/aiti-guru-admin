const LS_KEY = 'auth_token';
const SS_KEY = 'auth_token_session';

export function saveToken(token: string, remember: boolean) {
    if (remember) {
        localStorage.setItem(LS_KEY, token);
        sessionStorage.removeItem(SS_KEY);
    } else {
        sessionStorage.setItem(SS_KEY, token);
        localStorage.removeItem(LS_KEY);
    }
}

export function getToken(): string | null {
    return localStorage.getItem(LS_KEY) ?? sessionStorage.getItem(SS_KEY);
}

export function clearToken() {
    localStorage.removeItem(LS_KEY);
    sessionStorage.removeItem(SS_KEY);
}
