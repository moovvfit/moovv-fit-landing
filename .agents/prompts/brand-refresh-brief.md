# moovv.fit — Landing Page Brand & Copy Refresh Brief

> **Audience for this doc:** an AI executor (Claude / Cursor / etc.) acting on the recommendations, plus the moovv.fit team reading along.
> **Scope:** copy, branding, structure, and SEO. No code-architecture changes — only text content, asset swaps, and small structural additions to existing sections.
> **Source of truth scanned:** `index.html`, `js/main.js` (carousel + subtitle rotators), nav links, FAQ, CTA, footer.
> **Date:** May 2026 — *updated post asset generation: persona trio, OG image, hero lifestyle, mobility map, and forward-bend↔deadlift visuals are in `images/` and ready to wire in. See §7 for the rename map and §15 for the no-equipment positioning rule.*

---

## 0. TL;DR

Most testers said the page is confusing. They're right, and here's why: the page **never tells a first-time visitor what moovv.fit actually is.** It tells them what it helps with ("move better"), it shows them screens, but nowhere in the first 5 seconds does it say: *"moovv.fit is a mobility app that combines AI-generated daily plans with real physiotherapists, so you can heal pain or move better in whatever you do."*

Three structural moves fix 80% of the confusion:

1. **Rewrite the hero** to lead with a clear product claim ("Mobility, made personal.") + a one-sentence explainer of *what it is*.
2. **Add a dual-track entry** — two visible CTAs in the hero so pain sufferers and active improvers both see themselves immediately, without forcing one persona on everyone.
3. **Strip the jargon.** "Physio connects all under one umbrella," "Expert-Led Recovery," "Dynamic Calibration," "Pain Dynamic analysis" — all need plain-English replacements.

Everything else in this brief (proof sections, FAQ rewrites, CTA, footer, SEO, asset asks) cascades from those three.

---

## 1. Diagnosis — what testers are reacting to

| # | Problem on the page | Why it confuses |
|---|---|---|
| 1 | H1 = *"Everything you need to move better, every day."* | It's a benefit promise without a product noun. The reader's first question — *"what is this thing?"* — is unanswered. |
| 2 | Subhead = *"Get AI generated plans and physio connects all under one umbrella."* | "Physio connects" reads as either a typo or vendor jargon. "Under one umbrella" is filler that adds zero meaning. |
| 3 | Brand persona is split | Nav: "Expert Recovery." Features: "Expert-Led Recovery." Carousel: "Tell us where it hurts." FAQ #1: "different from YouTube exercises." → page reads as a *clinical pain platform* in some places, *consumer fitness app* in others. |
| 4 | "Why now" is missing | The insight you told me about — *"if you can't do a forward bend, your deadlift is suffering"* — is the strongest hook in the entire pitch and it doesn't appear anywhere on the page. |
| 5 | No credibility markers visible above the fold | No physiotherapist names, no clinic affiliations, no founder credibility, no count of users on the waitlist, no science references. |
| 6 | Hero device shows the *features* but not the *outcome* | The user can't visualize themselves living the result. |
| 7 | Watch-demo button has no demo | "watch demo ▶" sits in the CTA section with no destination. Either build it or remove it. |
| 8 | Brand name is inconsistent | "moovv.fit" (logo, footer, conversational copy) vs "MoovvFIT" (page title, OG meta). Pick one. |
| 9 | Audience age range isn't visible anywhere | You told me retirees → young athletes are all welcome. Visitor would never guess. |
| 10 | The "Active improver" persona has zero visual presence | Every screenshot is pain-flow. A runner / lifter / yoga practitioner using the app isn't shown. |

---

## 2. Brand positioning (the north star — everything below is built from this)

### 2.1 One-line positioning

> **For people whose bodies aren't moving the way they should — whether that's nagging back pain at the desk or a stuck deadlift at the gym — moovv.fit is a personalized mobility platform that combines AI-generated daily plans with real physiotherapists, so you heal faster, prevent injuries, and move better in everything you do.**

### 2.2 The 3-second pitch (use this when forced to be brief)

> **moovv.fit — your personal mobility coach. AI-built plans, physio-backed, for pain relief and better movement.**

### 2.3 Tagline candidates (recommendation in bold)

| Tagline | Feel | Trade-off |
|---|---|---|
| **Mobility, made personal.** ⭐ | Clean, claim-driven, scales across pain + fitness | Recommended — works in hero, OG image, app store |
| Move better. Live better. | Warm, broad | Generic — too many wellness brands use this shape |
| Your body, unblocked. | Provocative, modern | Stronger for the "active" track; might alienate older pain sufferers |
| The mobility coach that knows your body. | Functional, descriptive | Long for a tagline, good for OG description |

### 2.4 Mission line (footer, About, press)

> **We believe pain-free, capable movement is a right — not a luxury. moovv.fit makes the kind of personal mobility care that used to require a clinic visit available in your pocket, every day.**

### 2.5 Competitive positioning sentence (for press, investor decks, "About")

> *"Bend taught the world to stretch daily. Hinge Health proved digital MSK care works at scale. Preve gave India real physiotherapists on demand. moovv.fit is the first to put all three in one app — a personalized mobility platform built for pain relief AND performance, for every body, every day."*

---

## 3. Voice & tone

### 3.1 Voice principles

- **Warm, not clinical.** A great physiotherapist who happens to text well — not a hospital pamphlet.
- **Plain English over jargon.** If a 60-year-old with knee pain wouldn't say it, we don't write it. ("Dynamic Calibration" → "your plan adapts as you get better.")
- **Specific over vague.** "10-15 minutes a day" beats "quick daily routines." "A stretch band, a ball, a foam roller" beats "basic equipment."
- **Confident, not boastful.** State the value, don't oversell. Avoid "revolutionary," "cutting-edge," "world-class."
- **Inclusive across age and ability.** A retiree and a 24-year-old lifter should both feel the page is talking to them.

### 3.2 Words to use / avoid

| Use | Avoid |
|---|---|
| mobility, movement, range, stiffness | flexibility hacks, biohacking |
| physiotherapist, physio | "physical therapist" alone (US-only); "physio connects" (jargon) |
| plan, routine, exercises | protocols, regimens (clinical) |
| heal, recover, prevent, move better | "fix yourself," "cure," "transform" |
| AI-built, physio-designed, personalized | "smart," "next-gen," "revolutionary" |
| your body, your plan, your pace | "the user," "patients" |

### 3.3 Capitalization & brand name (ship-blocker, fix everywhere)

- **Brand name in body copy:** `moovv.fit` (lowercase, with the dot).
- **Brand name in titles, OG, app store, sentence-start:** `Moovv` (capital M, no FIT). `MoovvFIT` is retired.
- **Page `<title>` should change** from `MoovvFIT - Live Pain Free` → `Moovv — Mobility, Made Personal | moovv.fit`.
- **OG title:** `Moovv — your personal mobility coach. AI plans, physio-backed.`

This single change makes the brand feel intentional everywhere it shows up (browser tab, Slack previews, WhatsApp shares).

---

## 4. Section-by-section copy — BEFORE → AFTER → WHY

> The "Selector" column tells the AI executor *exactly* which DOM node to touch. Selectors are taken from the current `index.html`. If a section is new, that's noted.

### 4.1 Page `<title>` and meta

| Field | Current | New | Why |
|---|---|---|---|
| `<title>` | MoovvFIT - Live Pain Free | **Moovv — Mobility, Made Personal \| Personalized Plans & Physiotherapists** | Captures both pain ("personalized plans") and SEO ("physiotherapists"). Brand-first naming. |
| `meta[name="description"]` | MoovvFIT is a comprehensive mobility platform that helps you live pain free, move with confidence, and get your life back. | **Moovv is your personal mobility coach. Get AI-built daily plans designed with physiotherapists to relieve pain, prevent injury, and move better — at any age, in any sport, at your desk or in the gym.** | Adds keywords (physiotherapists, daily plans, prevent injury, sport, desk) and explicitly opens the audience aperture. |
| `meta[property="og:title"]` | MoovvFIT - Pain Management & Recovery | **Moovv — your personal mobility coach** | Friendlier in shares. "Pain Management & Recovery" alienates the active-improver. |
| `meta[property="og:description"]` | A comprehensive mobility platform that helps you live pain free and get your life back with guided recovery and expert-backed support. | **AI-built mobility plans, designed with physiotherapists. Heal pain, prevent injury, move better — every day.** | Tighter, action verbs, dual audience. |
| `meta[name="theme-color"]` | #07060D | (no change) | Fine. |

**Add new meta tags** (currently missing):

```html
<meta name="keywords" content="mobility app, physiotherapy app, back pain relief, neck pain exercises, knee pain rehab, stretching app, AI physiotherapist, online physio, sports mobility, desk worker pain, posture correction">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Moovv — your personal mobility coach">
<meta name="twitter:description" content="AI-built mobility plans, designed with physiotherapists. Heal pain, prevent injury, move better — every day.">
<meta name="twitter:image" content="images/og-image.png">
<link rel="canonical" href="https://moovv.fit/">
```

Plus a JSON-LD `MobileApplication` block (full snippet in §6.4).

---

### 4.2 Navigation

| Selector | Current | New | Why |
|---|---|---|---|
| `nav .nav-links li:nth-child(1) a` | Expert Recovery | **How it helps** | "Expert Recovery" is a noun phrase nobody searches or scans for. "How it helps" is a verb that invites the click. |
| `nav .nav-links li:nth-child(2) a` | Moovv in action | **See the app** | More concrete. "Moovv in action" requires the reader to already know what Moovv is — circular. |
| `nav .nav-links li:nth-child(3) a` | For Physios | (keep) | Good as-is. |
| `nav .nav-links li:nth-child(4) a` | Blog | (keep) | Good. |
| `nav .nav-links li:nth-child(5) a` | FAQs | **Questions** | Slightly warmer; "FAQs" is fine if you prefer to keep. |
| `.btn-nav-cta` | get early free access | **Get early access — free** | Keep lowercase styling if that's intentional → `get early access — free`. The em-dash makes the "free" feel like a bonus rather than the headline. |

---

### 4.3 Hero — the single most important rewrite on the page

**Current structure:**
- Lottie logo
- H1: *"Everything you need to move better, every day."*
- Rotating subtitle (3 variants, all generic)
- Email form
- Phone mockup with rotating GIF (AI Plans / Physio Connects / Guided exercises)

**New structure (dual-track):**

| Element | Selector | New copy |
|---|---|---|
| Eyebrow (NEW — add a small label above H1) | (new `<span class="hero-eyebrow">` above H1) | **Your personal mobility coach** |
| H1 | `.hero-copy h1` | **Mobility, made personal.** |
| Subhead | `#heroSubtitle` (set as initial text — also update the JS rotation array) | **moovv.fit gives you a daily mobility plan — built by AI, backed by physiotherapists — so you can heal pain, prevent injury, and move better in everything you do.** |
| Track chooser (NEW — add above the email form) | (new `<div class="hero-tracks">` block) | **Two pill buttons:** `I want to fix pain` and `I want to move better`. Both scroll to the same form *and* fire a PostHog event so you can see which track wins. (Implementation note: just `data-track="pain"` / `data-track="performance"` on the buttons; analytics is one line in `main.js`.) |
| Form input placeholder | `#waitlistForm input[name="email"]` | **your email — be the first to try Moovv** |
| Form button | `#waitlistForm .btn-primary` | **claim my early access** (lowercase to match style, or "Claim my early access" if you switch case style) |
| Trust line (NEW — add below `form-agreement`) | (new `<p class="hero-trust">`) | **Built with physiotherapists. No spam. Unsubscribe any time.** |

**Subtitle rotation (`subtitles` array in `js/main.js`, line 59-63):**

Replace with these three. Each one keeps the *what it is* anchored, then varies the angle:

```js
const subtitles = [
  "moovv.fit gives you a daily mobility plan — built by AI, backed by physiotherapists — so you can heal pain, prevent injury, and move better in everything you do.",
  "From back pain at your desk to a stuck deadlift at the gym — your body's mobility is one problem. Moovv solves it, daily.",
  "A personal mobility coach in your pocket. AI-built plans, physiotherapist-designed, adapted to your body — every single day."
];
```

**Hero device captions (`.hero-device-caption` × 3):**

| Current | New | Why |
|---|---|---|
| AI Generated Plans | **A plan built for your body** | Says the *outcome* not the *technology*. |
| Physio Connects | **Real physios, on demand** | "Physio Connects" is the most-flagged jargon on the page. |
| Guided exercises | **Guided routines you'll actually do** | Adds a wink at the real consumer pain (apps that get abandoned). |

**Hero alt text (a11y + SEO):**

| Image | New alt |
|---|---|
| `hero-gifs/Slide1.gif` | "Personalized mobility plan for back pain shown inside the Moovv app" |
| `hero-gifs/Slide2.gif` | "Chat with a physiotherapist inside the Moovv mobility app" |
| `hero-gifs/Slide3.gif` | "Guided mobility routine playing inside the Moovv app" |

---

### 4.4 Features section (`#features-science`)

**The frame is the problem.** "Expert-Led Recovery. Tailored to Your Body" sounds like a hospital marketing brochure. Three tiles all say the same thing in different words ("precision analysis" / "protocol matching" / "dynamic calibration") — every one of them is an *engineering* description of an AI pipeline. None of them describe what the *user feels.*

**New section title:**

| Selector | Current | New |
|---|---|---|
| `.features-title` | Expert-Led Recovery. Tailored to Your Body | **Built around your body — not the average one.** |

**New tile copy** (panel headline + 1-line body):

| Tile | Current headline | New headline | New body |
|---|---|---|---|
| 1 | Precision mobility analysis | **It starts by understanding *your* body** | A short mobility check tells us where you're stiff, what's compensating, and what's actually causing the pain or limitation. |
| 2 | Expert Approved Protocol Matching | **Then we build a plan a physio would write for you** | Your profile is matched against routines designed by qualified physiotherapists. No generic stretching playlists. |
| 3 | Dynamic Calibration | **And it adapts as you get better** | The plan listens. As your range improves — or if a movement hurts — it adjusts. Every day, your body gets a better plan. |

**Why this works:**
- Each tile starts with a connector word (*It starts… Then we… And it…*) so the three tiles read as **one story**, not three disconnected features.
- "*A plan a physio would write for you*" is the single strongest line on the page for trust. Move this near the top if you can.
- "Dynamic Calibration" → "the plan listens" — same idea, no engineering jargon.

**Asset request:** the runner image (`images/Features_Runner.jpg`) is great for the active track but the visuals around this section skew athletic. See §7 — recommend cycling between three persona shots (desk worker / older adult / athlete) here, OR splitting into a 3-up.

---

### 4.5 NEW SECTION (insert after Features, before How-It-Works) — "Who Moovv is for"

This is the missing section that makes the dual-track land. Three short cards, each with a name, a 1-line problem, and a 1-line resolution. Same format = scannable in 5 seconds.

> **Built for every body that needs to move better.**

| Card | Headline | Subline | Suggested image |
|---|---|---|---|
| 1 | **For pain that's stuck around** | Chronic neck, back, or knee pain from your desk, your sport, or just from life. We help you understand it, move with it, and slowly move past it. | Person stretching at home, mid-30s+, warm setting |
| 2 | **For the body you train** | The forward bend you can't do is the deadlift you're losing power on. Better mobility = better lifts, longer runs, deeper yoga. | Athletic person doing a mobility drill — *not* a flashy gym shot, more "studio" |
| 3 | **For the years ahead of you** | Mobility is the single biggest predictor of independence as you age. Whether you're 30 or 70, today is the cheapest day to start. | Older adult moving freely — walking, gardening, playing with grandkids |

**Note for AI executor:** this section needs to be added to `index.html` between the `</section>` close of `#features-science` and the opening `<section class="how-it-works"`. Use the existing `glass-panel` styling pattern from the features section so it visually matches.

---

### 4.6 How-It-Works carousel (`#how-it-works`)

**Section title:**

| Selector | Current | New |
|---|---|---|
| `.section-title` (with inline logo image) | `[logo] in action` | **See [logo] in action** |

Adding "See" makes it a verb-led prompt rather than a label.

**Carousel step copy** (`howSteps` array, `js/main.js` lines 131-137):

The current sequence is purely pain-led. To support the dual track, **rewrite it so the *story* works for both audiences** — the same flow describes pain assessment AND active assessment, depending on what the user picked.

```js
const howSteps = [
  { screen: 'images/Screen1_HR.jpg',
    title: 'Tell us what you want to fix',
    subtitle: 'Pain, stiffness, or a movement you can\'t do' },
  { screen: 'images/Screen2_HR.jpg',
    title: 'Show us where',
    subtitle: 'Tap your body to mark the spot' },
  { screen: 'images/Screen3_HR.jpg',
    title: 'A 5-minute mobility check',
    subtitle: 'We see what\'s tight, weak, or compensating' },
  { screen: 'images/Screen4_HR.jpg',
    title: 'Your plan, your pace',
    subtitle: '10-15 min a day, built around your body' },
  { screen: 'images/Screen5_HR.jpg',
    title: 'Move better, every day',
    subtitle: 'Guided routines that adapt as you progress' }
];
```

**Why:** removes the words "Pain Dynamic analysis" (which testers won't parse), keeps emojis-free copy (the existing 🩺 and 📋 read as cute on first glance but slightly clinical/diary-app on a second glance — your call, but I'd cut them).

---

### 4.7 NEW SECTION (insert before FAQ) — "What you get"

The page sells features and shows screenshots, but never lists *what's actually in the box.* Add a short, scannable "what you get" block. Pulls double duty as SEO content.

> **What's in the app**

- **A daily plan, built for you.** 10-15 minutes, adapted as your body changes.
- **Physiotherapist-designed routines.** Not playlists. Not generic stretches. Real clinical content, made consumer-friendly.
- **Pain mapping & tracking.** Tap where it hurts, see what improves, share the record with your physio.
- **On-demand chat with real physios.** When the AI plan isn't enough, a human is one tap away. *(Premium)*
- **Mobility scores you can actually understand.** Plain-English measurements. Not joint angle data dumps.
- **Bodyweight-first. Equipment-friendly.** Most routines need nothing but you and the floor. If you already own a band, a ball, or a foam roller, the app will use them to accelerate your gains — but you'll never need to buy anything to get started. *(Moovv is an app — we don't ship hardware.)*

**Why add this:** it gives you a sticky chunk of keyword-rich, scannable content that Google loves *and* answers the most common visitor question — *"OK so what do I actually get?"*

---

### 4.8 NEW SECTION (insert before FAQ) — "Why mobility matters now"

This is where the *forward-bend / deadlift* insight lives. It's your most counter-intuitive insight and right now it lives in your head, not on the page.

> **Why mobility matters more than you think**
>
> If you can't touch your toes, your deadlift is leaving power on the floor.
> If your shoulder won't go overhead, your tennis serve is bleeding speed.
> If your hip is stuck, your knee is taking the hit.
>
> **Mobility isn't a "nice to have."** It's the foundation under every movement you make — at the desk, in the gym, on a run, in your own kitchen at 70. The body doesn't have separate "pain" and "performance" systems. There's one system. Moovv works on that system.

This block is ~70 words, sits beautifully as a quote-style section, and is the most *shareable* piece of copy on the page. (Pull-quote styling, large type, single line breaks for rhythm. Visual ask in §7.)

---

### 4.9 FAQ (`#faq`)

The current 7 FAQs are mostly good. Light edits + reorder for impact:

| # | Current question | New question | Notes on answer |
|---|---|---|---|
| 1 | How is this different from watching YouTube exercises? | (keep) | **Tighten the answer** — current is too long. Suggested: *"YouTube is generic; moovv.fit is personal. Your plan adapts daily based on what your body can do today, not a video someone else recorded last year. You also get a record your physiotherapist can read."* |
| 2 | Is it safe if I have a chronic injury or limited mobility? | (keep) | (keep answer) |
| 3 | Do I need any equipment? | (keep) | **Tighten the answer to make ownership unambiguous:** *"No purchase required. Most routines work with bodyweight alone. If you already have a stretch band, a small ball, or a foam roller at home, the app will weave them in for faster results — but Moovv is an app, not a kit. Nothing ships."* |
| 4 | How are exercises for me decided? | **How does Moovv decide what's right for me?** | Friendlier phrasing. (keep answer, swap "It starts" → "It starts with a 5-minute mobility check.") |
| 5 | How much time does this take daily? | (keep) | (keep answer) |
| 6 | Is my health data private? | (keep) | (keep answer) |
| 7 | Can I talk to a real physical therapist? | **Can I actually talk to a physiotherapist?** | "Actually" carries the warmth. Use "physiotherapist" not "physical therapist" for India parity. |
| **NEW 8** | — | **I'm not in pain — is this still for me?** | *"Yes — and it might be the best time to start. Mobility work today is the cheapest insurance against pain tomorrow. The same plan that fixes a stiff lower back also unlocks a deeper squat and a longer stride."* This single FAQ tells the active-improver the page is for them. |
| **NEW 9** | — | **What's it going to cost?** | *"The waitlist is free. We'll share early-access pricing before launch. The core daily plan will always have a free tier; physio chat will be a premium add-on."* — only add if pricing direction is fixed. **Flag for Pawan: confirm before publishing.** |

**FAQ ordering recommendation:** put the *new* "I'm not in pain" question at #2 (right after the YouTube one). Active improvers leave the page within the first scroll if they don't see themselves; this question rescues them.

---

### 4.10 CTA Section (`#cta`)

| Selector | Current | New |
|---|---|---|
| `.cta-content h2` | Be among the first to try<br>your personal mobility coach. | **Be among the first to move better with Moovv.** (one line) |
| `.cta-form input` placeholder | enter email | **your email** |
| `.cta-form button` | get early free access | **claim my early access** |
| `.btn-secondary` | watch demo ▶ | **see a 60-second tour ▶** *(but only if the video exists — see §7)* |
| `.benefits-title` | Early members get: | **Early members get:** (keep) |
| `.benefits-grid .benefit:nth-child(1) span` | Priority early-access invites | **First-in-line app access** |
| `.benefits-grid .benefit:nth-child(2) span` | Personalized onboarding | **A 1:1 onboarding call with our team** |
| `.benefits-grid .benefit:nth-child(3) span` | A voice in shaping future features | **Direct line to influence the roadmap** |

---

### 4.11 Footer

| Selector | Current | New |
|---|---|---|
| `.footer-tagline` | Your journey to better mobility starts with understanding. | **Mobility, made personal. Built with physiotherapists. Made for every body.** |

Add a `<p>` line below the tagline: **"Made in [city], for the world."** — or whatever's true. Adds humanity that's missing.

Add to footer (new column or row):
- **Contact:** `hello@moovv.fit`
- **For physios:** link to physio.moovv.fit
- **Press:** `press@moovv.fit` (if applicable)

---

## 5. Form-state microcopy (`js/main.js`, lines 287-344)

These are tiny, but they're the moments the user is most engaged. Sharpen them:

| State | Current | New |
|---|---|---|
| Joining | `Joining...` | `Saving your spot…` |
| Success | `You are on the list! ✓` | `You're in. Watch your inbox. ✓` |
| Error | `Error - Try again` | `Hmm, try once more?` |

**Edge case to handle (currently doesn't):** add a check for "already signed up" emails returned by Formspree — display: **`Looks like you're already on the list. We've got you. ✓`** so repeat submitters don't get a generic confirmation that feels like the form failed silently.

---

## 6. SEO recommendations (dual-market: India + US/Global)

### 6.1 Target keywords (primary cluster)

Group these and weave them into H2s, body copy, alt text, and FAQs:

**Pain track:**
- back pain exercises app
- neck pain relief app
- knee mobility exercises
- sciatica exercises app
- frozen shoulder exercises
- desk job back pain
- chronic pain mobility
- physiotherapy app *(India term)*
- physical therapy app *(US term)* — use *both* across the page, not just one

**Active track:**
- mobility app
- stretching app
- mobility for athletes
- mobility for lifters
- mobility for runners
- range of motion exercises
- yoga mobility app
- daily mobility routine

**Brand & competitor:**
- Bend app alternative
- Hinge Health alternative
- AI physiotherapy app
- online physiotherapy India
- best mobility app 2026

### 6.2 H2 structure (current page is missing a clean heading hierarchy)

Currently the H2s are: *"Expert-Led Recovery…"*, *"[Logo] in action"*, *"Frequently Asked Questions"*, *"Be among the first…"*. None of those are searched.

Recommended H2s after the rewrite:
- `<h2>` Built around your body — not the average one.  *(features)*
- `<h2>` Built for every body that needs to move better. *(new persona section — §4.5)*
- `<h2>` See Moovv in action *(carousel)*
- `<h2>` What's in the app *(new — §4.7)*
- `<h2>` Why mobility matters more than you think *(new — §4.8)*
- `<h2>` Frequently asked questions
- `<h2>` Be among the first to move better with Moovv

This gives Google a clear topical map: *body → personas → product → category education → objection handling → CTA.*

### 6.3 Alt text — replace every alt across `index.html`

| Image | New alt |
|---|---|
| `images/Logo.svg` (nav) | "moovv.fit logo" |
| `images/Features_Runner.jpg` | "Runner with skeletal mobility overlay — Moovv mobility analysis" |
| `images/Footer_Phone_2x.png` | "Moovv mobility app on iPhone" |
| `images/Screen1_HR.jpg` … `Screen5_HR.jpg` | Use the carousel `title` strings as alts (much better than current generic alts) |

### 6.4 Schema markup (add to `<head>`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Moovv",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "iOS, Android",
  "description": "Personalized mobility platform with AI-built daily plans and access to qualified physiotherapists. Heal pain, prevent injury, move better.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://moovv.fit",
  "publisher": { "@type": "Organization", "name": "Moovv" }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How is Moovv different from YouTube exercises?",
      "acceptedAnswer": { "@type": "Answer", "text": "YouTube is generic; Moovv is personal. Your plan adapts daily based on what your body can do today, not a video someone else recorded last year." }
    }
    // ...one entry per FAQ. Auto-generate from the FAQ HTML.
  ]
}
</script>
```

The FAQ schema is **the highest-leverage SEO win on this list** — it earns rich snippets in search results that double click-through rates for content sites.

### 6.5 Performance + Core Web Vitals

Not copy, but flagging because Google now ranks on this:
- The hero `video` (`videos/hero-bg.mp4`) is loaded eagerly. Add `preload="metadata"` and a `poster` to keep LCP fast.
- The Lottie player loads from `unpkg.com` (line 28). Self-host the script — unpkg adds 100-300ms of TLS handshake on the critical path.
- Defer PostHog (`<script>` block, line 31) — it doesn't need to block first paint.

(These are flagged for the engineering pass, not the copy pass.)

---

## 7. Assets — status, rename map, and where each one wires in

### 7.1 Status of every asset asked for

| # | Asset | Status | File in `images/` (current) | Rename to (final) | Wires into |
|---|---|---|---|---|---|
| 1 | Desk worker persona | ✅ Received | `Desk worker persona.png` | `persona-desk-worker.jpg` | §4.5 Card 1 |
| 2 | Active improver persona | ✅ Received | `Active improver persona.png` | `persona-active-improver.jpg` | §4.5 Card 2 |
| 3 | Older adult persona | ✅ Received | `Older adult persona.png` | `persona-older-adult.jpg` | §4.5 Card 3 |
| 4 | Forward-bend ↔ deadlift insight | ✅ Received | `Forward-bend_Dead-lift.png` | `insight-mobility-chain.png` | §4.8 |
| 5 | OG / social share image | ✅ Received (with one caveat — see §7.3) | `social share image.png` | `og-image.png` *(overwrites the existing meta reference — no HTML change needed)* | `<meta property="og:image">` |
| 6 | Hero lifestyle visual | ✅ Received | `Hero lifestyle visual.png` | `hero-lifestyle.jpg` | Hero (replaces or complements the GIF carousel) |
| 7 | Mobility map visualization | ✅ Received (use sparingly — see §7.3) | `mobility-map visualization.png` | `mobility-map.png` | §4.4 inset (do NOT anchor a section with it) |
| 8 | Equipment flat lay | ❌ **Drop from page** — see §15 (no-equipment rule) | `Equipment flat lay.png` | (archive — do not deploy) | — |
| 9 | 60-sec product tour video | ⏳ Deferred | — | — | §4.10 (CTA "watch demo" button) — *until video lands, change button to a copy-only state or hide it* |
| 10 | Named physiotherapist quote + headshot | ⏳ Deferred (no partner yet) | — | — | §8 (trust strip) — *until partner is named, soften copy from "designed with physiotherapists from \[clinic\]" to "designed with practicing physiotherapists" so we're not making a claim we can't substantiate* |
| 11 | App store badges | ⏳ Post-launch | — | — | §10 |
| 12 | Hero person+phone loop video | ⏳ Optional, post-MVP | — | — | Hero (replaces lifestyle still with a loop) |

### 7.2 Filename hygiene — why this matters and what to do

The current filenames have **spaces and inconsistent casing.** Spaces in URLs need percent-encoding (`Desk%20worker%20persona.png`), which works in HTML but breaks: CDN caching keys, social-share scrapers, image CDN transforms (Cloudflare Images, ImageKit), and shell scripts. Also, mixed case (`Desk worker` vs `Forward-bend_Dead-lift`) makes the codebase feel sloppy.

**Rule:** lowercase, hyphenated, descriptive prefix (e.g. `persona-`, `hero-`, `og-`, `insight-`). Do this rename **once, now**, before any HTML wires up. Bash command for the AI executor:

```bash
cd images
mv "Desk worker persona.png"           persona-desk-worker.jpg
mv "Active improver persona.png"       persona-active-improver.jpg
mv "Older adult persona.png"           persona-older-adult.jpg
mv "Forward-bend_Dead-lift.png"        insight-mobility-chain.png
mv "social share image.png"            og-image.png   # overwrites old og-image
mv "Hero lifestyle visual.png"         hero-lifestyle.jpg
mv "mobility-map visualization.png"    mobility-map.png
mv "Equipment flat lay.png"            ../_archive/equipment-flat-lay.png   # off the deploy path
```

> **Format note:** persona shots and hero lifestyle should be **JPG at 80–85 quality** — they're photographic and PNG is 3-5× larger for no perceptible quality gain. The two illustrations (`insight-mobility-chain`, `mobility-map`) stay PNG so we keep the sharp edges. Do the conversion at rename time:
> ```bash
> # macOS / ImageMagick
> magick "Desk worker persona.png" -quality 85 persona-desk-worker.jpg
> # …repeat per persona/hero file
> ```

### 7.3 Image-by-image quality verdict + iteration calls

| # | File | Verdict | Notes |
|---|---|---|---|
| 1 | `persona-desk-worker` | **Ship** | Hits brief. Tension at neck reads instantly. Negative space camera-right perfect for a glass panel overlay. |
| 2 | `persona-active-improver` | **Ship** | Athletic body without bodybuilder polish. Cossack squat reads clearly. Negative space camera-right. |
| 3 | `persona-older-adult` | **Ship** | Dignified, capable, real apartment. The small object in her hand reads as a phone, not a yoga block — which is actually *better* for the dual-track positioning ("she's living, not exercising"). |
| 4 | `insight-mobility-chain` | **Ship** | Posterior chain glow is instantly readable. Both figures share the same body shape (good — same person, two moves). Minor: the barbell isn't quite touching the ground in the deadlift figure; a powerlifter would notice but no one else will. |
| 5 | `og-image` | **Ship with caveat** | Headline + subline + wordmark all rendered correctly (rare DALL-E win). **But:** the phone-screen mockup has hallucinated text — *"Tonight Flows · Hibs & Lower limb"* with garbled control labels below. At social-preview size (≤600px wide on most platforms), this won't be readable, so it's a *minor* ship-blocker. **Acceptable for now;** before a press push or campaign launch, regenerate the phone screen with: *"phone screen shows only a glowing electric-blue mobility silhouette, no text labels, abstract UI elements only"* — or composite a real Figma mockup of the app over the phone. |
| 6 | `hero-lifestyle` | **Ship — strongest image in the batch** | Same warm-but-low-key palette as the persona trio. Phone screen glow reads as "app in use" without any hallucinated UI. Foam roller and small weight visible in frame — *which is fine* because they're in *her* home, not a Moovv-branded kit (this is consistent with the no-equipment positioning in §15). |
| 7 | `mobility-map` | **Use sparingly — do NOT anchor a section** | Reads more like a chakra meditation graphic than a mobility heatmap. Joint dots are evenly distributed (real mobility maps would weight the spine, hips, shoulders). Use as a small inset inside one of the §4.4 feature panels, not as a hero or section anchor. The existing `Features_Runner.jpg` is a stronger anchor for the Features section. **If regenerating later:** specify *"asymmetric joint highlighting — 3-4 amber 'restricted' nodes clustered around hips, lumbar spine, and one shoulder; rest in subtle blue or unlit"* to make it look like a real assessment, not a toy. |
| 8 | `equipment-flat-lay` | **Do not deploy** | Beautiful image, but per the no-equipment positioning (§15) it would mislead visitors into thinking Moovv ships hardware. Archive for blog use only. |

### 7.4 Persona trio — the "do they sit together" check

The three persona shots **already pass the consistency test** without any post-processing: same low-key dark palette, same soft directional light, same negative-space discipline, same documentary-not-stock vibe. No Lightroom pass needed before launch. (If you later want to *push* consistency further, a single shared LUT — match shadows to `#0a0b10`, lift mids 5%, slight cool tint — would lock it in. But it ships fine as-is.)

### 7.5 Still deferred / outstanding

- **60-second product tour video** — the "watch demo ▶" button in the CTA (§4.10) has no destination yet. Until you have one, the brief's recommendation stands: either remove the button or change its label to a copy-only state (e.g., *"video tour coming soon"*). Don't ship a button that does nothing.
- **Named physiotherapist quote + headshot** — the trust strip in §8 is softened in the revised copy (see §7.1 row 10) until you have a partner to name.
- **App store badges** — wait for launch (§10).

---

## 8. Trust & credibility — the missing layer

Right now the page asserts "expert-backed" and "physiotherapist-designed" but shows no proof. Three additions, in order of effort vs. impact:

1. **(Lowest effort, highest impact)** Add a one-line trust strip below the hero: *"Designed with physiotherapists from [clinic / institution / country]."* — even if vague at first, it anchors credibility. Replace with logos/names as you formalize partnerships.
2. **(Medium effort)** Add a single named physiotherapist quote in the Features section — headshot, name, credential, one sentence. Format: *"In 12 years of clinical practice I've never had a tool that lets me extend care beyond the clinic. Moovv is that tool. — Dr. X, MPT."*
3. **(Higher effort)** A "Built with" section above the footer listing 3-5 physio partners with logos/photos. This becomes critical post-launch when reviewers ask "is this legit."

Also add: a **count of waitlist signups** ("**1,247 people are already on the list**") — only when you have a number worth showing, but very high-leverage social proof. Pull live from Formspree or hardcode + update weekly.

---

## 9. Quick wins vs. larger bets

| Effort | What to do | Expected impact |
|---|---|---|
| **15 min** | Replace H1 + subhead in hero (§4.3) + JS `subtitles` array | Highest single fix. Solves "I don't get what this is." |
| **15 min** | Update `<title>` and meta description (§4.1) | Improves OG share previews and search results immediately. |
| **30 min** | Update FAQ #1, #4, #7 + add new FAQ #8 (§4.9) | Rescues active-improver visitors who currently bounce. |
| **30 min** | Update features section title + 3 tile headlines (§4.4) | Removes the most jargon-heavy block on the page. |
| **30 min** | Update carousel step copy in `js/main.js` (§4.6) | Removes "Pain Dynamic analysis" + makes flow dual-track. |
| **1 hr** | Add JSON-LD schema (§6.4) | Rich snippets in Google = real CTR lift. |
| **2 hr** | Add the new "Who Moovv is for" section (§4.5) | Makes dual-track real on the page, not just in CTAs. |
| **2 hr** | Add the new "Why mobility matters" section (§4.8) | Highest-shareability copy on the page; SEO body content. |
| **2 hr** | Add the new "What's in the app" section (§4.7) | Answers the implicit "what do I actually get" question. |
| **Async, no time est.** | Source the asset asks in §7 (persona photos, demo video, founder/physio quote) | Foundational — copy will land much harder once visuals match. |

**Recommended sequence:** ship the *15-30 min* items today. Stage the new sections and asset asks across the next 2 weeks.

---

## 10. Post-launch state (when the app ships)

You said the page flips from "join the waitlist" to "download the app" when the app store goes live. Plan that switch now so the content is ready:

| Element | Pre-launch | Post-launch |
|---|---|---|
| Hero CTA | `claim my early access` (email form) | App Store + Google Play badges |
| Hero trust line | "Built with physiotherapists. No spam." | "Now live on iOS and Android. Free to start." |
| Eyebrow | "Your personal mobility coach" | "Now available — your personal mobility coach" |
| FAQ #9 (pricing) | "We'll share pricing before launch" | Real pricing tiers |
| Footer | (current) | Add: **Available on iOS** / **Android** / "4.X stars on the App Store" |
| Add new section | — | **Real reviews from real users** (3-5 short quotes from beta) |

Suggest adding a `data-app-state="prelaunch"` attribute to `<body>` and toggling it on launch day — flips the right blocks via CSS / JS without redeploying copy.

---

## 11. Things I'd kill or hide

The "figure-out" pass:

- **The "watch demo ▶" button in the CTA section.** It links to nothing. Either build the demo (§7 #2) or remove the button. A non-functional CTA is worse than no CTA.
- **The third hero subtitle** in the rotation — once the rewrites land, the *one* good subtitle is the right one. Constant rotation makes the page feel undecided. Pick one and let it sit.
- **The 🩺 and 📋 emojis** in the carousel titles. They felt right when the page was pain-only; once the carousel is dual-track they read slightly diary-app-cute. Your call.
- **`debug_images.html`** in the root. Make sure it's not deployed.
- **The `_gotcha` honeypot field** is fine, leave it. Just flagging that it's there.

---

## 12. Edge cases I'd build for

- **Slow connection / blocked video:** the hero `<video>` has no `poster` fallback. Add one so the layout doesn't shift while loading.
- **Reduced-motion preference:** the rotating subtitles + auto-playing carousel are disorienting for people with vestibular sensitivity. Wrap the rotators in `@media (prefers-reduced-motion: reduce) { animation: none; }` and pause on the first frame.
- **Screen readers:** the carousel has no live region. Add `aria-live="polite"` on the title/subtitle so the rotating text is announced.
- **Already-signed-up email:** see §5 — display a friendlier "you're already in" state.
- **Form validation:** add an inline "looks like that's not an email" check before the Formspree round-trip. Currently a bad email goes all the way to Formspree and back.
- **Internationalization:** "physiotherapist" reads correctly in India + UK + AU; "physical therapist" is US-default. We've used "physiotherapist" throughout — don't switch in some sections.
- **Currency / pricing:** when pricing is added, detect locale or show both ($ / ₹) explicitly.
- **App-store geographic gating:** at launch, if app isn't in a region yet, show "coming to your region soon — join the list" instead of a broken store badge.
- **Dark/light system preference:** the page is dark-mode-only. Fine for now, but flag for the design team — older audiences (a real persona for you) sometimes have hard preferences for light UI.
- **Brand-name search:** "Moovv" is a 4-letter, made-up word. Make sure the homepage `<title>` includes the literal string `moovv.fit` so brand-name searches resolve correctly.

---

## 13. The handoff prompt — paste this into another AI to execute

> You are a senior front-end engineer working on a single repository: the moovv.fit landing page. Read `BRAND_REFRESH_BRIEF.md` (this document) in full before making any changes.
>
> **Constraints:**
> 1. Do not change the site's visual design, layout, or CSS architecture. Only change copy, alt text, meta tags, and (where the brief explicitly asks) add new sections that reuse existing CSS classes (`.glass-panel`, `.container`, `.section-title`, etc.).
> 2. For new sections, copy the structural pattern of the closest existing section (e.g., the new "Who Moovv is for" section should reuse the `.glass-panel` styling from `#features-science`).
> 3. Update `js/main.js` only where the brief explicitly calls it out (subtitle array §4.3, `howSteps` array §4.6, form-state strings §5).
> 4. Standardize the brand name per §3.3: `moovv.fit` lowercase in body copy, `Moovv` capitalized in titles/OG/sentence-start. `MoovvFIT` is retired everywhere.
> 5. Add the JSON-LD blocks from §6.4. The FAQ schema must be auto-generated from the FAQ HTML — do not hand-write entries that drift from the visible copy.
> 6. Do not add any new dependencies. Plain HTML, plain JS.
> 7. After every section's edit, re-read the file you just changed to verify the diff matches the brief.
>
> **Verification step (mandatory):** after all edits, produce a checklist mapping each item in §4 (rows) → confirmed in the diff (Y/N). Report any rows you skipped or couldn't apply, with reason.
>
> **Out of scope for this pass:** assets in §7, video production, schema for the blog page, post-launch state in §10. Flag these in your final report but do not attempt them.

---

## 14. What to measure (so we know if this worked)

If you have PostHog wired (you do — saw it in `<head>`):

| Metric | Today's baseline (capture before changes) | Goal post-changes |
|---|---|---|
| Bounce rate, hero only | (unknown) | -15% |
| Hero scroll-past rate | (unknown) | +20% |
| Email submits / 100 visitors | (unknown) | +30% |
| Track-button clicks (`pain` vs `performance`) | n/a (new) | Establishes which audience converts. Drives next iteration. |
| FAQ engagement (any question opened) | (unknown) | +25% — proves new content lands |
| Time-to-first-form-interaction | (unknown) | -20% |

Set the baseline this week. Re-measure 2 weeks after the changes ship.

---

## 15. The no-equipment positioning rule

**Moovv is a software product. We do not ship, sell, bundle, or recommend specific hardware.** Every piece of copy, every image choice, and every CTA on the page must respect this rule.

### Why this matters
When a visitor sees a foam roller in a hero image *with no clarifying copy*, the default mental model is *"oh, this app comes with stuff."* That's a perception problem with three downstream costs:
1. Sticker-shock objection at signup ("how much is the kit?") that we never get to answer.
2. Refund expectations post-launch when no kit arrives.
3. Confusion in app reviews ("3 stars — never received my equipment").

### The rule, made concrete
- **Don't say** *"Moovv comes with…"*, *"Includes a starter kit…"*, *"All the gear you need…"*, or any phrasing that implies physical fulfillment.
- **Do say** *"Bodyweight-first. If you have a band/ball/roller, the app uses it."*, *"No purchase required."*, *"Moovv is an app — nothing ships."*
- **Do show** equipment **only** in lifestyle shots where it's clearly *the user's own gear in their own space* (the way `hero-lifestyle.jpg` does it — foam roller is *behind* the person on her own floor, not displayed product-style).
- **Don't show** product flat lays, packaging shots, "what's in the box" tiles, or any styled equipment composition that reads as commerce. (This is why `equipment-flat-lay.png` is archived in §7.1.)

### Edge cases to watch for
- **App-store screenshots** — when the app screens show recommended equipment for a specific exercise, copy on the surrounding screenshot frame should say *"Use what you have"* not *"Recommended gear."*
- **Onboarding flows** — when the in-app onboarding asks *"What equipment do you have access to?"*, the question framing must be inventory, not shopping list. Wrong: *"Tell us what to send you."* Right: *"Tick what you already own — we'll use it; skip what you don't."*
- **Affiliate temptation** — if Moovv ever signs equipment-affiliate revenue (Amazon links, partner kits), the rule above changes and this section needs a rewrite. Until that day, hold the line.
- **FAQ #3** has been tightened in §4.9 to make this explicit. Don't loosen it back.

### One-line internal mantra
> **"We don't ship things. We ship plans for the things you already have."**

---

## Appendix A — full new copy, in one place (for fast paste)

### Hero
- Eyebrow: `Your personal mobility coach`
- H1: `Mobility, made personal.`
- Subhead: `moovv.fit gives you a daily mobility plan — built by AI, backed by physiotherapists — so you can heal pain, prevent injury, and move better in everything you do.`
- Track button A: `I want to fix pain`
- Track button B: `I want to move better`
- Form placeholder: `your email — be the first to try Moovv`
- Form button: `claim my early access`
- Trust line: `Built with physiotherapists. No spam. Unsubscribe any time.`

### Features
- Title: `Built around your body — not the average one.`
- Tile 1: `It starts by understanding your body` / `A short mobility check tells us where you're stiff, what's compensating, and what's actually causing the pain or limitation.`
- Tile 2: `Then we build a plan a physio would write for you` / `Your profile is matched against routines designed by qualified physiotherapists. No generic stretching playlists.`
- Tile 3: `And it adapts as you get better` / `The plan listens. As your range improves — or if a movement hurts — it adjusts. Every day, your body gets a better plan.`

### Who it's for (new)
- Title: `Built for every body that needs to move better.`
- Card 1: `For pain that's stuck around` / `Chronic neck, back, or knee pain from your desk, your sport, or just from life. We help you understand it, move with it, and slowly move past it.`
- Card 2: `For the body you train` / `The forward bend you can't do is the deadlift you're losing power on. Better mobility = better lifts, longer runs, deeper yoga.`
- Card 3: `For the years ahead of you` / `Mobility is the single biggest predictor of independence as you age. Whether you're 30 or 70, today is the cheapest day to start.`

### Carousel section
- Title: `See Moovv in action`
- Step 1: `Tell us what you want to fix` / `Pain, stiffness, or a movement you can't do`
- Step 2: `Show us where` / `Tap your body to mark the spot`
- Step 3: `A 5-minute mobility check` / `We see what's tight, weak, or compensating`
- Step 4: `Your plan, your pace` / `10-15 min a day, built around your body`
- Step 5: `Move better, every day` / `Guided routines that adapt as you progress`

### What you get (new)
- Title: `What's in the app`
- (bullets in §4.7)

### Why mobility matters (new)
- Title: `Why mobility matters more than you think`
- (body in §4.8)

### FAQ
- New #2 question: `I'm not in pain — is this still for me?`
- (others updated per §4.9)

### CTA
- H2: `Be among the first to move better with Moovv.`
- Form placeholder: `your email`
- Form button: `claim my early access`
- Demo button: `see a 60-second tour ▶` *(only if video exists)*
- Benefit 1: `First-in-line app access`
- Benefit 2: `A 1:1 onboarding call with our team`
- Benefit 3: `Direct line to influence the roadmap`

### Footer
- Tagline: `Mobility, made personal. Built with physiotherapists. Made for every body.`

### Form states
- Joining: `Saving your spot…`
- Success: `You're in. Watch your inbox. ✓`
- Already-signed-up: `Looks like you're already on the list. We've got you. ✓`
- Error: `Hmm, try once more?`

---

*End of brief. Questions, pushback, or asset answers go to the next round.*
