import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './shared/infrastructure/ui/App';
import './shared/infrastructure/ui/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
