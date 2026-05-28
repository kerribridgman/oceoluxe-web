# Phase 1D — Motion Refinement

## Context

Phases 1A (copy), 1B (dark palette), and 1C (media architecture) are complete. The site has an `AnimateIn` component (`components/animate-in.tsx`) using IntersectionObserver with four variants: `fade-up`, `fade-in`, `slide-left`, `slide-right`. CSS keyframes use editorial easing (`cubic-bezier(0.22, 1, 0.36, 1)`). Delay utilities exist (100–500ms). Tier cards already stagger via manual `delay` props.

**What's missing:** No `prefers-reduced-motion` support (accessibility gap). All hero content animates as a single block instead of staggering h1 → subtitle → CTA. Pull-quotes have no entrance animation. No scroll-aware section reveals.

**Branch:** `feat/rebrand-operational-partner`

---

## Approach

Zero new dependencies. All animations stay pure CSS + IntersectionObserver. The `AnimateIn` component gets one new variant (`reveal-quote`). Hero content on every page gets broken into staggered AnimateIn wrappers. A global `prefers-reduced-motion` rule disables all motion for accessibility.

---

## CSS Changes — `app/globals.css`

### 1. `prefers-reduced-motion` (accessibility — mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Place at the end of the file, after all animation definitions.

### 2. Pull-quote reveal keyframe + utility

```css
@keyframes revealQuote {
  from {
    opacity: 0;
    border-left-color: transparent;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    border-left-color: var(--color-dusty-rose);
    transform: translateX(0);
  }
}
```

```css
.animate-reveal-quote {
  animation: revealQuote 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

### 3. Slow duration modifier

```css
.animate-slow {
  animation-duration: 1.1s;
}
```

For body text sections that benefit from a slightly more deliberate pace.

---

## Component Changes

### `components/animate-in.tsx`

Add `'reveal-quote'` to the animation union type and the `animationClasses` map:

```diff
- animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
+ animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'reveal-quote';
```

```diff
  'slide-right': 'animate-reveal-slide-right',
+ 'reveal-quote': 'animate-reveal-quote',
```

No other changes to AnimateIn.

### `components/marketing/marketing-header.tsx`

Add `backdrop-blur-sm` to the non-scrolled dark state for a subtle glass effect from page load:

```diff
- ? 'bg-[var(--color-ink)] border-b border-[var(--color-taupe)]/10'
+ ? 'bg-[var(--color-ink)]/95 backdrop-blur-sm border-b border-[var(--color-taupe)]/10'
```

---

## Per-Page Changes — Hero Stagger

Every marketing page currently wraps all hero content in a single `<AnimateIn animation="fade-in">`. Phase 1D breaks these into staggered reveals:

- **h1** → `<AnimateIn animation="fade-in">` (no delay — appears first)
- **subtitle/tagline** → `<AnimateIn animation="fade-up" delay={200}>`
- **CTA buttons** → `<AnimateIn animation="fade-up" delay={400}>`

This uses the existing component and delay system. No new components needed.

### Home (`app/page.tsx`)

**Hero:** Split the single AnimateIn into three:
- h1 (fade-in, no delay)
- p + script tagline (fade-up, 200ms)
- CTA buttons div (fade-up, 400ms)

**Gradient divider:** Wrap in `<AnimateIn animation="fade-in">` so it reveals on scroll.

**Tier heading section:** Already uses AnimateIn. No change.

**Tier cards:** Already staggered (100/200/300ms delays). No change.

### About (`app/about/page.tsx`)

**Hero:** Split into two:
- h1 (fade-in, no delay)
- Tagline (fade-up, 200ms)

Body sections and portrait already use individual AnimateIn. No change.

### Work With Oceo Luxe (`app/work-with-oceo-luxe/page.tsx`)

**Hero:** Split into two:
- h1 (fade-in, no delay)
- p subtitle (fade-up, 200ms)

Tier cards already staggered. No change.

### Operational Partnership (`app/operational-partnership/page.tsx`)

**Hero:** Split into three:
- h1 (fade-in, no delay)
- p subtitle (fade-up, 200ms)
- "Application-only" label (fade-up, 400ms)

**Pull-quote:** Change from parent `<AnimateIn>` to `<AnimateIn animation="reveal-quote">` on the `<blockquote>` element itself.

### Strategic Alignment (`app/strategic-operational-alignment/page.tsx`)

**Hero:** Same three-part stagger as Op Partnership.

**Pull-quote:** Same reveal-quote treatment.

### Studio Systems (`app/studio-systems/page.tsx`)

**Hero:** Split into three:
- h1 (fade-in, no delay)
- p subtitle (fade-up, 200ms)
- "Maximum five hours" label (fade-up, 400ms)

**Pull-quote:** Same reveal-quote treatment.

### Apply (`app/apply/page.tsx`)

**Hero:** Split into two:
- h1 (fade-in, no delay)
- p intro (fade-up, 200ms)

Form and testimonial sections already animated via `apply-form.tsx`. No change.

---

## File Summary

**Modified files (10):**

| File | Change |
|------|--------|
| `app/globals.css` | `prefers-reduced-motion`, `revealQuote` keyframe, `.animate-slow` |
| `components/animate-in.tsx` | Add `reveal-quote` variant |
| `components/marketing/marketing-header.tsx` | Backdrop blur on non-scrolled state |
| `app/page.tsx` | Hero stagger, divider fade |
| `app/about/page.tsx` | Hero stagger |
| `app/work-with-oceo-luxe/page.tsx` | Hero stagger |
| `app/operational-partnership/page.tsx` | Hero stagger + pull-quote reveal |
| `app/strategic-operational-alignment/page.tsx` | Hero stagger + pull-quote reveal |
| `app/studio-systems/page.tsx` | Hero stagger + pull-quote reveal |
| `app/apply/page.tsx` | Hero stagger |

**New files:** None.

---

## Implementation Order

1. CSS: `prefers-reduced-motion` + `revealQuote` keyframe + `.animate-slow`
2. `animate-in.tsx`: add `reveal-quote` variant
3. `marketing-header.tsx`: backdrop blur
4. Home page hero stagger + divider
5. About page hero stagger
6. Work With page hero stagger
7. Op Partnership hero stagger + pull-quote
8. Strategic Alignment hero stagger + pull-quote
9. Studio Systems hero stagger + pull-quote
10. Apply page hero stagger

---

## What This Does NOT Touch

- Blog pages (light theme, no marketing animations)
- Dashboard/Studio routes
- MarketingShell, MarketingFooter
- `apply-form.tsx` (client form — already has AnimateIn on testimonial)
- Media slot components (Phase 1C)
- Any copy (Phase 1A)
- Any colors (Phase 1B)
- Mobile menu (works as-is)

---

## Verification

1. `pnpm build` passes with zero errors
2. All heroes stagger: h1 appears first, subtitle 200ms later, CTA 400ms after
3. Pull-quotes on Op Partnership, Strategic Alignment, Studio Systems use reveal-quote animation
4. `prefers-reduced-motion` media query present — all animations disabled when OS motion is reduced
5. Header shows subtle backdrop blur on initial load (non-scrolled state)
6. Gradient divider on home page fades in on scroll
7. Blog pages completely unaffected
8. Dashboard routes completely unaffected
9. Existing tier card stagger still works unchanged
