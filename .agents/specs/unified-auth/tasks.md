# Unified Auth & Web Platform — Implementation Tasks

> **Status:** Draft  
> **Created:** 2026-09-30

---

## Phase 1: Cognito Setup

### Pool A Updates
- [ ] **TASK-1.1** Add `patient` group to Pool A
  ```bash
  aws cognito-idp create-group \
    --user-pool-id ap-south-1_AulfstD9s \
    --group-name patient \
    --description "App users - patients"
  ```

- [ ] **TASK-1.2** Add `physio` group to Pool A
  ```bash
  aws cognito-idp create-group \
    --user-pool-id ap-south-1_AulfstD9s \
    --group-name physio \
    --description "Physiotherapists"
  ```

- [ ] **TASK-1.3** Backfill existing users to `patient` group
  - Script to list all users and add to patient group
  - Identify physios from backend DB and add to physio group

### Pool B Creation
- [ ] **TASK-1.4** Create new user pool `moovv-fit-portal-users`
  - UsernameAttributes: [email]
  - AutoVerifiedAttributes: [email]
  - Password policy: min 12 chars

- [ ] **TASK-1.5** Add groups to Pool B
  - `clinic_admin`
  - `admin`

- [ ] **TASK-1.6** Create Google OAuth app in Google Cloud Console
  - Authorized redirect URIs for Cognito

- [ ] **TASK-1.7** Configure Google IdP in Pool B

- [ ] **TASK-1.8** Create app client: `moovv-clinic-portal`

- [ ] **TASK-1.9** Create app client: `moovv-admin-portal` (Google only)

- [ ] **TASK-1.10** Deploy pre-signup Lambda for @moovv.fit restriction

---

## Phase 2: Backend Updates

- [ ] **TASK-2.1** Create multi-pool JWT verifier
  - Support both Pool A and Pool B tokens
  - Extract pool info from `iss` claim

- [ ] **TASK-2.2** Add role extraction utility
  - Parse `cognito:groups` from token
  - `hasRole()`, `requireRole()` helpers

- [ ] **TASK-2.3** Update auth middleware
  - Support both pools
  - Add `X-Active-Role` header support

- [ ] **TASK-2.4** Implement self-booking prevention
  - Check if booking physio === current user
  - Return 400 error with clear message

- [ ] **TASK-2.5** Create admin endpoints for group management
  - `POST /admin/users/{id}/groups` — add user to group
  - `DELETE /admin/users/{id}/groups/{group}` — remove from group
  - `GET /admin/users/{id}/groups` — list user's groups

- [ ] **TASK-2.6** Update user creation flow
  - Patients auto-added to `patient` group on signup
  - Physios added to `physio` group on approval

---

## Phase 3: Frontend - Physio Portal

- [ ] **TASK-3.1** Update auth config to use Pool A
  - Phone + OTP flow
  - Update Cognito client ID

- [ ] **TASK-3.2** Update login page
  - Phone number input
  - OTP verification
  - Remove email option

- [ ] **TASK-3.3** Add role switcher component
  - Dropdown in header
  - Show available roles from token

- [ ] **TASK-3.4** Handle multi-role users
  - If physio + patient, show switcher
  - Navigate to appropriate dashboard

- [ ] **TASK-3.5** Update API calls
  - Include `X-Active-Role: physio` header

---

## Phase 4: Frontend - Clinic Portal

- [ ] **TASK-4.1** Create clinic portal app (if new) or update existing
  - React/Next.js
  - Pool B auth (email/password)

- [ ] **TASK-4.2** Implement login page
  - Email + password form
  - Forgot password flow

- [ ] **TASK-4.3** Add role switcher (if multi-role)

- [ ] **TASK-4.4** Update callback URLs in Cognito

---

## Phase 5: Frontend - Admin Portal

- [ ] **TASK-5.1** Create admin portal app
  - Google OAuth only
  - No email/password option

- [ ] **TASK-5.2** Implement Google login button
  - Hosted UI or custom button
  - Handle callback

- [ ] **TASK-5.3** Handle non-@moovv.fit rejection
  - Clear error message
  - Link to request access

- [ ] **TASK-5.4** Build admin dashboard
  - User management
  - Group assignment UI

---

## Phase 6: Frontend - Patient Web (Flutter)

- [ ] **TASK-6.1** Configure Flutter web build
  - Build for web target
  - Optimize bundle size

- [ ] **TASK-6.2** Implement web auth flow
  - Phone + OTP (same as mobile)
  - Pool A client

- [ ] **TASK-6.3** Add feature flag for login visibility
  - `SHOW_PATIENT_WEB_LOGIN=false` initially

- [ ] **TASK-6.4** Add "Download App" prompt
  - App Store / Play Store badges
  - Shown when login hidden

- [ ] **TASK-6.5** (Future) Deep link to mobile app
  - `moovvfit://login` scheme
  - Fallback to store if app not installed

---

## Phase 7: Infrastructure

- [ ] **TASK-7.1** Use existing S3 bucket structure
  
  **Production:** `s3://moovv-fit-content-production/`
  ```
  web/
  ├── landing/    # Existing
  ├── patient/    # NEW - Flutter web
  ├── physio/     # NEW - Physio portal
  ├── clinic/     # NEW - Clinic portal
  └── admin/      # NEW - Admin portal
  ```
  
  **Staging:** `s3://moovv-fit-content-staging/`
  ```
  web/
  ├── landing/    # NEW - create folder
  ├── patient/    # NEW - Flutter web
  ├── physio/     # NEW - Physio portal
  ├── clinic/     # NEW - Clinic portal
  └── admin/      # NEW - Admin portal
  ```
  
  **No new buckets needed** — uses existing buckets.

- [ ] **TASK-7.2** Create CloudFront distribution for `app.moovv.fit`
  - Multiple origins (per path pattern)
  - SSL cert (ACM)

- [ ] **TASK-7.3** Configure path-based routing
  - `/` → patient
  - `/physio/*` → physio
  - `/clinic/*` → clinic
  - `/admin/*` → admin

- [ ] **TASK-7.4** Deploy legacy redirect CloudFront function
  - `physio.moovv.fit` → `app.moovv.fit/physio`
  - `clinic.moovv.fit` → `app.moovv.fit/clinic`

- [ ] **TASK-7.5** Update DNS records
  - `app.moovv.fit` → CloudFront
  - Keep legacy domains pointing to redirect

- [ ] **TASK-7.6** Update CI/CD pipelines
  - Deploy each portal to correct S3 path
  - Invalidate CloudFront on deploy

---

## Phase 8: Landing Page Updates

- [ ] **TASK-8.1** Update `/for-physios/` login link
  - `href="https://app.moovv.fit/physio"`

- [ ] **TASK-8.2** Update `/for-clinics/` login link
  - `href="https://app.moovv.fit/clinic"`

- [ ] **TASK-8.3** (Optional) Add "Open Web App" CTA to root landing
  - Feature flagged
  - Links to `app.moovv.fit`

---

## Phase 9: Testing & Launch

- [ ] **TASK-9.1** Test all auth flows in staging
  - Patient phone OTP
  - Physio phone OTP
  - Clinic email/password
  - Admin Google OAuth

- [ ] **TASK-9.2** Test role switching
  - Physio with patient role
  - Verify no re-auth needed

- [ ] **TASK-9.3** Test self-booking prevention
  - Physio cannot book themselves

- [ ] **TASK-9.4** Test legacy redirects
  - `physio.moovv.fit` → `app.moovv.fit/physio`

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
