import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === 'checking') return null;

  if (status !== 'auth') return <Navigate to="/login" replace />;

  return children;
}
