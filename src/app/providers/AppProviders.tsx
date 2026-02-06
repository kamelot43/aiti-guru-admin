import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';
import { ToastHost } from '@/shared/ui/ToastHost';

type Props = { children: ReactNode };

export function AppProviders({ children }: Props) {
    return (
        <QueryProvider>
            <BrowserRouter>
                {children}
                <ToastHost />
            </BrowserRouter>
        </QueryProvider>
    );
}
