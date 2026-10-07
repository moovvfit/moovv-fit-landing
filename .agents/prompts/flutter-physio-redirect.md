# Flutter: Handle Physio-Only Users in Patient App

## Context

When a user with only the `physio` Cognito group (no `patient` group) logs into the Flutter patient app, the app should gracefully redirect them to the Physio Portal instead of showing an error.

**Current behavior:** Shows "Something went wrong. Please try again."

**Expected behavior:** Show a friendly message explaining they need the Physio Portal, with a button to open it.

## Cognito Groups Reference

> See [ADR-004: Cognito Environment Parity](/moovv-fit-infra/docs/architecture/adr/ADR-004-COGNITO-ENVIRONMENT-PARITY.md)

| Pool | Environment | Pool ID | Groups |
|------|-------------|---------|--------|
| Pool A | Production | `ap-south-1_AulfstD9s` | `patient`, `physio` |
| Pool A | Staging | `ap-south-1_lAZmuElh6` | `patient`, `physio` |

**Group membership scenarios:**

| `cognito:groups` | Can access patient app? | Action |
|------------------|-------------------------|--------|
| `["patient"]` | ✅ Yes | Normal flow |
| `["physio", "patient"]` | ✅ Yes | Normal flow (dual-role user) |
| `["physio"]` | ❌ No | Show redirect screen |
| `[]` (empty) | ❌ No | Error — user not in any group |

## User Flow

1. User enters phone `+911234567894` (physio demo account)
2. User enters OTP `947283`
3. Backend returns `role: "PHYSIO"` and token with `cognito:groups: ["physio"]`
4. App detects user has `physio` group but NOT `patient` group
5. App shows redirect screen:
   - "You're registered as a Physiotherapist"
   - "Please use the Physio Portal to manage your practice"
   - [Open Physio Portal] button → opens `https://app.moovv.fit/physio` in mobile browser
   - [Use Different Number] link → returns to login

## Technical Requirements

### 1. Parse Cognito Groups from Token

After successful OTP verification, decode the ID token to extract groups:

```dart
// In auth service after verify OTP
Map<String, dynamic> decodeToken(String idToken) {
  final parts = idToken.split('.');
  final payload = utf8.decode(base64Url.decode(base64Url.normalize(parts[1])));
  return jsonDecode(payload);
}

// Extract groups
final tokenPayload = decodeToken(idToken);
final groups = List<String>.from(tokenPayload['cognito:groups'] ?? []);
```

### 2. Check User Access

```dart
bool canAccessPatientApp(List<String> groups) {
  // User needs 'patient' group to use patient app
  // Having 'physio' alone is not enough
  return groups.contains('patient');
}

bool isPhysioOnly(List<String> groups) {
  return groups.contains('physio') && !groups.contains('patient');
}
```

### 3. Create Redirect Screen

Create `lib/features/auth/presentation/screens/physio_redirect_screen.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class PhysioRedirectScreen extends StatelessWidget {
  final VoidCallback onUseDifferentNumber;
  
  const PhysioRedirectScreen({
    super.key,
    required this.onUseDifferentNumber,
  });

  Future<void> _openPhysioPortal() async {
    final uri = Uri.parse('https://app.moovv.fit/physio');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(
                  Icons.medical_services_outlined,
                  size: 40,
                  color: Theme.of(context).primaryColor,
                ),
              ),
              const SizedBox(height: 32),
              
              // Title
              Text(
                "You're registered as a Physiotherapist",
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              
              // Description
              Text(
                "This app is for patients. Please use the Physio Portal to manage your practice, view patients, and conduct telehealth sessions.",
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              
              // Open Portal Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _openPhysioPortal,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text('Open Physio Portal'),
                ),
              ),
              const SizedBox(height: 16),
              
              // Use Different Number
              TextButton(
                onPressed: onUseDifferentNumber,
                child: const Text('Use a different phone number'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 4. Update Auth Flow

In the auth verification handler (after OTP success):

```dart
// After successful OTP verification
final authResult = await authService.verifyOtp(phone, otp, session);

// Check if user can access patient app
final groups = authResult.cognitoGroups; // Extract from token

if (isPhysioOnly(groups)) {
  // Navigate to physio redirect screen
  Navigator.pushReplacement(
    context,
    MaterialPageRoute(
      builder: (_) => PhysioRedirectScreen(
        onUseDifferentNumber: () {
          // Clear auth state and go back to login
          authService.signOut();
          Navigator.pushReplacementNamed(context, '/login');
        },
      ),
    ),
  );
  return;
}

// Normal flow - user has patient access
// ... continue to home screen
```

### 5. Handle Users with Both Groups

Users with both `physio` AND `patient` groups should be allowed into the patient app normally. They are physios who also use the app as patients (e.g., for their own exercises).

```dart
// This user has both groups - allow access
// cognito:groups: ["physio", "patient"]
if (groups.contains('patient')) {
  // Proceed to patient app home
}
```

## Portal URL by Environment

```dart
String getPhysioPortalUrl() {
  if (Environment.isProduction) {
    return 'https://app.moovv.fit/physio';
  }
  return 'https://app-staging.moovv.fit/physio';
}
```

## Files to Modify

| File | Change |
|------|--------|
| `lib/features/auth/data/services/auth_service.dart` | Parse `cognito:groups` from ID token |
| `lib/features/auth/presentation/screens/otp_screen.dart` | Check groups after verify, redirect if physio-only |
| `lib/features/auth/presentation/screens/physio_redirect_screen.dart` | **NEW** — redirect screen |
| `pubspec.yaml` | Ensure `url_launcher` dependency exists |

## Testing

1. **Physio-only user:** Login with `+911234567894` / `947283` → should see redirect screen
2. **Patient-only user:** Login with `+911234567890` / `381566` → should go to home
3. **Dual-role user:** If `+911234567894` has both groups → should go to home
4. **Open Portal button:** Should open browser to physio portal
5. **Use Different Number:** Should clear auth and return to login

## Dependencies

```yaml
# pubspec.yaml
dependencies:
  url_launcher: ^6.2.0
```

## Related

- Demo accounts: `/mnt/workspace/src/moovv-fit-backend-node/docs/auth/DEMO-ACCOUNTS.md`
- Unified auth tasks: `/mnt/workspace/src/moovv-fit-landing/.agents/specs/unified-auth/tasks.md`
