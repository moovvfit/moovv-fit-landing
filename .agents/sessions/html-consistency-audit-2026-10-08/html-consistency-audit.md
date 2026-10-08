# HTML Consistency Audit Report

**Generated:** Comprehensive cross-page alignment and content consistency analysis  
**Scope:** 12 HTML files across root, `/for-physios/`, and `/for-clinics/` directories

---

## 1. Executive Summary

The Moovv landing pages exhibit **significant structural inconsistencies** across three site sections: the consumer-facing root pages, the physio landing (`/for-physios/`), and the clinic landing (`/for-clinics/`). While individual sections maintain reasonable internal consistency, **cross-section component alignment is poor**, creating maintenance burden and visual divergence.

### Critical Issues (Priority: High)
1. **Legal pages use duplicate inline `<style>` blocks** in root pages (privacy.html, terms.html, account-deletion.html, blog.html, support.html) while for-physios and for-clinics use proper external CSS (`legal.css`)
2. **Footer structure radically different** between root pages and sub-landing pages — different taglines, different link organization, different column structures
3. **Navigation component varies significantly** across page types — different link sets, missing mobile toggles, inline styles on legal pages
4. **Missing footer on `account-deletion.html`** entirely
5. **Button class inconsistencies**: root index uses `btn-primary` with white background, while for-physios/for-clinics use blue (`--cta-blue`)
6. **Inline styles violate steering rules** in multiple files

### Moderate Issues (Priority: Medium)
- Footer taglines differ across pages (same content, different wording)
- Section padding values inconsistent (`--section-padding: 60px` root vs `80px` sub-landings)
- FAQ markup structure identical but class naming varies
- Navigation CTA button text varies ("get the app" vs "get started — free")

### Minor Issues (Priority: Low)
- Some pages missing PostHog analytics (account-deletion.html)
- Script loading order varies between pages
- Blog nav links point to external URL vs internal anchors

---

## 2. Navigation Audit

### Navigation Structure Comparison

| Page | Nav Class | Has Mobile Toggle | CTA Button | CTA Text | Logo Link | Inline Styles |
|------|-----------|-------------------|------------|----------|-----------|---------------|
| `index.html:91` | `.nav` | ✅ Yes | `btn-nav-cta` | "get the app" | `#` | ❌ None |
| `privacy.html:65` | `.nav` | ❌ No | `btn-nav-cta` | "get the app" | `index.html` | ⚠️ `style="background: rgba(7, 6, 13, 0.95); backdrop-filter: blur(10px);"` |
| `terms.html:59` | `.nav` | ❌ No | `btn-nav-cta` | "get the app" | `index.html` | ⚠️ Same inline style |
| `support.html:92` | `.nav` | ❌ No | `btn-nav-cta` | "get the app" | `index.html` | ⚠️ Same inline style |
| `blog.html:98` | `.nav` | ❌ No | `btn-nav-cta` | "get the app" | `index.html` | ⚠️ Same inline style |
| `account-deletion.html:43` | `.nav` | ❌ No | ❌ Missing | N/A | `index.html` | ⚠️ Same inline style |
| `for-physios/index.html:112` | `.nav` | ✅ Yes | `btn-nav-cta` | "get started — free" | `/for-physios/` | ❌ None |
| `for-physios/privacy.html:21` | `.nav` | ❌ No | `btn-nav-cta` | "get started — free" | `index.html` | ❌ None |
| `for-physios/terms.html:21` | `.nav` | ❌ No | `btn-nav-cta` | "get started — free" | `index.html` | ❌ None |
| `for-clinics/index.html:89` | `.nav` | ✅ Yes | `btn-nav-cta` | "get started — free" | `/for-clinics/` | ❌ None |
| `for-clinics/privacy.html:21` | `.nav` | ❌ No | `btn-nav-cta` | "get started — free" | `index.html` | ❌ None |
| `for-clinics/terms.html:21` | `.nav` | ❌ No | `btn-nav-cta` | "get started — free" | `index.html` | ❌ None |

### Navigation Link Variations

**Root index.html (line 95-101):**
```html
<ul class="nav-links" id="navLinks">
  <li><a href="#features-science">How it helps</a></li>
  <li><a href="#how-it-works">See the app</a></li>
  <li><a href="/for-physios/">For Physios</a></li>
  <li><a href="/for-clinics/">For Clinics</a></li>
  <li><a href="#faq">Questions</a></li>
</ul>
```

**Root privacy.html (line 69-71):**
```html
<ul class="nav-links" id="navLinks">
  <li><a href="index.html">Back to Home</a></li>
</ul>
```

**for-physios/index.html (line 119-127):**
```html
<ul class="nav-links" id="navLinks">
  <li><a href="https://www.moovv.fit/" class="nav-back">← moovv.fit</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#grow">Grow your practice</a></li>
  <li><a href="#pricing">Pricing</a></li>
  <li><a href="#compare">Compare</a></li>
  <li><a href="#faq">FAQ</a></li>
  <li><a href="https://app.moovv.fit/physio" class="nav-login" rel="noopener noreferrer">Login</a></li>
</ul>
```

**for-physios/privacy.html (line 23-28):**
```html
<ul class="nav-links" id="navLinks">
  <li><a href="index.html">Back to home</a></li>
  <li><a href="terms.html">Terms</a></li>
  <li><a href="https://app.moovv.fit/physio" class="nav-login" rel="noopener noreferrer">Login</a></li>
</ul>
```

### ⚠️ Violations Found

1. **Inline styles on nav** (privacy.html:65, terms.html:59, support.html:92, blog.html:98, account-deletion.html:43):
   ```html
   <nav class="nav" id="nav" style="background: rgba(7, 6, 13, 0.95); backdrop-filter: blur(10px);">
   ```
   **Violation:** Inline styles violate steering rules. Should use CSS class like `.nav.nav--solid`.

2. **Inconsistent "Back to Home" text**:
   - Root legal pages: "Back to Home" (capital H)
   - for-physios legal pages: "Back to home" (lowercase h)

3. **Missing nav-logo-tag on root pages**: for-physios/for-clinics have `<span class="nav-logo-tag">for physios</span>` but this class/pattern doesn't exist on root pages

---

## 3. Footer Audit

### Footer Structure Comparison

| Page | Has Footer | Tagline | Logo Present | Link Columns | Has "Made with ❤️" | Has Copyright |
|------|------------|---------|--------------|--------------|-------------------|---------------|
| `index.html:583` | ✅ | "Mobility, made personal. Built with physiotherapists. Made for every body." | ✅ | 3 (Contact, For Professionals, Legal) | ✅ | ❌ |
| `privacy.html:186` | ✅ | "Mobility, made personal. Built with physiotherapists. Made for every body." | ✅ | 1 (flat links) | ❌ | ❌ |
| `terms.html:117` | ✅ | Same as privacy | ✅ | 1 (flat links) | ❌ | ❌ |
| `support.html:181` | ✅ | Same as privacy | ✅ | 1 (flat links) | ❌ | ❌ |
| `blog.html:216` | ✅ | "Your journey to better mobility starts with understanding." | ✅ | 1 (flat links) | ❌ | ❌ |
| `account-deletion.html` | ❌ **MISSING** | N/A | N/A | N/A | N/A | N/A |
| `for-physios/index.html:~900` | ✅ | "Moovv for Physios. Grow your practice, keep patients moving." | ✅ | 4 (Product, Moovv, Contact, Legal) | ❌ | ❌ |
| `for-physios/privacy.html:~200` | ✅ | Same as for-physios index | ✅ | 4 | ❌ | ❌ |
| `for-clinics/index.html:~530` | ✅ | "Moovv for Clinics. Scale your network, see the big picture." | ✅ | 4 | ❌ | ✅ |

### Footer Code Comparison

**Root index.html footer (lines 583-612) — Complex 3-column layout:**
```html
<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-left">
        <p class="footer-tagline">Mobility, made personal. Built with physiotherapists. Made for every body.</p>
        <p style="font-size: 12px; color: var(--white-60); margin-bottom: 24px; font-family: var(--font-body);">Made with ❤️ for the world.</p>
        <a href="#" class="footer-logo">
          <img src="images/Logo.svg" alt="Moovv" class="nav-logo-img">
        </a>
      </div>
      <div class="footer-links">
        <div class="footer-column">
          <h4 style="color: var(--white-100); font-family: var(--font-heading); font-size: 14px; margin-bottom: 12px;">Contact</h4>
          <a href="mailto:hello@moovv.fit" style="color: var(--white-60); font-size: 14px; display: block; margin-bottom: 8px;">hello@moovv.fit</a>
        </div>
        <!-- more columns with inline styles... -->
      </div>
    </div>
  </div>
</footer>
```

**Root privacy.html footer (lines 186-199) — Simple flat links:**
```html
<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-left">
        <p class="footer-tagline">Mobility, made personal. Built with physiotherapists. Made for every body.</p>
        <a href="index.html" class="footer-logo">
          <img src="images/Logo.svg" alt="moovv.fit" class="nav-logo-img">
        </a>
      </div>
      <div class="footer-links">
        <a href="privacy.html" id="privacyLink">Privacy</a>
        <a href="terms.html" id="termsLink">Terms</a>
        <a href="support.html">Support</a>
      </div>
    </div>
  </div>
</footer>
```

**for-physios/index.html footer — 4-column with h4 headers (NO inline styles):**
```html
<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-left">
        <p class="footer-tagline">Moovv for Physios. Grow your practice, keep patients moving.</p>
        <a href="https://www.moovv.fit/" class="footer-logo">
          <img src="images/Logo.svg" alt="Moovv" class="nav-logo-img">
        </a>
      </div>
      <div class="footer-links">
        <div class="footer-column">
          <h4>Product</h4>
          <a href="#features">Features</a>
          ...
        </div>
        <!-- properly styled via CSS -->
      </div>
    </div>
  </div>
</footer>
```

### ⚠️ Violations Found

1. **Massive inline styles in index.html footer (lines 593-608)**:
   ```html
   <h4 style="color: var(--white-100); font-family: var(--font-heading); font-size: 14px; margin-bottom: 12px;">Contact</h4>
   <a href="mailto:hello@moovv.fit" style="color: var(--white-60); font-size: 14px; display: block; margin-bottom: 8px;">hello@moovv.fit</a>
   ```
   **Violation:** Heavy inline styles should be CSS classes (e.g., `.footer-column h4`, `.footer-column a`)

2. **Inline style for "Made with ❤️" (index.html:590)**:
   ```html
   <p style="font-size: 12px; color: var(--white-60); margin-bottom: 24px; font-family: var(--font-body);">Made with ❤️ for the world.</p>
   ```
   **Violation:** Should be a CSS class like `.footer-subtitle`

3. **Missing footer on account-deletion.html**: This is the only page without any footer

4. **Different taglines across pages** (content difference, not technical violation):
   - Root: "Mobility, made personal. Built with physiotherapists. Made for every body."
   - Blog: "Your journey to better mobility starts with understanding."
   - for-physios: "Moovv for Physios. Grow your practice, keep patients moving."
   - for-clinics: "Moovv for Clinics. Scale your network, see the big picture."

5. **Logo alt text inconsistency**:
   - index.html: `alt="Moovv"` (line 592)
   - privacy.html: `alt="moovv.fit"` (line 194)
   - for-physios: `alt="Moovv"` (consistent)

---

## 4. Component Inconsistencies

### 4.1 Legal Page Styling Approach

| Page | Styling Method | External CSS | Inline `<style>` Block |
|------|----------------|--------------|------------------------|
| `privacy.html` | Inline `<style>` | css/styles.css | ✅ ~45 lines |
| `terms.html` | Inline `<style>` | css/styles.css | ✅ ~35 lines |
| `account-deletion.html` | Inline `<style>` | css/styles.css | ✅ ~50 lines |
| `blog.html` | Inline `<style>` | css/styles.css | ✅ ~150 lines |
| `support.html` | Inline `<style>` | css/styles.css | ✅ ~75 lines |
| `for-physios/privacy.html` | External CSS | css/styles.css + css/legal.css | ❌ None |
| `for-physios/terms.html` | External CSS | css/styles.css + css/legal.css | ❌ None |
| `for-clinics/privacy.html` | External CSS | css/styles.css + css/legal.css | ❌ None |
| `for-clinics/terms.html` | External CSS | css/styles.css + css/legal.css | ❌ None |

**Root legal pages define `.legal-page` in inline `<style>` blocks:**

`privacy.html:18-51`:
```html
<style>
  .legal-page {
    padding: 150px 0 100px;
    background: var(--bg-dark-1);
    min-height: 100vh;
    color: var(--white-80);
  }
  .legal-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 24px;
  }
  .legal-page h1 {
    font-family: var(--font-heading);
    font-size: clamp(32px, 5vw, 48px);
    color: var(--white-100);
    margin-bottom: 24px;
  }
  /* ... more inline styles */
</style>
```

**for-physios legal pages use external `legal.css`:**
```html
<link rel="stylesheet" href="css/styles.css?v=2">
<link rel="stylesheet" href="css/legal.css?v=1">
```

**Recommendation:** Root legal pages should use a shared `css/legal.css` file instead of duplicate inline styles.

### 4.2 Blog Page Has Completely Different Footer

**blog.html footer tagline (line 219):**
```html
<p class="footer-tagline">Your journey to better mobility starts with understanding.</p>
```

**All other root pages:**
```html
<p class="footer-tagline">Mobility, made personal. Built with physiotherapists. Made for every body.</p>
```

### 4.3 Button Class Differences

**Root index.html buttons (consistent with root css/styles.css):**
```css
.btn-primary {
  color: var(--bg-dark-1);      /* Dark text */
  background: var(--white-100); /* White background */
}
```

**for-physios/for-clinics buttons (css/styles.css in subdirs):**
```css
.btn-primary {
  background: var(--cta-blue);  /* Blue background */
  color: var(--white-100);      /* White text */
}
```

Same class name (`.btn-primary`), completely different visual appearance.

### 4.4 FAQ Section Structure

Both root and sub-landings use identical FAQ markup structure:
```html
<section class="faq" id="faq">
  <div class="container">
    <h2 class="faq-title">Frequently Asked Questions</h2>
    <div class="faq-list">
      <div class="faq-item active">
        <button class="faq-question" aria-expanded="true">
          <span class="faq-number">1.</span>
          <span class="faq-text">...</span>
          <span class="faq-icon"></span>
        </button>
        <div class="faq-answer">...</div>
      </div>
    </div>
  </div>
</section>
```

✅ **Consistent** — This is good. Same structure, same class names.

---

## 5. CSS Class Variations

### Same Visual Element, Different Classes

| Element | Root Pages | for-physios/for-clinics | Notes |
|---------|------------|-------------------------|-------|
| Page-specific main class | `.legal-page`, `.blog-page`, `.support-page` | `.legal-page` | Root has more class names |
| Content container | `.legal-container`, `.blog-container`, `.support-container` | `.legal-container` | Root has varying names |
| Section eyebrow | N/A | `.section-eyebrow` | Root index uses none |
| Logo tag badge | N/A | `.nav-logo-tag` | Only exists in sub-landings |
| Login button | N/A | `.nav-login` | Only exists in sub-landings |

### Inline Styles That Should Be Classes

| File | Line | Inline Style | Suggested Class |
|------|------|--------------|-----------------|
| `index.html` | 590 | `style="font-size: 12px; color: var(--white-60); ..."` | `.footer-subtitle` |
| `index.html` | 593 | `style="color: var(--white-100); font-family: var(--font-heading); ..."` | `.footer-column h4` (already defined in sub-landing CSS) |
| `index.html` | 594 | `style="color: var(--white-60); font-size: 14px; ..."` | `.footer-column a` |
| `index.html` | 227 | `style="text-align: center;"` | `.section--centered` |
| `index.html` | 238 | `style="text-align: center; margin-bottom: 40px;"` | Use container class |
| `privacy.html` | 65 | `style="background: rgba(7, 6, 13, 0.95); backdrop-filter: blur(10px);"` | `.nav--solid` |
| Multiple root pages | Various | Same nav inline style | `.nav--solid` |

---

## 6. Typography & Heading Consistency

### Heading Level Usage

| Page | H1 Count | H1 Content | H2 for Sections |
|------|----------|------------|-----------------|
| `index.html` | 1 | "Mobility, made personal." | ✅ Yes |
| `privacy.html` | 1 | "Privacy Policy" | ✅ Yes |
| `terms.html` | 1 | "Terms of Service" | ✅ Yes |
| `support.html` | 1 | "Get in Touch" | ❌ No H2s |
| `blog.html` | 1 | "The Mobility Journal" | ✅ via JS |
| `account-deletion.html` | 1 | "Account Deletion" | ✅ Yes |
| `for-physios/index.html` | 1 | "Grow your practice.<br>Not your paperwork." | ✅ Yes |
| `for-clinics/index.html` | 1 | "Scale your network.<br>See the big picture." | ✅ Yes |

✅ All pages have exactly one H1 — good semantic structure.

### Section Title Class Usage

**Root index.html uses `.section-title` inline:**
```html
<h2 class="section-title">Built for every body that needs to move better.</h2>
```

**for-physios/for-clinics use both `.section-title` and `.section-eyebrow`:**
```html
<p class="section-eyebrow">Get to know Moovv for Physios</p>
<h2 class="section-title">Everything your practice needs, in one place</h2>
```

The `.section-eyebrow` pattern is not used in root pages.

---

## 7. Spacing & Layout Patterns

### CSS Variable Differences

| Variable | Root `css/styles.css` | Sub-landing `css/styles.css` |
|----------|----------------------|------------------------------|
| `--section-padding` | `60px` | `80px` |
| `--container-max` | `1280px` | `1280px` (same) |

### Container Usage

All pages consistently use:
```html
<div class="container">
```

✅ Container pattern is consistent.

### Hero Layout Differences

**Root index.html hero grid:**
```css
.hero-layout {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
  gap: 56px;
}
```

**for-physios hero grid:**
```css
.hero-layout {
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
}
```

Different column ratios and gap values.

---

## 8. Recommended Fixes (Prioritized)

### Priority 1: Critical (Inline Styles & Missing Components)

1. **Create `css/legal.css` for root pages** — Extract the duplicate inline `<style>` blocks from privacy.html, terms.html, account-deletion.html into a shared CSS file

2. **Add footer to `account-deletion.html`** — Currently the only page without a footer

3. **Create `.nav--solid` class** — Replace inline nav background styles:
   ```css
   .nav--solid {
     background: rgba(7, 6, 13, 0.95);
     backdrop-filter: blur(10px);
   }
   ```

4. **Move index.html footer inline styles to CSS** — Add to `css/styles.css`:
   ```css
   .footer-column h4 {
     color: var(--white-100);
     font-family: var(--font-heading);
     font-size: 14px;
     margin-bottom: 12px;
   }
   .footer-column a {
     color: var(--white-60);
     font-size: 14px;
     display: block;
     margin-bottom: 8px;
   }
   .footer-subtitle {
     font-size: 12px;
     color: var(--white-60);
     margin-bottom: 24px;
     font-family: var(--font-body);
   }
   ```

### Priority 2: Moderate (Consistency Issues)

5. **Standardize footer structure across root pages** — Use the same column layout as for-physios/for-clinics with proper CSS classes instead of inline styles

6. **Unify nav link text case** — "Back to Home" vs "Back to home" — pick one and apply everywhere

7. **Add mobile nav toggle to legal pages** — Currently missing on privacy, terms, support, blog, account-deletion

8. **Standardize logo alt text** — Use "Moovv" consistently (not "moovv.fit")

### Priority 3: Enhancement (Architecture Improvements)

9. **Consider unifying `--section-padding`** — Either 60px or 80px, not both

10. **Add `.section-eyebrow` pattern to root index.html** — Currently only sub-landings use it

11. **Document button style divergence** — Acknowledge that `.btn-primary` intentionally differs between consumer (white) and B2B (blue) pages, or unify

12. **Add PostHog analytics to `account-deletion.html`** — Currently missing

---

## Appendix: File Reference Summary

| File | Lines | Key Issues |
|------|-------|------------|
| `/index.html` | ~625 | Footer inline styles, missing `.section-eyebrow` |
| `/privacy.html` | ~200 | Inline `<style>` block, nav inline style |
| `/terms.html` | ~140 | Inline `<style>` block, nav inline style |
| `/support.html` | ~200 | Inline `<style>` block, nav inline style |
| `/blog.html` | ~280 | Inline `<style>` block, nav inline style, different tagline |
| `/account-deletion.html` | ~115 | **Missing footer**, inline `<style>`, nav inline style, no CTA button, no analytics |
| `/for-physios/index.html` | ~880 | Clean — uses external CSS properly |
| `/for-physios/privacy.html` | ~210 | Clean — uses external legal.css |
| `/for-physios/terms.html` | ~210 | Clean — uses external legal.css |
| `/for-clinics/index.html` | ~530 | Clean — uses external CSS properly |
| `/for-clinics/privacy.html` | ~210 | Clean — uses external legal.css |
| `/for-clinics/terms.html` | ~210 | Clean — uses external legal.css |
