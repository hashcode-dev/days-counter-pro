# Design System & Application UI Architecture Specification (`design.md`)

This document defines the complete visual design system, UI layout architecture, typography, color palette, component design, micro-interactions, and design tokens used in **Day Counter Pro**. Use this specification as a blueprint to replicate, adapt, or extend the design system in other modern web applications.

---

## 1. Design Vision & Core Principles

- **Utility-First & Scanner-Friendly**: High contrast metrics, clear typography hierarchy, and immediate visual feedback.
- **Modern Glassmorphism & Elevation**: Layered surface cards (`#faf8ff` surface with white card containers) enhanced with subtle `backdrop-filter` glass rules and smooth shadow transitions on hover.
- **Accessible & Responsive**: Fully responsive grid layout across mobile, tablet, and desktop viewports, enforcing standard touch targets and WCAG color contrast recommendations.
- **Consistent Visual Language**: Unified icon ecosystem ([Lucide React](https://lucide.dev)), distinct metric color-coding, and harmonious rounded geometry (`rounded-xl`, `rounded-lg`).

---

## 2. Design Tokens & Theme Configuration

### 2.1 CSS Theme Variables (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  /* Brand & Theme Palette */
  --color-primary: #3525cd;
  --color-primary-container: #4f46e5;
  --color-on-primary-container: #dad7ff;
  --color-secondary: #712ae2;
  --color-tertiary: #00505f;

  /* Surfaces & Containers */
  --color-surface: #faf8ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f2f3ff;
  --color-surface-container-highest: #dae2fd;

  /* Typography & Outlines */
  --color-on-surface: #131b2e;
  --color-on-surface-variant: #464555;
  --color-outline: #777587;
  --color-outline-variant: #c7c4d8;

  /* Fonts */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

### 2.2 Functional & Metric Palette

| Role | Color Hex | Tailwind Class | Application / Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#3525cd` / `#2563eb` | `bg-blue-600` / `text-blue-600` | Header logo badge, primary active tabs, main action buttons |
| **Primary Accent** | `#4f46e5` | `bg-indigo-600` / `text-indigo-600` | Hero highlights, metric highlights (Total Days), primary card headers |
| **Secondary Accent** | `#712ae2` | `bg-purple-600` / `text-purple-600` | Secondary metrics (Business Days), gradient end-points |
| **Tertiary Accent** | `#059669` | `bg-emerald-600` / `text-emerald-600` | Duration metrics (Weeks / Months), success indicators |
| **Dark Neutral Text**| `#131b2e` / `#0f172a` | `text-slate-900` | Primary headings (`h1`, `h2`), card title text |
| **Muted Text** | `#464555` / `#64748b` | `text-slate-500` | Form labels, helper text, descriptions, timestamps |
| **Surface Canvas** | `#faf8ff` / `#f8fafc` | `bg-slate-50` / `bg-[#faf8ff]` | App background canvas |
| **Card Surface** | `#ffffff` | `bg-white` | Floating card components, modals, inputs |

---

## 3. Typography & Hierarchy

### Font Family
`Inter` (weights: `300` Light, `400` Regular, `500` Medium, `600` Semi-Bold, `700` Bold, `800` Extra-Bold).

### Scale & Rules

```html
<!-- Page Title (H1) -->
<h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
  Hero Header Text — <span class="text-blue-600">Highlighted Callout</span>
</h1>

<!-- Section Heading (H2) -->
<h2 class="text-2xl font-bold text-slate-900 tracking-tight">
  Section Title
</h2>

<!-- Card Title (H3 / H4) -->
<h3 class="text-lg font-semibold text-slate-900">
  Card Title
</h3>

<!-- Large Metric Number -->
<div class="text-2xl font-bold text-indigo-600">
  42
</div>

<!-- Body & Subtitles -->
<p class="text-sm md:text-base text-slate-500">
  Standard descriptive paragraph text.
</p>

<!-- Form Label / Small Metadata -->
<label class="text-xs font-semibold text-slate-600 uppercase tracking-wider">
  Start Date
</label>
```

---

## 4. Elevational & Glassmorphic Utilities

### 4.1 Custom CSS Utilities (`src/index.css`)

```css
/* Glassmorphism Effect */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(199, 196, 216, 0.3);
}

/* Subtle Base Card Shadow */
.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
}

/* Hover Elevation & Lift Animation */
.card-shadow-hover {
  transition: all 0.2s ease;
}

.card-shadow-hover:hover {
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

/* Multi-Tone Linear Gradients */
.timeline-gradient {
  background: linear-gradient(90deg, #4f46e5 0%, #712ae2 100%);
}
```

---

## 5. Component System Architecture

### 5.1 Sticky Header Navigation
- **Height**: `h-16` (64px)
- **Background**: `bg-white/80 backdrop-blur-md` or `bg-white border-b border-slate-200`
- **Position**: `sticky top-0 z-50`
- **Elements**: Brand logo mark (`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white`) + title + inline link navigation.

```tsx
<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 sticky top-0 z-50">
  <div className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
      <Calendar size={18} strokeWidth={2.5} />
    </div>
    <span className="text-xl font-bold text-slate-900 tracking-tight">App Title</span>
  </div>
  <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
    <a href="#feature" className="text-slate-600 hover:text-slate-900 transition-colors">Feature</a>
  </nav>
</header>
```

### 5.2 Form Inputs & Controls
- **Inputs**: `w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all`
- **Checkbox / Toggles**: Custom styled accent checkbox (`rounded border-slate-300 text-blue-600 focus:ring-blue-500`).
- **Quick Preset Pills / Chips**: `px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer`.

### 5.3 Metric Result Box Component
Provides high scannability for statistical, numeric, or calculated outputs.

```tsx
function ResultBox({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
}
```

### 5.4 Feature Cards / Preset Card Grid
Cards represent interactive items, preset countdowns, or product features.
- **Card Container**: `bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-shadow-hover`
- **Header Icon Badge**: `w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3`
- **Action Button**: Clean full-width secondary button (`w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-sm font-medium transition-colors`).

### 5.5 Action Buttons
- **Primary Button**: `px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2`
- **Secondary / Ghost Button**: `px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg transition-all`
- **Icon Buttons**: `p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors`

---

## 6. Layout Grid & Structure

```
+-------------------------------------------------------------------+
|                        Sticky Header (h-16)                        |
+-------------------------------------------------------------------+
|                        Hero Section (bg-slate-50)                 |
|                   Centered Heading + Short Lead Subtitle          |
+-------------------------------------------------------------------+
|                                                                   |
|   Main Content Container (max-w-6xl mx-auto px-4 py-8 grid/flex)  |
|                                                                   |
|   +---------------------------------+ +-----------------------+   |
|   | Primary Tool / Interactive Card | | Secondary Column /    |   |
|   | (Input controls, Preset chips,  | | Metric summary /      |   |
|   |  Result displays)               | | Sidebar content)     |   |
|   +---------------------------------+ +-----------------------+   |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   | Grid Section: 1 col (mobile) -> 2 col (md) -> 3 col (lg)  |   |
|   | (Preset Countdowns, Feature Cards, Event Items)           |   |
|   +-----------------------------------------------------------+   |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   | Content & FAQ Accordion Section                           |   |
|   +-----------------------------------------------------------+   |
|                                                                   |
+-------------------------------------------------------------------+
|                        Footer (bg-slate-900 text-white)           |
+-------------------------------------------------------------------+
```

---

## 7. Responsive Breakpoint Guide

- **Mobile (`< 640px`)**: Single column grid (`grid-cols-1`), compact padding (`px-4`), full-width action buttons.
- **Tablet (`640px - 1024px`)**: 2-column card layouts (`grid-cols-2`), expanded navigation padding (`px-6`).
- **Desktop (`>= 1024px`)**: 3-column or 4-column feature grids (`grid-cols-3` / `grid-cols-4`), max content container capped at `max-w-6xl` or `max-w-7xl` centered (`mx-auto`).

---

## 8. Micro-Interactions & User Feedback

1. **Hover Micro-Lifts**: Interactive cards translate `-2px` on the Y-axis with an expanded shadow tint (`rgba(15, 23, 42, 0.1)`).
2. **Instant Feedback Triggers**:
   - Copy actions switch icon state immediately from `<Copy />` to `<Check className="text-emerald-600" />` with a 2-second timeout.
   - Preset chips update form inputs reactively without page reloads.
3. **Smooth Scroll Behavior**: HTML container uses `scroll-behavior: smooth` for smooth anchor links.

---

## 9. Reusability Guide for Future Applications

To apply this design system to another web application project:

1. **Include Dependencies**:
   - Tailwind CSS v4 (`@import "tailwindcss";` & `@theme`).
   - Lucide React (`lucide-react`) for consistent iconography.
   - Google Font `Inter`.
2. **Setup Base CSS**: Copy the `@theme` definitions, `.glass`, `.card-shadow`, and `.card-shadow-hover` classes to your application's `index.css`.
3. **Reuse Core Layout Components**:
   - Navigation Header with logo badge (`w-8 h-8 bg-blue-600 rounded-lg`).
   - Standard input fields and button styles defined in Section 5.
   - `ResultBox` component for metric dashboards.
4. **Maintain Color Role Rules**: Keep brand actions in Primary (`#2563eb`), key highlight metrics in Accent (`#4f46e5` / `#712ae2`), and surface containers in neutral slate.
