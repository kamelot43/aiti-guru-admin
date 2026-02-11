import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../pages/login/LoginPage';
import { ProductsPage } from '../../pages/products/ProductsPage';
import { NotFoundPage } from '../../pages/not-found/NotFoundPage';
import { RequireAuth } from '../../shared/auth/RequireAuth';
import { PublicRoute } from '../../shared/auth/PublicRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
