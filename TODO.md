# TODO — Landing Page

## Blocked on Unified Auth Spec Implementation

These changes are pending until `unified-auth` spec is implemented in the backend/infra repos:

### Login Link Updates
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
