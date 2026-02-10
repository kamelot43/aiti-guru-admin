import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./AuthProvider";
import { ConfigProvider } from 'antd';
import { antdTheme } from '../theme/antdTheme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
      <AuthProvider>
        <ConfigProvider theme={antdTheme}>
            <BrowserRouter>{children}</BrowserRouter>
        </ConfigProvider>
      </AuthProvider>
  );
}
