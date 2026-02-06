import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';
import { ToastHost } from '@/shared/ui/ToastHost';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <BrowserRouter>
                {children}
                <ToastHost />
            </BrowserRouter>
        </QueryProvider>
    );
}
