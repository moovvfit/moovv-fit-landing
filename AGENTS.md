# Moovv Fit Landing Pages

## 🎯 Mission
Moovv (moovv.fit) — AI-driven healthtech platform for digital MSK and mobility care. Democratizing physical therapy through personalized, accessible MSK solutions.

**Stack:** HTML5 | CSS3 | Vanilla JS | CloudFront | GitHub Actions

## 🤖 Behavior (STRICT)
- **Brevity:** Max 20 words. Status: ✅/🚧/❌/❓
- **Code-first:** Explain only for design deviations.
- **Read → Batch edit:** Check patterns first. One edit per file.
- **No auto-tests.** Only when requested.

## 🚫 Forbidden
| Pattern | Use Instead |
|---------|-------------|
| Inline styles | CSS classes in `css/styles.css` |
| `!important` | Proper specificity |
| Fixed px for fonts | `rem` units |
| Missing `alt` attrs | Descriptive alt text |
| Hardcoded colors | CSS variables (`--color-*`) |
| Non-semantic HTML | Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) |

## 📁 Files
| Type | Path |
|------|------|
| Root pages | `*.html` |
| Physio landing | `for-physios/*.html` |
| Clinic landing | `for-clinics/*.html` |
| Styles | `css/styles.css`, `for-*/css/styles.css` |
| Scripts | `js/main.js`, `for-*/js/main.js` |
| Images | `images/`, `for-*/images/` |

## 🎨 Design System
- **Fonts:** Lufga (headings), Noto Sans (body)
- **Colors:** Use CSS variables defined in `:root`
- **Spacing:** 8px grid system
- **Breakpoints:** Mobile-first (768px, 1024px, 1440px)

## 🚀 Deployment
- **Push to `main`** → GitHub Actions → S3 → CloudFront
- Auto-deploys in ~30s
- Cache invalidation automatic

## 🔧 Shared Skills (via .agents/shared/)
Activate with: `#[[file:.agents/shared/skills/{name}/SKILL.md]]`
- `moovv-design-system` — Brand colors, typography, components

## 📎 Context
- `#[[file:.agents/steering/system-rules.md]]` — Constraints
- `#[[file:.agents/steering/css-patterns.md]]` — CSS conventions
- `#[[file:.agents/steering/html-conventions.md]]` — HTML structure
- `#[[file:.agents/steering/operational-context.md]]` — Commands

**Session End:** Ask "Commit? (y/n)" → concise msg → `git add` specific files
