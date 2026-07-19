// Post-build prerender step.
//
// Pipeline: `vite build` produces the client bundle in dist/ (with an empty
// <div id="root">). `vite build --ssr` produces dist-ssr/entry-server.js. This
// script renders each route to HTML and writes a static dist/<route>/index.html
// so crawlers (and AdSense's reviewer) see real content without running JS.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');

const { render, routes } = await import('./dist-ssr/entry-server.js');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8');

for (const route of routes) {
  const appHtml = render(route.path);

  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  // Per-route <title> and meta description.
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(
    /<meta name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${route.description}" />`
  );

  // Per-route OpenGraph tags
  const canonicalUrl = route.path === '/' ? 'https://www.daycounterpro.com/' : `https://www.daycounterpro.com${route.path}`;
  html = html.replace(
    /<link rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  const outDir = route.path === '/' ? dist : path.join(dist, route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`prerendered ${route.path} -> ${path.relative(__dirname, path.join(outDir, 'index.html'))}`);
}

// dist-ssr is a build artifact only needed during prerender.
fs.rmSync(path.join(__dirname, 'dist-ssr'), { recursive: true, force: true });
console.log('prerender complete');
