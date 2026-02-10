import { Navigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { status } = useAuth();

  if (status === 'checking') return null;

  if (status === 'auth') {
    return <Navigate to="/products" replace />;
  }

  return children;
}
