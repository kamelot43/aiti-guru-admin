import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../theme/antdTheme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>{children}</BrowserRouter>
    </ConfigProvider>
  );
}
