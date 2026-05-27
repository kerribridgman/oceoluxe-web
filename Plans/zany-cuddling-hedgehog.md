# Phase 1B — Visual Foundation (Dark Palette Overhaul)

## Context

Phase 1A (copy) is complete. The Oceo Luxe site currently uses a cream-base (#faf8f5) with charcoal accents (#3B3937). Phase 1B flips this: ink/charcoal base with cream as accent text and punctuation. The rebrand plan describes this as "the YSL editorial direction — confident, dark, warm."

The codebase has ~1,458 hardcoded hex color references across 66 files (Tailwind arbitrary values like `bg-[#faf8f5]`, `text-[#3B3937]`), bypassing the existing CSS custom property system. The marketing pages all share `MarketingHeader` and `MarketingFooter` components. Blog pages also use these components and must stay light-themed.

**Branch:** `feat/rebrand-operational-partner` (current)
**Latest commit:** `a8f2661`

---

## Approach

**Strategy: CSS Foundation + MarketingShell Wrapper + Theme Prop**

Rather than restructuring route groups (which would mean moving 25+ page directories), we:
1. Add the new dark palette as CSS custom properties (additive, zero risk)
2. Create a `MarketingShell` wrapper component with ink background
3. Add a `theme` prop to `MarketingHeader` and `MarketingFooter` (dark default, blog passes light)
4. Update each marketing page to use the new palette, systematically

The root layout's `bg-gray-50` on `<body>` cannot change — it bleeds to dashboard and studio routes. MarketingShell handles the marketing-specific background.

---

## Execution Steps

### Step 1: CSS Custom Properties — New Palette
**File:** `app/globals.css` (lines 18-110)

Add the new palette variables to `:root` alongside the existing ones:
```css
/* Phase 1B — Dark Editorial Palette */
--color-ink: #1A1A1A;
--color-charcoal: #2B2926;
--color-cream: #F4EFE6;
--color-bone: #E8DFD0;
--color-taupe: #8B7D6B;
--color-dusty-rose: #C9A0A0;
--color-rose-deep: #A87878;
```

Update the `@theme` block to register these as Tailwind colors so we can use `bg-ink`, `text-cream`, etc.

Update ambient glow and text-glow utilities to use new rose values (`#C9A0A0` instead of `#CDA7B2`).

Update the `.divider-gradient` to use the new dusty-rose value.

### Step 2: Typography Scale Utilities
**File:** `app/globals.css`

Add fluid typography utilities using `clamp()` per the rebrand plan:
```css
.text-display   { font-size: clamp(3rem, 5vw + 1rem, 8rem); line-height: 0.95; letter-spacing: -0.02em; }
.text-h1        { font-size: clamp(2.5rem, 4vw + 1rem, 5.5rem); line-height: 1.0; letter-spacing: -0.015em; }
.text-h2        { font-size: clamp(2rem, 3vw + 0.5rem, 3.5rem); line-height: 1.1; }
.text-h3        { font-size: clamp(1.5rem, 2vw + 0.5rem, 2.25rem); line-height: 1.2; }
.text-body-lg   { font-size: clamp(1.125rem, 1vw + 0.5rem, 1.25rem); line-height: 1.6; }
.text-body      { font-size: clamp(1rem, 0.8vw + 0.5rem, 1.0625rem); line-height: 1.7; }
.text-label     { font-size: clamp(0.75rem, 0.5vw + 0.5rem, 0.8125rem); letter-spacing: 0.15em; text-transform: uppercase; }
```

### Step 3: MarketingShell Wrapper Component
**New file:** `components/marketing/marketing-shell.tsx`

A simple wrapper that provides the ink background for all marketing pages:
```tsx
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      {children}
    </div>
  );
}
```

Each marketing page currently has `<div className="min-h-screen bg-[#faf8f5]">`. We replace that with `<MarketingShell>`.

### Step 4: MarketingHeader — Theme Prop
**File:** `components/marketing/marketing-header.tsx`

Add `theme?: 'dark' | 'light'` prop (defaults to `'dark'`):

- **`theme="dark"` (new default for marketing pages):**
  - Initial state (not scrolled): ink bg, cream text, cream logo
  - Scrolled state: charcoal bg with backdrop blur, cream text
  - Apply button: cream pill on dark bg
  - Dropdown: charcoal bg, cream/bone text
  - Mobile menu: charcoal bg, cream text

- **`theme="light"` (for blog pages):**
  - Preserves current behavior: cream bg, taupe/charcoal text
  - Scrolled state: charcoal bg with white text (as it is now)

Key color replacements in this file:
- `bg-[#faf8f5]` → conditional on theme
- `text-[#3B3937]` / `text-[#967F71]` → conditional on theme
- `bg-[#3B3937]` scrolled bg → `bg-[var(--color-charcoal)]`
- Dropdown `bg-white` → `bg-[var(--color-charcoal)]` when dark
- Mobile menu `bg-[#E8D4DB]` → `bg-[var(--color-charcoal)]` when dark

### Step 5: MarketingFooter — Theme Prop
**File:** `components/marketing/marketing-footer.tsx`

Add `theme?: 'dark' | 'light'` prop (defaults to `'dark'`):

- **`theme="dark"`:** ink bg, cream text, bone/taupe secondary text, dusty-rose tagline, taupe hairline borders
- **`theme="light"`:** preserves current cream bg with taupe/charcoal text

Key color replacements:
- `bg-[#faf8f5]` → `bg-[var(--color-ink)]` or cream based on theme
- `text-[#3B3937]` → `text-[var(--color-cream)]` or charcoal based on theme
- `text-[#967F71]` → `text-[var(--color-taupe)]` or existing
- `text-[#CDA7B2]` → `text-[var(--color-dusty-rose)]`
- `border-[#967F71]/10` → `border-[var(--color-taupe)]/10` or `border-[var(--color-taupe)]/20` for dark visibility

### Step 6: Update Marketing Pages — Color Swap

Each marketing page gets:
1. Outer `<div className="min-h-screen bg-[#faf8f5]">` replaced with `<MarketingShell>`
2. Section backgrounds flipped: `bg-white` sections become `bg-[var(--color-charcoal)]`, `bg-[#faf8f5]` sections become `bg-[var(--color-ink)]`
3. Text colors flipped: `text-[#3B3937]` becomes `text-[var(--color-cream)]`, `text-[#967F71]` becomes `text-[var(--color-bone)]` or `text-[var(--color-taupe)]`
4. Border colors: `border-[#EDEBE8]` becomes `border-[var(--color-taupe)]/20`
5. Rose accents: `text-[#CDA7B2]` becomes `text-[var(--color-dusty-rose)]`
6. Typography classes upgraded where appropriate

**Pages in order:**

| # | Page | File | Notes |
|---|------|------|-------|
| 1 | Home | `app/page.tsx` | Largest page, 5 sections. Dark CTA section stays dark but uses new palette. Tier cards get charcoal bg with cream text. |
| 2 | Work With | `app/work-with-oceo-luxe/page.tsx` | 2 sections. Tier cards match Home treatment. |
| 3 | Operational Partnership | `app/operational-partnership/page.tsx` | 4 sections. Has editorial image already. |
| 4 | Strategic Alignment | `app/strategic-operational-alignment/page.tsx` | 4 sections. |
| 5 | Studio Systems | `app/studio-systems/page.tsx` | 4 sections with pull-quote. |
| 6 | About | `app/about/page.tsx` | 2-column layout with portrait. |
| 7 | Apply | `app/apply/page.tsx` | **Highest risk** — form inputs need dark-bg treatment. |
| 8 | Contact | `app/contact/page.tsx` | Form page, similar treatment to Apply. |

### Step 7: Form Inputs on Dark Backgrounds
**Files:** `app/apply/page.tsx`, `app/contact/page.tsx`

Form inputs currently use `bg-white border-[#EDEBE8]`. On ink background:
- Input bg: `bg-[var(--color-charcoal)]` with `border-[var(--color-taupe)]/30`
- Input text: `text-[var(--color-cream)]`
- Placeholder text: `placeholder:text-[var(--color-taupe)]`
- Focus state: `focus:border-[var(--color-dusty-rose)] focus:ring-[var(--color-dusty-rose)]`
- Labels: `text-[var(--color-cream)]`
- Helper text: `text-[var(--color-bone)]`
- Privacy consent box: charcoal bg with taupe border
- Select dropdown: same dark treatment

### Step 8: Button Treatment
**Files:** All marketing pages (inline button classes)

Per the rebrand plan:
- Primary CTA on dark bg: `bg-[var(--color-cream)] text-[var(--color-ink)]` (cream pill on dark)
- Primary CTA on cream bg: `bg-[var(--color-ink)] text-[var(--color-cream)]` (ink pill on cream)
- No drop shadows, no gradients on primary CTAs
- Secondary CTA: underline-only with small-caps tracking, using `text-[var(--color-cream)]` or `text-[var(--color-ink)]` depending on surface
- Hover: subtle color shift, keep the existing `hover:-translate-y-0.5` lift

### Step 9: Blog Preservation
**Files:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

These files currently use `MarketingHeader` and `MarketingFooter` with no props. After our changes:
- Add `theme="light"` to both `<MarketingHeader theme="light" />` and `<MarketingFooter theme="light" />`
- Blog page backgrounds (`bg-[#faf8f5]`, `bg-white`) stay as-is
- Blog text colors stay as-is
- No other blog content changes

### Step 10: Layout and Meta Updates
**File:** `app/layout.tsx`

- Update `themeColor` from `'#3B3937'` to `'#1A1A1A'` (line 52)
- No change to body `bg-gray-50` (dashboard/studio need it)
- No change to font loading (Inter, Noto Serif Display, Cormorant Garamond all stay)

### Step 11: Ambient Glow and Utility Updates
**File:** `app/globals.css`

- Update `.text-glow-warm` to use new dusty-rose rgba values
- Update `.ambient-glow-rose` and `.ambient-glow-taupe` to use new palette values
- Update `.divider-gradient` to use new dusty-rose
- Ensure `.font-serif-display` and `.font-script` remain unchanged

### Step 12: Build and Verify

- `pnpm build` — must pass with zero errors
- Visually verify: Home, About, Apply, Blog pages
- Confirm blog pages retain light theme
- Confirm dashboard/studio routes are unaffected

---

## Files Modified (Summary)

| File | Change Type |
|------|-------------|
| `app/globals.css` | Edit — new custom properties, typography utilities, updated glows |
| `components/marketing/marketing-shell.tsx` | **Create** — new wrapper component |
| `components/marketing/marketing-header.tsx` | Edit — add theme prop, dark/light color logic |
| `components/marketing/marketing-footer.tsx` | Edit — add theme prop, dark/light color logic |
| `app/page.tsx` | Edit — dark palette, MarketingShell |
| `app/work-with-oceo-luxe/page.tsx` | Edit — dark palette, MarketingShell |
| `app/operational-partnership/page.tsx` | Edit — dark palette, MarketingShell |
| `app/strategic-operational-alignment/page.tsx` | Edit — dark palette, MarketingShell |
| `app/studio-systems/page.tsx` | Edit — dark palette, MarketingShell |
| `app/about/page.tsx` | Edit — dark palette, MarketingShell |
| `app/apply/page.tsx` | Edit — dark palette, dark form inputs, MarketingShell |
| `app/contact/page.tsx` | Edit — dark palette, dark form inputs, MarketingShell |
| `app/blog/page.tsx` | Edit — add `theme="light"` to header/footer |
| `app/blog/[slug]/page.tsx` | Edit — add `theme="light"` to header/footer |
| `app/layout.tsx` | Edit — themeColor to #1A1A1A |

---

## What This Does NOT Touch

- Dashboard routes (`app/(dashboard)/`)
- Studio routes (`app/(studio)/`)
- Login routes (`app/(login)/`)
- Blog content, structure, or styling (only header/footer theme prop)
- API routes
- Adhara CRM integration
- `components/ui/button.tsx` (shadcn base — we override via inline classes on pages)

---

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Root layout bg change affects dashboard | Using MarketingShell wrapper, not touching root layout bg |
| Blog breaks with dark theme | Theme prop defaults to dark, blog explicitly passes `theme="light"` |
| Form inputs unreadable on dark bg | Explicit dark input styling with contrast-tested colors |
| ~1,458 hardcoded hex values missed | Systematic page-by-page conversion; grep verification after each page |
| Cart/Search components in header break | These already accept `isScrolled` prop; dark theme header logic follows same conditional pattern |

---

## Verification

1. `pnpm build` passes with zero errors
2. Home page renders with ink background, cream text, charcoal section variation
3. Header shows cream logo and nav on ink bg, transitions to charcoal on scroll
4. Footer shows cream text on ink bg with dusty-rose tagline
5. Apply page form inputs are readable with cream text on charcoal inputs
6. Blog pages retain full light theme (cream bg, dark text)
7. Dashboard at `/dashboard` is completely unaffected
8. Tier cards on Home and Work With pages show correct dark treatment
9. About page portrait and bio render correctly on dark background
10. Mobile menu renders correctly with dark theme colors
