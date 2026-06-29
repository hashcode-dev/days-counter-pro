import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './App';
import './index.css';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </StrictMode>
);

// In production the markup is pre-rendered, so hydrate it. In dev (or any case
// where the root is empty) fall back to a fresh client render.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
