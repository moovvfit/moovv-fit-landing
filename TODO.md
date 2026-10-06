# TODO — Landing Page

## Next Session — Unified Auth Testing

### Service Worker Cleanup (FIRST)
- [ ] Clear service worker at `app-staging.moovv.fit/admin/` — DevTools → Application → Service Workers → Unregister → hard refresh
- [ ] Verify React admin portal loads (not Flutter app)

### Admin Portal Testing
- [ ] Test Google OAuth flow: `https://app-staging.moovv.fit/admin/login` → sign in → should see full admin dashboard
- [ ] Verify API calls work (axios interceptor now sends Google OAuth token)

### Demo Account Testing (OTP: 947283)
- [x] Physio: `+911234567894` → role: PHYSIO ✅
- [ ] Clinic: `+911234567896` → role: CLINIC_ADMIN
- [ ] Admin: `+911234567897` → role: ADMIN
- [ ] Patient: `+911234567890` → role: CUSTOMER

### Once Verified — Landing Page Updates
- [ ] Update `/for-physios/index.html` — change login link from `physio.moovv.fit` to `app.moovv.fit/physio`
- [ ] Update `/for-clinics/index.html` — change login link from `clinic.moovv.fit` to `app.moovv.fit/clinic`
- [ ] Update footer links across all pages if needed

### Optional CTAs (Product Decision)
- [ ] Add "Open Web App" CTA to root landing (`index.html`) — links to `app.moovv.fit`
- [ ] Feature flag or config for showing/hiding patient web CTA

---

## Legal / Compliance

- [ ] **CORE-78** — Add Grievance Officer details to privacy pages (DPDP compliance) — Due Oct 31, assigned r@moovv.fit

---

## References

- Spec: `.agents/specs/unified-auth/` — defines the new URL structure
- Prompt: `.agents/prompts/flutter-web-deploy.md` — Flutter web deployment guide
