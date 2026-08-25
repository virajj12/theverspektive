# Verspektive Productions — Technical Specification Document (Updated 25-08-2026)

> Scope: Every file, component, data path, animation, and API endpoint that powers `/productions` and its sub-routes.

---

## 1. Technology Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js (App Router) | 16.3.0 |
| Runtime | Cloudflare Workers (Edge) | `@cloudflare/next-on-pages` |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 + PostCSS | 4.x |
| Animations | Framer Motion | 13.1.0 |
| Shaders | `ogl` (LightRays), `@paper-design/shaders-react` (LiquidMetal) | Custom WebGL2 & Preset |
| Database | Cloudflare D1 (SQLite) via Drizzle ORM | 0.45.2 |
| Object Storage | Cloudflare R2 (image uploads) | via `@aws-sdk/client-s3` |
| Validation | Zod | 4.4.3 |
| Icons | Lucide React | 1.31.0 |
| Fonts | Inter, Outfit (Google Fonts) | — |

---

## 2. Route & File Structure

The routing architecture separates server-side data fetching (`page.tsx`) from highly interactive framer-motion UI components (`client-page.tsx`).

```
src/app/productions/
├── layout.tsx                          ← Shared layout (metadata, ProductionsTabs, dark bg)
├── page.tsx                            ← Server Component — fetches videos + teams from D1
├── client-page.tsx                     ← Client Component — main Productions UI
├── tio-originals/
│   ├── page.tsx                        ← Server Component (redirects or static wrapper)
│   ├── client-page.tsx                 ← Client Component
│   ├── talk-it-out/
│   │   ├── page.tsx                    ← Server Component — Fetches YouTube API + DB playlists
│   │   └── client-page.tsx             ← Client Component — 3-column Video Grid Layout
│   └── taste-it-out/
│       ├── page.tsx                    ← Server Component
│       └── client-page.tsx             ← Client Component — 3-column Video Grid Layout
└── verspektive-studios/
    ├── page.tsx                        ← Server Component (static)
    └── client-page.tsx                 ← Client Component — Studio info + LightRays Hero
```

---

## 3. Rendering Pipeline & Data Flow

### 3.1 `/productions` (Main Page)
- **Data**: Fetches `youtube_videos` (main showcase) and `teams` JSON from D1 database.
- **Rendering**: Passes data to `<ProductionsClient />`.
- **UI**: Coverflow Carousel for teams, AnimatedGradient hero, paginated YouTube grid.

### 3.2 `/productions/tio-originals/talk-it-out`
- **Data**: 
  1. Tries to read from `getRequestContext().env.DB`. Includes a Vercel-safe `try/catch` fallback to prevent edge runtime crashes if the Cloudflare env is missing.
  2. Fetches `playlists` from the `pages` table (`slug="talk-it-out"`). Defaults to `["Tulu", "Kannada", "English"]` if DB is empty.
  3. Uses `YOUTUBE_API_KEY` to fetch the latest 10 videos per playlist directly from the YouTube Data API (`v3/playlistItems`).
- **UI**: Passes `playlists` and `playlistVideos` to the client. Videos are displayed in a responsive **3-column CSS Grid** (upgraded from the previous horizontal scroll). Uses skeleton loaders while waiting for data.

### 3.3 `/productions/verspektive-studios`
- **Data**: Currently static.
- **UI**: Hero section heavily utilizes a custom WebGL **LightRays** component. Includes standard feature lists and a Contact CTA.

---

## 4. Component Architecture Deep-Dives

### 4.1 PerspectiveHero (`perspective-hero.tsx`)
- **Purpose**: Creates the parallax "sticky" hero effect where a cover image slides up over a scaling logo.
- **Mechanics**: 
  - `200vh` scroll container.
  - `useScroll` + `useTransform` scales the hero from `1 → 0.8` and the cover from `0.8 → 1.0`.
  - Content below the cover flows naturally via `z-10`.

### 4.2 LightRays (`LightRays.tsx`)
- **Purpose**: High-performance WebGL2 volumetric light ray simulation used on the Studio page.
- **Mechanics**:
  - Built directly on top of `ogl`.
  - Generates procedural noise and volumetric light spread anchored to a specific origin (e.g., `top-center`).
  - **Mobile Optimized**: Uses `max(iResolution.x, iResolution.y)` in the fragment shader so rays scale accurately on tall portrait screens. Defaults to `mediump` precision on mobile devices to prevent silent compilation failures on restricted GPUs.
  - **Sizing**: Leverages `ResizeObserver` to guarantee accurate canvas dimensions (bypassing `IntersectionObserver` complexity for reliability).

### 4.3 AnimatedGradient (`animated-gradient.tsx`)
- **Purpose**: Swirling colored WebGL gradient background for the main `/productions` hero.
- **Mechanics**: Runs a persistent `requestAnimationFrame` loop with custom fragment shaders and noise overlays.

### 4.4 CoverflowCarousel (`coverflow-carousel.tsx`)
- **Purpose**: 3D rotating team member carousel.
- **Mechanics**: Uses raw DOM style manipulation (`card.style.transform`) inside a `requestAnimationFrame` loop for maximum performance, bypassing React state overhead for 60fps dragging and swiping.

### 4.5 AnimatedTabs (`animated-tabs.tsx` & `productions-tabs.tsx`)
- **Purpose**: Bottom floating navigation bar.
- **Mechanics**:
  - `ProductionsTabs` tracks the current pathname and active hashes. 
  - `AnimatedTabs` renders a fluid sliding indicator pill.
  - **Smart Back Button**: When navigating deep into a sub-page (e.g., Talk It Out), the active tab's text fades to `opacity-0` and a centered `ChevronLeft` appears, maintaining the pill's exact physical width to prevent layout shifting.

---

## 5. Database Schema & API Contracts

### 5.1 D1 Schema (`schema.ts`)
*   **`youtube_videos`**: `id`, `title`, `youtube_url`, `thumbnail_url`, `created_at`.
*   **`pages`**: Key-value JSON storage for dynamic sections.
    *   `slug`: Route identifier (e.g., `productions`, `talk-it-out`)
    *   `section_key`: Component identifier (e.g., `teams`, `playlists`)
    *   `value`: JSON stringified payloads.

### 5.2 API Endpoints
*   `GET/POST/DELETE /api/youtube_videos`: CRUD for the main page showcase.
*   `GET/POST /api/content`: Upsert key-value JSON data for teams/playlists.
*   `POST /api/upload`: Handles multipart form data, returning a public Cloudflare R2 URL.

---

## 6. CSS, Theme & Layout Handling

### 6.1 Dark Mode Enforcement
- The `layout.tsx` for `/productions` forces a dark theme ecosystem (`bg-black text-white`). 
- The global `<AnimatedThemeToggler>` in the root Navbar is configured to **only render** when the user is within `/productions` paths. Outside of productions, the app forcibly removes the `.dark` class.

### 6.2 Layout Integrity
- The `productions/layout.tsx` avoids native Next.js layout white-flashing by injecting a `<style dangerouslySetInnerHTML>` tag that pre-emptively paints the `html` and `body` backgrounds black before hydration.

---

## 7. Known Behaviors & Edge Cases

1.  **Vercel vs. Cloudflare**: The Edge runtime bindings (`getRequestContext`) natively throw errors when hosted on standard Vercel Node environments. Safe `try/catch` wrappers exist in data-fetching components to swallow these errors and fallback to static defaults seamlessly.
2.  **Unoptimized Images**: `next.config.ts` explicitly sets `images.unoptimized: true`. All external Unsplash images and R2 uploads are served at raw resolution.
3.  **No-Scroll Layouts**: The video lists in TIO Originals have been migrated from CSS horizontal snap-scrolling to standard CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to improve discoverability and match the UI spec. All legacy scroll functions have been purged.
