# VerspeKtive Tech Services Page — Build Spec

Status: draft for implementation. The 3D hero object (Section 5) is **not finalized** — concept only, pending final art direction before build.

---

## 1. Purpose

A dedicated page under the VerspeKtive umbrella that markets **tech services (websites, apps, backend/booking systems)** to two distinct client audiences:

- **Businesses** — want reliability, ROI, credibility, ongoing support
- **Personal brands** — want distinctiveness, taste, individuality

Positioning: this is the tech arm of the same team that built theverspektive.com — not a generic freelance portfolio. The flagship case study (VerspeKtive itself) should carry the credibility weight.

Success criteria: a visitor in either audience can, within one scroll, understand what's offered for them specifically, see proof it's been done well, and reach a contact action.

---

## 2. Non-goals (explicit constraints for the build)

These exist to keep the build off well-worn templates:

- No bento grid layout (reads as AI-generated/templated)
- No rigged humanoid 3D character with a face, clothing, or desk/prop scene
- No cartoon facial features on any 3D object beyond a possible minimal, abstract eye treatment on one state only (see Section 5 — unconfirmed)
- No generic "3D developer portfolio" tropes (free-roam camera, item-pickup interactions, desk scene)

---

## 3. Visual system (inherited from theverspektive.com — do not invent new tokens)

**Theme**: Apple-inspired monochrome, stark contrast, subtle micro-animation.

- Backgrounds/surfaces: `#000000`, `#ffffff`, `#1d1d1f`, `#f5f5f7`
- Accent: `#0071e3` (light mode), `#2997ff` (dark mode)
- Display type: `Outfit` (large/impactful headings)
- Body type: `Inter`
- Glassmorphism on nav/overlays: `saturate(180%) blur(20px)`
- Motion: Framer Motion (scroll reveals, mask-text), GSAP (scroll-driven sequences)
- Interaction pattern: "Learn more >" links with animating chevron on hover

Layout language: cinematic full-bleed sections, large editorial typography, asymmetry over grids. One strong statement per section rather than repeated card units.

---

## 4. Page structure

Seven sections, in order:

### 4.1 Hero
- 3D V-mark object (see Section 5), full-bleed
- One headline line — outcome-focused, not a job title (e.g. "We build the tech behind premium brands")
- Single CTA
- No supporting paragraph competing for attention

### 4.2 Audience split
- Two-path fork: **Businesses** / **Personal brands**
- Visitor selects a track (click/tap) or scrolls through both
- This section's state should ideally drive what's shown in 4.3 rather than duplicating the fork

### 4.3 Services, per track
- Businesses: website/app development, booking & e-commerce systems, backend/infrastructure, ongoing support
- Personal brands: portfolio/brand sites, content-driven pages, motion & interaction-led builds
- 3–4 short lines per track, not icon cards

### 4.4 Flagship case study — VerspeKtive
- Full-width scroll-through or screenshots of theverspektive.com
- Short writeup: real client, real stack (Next.js 14, D1, Razorpay, Cloudflare), and the security-hardening story (prior plaintext-credential incident → audit via Antigravity → phased remediation) as a rigor/trust signal
- This is the strongest proof asset available — give it the most visual weight after the hero

### 4.5 Process
- Four-step horizontal sequence: Discovery → Design → Build → Launch/Support
- Scroll-driven reveal (GSAP), consistent with the main site's animation language

### 4.6 Credibility signals
- Three short proof points: security practices, performance, stack quality
- Quieter than 4.4 — reassurance, not a second case study

### 4.7 Contact
- Single clear CTA ("Tell us what you're building")
- Form or booking link — no multi-field friction up front

---

## 5. 3D hero object — CONCEPT ONLY, NOT FINALIZED

This section is intentionally underspecified. Do not build against it as final. It needs one more art-direction pass (and ideally a look at VerspeKtive's actual V logomark, which hasn't been reviewed yet) before it's locked.

**Current direction**: modify VerspeKtive's own V logomark into a 3D volumetric object, rather than using a generic humanoid character (avoids the "common 3D portfolio template" look entirely, since no other site can use this exact mark).

- Rendered as two intersecting obsidian/glass-like strokes/blades, not a flat logo — a true 3D volume with light response
- Material: matte black / obsidian, thin rim-light in the brand blue (`#2997ff`) along inner edges
- Two states tied to the audience split:
  - **Businesses state**: one stroke solidifies into a clean architectural block (reads as structure/reliability)
  - **Personal brands state**: the other stroke fragments into looser, organic shards (reads as individuality/expression)
- Transition trigger: likely scroll-linked or hover/tap-linked to the Section 4.2 split — not yet decided
- Open question, unresolved: whether the personal-brands fragment state gets a minimal abstract "eyes" treatment (two glowing dot/slit lights, blink as a rare idle easter egg, no other facial features) — this pulls toward mascot territory and needs a decision before build, not left to the implementer
- Mobile/low-power fallback: not yet specified — needs a static or simplified fallback since full 3D scenes are expensive on phones

**Action needed before this section can be finalized**: review the actual V mark geometry, confirm eyes in/out, decide the transition trigger, define the mobile fallback.

---

## 6. Tech constraints

- Confirm whether this page lives inside the existing theverspektive.com Next.js app (reusing design tokens/components directly) or ships as a standalone build
- Stack to match/extend: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP, shadcn/ui
- 3D: React Three Fiber (Three.js) — standard choice for this kind of scene in a React/Next stack
- Hosting: Cloudflare Pages, consistent with the existing site

---

## 7. Acceptance criteria

- Responsive across mobile/tablet/desktop, including a defined 3D fallback on mobile
- Both audience tracks (4.2/4.3) are reachable and distinct
- Case study section (4.4) links out to or embeds real proof (not placeholder text)
- Contact action actually submits/connects somewhere live
- Load performance: 3D hero should not block or significantly delay first meaningful paint of the rest of the page