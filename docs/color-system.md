# Color System — OKLCH and the Brand Palette

## Why OKLCH

Traditional color systems (HEX, HSL, RGB) encode color in ways that do not match how humans
perceive it. A color at 50% HSL lightness looks very different depending on its hue — a yellow at
L=50 appears much lighter than a blue at L=50.

**OKLCH** (Oklab Lightness Chroma Hue) is perceptually uniform: a change of `+0.1` in the L
channel looks the same size to the human eye regardless of which hue you're working with. This
matters for:

- **Scale generation**: equal L steps produce a scale that *feels* even, not just *measures* even
- **Contrast calculation**: WCAG ratios computed from OKLCH-derived luminance are accurate
- **Cross-brand consistency**: every brand's scale follows the same perceptual rhythm

OKLCH is a native CSS color function, available in all modern browsers:

```css
oklch(0.62 0.18 240)
/* Lightness  Chroma  Hue */
/*   0–1      0–0.4   0–360° */
```

---

## The Three OKLCH Channels

### L — Lightness (0 to 1)

`0` = black, `1` = white. The platform maps this directly to scale steps:

| Step | Target L (light scale) |
|---|---|
| `50` | 0.98 |
| `100` | 0.95 |
| `200` | 0.90 |
| `300` | 0.82 |
| `400` | 0.72 |
| `500` | **exact seed** |
| `600` | 0.52 |
| `700` | 0.42 |
| `800` | 0.32 |
| `900` | 0.22 |
| `950` | 0.12 |

**What to aim for in a seed**:
- `L` between `0.50` and `0.70` — this positions your brand color near the middle of the scale
  where it has the most contrast range available in both directions
- Very high L (> 0.85): pastel/muted brands, limited contrast
- Very low L (< 0.35): dark/deep brands, limited legibility at step 500

### C — Chroma (color intensity, 0 to ~0.37)

`0` = neutral gray, higher = more colorful. The platform applies a **sinusoidal chroma envelope**
across the scale: the chroma at each step is `seedC × sin(targetL × π)`. This produces a scale
that is fully saturated at mid-tones and naturally desaturated at the light and dark extremes.

```
Chroma across the scale (seedC = 0.18):

Step 50  (L=0.98) →  C ≈ 0.011  (nearly gray — expected for backgrounds)
Step 300 (L=0.82) →  C ≈ 0.079  (soft, visible tint)
Step 500 (L=0.62) →  C = 0.180  (exact seed — maximum chroma)
Step 700 (L=0.42) →  C ≈ 0.114  (rich, dark)
Step 950 (L=0.12) →  C ≈ 0.023  (nearly gray — expected for dark backgrounds)
```

**What to aim for**:
- `C` between `0.10` and `0.25` for a vibrant, usable brand scale
- `C` below `0.08`: neutral/muted tones that may read as gray at extreme steps
- `C` above `0.30`: highly saturated (some gamut clamping to sRGB may apply)

### H — Hue angle (0 to 360°)

The hue is held constant across all steps. Common brand hue ranges:

| Range | Color family |
|---|---|
| 0–30 | Red → Orange-red |
| 30–60 | Orange → Yellow-orange |
| 60–90 | Yellow |
| 90–150 | Yellow-green → Green |
| 150–200 | Green → Cyan-green |
| 200–250 | Cyan → Blue |
| 250–290 | Blue → Violet-blue |
| 290–330 | Violet → Magenta |
| 330–360 | Magenta → Red |

---

## Light Scale vs Dark Scale

The platform generates two independent scales from the same seed.

**Light scale**: intended for white/light backgrounds. Step 500 = exact seed color.

**Dark scale**: adjusted for dark backgrounds. The target lightnesses shift slightly:

| Step | Light L | Dark L |
|---|---|---|
| `50` | 0.98 | 0.12 |
| `100` | 0.95 | 0.20 |
| `200` | 0.90 | 0.28 |
| `300` | 0.82 | 0.36 |
| `400` | 0.72 | 0.44 |
| `500` | **seed** | 0.54 |
| `600` | 0.52 | 0.64 |
| `700` | 0.42 | 0.74 |
| `800` | 0.32 | 0.84 |
| `900` | 0.22 | 0.92 |
| `950` | 0.12 | 0.97 |

The dark scale is essentially **inverted**: step `50` becomes the darkest, step `950` becomes the
near-white. Semantic tokens choose different step numbers for each mode — for example:

```
color.surface.default:
  light → step 50  (near white background)
  dark  → step 950 (deep dark background)

color.text.primary:
  light → step 900 (near black text)
  dark  → step 100 (near white text on dark)
```

This is why dark mode is not a CSS `filter: invert()`. The colors shift meaningfully — the dark
mode blue at step 500 is at a different lightness than the light mode blue at step 500.

---

## Gamut Clamping

OKLCH can describe colors that fall outside the sRGB gamut (colors a typical monitor cannot
display). When this happens, the platform clamps chroma using a binary search that finds the
highest C value at the target L/H that still sits within sRGB. The oklch string written to the
database is already clamped — you will never see an unclamped value in the CSS output.

Wide-gamut displays (P3, Rec2020) can show a wider range, but the platform currently targets sRGB
for maximum compatibility.

---

## Reading oklch() Values in Browser DevTools

Modern browser devtools display oklch values and let you edit them directly. In Chrome DevTools:

1. Open any page with a brand's `tokens.css` loaded
2. Go to **Elements → Styles → :root**
3. Click any `--palette-brand-*` value to open the color picker
4. The picker shows L/C/H sliders alongside a gamut visualization

You can experiment with different L/C/H values directly in DevTools to find an adjusted seed
before updating the brand via API.

---

## Choosing Seed Values for a Brand

### Starting point: pick H from your existing brand

If you have an existing hex color `#0057b8` (a blue), convert it to OKLCH using any modern
design tool (Figma 2024+, Oklch.com, or browser devtools) to get approximate L/C/H values.

### Sanity checks before registering a brand

1. **L between 0.45–0.70** — ensures your brand color lands in the middle of the scale
2. **C between 0.10–0.28** — enough chroma to be recognizably colored without gamut clipping
3. **Request the palette** after registration and scan step `500` — it should match your seed
4. **Check validation** — if WCAG AA fails, adjust the semantic token step references
   (not the seed itself)

### Example seeds

| Brand feel | L | C | H |
|---|---|---|---|
| Classic navy blue | 0.38 | 0.13 | 250 |
| Vibrant electric blue | 0.62 | 0.18 | 240 |
| Forest green | 0.45 | 0.16 | 145 |
| Warm coral | 0.60 | 0.20 | 25 |
| Neutral slate | 0.50 | 0.04 | 250 |
| Deep violet | 0.40 | 0.22 | 285 |
| Muted gold | 0.72 | 0.12 | 70 |
