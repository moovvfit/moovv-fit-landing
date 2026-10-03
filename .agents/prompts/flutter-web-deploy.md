# Flutter Web Deployment for Patient Portal

> **Context:** This prompt is for the moovv-fit-app (Flutter) repository to enable web deployment that integrates with the unified auth architecture defined in `.agents/specs/unified-auth/`.

---

## Objective

Deploy Flutter web build to serve as the patient web experience at `app.moovv.fit/` (root path).

---

## Target Architecture

```
app.moovv.fit/           ← Flutter web (patient)
app.moovv.fit/physio/    ← React (physio portal)
app.moovv.fit/clinic/    ← React (clinic portal)
app.moovv.fit/admin/     ← React (admin portal)
```

**Your deployment target:**

| Environment | S3 Path | URL |
|-------------|---------|-----|
| **Staging** | `s3://moovv-fit-content-staging/web/patient/` | `app-staging.moovv.fit` |
| **Production** | `s3://moovv-fit-content-production/web/patient/` | `app.moovv.fit` |

**Note:** Uses existing buckets — no new buckets needed.

---

## Requirements

### 1. Flutter Web Build Configuration

Enable web support and configure for production:

```yaml
# pubspec.yaml additions (if needed)
# Ensure web is a supported platform
```

```bash
# Build command
flutter build web --release --web-renderer canvaskit --base-href "/"
```

**Output:** `build/web/` directory with:
- `index.html`
- `main.dart.js`
- `flutter.js`
- `assets/`
- `icons/`

### 2. Base Href Configuration

Since Flutter web is served at root (`/`), set base href to `/`:

```html
<!-- build/web/index.html should have -->
<base href="/">
```

If using `--base-href` flag, ensure it's `/` not `/patient/` (CloudFront handles path routing).

### 3. Auth Configuration for Web

Update Cognito config to support web:

```dart
// lib/config/auth_config.dart (or equivalent)

class AuthConfig {
  static const String userPoolId = 'ap-south-1_AulfstD9s';
  static const String clientId = '2nbaqismtqd8afpngop0bvkcl6';
  static const String region = 'ap-south-1';
  
  // Web-specific: no app scheme redirects
  static String get redirectUri {
    if (kIsWeb) {
      return 'https://app.moovv.fit/callback';
    }
    return 'moovvfit://callback'; // Mobile deep link
  }
}
```

### 4. Feature Flag for Login Visibility

Add feature flag to hide/show login on web initially:

```dart
// lib/config/feature_flags.dart

class FeatureFlags {
  // Set to false initially - patient web login hidden
  static const bool showWebLogin = bool.fromEnvironment(
    'SHOW_WEB_LOGIN',
    defaultValue: false,
  );
}
```

```dart
// Usage in login screen
if (kIsWeb && !FeatureFlags.showWebLogin) {
  return DownloadAppPrompt(); // Show app store badges
}
return LoginScreen(); // Show actual login
```

### 5. Download App Prompt (When Login Hidden)

```dart
// lib/screens/download_app_prompt.dart

class DownloadAppPrompt extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Logo(),
            SizedBox(height: 24),
            Text(
              'Get the Moovv app',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            SizedBox(height: 8),
            Text(
              'Download for the best experience',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AppStoreBadge(
                  url: 'https://apps.apple.com/in/app/moovvfit/id6793878794',
                ),
                SizedBox(width: 16),
                PlayStoreBadge(
                  url: 'https://play.google.com/store/apps/details?id=fit.moovv.app',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

### 6. CI/CD Pipeline (GitHub Actions)

Create or update workflow for web deployment:

```yaml
# .github/workflows/deploy-web.yml

name: Deploy Flutter Web

on:
  push:
    branches: [main]
    paths:
      - 'lib/**'
      - 'web/**'
      - 'pubspec.yaml'
  workflow_dispatch:
    inputs:
      show_login:
        description: 'Show login on web'
        type: boolean
        default: false

env:
  AWS_REGION: ap-south-1

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        include:
          - environment: staging
            s3_bucket: moovv-fit-content-staging
            s3_path: web/patient
            cloudfront_secret: CLOUDFRONT_APP_STAGING_DISTRIBUTION_ID
            base_url: https://app-staging.moovv.fit
          - environment: production
            s3_bucket: moovv-fit-content-production
            s3_path: web/patient
            cloudfront_secret: CLOUDFRONT_APP_DISTRIBUTION_ID
            base_url: https://app.moovv.fit
    
    environment: ${{ matrix.environment }}
    
    permissions:
      id-token: write
      contents: read
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.0'  # Update to your version
          channel: 'stable'
      
      - name: Enable web
        run: flutter config --enable-web
      
      - name: Get dependencies
        run: flutter pub get
      
      - name: Build web
        run: |
          flutter build web \
            --release \
            --web-renderer canvaskit \
            --base-href "/" \
            --dart-define=SHOW_WEB_LOGIN=${{ inputs.show_login || 'false' }} \
            --dart-define=BASE_URL=${{ matrix.base_url }}
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::855246887543:role/moovv-fit-github-actions-release-role
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to S3
        run: |
          # Sync all files with cache headers
          aws s3 sync build/web/ s3://${{ matrix.s3_bucket }}/${{ matrix.s3_path }}/ \
            --delete \
            --cache-control "max-age=31536000,public" \
            --exclude "index.html" \
            --exclude "flutter_service_worker.js"
          
          # HTML and service worker with shorter cache
          aws s3 cp build/web/index.html s3://${{ matrix.s3_bucket }}/${{ matrix.s3_path }}/index.html \
            --cache-control "max-age=300,public"
          
          aws s3 cp build/web/flutter_service_worker.js s3://${{ matrix.s3_bucket }}/${{ matrix.s3_path }}/flutter_service_worker.js \
            --cache-control "max-age=0,no-cache"
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets[matrix.cloudfront_secret] }} \
            --paths "/*"
      
      - name: Summary
        run: |
          echo "## ✅ Flutter Web Deployed to ${{ matrix.environment }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **S3**: s3://${{ matrix.s3_bucket }}/${{ matrix.s3_path }}/" >> $GITHUB_STEP_SUMMARY
          echo "- **URL**: ${{ matrix.base_url }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Login visible**: ${{ inputs.show_login || 'false' }}" >> $GITHUB_STEP_SUMMARY
```

### 7. Web-Specific Considerations

#### CORS (if calling API directly)
Ensure API Gateway has CORS configured for `https://app.moovv.fit`.

#### Service Worker
Flutter generates `flutter_service_worker.js`. For auth callbacks to work:

```dart
// web/index.html - disable service worker for auth routes
<script>
  var serviceWorkerVersion = null;
  var scriptLoaded = false;
  
  // Skip service worker for callback routes
  if (window.location.pathname.includes('/callback')) {
    // Don't register service worker on callback
  } else {
    // Normal service worker registration
  }
</script>
```

#### URL Strategy
Use path-based URLs (not hash):

```dart
// lib/main.dart
void main() {
  setUrlStrategy(PathUrlStrategy());
  runApp(MyApp());
}
```

### 8. Environment Variables / Secrets Needed

| Secret | Description | Where |
|--------|-------------|-------|
| `CLOUDFRONT_APP_STAGING_DISTRIBUTION_ID` | CloudFront dist for app-staging.moovv.fit | GitHub Secrets |
| `CLOUDFRONT_APP_DISTRIBUTION_ID` | CloudFront dist for app.moovv.fit | GitHub Secrets |
| `AWS_ROLE_ARN` | IAM role for GitHub Actions | Already exists |

### 9. Environment-Specific Config

| Config | Staging | Production |
|--------|---------|------------|
| S3 Bucket | `moovv-fit-content-staging` | `moovv-fit-content-production` |
| S3 Path | `web/patient/` | `web/patient/` |
| URL | `https://app-staging.moovv.fit` | `https://app.moovv.fit` |
| Cognito Pool A | Same pool (staging users) | Same pool (prod users) |
| API Base URL | `https://api-staging.moovv.fit` | `https://api.moovv.fit` |

---

## Verification Checklist

After deployment, verify:

- [ ] `https://app.moovv.fit` loads Flutter web
- [ ] Shows "Download app" prompt (login hidden)
- [ ] App store badges link correctly
- [ ] No console errors
- [ ] Assets load correctly (fonts, images)
- [ ] Service worker registered (check DevTools → Application)
- [ ] When `SHOW_WEB_LOGIN=true`, login flow works with phone OTP

---

## Related Specs

- `moovv-fit-landing/.agents/specs/unified-auth/design.md` — Full architecture
- `moovv-fit-landing/.agents/specs/unified-auth/tasks.md` — TASK-6.x for Flutter web tasks

---

## Questions for Flutter Team

1. Current Flutter version in use?
2. Any web-specific packages already added?
3. Cognito auth package used (amplify_flutter, amazon_cognito_identity_dart_2, etc.)?
4. Any platform-specific code that needs `kIsWeb` guards?
