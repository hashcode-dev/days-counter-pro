import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppShell, routes } from './App';

// Render the app to an HTML string for a given route path. Called by the
// prerender script (one invocation per route) after the client build.
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>
  );
}

export { routes };
