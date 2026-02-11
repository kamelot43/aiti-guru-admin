import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { status } = useAuth();

  if (status === 'checking') return null;

  if (status !== 'auth') return <Navigate to="/login" replace />;

  return children;
}
