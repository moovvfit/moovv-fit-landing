# Unified Auth Phase 6: Flutter Web Auth Implementation

## Task Overview
Implement TASK-6.2 (web auth flow) and TASK-6.5 (deep link to mobile app) for the Flutter patient web app.

## Context

### Current State
- Flutter web app deployed at `https://app-staging.moovv.fit/` (and production at `app.moovv.fit`)
- Login is **feature-flagged OFF** via `RemoteConfigService.showWebLogin` (defaults `false` on web)
- Users currently see `DownloadAppPromptScreen` with App Store / Play Store badges
- Mobile app uses Cognito Pool A with phone OTP authentication
- Service worker issues resolved (builds with `--pwa-strategy none`)

### Target State
- **TASK-6.2**: Web users can authenticate with phone + OTP (same as mobile)
- **TASK-6.5**: Web can deep link to mobile app (`moovvfit://`) with store fallback

## Investigation Required (BEFORE any code changes)

### 1. Audit Current Flutter Auth Implementation
**Files to examine:**
- `/mnt/workspace/src/moovv-fit-mobile/lib/services/auth_service.dart` — current auth flow
- `/mnt/workspace/src/moovv-fit-mobile/lib/services/cognito_service.dart` — Cognito integration
- `/mnt/workspace/src/moovv-fit-mobile/lib/services/remote_config_service.dart` — feature flag
- `/mnt/workspace/src/moovv-fit-mobile/lib/screens/auth/` — login screens
- `/mnt/workspace/src/moovv-fit-mobile/lib/screens/download_app_prompt_screen.dart` — current web screen

**Questions to answer:**
1. Does auth_service.dart already support web platform?
2. What Cognito client ID is used? Is it web-compatible?
3. Are there any mobile-only dependencies (SMS autofill, biometrics) that need web alternatives?
4. How does the OTP input work on mobile? Will it work on web?

### 2. Audit Cognito Configuration
**Check Pool A settings:**
- App client ID for web (may need separate client)
- Callback URLs configured for web domain
- OAuth scopes

**Use MCP to query:**
```sql
-- Check if web users exist in staging
SELECT phone, role, created_at FROM user_profiles 
WHERE created_at > '2026-10-01' 
ORDER BY created_at DESC LIMIT 10;
```

### 3. Audit Deep Link Configuration
**Files to examine:**
- `/mnt/workspace/src/moovv-fit-mobile/android/app/src/main/AndroidManifest.xml` — Android intent filters
- `/mnt/workspace/src/moovv-fit-mobile/ios/Runner/Info.plist` — iOS URL schemes
- `/mnt/workspace/src/moovv-fit-mobile/lib/services/deep_link_service.dart` — if exists

**Questions to answer:**
1. Is `moovvfit://` scheme registered on both platforms?
2. What routes are handled? (`moovvfit://login`, `moovvfit://exercise/:id`, etc.)
3. Is there universal link support (`https://app.moovv.fit/.well-known/...`)?

## Deliverables

### Phase 1: Summary Report (REQUIRED FIRST)
Before writing any code, produce a summary report with:

```markdown
## Flutter Web Auth - Implementation Summary

### What Exists
- [ ] List current auth components and their web compatibility
- [ ] List Cognito configuration status
- [ ] List deep link configuration status

### What Will Change
- [ ] Files to modify (with specific changes)
- [ ] New files to create
- [ ] Configuration changes needed

### What Won't Change
- [ ] Components that work as-is
- [ ] Mobile-only features to skip

### Risk Assessment
- [ ] Breaking changes to mobile app?
- [ ] Cognito configuration risks?
- [ ] Rollback plan?

### Test Plan
- [ ] How to verify web auth works
- [ ] How to verify mobile still works
- [ ] Demo account to use: `+911234567890` / OTP: `381566`
```

### Phase 2: Implementation (ONLY after summary approved)

#### TASK-6.2: Web Auth Flow
1. Enable feature flag for web (or add web-specific logic)
2. Ensure OTP input works on web browsers
3. Handle web-specific token storage (localStorage vs secure storage)
4. Test login → dashboard flow on web

#### TASK-6.5: Deep Link to Mobile
1. Add "Open in App" button on web (when app is detected)
2. Implement `moovvfit://` link with fallback:
   - Try deep link first
   - Fallback to App Store (iOS) / Play Store (Android)
   - Stay on web if desktop browser
3. Consider smart banner for iOS Safari

## Constraints

- **DO NOT** break mobile app authentication
- **DO NOT** change Cognito pool configuration without explicit approval
- **DO NOT** enable web login in production until staging is validated
- **USE** existing demo accounts for testing: `+911234567890` (OTP: `381566`)

## Related Files

| Purpose | Path |
|---------|------|
| Tasks spec | `/mnt/workspace/src/moovv-fit-landing/.agents/specs/unified-auth/tasks.md` |
| Demo accounts | `/mnt/workspace/src/moovv-fit-backend-node/docs/auth/DEMO-ACCOUNTS.md` |
| ADR | `/mnt/workspace/src/moovv-fit-infra/docs/architecture/adr/ADR-003-UNIFIED-WEB-PLATFORM-ROUTING.md` |
| Flutter app | `/mnt/workspace/src/moovv-fit-mobile/` |

## Success Criteria

### TASK-6.2 Complete When:
- [ ] User can navigate to `https://app-staging.moovv.fit/`
- [ ] User sees login screen (not download prompt)
- [ ] User can enter phone number and receive OTP
- [ ] User can enter OTP and authenticate
- [ ] User lands on patient dashboard
- [ ] Mobile app still works identically

### TASK-6.5 Complete When:
- [ ] Web shows "Open in App" option on mobile browsers
- [ ] Clicking opens app if installed
- [ ] Clicking goes to store if not installed
- [ ] Desktop browsers don't show the option (or show "Download" instead)
