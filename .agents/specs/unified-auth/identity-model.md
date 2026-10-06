# Moovv Identity & Organization Model

> **Status:** Implemented (Phase B complete)  
> **Created:** 2026-10-06  
> **Last Updated:** 2026-10-06

---

## Final Identity Model

### Cognito Pools (3-Pool Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│  Pool A (Phone/Email)   │  Pool B (Email/OAuth)  │  Docs Pool   │
│  ─────────────────────  │  ────────────────────  │  ──────────  │
│  • Patients             │  • Clinic Staff        │  • Partner   │
│  • Physios              │  • Clinic Admins       │    Developers│
│    - Phone (default)    │  • Moovv Admins ───────┼──▶ (trusted) │
│    - Email (if clinic)  │                        │              │
└─────────────────────────────────────────────────────────────────┘
```

| Pool | ID | Purpose | Auth Methods | Users |
|------|-----|---------|--------------|-------|
| **Pool A** | `ap-south-1_AulfstD9s` | Patients + Physios | Phone OTP, Email (clinic physios) | ~existing |
| **Pool B Staging** | `ap-south-1_2Pgnh951U` | Clinic + Admin portals | Email/Google | 0 |
| **Pool B Prod** | `ap-south-1_0X3DUfeC7` | Clinic + Admin portals | Email/Google | 0 |
| **Docs Pool** | `ap-south-1_fYA6SWSpX` | Partner API portal | Google/Azure | 1 (Kinetic Age) |

### Key Decisions

1. **Docs Pool stays separate** — Partner developers use Docs Pool for API access, not Pool B
2. **Admin federation (Option 3)** — Pool B `moovv_admin` group trusted by Docs API (cross-pool trust)
3. **Physio dual-auth** — Phone OTP (default) OR email (if clinic-affiliated), both on Pool A

---

## Implementation Status

### ✅ Completed

| Item | Details |
|------|---------|
| Pool B CDK | `unified-auth-stack.ts` — staging + production deployed |
| Pool B Groups | `clinic_admin`, `admin`, `moovv_admin` |
| DocsPoolVerifier | Multi-issuer auth (Docs Pool + Pool B admin federation) |
| SSM Params | `cognito_docs_pool_id`, `cognito_docs_client_ids` (both envs) |
| Backend PR #290 | Merged — DocsPoolVerifier + verifyDocsAuth middleware |

### 🚧 Pending

| Item | Details |
|------|---------|
| Portal auth testing | Need test users in Pool B |
| Physio email auth | Phase C — enable email login for clinic-affiliated physios |
| Partner Portal mode | Phase D — partners using clinic portal instead of SDK |

---

## Partner Model (Existing Schema)

### Database Tables

The existing schema (created by Prisma) handles partner management:

```
partners (plural)
├── id, organization_name, contact_email
├── invite_code, allowed_email_domains
├── is_active, metadata
└── created_at, updated_at

api_keys
├── id, partner_id → partners
├── key_hash, key_prefix (mv_test_ / mv_live_)
├── description, is_active
└── last_used_at, created_by_developer_id

partner_developers
├── id, partner_id → partners
├── cognito_sub, email, name, role
├── allowed_environments
└── is_active
```

### Partner Access Modes

```
┌─────────────────────────────────────────────────────────────────┐
│  Mode A: SDK/API                │  Mode B: Clinic Portal        │
│  ─────────────────────────────  │  ─────────────────────────── │
│  • Docs Pool access             │  • Pool B access (email)      │
│  • Direct integration           │  • Standard clinic workflow   │
│  • Custom booking flows         │  • Uses Moovv UI              │
│  • e.g., Kinetic Age            │  • e.g., small clinic chain   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Docs Portal Architecture

### Single App with Mode Toggle

```
┌─────────────────────────────────────────────────────────────────┐
│                    docs.moovv.fit (Single App)                  │
├─────────────────────────────────────────────────────────────────┤
│  Auth: Docs Pool (ap-south-1_fYA6SWSpX)                         │
│                                                                 │
│  Mode Toggle: [Sandbox] / [Live]                                │
│                                                                 │
│  Sandbox Mode:                    │  Live Mode:                 │
│  ─────────────────────────────    │  ─────────────────────────  │
│  API: api.staging.moovv.fit       │  API: api.moovv.fit         │
│  DB: moovv_fit_staging            │  DB: moovv_fit_production   │
│  Key prefix: mv_test_             │  Key prefix: mv_live_       │
│  Color: Amber 🧪                  │  Color: Emerald 🚀          │
└─────────────────────────────────────────────────────────────────┘
```

### API Key Validation Flow

| Mode | API Endpoint | Database | Key Validated |
|------|--------------|----------|---------------|
| Sandbox | api.staging.moovv.fit | moovv_fit_staging | `mv_test_*` |
| Live | api.moovv.fit | moovv_fit_production | `mv_live_*` |

### Kinetic Age (Live Partner)

| Database | Keys |
|----------|------|
| moovv_fit_staging | `mv_test_` (active) |
| moovv_fit_production | `mv_test_` (inactive), `mv_live_` (active) |

---

## Admin Federation (Option 3)

### Cross-Pool Trust Model

```
┌─────────────────────────────────────────────────────────────────┐
│  Pool B (Primary Identity)      │  Docs Pool (Trusts Pool B)    │
│  ─────────────────────────────  │  ─────────────────────────── │
│  admin@moovv.fit                │  No separate admin user       │
│  groups: [moovv_admin]          │                               │
│                                 │  DocsPoolVerifier:            │
│  Login → Pool B                 │  "Trust Pool B tokens for     │
│                                 │   users in moovv_admin group" │
└─────────────────────────────────────────────────────────────────┘
```

### DocsPoolVerifier Logic

```typescript
// src/shared/auth/docsPoolVerifier.ts
async verify(token: string): Promise<DocsPoolTokenPayload> {
  // 1. Try Docs Pool first (partner developers)
  if (isDocsPoolToken(token)) {
    return verifyDocsPool(token) // → partner access
  }
  
  // 2. Try Pool B (Moovv admins)
  if (isPoolBToken(token) && hasGroup('moovv_admin')) {
    return verifyPoolB(token) // → admin access
  }
  
  throw new Error('Unauthorized')
}
```

### CDK Configuration

```typescript
// moovv-fit-infra/cdk/lib/unified-auth-stack.ts
new cognito.CfnUserPoolGroup(this, 'MoovvAdminGroup', {
  userPoolId: this.userPool.userPoolId,
  groupName: 'moovv_admin',
  description: 'Moovv admins with Docs portal access (admin federation)',
})
```

---

## SSM Parameters

### Staging (`/moovv-fit/staging/`)

| Parameter | Value |
|-----------|-------|
| `cognito_pool_b_id` | `ap-south-1_2Pgnh951U` |
| `cognito_clinic_portal_client_id` | `2kul2khs0g58aaql5c8ca7uok3` |
| `cognito_admin_portal_client_id` | `3855djhdraj4trm2a6mkqn7f48` |
| `cognito_pool_b_domain` | `moovv-fit-portal-staging.auth.ap-south-1.amazoncognito.com` |
| `cognito_docs_pool_id` | `ap-south-1_fYA6SWSpX` |
| `cognito_docs_client_ids` | `3nj9u7bgu32ahisvfrrlkpnkpd` |

### Production (`/moovv-fit/production/`)

| Parameter | Value |
|-----------|-------|
| `cognito_pool_b_id` | `ap-south-1_0X3DUfeC7` |
| `cognito_pool_b_domain` | `moovv-fit-portal.auth.ap-south-1.amazoncognito.com` |
| `cognito_docs_pool_id` | `ap-south-1_fYA6SWSpX` |
| `cognito_docs_client_ids` | `3nj9u7bgu32ahisvfrrlkpnkpd` |

---

## Next Steps

### Phase C: Physio Email Auth

1. Enable email as additional auth method in Pool A
2. Add clinic invitation flow (sends email link)
3. Link phone + email identities in backend
4. Update /physio/ portal to support email login

### Phase D: Partner Portal Mode

1. Add partner users to Pool B (clinic portal access)
2. Link partner → clinic in backend
3. Partner can manage their clinic via standard portal

---

## Appendix: Pool Configurations

### Pool B Staging
```yaml
User Pool ID: ap-south-1_2Pgnh951U
Domain: moovv-fit-portal-staging
App Clients:
  - moovv-clinic-portal (2kul2khs0g58aaql5c8ca7uok3)
  - moovv-admin-portal (3855djhdraj4trm2a6mkqn7f48)
Groups: admin, clinic_admin, moovv_admin
Identity Providers: Google
```

### Pool B Production
```yaml
User Pool ID: ap-south-1_0X3DUfeC7
Domain: moovv-fit-portal
App Clients:
  - moovv-clinic-portal
  - moovv-admin-portal
Groups: admin, clinic_admin, moovv_admin
Identity Providers: Google
```

### Docs Pool
```yaml
User Pool ID: ap-south-1_fYA6SWSpX
Domain: moovv-fit-docs
App Client: moovv-fit-docs-client (3nj9u7bgu32ahisvfrrlkpnkpd)
Identity Providers: Google, Azure
Callback URLs:
  - https://docs.moovv.fit/callback
  - http://localhost:5173/callback
Live Partner: Kinetic Age (sandbox + live access)
```
