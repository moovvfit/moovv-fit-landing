# Implementation Plan: Unified Auth Phase A & B

## Overview
This plan implements Phase A (Backend Partner Model) and Phase B (Admin Federation) of Moovv's unified identity model across moovv-fit-backend-node.

**Key Insight from Exploration:** The Docs frontend (`moovv-fit-docs`) doesn't have its own API/authorizer - it calls the SDK API (`moovv-fit-backend-node`) which validates tokens. Therefore, Phase B (admin federation) is implemented in the backend's JWT verification, not in a separate Docs CDK stack authorizer.

**Existing Infrastructure:** Migration 20260926000001 already created the `platform` schema with `partner_developers`, `partner_invite_codes`, and `api_keys` tables. The new Partner model extends this.

---

## Phase A: Backend Partner Model

### Step 1: Create Partner/PartnerMembership Migration
- [ ] 1. Create migration file `/mnt/workspace/src/moovv-fit-backend-node/src/database/migrations/20261006000001-create-partner-tables.cjs`
      - Creates `platform.partner` table (UUID PK, name, logo_s3_key, api_mode, sandbox_api_key, live_api_key, status, timestamps)
      - Creates `platform.partner_membership` table (UUID PK, partner_id FK, user_email, role, created_at)
      - Adds `partner_id` FK column to existing `platform.partner_developers` table
      - Uses raw SQL (follows pattern from 20260926000001)
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/database/migrations/20261006000001-create-partner-tables.cjs`
      Verify: `npm run build` succeeds, migration file is valid .cjs syntax

### Step 2: Create Partner Model
- [ ] 2. Create Sequelize model for Partner entity
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/database/models/infrastructure/Partner.ts`
      Verify: `npm run type-check` passes

### Step 3: Create PartnerMembership Model
- [ ] 3. Create Sequelize model for PartnerMembership entity
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/database/models/infrastructure/PartnerMembership.ts`
      Verify: `npm run type-check` passes

### Step 4: Export Models
- [ ] 4. Update infrastructure models index to export new models
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/database/models/infrastructure/index.ts`
      Verify: `npm run build` succeeds

### Step 5: Add Enums
- [ ] 5. Add PartnerApiMode, PartnerStatus, PartnerMemberRole enums
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/shared/constants/enums.ts`
      Verify: `npm run type-check` passes

### Step 6-11: Create Partner API Handlers
- [ ] 6. Create `admin-list-partners.ts` handler (GET /api/admin/partners)
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-list-partners.ts`
      Verify: `npm run build` succeeds

- [ ] 7. Create `admin-get-partner.ts` handler (GET /api/admin/partners/{partnerId})
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-get-partner.ts`
      Verify: `npm run build` succeeds

- [ ] 8. Create `admin-create-partner.ts` handler (POST /api/admin/partners)
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-create-partner.ts`
      Verify: `npm run build` succeeds

- [ ] 9. Create `admin-update-partner.ts` handler (PUT /api/admin/partners/{partnerId})
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-update-partner.ts`
      Verify: `npm run build` succeeds

- [ ] 10. Create `admin-add-partner-member.ts` handler (POST /api/admin/partners/{partnerId}/members)
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-add-partner-member.ts`
      Verify: `npm run build` succeeds

- [ ] 11. Create `admin-remove-partner-member.ts` handler (DELETE /api/admin/partners/{partnerId}/members/{memberId})
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/handlers/admin-remove-partner-member.ts`
      Verify: `npm run build` succeeds

### Step 12: Add Routes to serverless.yml
- [ ] 12. Add all 6 Partner API routes to serverless.yml
      Files: `/mnt/workspace/src/moovv-fit-backend-node/serverless.yml`
      Verify: YAML syntax valid, `npm run build` succeeds

### Step 13: Kinetic Age Migration Script
- [ ] 13. Create idempotent data migration script for Kinetic Age
      Files: `/mnt/workspace/src/moovv-fit-backend-node/scripts/migrate-kinetic-age.ts`
      Verify: TypeScript compiles, script is ready for manual execution

### Step 14-15: Update Documentation
- [ ] 14. Update DB manifest with new tables
      Files: `/mnt/workspace/src/moovv-fit-backend-node/docs/architecture/db/manifest.md`
      Verify: Documentation is accurate

- [ ] 15. Update API manifest with new endpoints
      Files: `/mnt/workspace/src/moovv-fit-backend-node/docs/architecture/api/manifest.md`
      Verify: Documentation is accurate

---

## Phase B: Admin Federation (Docs)

### Step 16: Create Docs Pool Verifier
- [ ] 16. Create DocsPoolVerifier for Docs Pool + Pool B admin federation
      Validates Docs Pool tokens (partner access) and Pool B tokens (admin access if moovv_admin group present).
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/shared/auth/docsPoolVerifier.ts`
      Verify: `npm run type-check` passes

### Step 17: Create Docs Auth Middleware
- [ ] 17. Create verifyDocsToken() middleware
      Returns DocsAccessClaims with accessLevel ('partner' | 'admin'), validates token source.
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/shared/middleware/docsAuth.ts`
      Verify: `npm run type-check` passes

### Step 18: Update Auth Index
- [ ] 18. Export DocsPoolVerifier from auth module
      Files: `/mnt/workspace/src/moovv-fit-backend-node/src/shared/auth/index.ts`
      Verify: `npm run build` succeeds

### Step 19: Add Environment Variables
- [ ] 19. Add Docs Pool env vars to serverless.yml and .env.example
      COGNITO_DOCS_POOL_ID (default: ap-south-1_fYA6SWSpX), COGNITO_DOCS_CLIENT_ID
      Files: `/mnt/workspace/src/moovv-fit-backend-node/serverless.yml`, `/mnt/workspace/src/moovv-fit-backend-node/.env.example`
      Verify: `npm run build` succeeds

---

## Final Verification
- [ ] 20. Full build and type check
      Verify: `cd /mnt/workspace/src/moovv-fit-backend-node && npm run build && npm run type-check` passes

---

## Cognito Pool Reference
| Pool | ID | Purpose |
|------|-----|---------|
| Pool A | ap-south-1_AulfstD9s | Patients + Physios |
| Pool B Staging | ap-south-1_2Pgnh951U | Clinic + Admin portals |
| Pool B Prod | ap-south-1_0X3DUfeC7 | Clinic + Admin portals |
| Docs Pool | ap-south-1_fYA6SWSpX | Partner developers |

## Breaking Change Analysis
- **Kinetic Age (LIVE PARTNER):** No breaking changes. Docs Pool unchanged, migration is additive.
- **Existing partner_developers:** Migration adds optional partner_id FK, existing rows unaffected.
- **Pool B Admin Access:** New capability - Pool B users with moovv_admin group can now access Docs API with admin privileges.
