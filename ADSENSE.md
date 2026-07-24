# Google AdSense Approval Master Blueprint & Reusable Checklist

This document is a universal, project-agnostic guide and master checklist for getting modern web applications (React, Vite, Next.js, Vue, Angular, or Static HTML) approved for Google AdSense on the first attempt. 

It synthesizes battle-tested fixes for common rejection reasons such as *Low Value Content*, *Valuable Inventory: No Content*, *Site Under Construction*, and *Google Consent Mode v2 Non-Compliance*.

---

## 1. Core Fixes & Technical Strategy Overview

Below is the categorized summary of core technical and architectural fixes required to make a web application fully compliant with Google Publisher Policies:

| Domain | Problem Addressed | Core Fix & Implementation |
|---|---|---|
| **SEO & Metadata** | Duplicate canonical links & missing OG tags across routes | Unique canonical URL (`<link rel="canonical">`) and OpenGraph metadata per route dynamically injected during build/render. |
| **Privacy & Consent** | Rejection due to missing Google Consent Mode v2 (EU/EEA penalty) | Synchronous inline Consent Mode v2 initialization in `<head>` setting default states (`denied`/`granted`) before loading ad/analytics scripts. |
| **Ad Unit Placement** | Rejection for "Unfilled / Misleading Ad Slots" or placeholder boxes | Guarded framework AdUnit component that returns `null` for missing or unapproved ad slot IDs, preventing empty layout boxes. |
| **SPA Crawling** | AdSense crawler sees empty `<div id="root">` ("No Content") | Static Site Generation (SSG / Prerendering) or SSR so crawlers receive 100% complete text HTML without relying on client JS execution. |
| **Ad Integration** | Hydration mismatches or script push errors during client routing | Safe asynchronous wrapper around `(adsbygoogle).push({})` with error boundaries and route-change re-initialization. |
| **Content Depth** | Penalty for "Low Value Content" or simple utility calculators | Rich textual context around interactive tools: detailed user guides, real-world examples, and structured FAQ sections. |
| **Structured Data** | Weak machine entity signals for crawler indexers | Injected `WebApplication`, `FAQPage`, `HowTo`, and `Organization` JSON-LD schemas into page `<head>`. |
| **Publisher Identity** | Rejection under E-E-A-T guidelines (lack of ownership info) | Dedicated About Us page (mission, team) and Contact Us page (direct email, physical address/jurisdiction). |
| **Legal Compliance** | ePrivacy & GDPR advertising disclosure requirements | Detailed Privacy Policy page with explicit disclosures for Google DART cookies, analytics, and third-party advertising. |
| **Crawler Reliability** | Soft 404s & unhandled client-side route crashes | True HTTP 404 status codes via static fallback pages (`404.html`) and client-side catch-all routing. |
| **Security Headers** | Content-Security-Policy (CSP) blocking AdSense scripts | Configured CSP headers allowing `https://pagead2.googlesyndication.com` and related Google ad domains. |

---

## 2. Technical Architecture & SPA Guidelines

Single Page Applications (SPAs) are often falsely rejected because automated Google crawlers fail to wait for client-side JavaScript to render.

### A. Static Site Generation (SSG) / Prerendering
- **Raw HTML Requirement**: The initial HTTP GET request MUST return complete text content, heading tags (`<h1>`-`<h3>`), and navigation links directly in the raw HTML.
- **Pre-rendering**: For SPA frameworks (React/Vite, Vue/Vite), use a post-build pre-rendering step (e.g. Vite SSR pre-renderer, Prerender SPA Plugin) or SSG mode (Next.js `output: 'export'`) to output static `index.html` files for every route (`/`, `/about`, `/contact`, `/privacy-policy`).

### B. Per-Route Canonical URLs & Metadata
- **Unique Canonicals**: Every route must output its own unique canonical tag:
  ```html
  <link rel="canonical" href="https://www.yourdomain.com/exact-page-path" />
  ```
- **Social Tags**: OpenGraph (`og:title`, `og:description`, `og:url`) and Twitter tags must match the specific page content.
- **Social Asset**: Maintain a valid 1200x630px social preview image at `/og-image.png`.

### C. Crawling & Sitemap Setup
- **`robots.txt`**: Must explicitly permit crawling:
  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://www.yourdomain.com/sitemap-index.xml
  ```
- **Staging Isolation**: Prevent staging/preview deployments (e.g. `*.pages.dev`, `*.vercel.app`) from being indexed by serving `X-Robots-Tag: noindex` headers on non-production domains.

---

## 3. Google Consent Mode v2 & Privacy Compliance

Google strictly enforces **Consent Mode v2** for all sites receiving European Economic Area (EEA) and UK traffic.

### A. Inline Initialization Script
Place this script at the top of `<head>` in your HTML **before** any Google Analytics or AdSense tags:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Load existing consent state from local storage
  var savedConsent = localStorage.getItem('cookie-consent');
  var isGranted = (savedConsent === 'granted' || savedConsent === 'accepted');

  gtag('consent', 'default', {
    'ad_storage': isGranted ? 'granted' : 'denied',
    'ad_user_data': isGranted ? 'granted' : 'denied',
    'ad_personalization': isGranted ? 'granted' : 'denied',
    'analytics_storage': isGranted ? 'granted' : 'denied',
    'wait_for_update': 500
  });
</script>
```

### B. Dynamic Consent Update
When a user clicks "Accept" on your cookie banner, trigger a consent update:

```javascript
function updateConsentGranted() {
  localStorage.setItem('cookie-consent', 'granted');
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
  }
}
```

---

## 4. Safe Framework Ad Component Pattern

Rendering empty dashed boxes ("Ad Placeholder") or pushing ads on unverified slot IDs causes immediate policy violations for *unfilled/misleading ad slots*.

Use this reusable React/TypeScript pattern:

```tsx
import { useEffect } from 'react';

interface AdUnitProps {
  slotId?: string;
  publisherId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdUnit({ 
  slotId, 
  publisherId = "ca-pub-XXXXXXXXXXXXXXXX", // Replace with your publisher ID
  format = "auto" 
}: AdUnitProps) {
  // Hide component cleanly if slotId is missing or unassigned during site review phase
  if (!slotId || slotId.includes('dummy') || slotId === '1234567890') {
    return null;
  }

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [slotId]);

  return (
    <div className="ad-container my-4 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '250px', minHeight: '90px' }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

---

## 5. Mandatory Legal & E-E-A-T Pages

AdSense reviewers manually inspect site ownership and legal disclosures. Every web app must feature these 3 pages linked prominently in the header/footer:

### A. About Us Page (`/about`)
- **Mission & Purpose**: Explain what problem the app solves.
- **Publisher/Team Background**: Identify the operating entity or developer.
- **Methodology**: Explain how calculations, data, or tools work.
- **Word Count**: 300+ words of original content.

### B. Contact Us Page (`/contact`)
- **Direct Email**: Provide a valid support email address (e.g. `support@yourdomain.com`).
- **Physical Address/Jurisdiction**: State city, state/province, and country of operation.
- **Functional Communication**: Ensure forms or contact links work reliably.

### C. Privacy Policy Page (`/privacy-policy`)
- **Advertising Disclosures**: State that third-party vendors (including Google) use cookies to serve ads based on user visits.
- **Google DART Cookie**: Mention how users can opt out via [Google Ads Settings](https://www.google.com/settings/ads).
- **Analytics Disclosures**: List analytics tools used (e.g., Google Analytics 4).
- **User Data Rights**: Explicitly detail GDPR / CCPA opt-out and deletion rights.

---

## 6. Content Depth & Structural SEO Guidelines

To avoid the **Low Value Content** rejection:

1. **Word Count Target**: Main landing pages should contain **600 to 1,200+ words** of structured, helpful text surrounding the core tool/utility.
2. **Page Sections**:
   - `H1`: Clear, keyword-focused title describing the primary utility.
   - `H2`: Step-by-step "How to Use" guide.
   - `H2`: Detailed explanation of underlying methodology or calculations.
   - `H2`: Collapsible FAQ section addressing common search queries.
3. **JSON-LD Schema Markup**: Include rich structured data in `<head>`:
   - `WebApplication`: Software category, free usage ($0 pricing).
   - `FAQPage`: Question and answer schema for rich search snippets.
   - `HowTo`: Step-by-step usage instructions.
   - `Organization`: Operating entity contact details and branding.

---

## 7. Rejection Reason & Resolution Matrix

| Rejection Reason | Primary Cause | Solution |
|---|---|---|
| **Low Value Content** | App is a bare input form with no supporting copy. | Add 800+ words of explanatory text, step-by-step guides, and an FAQ section. |
| **Valuable Inventory: No Content** | SPA renders an empty root `<div>` to static crawlers. | Implement Static Site Generation (SSG) so raw HTML contains complete text. |
| **Site Under Construction** | Broken links, console errors, or unhandled 404 routes. | Add a custom `404.html`, fix broken links, and verify zero JS execution errors. |
| **Site Navigation Issues** | Missing legal pages or hidden navigation menus. | Add sticky header + footer with direct links to `/about`, `/contact`, and `/privacy-policy`. |
| **Policy Violation: Unfilled Ad Slots** | Rendering empty placeholder boxes ("Ad Space Here"). | Remove fake ad boxes. Hide `AdUnit` components until site is pre-approved. |
| **Consent Mode Violation** | Missing default consent states for EU/EEA visitors. | Implement Consent Mode v2 inline script in `<head>` defaulting to `denied`. |
| **Duplicate Content / Multiple Canonicals** | All routes serve identical `<link rel="canonical" href="/">`. | Configure pre-renderer or build tool to set page-specific canonical URLs. |

---

## 8. Pre-Submission Verification Checklist

Run this final check before requesting review in the AdSense Console:

- [ ] Web app served over secure **HTTPS** with valid SSL certificate.
- [ ] Primary domain matches canonical settings (e.g. `www.yourdomain.com`).
- [ ] Raw HTML verified via `curl -s https://yourdomain.com | grep "<h1>"` (returns text without JS).
- [ ] `/about`, `/contact`, and `/privacy-policy` pages exist and are linked in footer/header.
- [ ] Direct contact email and physical location visible on `/contact`.
- [ ] Google Consent Mode v2 inline script present in `<head>` before analytics/ads.
- [ ] No empty ad placeholder boxes or fake ad containers visible anywhere on the site.
- [ ] `sitemap.xml` submitted and indexed in Google Search Console.
- [ ] Zero broken internal links or soft 404 errors.

---
*Universal AdSense Approval Blueprint — Ready to copy and reuse across any web application project.*
