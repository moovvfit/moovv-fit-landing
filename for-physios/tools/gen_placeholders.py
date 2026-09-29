#!/usr/bin/env python3
"""Generate on-brand placeholder PNGs at exact target dimensions."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

REPO = Path("/Users/pawandeshmukh/Documents/GitHub/antigravity/moovvfit-physio-landing")
OUT = REPO / "images" / "placeholders"
OUT.mkdir(parents=True, exist_ok=True)
FONT_BOLD = str(REPO / "fonts" / "Lufga-SemiBold.ttf")
FONT_REG = str(REPO / "fonts" / "Lufga-Regular.ttf")

BG = (12, 14, 26)
BORDER = (64, 105, 255)
TITLE = (255, 255, 255)
SUB = (150, 160, 190)
DIM = (64, 105, 255)

SPECS = [
    ("hero-poster.png", 1600, 900, "HERO VIDEO POSTER", "Shown before the demo video plays"),
    ("telehealth-session.png", 840, 1050, "TELEHEALTH SESSION", "“Grow your practice” section"),
    ("step-1-add-patient.png", 1200, 900, "STEP 1 · ADD PATIENT", "How it works — portal screenshot"),
    ("step-2-prescribe.png", 1200, 900, "STEP 2 · PRESCRIPTION BUILDER", "How it works — portal screenshot"),
    ("step-3-patient-app.png", 1200, 900, "STEP 3 · PATIENT APP", "How it works — mobile screenshot"),
    ("step-4-insights.png", 1200, 900, "STEP 4 · AI INSIGHTS", "How it works — portal screenshot"),
    ("org-dashboard.png", 1600, 1000, "ORG DASHBOARD", "“For clinics & chains” section"),
    ("og-image.png", 1200, 630, "SOCIAL SHARE IMAGE", "Open Graph / Twitter card"),
]


def gcd(a, b):
    while b:
        a, b = b, a % b
    return a


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def centered(draw, y, text, f, fill, w):
    bbox = draw.textbbox((0, 0), text, font=f)
    draw.text(((w - (bbox[2] - bbox[0])) / 2 - bbox[0], y), text, font=f, fill=fill)
    return bbox[3] - bbox[1]


for name, w, h, title, sub in SPECS:
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)

    # subtle grid
    step = max(w, h) // 24
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=(22, 26, 44), width=1)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=(22, 26, 44), width=1)

    # dashed border
    inset, dash, gap, tw = 16, 28, 18, 4
    for x in range(inset, w - inset, dash + gap):
        x2 = min(x + dash, w - inset)
        d.rectangle([x, inset, x2, inset + tw], fill=BORDER)
        d.rectangle([x, h - inset - tw, x2, h - inset], fill=BORDER)
    for y in range(inset, h - inset, dash + gap):
        y2 = min(y + dash, h - inset)
        d.rectangle([inset, y, inset + tw, y2], fill=BORDER)
        d.rectangle([w - inset - tw, y, w - inset, y2], fill=BORDER)

    # corner ticks
    L = min(w, h) // 12
    for (cx, cy, dx, dy) in ((inset, inset, 1, 1), (w - inset, inset, -1, 1),
                             (inset, h - inset, 1, -1), (w - inset, h - inset, -1, -1)):
        d.line([(cx, cy), (cx + dx * L, cy)], fill=BORDER, width=6)
        d.line([(cx, cy), (cx, cy + dy * L)], fill=BORDER, width=6)

    base = min(w, h)
    f_title = font(FONT_BOLD, max(22, base // 16))
    f_dim = font(FONT_BOLD, max(30, base // 11))
    f_sub = font(FONT_REG, max(16, base // 30))

    g = gcd(w, h)
    ratio = f"{w // g}:{h // g}"

    block_y = h // 2 - base // 7
    block_y += centered(d, block_y, title, f_title, TITLE, w) + base // 22
    block_y += centered(d, block_y, f"{w} × {h}", f_dim, DIM, w) + base // 30
    block_y += centered(d, block_y, f"aspect ratio {ratio}", f_sub, SUB, w) + base // 40
    centered(d, block_y, sub, f_sub, SUB, w)

    img.save(OUT / name, optimize=True)
    print(f"{name:28} {w}x{h}  ratio {ratio}")
