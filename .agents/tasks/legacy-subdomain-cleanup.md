# Legacy Subdomain Cleanup

> **Decision Date:** 2026-10-07  
> **Status:** Pending execution

## Decision

**Drop legacy subdomains** (`physio.moovv.fit`, `clinic.moovv.fit`) in favor of unified paths on `app.moovv.fit`:

| Legacy URL | New URL |
|------------|---------|
| `physio.moovv.fit` | `app.moovv.fit/physio` |
| `clinic.moovv.fit` | `app.moovv.fit/clinic` |
| `admin.moovv.fit` | `app.moovv.fit/admin` |

## Rationale

1. **Simpler architecture** — single CloudFront distribution, single domain
2. **No redirect maintenance** — no CloudFront functions to manage
3. **Cleaner SSL** — single certificate for `app.moovv.fit`
4. **Unified auth flows** — all portals share same Cognito callback domain

## Infrastructure to Remove

### 1. CloudFront Distribution (AWS)

**Distribution ID:** `E1L5A9JDI0AV18`  
**Domain:** `d3attxxz9haskr.cloudfront.net`  
**Aliases:** `physio.moovv.fit`, `clinic.moovv.fit`, `admin.moovv.fit`

```bash
# Step 1: Disable the distribution
aws --profile moovv-fit-ujwal-admin cloudfront update-distribution \
  --id E1L5A9JDI0AV18 \
  --if-match $(aws --profile moovv-fit-ujwal-admin cloudfront get-distribution --id E1L5A9JDI0AV18 --query "ETag" --output text) \
  --distribution-config file://disabled-config.json

# Step 2: Wait for status "Deployed" with Enabled=false
aws --profile moovv-fit-ujwal-admin cloudfront get-distribution --id E1L5A9JDI0AV18 --query "Distribution.Status"

# Step 3: Delete the distribution
aws --profile moovv-fit-ujwal-admin cloudfront delete-distribution \
  --id E1L5A9JDI0AV18 \
  --if-match <etag>
```

### 2. CloudFront Functions (AWS - optional cleanup)

These functions are no longer needed:

```bash
# Delete legacy redirect functions
aws --profile moovv-fit-ujwal-admin cloudfront delete-function \
  --name moovv-app-legacy-redirect-production \
  --if-match $(aws --profile moovv-fit-ujwal-admin cloudfront describe-function --name moovv-app-legacy-redirect-production --query "ETag" --output text)

aws --profile moovv-fit-ujwal-admin cloudfront delete-function \
  --name moovv-app-legacy-redirect-staging \
  --if-match $(aws --profile moovv-fit-ujwal-admin cloudfront describe-function --name moovv-app-legacy-redirect-staging --query "ETag" --output text)
```

### 3. DNS Records (Cloudflare)

Remove these CNAME records from `moovv.fit` zone:

| Record | Type | Current Value |
|--------|------|---------------|
| `physio` | CNAME | `d3attxxz9haskr.cloudfront.net` |
| `clinic` | CNAME | `d3attxxz9haskr.cloudfront.net` |
| `admin` | CNAME | `d3attxxz9haskr.cloudfront.net` |

```bash
# Using Cloudflare CLI (wrangler)
# First, get zone ID
wrangler dns list moovv.fit

# Delete records
wrangler dns delete moovv.fit <record-id-physio>
wrangler dns delete moovv.fit <record-id-clinic>
wrangler dns delete moovv.fit <record-id-admin>
```

Or via Cloudflare Dashboard:
1. Go to moovv.fit zone → DNS → Records
2. Delete CNAME records for `physio`, `clinic`, `admin`

### 4. S3 Bucket Cleanup (optional)

The legacy S3 bucket origin may have old content:
- `moovvfit-production-web-app.s3.ap-south-1.amazonaws.com`

Review and remove if no longer needed.

## Execution Order

1. ✅ Update landing pages to use `app.moovv.fit/*` links (done)
2. ⬜ Verify `app.moovv.fit/physio`, `/clinic`, `/admin` all work
3. ⬜ Remove Cloudflare DNS records (kills legacy URLs)
4. ⬜ Disable CloudFront distribution `E1L5A9JDI0AV18`
5. ⬜ Delete CloudFront distribution (after 24h observation)
6. ⬜ Delete CloudFront functions (cleanup)
7. ⬜ Remove S3 bucket content if unused

## Rollback

If issues arise, re-add DNS records pointing to the still-existing CloudFront distribution. Don't delete the distribution until confirmed all users have migrated.

## Related

- **Tasks:** TASK-7.4, TASK-7.5, TASK-9.4 (all marked as dropped/N/A)
- **PR:** Unified auth landing updates
