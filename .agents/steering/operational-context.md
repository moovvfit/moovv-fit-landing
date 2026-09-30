---
inclusion: auto
name: Operational Context
description: "Commands, deployment, local development workflow."
---

# Operational Context

## 🖥️ Local Development
```bash
# Option 1: Python server
python3 -m http.server 8000

# Option 2: Node serve
npx serve .

# Then open: http://localhost:8000
```

## 🚀 Deployment
Push to `main` triggers GitHub Actions:
1. Sync to S3 bucket
2. CloudFront cache invalidation
3. Live in ~30 seconds

```bash
# Manual deploy (emergency only)
aws s3 sync . s3://moovv-fit-landing \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude ".agents/*"
```

## 📋 Git Workflow
```bash
# Check status
git status

# Stage specific files
git add index.html css/styles.css

# Commit with concise message
git commit -m "fix(hero): adjust mobile padding"

# Push to deploy
git push origin main
```

## 🔍 Commit Message Format
```
type(scope): description

# Types: feat, fix, docs, style, refactor
# Scope: hero, nav, footer, faq, for-physios, for-clinics, etc.
```

## 📁 File Locations
| Asset | Location |
|-------|----------|
| Root styles | `css/styles.css` |
| Root scripts | `js/main.js` |
| Root images | `images/` |
| Physio landing | `for-physios/` |
| Clinic landing | `for-clinics/` |
| Fonts | `fonts/` |
| Deploy config | `.github/workflows/deploy.yml` |

## ✅ Pre-Commit Checklist
1. HTML validates (no broken structure)
2. All images have `alt` text
3. Responsive at all breakpoints
4. Links work correctly
5. No console errors
