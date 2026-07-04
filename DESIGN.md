---
name: Heritage Classic
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#44474c'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#525f74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0f1c2e'
  on-primary-container: '#78849b'
  inverse-primary: '#bac7df'
  secondary: '#a13c3f'
  on-secondary: '#ffffff'
  secondary-container: '#ff8484'
  on-secondary-container: '#751c22'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271900'
  on-tertiary-container: '#a47e33'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fc'
  primary-fixed-dim: '#bac7df'
  on-primary-fixed: '#0f1c2e'
  on-primary-fixed-variant: '#3b475b'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b1'
  on-secondary-fixed: '#410007'
  on-secondary-fixed-variant: '#82252a'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#edc06e'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
---

## Brand & Style

This design system embodies the concept of "Timeless Authority." It is tailored for high-end historic properties and legacy institutions where trust and heritage are the primary value propositions. The aesthetic is rooted in **Traditional Elegance**, blending classical editorial layouts with a modern digital precision.

The target audience consists of discerning individuals who value craftsmanship, history, and exclusivity. The UI must feel established and prestigious—evoking the atmosphere of a private library or a historic manor. We achieve this through a "Digital Conservatism" style: high-quality serif typography, generous margins reminiscent of fine-press books, and a restrained but rich color palette. Visuals should be calm, stable, and deeply grounded.

## Colors

The palette is anchored in depth and material richness. 

- **Primary (Deep Navy):** Used for primary backgrounds, navigation bars, and authoritative text. It represents stability and wisdom.
- **Secondary (Oxblood Burgundy):** Used for secondary accents, active states, and interactive elements that require a sense of warmth and heritage.
- **Tertiary (Antique Gold):** Reserved for decorative flourishes, icons, and premium "High-Touch" calls to action. It should be used sparingly to maintain its prestige.
- **Neutral (Parchment):** The foundation of the UI. Instead of pure white, we use a warm, textured off-white to reduce ocular strain and reinforce the "historical document" feel.
- **Success/Error:** Use muted, forest greens and deep brick reds to ensure they do not clash with the primary brand tones.

## Typography

The typography strategy is "Editorial Excellence." 

We utilize **Libre Caslon Text** for headlines to evoke a sense of history and literary tradition. Its high-contrast strokes and classical proportions provide the necessary "prestige" for display settings. For body copy, **Source Serif 4** provides exceptional legibility and a professional, book-like reading experience.

To prevent the design from feeling dated, **Work Sans** is introduced for functional labels, buttons, and micro-copy. These sans-serif elements should almost always be set in uppercase with increased letter spacing to act as a clean, modern counterpoint to the decorative serifs.

## Layout & Spacing

This design system utilizes a **Fixed Grid** philosophy on desktop to ensure a curated, "framed" feel. 

- **Desktop:** A 12-column grid with wide 32px gutters. The generous margins (64px+) ensure that content never feels crowded, mimicking the white space of a luxury magazine.
- **Mobile:** A 4-column fluid grid. Margins are reduced to 24px, but vertical spacing (padding) remains high to maintain the airy, premium feel.
- **Rhythm:** All vertical spacing should follow an 8px base unit. Use larger "hero" gaps (80px, 120px) between major sections to allow the heritage photography to breathe.

## Elevation & Depth

We eschew modern drop shadows in favor of **Tonal Layering** and **Fine Outlines**. 

Depth is achieved through the stacking of surfaces: a Parchment base (`#F9F7F2`) might sit beneath a Navy container (`#0F1C2E`). To define elements, use 1px "Hairline" borders in Antique Gold or a slightly darker shade of the background color. 

If shadows are absolutely necessary for functional overlays (like modals), use a "Pressed Silk" effect: a very wide, extremely low-opacity (5-8%) shadow with a hint of the Navy primary color to keep the darkness grounded in the palette rather than a neutral grey.

## Shapes

The shape language is **Strict & Architectural**. 

We use sharp corners (0px) for almost all UI elements—buttons, input fields, cards, and images. This reinforces the feeling of stability and structural integrity associated with historic stone architecture. Occasional exceptions can be made for small circular elements (like profile avatars), but structural components must remain rectangular and crisp.

## Components

- **Buttons:** Primary buttons are solid Navy with Gold or Parchment text. They feature a 1px Gold border. Hover states should involve a subtle shift to Burgundy. Use uppercase Work Sans for button labels.
- **Inputs:** Fields are defined by a bottom-border only (1px Navy) to mimic traditional stationery, or a full thin border. Backgrounds should remain transparent or a slightly darker parchment shade.
- **Cards:** Cards should not use shadows. Instead, use a "Frame" approach with a 1px Gold or Navy border. For high-prestige content, use a double-border effect.
- **Chips/Tags:** Small, rectangular containers with a 1px border. No background fill, or a very light tint of the primary color.
- **Lists:** Use elegant "Separator" lines (1px width, 20% opacity Navy) between items. Leading icons should be Antique Gold.
- **Decorative Elements:** Include "Ornaments"—thin horizontal lines with a small centered diamond or gold flourish—to separate major editorial sections.