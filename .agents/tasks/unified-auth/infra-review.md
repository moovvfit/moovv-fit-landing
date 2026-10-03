# Unified Auth CDK Infrastructure (Track A)

Adds Cognito Pool B and CloudFront distribution for the unified app platform at app.moovv.fit. Pool B supports email/password authentication with Google OAuth for clinic and admin portals, with @moovv.fit domain restriction enforced via pre-signup Lambda. CloudFront routes path-based requests to existing S3 bucket prefixes without creating new buckets.

**Watch for:** SecretValue.unsafePlainText usage for Google OAuth secret reads from SSM at synth time (confirmed, not a runtime secret leak but surfaces in CFN template) | Default cache TTL for patient origin deviates from spec (CACHING_OPTIMIZED vs 1 day explicit — likely acceptable).

**Verdict**: APPROVED

---

## High-level view

Pool B configuration matches the design spec: email auth, two groups (clinic_admin, admin), Google IdP with attribute mapping, and two app clients with the admin client restricted to Google only. The pre-signup Lambda fetches the admin client ID from SSM at runtime to break a circular dependency, correctly enforcing @moovv.fit domain restriction.

CloudFront imports the existing `moovv-fit-content-{env}` bucket and defines four behaviors routing `/`, `/physio/*`, `/clinic/*`, `/admin/*` to respective `web/` prefixes. Legacy redirect function handles `physio.moovv.fit` and `clinic.moovv.fit` domain redirects. No new buckets are created — bucket policy statement is output for manual addition.

Bin wiring adds all four stacks (unified-auth and app-cloudfront for staging and production) with correct environment props. Help text updated to document new stacks.

Both stacks follow landing-stack.ts patterns: Tags, OAC, SSM parameters, CfnOutputs, imported bucket references, certificate import, and CloudFront Function conventions.

---

<details>
<summary>Issues (2)</summary>

1. **SecretValue.unsafePlainText for Google secret** — Using `SecretValue.unsafePlainText(googleClientSecret)` causes the SSM value to appear in the synthesized CloudFormation template. This isn't a runtime leak but the secret is visible in the template. Consider using `SecretValue.ssmSecure()` or storing in Secrets Manager with `SecretValue.secretsManager()`. Low priority since SSM parameter is already access-controlled, but flagged for awareness.

2. **Default behavior cache policy deviates from spec** — Design spec says patient origin should cache 1 day, but implementation uses `CACHING_OPTIMIZED` (managed policy). The managed policy provides a 1-day default TTL anyway, so this is effectively compliant, but explicit custom policy would match the spec exactly. Informational only.

</details>

---

<details>
<summary>Details</summary>

## Admin client Google-only enforcement

The admin portal client is correctly restricted to Google-only authentication:

```typescript
authFlows: {
  userPassword: false,
  userSrp: false,
},
supportedIdentityProviders: [
  cognito.UserPoolClientIdentityProvider.GOOGLE,
],
```

## Pre-signup Lambda circular dependency resolution

The Lambda fetches the admin client ID from SSM at runtime rather than via CloudFormation environment variable reference, breaking the circular dependency between the Lambda and the client being created. The SSM name is passed via `ADMIN_CLIENT_ID_SSM_NAME` environment variable.

## CloudFront path routing

| Path | Origin Path | Cache |
|------|-------------|-------|
| `/` (default) | `web/patient` | CACHING_OPTIMIZED |
| `/physio/*` | `web/physio` | Custom 1hr TTL |
| `/clinic/*` | `web/clinic` | Custom 1hr TTL |
| `/admin/*` | `web/admin` | Custom 1hr TTL |

## SSM parameters created

Unified auth stack:
- `/moovv-fit/{env}/cognito_pool_b_id`
- `/moovv-fit/{env}/cognito_clinic_portal_client_id`
- `/moovv-fit/{env}/cognito_admin_portal_client_id`
- `/moovv-fit/{env}/cognito_pool_b_domain`

App CloudFront stack:
- `/moovv-fit/{env}/app_cloudfront_distribution_id`

## SecretValue.unsafePlainText usage

The Google OAuth client secret is read from SSM and passed via `SecretValue.unsafePlainText()`:

```typescript
const googleClientSecret = ssm.StringParameter.valueForStringParameter(
  this,
  googleClientSecretSsmName
)
// ...
clientSecretValue: SecretValue.unsafePlainText(googleClientSecret),
```

This resolves the SSM value at synth time and embeds it in the CloudFormation template. Not a hardcoded secret, but the value becomes visible in the synthesized template. The SSM parameter is access-controlled, mitigating risk. A cleaner pattern would be Secrets Manager with `SecretValue.secretsManager()`.

</details>

---

<details>
<summary>Files changed</summary>

| File | Change |
|------|--------|
| `cdk/src/portal-pre-signup-handler.ts` | New — Pre-signup Lambda for domain restriction |
| `cdk/lib/unified-auth-stack.ts` | New — Cognito Pool B with groups, Google IdP, app clients |
| `cdk/lib/app-cloudfront-stack.ts` | New — CloudFront distribution with path-based routing |
| `cdk/bin/app.ts` | Modified — Added stack instantiation for staging/production |

Full diff: `git diff main` in `/mnt/workspace/src/moovv-fit-infra`

</details>
