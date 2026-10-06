# ✅ RESOLVED: Unified Auth Portal Routing Fix

**Date flagged:** 2026-10-03
**Date resolved:** 2026-10-06
**Priority:** ~~HIGH~~ RESOLVED

## Issue (RESOLVED)
All portal paths (`/physio/`, `/clinic/`, `/admin/`) at `app-staging.moovv.fit` were loading the Flutter patient web app instead of the React portal builds.

## Root Causes Found & Fixed

### 1. Asset paths (2026-10-06)
- **Problem:** Vite built with absolute paths (`/assets/...`) which loaded from patient origin
- **Fix:** Added `base: './'` to `vite.config.ts` for relative paths

### 2. Bare path routing (2026-10-06)
- **Problem:** `/clinic` didn't match `/clinic/*` behavior pattern, fell through to default
- **Fix:** CloudFront function now redirects `/clinic` → `/clinic/`

### 3. VITE_ENV validation (2026-10-06)
- **Problem:** `VITE_ENV=staging` failed Zod schema (only accepts development/production/test)
- **Fix:** Workflow maps `staging` → `development`

### 4. Legacy workflow conflicts (2026-10-06)
- **Problem:** `deploy-staging.yml` was deploying to bucket root, overwriting portal paths
- **Fix:** Disabled legacy workflows, use `deploy-unified.yml` only

## Verification (2026-10-06)
```
/physio  → 301 → /physio/ → React portal ✅
/clinic  → 301 → /clinic/ → React portal ✅
/admin   → 301 → /admin/  → React portal ✅
/        → Flutter patient app ✅
```

## Commits Made
- `moovv-fit-web`: `base: './'` in vite.config.ts
- `moovv-fit-web`: Disabled legacy deploy workflows
- `moovv-fit-web`: `VITE_ENV` mapping fix
- `moovv-fit-web`: Refactored deploy-unified.yml with GitHub Environments
- `moovv-fit-infra`: CloudFront function for bare path redirects

## Next Steps
1. ✅ Staging portals working
2. Test auth flows at each portal
3. Deploy to production when staging verified
4. Configure `app.moovv.fit` DNS for production
