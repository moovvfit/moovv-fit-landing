# Moovv Fit Landing Pages

Static landing pages for [moovv.fit](https://www.moovv.fit).

## Structure

```
/                    → Brand landing (www.moovv.fit)
/for-physios/        → Physio landing (www.moovv.fit/for-physios)
```

## Deployment

**Staging** — auto-deploys on push to `main`
- URL: `https://www.staging.moovv.fit`

**Production** — deploys when Release Please PR is merged
- URL: `https://www.moovv.fit`

### Manual Deploy

```bash
# Via GitHub Actions
gh workflow run deploy.yml -f environment=staging
gh workflow run deploy.yml -f environment=production -f confirmation=DEPLOY_PROD
```

## Infrastructure

CloudFront + S3 managed via CDK in [moovv-fit-infra](https://github.com/moovvfit/moovv-fit-infra).

| Resource | Staging | Production |
|----------|---------|------------|
| S3 Path | `moovv-fit-content-staging/web/landing/` | `moovv-fit-content-production/web/landing/` |
| CloudFront | `www.staging.moovv.fit` | `www.moovv.fit` |
| CF Distribution ID | SSM: `/moovv-fit/staging/landing_cloudfront_distribution_id` | SSM: `/moovv-fit/production/landing_cloudfront_distribution_id` |

## Local Development

Static HTML — open files directly in browser or use:

```bash
npx serve .
```
