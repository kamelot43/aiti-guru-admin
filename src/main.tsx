import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import 'antd/dist/reset.css';
import "./app/styles/tokens.scss";
import "./app/styles/antd-overrides.scss";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
