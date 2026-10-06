# Moovv Identity & Organization Model

> **Status:** Draft  
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
2. **Admin federation** — Pool B `moovv_admin` trusted by Docs API (cross-pool trust)
3. **Physio dual-auth** — Phone OTP (default) OR email (if clinic-affiliated), both on Pool A

---

## Identity Tiers

### Tier 1: End Users (Pool A)

| Role | Auth Method | Access |
|------|-------------|--------|
| Patient | Phone OTP | Mobile app |
| Physio (independent) | Phone OTP | Mobile app, /physio/ portal |
| Physio (clinic-affiliated) | Phone OTP OR Email | Mobile app, /physio/ portal |

**Physio clinic affiliation flow:**
1. Clinic invites physio by email
2. Physio can then login with email OR phone
3. Both methods → same Pool A identity (linked via backend)
4. Clinic portal shows their affiliated physios

### Tier 2: Business Users (Pool B)

| Role | Auth Method | Access |
|------|-------------|--------|
| Clinic Staff | Email/Password | /clinic/ portal |
| Clinic Admin | Email/Google | /clinic/ portal |
| Moovv Admin | Google (@moovv.fit) | /admin/ portal, Docs API (federated) |

**Pool B Groups:**
- `clinic_admin` — Clinic management
- `admin` — Moovv internal (platform ops)
- `moovv_admin` — Moovv internal (includes Docs access)

### Tier 3: Partner Developers (Docs Pool)

| Role | Auth Method | Access |
|------|-------------|--------|
| Partner Admin | Google/Azure | docs.moovv.fit (full API access) |
| Partner Developer | Google/Azure | docs.moovv.fit (sandbox + read) |

**Docs Pool stays independent** — dedicated to SDK/API integration partners.

---

## Partner Model

### Partner Access Modes

```
┌─────────────────────────────────────────────────────────────────┐
│  Mode A: SDK/API                │  Mode B: Clinic Portal        │
│  ─────────────────────────────  │  ─────────────────────────── │
│  • Docs Pool access (API keys)  │  • Pool B access (email)      │
│  • Direct integration           │  • Standard clinic workflow   │
│  • Custom booking flows         │  • Uses Moovv UI              │
│  • e.g., Kinetic Age            │  • e.g., small clinic chain   │
└─────────────────────────────────────────────────────────────────┘

Partners choose ONE mode (or both if needed)
```

### Partner → Clinic Relationship

- Partners can own clinics but interact via SDK/API, not portal
- Partner's tech team uses Docs Pool for integration
- Partner's physios available for Moovv app user reviews
- If using Clinic Portal mode → standard Pool B access

### Data Model

```
Partner (NEW - B2B entity)
├── id, name, logo
├── api_mode: SDK | PORTAL | BOTH
├── sandbox_api_key, live_api_key
├── tech_contacts[] → Docs Pool users
└── clinics[] → Organization (optional)

Organization (Existing)
├── type: SOLO | CLINIC_CHAIN
├── parent_partner_id → Partner (optional)
├── clinics[] (for CLINIC_CHAIN)
└── memberships[] → Physios

Physio (Pool A)
├── org_membership → Organization
├── role: OWNER | ADMIN | MEMBER
└── auth_methods: [PHONE, EMAIL]
```

---

## Admin Federation (Option 3)

### Cross-Pool Trust Model

```
┌─────────────────────────────────────────────────────────────────┐
│  Pool B (Primary Identity)      │  Docs Pool (Trusts Pool B)    │
│  ─────────────────────────────  │  ─────────────────────────── │
│  admin@moovv.fit                │  No separate admin user       │
│  groups: [moovv_admin]          │                               │
│                                 │  Docs API authorizer:         │
│  Login → Pool B                 │  "Trust Pool B tokens for     │
│                                 │   users in moovv_admin group" │
└─────────────────────────────────────────────────────────────────┘
```

### Flow

1. Admin logs into Pool B (admin portal)
2. Needs to access Docs admin panel
3. Docs API validates Pool B JWT
4. Checks: is user in `moovv_admin` group? → Grant access
5. No second login needed (token passed via redirect/cookie)

### CDK Impact

| Stack | Changes |
|-------|---------|
| **Auth Stack (moovv-fit-infra)** | None |
| **Docs Stack** | Update API authorizer for multi-issuer validation |

**Authorizer logic:**
```python
def authorize(token):
    # Try Docs Pool first (partner developers)
    if validate_docs_pool(token):
        return partner_access(token)
    
    # Try Pool B (Moovv admins)
    if validate_pool_b(token):
        if 'moovv_admin' in token.groups:
            return admin_access(token)
    
    return deny()
```

---

## Breaking Changes & Risks

### Kinetic Age (LIVE PARTNER)

| Risk | Impact | Mitigation |
|------|--------|------------|
| None with current plan | Docs Pool unchanged | No migration needed |

**Kinetic Age stays on Docs Pool** — no breaking changes for existing partner.

### Future: If Merging Docs Pool to Pool B

Only if we later decide to fully merge (not current plan):

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auth URL change | Login breaks | Redirect from old Cognito domain |
| Token format change | API calls fail | Verify JWT claims match |
| Stored tokens invalid | Force re-login | Clear localStorage, show message |

---

## Implementation Phases

### Phase A: Backend Partner Model

1. Create `Partner` table in backend DB
2. Create `PartnerMembership` table (user → partner, role)
3. Add `/v1/partners/*` admin endpoints
4. Migrate Kinetic Age data to new tables

### Phase B: Admin Federation

1. Export Pool B issuer URL from Auth Stack
2. Update Docs API authorizer for multi-issuer validation
3. Add `moovv_admin` group to Pool B
4. Test admin access to Docs API via Pool B token

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

### Pool A (Patients + Physios)
```yaml
User Pool ID: ap-south-1_AulfstD9s
Auth: Phone OTP (primary), Email (clinic physios)
Access: Mobile app, /physio/ portal
```

### Pool B Staging
```yaml
User Pool ID: ap-south-1_2Pgnh951U
Domain: moovv-fit-portal-staging
App Clients:
  - moovv-clinic-portal
  - moovv-admin-portal
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
