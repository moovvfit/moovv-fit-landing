# Unified Auth & Web Platform — Requirements

> **Status:** Draft  
> **Owner:** Platform Team  
> **Created:** 2026-09-30

---

## 1. Problem Statement

### Current Issues
1. **Airtel SSL blocking** — `physio.moovv.fit` blocked on Airtel network due to ISP SSL interception
2. **Fragmented domains** — `physio.moovv.fit`, `clinic.moovv.fit`, separate auth flows
3. **No role separation in Cognito** — Physios and patients share pool with no group differentiation
4. **Physio can self-book** — No backend/frontend guard for physio booking themselves as patient
5. **No web experience for patients** — Flutter app exists but no web deployment
6. **No Google OAuth for internal admin** — Moovv staff use email/password instead of Workspace SSO

### User Impact
- Physios on Airtel cannot access portal (business blocker)
- No unified experience for multi-role users (physio who is also a patient)
- Internal admin accounts not tied to Google Workspace (security gap)

---

## 2. Goals

| Goal | Success Metric |
|------|----------------|
| Single domain for all web portals | 100% traffic via `app.moovv.fit` |
| Role-based access control | Cognito groups enforce permissions |
| Google OAuth for admin | All @moovv.fit staff use Google login |
| Patient web experience ready | Flutter web deployed, login optional |
| Bypass Airtel SSL issue | No cert errors on any ISP |

---

## 3. User Types & Auth Methods

| User Type | Auth Method | Pool | Web URL |
|-----------|-------------|------|---------|
| **Patient** | Phone + OTP | Pool A | `app.moovv.fit` |
| **Physio** | Phone + OTP | Pool A | `app.moovv.fit/physio` |
| **Clinic Admin** | Email + Password | Pool B (new) | `app.moovv.fit/clinic` |
| **Moovv Admin** | Google OAuth (@moovv.fit) | Pool B (new) | `app.moovv.fit/admin` |

---

## 4. Functional Requirements

### 4.1 Authentication

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-1 | Patients login with phone number + OTP (existing flow) | P0 |
| AUTH-2 | Physios login with phone number + OTP (existing flow) | P0 |
| AUTH-3 | Clinic admins login with email + password | P0 |
| AUTH-4 | Moovv admins login with Google OAuth, restricted to @moovv.fit domain | P0 |
| AUTH-5 | Failed Google login from non-@moovv.fit domain shows clear error | P1 |
| AUTH-6 | Session persists across role switches (no re-login) | P1 |

### 4.2 Role Management

| ID | Requirement | Priority |
|----|-------------|----------|
| ROLE-1 | Cognito Pool A has groups: `patient`, `physio` | P0 |
| ROLE-2 | Cognito Pool B has groups: `clinic_admin`, `admin` | P0 |
| ROLE-3 | User can belong to multiple groups (e.g., physio + patient) | P0 |
| ROLE-4 | JWT includes `cognito:groups` claim for role checking | P0 |
| ROLE-5 | Physio cannot book appointment with themselves | P1 |
| ROLE-6 | Multi-role users see role switcher in UI | P1 |

### 4.3 Web Platform

| ID | Requirement | Priority |
|----|-------------|----------|
| WEB-1 | All portals accessible via `app.moovv.fit/*` | P0 |
| WEB-2 | Old domains redirect: `physio.moovv.fit` → `app.moovv.fit/physio` | P0 |
| WEB-3 | Old domains redirect: `clinic.moovv.fit` → `app.moovv.fit/clinic` | P0 |
| WEB-4 | Patient Flutter web deployed at `app.moovv.fit` | P1 |
| WEB-5 | Patient web login CTA hidden initially (configurable) | P2 |
| WEB-6 | Deep link to mobile app as alternative to web login | P2 |

### 4.4 Landing Page Updates

| ID | Requirement | Priority |
|----|-------------|----------|
| LAND-1 | `/for-physios/` login link points to `app.moovv.fit/physio` | P0 |
| LAND-2 | `/for-clinics/` login link points to `app.moovv.fit/clinic` | P0 |
| LAND-3 | Root landing optionally shows "Open Web App" CTA | P2 |

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Auth latency (login to dashboard) | < 3 seconds |
| NFR-2 | OTP delivery time | < 10 seconds |
| NFR-3 | Uptime for auth services | 99.9% |
| NFR-4 | SSL cert coverage | Single wildcard `*.moovv.fit` or `app.moovv.fit` |

---

## 6. Out of Scope

- Mobile app auth changes (continues using Pool A as-is)
- Docs portal auth (remains separate pool)
- Patient web feature parity with mobile (web is subset initially)
- Physio mobile app (physios use web portal only)

---

## 7. Open Questions

| # | Question | Decision |
|---|----------|----------|
| 1 | Should physio also have `patient` group by default? | TBD — allows them to use patient features |
| 2 | Clinic admin invite flow — email link or manual creation? | TBD |
| 3 | Admin audit logging required? | TBD |
| 4 | Session timeout duration per role? | TBD — suggest 24h patient, 8h physio/clinic, 4h admin |

---

## 8. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Pool A group creation | Platform | Not started |
| Pool B creation | Platform | Not started |
| CloudFront routing for `app.moovv.fit` | Infra | Not started |
| Flutter web build pipeline | Mobile | Not started |
| Physio portal refactor (new auth) | Web | Not started |

---

## 9. Future Considerations (TODO)

- [ ] Deep link: `app.moovv.fit` → `moovvfit://` for app handoff
- [ ] Disable patient web login via feature flag
- [ ] SAML integration for enterprise clinic customers
- [ ] Biometric login on mobile (FaceID/TouchID)
