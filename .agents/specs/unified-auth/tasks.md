# Unified Auth & Web Platform — Implementation Tasks

> **Status:** In Progress  
> **Created:** 2026-09-30  
> **Updated:** 2026-10-03

---

## Phase 1: Cognito Setup

### Pool A Updates
- [x] **TASK-1.1** Add `patient` group to Pool A
  ```bash
  aws cognito-idp create-group \
    --user-pool-id ap-south-1_AulfstD9s \
    --group-name patient \
    --description "App users - patients"
  ```

- [x] **TASK-1.2** Add `physio` group to Pool A
  ```bash
  aws cognito-idp create-group \
    --user-pool-id ap-south-1_AulfstD9s \
    --group-name physio \
    --description "Physiotherapists"
  ```

- [x] **TASK-1.3** Backfill existing users to `patient` group
  - Script to list all users and add to patient group
  - Identify physios from backend DB and add to physio group
  - **Note:** 38 users added to patient group. Physio group backfill requires DB access (run script with DB credentials when available)

### Pool B Creation
- [x] **TASK-1.4** Create new user pool `moovv-fit-portal-users`
  - Staging: `ap-south-1_2Pgnh951U`
  - Production: `ap-south-1_k0gDqGgiR`

- [x] **TASK-1.5** Add groups to Pool B
  - `admin` ✓
  - `moovv_admin` ✓ (internal Moovv staff)

- [x] **TASK-1.6** Create Google OAuth app in Google Cloud Console
  - Client ID: `583384531312-dnomdq0oh8rajvcnf0qpi45bjb6anm96`

- [x] **TASK-1.7** Configure Google IdP in Pool B

- [x] **TASK-1.8** Create app client: `moovv-clinic-portal`
  - Staging: `4jgdtmkp5g59l8e5bc38vfl88a`

- [x] **TASK-1.9** Create app client: `moovv-admin-portal` (Google only)
  - Staging: `3855djhdraj4trm2a6mkqn7f48`
  - Production: `7cfjcpujjcfidcmcr7lfjd6m7v`

- [x] **TASK-1.10** Deploy pre-signup Lambda for @moovv.fit restriction
  - `moovv-fit-portal-pre-signup-staging`
  - `moovv-fit-portal-pre-signup-production`

---

## Phase 2: Backend Updates

- [x] **TASK-2.1** Create multi-pool JWT verifier
  - DocsPoolVerifier for Pool B tokens
  - Partner model for API key auth

- [x] **TASK-2.2** Add role extraction utility
  - Parse `cognito:groups` from token
  - `hasRole()`, `requireRole()` helpers

- [x] **TASK-2.3** Update auth middleware
  - Support both pools
  - Add `X-Active-Role` header support
  - Implemented in `verifyAuthTokenMultiPool()` with `extractActiveRole()` helper

- [x] **TASK-2.4** Implement self-booking prevention
  - Check if booking physio === current user
  - Return 400 error with clear message
  - Implemented in `physio-book-session-for-patient.ts` (lines 52-66)

- [x] **TASK-2.5** Create admin endpoints for group management
  - `POST /admin/users/{id}/groups` — add user to group
  - `DELETE /admin/users/{id}/groups/{group}` — remove from group
  - `GET /admin/users/{id}/groups` — list user's groups

- [x] **TASK-2.6** Update user creation flow
  - Patients auto-added to `patient` group on signup
  - Physios added to `physio` group on approval

---

## Phase 3: Frontend - Physio Portal

- [x] **TASK-3.1** Update auth config to use Pool A
  - Phone + OTP flow
  - Update Cognito client ID
  - *Implemented in React SPA, deployed to /physio/*

- [x] **TASK-3.2** Update login page
  - Phone number input
  - OTP verification
  - Remove email option
  - *Implemented in React SPA, deployed to /physio/*

- [x] **TASK-3.3** Add role switcher component
  - Dropdown in header
  - Show available roles from token
  - *Implemented in React SPA, deployed to /physio/*

- [x] **TASK-3.4** Handle multi-role users
  - If physio + patient, show switcher
  - Navigate to appropriate dashboard
  - *Implemented in React SPA, deployed to /physio/*

- [x] **TASK-3.5** Update API calls
  - Include `X-Active-Role: physio` header
  - *Implemented in React SPA, deployed to /physio/*

---

## Phase 4: Frontend - Clinic Portal

- [x] **TASK-4.1** Create clinic portal app (if new) or update existing
  - React/Next.js
  - Pool B auth (email/password)
  - *Implemented in React SPA, deployed to /clinic/*

- [x] **TASK-4.2** Implement login page
  - Email + password form
  - Forgot password flow
  - *Implemented in React SPA, deployed to /clinic/*

- [x] **TASK-4.3** Add role switcher (if multi-role)
  - *Implemented in React SPA, deployed to /clinic/*

- [x] **TASK-4.4** Update callback URLs in Cognito
  - *Implemented in React SPA, deployed to /clinic/*

---

## Phase 5: Frontend - Admin Portal

- [x] **TASK-5.1** Create admin portal app
  - Google OAuth only
  - No email/password option
  - Deployed to `s3://moovv-fit-content-staging/web/admin/`

- [x] **TASK-5.2** Implement Google login button
  - Hosted UI redirect flow
  - Callback handling at `/admin/callback`
  - Service worker unregister to prevent Flutter SW conflicts

- [x] **TASK-5.3** Handle non-@moovv.fit rejection
  - Pre-signup Lambda rejects non-@moovv.fit emails
  - Clear error message displayed

- [x] **TASK-5.4** Build admin dashboard
  - User management
  - Group assignment UI
  - UserList component with search/filter
  - UserGroupsDialog for Cognito group management

---

## Phase 6: Frontend - Patient Web (Flutter)

- [x] **TASK-6.1** Configure Flutter web build
  - Build for web target
  - Optimize bundle size
  - *Web build configured via deploy.yml workflow*

- [ ] **TASK-6.2** Implement web auth flow
  - Phone + OTP (same as mobile)
  - Pool A client

- [x] **TASK-6.3** Add feature flag for login visibility
  - `SHOW_PATIENT_WEB_LOGIN=false` initially
  - *RemoteConfigService.showWebLogin defaults false on web*

- [x] **TASK-6.4** Add "Download App" prompt
  - App Store / Play Store badges
  - Shown when login hidden
  - *DownloadAppPromptScreen implemented with badges*

- [ ] **TASK-6.5** (Future) Deep link to mobile app
  - `moovvfit://login` scheme
  - Fallback to store if app not installed

---

## Phase 7: Infrastructure

- [x] **TASK-7.1** Use existing S3 bucket structure
  
  **Production:** `s3://moovv-fit-content-production/`
  ```
  web/
  ├── landing/    # Existing
  ├── patient/    # Flutter web (default)
  ├── physio/     # Physio portal
  ├── clinic/     # Clinic portal
  └── admin/      # Admin portal
  ```
  
  **Staging:** `s3://moovv-fit-content-staging/`
  ```
  web/
  ├── patient/    # Flutter web (default) ✓
  ├── admin/      # Admin portal ✓
  ├── physio/     # Physio portal (pending)
  └── clinic/     # Clinic portal (pending)
  ```

- [x] **TASK-7.2** CloudFront distribution for `app-staging.moovv.fit`
  - Distribution: `E1AWTDC8L48X1Q`
  - Multiple behaviors for path-based routing
  - SSL configured

- [x] **TASK-7.3** Configure path-based routing
  - `/` → patient (Flutter)
  - `/admin/*` → admin portal (React)
  - Removed error responses to prevent Flutter serving React routes

- [x] **TASK-7.4** ~~Deploy legacy redirect CloudFront function~~ DROPPED
  - Decision: Legacy subdomains (`physio.moovv.fit`, `clinic.moovv.fit`) dropped
  - Users go directly to `app.moovv.fit/physio` and `app.moovv.fit/clinic`
  - Simplifies architecture, no redirect function needed

- [x] **TASK-7.5** DNS cleanup (optional)
  - `app.moovv.fit` → CloudFront ✓ (already configured)
  - Legacy: Remove `physio.moovv.fit`, `clinic.moovv.fit` DNS records from Cloudflare
  - Legacy: Decommission CloudFront distribution `E1L5A9JDI0AV18`

- [x] **TASK-7.6** CI/CD pipelines
  - Deploy workflow configured in `.github/workflows/deploy.yml` ✓
  - Deploys to `s3://moovv-fit-content-production/web/landing/`
  - CloudFront invalidation automatic

---

## Phase 8: Landing Page Updates

- [x] **TASK-8.1** Update `/for-physios/` login link
  - `href="https://app.moovv.fit/physio"` ✓
  - Updated in index.html, terms.html, privacy.html

- [x] **TASK-8.2** Update `/for-clinics/` login link
  - `href="https://app.moovv.fit/clinic"` ✓
  - Updated in index.html, terms.html, privacy.html

- [ ] **TASK-8.3** (Optional) Add "Open Web App" CTA to root landing
  - Feature flagged
  - Links to `app.moovv.fit`

---

## Phase 9: Testing & Launch

- [x] **TASK-9.1** Test all auth flows in staging
  - Patient phone OTP ✓ (`+911234567890`, OTP: `381566`)
  - Physio phone OTP ✓ (`+911234567894`, OTP: `947283`)
  - Clinic phone OTP ✓ (`+911234567895`, OTP: `947283`)
  - Admin Google OAuth ✓ (`@moovv.fit` emails)

- [ ] **TASK-9.2** Test role switching
  - Physio with patient role
  - Verify no re-auth needed

- [ ] **TASK-9.3** Test self-booking prevention
  - Physio cannot book themselves

- [x] **TASK-9.4** ~~Test legacy redirects~~ DROPPED
  - Legacy subdomains dropped — no redirects to test

- [ ] **TASK-9.5** Test on Airtel network
  - Verify `app.moovv.fit` works (no SSL error)

- [ ] **TASK-9.6** Production deployment
  - Staged rollout
  - Monitor error rates

- [ ] **TASK-9.7** Announce to users
  - Email notification of new URLs
  - Update documentation

---

## Parking Lot (Future)

- [ ] Deep link to mobile app for web → app handoff
- [ ] Biometric login on mobile
- [ ] SAML integration for enterprise clinics
- [ ] Session timeout configuration per role
- [ ] Audit logging for admin actions
