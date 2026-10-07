# Clinic Portal vs Physio Portal Feature Gap Analysis

**Date:** 2026-10-07  
**Status:** Investigation Complete

## Executive Summary

The **Clinic Portal is functionally identical to the Physio Portal** — there is no separate `/clinic/*` route tree. Both share the same codebase, the same routes, and the same login flow. The "clinic portal" exists only as a URL entry point (`/clinic/login`), but after authentication, all users land on `/physio/dashboard` regardless of which portal they entered from.

The **org/clinic-specific features DO exist**, but they are accessed through the Physio Portal by physios who have the `ADMIN` role within a `CLINIC_CHAIN` organization. There is no separate "Clinic Admin Dashboard" — there's only the "My Clinic" page (`/physio/clinic`) which is gated by `ClinicAdminRouteGuard`.

**The routing bug**: When a clinic admin logs in via `/clinic/login`, they get redirected to `/physio/dashboard` (the standard physio dashboard) instead of `/physio/clinic` (the org management page). This is by design in the current code — `getRoleHomePath()` returns `/physio/dashboard` for all PHYSIO role users regardless of their org membership status.

---

## 1. What Routes Exist?

### Clinic-specific routes: **NONE**

There are no `/clinic/*` routes beyond login:
```tsx
// App.tsx
<Route path="/clinic/login" element={<LoginPage />} />
<Route path="/clinic/" element={<Navigate to="/clinic/login" replace />} />
```

### All routes after login are under `/physio/*`:
- `/physio/dashboard` — PhysioDashboardPage
- `/physio/clinic` — PhysioClinicPage (org admin features, gated by ClinicAdminRouteGuard)
- `/physio/profile`, `/physio/patients`, `/physio/appointments`, etc.

### The "My Organization" page exists at `/physio/clinic`

This is where the org-level features live — but it's accessed through a side navigation link, not through a separate clinic portal.

---

## 2. Implemented Features (File Paths)

### ✅ Organization Dashboard
**File:** `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioClinicPage.tsx`

The `DashboardTab` component provides:
- Org-level summary metrics (physio count, active patients, sessions this month, revenue)
- Per-physio breakdown table (patients, sessions tele/clinic, rating, revenue, plans, notes, cancellations, booked hours)
- Per-clinic breakdown table (physios, patients, sessions, rating, revenue, cancellations, hours)
- "Needs attention" panel (pain spikes and expiring plans across all physios)

### ✅ Team Management
**File:** `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioClinicPage.tsx` — `TeamTab`

The `TeamTab` component provides:
- List of org members (physios) with role, clinic assignment, status
- Invite new physio (phone, name, clinic assignment)
- Remove physio from org
- Transfer patient care between physios
- List of staff (receptionists)
- Invite/remove staff

### ✅ Multi-Location Support
**File:** `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioClinicPage.tsx` — `ClinicsTab`

The `ClinicsTab` component provides:
- List of all clinics with physio/staff counts
- Add new clinic (name, address, phone)
- Edit clinic details
- Deactivate clinic (when empty)
- Toggle telehealth permission per clinic
- Move physio between clinics

### ✅ Day View (Cross-Location Operations)
**File:** `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioClinicPage.tsx` — `DayViewTab`

Provides per-clinic daily operational view:
- Revenue today
- Walk-in queue status (waiting, picked, oldest wait)
- Patients added today
- Per-physio utilization (sessions, booked/available hours)
- Key actions audit trail

### ✅ API Layer for Org Features
**File:** `/mnt/workspace/src/moovv-fit-web/src/api/clinic.ts`

Comprehensive API support including:
- `useOrgDashboardStats()` — Aggregated stats across all physios and clinics
- `useOrgAttention()` — Pain spikes and expiring plans
- `useOrgMembers()` — Physio roster with invite/remove
- `useOrgClinics()` — Clinic management
- `useOrgStaff()` — Receptionist management
- `useClinicDayView()` — Daily operational metrics
- `usePhysioPatients()` / `useTransferPatientCare()` — Patient reassignment

---

## 3. Missing/Gap Features

### ❌ Cross-Location Comparative Analytics
The landing page promises:
> "Compare performance across locations. Identify top performers, spot bottlenecks, and optimize resource allocation."

**Current state:** The `DashboardTab` shows per-clinic stats in a table, but there's no:
- Visual comparison charts between locations
- Trend analysis over time
- Benchmarking against org averages
- Bottleneck identification logic

### ❌ Centralized Reporting / Export
The landing page promises:
> "Consolidated reports for compliance, insurance, and business reviews. Export data across all locations with one click."

**Current state:** No export functionality visible in PhysioClinicPage. No consolidated report generation.

### ❌ Unified Billing View
The landing page promises:
> "Single invoice for your entire organization."

**Current state:** No billing/invoice UI in the org management pages. This is likely handled outside the web app (backend/admin only).

### ❌ Separate Clinic Portal Entry Experience
**Current state:** The `/clinic/login` page renders the exact same `LoginPage` component as `/physio/login`. After login, the user lands on `/physio/dashboard` regardless of entry point. There's no distinct clinic admin landing experience.

---

## 4. The Routing Bug Explained

### Code Path Analysis

1. **User navigates to** `https://app.moovv.fit/clinic/login`

2. **Portal detection** (`/mnt/workspace/src/moovv-fit-web/src/lib/portal.ts`):
   ```typescript
   export function getCurrentPortal(): Portal {
     // ...
     if (hostname.startsWith('app.') || hostname.startsWith('app-')) {
       if (pathname.startsWith('/clinic')) return 'clinic'
       // ...
     }
   }
   ```
   ✅ Correctly returns `'clinic'`

3. **Role allowed check** (`portal.ts`):
   ```typescript
   const PORTAL_ROLE_MAP: Record<Portal, Role[]> = {
     clinic: ['PHYSIO', 'RECEPTIONIST'], // Same as physio!
   }
   ```
   ✅ PHYSIO role is allowed

4. **Login success** (`LoginPage.tsx`):
   ```typescript
   if (response.role === 'PHYSIO') {
     navigate(getRoleHomePath('PHYSIO'), { replace: true })
   }
   ```

5. **getRoleHomePath** (`portal.ts`):
   ```typescript
   export function getRoleHomePath(role: Role): string {
     const portal = getCurrentPortal()
     // Admin portal
     if (portal === 'admin') return '/admin/dashboard'
     
     // Physio/Clinic portal — TREATS THEM THE SAME
     if (role === 'RECEPTIONIST') return '/reception'
     return '/physio/dashboard'  // <-- BUG: Always returns this
   }
   ```
   **🐛 Bug:** For `clinic` portal with `PHYSIO` role, it returns `/physio/dashboard` instead of considering org admin status.

### Why Clinic Admins See Physio Dashboard

The login flow has no awareness of `membership.role === 'ADMIN'` or `membership.orgType === 'CLINIC_CHAIN'`. It only checks the login role (`PHYSIO` vs `ADMIN` vs `RECEPTIONIST`).

A clinic chain admin is stored as:
- `UserProfile.role = 'PHYSIO'` (login role)
- `OrganizationMembership.role = 'ADMIN'` (org role within the chain)

The login doesn't fetch or check org membership — it just routes based on the login role.

---

## 5. Recommended Fixes

### Fix 1: Portal-Aware Routing for Clinic Admins (Quick Fix)

Update `getRoleHomePath()` to return `/physio/clinic` for the clinic portal:

```typescript
export function getRoleHomePath(role: Role): string {
  const portal = getCurrentPortal()
  if (portal === 'admin') return '/admin/dashboard'
  if (portal === 'clinic') return '/physio/clinic'  // <-- ADD THIS
  if (role === 'RECEPTIONIST') return '/reception'
  return '/physio/dashboard'
}
```

**Caveat:** This sends ALL clinic portal users to `/physio/clinic`, even non-admin physios. The `ClinicAdminRouteGuard` will redirect non-admins back to `/physio/dashboard`, causing a flash of redirect.

### Fix 2: Fetch Org Membership During Login (Better Fix)

1. After `verifyAuth()` returns, fetch the physio's profile/membership
2. Check if they're a CLINIC_CHAIN ADMIN
3. Route accordingly:
   - Clinic portal + CLINIC_CHAIN ADMIN → `/physio/clinic`
   - Clinic portal + regular PHYSIO → `/physio/dashboard`
   - Physio portal → `/physio/dashboard`

This requires a new API call or extending `verifyAuth` to include org membership info.

### Fix 3: Create Distinct Clinic Admin Dashboard (Long-term)

If the product intent is truly to have a separate "Clinic Portal" experience:
1. Create `/clinic/dashboard` route with a `ClinicDashboardPage`
2. This page would be a version of `PhysioClinicPage` focused on org-level overview
3. Include navigation to physio-level features when needed
4. Gate all `/clinic/*` routes with `ClinicAdminRouteGuard`

---

## 6. Architecture Notes

### User Roles vs Org Roles

| Login Role | Stored In | Purpose |
|------------|-----------|---------|
| ADMIN | UserProfile.role | Platform admin (moovv staff) |
| PHYSIO | UserProfile.role | Any practitioner |
| RECEPTIONIST | UserProfile.role | Front desk staff |
| CUSTOMER | UserProfile.role | Patient (mobile app only) |

| Org Role | Stored In | Purpose |
|----------|-----------|---------|
| ADMIN | OrganizationMembership.role | Clinic chain owner/manager |
| PHYSIO | OrganizationMembership.role | Staff physio at a clinic |

The `ClinicAdminRouteGuard` checks:
```typescript
const isClinicAdmin =
  membership?.role === 'ADMIN' &&           // Org role, not login role
  membership?.orgType === 'CLINIC_CHAIN' && // Not a SOLO practice
  membership?.status === 'ACTIVE'
```

### Portal Detection Summary

| URL | Portal | Who can login | Where they land |
|-----|--------|---------------|-----------------|
| `/physio/login` | physio | PHYSIO, RECEPTIONIST | /physio/dashboard or /reception |
| `/clinic/login` | clinic | PHYSIO, RECEPTIONIST | /physio/dashboard (bug!) |
| `/admin/login` | admin | ADMIN | /admin/dashboard |

---

## 7. Files Referenced

| File | Purpose |
|------|---------|
| `/mnt/workspace/src/moovv-fit-web/src/App.tsx` | All route definitions |
| `/mnt/workspace/src/moovv-fit-web/src/lib/portal.ts` | Portal detection, role routing |
| `/mnt/workspace/src/moovv-fit-web/src/pages/LoginPage.tsx` | Login flow |
| `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioDashboardPage.tsx` | Standard physio dashboard |
| `/mnt/workspace/src/moovv-fit-web/src/pages/PhysioClinicPage.tsx` | Org admin features ("My Organization") |
| `/mnt/workspace/src/moovv-fit-web/src/components/physio/PhysioRouteGuard.tsx` | Physio route protection |
| `/mnt/workspace/src/moovv-fit-web/src/components/physio/ClinicAdminRouteGuard.tsx` | Org admin route protection |
| `/mnt/workspace/src/moovv-fit-web/src/api/clinic.ts` | All org/clinic API calls |
| `/mnt/workspace/src/moovv-fit-web/src/api/physio-profile.ts` | Profile with org membership |
| `/mnt/workspace/src/moovv-fit-web/src/store/auth-store.ts` | Auth state (no org info) |
| `/mnt/workspace/src/moovv-fit-landing/for-clinics/index.html` | Clinic landing page promises |
