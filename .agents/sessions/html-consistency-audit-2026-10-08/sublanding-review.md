# Sub-landing alignment to root conventions

Aligns nav link casing ("Back to Home") and logo alt text (`alt="Moovv"`) in for-physios and for-clinics pages to match root patterns. FAQ structure was already aligned — no changes needed.

**Watch for:** None. All requirements verified. Root pages untouched.

**Verdict**: APPROVED

## High-level view

The diff modifies exactly six files under for-physios/ and for-clinics/, plus the task summary doc. No root pages (index.html, privacy.html, terms.html, etc.) were touched — confirmed by empty diff when filtering for root paths. The changes are narrow text replacements: lowercase "home" → "Home" in nav links, and domain-style alt text → brand name in logo images.

FAQ structure in both sub-landings already matched root (identical class names, button/ARIA markup, span hierarchy). The coder correctly identified this as requiring no changes.

<details>
<summary>Issues (0)</summary>

No issues found.

</details>

<details>
<summary>Details</summary>

### Requirement 1: Nav link casing

Changed "Back to home" → "Back to Home" in:
- for-physios/privacy.html (line 30)
- for-physios/terms.html (line 30)
- for-clinics/privacy.html (line 30)
- for-clinics/terms.html (line 30)

Spot-check: `grep -rn "Back to home" for-physios/ for-clinics/` returns 0 matches.

### Requirement 2: Logo alt text

Changed `alt="moovv.fit"` → `alt="Moovv"` in nav logos:
- for-physios/index.html (line 135)
- for-physios/privacy.html (line 25)
- for-physios/terms.html (line 25)
- for-clinics/index.html (line 117)
- for-clinics/privacy.html (line 25)
- for-clinics/terms.html (line 25)

Footer logos were already `alt="Moovv"` — no change needed.

Spot-check: `grep -rn 'alt="moovv.fit"' for-physios/ for-clinics/` returns 0 matches.

### Requirement 3: FAQ structure alignment

Compared FAQ section structure across root index.html, for-physios/index.html, and for-clinics/index.html. All three use identical patterns:

```
<section class="faq" id="faq">
  <div class="container">
    <h2 class="faq-title">...</h2>
    <div class="faq-list">
      <div class="faq-item active">
        <button class="faq-question" aria-expanded="true">
          <span class="faq-number">...</span>
          <span class="faq-text">...</span>
          <span class="faq-icon"></span>
        </button>
        <div class="faq-answer">...</div>
      </div>
      ...
    </div>
  </div>
</section>
```

No structural changes required — already aligned.

### Requirement 4: Root pages unchanged

Verified by diffing commit against root paths: `git diff HEAD~1 HEAD -- index.html privacy.html terms.html account-deletion.html blog.html support.html css/` returns empty. No root files were modified.

</details>

<details>
<summary>File map</summary>

| File | Change |
|------|--------|
| .agents/tasks/sublanding-alignment-changes.md | Task summary doc (new) |
| for-clinics/index.html | Logo alt text fix |
| for-clinics/privacy.html | Logo alt + nav link casing |
| for-clinics/terms.html | Logo alt + nav link casing |
| for-physios/index.html | Logo alt text fix |
| for-physios/privacy.html | Logo alt + nav link casing |
| for-physios/terms.html | Logo alt + nav link casing |

Full diff: `git diff HEAD~1 HEAD`

</details>
