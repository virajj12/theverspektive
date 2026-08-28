# G3 Builders & Architecture — Website Build Spec

**Read this entire document before writing any code.** This is a complete specification for a production website build — treat every numbered section as a hard requirement, not a suggestion, unless it's explicitly marked optional. Where something is ambiguous, prefer the interpretation that best serves the mobile-first, black-and-wood, lead-generation goals stated below over a generic default.

**Context you need:** this is a sub-brand of VerspeKtive, a multi-brand media/production company. G3 Builders shares VerspeKtive's proven stack and some component DNA (see section 2 and section 3's "reuse" list) but has its **own distinct visual identity** (black-and-wood, not VerspeKtive's flat monochrome) and its **own domain, own database, own admin** — this is a standalone site, not a sub-page of VerspeKtive.

**Build order:** work through sections in this order — (1) scaffold + design tokens (section 3) → (2) data model + admin/media layer (sections 5, 5a) → (3) pages using real (even if placeholder) data from the admin (section 4) → (4) animation layer on top of working pages (section 3a) → (5) mobile pass (section 6) → (6) performance/SEO pass (section 7). Do not build the animation layer against hardcoded/mock content — build it against the actual media/data pipeline from section 5a so it's exercised with real, swappable content from day one.

---

## 1. Project Brief

Build **G3 Builders & Architecture**, a premium portfolio and lead-generation website for an architecture/construction firm.

**Primary goals, in priority order:**
1. Showcase completed and in-progress projects in a way that feels like a design portfolio, not a brochure.
2. Convert visitors into consultation/inquiry leads.
3. Communicate credibility: process, team, materials, sustainability, past clients.
4. Feel exceptional on mobile — most traffic will be referral-driven phone browsing, so mobile is not an afterthought pass at the end; treat it as a first-class target throughout.

**Non-goals for v1:** e-commerce, multi-language support, multi-tenant/multi-office admin roles, native apps. Don't build for these — keep the system simple and shippable.

---

## 2. Tech Stack (match the parent VerspeKtive codebase)

- **Framework:** Next.js 14 (App Router), Edge Runtime
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (scroll reveals, page transitions) + GSAP (complex/pinned scroll sequences, e.g. project scroll-through)
- **UI primitives:** shadcn/ui
- **Icons:** Lucide React
- **Database:** Cloudflare D1 via Drizzle ORM
- **Storage:** Cloudflare R2 (project images/renders)
- **Email:** Resend (inquiry notifications, auto-replies)
- **Hosting:** Cloudflare Pages/Workers
- **Forms/validation:** Zod + React Hook Form

---

## 3. Visual Identity & Design System

**Theme: Black & Wood.** This departs from VerspeKtive's flat monochrome — the brand identity here is rich, tactile, materials-led. Black anchors the palette; warm wood grain is the signature texture that makes the site feel premium and hand-crafted rather than generic-corporate.

- **Backgrounds/Surfaces:**
  - Primary: near-black (`#0A0908` / `#121110`) — not pure `#000`, keep a hint of warmth so it sits well next to wood tones
  - Secondary surfaces: deep walnut/espresso wood tones (`#2B1D14`, `#3E2723`) used as section backgrounds and card fills, ideally rendered with an actual subtle wood-grain texture (high-res tileable grain image or SVG noise, low opacity, applied as a background-blend over the solid color — never a cheesy literal photo of planks)
  - Light surfaces (for contrast sections/forms): warm off-white (`#F5F1EA`) rather than pure white, to stay in the same warm family
- **Accent:** a burnished brass/gold (`#B8905B` or `#C9A66B`) for CTAs, active states, hover underlines, and small dividing rules — reads as "fine joinery hardware," not corporate blue
- **Texture treatment (the "rich" part):**
  - Apply a wood-grain texture as a `background-image` (tileable seamless grain, subtle — desaturate/darken it so text stays legible) on: hero background panels, section dividers, card backgrounds behind project metadata, footer
  - Use CSS `background-blend-mode: multiply` or `overlay` over the base dark color so the grain reads as texture, not a distracting photo
  - Add a very subtle grain/noise overlay (like film grain) site-wide at ~3–5% opacity for warmth and to stop flat dark sections looking dead in photos/screenshots
  - Material transitions: black panels bleed into wood panels on scroll (see animation section) rather than hard-cutting
- **Typography:**
  - Display headings: `Outfit` — large, impactful, used for hero statements and project titles, set in the warm off-white or brass accent against dark backgrounds
  - Body/UI: `Inter` — clean, readable, slightly warmed via a soft off-white rather than stark white for comfort on long dark-mode reading
  - Optional technical accent font (monospace, e.g. `JetBrains Mono`) for small labels like project metadata ("SQ FT — 4,200", "COMPLETED — 2025")
- **Motifs:**
  - Thin brass-colored hairline rules (not blueprint grid) as section dividers — echoes fine furniture inlay rather than technical drafting
  - Wood-grain-textured cards for project/service tiles, black cards for stats/quotes — alternate the two materials rhythmically down the page so it never feels monotone
- **Component patterns to reuse from VerspeKtive:**
  - Cinematic full-bleed hero with mask-text reveal headline
  - Bento grid for services/capabilities overview
  - Glassmorphism nav — but tinted warm-black (`rgba(10,9,8,0.7)`) with `saturate(180%) blur(20px)` rather than neutral gray
  - "Learn more →" links with animated chevron on hover, brass on hover
  - Smooth-scroll + scroll-triggered reveals via Framer Motion

---

## 3a. Scroll Animation System

**Important framing note:** the reference site analyzed below (a design-studio portfolio) is a *quality and technique benchmark* — not a template to clone. Do not replicate its section order, its specific "Studio" hero copy, its horizontal gallery-then-stacking-cards-then-tilted-carousel sequence, or its literal content structure. Instead, take the *mechanics and craft level* it demonstrates and apply them thoughtfully to G3 Builders' own site map (section 4) and its own content — a portfolio + services + process + testimonials flow for an architecture/construction firm, in the black-and-wood material language from section 3. Every animation below should exist because it serves a specific piece of G3 content, not because the reference site had one in that slot.

**Baseline interaction language (apply site-wide, from the reference's global patterns):**
- **Text entrance:** headings and paragraphs split into lines, each line starting at a small Y-offset with 0 opacity, easing in with a smooth, strong ease-out (`power3.out`/`power4.out` feel) — not a bouncy spring. This is the default for every new text block; don't reinvent it per-section.
- **Image entrance:** images slide up slightly while scaling down from a subtly enlarged state (e.g. `scale: 1.05 → 1`) as they enter the viewport — softer than a hard clip-path reveal, and it should read as one consistent "material settling into place" motion across the whole site given the wood/tactile theme.

**Signature moments — pick 4–5 of these (not all, and not necessarily these exact ones) and place them where G3's own content actually calls for them:**

- **Hero shrink-and-reveal:** the full-bleed hero image scales down slightly and gains border-radius as the user makes their first scroll, shrinking from full-screen into a floating rounded panel and revealing the wood-textured surface underneath — this is a strong candidate for G3's homepage hero, since it doubles as the "black → wood" material transition that's core to the brand. Use once, at the top of the homepage, so it stays a "wow" moment rather than a gimmick.
- **Scroll-aware nav pill:** nav starts as an expanded pill (logo/text + menu icon), collapses to a minimal circular icon-only button on scroll-down, and expands back on scroll-up. Good fit for G3 given the mobile-first priority — keeps the sticky CTA area uncluttered while still being one tap from anywhere.
- **Pinned horizontal project showcase:** pin the viewport and let vertical scroll drive horizontal movement through 3–5 flagship project images, with a large, much-slower-moving background wordmark or project name behind them for depth (parallax ratio, not equal speed). Natural fit for the Projects/featured-work section — use *G3's own* project names and imagery, not a placeholder studio name.
- **Stacking card deck:** cards pin near the top of the viewport as the next card scrolls up and overlaps it, each covering the previous almost completely, one viewport-height of scroll per card. Strong fit for the Process section (Concept → Design → Approvals → Construction → Handover) — each stage becomes a card that stacks onto the last, reinforcing "building on what came before."
- **Rotation-to-straighten carousel:** cards enter a horizontal pinned track slightly rotated (~5–10°) and animate to perfectly level as they reach viewport center, then rotate the opposite way as they exit — rotation bound to scroll-x position, not a separate timed animation. Works well for a services or testimonials strip where a bit of playful physicality suits the "handcrafted" wood theme.
- **Cascading tag/pill pop-in:** small pill-shaped elements (categories, material tags, service labels) scale up from ~0.8→1 and fade in with a noticeable stagger, slightly springy easing — good for category filters on the Projects page.
- **Infinite marquee footer:** a continuous horizontal scrolling line of text (contact info, social handles, or a tagline) in the footer, looping via `xPercent` translation — cheap, high-impact, and gives the black-and-wood footer some life.

**General rules:**
- Every pinned/scrubbed sequence should take roughly one full viewport height of scroll per "step" (per card, per image) so it feels deliberate on both mouse-wheel and touch scroll, not rushed.
- Parallax should stay subtle — background layers (wood texture, large type) moving at 0.4–0.6x foreground speed, never fighting for attention with content.
- No more than 2–3 pinned GSAP ScrollTrigger sequences per page. More than that gets janky on mid-range phones and undermines the "premium" feel it's going for.
- Respect `prefers-reduced-motion`: pinned/scrubbed sequences degrade to simple fade-ins, parallax and rotation effects are disabled entirely.
- On touch devices, anything that was a hover-only effect (image overlay label, chevron animation) needs a tap/always-visible equivalent — see mobile section for specifics.

---

## 4. Site Map & Pages

1. **Home**
   - Full-screen cinematic hero (rotating or video background of flagship project), headline + tagline, primary CTA ("Book a Consultation")
   - Featured projects strip (3–4 hero projects, large imagery)
   - Bento grid: services overview (Architecture, Interior Design, Construction, Renovation, Consultation)
   - Process teaser (condensed 4–5 step timeline) linking to full Process page
   - Stats/credibility bar (projects completed, years active, sq ft delivered, cities served)
   - Client testimonials carousel
   - Final CTA band

2. **Projects (Portfolio)**
   - Masonry/grid gallery, filterable by category: Residential / Commercial / Interiors / Concept
   - Each card: full-bleed image, project name, location, category tag — minimal, no clutter
   - Sort/filter persists in URL query params (shareable, SEO-friendly)

3. **Project Detail**
   - Full-bleed hero image or scroll-pinned image sequence (GSAP)
   - Metadata block: client, location, sq ft, year, scope, status
   - Narrative section: brief, challenge, approach
   - Image gallery (lightbox-enabled)
   - Optional before/after or render-vs-built slider
   - Next/previous project navigation

4. **Services**
   - Deep-dive per service (Architecture, Interior Design, Construction Management, Renovation)
   - Each with scope description, sample deliverables, relevant project links

5. **Process**
   - Full timeline: Concept → Design → Approvals → Construction → Handover
   - Each stage: what happens, typical duration, what the client provides/receives

6. **About**
   - Firm story, philosophy, team grid (photo, name, role, short bio)
   - Awards/press mentions if any

7. **Contact / Consultation**
   - Inquiry form (name, phone, email, project type, budget range, location, message) → stored in D1, emailed via Resend, auto-reply to user
   - Map/location, phone, WhatsApp link, office hours
   - Sticky mobile CTA bar (call + WhatsApp + form) — see mobile section below

8. **(Optional) Journal/Insights**
   - Light blog/CMS-driven articles on design trends, project spotlights — reuses the `pages` CMS pattern from VerspeKtive for dynamic hero/section content

---

## 5. Data Model (Drizzle/D1 — mirror VerspeKtive's pattern)

- **`projects`**: id, title, slug, category, location, sqft, year, status, clientName, coverImageId (FK → media), summary, body, featured (bool), sortOrder
- **`project_media`**: id, projectId (FK), mediaId (FK → media), sortOrder, caption — join table so a project can have an ordered gallery of many images/videos, and media can be reused/reordered without touching the project record
- **`media`**: id, type (image/video), r2Key, url, altText, width, height, durationSeconds (video only), thumbnailR2Key (video poster frame), uploadedAt, uploadedBy — the single source of truth for every uploaded asset, referenced by projects, services, team, testimonials, hero backgrounds
- **`services`**: id, title, slug, summary, body, iconOrMediaId (FK → media, nullable)
- **`team_members`**: id, name, role, bio, photoMediaId (FK → media)
- **`testimonials`**: id, clientName, projectId (FK), quote, rating
- **`inquiries`**: id, name, phone, email, projectType, budgetRange, location, message, createdAt, status (new/contacted/closed)
- **`pages`**: CMS-driven content for hero headlines/taglines per page, plus a `heroMediaId` (FK → media) so hero backgrounds are swappable too — same shape as VerspeKtive's `pages` table

Every place in the site that shows an image or video pulls from `media` by reference, never a hardcoded file path — that's what makes step 5a below possible.

---

## 5a. Content & Media Management (Admin)

The whole point of a portfolio/lead-gen site like this is that new project photos, renders, and site videos get added constantly — that cannot require a code change or redeploy every time. Build a lightweight authenticated admin area for this:

- **Auth:** reuse the existing custom auth pattern from VerspeKtive (bcryptjs + iron-session) — a single `admin` role is enough for v1, no need for granular permissions yet
- **`/admin` dashboard** with sections for:
  - **Media Library** — grid view of every uploaded image/video, upload new files (drag-and-drop, multi-file), see which project(s) each asset is used in, delete unused assets, edit alt text
  - **Projects** — create/edit/reorder projects; per-project gallery manager where the admin can upload new images/videos directly, reorder the gallery via drag-and-drop, set the cover image, add captions, mark a project "featured," and toggle status (draft/published)
  - **Services, Team, Testimonials** — same pattern: simple forms with a media picker (choose from library or upload new) wherever an image/video is needed
  - **Page Hero Media** — swap the hero image/video on Home, Projects, About, etc. without touching code
  - **Inquiries inbox** — view/manage submitted leads (status: new/contacted/closed)
- **Upload flow:** admin uploads a file in the browser → signed/direct upload to Cloudflare R2 (avoid routing large video files through the Worker itself) → on success, write the resulting R2 key/URL into the `media` table → asset is immediately available in every picker across the admin
- **Video handling specifics:**
  - Accept common formats (mp4/webm), transcode/compress on upload if feasible, or at minimum enforce a reasonable file-size ceiling with a clear error message
  - Auto-generate or let the admin upload a poster/thumbnail frame (used as the `<video>` poster and as a lightweight placeholder before the video loads — critical for the mobile performance goals in section 6)
  - Serve videos with lazy-loading (`preload="none"` or `"metadata"` outside the hero) so they don't tank mobile page weight
- **Image handling specifics:**
  - Run uploads through Next/Image-compatible optimization (resize/re-encode to WebP/AVIF variants on upload or on-the-fly)
  - Require alt text on upload (small form field) — feeds directly into the SEO goals in section 7
- **No-code guarantee:** after initial launch, adding a new project with a full photo/video gallery, reordering the portfolio, or swapping any hero image/video should be entirely doable by a non-technical person through `/admin` — zero deploys required.

---

## 6. Mobile Experience — Non-Negotiables

This is the priority surface. Requirements:

- **Single-column, thumb-first layout** everywhere — no desktop grid squeezed down, design mobile layouts independently
- **Sticky bottom CTA bar** on mobile (Call / WhatsApp / Inquiry) — always reachable, never covered by content
- **Full-screen nav overlay** on hamburger tap, large tap targets (min 44px), no nested dropdowns
- **Swipeable image galleries** (native touch/swipe, not tiny arrow buttons)
- **Hover-dependent interactions must have a touch equivalent** — e.g., the desktop image-hover annotation becomes a tap-to-reveal or is simply always visible on mobile
- **Aggressive image optimization**: Next/Image with responsive `sizes`, WebP/AVIF, lazy loading below the fold, low-quality placeholders for hero images
- **Fast first paint**: critical CSS inlined, defer non-critical animation libraries, avoid layout shift from web fonts (use `font-display: swap` + size-matched fallback)
- **Forms optimized for mobile keyboards**: correct `inputmode`/`type` per field (tel, email), minimal required fields, large touch-friendly selects
- **Test breakpoints**: 375px (small phones), 390–430px (standard), 768px (tablet), 1024px+ (desktop) — build mobile-first, enhance up

---

## 7. Performance & SEO

- Static generation (ISR) for project/service pages, dynamic only for forms/inquiries
- Structured data (JSON-LD) for LocalBusiness + individual Projects
- Open Graph images per project for shareability
- Core Web Vitals target: LCP < 2.5s on 4G, CLS near 0
- Sitemap + robots.txt generated at build

---

## 8. Deliverable Checklist for the Build Agent

Use this as your own completion tracker — don't report the build "done" until every box is genuinely satisfied, not just present in some form.

**Foundation**
- [ ] Design tokens file (colors, type scale, spacing, wood-texture assets) matching section 3
- [ ] Drizzle schema + migrations for the full data model in section 5, including the `media` table and all FK relationships

**Admin & content management (section 5a) — do not treat as optional/stretch**
- [ ] Authenticated `/admin` area (bcrypt + iron-session pattern)
- [ ] Media Library: upload, view, delete, edit alt text, see usage
- [ ] Direct-to-R2 upload flow for both images and videos (not routed through the Worker)
- [ ] Video poster/thumbnail handling + lazy-load attributes
- [ ] Image optimization pipeline (WebP/AVIF variants)
- [ ] Projects CRUD with drag-and-drop gallery manager (add/reorder/caption media, set cover, feature toggle, publish status)
- [ ] Services / Team / Testimonials CRUD with media pickers
- [ ] Page hero media swap (Home, Projects, About, etc.)
- [ ] Inquiries inbox with status management
- [ ] Verify: a non-technical admin can add a new project with full gallery and change any hero image/video with zero code deploys

**Frontend**
- [ ] Reusable components: Hero, BentoGrid, ProjectCard, ProjectGallery, ProcessTimeline, TestimonialCarousel, StickyMobileCTA, InquiryForm, MediaPicker (admin)
- [ ] All pages from the site map in section 4, wired to real data from the admin (not mock JSON)
- [ ] Scroll animation system from section 3a implemented — confirm it degrades correctly under `prefers-reduced-motion`
- [ ] Resend integration for inquiry notifications + auto-reply

**Quality bar**
- [ ] Fully responsive from 375px up, verified against every item in the mobile checklist in section 6
- [ ] Core Web Vitals targets from section 7 met on a throttled 4G profile, not just on localhost
- [ ] Deployed config for Cloudflare Pages/Workers (wrangler.toml, R2 bucket binding, D1 binding, env vars for Resend/session secrets)

**If anything in this spec is ambiguous or conflicts with a technical constraint you discover mid-build, flag it explicitly rather than silently picking an interpretation — especially for the admin/media layer and the animation performance budget, since those are the two areas most likely to need a real trade-off call.**