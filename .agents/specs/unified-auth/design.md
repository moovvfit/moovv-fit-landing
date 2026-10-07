# Unified Auth & Web Platform — Technical Design

> **Status:** Draft  
> **Owner:** Platform Team  
> **Created:** 2026-09-30

---

## 1. Architecture Overview

```
                         ┌─────────────────────────────────────┐
                         │           app.moovv.fit             │
                         │         (CloudFront + S3)           │
                         └─────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
              /  (patient)        /physio/*             /clinic/*  /admin/*
              Flutter Web         React/Next            React/Next
                    │                    │                    │
                    └─────────┬──────────┘                    │
                              │                               │
                              ▼                               ▼
                    ┌─────────────────┐             ┌─────────────────┐
                    │     Pool A      │             │     Pool B      │
                    │   (Phone OTP)   │             │  (Email/Google) │
                    │                 │             │                 │
                    │ Groups:         │             │ Groups:         │
                    │  - patient      │             │  - clinic_admin │
                    │  - physio       │             │  - admin        │
                    │                 │             │                 │
                    │ Triggers:       │             │ IdPs:           │
                    │  - Custom OTP   │             │  - Cognito      │
                    │  - SMS Lambda   │             │  - Google       │
                    └─────────────────┘             └─────────────────┘
                              │                               │
                              └───────────────┬───────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Backend API   │
                                    │   (Lambda)      │
                                    │                 │
                                    │ JWT validation: │
                                    │  - Check iss    │
                                    │  - Check groups │
                                    └─────────────────┘
```

---

## 2. Cognito Configuration

### 2.1 Pool A — Patients & Physios (Existing)

| Environment | Pool ID |
|-------------|---------|
| Production  | `ap-south-1_AulfstD9s` |
| Staging     | `ap-south-1_lAZmuElh6` |

> ⚠️ **See [ADR-004: Cognito Environment Parity](/moovv-fit-infra/docs/architecture/adr/ADR-004-COGNITO-ENVIRONMENT-PARITY.md)** — All Cognito changes must be applied to both environments.

**Changes Required:**
```
ADD Groups:
  - patient (description: "App users - patients")
  - physio (description: "Physiotherapists")

NO CHANGE to:
  - UsernameAttributes: [phone_number]
  - Lambda triggers (OTP flow)
  - App client
```

**Group Assignment Logic:**
| Event | Action |
|-------|--------|
| Patient signs up | Add to `patient` group |
| Physio approved (admin action) | Add to `physio` group |
| Physio wants patient features | Add to both `patient` + `physio` |

---

### 2.2 Pool B — Clinic & Admin (New)

**Proposed Name:** `moovv-fit-portal-users`

**Configuration:**
```yaml
UserPoolName: moovv-fit-portal-users
UsernameAttributes:
  - email
AutoVerifiedAttributes:
  - email
MfaConfiguration: OPTIONAL
PasswordPolicy:
  MinimumLength: 12
  RequireUppercase: true
  RequireLowercase: true
  RequireNumbers: true
  RequireSymbols: false

Groups:
  - clinic_admin
  - admin

IdentityProviders:
  - Google:
      ClientId: <google-client-id>
      ClientSecret: <google-client-secret>
      AuthorizeScopes: [email, profile, openid]
      AttributeMapping:
        email: email
        name: name
        picture: picture

AppClients:
  - Name: moovv-clinic-portal
    GenerateSecret: false
    AllowedOAuthFlows: [code]
    AllowedOAuthScopes: [email, openid, profile]
    CallbackURLs:
      - https://app.moovv.fit/clinic/callback
      - http://localhost:3000/clinic/callback
    LogoutURLs:
      - https://app.moovv.fit/clinic
      - http://localhost:3000/clinic

  - Name: moovv-admin-portal
    GenerateSecret: false
    AllowedOAuthFlows: [code]
    AllowedOAuthScopes: [email, openid, profile]
    SupportedIdentityProviders: [Google]  # Google ONLY
    CallbackURLs:
      - https://app.moovv.fit/admin/callback
      - http://localhost:3000/admin/callback
    LogoutURLs:
      - https://app.moovv.fit/admin
      - http://localhost:3000/admin

LambdaTriggers:
  PreSignUp: moovv-portal-pre-signup  # Validate @moovv.fit for admin
```

---

### 2.3 Google OAuth Domain Restriction

**Lambda: `moovv-portal-pre-signup`**

```typescript
export const handler = async (event: PreSignUpTriggerEvent) => {
  const { userPoolId, request, triggerSource } = event;
  const email = request.userAttributes.email;
  const clientId = event.callerContext.clientId;
  
  // Admin client requires @moovv.fit domain
  const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID;
  
  if (clientId === ADMIN_CLIENT_ID) {
    if (!email?.endsWith('@moovv.fit')) {
      throw new Error('Admin access restricted to @moovv.fit accounts');
    }
  }
  
  // Auto-confirm Google federated users
  if (triggerSource === 'PreSignUp_ExternalProvider') {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }
  
  return event;
};
```

---

## 3. URL Routing & CloudFront

### 3.1 CloudFront Behaviors

| Path Pattern | Origin | Cache | Notes |
|--------------|--------|-------|-------|
| `/` | S3: patient-web | 1 day | Flutter web (patient) |
| `/physio/*` | S3: physio-portal | 1 hour | React app |
| `/clinic/*` | S3: clinic-portal | 1 hour | React app |
| `/admin/*` | S3: admin-portal | 1 hour | React app |
| `/api/*` | API Gateway | No cache | Backend API |

### 6.1 S3 Bucket Structure

**Production:**
```
s3://moovv-fit-content-production/
├── web/
│   ├── landing/      # Landing pages (www.moovv.fit)
│   ├── patient/      # Flutter web (app.moovv.fit/)
│   ├── physio/       # Physio portal (app.moovv.fit/physio/)
│   ├── clinic/       # Clinic portal (app.moovv.fit/clinic/)
│   └── admin/        # Admin portal (app.moovv.fit/admin/)
├── docs/
└── library/
```

**Staging:**
```
s3://moovv-fit-content-staging/
├── web/
│   ├── landing/      # Landing pages (staging.moovv.fit)
│   ├── patient/      # Flutter web (app-staging.moovv.fit/)
│   ├── physio/       # Physio portal (app-staging.moovv.fit/physio/)
│   ├── clinic/       # Clinic portal (app-staging.moovv.fit/clinic/)
│   └── admin/        # Admin portal (app-staging.moovv.fit/admin/)
├── docs/
└── library/
```

**Note:** Uses existing buckets — no new buckets needed.

### 3.3 Legacy Domain Redirects

**CloudFront Function: `legacy-redirect`**

```javascript
function handler(event) {
  var host = event.request.headers.host.value;
  
  var redirects = {
    'physio.moovv.fit': 'https://app.moovv.fit/physio',
    'clinic.moovv.fit': 'https://app.moovv.fit/clinic'
  };
  
  if (redirects[host]) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: redirects[host] + event.request.uri }
      }
    };
  }
  
  return event.request;
}
```

---

## 4. JWT Validation (Backend)

### 4.1 Multi-Pool Verification

```typescript
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifierPoolA = CognitoJwtVerifier.create({
  userPoolId: 'ap-south-1_AulfstD9s',  // Phone pool
  tokenUse: 'access',
  clientId: '2nbaqismtqd8afpngop0bvkcl6',
});

const verifierPoolB = CognitoJwtVerifier.create({
  userPoolId: 'ap-south-1_XXXXXXXXX',  // Email pool (new)
  tokenUse: 'access',
  clientId: ['clinic-client-id', 'admin-client-id'],
});

export async function verifyToken(token: string) {
  // Try Pool A first (most common)
  try {
    const payload = await verifierPoolA.verify(token);
    return { pool: 'A', ...payload };
  } catch (e) {
    // Try Pool B
    const payload = await verifierPoolB.verify(token);
    return { pool: 'B', ...payload };
  }
}
```

### 4.2 Role Extraction

```typescript
interface TokenPayload {
  sub: string;
  'cognito:groups'?: string[];
  email?: string;
  phone_number?: string;
}

export function extractRoles(payload: TokenPayload): string[] {
  return payload['cognito:groups'] || [];
}

export function hasRole(payload: TokenPayload, role: string): boolean {
  return extractRoles(payload).includes(role);
}

// Usage in handler
if (!hasRole(payload, 'physio')) {
  return createErrorResponse(403, 'Physio access required');
}
```

---

## 5. Role Switcher (Frontend)

### 5.1 State Management

```typescript
interface AuthState {
  user: {
    sub: string;
    email?: string;
    phone?: string;
    name: string;
  };
  roles: ('patient' | 'physio' | 'clinic_admin' | 'admin')[];
  activeRole: string;
  pool: 'A' | 'B';
}

// Role switch — no re-auth needed
function switchRole(newRole: string) {
  if (!state.roles.includes(newRole)) {
    throw new Error('User does not have this role');
  }
  
  state.activeRole = newRole;
  localStorage.setItem('activeRole', newRole);
  
  // Navigate to role's dashboard
  const routes = {
    patient: '/',
    physio: '/physio/dashboard',
    clinic_admin: '/clinic/dashboard',
    admin: '/admin/dashboard',
  };
  
  router.push(routes[newRole]);
}
```

### 5.2 UI Component

```tsx
function RoleSwitcher() {
  const { roles, activeRole, user } = useAuth();
  
  if (roles.length <= 1) return null; // Single role, no switcher
  
  return (
    <DropdownMenu>
      <DropdownTrigger>
        <Avatar src={user.picture} />
        <span>{user.name}</span>
        <ChevronDown />
      </DropdownTrigger>
      
      <DropdownContent>
        {roles.map(role => (
          <DropdownItem 
            key={role}
            onClick={() => switchRole(role)}
            active={role === activeRole}
          >
            <RoleIcon role={role} />
            <span>{roleLabels[role]}</span>
            {role === activeRole && <CheckIcon />}
          </DropdownItem>
        ))}
        
        <DropdownSeparator />
        <DropdownItem onClick={logout}>Sign out</DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}
```

---

## 6. Self-Booking Prevention

### 6.1 Backend Check

```typescript
// In booking handler
export async function createBooking(event: APIGatewayEvent) {
  const token = extractToken(event);
  const payload = await verifyToken(token);
  const userId = payload.sub;
  
  const { physioId, ...bookingData } = parseBody(event);
  
  // Get physio's Cognito sub
  const physio = await PhysioProfile.findByPk(physioId);
  
  if (physio.cognitoSub === userId) {
    return createErrorResponse(400, 'Cannot book appointment with yourself', 'SELF_BOOKING');
  }
  
  // Continue with booking...
}
```

### 6.2 Frontend Check

```typescript
function BookingForm({ physio }) {
  const { user } = useAuth();
  
  const isSelf = physio.cognitoSub === user.sub;
  
  if (isSelf) {
    return (
      <Alert variant="warning">
        You cannot book an appointment with yourself.
      </Alert>
    );
  }
  
  return <BookingFormFields physio={physio} />;
}
```

---

## 7. Migration Plan

### Phase 1: Cognito Setup (Week 1)
1. Add groups to Pool A (`patient`, `physio`)
2. Create Pool B with email + Google OAuth
3. Deploy pre-signup Lambda for domain restriction
4. Test auth flows in staging

### Phase 2: Backend Updates (Week 2)
1. Update JWT verification to support both pools
2. Add role checking middleware
3. Implement self-booking prevention
4. Add group assignment endpoints (admin)

### Phase 3: Frontend Updates (Week 3)
1. Update physio portal auth to Pool A (phone OTP)
2. Build clinic portal with Pool B auth
3. Build admin portal with Google OAuth
4. Implement role switcher component

### Phase 4: Infrastructure (Week 4)
1. Configure CloudFront for `app.moovv.fit`
2. Set up S3 origins for each portal
3. Deploy legacy domain redirects
4. SSL cert verification

### Phase 5: Launch (Week 5)
1. Deploy Flutter web (patient) — login hidden initially
2. Cut over physio portal to new domain
3. Cut over clinic portal to new domain
4. Monitor and fix issues

---

## 8. Rollback Plan

| Component | Rollback Action |
|-----------|-----------------|
| Pool A groups | Groups are additive, no rollback needed |
| Pool B | Delete pool, revert to old clinic auth |
| CloudFront | Revert to old distributions |
| Legacy redirects | Remove CloudFront function |
| Backend | Feature flag to use old auth flow |

---

## 9. Testing Checklist

- [ ] Patient login (phone OTP) works on web
- [ ] Physio login (phone OTP) works on `/physio`
- [ ] Physio with patient role can switch roles
- [ ] Clinic admin login (email/password) works
- [ ] Admin login (Google) works
- [ ] Non-@moovv.fit Google login rejected for admin
- [ ] Self-booking blocked for physios
- [ ] Legacy domain redirects work
- [ ] JWT validation works for both pools
- [ ] Role switcher shows correct roles
- [ ] Session persists across role switch
