---
inclusion: auto
name: CSS Patterns
description: "CSS conventions: variables, responsive design, naming, layout patterns."
---

# CSS Patterns

## 🎨 CSS Variables
All colors, fonts, and spacing defined in `:root`:
```css
:root {
  /* Colors - never hardcode */
  --color-primary: ...;
  --color-text: ...;
  --color-background: ...;
  
  /* Typography */
  --font-heading: 'Lufga', sans-serif;
  --font-body: 'Noto Sans', sans-serif;
  
  /* Spacing (8px grid) */
  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 1.5rem;   /* 24px */
  --spacing-lg: 2rem;     /* 32px */
  --spacing-xl: 3rem;     /* 48px */
}
```

## 📱 Responsive Breakpoints
Mobile-first approach — base styles for mobile, then enhance:
```css
/* Mobile (default) */
.component { ... }

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large desktop */
@media (min-width: 1440px) { ... }
```

## 🏷️ Naming Conventions
BEM-like naming:
```css
.section-hero { }           /* Block */
.section-hero__title { }    /* Element */
.section-hero--dark { }     /* Modifier */
```

## 📐 Layout Patterns
```css
/* Centered container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Flexbox row with gap */
.flex-row {
  display: flex;
  gap: var(--spacing-md);
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
```

## ⚠️ Avoid
- `!important` — fix specificity instead
- Magic numbers — use variables
- Fixed heights — let content dictate
- `px` for fonts — use `rem`
