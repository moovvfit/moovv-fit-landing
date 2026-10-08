# Clinic Portal vs Physio Portal — Feature Gap Analysis

## Summary

The **Clinic Portal at `/clinic/*` has no dedicated routes or pages**. Clinic admins logging in via `/clinic/login` are redirected to `/physio/dashboard` because `getRoleHomePath()` returns the same path for both portals. The organization features promised on the landing page (moovv.fit/for-clinics/) **DO exist** but are accessible only via `/physio/clinic` route, gated by `ClinicAdminRouteGuard`.

**Critical Bug**: Clinic login redirects to `/physio/dashboard` instead of `/clinic/dashboard` or the organization page.

---

## Routing Bug Explanation

### Code Path Trace

1. **User visits** `/clinic/login` → `LoginPage.tsx` renders
2. **After successful auth** with PHYSIO role, `LoginPage.tsx` calls `getRoleHomePath('PHYSIO')`
3. **`getRoleHomePath()` in `portal.ts`** (lines 90-101):
   ```typescript
   export function getRoleHomePath(role: Role): string {
     const portal = getCurrentPortal()
     
     if (portal === 'admin') return '/admin/dashboard'
     
     // Physio/Clinic portal
     if (role === 'RECEPTIONIST') return '/reception'
     return '/physio/dashboard'  // ← BUG: No clinic-specific path
   }
   ```
4. **Result**: Both physio AND clinic portal users get sent to `/physio/dashboard`

### Root Cause

The `getRoleHomePath()` function doesn't distinguish between `physio` and `clinic` portals for PHYSIO role users. It should return `/clinic/dashboard` when `getCurrentPortal() === 'clinic'`.

---

## What's Implemented (✅) vs Missing (❌)

### Promised Features on /for-clinics/ Landing Page

| Feature | Status | Implementation Details |
|---------|--------|----------------------|
| Organization dashboard | ✅ Implemented | `PhysioClinicPage.tsx` → `DashboardTab` at `/physio/clinic` |
| Bird's-eye view of locations | ✅ Implemented | Per-clinic stats in `OrgClinicStats`, pivot by clinic view |
| Team management | ✅ Implemented | `TeamTab` in `PhysioClinicPage.tsx` |
| Add unlimited physios | ✅ Implemented | `useInviteOrgPhysio()` in `/api/clinic.ts` |
| Receptionist management | ✅ Implemented | `useInviteStaff()`, `useRemoveStaff()` |
| Roles & permissions | ⚠️ Partial | Only ADMIN/PHYSIO roles, no granular permissions |
| Track performance | ✅ Implemented | Per-physio stats: sessions, ratings, revenue, plans |
| Multi-location support | ✅ Implemented | `ClinicsTab` with `useOrgClinics()`, `useCreateClinic()` |
| Cross-location analytics | ✅ Implemented | Pivot table by clinic, aggregated metrics |
| Comparative analytics | ✅ Implemented | Side-by-side clinic stats in `ClinicStatsRow` |
| Centralized reporting | ❌ **Not implemented** | No export/report generation functionality |
| One-click export | ❌ **Not implemented** | No CSV/PDF export for org-level data |
| Unified billing | ❌ **Not implemented** | No billing UI in web app |
| Day view per clinic | ✅ Implemented | `DayViewTab` with `useClinicDayView()` |
| Patient transfer | ✅ Implemented | `useTransferPatientCare()` in clinic.ts |
| Attention alerts | ✅ Implemented | `useOrgAttention()` - pain changes, expiring plans |

### Clinic Portal Routes Analysis

**Defined `/clinic/*` routes in App.tsx:**
```tsx
<Route path="/clinic/login" element={<LoginPage />} />
<Route path="/clinic/" element={<Navigate to="/clinic/login" replace />} />
```

**Missing `/clinic/*` routes:**
- `/clinic/dashboard` — should exist, currently redirects to `/clinic/login`
- `/clinic/team` — no dedicated route
- `/clinic/clinics` — no dedicated route  
- `/clinic/analytics` — no dedicated route

**Organization features hidden at:**
- `/physio/clinic` — protected by `ClinicAdminRouteGuard`

---

## Route Guard Comparison

### PhysioRouteGuard (`/physio/*` routes)
- **File**: `src/components/physio/PhysioRouteGuard.tsx`
- **Requirements**: `isAuthenticated && role === 'PHYSIO'`
- **Behavior**: Redirects non-PHYSIO to `/dashboard`, unauthenticated to `/login`

### ClinicAdminRouteGuard (`/physio/clinic` only)
- **File**: `src/components/physio/ClinicAdminRouteGuard.tsx`
- **Requirements**:
  ```typescript
  membership?.role === 'ADMIN' &&
  membership?.orgType === 'CLINIC_CHAIN' &&
  membership?.status === 'ACTIVE'
  ```
- **Behavior**: Requires PHYSIO role + ADMIN membership in a CLINIC_CHAIN org
- **Fallback**: Redirects to `/physio/dashboard` if not clinic admin

### Key Difference
- **PhysioRouteGuard**: Any authenticated PHYSIO
- **ClinicAdminRouteGuard**: PHYSIO + must be an ADMIN member of a CLINIC_CHAIN organization

---

## API Endpoints for Organization Features

**File**: `src/api/clinic.ts`

| Endpoint | Hook | Purpose |
|----------|------|---------|
| `GET /org/members` | `useOrgMembers()` | List org physios & invites |
| `POST /org/physios/invite` | `useInviteOrgPhysio()` | Invite new physio |
| `POST /org/members/remove` | `useRemoveOrgMember()` | Remove physio |
| `GET /org/dashboard/stats` | `useOrgDashboardStats()` | Org-wide analytics |
| `GET /org/dashboard/attention` | `useOrgAttention()` | Pain changes, expiring plans |
| `GET /org/clinics` | `useOrgClinics()` | List clinics |
| `POST /org/clinics` | `useCreateClinic()` | Add clinic |
| `PUT /org/clinics/:id` | `useUpdateClinic()` | Edit clinic |
| `GET /org/clinics/:id/day` | `useClinicDayView()` | Daily clinic view |
| `GET /org/staff` | `useOrgStaff()` | List receptionists |
| `POST /org/staff/invite` | `useInviteStaff()` | Invite receptionist |
| `POST /org/patients/transfer` | `useTransferPatientCare()` | Transfer patient |

---

## Recommended Fixes

### 1. Fix Login Redirect (Critical)
**File**: `src/lib/portal.ts`

```typescript
export function getRoleHomePath(role: Role): string {
  const portal = getCurrentPortal()
  
  if (portal === 'admin') return '/admin/dashboard'
  
  if (role === 'RECEPTIONIST') return '/reception'
  
  // Clinic portal users go to clinic dashboard
  if (portal === 'clinic') return '/clinic/dashboard'
  
  return '/physio/dashboard'
}
```

### 2. Add Clinic Dashboard Route
**File**: `src/App.tsx`

```tsx
{/* Clinic portal routes */}
<Route path="/clinic/dashboard" element={
  <ClinicAdminRouteGuard><PhysioClinicPage /></ClinicAdminRouteGuard>
} />
```

Or create a dedicated `ClinicDashboardPage` that redirects non-clinic-admins to `/physio/dashboard`.

### 3. Consider Dedicated Clinic Routes
For a cleaner UX, mirror the physio routes under `/clinic/*`:
- `/clinic/dashboard` → Organization dashboard
- `/clinic/team` → Team management
- `/clinic/clinics` → Location management
- `/clinic/analytics` → Cross-location analytics

### 4. Implement Missing Features
- **Centralized reporting**: Add export button to DashboardTab
- **Unified billing**: Link to Stripe portal or add billing management page

---

## Files Referenced

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions |
| `src/lib/portal.ts` | Portal detection & role-based routing |
| `src/pages/LoginPage.tsx` | Login flow & post-auth redirect |
| `src/pages/PhysioClinicPage.tsx` | "My Organization" page with all org features |
| `src/components/physio/ClinicAdminRouteGuard.tsx` | Guards org features |
| `src/components/physio/PhysioRouteGuard.tsx` | Guards physio routes |
| `src/api/clinic.ts` | All organization API hooks & types |

---

## Conclusion

The organization features advertised on the clinic landing page are **largely implemented** but are **inaccessible via the clinic portal path**. The immediate fix is to update `getRoleHomePath()` to return a clinic-specific dashboard path and add the corresponding route. A more complete solution would create dedicated `/clinic/*` routes that mirror the organization sections of `/physio/clinic`.
