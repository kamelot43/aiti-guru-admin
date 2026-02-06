import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { RequireAuth } from '@/features/auth/ui/RequireAuth';

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

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
