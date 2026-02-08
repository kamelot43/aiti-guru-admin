import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { RequireAuth } from '../../features/auth/ui/RequireAuth';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/products"
        element={
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
