# Implementation Plan: Deploy Portals and Flutter Web

## Key Discoveries

1. **React Web App Location**: `/mnt/workspace/src/moovv-fit-web` (single SPA with admin/physio/clinic routes)
2. **Flutter App Location**: `/mnt/workspace/src/moovv-fit-mobile` (NOT `moovv-fit-patient-app` as originally specified)
3. **Flutter TASK-6.3 & TASK-6.4 Already Implemented**:
   - `RemoteConfigService.showWebLogin` handles the feature flag (defaults to `false` on web)
   - `DownloadAppPromptScreen` with App Store/Play Store badges exists
   - Router already redirects to download prompt when `showWebLogin` is false
4. **CI/CD Handles Deployment**: DO NOT manually deploy to S3
   - React: `.github/workflows/deploy-unified.yml` with `portal=all` option
   - Flutter: `.github/workflows/deploy.yml` with `platform=web` option

---

## Implementation Steps

- [ ] 1. **Trigger React Portal Deployment via CI/CD**
      Push any pending changes and trigger the deploy-unified workflow.
      Files: /mnt/workspace/src/moovv-fit-web/.github/workflows/deploy-unified.yml
      Verify: `cd /mnt/workspace/src/moovv-fit-web && git push origin main && gh workflow run deploy-unified.yml -f environment=staging -f portal=all` then `gh run watch`

- [ ] 2. **Monitor React Portal Deployment**
      Wait for GitHub Actions workflow to complete successfully.
      Files: N/A - monitoring only
      Verify: `gh run list --workflow=deploy-unified.yml --limit 1` shows success status

- [ ] 3. **Trigger Flutter Web Deployment via CI/CD**
      Push any pending changes and trigger the deploy workflow with platform=web.
      Files: /mnt/workspace/src/moovv-fit-mobile/.github/workflows/deploy.yml
      Verify: `cd /mnt/workspace/src/moovv-fit-mobile && git push origin main && gh workflow run deploy.yml -f environment=staging -f platform=web -f upload_to_store=false` then `gh run watch`

- [ ] 4. **Monitor Flutter Web Deployment**
      Wait for GitHub Actions workflow to complete successfully.
      Files: N/A - monitoring only
      Verify: `gh run list --workflow=deploy.yml --limit 1` shows success status

- [ ] 5. **Update tasks.md with Completion Status**
      Mark Phase 3, 4, 5, and 6 tasks as complete in the unified auth tasks document.
      Files: /mnt/workspace/src/moovv-fit-landing/.agents/specs/unified-auth/tasks.md
      Verify: Read the file and confirm checkboxes are updated for TASK-3.*, TASK-4.*, TASK-6.1, TASK-6.3, TASK-6.4

---

## CI/CD Workflows

### React Portals (moovv-fit-web)
- Workflow: `.github/workflows/deploy-unified.yml`
- Trigger: `gh workflow run deploy-unified.yml -f environment=staging -f portal=all`
- Deploys to: `/admin/*`, `/physio/*`, `/clinic/*`

### Flutter Patient Web (moovv-fit-mobile)
- Workflow: `.github/workflows/deploy.yml`
- Trigger: `gh workflow run deploy.yml -f environment=staging -f platform=web -f upload_to_store=false`
- Deploys to: `/patient/*` (root)

---

## Notes

- **DO NOT manually deploy to S3** - use GitHub Actions CI/CD
- **TASK-6.2** (Web auth flow) remains incomplete - requires backend integration
- **TASK-6.5** (Deep links) is future work - not in scope
- All portal code is already implemented - this is purely deployment orchestration
