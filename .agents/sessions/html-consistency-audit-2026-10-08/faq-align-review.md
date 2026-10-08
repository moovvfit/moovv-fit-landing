# FAQ CSS alignment to match root stylesheet

This change aligns the FAQ section styling in both sub-landing stylesheets (`for-physios/css/styles.css` and `for-clinics/css/styles.css`) to match the root stylesheet exactly. The sub-landings previously used a simple border-bottom separator approach; now they match root's gradient card appearance with proper padding, hover states, and mobile responsive rules. **Watch for:** Nothing. All selectors verified declaration-by-declaration against root.

**Verdict**: APPROVED

## High-level view

Both sub-landing files receive identical FAQ rule blocks that match root verbatim. The `.faq` section wrapper, `.faq-title`, `.faq-list`, `.faq-item` card styling (gradient, border-radius, overflow, transitions), hover/active states, `.faq-question`, `.faq-number`, `.faq-text`, `.faq-icon` plus `::before`/`::after` pseudo-elements, `.faq-answer` transition, and `.faq-answer p` padding all align exactly.

A dedicated `@media (max-width: 768px)` block was added to both sub-landing files containing the three FAQ mobile rules (`.faq-question`, `.faq-text`, `.faq-answer p`) that root places inside its 768px breakpoint. This matches root's approach rather than merging into the existing 600px breakpoint.

Root CSS was not modified. HTML files show only unrelated navigation fixes (alt text "moovv.fit" → "Moovv"), no FAQ structure or content changes.

<details>
<summary>Issues (0)</summary>

No issues found.

</details>

<details>
<summary>Details</summary>

## Declaration-by-declaration verification

### `.faq` section rule (new)
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| padding | 20px 0 60px | ✅ | ✅ |
| background | var(--bg-dark-1) | ✅ | ✅ |

### `.faq-title`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| font-family | var(--font-heading) | ✅ | ✅ |
| font-size | clamp(32px, 4vw, 48px) | ✅ | ✅ |
| font-weight | 600 | ✅ | ✅ |
| text-align | center | ✅ | ✅ |
| margin-bottom | 30px | ✅ | ✅ |

### `.faq-list`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| max-width | 900px | ✅ | ✅ |
| margin | 0 auto | ✅ | ✅ |
| display | flex | ✅ | ✅ |
| flex-direction | column | ✅ | ✅ |
| gap | 16px | ✅ | ✅ |

### `.faq-item`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| background | linear-gradient(180deg, rgba(27,44,106,0.2) 0%, rgba(24,33,50,0.4) 100%) | ✅ | ✅ |
| border | 1px solid var(--white-10) | ✅ | ✅ |
| border-radius | 16px | ✅ | ✅ |
| overflow | hidden | ✅ | ✅ |
| transition | all 0.3s ease | ✅ | ✅ |
| OLD border-bottom | removed | ✅ | ✅ |

### `.faq-item:hover`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| border-color | var(--white-15) | ✅ | ✅ |

### `.faq-item.active`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| background | linear-gradient(180deg, rgba(27,44,106,0.35) 0%, rgba(24,33,50,0.6) 100%) | ✅ | ✅ |
| border-color | var(--white-15) | ✅ | ✅ |

### `.faq-question`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| width | 100% | ✅ | ✅ |
| display | flex | ✅ | ✅ |
| align-items | center | ✅ | ✅ |
| gap | 16px | ✅ | ✅ |
| padding | 24px 28px | ✅ | ✅ |
| background | transparent | ✅ | ✅ |
| border | none | ✅ | ✅ |
| cursor | pointer | ✅ | ✅ |
| text-align | left | ✅ | ✅ |
| color | var(--white-100) | ✅ | ✅ |
| transition | all 0.2s ease | ✅ | ✅ |

### `.faq-number`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| font-family | var(--font-heading) | ✅ | ✅ |
| font-size | 18px | ✅ | ✅ |
| font-weight | 500 | ✅ | ✅ |
| color | var(--white-60) | ✅ | ✅ |
| min-width | 24px | ✅ | ✅ |

### `.faq-text`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| flex | 1 | ✅ | ✅ |
| font-family | var(--font-heading) | ✅ | ✅ |
| font-size | 18px | ✅ | ✅ |
| font-weight | 500 | ✅ | ✅ |

### `.faq-icon`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| width | 24px | ✅ | ✅ |
| height | 24px | ✅ | ✅ |
| position | relative | ✅ | ✅ |
| flex-shrink | 0 | ✅ | ✅ |

### `.faq-icon::before, .faq-icon::after`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| content | '' | ✅ | ✅ |
| position | absolute | ✅ | ✅ |
| background | var(--white-80) | ✅ | ✅ |
| transition | all 0.3s ease | ✅ | ✅ |

### `.faq-icon::before`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| top | 50% | ✅ | ✅ |
| left | 0 | ✅ | ✅ |
| width | 100% | ✅ | ✅ |
| height | 2px | ✅ | ✅ |
| transform | translateY(-50%) | ✅ | ✅ |

### `.faq-icon::after`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| top | 0 | ✅ | ✅ |
| left | 50% | ✅ | ✅ |
| width | 2px | ✅ | ✅ |
| height | 100% | ✅ | ✅ |
| transform | translateX(-50%) | ✅ | ✅ |

### `.faq-item.active .faq-icon::after`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| transform | translateX(-50%) rotate(90deg) | ✅ | ✅ |
| opacity | 0 | ✅ | ✅ |

### `.faq-answer`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| max-height | 0 | ✅ | ✅ |
| overflow | hidden | ✅ | ✅ |
| transition | max-height 0.3s ease, padding 0.3s ease | ✅ | ✅ |

### `.faq-item.active .faq-answer`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| max-height | 300px | ✅ | ✅ |

### `.faq-answer p`
| Property | Root | for-physios | for-clinics |
|----------|------|-------------|-------------|
| padding | 0 28px 24px 68px | ✅ | ✅ |
| font-size | 15px | ✅ | ✅ |
| line-height | 1.7 | ✅ | ✅ |
| color | var(--white-60) | ✅ | ✅ |

### Mobile `@media (max-width: 768px)` FAQ rules
Root places these inside its 768px media query block. Sub-landings now have a dedicated 768px block with the same rules:

| Selector | Property | Root | for-physios | for-clinics |
|----------|----------|------|-------------|-------------|
| .faq-question | padding | 20px | ✅ | ✅ |
| .faq-question | gap | 12px | ✅ | ✅ |
| .faq-text | font-size | 16px | ✅ | ✅ |
| .faq-answer p | padding | 0 20px 20px 52px | ✅ | ✅ |
| .faq-answer p | font-size | 14px | ✅ | ✅ |

## Constraints verification

| Constraint | Status |
|------------|--------|
| Root CSS unchanged | ✅ No diff against origin/main |
| No HTML FAQ structure changes | ✅ Only nav alt text changed |
| No FAQ content changes | ✅ |
| No `!important` | ✅ |
| No inline styles | ✅ |
| Colors via CSS variables | ✅ All colors use `--white-*`, `--bg-dark-1` |

</details>

<details>
<summary>File map</summary>

| File | Change |
|------|--------|
| `for-physios/css/styles.css` | FAQ section rules aligned to root; 768px mobile block added |
| `for-clinics/css/styles.css` | FAQ section rules aligned to root; 768px mobile block added |
| `css/styles.css` | No changes |
| `for-physios/index.html` | Nav alt text only (unrelated) |
| `for-clinics/index.html` | Nav alt text only (unrelated) |

Full diff: `git diff origin/main...HEAD -- for-physios/css/styles.css for-clinics/css/styles.css`

</details>
