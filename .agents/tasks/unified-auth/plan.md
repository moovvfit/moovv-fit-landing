# Unified Auth & Web Platform — Implementation Plan

> **Status:** Ready for Implementation  
> **Spec:** `.agents/specs/unified-auth/`  
> **Created:** 2026-10-03

This plan implements the unified auth and web platform consolidation across four repositories. Each track is independently executable — coders for each track should follow only their respective section.

---

## Track A — moovv-fit-infra (CDK Infrastructure)

**Workspace:** `/mnt/workspace/src/moovv-fit-infra`  
**Stop Contract:** `/mnt/workspace/src/moovv-fit-landing/.agents/tasks/unified-auth/infra-review.json` with `verdict=APPROVED`

### A1. Create Pre-Signup Lambda Handler

Create the Lambda function that enforces @moovv.fit domain restriction for admin portal signups and auto-confirms Google federated users.

- [ ] 1. Create pre-signup Lambda handler at `cdk/src/portal-pre-signup-handler.ts`.
      Implements Cognito PreSignUp trigger: (1) If `clientId === ADMIN_CLIENT_ID` and email doesn't end with `@moovv.fit`, throw error "Admin access restricted to @moovv.fit accounts". (2) If `triggerSource === 'PreSignUp_ExternalProvider'`, set `autoConfirmUser: true` and `autoVerifyEmail: true`. Admin client ID from env var `ADMIN_CLIENT_ID`.
      Files: `cdk/src/portal-pre-signup-handler.ts`
      Verify: TypeScript compiles — `npx tsc --noEmit` in `cdk/` directory.

### A2. Create Unified Auth Stack (Pool B + Pre-Signup Lambda)

Create the Cognito User Pool B for clinic and admin portals with email authentication and Google OAuth.

- [ ] 2. Create `cdk/lib/unified-auth-stack.ts` following patterns from `landing-stack.ts`.
      Stack includes:
      - Pool B (`moovv-fit-portal-users`): `UsernameAttributes: [email]`, `AutoVerifiedAttributes: [email]`, password policy (min 12, uppercase, lowercase, numbers), MFA optional
      - Groups: `clinic_admin`, `admin`
      - Google Identity Provider: client ID/secret from SSM (`/moovv-fit/{env}/google_oauth_client_id`, `/moovv-fit/{env}/google_oauth_client_secret`), attribute mapping (email, name, picture)
      - App Client `moovv-clinic-portal`: OAuth code flow, scopes [email, openid, profile], all IdPs, callbacks for `app.moovv.fit/clinic/callback` + localhost
      - App Client `moovv-admin-portal`: OAuth code flow, scopes [email, openid, profile], **Google only** (`SupportedIdentityProviders: ['Google']`), callbacks for `app.moovv.fit/admin/callback` + localhost
      - Pre-Signup Lambda trigger pointing to handler from A1
      - SSM parameters for Pool B ID, client IDs (for backend consumption)
      - Standard tags: project=moovv-fit, service=unified-auth, environment={env}, managedBy=cdk
      - CfnOutputs for Pool ID, Domain, Client IDs
      Files: `cdk/lib/unified-auth-stack.ts`
      Verify: `npx cdk synth moovv-fit-unified-auth-staging --quiet` succeeds.

### A3. Create App CloudFront Stack

Create CloudFront distribution for app.moovv.fit with path-based routing to portal S3 origins.

- [ ] 3. Create `cdk/lib/app-cloudfront-stack.ts` following `landing-stack.ts` patterns.
      Stack includes:
      - Import existing bucket `moovv-fit-content-{environment}` (NO new buckets)
      - S3 Origin Access Control (OAC) named `moovv-fit-app-oac-{env}`
      - CloudFront Function `legacy-redirect` for viewer-request: redirects `physio.moovv.fit` → `app.moovv.fit/physio` and `clinic.moovv.fit` → `app.moovv.fit/clinic` (preserving URI path)
      - CloudFront Function `app-dir-index` for viewer-request: handles directory index (append index.html for `/` endings, handle SPA routing)
      - CloudFront Distribution with behaviors:
        - Default (`/`): origin `web/patient/`, cache 1 day, function associations for dir-index
        - `/physio/*`: origin `web/physio/`, cache 1 hour, strip `/physio` prefix via origin path
        - `/clinic/*`: origin `web/clinic/`, cache 1 hour, strip `/clinic` prefix via origin path
        - `/admin/*`: origin `web/admin/`, cache 1 hour, strip `/admin` prefix via origin path
      - Domain names: `app.moovv.fit` (production), `app-staging.moovv.fit` (staging)
      - ACM certificate ARN from props (us-east-1 for CloudFront)
      - Error responses: 403/404 → appropriate SPA index.html per path
      - SSM parameter for distribution ID
      - Standard tags and CfnOutputs
      Files: `cdk/lib/app-cloudfront-stack.ts`
      Verify: `npx cdk synth moovv-fit-app-cloudfront-staging --quiet` succeeds.

### A4. Update CDK Entry Point

Wire up new stacks in the CDK app entry point.

- [ ] 4. Update `cdk/bin/app.ts` to instantiate both new stacks.
      Add imports for `UnifiedAuthStack` and `AppCloudFrontStack`.
      Instantiate for staging environment:
      - `moovv-fit-unified-auth-staging` with `environment: 'staging'`
      - `moovv-fit-app-cloudfront-staging` with `environment: 'staging'`, domain `app-staging.moovv.fit`
      Instantiate for production environment:
      - `moovv-fit-unified-auth-production` with `environment: 'production'`
      - `moovv-fit-app-cloudfront-production` with `environment: 'production'`, domain `app.moovv.fit`
      Update console.log help text to list new stacks.
      Files: `cdk/bin/app.ts`
      Verify: `npx cdk synth --all --quiet` succeeds with no errors.

### A5. Final Verification

- [ ] 5. Run full CDK synth and verify no hardcoded secrets.
      Run `npx cdk synth --all` and inspect outputs for any hardcoded credentials.
      Verify all secrets come from SSM parameters or environment variables.
      Files: None (verification only)
      Verify: `npx cdk synth --all` produces valid CloudFormation templates; `grep -r "secret\|password\|key" cdk/lib/*.ts` shows only SSM parameter references.

---

## Track B — moovv-fit-backend-node (Auth Updates)

**Workspace:** `/mnt/workspace/src/moovv-fit-backend-node`  
**Stop Contract:** `/mnt/workspace/src/moovv-fit-landing/.agents/tasks/unified-auth/backend-review.json` with `verdict=APPROVED`

### B1. Create Multi-Pool JWT Verifier

Extend cognito.ts to support verification against both Pool A and Pool B.

- [ ] 1. Create `src/shared/auth/multiPoolVerifier.ts` with multi-pool JWT verification.
      Implements:
      - `MultiPoolVerifier` class that manages verifiers for Pool A (existing `ap-south-1_AulfstD9s`) and Pool B (ID from env `COGNITO_POOL_B_ID`)
      - `verify(token: string)` method: extracts `iss` claim to determine pool, verifies against appropriate verifier, returns payload with `pool: 'A' | 'B'` field
      - Lazy initialization of verifiers (singleton pattern for Lambda reuse)
      - Pool A client ID from env `COGNITO_CLIENT_ID`, Pool B client IDs from env `COGNITO_POOL_B_CLIENT_IDS` (comma-separated for clinic + admin)
      Files: `src/shared/auth/multiPoolVerifier.ts`
      Verify: `npx tsc --noEmit` compiles successfully.

### B2. Create Role Extraction Utilities

Add helper functions for extracting and checking roles from Cognito tokens.

- [ ] 2. Create `src/shared/auth/roleUtils.ts` with role extraction helpers.
      Implements:
      - `extractRoles(payload: CognitoTokenPayload): string[]` — returns `cognito:groups` array or empty array
      - `hasRole(payload: CognitoTokenPayload, role: string): boolean` — checks if role in groups
      - `hasAnyRole(payload: CognitoTokenPayload, roles: string[]): boolean` — checks if any role matches
      - `requireRole(payload: CognitoTokenPayload, role: string): void` — throws 403 error if role missing
      - Type definitions for `CognitoTokenPayload` with `sub`, `cognito:groups?`, `email?`, `phone_number?`
      Files: `src/shared/auth/roleUtils.ts`
      Verify: `npx tsc --noEmit` compiles successfully.

### B3. Create Auth Index and Update Existing cognito.ts

Create barrel export and update existing cognito utility to optionally use multi-pool verification.

- [ ] 3. Create `src/shared/auth/index.ts` barrel export and update `src/shared/utils/cognito.ts`.
      In `src/shared/auth/index.ts`: export all from `multiPoolVerifier.ts` and `roleUtils.ts`.
      In `src/shared/utils/cognito.ts`: add `verifyMultiPoolToken()` function that uses `MultiPoolVerifier` when `COGNITO_POOL_B_ID` env var is set, otherwise falls back to existing single-pool behavior. Keep existing `verifyCognitoToken()` unchanged for backward compatibility.
      Files: `src/shared/auth/index.ts`, `src/shared/utils/cognito.ts`
      Verify: `npx tsc --noEmit` compiles successfully.

### B4. Update Auth Middleware for X-Active-Role Header

Update auth middleware to support X-Active-Role header and multi-pool tokens.

- [ ] 4. Update `src/shared/middleware/auth.ts` to support X-Active-Role header.
      Add:
      - `extractActiveRole(event: APIGatewayProxyEvent): string | null` — extracts `X-Active-Role` header value
      - `verifyAuthTokenMultiPool(event: APIGatewayProxyEvent)` — uses multi-pool verifier, returns payload with pool and active role info
      - Updated `verifyAuthToken()` to use multi-pool when Pool B configured
      Files: `src/shared/middleware/auth.ts`
      Verify: `npx tsc --noEmit` compiles successfully.

### B5. Implement Self-Booking Prevention

Add check to prevent physios from booking appointments with themselves.

- [ ] 5. Update `src/handlers/physio-book-session-for-patient.ts` to prevent self-booking.
      After getting `physio` profile, before calling `bookSessionForPatient()`:
      - Get the physio's `cognitoSub` from their profile (via `physio.user.cognitoSub` or separate lookup)
      - Compare with authenticated user's `cognitoSub` from token
      - If equal, return `createErrorEnvelope(400, 'Cannot book appointment with yourself', 'SELF_BOOKING')`
      Also update `src/handlers/reception-book-session.ts` with same check if physio is booking for themselves.
      Files: `src/handlers/physio-book-session-for-patient.ts`, `src/handlers/reception-book-session.ts`
      Verify: `npx tsc --noEmit` compiles successfully.

### B6. Final Verification

- [ ] 6. Run full TypeScript compilation and verify no hardcoded secrets.
      Run `npx tsc --noEmit` for full type check.
      Verify Pool B ID and client IDs come from environment variables.
      Files: None (verification only)
      Verify: `npx tsc --noEmit` succeeds; `grep -r "ap-south-1_" src/shared/auth/` shows only Pool A ID in comments/docs.

---

## Track C — moovv-fit-landing (Link Updates)

**Workspace:** `/mnt/workspace/src/moovv-fit-landing`  
**Stop Contract:** Completes when HTML links are updated and validated.

### C1. Update Physio Landing Page Login Links

Update all login links in for-physios/index.html to point to new app.moovv.fit domain.

- [ ] 1. Update `for-physios/index.html` login links.
      Change all occurrences of `https://physio.moovv.fit/login` to `https://app.moovv.fit/physio`.
      Locations to update (line numbers approximate):
      - Line 146: nav-login link in navigation
      - Line 965: footer Physio Login link
      - Any other occurrences of `physio.moovv.fit`
      Keep the Schema.org URL reference at line 41 (`"url": "https://physio.moovv.fit"`) for now — this is for SEO and can be updated post-migration.
      Files: `for-physios/index.html`
      Verify: HTML is valid; `grep -c "physio.moovv.fit/login" for-physios/index.html` returns 0.

### C2. Update Clinic Landing Page Login Links

Update all login links in for-clinics/index.html to point to new app.moovv.fit domain.

- [ ] 2. Update `for-clinics/index.html` login links.
      Change all occurrences of `https://clinic.moovv.fit/login` to `https://app.moovv.fit/clinic`.
      Locations to update (line numbers approximate):
      - Line 127: nav-login link in navigation
      - Line 546: footer Login link
      - Any other occurrences of `clinic.moovv.fit`
      Files: `for-clinics/index.html`
      Verify: HTML is valid; `grep -c "clinic.moovv.fit/login" for-clinics/index.html` returns 0.

### C3. Final Verification

- [ ] 3. Verify all landing page links are correctly updated.
      Run validation to ensure no broken or old links remain.
      Files: None (verification only)
      Verify: `grep -r "physio.moovv.fit/login\|clinic.moovv.fit/login" for-physios/ for-clinics/` returns no matches; HTML files open without parse errors.

---

## Track D — moovv-fit-web (Investigation Only)

**Workspace:** `/mnt/workspace/src/moovv-fit-web`  
**Deliverable:** Documentation of current auth implementation and required changes.

### D1. Document Current Auth Implementation

Investigate and document the existing authentication setup in moovv-fit-web.

- [ ] 1. Document current auth implementation and required changes.
      Investigation areas:
      - `src/store/auth-store.ts`: Current Zustand auth store structure, token handling
      - `src/lib/axios.ts`: How Bearer token is attached, 401 handling
      - `src/api/`: Any auth-related API modules
      - Environment variables: Which Cognito config is used
      - Current roles supported: ADMIN, PHYSIO, CUSTOMER, RECEPTIONIST
      
      Document findings in `/mnt/workspace/src/moovv-fit-landing/.agents/tasks/unified-auth/web-auth-findings.md`:
      - Current auth flow (appears to be single-pool, phone-based for Pool A)
      - Changes needed for Pool A phone OTP (physio portal at /physio)
      - Changes needed for Pool B email/Google (clinic portal at /clinic, admin at /admin)
      - Role switcher component requirements
      - Routing updates needed for /physio, /clinic, /admin paths
      
      Files: Create `/mnt/workspace/src/moovv-fit-landing/.agents/tasks/unified-auth/web-auth-findings.md`
      Verify: Document exists and covers all investigation areas.

---

## Verification Requirements Summary

| Track | Verification Command | Expected Outcome |
|-------|---------------------|------------------|
| A (Infra) | `npx cdk synth --all` | Valid CloudFormation templates, no errors |
| A (Infra) | `grep -r "secret\|password" cdk/lib/*.ts` | Only SSM parameter references |
| B (Backend) | `npx tsc --noEmit` | TypeScript compiles without errors |
| B (Backend) | `grep -r "COGNITO_POOL_B" src/` | Pool B ID from env vars only |
| C (Landing) | `grep "moovv.fit/login" for-*/index.html` | No old login URLs remain |
| D (Web) | File exists check | `web-auth-findings.md` created |

---

## Cross-Track Dependencies

- **Track A → Track B**: Backend needs Pool B ID and client IDs from SSM parameters created by Track A. Backend should use env vars that will be populated from SSM at runtime.
- **Track A → Track D**: Web portals will need Cognito config (Pool IDs, client IDs, domain) from Track A outputs.
- **Track B → Track D**: Web auth implementation should follow patterns established in backend role utilities.
- **Track C**: Independent — can complete without waiting for other tracks.

---

## Security Checklist

- [ ] No hardcoded secrets in any codebase
- [ ] All Cognito secrets via SSM SecureString parameters
- [ ] Google OAuth client ID/secret via SSM
- [ ] Pool B ID and client IDs via SSM/env vars
- [ ] @moovv.fit domain restriction enforced in pre-signup Lambda
- [ ] Self-booking prevention in booking handlers

---

## Track A — Infra Verification Note

**Completed:** 2026-10-03  
**Branch:** `feat/unified-auth-infra` in `/mnt/workspace/src/moovv-fit-infra`  
**Commit:** `c6ec44b`

### Files Created
- `cdk/lib/unified-auth-stack.ts` — Cognito Pool B with email auth, Google IdP, groups, pre-signup Lambda
- `cdk/lib/app-cloudfront-stack.ts` — CloudFront distribution for app.moovv.fit with path-based routing
- `cdk/src/portal-pre-signup-handler.ts` — Pre-signup Lambda for @moovv.fit domain restriction

### Files Modified
- `cdk/bin/app.ts` — Added stack instantiation for staging and production

### Verification Results

```
# TypeScript Compilation
$ npx tsc --noEmit
Exit Code: 0 (PASSED)

# CDK Synth - Unified Auth Staging
$ npx cdk synth moovv-fit-unified-auth-staging --quiet
Successfully synthesized to /mnt/workspace/src/moovv-fit-infra/cdk/cdk.out
Exit Code: 0 (PASSED)

# CDK Synth - App CloudFront Staging
$ npx cdk synth moovv-fit-app-cloudfront-staging --quiet
Successfully synthesized to /mnt/workspace/src/moovv-fit-infra/cdk/cdk.out
Exit Code: 0 (PASSED)

# Hardcoded Secrets Check
$ grep -r "secret\|password\|key" lib/unified-auth-stack.ts lib/app-cloudfront-stack.ts src/portal-pre-signup-handler.ts
lib/unified-auth-stack.ts:    const googleClientSecretSsmName = `/moovv-fit/${environment}/google_oauth_client_secret`
lib/unified-auth-stack.ts:      passwordPolicy: {
lib/unified-auth-stack.ts:    // Clinic Portal Client (email/password + Google)
# Result: Only SSM parameter references and password policy config — no hardcoded credentials
```

### Notes
- Circular dependency resolved by having pre-signup Lambda read admin client ID from SSM at runtime instead of using CloudFormation environment variable reference
- Imported bucket warnings are expected — BucketPolicyStatement output provided for manual bucket policy update
- nodejs20.x deprecation warning is informational (deprecated 2026-04-30, still functional)

### SSM Parameters Created
- `/moovv-fit/{env}/cognito_pool_b_id`
- `/moovv-fit/{env}/cognito_clinic_portal_client_id`
- `/moovv-fit/{env}/cognito_admin_portal_client_id`
- `/moovv-fit/{env}/cognito_pool_b_domain`
- `/moovv-fit/{env}/app_cloudfront_distribution_id`

### Pre-requisite SSM Parameters Required (must exist before deploy)
- `/moovv-fit/{env}/google_oauth_client_id`
- `/moovv-fit/{env}/google_oauth_client_secret`

---

## Track B — Backend Verification Note

**Completed:** 2026-10-03  
**Branch:** `main` in `/mnt/workspace/src/moovv-fit-backend-node`  
**Commit:** `628f741`

### Files Created
- `src/shared/auth/multiPoolVerifier.ts` — Singleton multi-pool JWT verifier (Pool A + Pool B) with iss-based pool detection
- `src/shared/auth/roleUtils.ts` — Role extraction utilities (extractRoles, hasRole, hasAnyRole, hasAllRoles, requireRole, requireAnyRole, getPrimaryRole, isKnownRole)
- `src/shared/auth/index.ts` — Barrel exports for auth module

### Files Modified
- `src/shared/utils/cognito.ts` — Added `verifyMultiPoolCognitoToken()` for multi-pool support
- `src/shared/middleware/auth.ts` — Added `extractActiveRole()`, `verifyAuthTokenMultiPool()`, `MultiPoolAuthResult` type
- `src/handlers/physio-book-session-for-patient.ts` — Added self-booking prevention check
- `src/handlers/reception-book-session.ts` — Added self-booking prevention check

### Verification Results

```
# TypeScript Compilation
$ npx tsc --noEmit
Exit Code: 0 (PASSED)

# Linting
$ pnpm lint
Checked 482 files in 814ms. No fixes applied.
Exit Code: 0 (PASSED)

# Pre-commit hooks (biome check)
$ git commit
> biome check src
Checked 482 files in 796ms. No fixes applied.
Exit Code: 0 (PASSED)

# Pool B Environment Variables Check
$ grep -r "COGNITO_POOL_B" src/
src/shared/utils/cognito.ts: * Uses multi-pool verification when Pool B is configured (COGNITO_POOL_B_ID env var set).
src/shared/utils/cognito.ts:  const poolBEnabled = !!process.env.COGNITO_POOL_B_ID;
src/shared/auth/multiPoolVerifier.ts:    this.poolBId = process.env.COGNITO_POOL_B_ID || null;
src/shared/auth/multiPoolVerifier.ts:    const poolBClientIdsEnv = process.env.COGNITO_POOL_B_CLIENT_IDS || '';
# Result: Pool B configuration entirely from environment variables — no hardcoded Pool B IDs

# Pool A ID Check (should only be in default fallback)
$ grep -r "ap-south-1_" src/shared/auth/
src/shared/auth/multiPoolVerifier.ts:    this.poolAId = process.env.COGNITO_USER_POOL_ID || 'ap-south-1_AulfstD9s';
# Result: Pool A ID only used as fallback default (consistent with existing codebase pattern)
```

### Environment Variables Required
- `COGNITO_USER_POOL_ID` — Pool A ID (existing)
- `COGNITO_CLIENT_ID` — Pool A client ID (existing)
- `COGNITO_POOL_B_ID` — Pool B ID (new, from SSM)
- `COGNITO_POOL_B_CLIENT_IDS` — Pool B client IDs, comma-separated (new, from SSM)

### Self-Booking Prevention
Both `physio-book-session-for-patient.ts` and `reception-book-session.ts` now block bookings where the patient's cognitoSub matches the physio's cognitoSub, returning:
```json
{ "success": false, "message": "Cannot book appointment with yourself" }
```
with HTTP status 400.

### Notes
- `X-Active-Role` header support added but ignored if value doesn't match user's roles
- Backward compatible: existing single-pool behavior unchanged when `COGNITO_POOL_B_ID` not set
