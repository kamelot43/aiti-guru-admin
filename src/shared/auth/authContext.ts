import { createContext } from 'react';
import { PersistMode } from '../api/tokenStorage';

export type AuthState = {
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

export type AuthContextValue = AuthState & {
  setSession: (token: string, mode: PersistMode) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const GUEST_STATE: AuthState = {
  status: 'guest',
  token: null,
  user: null,
};
