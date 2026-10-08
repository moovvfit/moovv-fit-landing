# Sub-landing Alignment Changes

**Date:** 2024
**Task:** Align for-physios and for-clinics HTML pages to match ROOT patterns

## Summary

Aligned sub-landing pages to match root page conventions. Root pages were NOT modified (source of truth).

## Changes Made

### 1. Nav Link Text Casing
Changed "Back to home" → "Back to Home" (capital H) in:
- `for-physios/privacy.html`
- `for-physios/terms.html`
- `for-clinics/privacy.html`
- `for-clinics/terms.html`

### 2. Logo Alt Text
Changed `alt="moovv.fit"` → `alt="Moovv"` in nav logos:
- `for-physios/index.html`
- `for-physios/privacy.html`
- `for-physios/terms.html`
- `for-clinics/index.html`
- `for-clinics/privacy.html`
- `for-clinics/terms.html`

### 3. Footer Logo Alt Text
Footer logos already had `alt="Moovv"` — no changes needed.

### 4. FAQ Section Structure
**Finding:** FAQ structure in both sub-landings ALREADY MATCHES root.

All three index files use identical patterns:
- Section: `<section class="faq" id="faq">`
- Title: `<h2 class="faq-title">`
- List wrapper: `<div class="faq-list">`
- Items: `<div class="faq-item active">` / `<div class="faq-item">`
- Question button: `<button class="faq-question" aria-expanded="...">`
- Spans: `<span class="faq-number">`, `<span class="faq-text">`, `<span class="faq-icon">`
- Answer: `<div class="faq-answer">`

No structural changes required.

## Verification Results

```
grep -rn "Back to home" for-physios/ for-clinics/
→ 0 results ✅

grep -rn 'alt="moovv.fit"' for-physios/ for-clinics/
→ 0 results ✅
```

## Files Modified
- `for-physios/index.html`
- `for-physios/privacy.html`
- `for-physios/terms.html`
- `for-clinics/index.html`
- `for-clinics/privacy.html`
- `for-clinics/terms.html`

## Files NOT Modified (as instructed)
- Root `index.html`
- Root `privacy.html`
- Root `terms.html`
- Root `account-deletion.html`
- Root `blog.html`
- Root `support.html`
- Root CSS files
