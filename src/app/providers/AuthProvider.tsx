import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { authMeApi } from '../../shared/api/auth';
import { clearToken, readToken, saveToken } from '../../shared/api/tokenStorage';

import {
  AuthContext,
  GUEST_STATE,
  type AuthContextValue,
  type AuthState,
} from '../../shared/auth/authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = readToken();
    if (!token) return GUEST_STATE;

    return { status: 'checking', token, user: null };
  });

  useEffect(() => {
    const token = state.token;
    if (!token) return;

    (async () => {
      try {
        const me = await authMeApi(token);
        setState({
          status: 'auth',
          token: token,
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
        setState(GUEST_STATE);
      }
    })();
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setSession: (token, mode) => {
        saveToken(token, mode);
        setState((prev) => ({ ...prev, token, status: 'auth' }));
      },
      logout: () => {
        clearToken();
        setState(GUEST_STATE);
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
