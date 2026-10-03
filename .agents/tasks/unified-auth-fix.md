# 🔴 HIGH PRIORITY: Unified Auth Portal Routing Fix

**Date flagged:** 2026-10-03
**Priority:** HIGH

## Issue
All portal paths (`/physio/`, `/clinic/`, `/admin/`) at `app-staging.moovv.fit` are loading the Flutter patient web app instead of the React portal builds.

## Expected Behavior
- `/` → Flutter patient web app ✅ (working)
- `/physio/` → React physio portal (from `moovv-fit-web`)
- `/clinic/` → React clinic portal (from `moovv-fit-web`)
- `/admin/` → React admin portal (from `moovv-fit-web`)

## Likely Root Cause
CloudFront behavior precedence or origin path configuration. The portal paths may be falling through to the default behavior (patient origin) instead of their specific behaviors.

## Investigation Steps
1. Check CloudFront distribution behaviors order in AWS Console
2. Verify S3 paths have content: `s3://moovv-fit-content-staging/web/{physio,clinic,admin}/index.html`
3. Check CloudFront function `dirIndexFunction` is stripping prefix correctly
4. Test direct S3 access to rule out bucket policy issues

## Context
- Staging CloudFront: `E1AWTDC8L48X1Q` / `d3uaaoxklylo6w.cloudfront.net`
- Deploy workflow succeeded, files uploaded to correct S3 paths
- HTTP 200 returned but wrong content served

## Related Files
- `/mnt/workspace/src/moovv-fit-infra/cdk/lib/app-cloudfront-stack.ts`
- `/mnt/workspace/src/moovv-fit-web/.github/workflows/deploy-unified.yml`
