# Styling Guide

This document explains the centralized CSS system for the Patrick Farrell website.

## Overview

All brand colors, fonts, and common styles are defined in `/app/globals.css`. To change the site's appearance, simply modify the CSS variables in that file.

## Quick Start

### Changing Brand Colors

Edit `/app/globals.css` and update these variables:

```css
:root {
  /* Primary brand color (blue) */
  --brand-blue: #4a9fd8;
  --brand-blue-hover: #3a8fc8;

  /* Background color (navy) */
  --brand-navy: #1a2332;
  --brand-navy-medium: #1e2838;
  --brand-navy-light: #2a3342;
}
```

### Changing Fonts

Update the font family variable:

```css
:root {
  --font-family-primary: "Raleway", sans-serif;
}
```

## Available Utility Classes

### Background Colors

Instead of hardcoded colors like `bg-[#4a9fd8]`, use:

- `bg-brand-primary` - Primary blue color
- `bg-brand-primary-hover` - Darker blue for hover states
- `bg-brand-primary-light` - Light blue background
- `bg-brand-navy` - Navy background
- `bg-brand-navy-medium` - Medium navy
- `bg-brand-gradient` - Branded gradient
- `bg-brand-gradient-navy` - Navy gradient

### Text Colors

- `text-brand-primary` - Blue text
- `text-brand-primary-hover` - Darker blue text
- `text-brand-navy` - Navy text
- `hover:text-brand-primary` - Blue text on hover

### Border Colors

- `border-brand-primary` - Blue border
- `border-brand-navy` - Navy border
- `border-brand-navy-light` - Light navy border
- `hover:border-brand-primary` - Blue border on hover

### Focus States

- `focus:ring-brand-primary` - Blue focus ring
- `focus:border-brand-primary` - Blue border on focus

### Opacity Variants

- `bg-brand-primary/10` - 10% opacity blue background
- `bg-brand-primary/20` - 20% opacity blue background
- `border-brand-primary/50` - 50% opacity blue border
- `text-brand-primary/10` - 10% opacity blue text

## Component Classes

Pre-styled component classes for common patterns:

### Buttons

```tsx
<button className="btn-brand-primary">
  Click Me
</button>
```

### Inputs

```tsx
<input className="input-brand" />
```

### Cards

```tsx
<div className="card-brand">
  Content here
</div>
```

### Headers & Footers

```tsx
<header className="header-brand">...</header>
<footer className="footer-brand">...</footer>
```

### Sidebar Links

```tsx
<a className="sidebar-link-active">
  Active Link
</a>
```

## Migration Examples

### Before (Hardcoded)

```tsx
<Button className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white">
  Save
</Button>
```

### After (Using Utility Classes)

```tsx
<Button className="bg-brand-primary hover:bg-brand-primary-hover text-white">
  Save
</Button>
```

Or even simpler:

```tsx
<Button className="btn-brand-primary">
  Save
</Button>
```

### Before (Hardcoded Gradient)

```tsx
<div className="bg-gradient-to-br from-[#1a2332] via-[#1e2838] to-[#1a2332]">
  Content
</div>
```

### After (Using Utility Class)

```tsx
<div className="bg-brand-gradient-navy">
  Content
</div>
```

### Before (Hardcoded Border with Opacity)

```tsx
<div className="border border-[#4a9fd8]/20 hover:border-[#4a9fd8]/50">
  Content
</div>
```

### After (Using Utility Classes)

```tsx
<div className="border border-brand-primary/20 hover:border-brand-primary/50">
  Content
</div>
```

## Status Colors

Pre-defined status colors for common UI patterns:

```css
--color-success: #10b981;      /* Green */
--color-warning: #f59e0b;      /* Orange */
--color-error: #ef4444;        /* Red */
--color-info: var(--brand-blue); /* Blue */
```

Use these with Tailwind's standard utilities:
- `bg-[var(--color-success)]`
- `text-[var(--color-error)]`
- `border-[var(--color-warning)]`

## Gray Scale

Standard gray scale from 50 (lightest) to 900 (darkest):

```css
--gray-50 through --gray-900
```

Use with Tailwind utilities or custom CSS:
- `text-gray-600`
- `bg-gray-100`
- `border-gray-200`

## Advanced: Creating New Theme Variants

To add a new color scheme, add it to `:root` in globals.css:

```css
:root {
  --brand-accent: #ff6b6b;
  --brand-accent-hover: #ff5252;
}
```

Then add utility classes:

```css
@layer utilities {
  .bg-brand-accent {
    background-color: var(--brand-accent);
  }

  .hover\:bg-brand-accent:hover {
    background-color: var(--brand-accent-hover);
  }
}
```

## Dark Mode Support

All brand colors automatically adjust for dark mode:

```css
.dark {
  --brand-blue: #4a9fd8;
  --brand-blue-hover: #5aafea;  /* Lighter for dark backgrounds */
  --brand-navy: #0f1419;         /* Darker navy */
}
```

## Best Practices

1. **Always use utility classes** instead of hardcoded colors
2. **Use component classes** for repeated patterns
3. **Modify only globals.css** to change the theme
4. **Test both light and dark modes** after changes
5. **Keep opacity variants consistent** (10, 20, 50 are standard)

## Common Patterns

### Primary CTA Button

```tsx
<Button className="bg-brand-primary hover:bg-brand-primary-hover text-white">
  Get Started
</Button>
```

### Card with Brand Hover Effect

```tsx
<Card className="card-brand">
  <CardContent>...</CardContent>
</Card>
```

### Input with Brand Focus

```tsx
<Input className="input-brand" />
```

### Gradient Hero Section

```tsx
<section className="bg-brand-gradient-navy">
  <div className="container">...</div>
</section>
```

## Troubleshooting

### Colors not updating?

1. Check that you're using utility classes, not hardcoded values
2. Ensure globals.css is imported in layout.tsx
3. Clear browser cache and rebuild: `pnpm dev`

### New utility class not working?

1. Make sure it's defined in @layer utilities in globals.css
2. Restart the dev server
3. Check for typos in variable names

## Reference

All CSS variables and utilities are defined in:
- `/app/globals.css` - Main stylesheet with all brand customization
