# Multi-Pool JWT Verification and Role Utilities for Unified Auth

Implements backend authentication support for two Cognito pools: existing Pool A (phone OTP for patients/physios) and new Pool B (email/Google for clinic admins/platform admins). Adds role extraction from `cognito:groups`, X-Active-Role header support, and self-booking prevention.

**Watch for:** Self-booking check has a fail-open edge case when `cognitoSub` is null on either user record (confirmed). Pool A hardcoded fallback in constructor is intentional but worth noting.

**Verdict**: APPROVED

---

## High-level view

The multi-pool verifier uses issuer-based pool detection by decoding the JWT's `iss` claim before verification, then routes to the appropriate Cognito verifier. This avoids the latency of try-catch fallback for correctly-formed tokens while maintaining fallback for malformed or ambiguous tokens. The verifier is a singleton cached across Lambda invocations—standard optimization for warm starts.

Role utilities are pure functions that extract `cognito:groups` from the token payload. The `requireRole` and `requireAnyRole` helpers throw a typed `RoleError` with HTTP 403, which handlers can catch and convert to error responses. This design matches the existing error envelope pattern in the codebase.

Self-booking prevention compares `cognitoSub` between the patient's `UserProfile` and the physio's `UserProfile`. The check blocks booking when both have matching non-null `cognitoSub` values, but **allows booking if either `cognitoSub` is null**. This is a fail-open gap—if a physio's user record predates Cognito migration or has a missing link, the check won't fire.

---

<details>
<summary>Issues (2)</summary>

1. **Self-booking fail-open when cognitoSub null** — Both booking handlers skip the self-booking check if either user's `cognitoSub` is null. A physio with a legacy record (null `cognitoSub`) could book themselves as a patient. Consider logging a warning when `cognitoSub` is missing and the check is skipped, or treating null-null as a blocking condition. *Confidence: confirmed*

2. **Pool A hardcoded fallback** — `multiPoolVerifier.ts` falls back to hardcoded Pool A ID `ap-south-1_AulfstD9s` when `COGNITO_USER_POOL_ID` is unset. This matches existing codebase pattern but means deployment without env vars silently targets production Pool A. No action required if this is intentional. *Confidence: confirmed*

</details>

---

<details>
<summary>Details</summary>

### Self-booking prevention edge case

In `physio-book-session-for-patient.ts`:

```typescript
const patientUser = await UserProfile.findByPk(patientUserId);
if (patientUser?.cognitoSub) {
  const physioUser = await UserProfile.findByPk(physioUserId);
  if (physioUser?.cognitoSub && patientUser.cognitoSub === physioUser.cognitoSub) {
    return createErrorEnvelope(400, 'Cannot book appointment with yourself');
  }
}
```

The nested conditionals mean the check only fires when **both** `cognitoSub` values are truthy. If the physio's `UserProfile.cognitoSub` is null (e.g., legacy data, migration issue), the booking proceeds. The reception handler has the same pattern.

This is a low-probability scenario in practice—active physios should have Cognito records—but represents a gap in the defense.

</details>

---

<details>
<summary>File map</summary>

| File | Change |
|------|--------|
| `src/shared/auth/multiPoolVerifier.ts` | New: Singleton multi-pool JWT verifier with iss-based pool detection |
| `src/shared/auth/roleUtils.ts` | New: Role extraction and checking utilities (extractRoles, hasRole, requireRole, etc.) |
| `src/shared/auth/index.ts` | New: Barrel exports for auth module |
| `src/shared/utils/cognito.ts` | Added `verifyMultiPoolCognitoToken()` wrapper |
| `src/shared/middleware/auth.ts` | Added `extractActiveRole()`, `verifyAuthTokenMultiPool()`, `MultiPoolAuthResult` type |
| `src/handlers/physio-book-session-for-patient.ts` | Added self-booking prevention check |
| `src/handlers/reception-book-session.ts` | Added self-booking prevention check |

Full diff: `git diff 628f741~1..628f741` in `/mnt/workspace/src/moovv-fit-backend-node`

</details>
