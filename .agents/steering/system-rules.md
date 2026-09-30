---
inclusion: auto
name: System Rules
description: "Hard constraints: forbidden patterns, quality gates, static site best practices."
---

# System Rules

## 🚫 Forbidden
| Pattern | Use Instead |
|---------|-------------|
| Inline styles | CSS classes in stylesheet |
| `!important` | Proper CSS specificity |
| Fixed `px` for fonts | `rem` units |
| Missing `alt` attrs | Descriptive alt text |
| Hardcoded colors | CSS variables (`--color-*`) |
| Non-semantic HTML | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` |
| `<div>` soup | Semantic elements with meaning |
| Empty `href="#"` | Proper links or `button` elements |

## 🧪 Quality Gates
- **HTML:** Valid structure, no broken links
- **CSS:** No unused selectors, proper specificity
- **Images:** All have `alt`, optimized sizes
- **Accessibility:** WCAG AA compliance

## 📁 File Conventions
| Type | Path |
|------|------|
| Root pages | `/*.html` |
| Sub-landing pages | `/for-{audience}/*.html` |
| Stylesheets | `css/styles.css`, `for-*/css/styles.css` |
| Scripts | `js/main.js`, `for-*/js/main.js` |
| Images | `images/`, `for-*/images/` |

## 🔑 Invariants
1. Mobile-first CSS (min-width breakpoints)
2. CSS variables for all colors
3. Semantic HTML structure
4. Alt text on all images
5. Consistent nav/footer across pages

## References
- `#[[file:CLAUDE.md]]`
- `#[[file:css/styles.css]]`
