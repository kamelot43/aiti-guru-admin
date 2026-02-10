import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authMeApi } from '../../shared/api/auth';
import { clearToken, readToken, saveToken, type PersistMode } from '../../shared/api/tokenStorage';

type AuthState = {
  status: 'checking' | 'guest' | 'auth';
  token: string | null;
  user: null | {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
  };
};

type AuthContextValue = AuthState & {
  setSession: (token: string, mode: PersistMode) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: 'checking',
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = readToken();
    if (!token) {
      setState({ status: 'guest', token: null, user: null });
      return;
    }

    (async () => {
      try {
        const me = await authMeApi(token);
        setState({
          status: 'auth',
          token,
          user: {
            id: me.id,
            username: me.username,
            email: me.email,
            firstName: me.firstName,
            lastName: me.lastName,
            image: me.image,
          },
        });
      } catch {
        clearToken();
        setState({ status: 'guest', token: null, user: null });
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setSession: (token, mode) => {
        saveToken(token, mode);
        setState((prev) => ({ ...prev, token, status: 'auth' }));
      },
      logout: () => {
        clearToken();
        setState({ status: 'guest', token: null, user: null });
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
