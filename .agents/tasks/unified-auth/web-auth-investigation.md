# moovv-fit-web Auth Investigation

> **Investigation Date:** Track D - Unified Auth Implementation  
> **Repository:** `/mnt/workspace/src/moovv-fit-web`  
> **Design Reference:** `/mnt/workspace/src/moovv-fit-landing/.agents/specs/unified-auth/design.md`

---

## 1. Current Auth Implementation Summary

### 1.1 Technology Stack
- **Framework:** React 19 + Vite + TypeScript
- **State Management:** Zustand (auth-store) + TanStack Query (server state)
- **HTTP Client:** Axios with interceptors
- **Router:** React Router v7

### 1.2 Current Authentication Flow

```
Phone OTP Flow (Single Pool):
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  LoginPage  │ ─1─► │ /auth/init  │ ─2─► │ /auth/verify│
│ (phone+OTP) │      │  (session)  │      │  (tokens)   │
└─────────────┘      └─────────────┘      └─────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │ auth-store  │
                                          │ (Zustand)   │
                                          └─────────────┘
```

**Key files:**
| Component | Path | Purpose |
|-----------|------|---------|
| Login UI | `src/pages/LoginPage.tsx` | Phone OTP entry, role-based redirect |
| Auth Store | `src/store/auth-store.ts` | Token storage (Zustand + localStorage) |
| Auth API | `src/api/auth.ts` | API calls: initiateAuth, verifyAuth, logoutAuth, refreshTokenAuth |
| Token Utils | `src/lib/token-utils.ts` | JWT expiry check (decode without verify) |
| Token Refresh | `src/lib/token-refresh.ts` | Singleton refresh with localStorage + store sync |
| Axios | `src/lib/axios.ts` | Bearer token injection, 401 interceptor |
| Bootstrap | `src/components/auth/AuthBootstrap.tsx` | Startup refresh, visibility-change refresh |
| Protected Route | `src/components/auth/ProtectedRoute.tsx` | Role-based route guarding |
| Portal Detection | `src/lib/portal.ts` | Hostname-based portal type detection |

### 1.3 Cognito Configuration (from `.env.development`)

```
COGNITO_USER_POOL_ID=ap-south-1_SzdE00EQb  (different from design's ap-south-1_AulfstD9s)
COGNITO_CLIENT_ID=26im913r82vv0urf4pl0hq1c9
COGNITO_REGION=ap-south-1
```

> ⚠️ **Note:** The env vars lack `VITE_` prefix, so they are NOT exposed to the client bundle. The frontend does NOT directly interact with Cognito — all auth goes through the backend API (`/auth/*` endpoints).

### 1.4 Current Roles

```typescript
// src/store/auth-store.ts
type Role = 'ADMIN' | 'PHYSIO' | 'CUSTOMER' | 'RECEPTIONIST'
```

**Role Home Routes:**
| Role | Home Path |
|------|-----------|
| ADMIN | `/dashboard` |
| PHYSIO | `/physio/dashboard` |
| RECEPTIONIST | `/reception` |
| CUSTOMER | `/login` (rejected) |

---

## 2. Current Portal Detection Logic

### 2.1 `src/lib/portal.ts` Analysis

```typescript
type Portal = 'admin' | 'physio'

const PORTAL_ROLE_MAP: Record<Portal, Role[]> = {
  admin: ['ADMIN'],
  physio: ['PHYSIO', 'RECEPTIONIST'],
}
```

**Detection Rules:**
| Hostname | Portal |
|----------|--------|
| `localhost`, `127.0.0.1` | Path-based (`/physio/*` or `/reception/*` → physio, else admin) |
| `staging-admin.*`, `admin.moovv.fit` | admin |
| `staging-physio.*`, `physio.moovv.fit`, `clinic.moovv.fit` | physio |
| Default | admin |

> ⚠️ **Key Finding:** `clinic.moovv.fit` is currently mapped to the **physio** portal, NOT a separate clinic portal. The design spec expects a distinct `/clinic/*` path with Pool B auth.

### 2.2 Role Validation at Login

In `LoginPage.tsx`, `isRoleAllowedForPortal(role)` rejects:
- `CUSTOMER` → always rejected
- Non-localhost: only roles in `PORTAL_ROLE_MAP[getCurrentPortal()]`

---

## 3. Gap Analysis: Current vs Design Requirements

### 3.1 Auth Pools

| Aspect | Current | Design Requirement |
|--------|---------|-------------------|
| Pool A (Phone OTP) | ✅ Uses backend API (not direct Cognito) | ✅ Keep for patient + physio |
| Pool B (Email/Google) | ❌ **NOT IMPLEMENTED** | ❌ Needed for clinic_admin, admin |
| Cognito Groups | ❌ Groups not checked in frontend | ❌ Backend assigns role; needs `cognito:groups` support |

### 3.2 Portal Routes

| Path | Current State | Design Requirement |
|------|---------------|-------------------|
| `/` | Redirect to `/login` | Patient (Flutter Web) — separate app |
| `/physio/*` | ✅ PhysioRouteGuard, Phone OTP | ✅ Pool A phone OTP |
| `/clinic/*` | ❌ **DOES NOT EXIST** | ❌ Pool B email/password, `clinic_admin` group |
| `/admin/*` | ❌ Uses `/dashboard` path, Phone OTP | ❌ Pool B Google-only, `@moovv.fit` restriction |

### 3.3 Login UI

| Aspect | Current | Design Requirement |
|--------|---------|-------------------|
| Physio Login | ✅ Phone OTP at `/login` | ✅ Keep as-is (Pool A) |
| Clinic Login | ❌ Uses same Phone OTP | ❌ Email/password form (Pool B) |
| Admin Login | ❌ Uses same Phone OTP | ❌ Google OAuth button only (Pool B) |

### 3.4 Token Handling

| Aspect | Current | Design Requirement |
|--------|---------|-------------------|
| Token Storage | ✅ localStorage + Zustand | ✅ No change needed |
| Token Refresh | ✅ Singleton refresh flow | ⚠️ May need pool-specific refresh endpoints |
| Multi-Pool Tokens | ❌ Single pool assumption | ❌ Need pool identifier in auth state |

### 3.5 Role Switcher

| Aspect | Current | Design Requirement |
|--------|---------|-------------------|
| Multi-role users | ❌ Single role per user | ❌ `RoleSwitcher` component needed |
| Active role state | ❌ Not tracked | ❌ `activeRole` in auth state |
| X-Active-Role header | ❌ Not sent | ❌ Backend expects it for multi-role users |

---

## 4. Detailed Component Changes Required

### 4.1 Auth Store (`src/store/auth-store.ts`)

**Current State:**
```typescript
interface AuthState {
  user: User | null
  accessToken: string | null
  idToken: string | null
  refreshToken: string | null
  role: 'ADMIN' | 'PHYSIO' | 'CUSTOMER' | 'RECEPTIONIST' | null
  isAuthenticated: boolean
  // ...
}
```

**Required Changes:**
```typescript
interface AuthState {
  user: User | null
  accessToken: string | null
  idToken: string | null
  refreshToken: string | null
  roles: string[]           // ← NEW: array of cognito:groups
  activeRole: string | null // ← NEW: currently active role
  pool: 'A' | 'B' | null    // ← NEW: which pool authenticated
  isAuthenticated: boolean
  // ...
  switchRole: (role: string) => void  // ← NEW: role switcher action
}
```

### 4.2 Auth API (`src/api/auth.ts`)

**Current:**
- `initiateAuth(phoneNumber)` — OTP flow only
- `verifyAuth(phoneNumber, otp, session)` — OTP verify only

**Required Additions:**
```typescript
// Pool B: Email/Password
export async function initiateEmailAuth(email: string): Promise<{ session: string }>
export async function verifyEmailAuth(email: string, password: string, session: string): Promise<VerifyAuthResponse>

// Pool B: Google OAuth
export async function initiateGoogleAuth(): Promise<{ redirectUrl: string }>
export async function handleGoogleCallback(code: string): Promise<VerifyAuthResponse>
```

> ⚠️ **Verification needed:** Confirm with backend team if these endpoints exist or need creation. The design suggests OAuth code flow routed through the backend.

### 4.3 Login Pages

**Current:** Single `LoginPage.tsx` with phone OTP

**Required:**
| Component | Path | Auth Flow |
|-----------|------|-----------|
| `PhysioLoginPage.tsx` | `/physio/login` or `/login` | Phone OTP (Pool A) — existing flow |
| `ClinicLoginPage.tsx` | `/clinic/login` | Email/password form (Pool B) |
| `AdminLoginPage.tsx` | `/admin/login` | Google OAuth button only (Pool B) |

### 4.4 Portal Detection (`src/lib/portal.ts`)

**Current portals:** `admin`, `physio`

**Required portals:** `admin`, `physio`, `clinic`

```typescript
type Portal = 'admin' | 'physio' | 'clinic'

const PORTAL_ROLE_MAP: Record<Portal, string[]> = {
  admin: ['admin'],           // Pool B, Google only
  physio: ['physio'],         // Pool A, Phone OTP
  clinic: ['clinic_admin'],   // Pool B, Email/password
}

function getCurrentPortal(): Portal {
  const hostname = window.location.hostname
  const pathname = window.location.pathname
  
  // Path-based detection for app.moovv.fit
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/clinic')) return 'clinic'
  if (pathname.startsWith('/physio')) return 'physio'
  
  // Legacy hostname detection (for transition period)
  // ...
}
```

### 4.5 Route Guards

**Current guards:**
- `ProtectedRoute` — generic role check
- `PhysioRouteGuard` — PHYSIO role + profile status
- `ClinicAdminRouteGuard` — PHYSIO + ADMIN membership check
- `ReceptionRouteGuard` — RECEPTIONIST only

**Required additions:**
- `ClinicPortalRouteGuard` — Pool B, `clinic_admin` group
- `AdminPortalRouteGuard` — Pool B, `admin` group, `@moovv.fit` email

### 4.6 Axios Interceptor (`src/lib/axios.ts`)

**Current:** Adds `Authorization: Bearer {token}`

**Required Addition:**
```typescript
config.headers.Authorization = `Bearer ${token}`

// NEW: Active role header for multi-role users
const activeRole = useAuthStore.getState().activeRole
if (activeRole) {
  config.headers['X-Active-Role'] = activeRole
}
```

### 4.7 Role Switcher Component

**Required:** New component per design.md §5.2

```typescript
// src/components/auth/RoleSwitcher.tsx
function RoleSwitcher() {
  const { roles, activeRole, user, switchRole } = useAuthStore()
  
  if (roles.length <= 1) return null  // Hide for single-role users
  
  // Dropdown with role options, navigation on switch
}
```

### 4.8 App Router (`src/App.tsx`)

**Current routes:**
- `/login` → LoginPage (phone OTP)
- `/dashboard`, `/content-library`, etc. → Admin pages
- `/physio/*` → Physio pages
- `/reception/*` → Reception pages

**Required route additions:**
```typescript
// Clinic portal routes
<Route path="/clinic/login" element={<ClinicLoginPage />} />
<Route path="/clinic/callback" element={<ClinicOAuthCallback />} />
<Route path="/clinic/dashboard" element={<ClinicDashboard />} />
// ... other clinic routes

// Admin portal routes (rename /dashboard to /admin/dashboard)
<Route path="/admin/login" element={<AdminLoginPage />} />
<Route path="/admin/callback" element={<AdminOAuthCallback />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
// ... other admin routes
```

---

## 5. Environment Variables Changes

### Current `.env.development`
```
COGNITO_USER_POOL_ID=ap-south-1_SzdE00EQb
COGNITO_CLIENT_ID=26im913r82vv0urf4pl0hq1c9
COGNITO_REGION=ap-south-1
```

### Required additions
```
# Pool B configuration (for OAuth redirect URLs)
VITE_COGNITO_POOL_B_DOMAIN=moovv-fit-portal-users.auth.ap-south-1.amazoncognito.com
VITE_COGNITO_CLINIC_CLIENT_ID=<clinic-client-id>
VITE_COGNITO_ADMIN_CLIENT_ID=<admin-client-id>

# OAuth callback URLs
VITE_OAUTH_REDIRECT_URI_CLINIC=http://localhost:3000/clinic/callback
VITE_OAUTH_REDIRECT_URI_ADMIN=http://localhost:3000/admin/callback
```

---

## 6. Verification Gaps (Cannot Confirm from Code Alone)

| Item | Status | Verification Method |
|------|--------|---------------------|
| Backend `/auth/email/initiate` endpoint | ❓ Unknown | Check backend codebase |
| Backend Google OAuth flow | ❓ Unknown | Check backend codebase |
| Backend `cognito:groups` in token response | ❓ Unknown | Test with real token |
| Pool B creation in CDK | ❓ Parallel track | Check CDK stack outputs |
| Token refresh works for Pool B | ❓ Unknown | Test after Pool B exists |
| Self-booking prevention (physio ↔ patient) | ❓ Backend logic | Check booking handler |

---

## 7. Implementation Checklist

### Phase 1: Auth Infrastructure (Prerequisite: Pool B exists in CDK)

- [ ] **C1.** Update `src/store/auth-store.ts`:
  - Add `roles: string[]`, `activeRole: string | null`, `pool: 'A' | 'B' | null`
  - Add `switchRole(role: string)` action
  - Update persistence partialize

- [ ] **C2.** Update `src/lib/portal.ts`:
  - Add `'clinic'` portal type
  - Update hostname/pathname detection for `/clinic/*` and `/admin/*`

- [ ] **C3.** Update `src/lib/axios.ts`:
  - Add `X-Active-Role` header in request interceptor

### Phase 2: Login Pages (Requires: backend auth endpoints for Pool B)

- [ ] **C4.** Create `src/pages/ClinicLoginPage.tsx`:
  - Email/password form
  - Calls backend email auth endpoints
  - Redirects to `/clinic/dashboard`

- [ ] **C5.** Create `src/pages/AdminLoginPage.tsx`:
  - Google OAuth button only
  - Initiates OAuth redirect flow
  - No email/password form

- [ ] **C6.** Create `src/pages/OAuthCallbackPage.tsx`:
  - Handles OAuth `code` parameter
  - Exchanges code for tokens via backend
  - Routes to appropriate dashboard

### Phase 3: Route Guards

- [ ] **C7.** Create `src/components/auth/ClinicPortalRouteGuard.tsx`:
  - Requires `pool === 'B'`
  - Requires `clinic_admin` in roles

- [ ] **C8.** Create `src/components/auth/AdminPortalRouteGuard.tsx`:
  - Requires `pool === 'B'`
  - Requires `admin` in roles
  - Email must end with `@moovv.fit` (frontend safeguard; backend enforces)

### Phase 4: UI Components

- [ ] **C9.** Create `src/components/auth/RoleSwitcher.tsx`:
  - Shows only if `roles.length > 1`
  - Dropdown with role icons/labels
  - Calls `switchRole()` and navigates to role's home

- [ ] **C10.** Update `src/components/layout/Header.tsx`:
  - Include `<RoleSwitcher />` in header

### Phase 5: Route Restructure

- [ ] **C11.** Update `src/App.tsx`:
  - Add `/clinic/*` routes with `ClinicPortalRouteGuard`
  - Rename `/dashboard` to `/admin/dashboard` etc.
  - Add `/admin/login`, `/clinic/login`, OAuth callbacks
  - Keep `/physio/*` routes unchanged (Pool A)

### Phase 6: API Layer (if backend endpoints ready)

- [ ] **C12.** Update `src/api/auth.ts`:
  - Add `initiateEmailAuth()`, `verifyEmailAuth()` for Pool B
  - Add `initiateGoogleAuth()`, `handleGoogleCallback()` for OAuth

- [ ] **C13.** Update `src/lib/token-refresh.ts`:
  - Handle pool-specific refresh if needed
  - Preserve pool identifier on refresh

---

## 8. Dependencies & Sequencing

```
CDK Track (Pool B creation)
        │
        ▼
Backend Track (auth endpoints for Pool B)
        │
        ▼
Web Track (this investigation)
        │
        ├──► Phase 1: Auth Infrastructure (no backend dependency)
        │
        ├──► Phase 2: Login Pages (needs backend endpoints)
        │
        ├──► Phase 3: Route Guards (no backend dependency)
        │
        ├──► Phase 4: UI Components (no backend dependency)
        │
        └──► Phase 5-6: Routes + API (needs backend endpoints)
```

---

## 9. Risk Areas

1. **OAuth State Management:** Google OAuth requires secure `state` parameter to prevent CSRF. Current code has no OAuth handling — need to implement properly.

2. **Token Pool Identification:** When refreshing tokens, we need to know which pool issued them. Options:
   - Store `pool` in auth state (recommended)
   - Decode `iss` claim from token

3. **Legacy URL Handling:** `clinic.moovv.fit` currently maps to physio portal. Need CloudFront redirect (separate track) or gradual migration.

4. **Multi-Role UX:** A physio with both `physio` and `patient` roles needs clear role switcher UX. Switching roles should navigate to the correct dashboard.

5. **Session Isolation:** A user authenticated via Pool A (phone) should not be able to access Pool B routes and vice versa. Route guards must check `pool` field.

---

## 10. Files to Modify (Summary)

| File | Change Type |
|------|-------------|
| `src/store/auth-store.ts` | Extend state (roles, activeRole, pool) |
| `src/lib/portal.ts` | Add 'clinic' portal |
| `src/lib/axios.ts` | Add X-Active-Role header |
| `src/lib/permissions.ts` | Add new roles |
| `src/api/auth.ts` | Add Pool B auth functions |
| `src/lib/token-refresh.ts` | Pool-aware refresh |
| `src/App.tsx` | Route restructure |
| `src/pages/LoginPage.tsx` | Rename/keep for physio |
| **NEW** `src/pages/ClinicLoginPage.tsx` | Email/password |
| **NEW** `src/pages/AdminLoginPage.tsx` | Google OAuth |
| **NEW** `src/pages/OAuthCallbackPage.tsx` | Handle callback |
| **NEW** `src/components/auth/ClinicPortalRouteGuard.tsx` | Guard |
| **NEW** `src/components/auth/AdminPortalRouteGuard.tsx` | Guard |
| **NEW** `src/components/auth/RoleSwitcher.tsx` | UI component |
| `src/components/layout/Header.tsx` | Add RoleSwitcher |

---

*Investigation complete. No code changes made. Checklist ready for implementation phase.*
