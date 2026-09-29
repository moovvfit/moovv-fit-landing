# moovv.fit — AI Image Generation Prompts

> **Companion doc to** `BRAND_REFRESH_BRIEF.md`. Every image asked for in §7 of the brief (excluding the 60-sec demo video and the named-physiotherapist headshot — both of which are deferred) gets a paste-ready prompt below.
> **Date:** May 2026.

---

## How to use this doc

Each section below has:

1. **Where it goes** — the section of the page the image is for.
2. **Spec** — final dimensions, aspect ratio, format, and a "must clear" checklist.
3. **Prompt (primary)** — paste this directly into your image AI of choice.
4. **Prompt variants (A / B / C)** — three angles on the same brief, so you can pick the strongest one without re-prompting from scratch.
5. **Negative prompt / avoid list** — things the AI should *not* include. Most modern image AIs accept these as a separate field; if yours doesn't, append them with "avoid:" at the end of the main prompt.
6. **Recommended tool** — the AI that handles this specific style best, with reasoning.
7. **Iteration tips** — common pitfalls to fix on round 2.

### Brand visual guidelines (consistent across every image — read once, apply everywhere)

- **Color discipline.** Deep dark backgrounds (`#07060D` / near-black). Electric blue accent (`#4069FF`). Subtle teal/forest green secondary (`#113c32`). White/off-white for figures. Avoid: warm yellows, oranges, magentas, sepia tones — they don't match the page palette.
- **Style.** Cinematic, editorial, documentary. Real bodies, real moments. **Not** stock photography, **not** advertising-glossy, **not** hyper-saturated.
- **Lighting.** Soft, directional, often low-key. Window light. Studio softboxes. *Never* hard flash, *never* HDR, *never* heavy bokeh that screams "stock photo".
- **Skin & bodies.** Real-body diversity: a range of ages, body types, ethnicities, abilities. **Not** chiseled fitness models. The visual contract with the visitor is *"this app is for my body, not a magazine cover."*
- **Composition.** Negative space on one side (so your design team can place a glass panel / text overlay there). Wide shots and medium shots over close-ups for hero/persona use.
- **Brand-safe.** No visible brand logos, no readable text on apparel/equipment, no copyrighted patterns (Adidas stripes, Nike swooshes, Lululemon waistbands), no celebrity-likeness faces.
- **Consistent across the trio.** When generating the three persona shots (Images 1, 2, 3), use the same lens character, lighting language, and color grading so they sit together as a set.

### Tool guide (which AI for which prompt)

| AI tool | Best for | Avoid for |
|---|---|---|
| **Midjourney v6 / v7** | Cinematic photographic personas, lifestyle shots, mood. The prompts in this doc are written in Midjourney-friendly form. | Anything with text overlay (it can't spell). |
| **Google Imagen 3 / Ideogram** | Anything with text on it (the OG image, app store mockups, posters). They're the only mainstream models that get text correct. | Heavy cinematic mood — slightly more "stock-y". |
| **DALL-E 3 (via ChatGPT / Bing)** | Conceptual / illustrated visuals (the "deadlift ↔ forward bend" insight). Strong at metaphor & illustration. | Hyperrealism — looks plasticky. |
| **Flux 1.1 Pro (via Replicate / fal)** | Photorealism with realistic skin, hands, anatomy. Best for the persona shots if Midjourney is feeling too "polished". | Stylized illustration. |
| **Stable Diffusion XL + photo LoRA** | Local generation if you want full control + iteration speed. | Casual users — has a setup curve. |

**My recommendation for this batch:** Midjourney for 1, 2, 3, 6, 7. DALL-E 3 or Imagen for 4 (illustrated). Ideogram for 5 (text overlay). All are listed per-image below.

### Universal aspect-ratio cheat sheet (Midjourney syntax)

| Use | Aspect ratio | Midjourney param |
|---|---|---|
| Square persona card | 1:1 | `--ar 1:1` |
| Wide persona card / hero device companion | 16:9 | `--ar 16:9` |
| Portrait persona card / mobile hero | 4:5 | `--ar 4:5` |
| Open Graph (social share) | 1.91:1 | `--ar 191:100` |
| Twitter card large | 2:1 | `--ar 2:1` |

Append `--style raw --v 7` to most photographic prompts (raw style turns off Midjourney's default beautification).

---

## Image 1 — Persona: Desk worker (pain track)

### Where it goes
New "Built for every body" section (§4.5 of the brief), Card 1: *"For pain that's stuck around"*.

### Spec
- **Final size:** 1200 × 1200 px (square) OR 1600 × 900 px (16:9). Generate both if unsure.
- **Format:** JPG, sRGB.
- **Must clear:** desk-worker context obvious within 1 second; warm-but-tired body language; *not* cheerful office stock.

### Prompt (primary — Midjourney)

```
Documentary photo of a 38-year-old South Asian woman in a soft grey hoodie working from a home setup, slowly rolling her shoulder back, tension visible in her neck. Late afternoon, cool window light from camera left, modern minimalist apartment in soft focus behind her. Natural posture, a moment of quiet acknowledgment of her own body. Editorial lifestyle photography, shot on 50mm f/1.8, mild grain, muted dark teal and slate palette. Negative space on the right of the frame for design overlay. --ar 16:9 --style raw --v 7
```

### Variants

**Variant A — male, 40s, Western European**
```
Documentary photo of a 45-year-old man with stubble and a soft navy shirt sitting back from his desk, both hands at the base of his neck, eyes briefly closed. Window light, dark home office, half-empty coffee cup on the desk. Real, lived-in moment — not posed. Cinematic editorial style, subtle warm-cool color contrast, deep dark background. --ar 16:9 --style raw --v 7
```

**Variant B — female, 30s, East Asian, lower-back focus**
```
Wide editorial photo of a 32-year-old East Asian woman standing up from a wooden desk, both hands pressed gently on her lower back, mid-stretch. Floor-to-ceiling window behind her, evening city light, rich shadows. Soft minimalist aesthetic, deep blacks, subtle electric-blue ambient light from a screen offscreen. Negative space camera-left. --ar 16:9 --style raw --v 7
```

**Variant C — wider context, no face needed**
```
Editorial wide shot from behind a person at a standing desk, head tilted slightly down, one hand at the base of the neck. Reading lamp glow, dark wood, evening. Identity ambiguous — works for any age, any gender. Very moody, very real, deep dark palette with single warm light source. --ar 16:9 --style raw --v 7
```

### Avoid
`avoid: smiling, posed corporate stock, bright fluorescent office, suit and tie, multiple people, headphones, cartoon style, model-thin physique, perfect lighting, oversharpened skin, plastic textures, watermark, text, brand logos, swoosh, stripe pattern.`

### Recommended tool
**Midjourney v7** (raw style). Flux 1.1 Pro is a close second if you want softer, more documentary skin.

### Iteration tips
- Hands at the neck/back are prone to AI failure. If you see 6 fingers, regenerate or use the inpaint tool to fix.
- "Tension visible" is hard to direct — if the result looks too relaxed/posed, add: *"micro-expression of tightness, brow slightly furrowed, eyes half-closed, real fatigue."*
- If the laptop on the desk has a fake-AI-looking logo, request: *"laptop closed or laptop logo blurred."*

---

## Image 2 — Persona: Active improver / athlete

### Where it goes
"Built for every body" (§4.5), Card 2: *"For the body you train"*. Also a candidate replacement / companion to `images/Features_Runner.jpg`.

### Spec
- **Final size:** 1200 × 1200 px square OR 1600 × 900 px wide.
- **Format:** JPG, sRGB.
- **Must clear:** mobility / pre-workout context — *not* a peak-performance gym shot. The point is "I take movement seriously" not "I'm an Instagram athlete."

### Prompt (primary — Midjourney)

```
Cinematic editorial photo of a 29-year-old athletic Black man in a dark grey unbranded tank and shorts, performing a deep cossack squat on a smooth concrete studio floor. Single large softbox from camera left, deep blacks, subtle teal rim light. Calm, focused expression, mid-breath. Quiet pre-training moment, not high-energy. Wide shot, body fully in frame, negative space camera-right. Real athletic body, not bodybuilder physique. --ar 16:9 --style raw --v 7
```

### Variants

**Variant A — female lifter, mobility flow**
```
Documentary photo of a 33-year-old Latina woman in a dark olive sports set, mid-thoracic rotation stretch on a yoga mat, dark studio. One overhead softbox, deep shadows, teal-cool color grade. Natural focused expression. Strong, capable body — not a fitness model. Negative space camera-left. --ar 16:9 --style raw --v 7
```

**Variant B — runner, hip mobility drill**
```
Editorial photo of a 41-year-old runner with greying temples performing a 90/90 hip stretch on a wooden studio floor, dark background. Side window light, shadow play across the floor. Calm, deliberate, real. Negative space upper third. Cinematic, deep dark palette, subtle electric-blue ambient. --ar 16:9 --style raw --v 7
```

**Variant C — yoga / mobility hybrid**
```
Cinematic photo of a 27-year-old South Asian woman in a dark navy fitted top, holding a deep shoulder-opening stretch against a wall in a minimalist concrete studio. Late afternoon side light, soft skin texture, lived-in tattoos visible. Real, grounded, quiet. --ar 16:9 --style raw --v 7
```

### Avoid
`avoid: bodybuilder physique, oiled skin, gym selfie energy, neon gym lighting, branded apparel, sweat dripping cliché, fitness magazine pose, peak-effort grimace, multiple people, gym mirrors, dumbbell in hand, motion blur, watermark, text.`

### Recommended tool
**Midjourney v7** for atmosphere. Flux 1.1 Pro if you want skin/anatomy to feel less polished.

### Iteration tips
- Athletic mobility poses (cossack, 90/90, thoracic rotation) often come back as approximations. Reference a real photo and use Midjourney's `--cref` or the image-prompt feature to lock the pose.
- If the body looks too magazine-perfect, add: *"realistic body, slight imperfections, natural skin texture, no airbrushing.*"
- For the dual-track positioning, the *vibe* matters more than the move — pick whichever variant feels most "this could be me."

---

## Image 3 — Persona: Older adult (longevity / independence)

### Where it goes
"Built for every body" (§4.5), Card 3: *"For the years ahead of you"*.

### Spec
- **Final size:** 1200 × 1200 px square OR 1600 × 900 px.
- **Format:** JPG, sRGB.
- **Must clear:** capable, dignified, *not* the stock-photo "happy senior" trope. The visitor here is the future-you, not an actor.

### Prompt (primary — Midjourney)

```
Documentary editorial photo of a 68-year-old South Asian woman in a dark grey shawl and casual home clothes, mid-stride walking through a bright-but-shadowed living room, balanced and confident, holding a yoga block in one hand. Soft window light, deep dark palette, real apartment with worn wood floors and one tall plant. Capable, dignified, focused — not smiling at camera. Wide shot, negative space camera-right. --ar 16:9 --style raw --v 7
```

### Variants

**Variant A — male, gardening / functional movement**
```
Cinematic photo of a 70-year-old man with grey hair, in a dark linen shirt, doing a mid-bend reach toward a low planter on a stone patio, evening light, dark green shadows. Strong, capable, focused — not posed. Natural creased skin, real hands. Editorial, not stock. --ar 16:9 --style raw --v 7
```

**Variant B — couple, casual mobility moment**
```
Editorial photo of a 65-year-old Black couple in their kitchen, one doing a calf stretch against the counter, the other reading on a phone in soft focus behind. Morning window light, dark cabinetry, real lived-in space. Quiet ordinary moment, not staged. --ar 16:9 --style raw --v 7
```

**Variant C — outdoor, walking with grandchild (most emotional)**
```
Cinematic wide shot of a 67-year-old woman walking briskly through a park at golden hour with her 6-year-old grandchild, holding hands, dappled tree light, deep blacks in shadow. Both in motion, candid. Mobility = independence visualized. --ar 16:9 --style raw --v 7
```

### Avoid
`avoid: stock-photo smiling senior, white-hair cliché, hospital setting, mobility aid prominence, retirement-home aesthetic, infantilizing body language, multiple grinning seniors at lunch, blurry skin smoothing, watermark.`

### Recommended tool
**Midjourney v7** with `--style raw`. The "raw" flag is critical here — Midjourney's default beautification adds creepy youth to older faces if you don't disable it.

### Iteration tips
- AI models *systematically* under-age older subjects. Push the age 5-10 years older than you want in the prompt to land the actual age.
- Hands of older adults are where AI fails most visibly. Frame so hands are obscured (in a pocket, holding the block) or be ready to inpaint.
- Variant C (the grandchild walk) is the most emotionally resonant for the "years ahead" framing — if you only generate one, generate that.

---

## Image 4 — Conceptual: "Forward bend ↔ deadlift" insight visual

### Where it goes
New "Why mobility matters more than you think" section (§4.8 of the brief). This is the page's most counterintuitive insight ("if you can't touch your toes, your deadlift is leaving power on the floor") and it deserves a strong visual hook.

### Spec
- **Final size:** 1600 × 900 px wide.
- **Format:** JPG (or PNG if you want to keep transparent overlays for design).
- **Must clear:** the *connection* between the two movements is instantly visible — same kinetic chain, same body, two contexts.

### Prompt (primary — DALL-E 3 / Imagen 3, illustrated)

```
Editorial split-screen illustration. Left half: silhouette of a person in a forward bend (toe touch), spine curve clearly drawn, posterior chain (hamstrings, glutes, lower back) highlighted in glowing electric blue. Right half: silhouette of the same body shape mid-deadlift with a barbell, same posterior chain highlighted in the same electric blue, kinetic chain visualized as flowing energy lines. Deep near-black background (#07060D), minimal modern editorial style, like a Wired magazine infographic. Single light source, no clutter. The viewer instantly understands these two movements use the same chain.
```

### Variants

**Variant A — photographic split (more cinematic, less explanatory)**
```
Cinematic editorial split-screen photo. Left: real person from the side, mid-forward-bend, dark studio, single softbox from above, deep shadows, electric-blue rim light along their spine and hamstrings. Right: same person from the same angle, mid-deadlift with a black barbell, same rim light pattern. Composition mirrors. The same body, the same chain, two contexts. Cinematic, dark, minimal. Negative space at top for headline. --ar 16:9
```

**Variant B — anatomical overlay style (medical-meets-modern)**
```
Modern anatomical illustration, two figures side-by-side on a deep black background. Left figure in forward bend, right figure in deadlift bottom position. Identical posterior chain (erector spinae, glutes, hamstrings) drawn in electric blue (#4069FF) on both, with subtle teal connecting lines showing it is one continuous chain. Clean editorial style, like a high-end fitness science magazine. No clutter, no labels.
```

**Variant C — abstract / metaphorical (most stylized)**
```
Minimalist editorial illustration of a single human silhouette mid-rotation, transforming from a forward-bend pose on the left into a deadlift pose on the right, with a single continuous flowing electric-blue line tracing the spine and posterior chain through both poses. Deep near-black background. Abstract, smart, magazine-cover quality. No text, no labels.
```

### Avoid
`avoid: cartoon style, gym bro illustration, hyper-muscular anatomy, before-and-after weight loss vibes, medical textbook plain illustration, neon overload, multiple body parts labeled, watermarks, text artifacts, AI hallucinated barbell weights with random plate numbers.`

### Recommended tool
**DALL-E 3** for the illustrated variants — it understands metaphor better than Midjourney. **Imagen 3** if you want any text labels (e.g., "forward bend" / "deadlift") rendered correctly. **Midjourney** for the photographic Variant A.

### Iteration tips
- The single most important success criterion: a viewer with no fitness knowledge should understand "same body part doing two things" in under a second. If your first generation requires explanation, regenerate.
- For Variant A, you'll likely need to composite the two halves manually — generate each half separately (one prompt for the forward bend, one for the deadlift, both with identical lighting and subject) and combine in design.
- Plates on the barbell: AI loves to write fake numbers like "55" and "9". Either generate plates as solid black/blue discs ("plain unmarked weight plates") or be ready to retouch.

---

## Image 5 — Open Graph / social share image

### Where it goes
`images/og-image.png` — referenced in `<meta property="og:image">`. Renders any time anyone shares the link on WhatsApp, Slack, Twitter, LinkedIn, iMessage.

### Spec
- **Final size:** 1200 × 630 px (Open Graph standard, also good for Twitter).
- **Format:** PNG or JPG.
- **Must clear:** the brand name "Moovv" + the tagline "Mobility, made personal." are crisp and readable at small sizes; phone mockup of the app visible; visual identity consistent with the rest of the page.

### Prompt — two-step approach (generate background, add text in design)

**Step 1 — generate background (Midjourney):**

```
Cinematic editorial product hero on a deep near-black background (#07060D). A modern iPhone in matte black, screen showing a soft glowing electric-blue (#4069FF) abstract mobility app interface (no readable text), tilted at a subtle three-quarter angle, floating slightly above a dark surface. Subtle teal rim light. Soft directional softbox from upper left. Dramatic shadow under the phone. Ultra-clean, premium, deep blacks, minimal. Negative space on the left for headline overlay. Editorial commercial photography, shot on 100mm f/2.8. --ar 191:100 --style raw --v 7
```

**Step 2 — add text in Figma / design tool (or regenerate with Imagen 3 below):**

Add overlay text on the left side:
- Eyebrow: `moovv.fit` (small, electric blue)
- Headline: `Mobility, made personal.` (large, white, Lufga SemiBold)
- Subline: `Your personal mobility coach. AI-built plans, physio-backed.` (medium, white at 70% opacity)

**Alternative: one-shot in Imagen 3 or Ideogram (if you trust it with text):**

```
Open Graph social share image, 1200x630px, deep near-black background. On the left half: large white text "Mobility, made personal." in a clean modern geometric sans-serif font, with a small electric blue "moovv.fit" wordmark above it, and below it in lighter white text: "Your personal mobility coach. AI-built plans, physio-backed." On the right half: a sleek matte-black iPhone tilted at a slight angle, screen glowing with a soft electric-blue abstract mobility interface. Cinematic light, deep shadows, premium editorial style. No other elements.
```

### Avoid
`avoid: cluttered layout, multiple devices, social media icon decorations, gradient overload, drop-shadow text, bevels, generic stock-app screen, App Store badges (those go on the page, not the OG), cluttered backgrounds, watermarks.`

### Recommended tool
**Two-step is safer:** Midjourney for the background photo, then layer text in Figma using the actual brand font (Lufga). This avoids AI-text hallucinations forever.
**One-shot:** Ideogram or Imagen 3 — they're the only models that reliably render English text correctly at this size.

### Iteration tips
- Generate the background at 2400 × 1260 (2x) so you can crop tightly without losing sharpness.
- The phone screen will read as a *vibe* not as content — don't try to make the AI generate a "real" app screen. Solid blue glow with a hint of UI is what works best.
- If you want the screen to show something specific, mock the actual app screen in Figma and composite it onto the AI-generated phone.

---

## Image 6 — Hero lifestyle visual (optional — currently using GIFs of in-app screens)

### Where it goes
Optional replacement / addition to the hero device area, OR a wide background motif behind the hero copy. Currently the hero shows three GIFs of app screens — adding a "person + phone" lifestyle visual is the single highest-impact upgrade in the asset list.

### Spec
- **Final size:** 1920 × 1080 px (hero) or 1600 × 1600 (square companion).
- **Format:** JPG.
- **Must clear:** real person using the app in their real life — not a phone-on-a-pedestal product shot.

### Prompt (primary — Midjourney)

```
Cinematic lifestyle photo of a person sitting cross-legged on a dark wood floor in soft morning window light, looking down at their phone in their hands, mid-mobility-routine. Phone screen glows soft electric blue. Person's body in a relaxed but engaged posture. Yoga mat, foam roller, stretch band casually visible in soft focus. Real, lived-in apartment — not a studio. Editorial documentary style, deep blacks, real shadows. Negative space on right third. --ar 16:9 --style raw --v 7
```

### Variants

**Variant A — older adult, kitchen counter, hip stretch with phone propped on counter**
```
Cinematic photo of a 62-year-old man in a dark hoodie, doing a hip flexor stretch in his kitchen with his phone propped on the counter showing a soft blue mobility app glow. Morning light, dark wood, real home. Editorial, deep blacks, focused expression. --ar 16:9 --style raw --v 7
```

**Variant B — athlete pre-workout, phone in hand**
```
Editorial photo of an athletic woman in dark gym wear sitting on a bench in a minimalist garage gym, looking at her phone (electric blue glow), foam roller next to her. Single window light, deep concrete shadows. Quiet pre-training moment. --ar 16:9 --style raw --v 7
```

**Variant C — split / dyptich for dual-track hero**
Generate one of Variant A AND one of Variant B with identical lighting and lens character. Display side-by-side in the hero to literally show the dual-track positioning. (This makes the page's strategic call visually obvious.)

### Avoid
`avoid: phone on white seamless background, product-shot vibes, fake App Store screens, hyper-saturated UI on the screen, multiple devices, smiling at camera, fitness model physique, branded app logos visible, watermarks.`

### Recommended tool
**Midjourney v7 raw**. Flux 1.1 Pro for skin/hand realism if needed.

### Iteration tips
- "Phone screen glows electric blue" is the trick that signals *"app in use"* without needing to render real UI. Lean into it.
- AI models often render the phone as featureless or as a generic Samsung/iPhone hybrid. Specify "matte black modern smartphone, no logo" if it's distracting.
- Hands holding phones are an AI failure point. Be ready to inpaint or use a "phone resting on a surface" composition instead.

---

## Image 7 — Equipment / "what you need" visual (optional, supports §4.7 "What's in the app")

### Where it goes
Optional accent image inside or beside the new "What's in the app" section (§4.7 of the brief, where one bullet says *"Works with what you have. Bodyweight-friendly. Add a band, a ball, or a roller."*).

### Spec
- **Final size:** 1200 × 800 px.
- **Format:** JPG.
- **Must clear:** simple equipment shown plainly; not a gym-store catalog shot.

### Prompt (primary — Midjourney)

```
Top-down editorial product photo of a navy resistance band, a medium lacrosse ball, and a black foam roller arranged with intentional negative space on a dark concrete surface. Soft directional light from upper-left, deep shadows, minimal styling. Editorial commercial photography style, like Kinfolk or Cereal magazine. Deep dark palette, subtle electric-blue ambient. --ar 3:2 --style raw --v 7
```

### Variants

**Variant A — angled hero shot, single softbox**
```
Editorial photo, angled hero composition: stretch band, lacrosse ball, foam roller arranged in soft asymmetry on a dark wood floor. Single overhead softbox, dramatic shadows, deep blacks. Simple, premium, intentional. --ar 3:2 --style raw --v 7
```

**Variant B — minimal flat lay with hand**
```
Top-down photo of a hand reaching into frame to pick up a black foam roller from a dark concrete floor, alongside a navy resistance band and lacrosse ball. Quiet morning light, real moment, editorial style. --ar 3:2 --style raw --v 7
```

### Avoid
`avoid: gym-store catalog photo, branded equipment, neon yellow band, pink or purple color palette, multiple sets of dumbbells, treadmill, bright cyc-wall lighting, watermarks, sale tags.`

### Recommended tool
**Midjourney v7 raw** — this is exactly its sweet spot.

### Iteration tips
- AI is unreliable with realistic resistance band textures. If the band looks rubbery and fake, regenerate with: *"matte fabric resistance band, slightly worn, real gym equipment."*
- Lacrosse balls and foam rollers are well-represented in training data — they should generate cleanly.
- This image is "nice to have" — skip if budget/time tight.

---

## Image 8 (NEW idea, not in original brief) — "Mobility map" visualization

### Where it goes
Optional — could replace or complement the existing `images/Features_Runner.jpg` in the Features section (§4.4), or anchor the "Why mobility matters" section (§4.8).

### Spec
- **Final size:** 1200 × 1500 px portrait, OR 1600 × 1000 px wide.
- **Format:** PNG (transparent areas useful) or JPG.
- **Must clear:** human silhouette with a "mobility heatmap" overlay showing tightness/range across the body — instantly tells the visitor "this app understands my whole body."

### Prompt (primary — DALL-E 3 / Imagen 3)

```
Modern editorial illustration of a human silhouette (gender-neutral, average build) standing in neutral pose, front-facing, on a deep near-black background (#07060D). Body shown as a soft white outline. Joints and muscle groups marked with subtle glowing dots — some electric blue (#4069FF) for "good range", some warm amber (#F59E0B) for "restricted". Subtle anatomical lines connecting related joints (e.g., hip ↔ knee, shoulder ↔ thoracic spine). Like a high-end medical app interface, minimal, premium, scientific but human. No text labels.
```

### Variants

**Variant A — full-body x-ray-style overlay**
```
Editorial illustration: human figure mid-walk, semi-transparent skeletal overlay glowing in electric blue (#4069FF), key mobility joints (hips, shoulders, thoracic, ankles) highlighted with subtle radiating glow. Deep near-black background. Modern, clean, science-meets-design.
```

**Variant B — body-mapping interface mockup**
```
Editorial mockup of a phone app interface showing a body diagram with tappable regions, some glowing electric blue, some glowing amber, subtle scientific overlays. Premium dark UI, minimal, like Figma's most beautiful work. No real text — placeholder shapes only.
```

### Avoid
`avoid: medical textbook plain anatomy, cartoon body, neon overload, fitness wearable cliché, generic "AI" buzz visuals, robotic body, glitch effects, hexagon grid backgrounds.`

### Recommended tool
**DALL-E 3** for clean illustrated style. **Imagen 3** if you want the body labels readable. **Figma + Mockup library** if you want this to be a real app screen — sometimes a designed mockup beats a generated one.

### Iteration tips
- This is a high-stakes visual (it sells the *idea* of personalization). Generate 6-8 versions, pick best.
- Avoid leaning too "AI" / "tech-bro" — the warmth of the brand should still come through.
- If integrating with real app UI later, generate this as a *concept* not as a literal screen.

---

## Quick-reference summary

| # | Asset | Where | Aspect | Best tool | Priority |
|---|---|---|---|---|---|
| 1 | Desk worker persona | §4.5 Card 1 | 16:9 | Midjourney v7 raw | **High** |
| 2 | Active improver persona | §4.5 Card 2 | 16:9 | Midjourney v7 raw | **High** |
| 3 | Older adult persona | §4.5 Card 3 | 16:9 | Midjourney v7 raw | **High** |
| 4 | Forward-bend ↔ deadlift insight | §4.8 | 16:9 | DALL-E 3 / Imagen 3 | **High** |
| 5 | OG / social share image | `<head>` meta | 1.91:1 | Midjourney + Figma OR Ideogram | **High** |
| 6 | Hero lifestyle visual | Hero | 16:9 | Midjourney v7 raw | Medium |
| 7 | Equipment flat lay | §4.7 | 3:2 | Midjourney v7 raw | Low |
| 8 | Mobility map visualization | §4.4 / §4.8 | Portrait | DALL-E 3 / Imagen 3 | Medium |

**If you only generate three:** 1, 2, 3 (the persona trio). They unlock the dual-track positioning that everything else in the brief depends on.
**If you only generate four:** add #5 (OG image). Every link share between now and launch is leaving conversion on the table without it.
**If you only generate five:** add #4 (the deadlift visual). It's the single most counterintuitive insight in your pitch and currently has no visual.

---

## A few cross-cutting tips for the whole batch

### Iteration discipline
- Run each prompt **at least 4 times** before declaring it "done". AI output variance on round 1 vs round 4 is enormous.
- Use **image references** (Midjourney `--cref`, DALL-E "make me a similar image to this") once you have one good output, to keep the rest of the set visually consistent.
- Save the **seed** for any image you love, so you can re-generate with tweaks while keeping the core composition.

### Consistency across the set
The three persona shots need to read as a *family*. Practical way to do this:
1. Generate all three with the same prompt skeleton (same lighting language, same lens, same color grade).
2. After picking favorites, run them all through the same color-grade preset in Lightroom / Capture One. Even a 30-second LUT pass makes the trio look like one shoot.
3. Crop them to the exact same aspect ratio.

### Hands, faces, anatomy — the three things AI fails at
- **Hands:** position them out of frame, in pockets, holding objects, or be ready to inpaint.
- **Faces:** if a face looks weirdly symmetrical/plastic, regenerate or use an "imperfect, real, candid" modifier.
- **Anatomy in motion:** for the active-improver persona especially, AI guesses at biomechanics. Reference real photos.

### Legal / brand safety
- AI image gen + commercial use is a *grey* legal area. Midjourney's commercial license is fine for a startup landing page. Stable Diffusion (open-weights) is fine. DALL-E 3 (via OpenAI) — review their terms; they grant commercial use for paid plans.
- **Don't generate an image of a recognizable real person** (athlete, celebrity). Even unintentional likeness can be a problem.
- Keep prompts generic on apparel — AI can hallucinate Nike-shaped swooshes that you don't want to ship.

### Budget reality check
A complete persona set + OG + insight illustration is **~$30-60** of API credits across these tools at full quality. Don't iterate on the cheap models when the deciding factor is whether your hero image lands.

---

*End of prompt set. Open a thread for "I generated X, here's the result, what next" and we'll iterate.*
