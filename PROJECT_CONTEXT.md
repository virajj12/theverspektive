# PROJECT_CONTEXT

## AI QUICK CONTEXT

**Project**: VerspeKtive
**Purpose**: A premium multi-faceted platform representing a storytelling studio, tech consultancy, G3 Builders (architecture), and content production (Taste It Out, Talk It Out).
**Stack**: Next.js 16 (App Router, Edge runtime), React 19, TailwindCSS 4, TypeScript, Drizzle ORM (SQLite), Cloudflare D1 + R2 + Pages, Zustand, Framer Motion, GSAP, Three.js.
**Architecture**: Monolithic Edge-first Next.js app connecting directly to Cloudflare D1 (Database) and R2 (Storage). Uses Iron Session for auth.
**Entry point**: `src/app/layout.tsx`
**Primary routes**: `/` (Home), `/productions` (Sub-brands), `/g3-builders` (Architecture), `/tech` (Consultancy), `/admin` (CMS), `/founder` (Founder page).
**Core features**: CMS-driven pages, Dynamic media library (R2), Authentication, Contact/Inquiry forms, Project Showcase.
**Critical directories**: `src/app`, `src/components`, `src/db`, `src/lib`.
**Critical files**: `src/db/schema.ts`, `src/app/layout.tsx`, `drizzle.config.ts`, `next.config.ts`, `wrangler.toml`.
**External services**: Cloudflare (Pages, Workers, D1, R2), Resend (Email API), Razorpay (in schema for orders).
**Data sources**: Cloudflare D1 via Drizzle ORM.
**State management**: Zustand (e.g. `tabs-store.ts`, `tech-track-store.ts`), React Context (`global-loader-provider.tsx`), URL state.
**Animation system**: GSAP, Framer Motion, `@studio-freight/lenis` (smooth scroll), Three.js (for WebGL elements).
**Styling system**: TailwindCSS (v4), raw CSS (`globals.css`, `LightRays.css`, `g3-theme.css`), `class-variance-authority`, `clsx`, `tailwind-merge`.
**Deployment**: Cloudflare Pages via `@cloudflare/next-on-pages`.
**Current development status**: Actively developed. Core schema and routes exist. Admin portal exists for G3 and content. Sub-brands partially implemented.

---

## AI OPERATING RULES

- **Inspect existing code before implementing.** Search for existing `ui/` primitives before building new ones.
- **Reuse existing abstractions.** The DB connects via `src/db/client.ts`. Auth is managed via `src/lib/auth.ts`.
- **Do not introduce duplicate patterns.** Use Zustand for global state, do not add Redux. Use Framer Motion/GSAP, do not add new animation libs.
- **Preserve existing UX and animation behavior.** The site heavily relies on premium interactions (Lenis smooth scrolling, Three.js shaders, MaskText).
- **Do not make architectural changes unless explicitly requested.** This is an Edge-runtime app (`export const runtime = 'edge'`). Node.js specific APIs (`fs`, `child_process`) will break the app.
- **Treat PROJECT_CONTEXT.md as contextual documentation, not a substitute for inspecting source code.**
- **When documentation conflicts with source code, source code is authoritative.**

---

## 1. FULL REPOSITORY ANALYSIS

The VerspeKtive repository is a Next.js 16 application running entirely on the Edge (Cloudflare Pages). The project integrates multiple brands under one roof:
1. **VerspeKtive Studios & Originals** (Content production)
2. **G3 Builders** (Architecture and interior design)
3. **Tech Consultancy** (Technical consulting)
4. **Founder/Brand** (Personal brand)

It utilizes a robust custom-built headless CMS structure via Cloudflare D1 (SQLite) and R2 (Object Storage). The UI is highly animated and interactive, demanding premium visual fidelity.

## 2. PROJECT OVERVIEW

**Project Name**: VerspeKtive
**Project Purpose**: A unified digital presence for a multi-disciplinary creator/agency (Storytelling, Tech, Architecture).
**Target Users**: Clients seeking video production, architecture services, tech consulting, or fans of the content.
**Major Capabilities**: 
- Dynamic, CMS-driven UI blocks (loaded from D1).
- Admin dashboard to manage projects, media, team, inquiries, and page content.
- Custom WebGL/Three.js visual effects for high-end aesthetic.
- Edge-compatible auth using Iron Session.

## 3. TECHNOLOGY STACK

- **Next.js (16.3.0)**: App Router. Running on Edge runtime via `@cloudflare/next-on-pages`.
- **React (19.2.8)**: UI Library.
- **TailwindCSS (v4)**: Utility-first styling.
- **TypeScript**: Static typing.
- **Drizzle ORM (0.45.2)**: SQLite DB interactions.
- **Cloudflare D1**: Serverless SQLite database.
- **Cloudflare R2**: Object storage for media.
- **Zustand (5.0.15)**: Lightweight global state management.
- **Framer Motion (13.1.0) & GSAP (3.15.0)**: Complex UI animations and scroll triggers.
- **Three.js & React Three Fiber**: WebGL canvas rendering.
- **Lenis**: Smooth scrolling engine.
- **Iron Session**: Encrypted, stateless cookie-based auth (Edge compatible).
- **Resend**: Transactional email API.
- **Lucide React**: Iconography.

## 4. COMPLETE REPOSITORY STRUCTURE

```text
/
├── .env.example         # Environment variable template
├── drizzle.config.ts    # Drizzle ORM config for D1
├── next.config.ts       # Next.js config (images, dev platform)
├── package.json         # Dependencies & scripts
├── wrangler.toml        # Cloudflare bindings (D1, R2)
├── src/
│   ├── app/             # Next.js App Router routes
│   │   ├── admin/       # CMS / Dashboard routes
│   │   ├── api/         # Edge API routes (upload, auth, inquiries)
│   │   ├── g3-builders/ # Architecture sub-brand
│   │   ├── productions/ # Content sub-brand
│   │   ├── tech/        # Tech consultancy sub-brand
│   │   ├── login/       # Authentication pages
│   │   └── layout.tsx   # Root layout (Providers, Navbar, Footer)
│   ├── components/      # React components
│   │   ├── admin/       # Admin specific UI
│   │   ├── g3/          # G3 specific UI
│   │   ├── tech/        # Tech specific UI
│   │   └── ui/          # Reusable, animated primitives (buttons, cards, glow)
│   ├── db/              # Database layer
│   │   ├── client.ts    # DB connection initialization
│   │   └── schema.ts    # Drizzle schema definitions
│   ├── lib/             # Utilities and helpers
│   │   ├── auth.ts      # Iron Session auth logic
│   │   ├── crypto.ts    # Hashing utilities
│   │   ├── email.ts     # Resend email logic
│   │   └── g3-media.ts  # R2 upload/fetch logic
│   └── store/           # Zustand stores
```

## 5. ARCHITECTURE

The application follows a **Monolithic Serverless/Edge Architecture**:
- **Frontend**: React Server Components (RSC) and Client Components.
- **Backend**: Next.js Route Handlers and Server Actions running on Cloudflare Workers (Edge).
- **Database**: Cloudflare D1 (SQLite) accessed directly from the Edge via Drizzle.
- **Storage**: Cloudflare R2 for media. Images/Videos are uploaded via presigned URLs or direct API routes.

```mermaid
flowchart TD
    A[Client] --> B[Cloudflare Pages (Next.js Edge)]
    B -->|RSC / API| C[Cloudflare D1 (SQLite)]
    B -->|S3 Client| D[Cloudflare R2 (Media)]
    B -->|Resend API| E[Email Delivery]
```

## 6. ENTRY POINTS

- **Root Layout**: `src/app/layout.tsx` (Wraps the app with fonts, Navbar, Footer, and `GlobalLoaderProvider`).
- **Home Page**: `src/app/page.tsx` (Fetches dynamic hero content from D1 and renders `ClientHome`).
- **Admin Root**: `src/app/admin/page.tsx`
- **Database Entry**: `src/db/client.ts`

## 7. ROUTING

- **`/`**: Landing page.
- **`/productions/*`**: Video/content production sub-routes (`/tio-originals`, `/verspektive-studios`).
- **`/g3-builders`**: Architecture brand landing.
- **`/tech`**: Consulting landing.
- **`/admin`**: Protected CMS route. Requires auth.
- **`/login`, `/register`, `/reset-password`**: Auth flows.
- **`/api/*`**: Backend endpoints (e.g., `/api/upload` for R2).

*All routes must use `export const runtime = 'edge';`.*

## 8. COMPONENT SYSTEM

- **UI Primitives (`src/components/ui/`)**: Highly reusable, uncoupled components. Examples: `animated-tabs.tsx`, `beams-background.tsx`, `card.tsx`. Often use `framer-motion` or `Three.js`.
- **Feature Components (`src/components/g3/`, `src/components/tech/`)**: Domain-specific blocks. Coupled to specific data models (e.g., `ProjectCard.tsx`).
- **Layout Components**: `navbar.tsx`, `footer.tsx`. Used globally in the root layout.

## 9. UI / UX IMPLEMENTATION

- **Typography**: Inter (sans) and Outfit (display). Defined in `layout.tsx` via `next/font/google`.
- **Styling**: Tailwind CSS v4.
- **Theme**: Dark mode prominent, controlled via standard Tailwind classes (`bg-background`, `text-foreground`).
- **Premium Feel**: Heavy use of glassmorphism (`backdrop-blur`), subtle glows (`BorderGlow.tsx`), and smooth scrolling (`Lenis`).

## 10. DESIGN LANGUAGE

- **Visual Identity**: High-end, studio aesthetic. 
- **Motion**: Fluid. Elements rarely snap into place; they fade, slide, or reveal (`MaskText.tsx`).
- **Micro-interactions**: Hovering over cards causes tilts (`be-ui-tilt-card.tsx`), lighting effects, or gradient shifts.

## 11. ANIMATIONS & INTERACTIONS

**Critical to preserve**:
- **Smooth Scroll**: Provided by Lenis. Do not break overflow hiding unless necessary.
- **Reveal Animations**: GSAP ScrollTrigger and Framer Motion `whileInView` are used extensively to reveal content as the user scrolls.
- **3D Elements**: `VMarkScene.tsx` and shaders rely on WebGL.

## 12. STATE MANAGEMENT

- **Local State**: `useState` / `useReducer` in components.
- **Global UI State**: Zustand (`tabs-store.ts`, `tech-track-store.ts`). Used for cross-component communication (e.g., syncing active tabs across distant UI elements).
- **Auth State**: Iron Session (HTTP-only cookies). Parsed on the server.
- **Server State**: Server Components fetch directly from D1. No React Query / SWR detected.

## 13. DATA FLOW

**Typical Read Flow**:
`page.tsx` (Server Component) -> `getDb(env.DB)` -> Drizzle Query -> Pass to `ClientComponent` as props -> Render.

**Typical Write Flow (Admin)**:
Client form -> Server Action or `POST /api/endpoint` -> Auth verification (`requireUserSession`) -> Drizzle Insert/Update -> `revalidatePath()`.

## 14. API / BACKEND INTEGRATIONS

- **Cloudflare R2**: Integrated via `@aws-sdk/client-s3`. Used in `src/app/api/upload/route.ts` for media uploads.
- **Resend**: Integrated via HTTP / SDK in `src/lib/email.ts`.
- **Razorpay**: Mentioned in `schema.ts` (`razorpay_customer_id`, `razorpay_order_id`), implying future payment integration.

## 15. DATABASE / STORAGE

**Database**: Cloudflare D1.
- **Schema (`src/db/schema.ts`)**:
  - `pages`, `g3_pages`: Dynamic text/image content.
  - `users`, `password_reset_tokens`: Auth.
  - `tech_inquiries`, `g3_inquiries`: Lead capture.
  - `g3_projects`, `g3_media`, `g3_project_media`: Architecture portfolio relational data.
- **Storage**: Cloudflare R2 bucket (`verspektive-media`).

## 16. AUTHENTICATION & AUTHORIZATION

- **Implementation**: Iron Session (`src/lib/auth.ts`).
- **Flow**: User posts to `/api/auth/login`, validated against `users` table, encrypted cookie set.
- **Protection**: Server routes use `requireUserSession(db)`. 
- **Roles**: Separate `ADMIN_SESSION_SECRET` and `USER_SESSION_SECRET` imply segregation between admin and standard users.

## 17. ENVIRONMENT VARIABLES & CONFIGURATION

- `DB`: D1 Binding (Injected by Cloudflare).
- `R2_BUCKET`: R2 Binding (Injected by Cloudflare).
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`: S3 client credentials for presigned URLs/uploads.
- `R2_PUBLIC_URL`: Custom domain for R2 bucket.
- `ADMIN_SESSION_SECRET`, `USER_SESSION_SECRET`: Iron Session encryption keys.
- `RESEND_API_KEY`: Email delivery.

## 18. ASSETS & MEDIA

- All user-uploaded media (videos, images) go to R2.
- Tracked in `g3_media` table for reuse.
- `heic-convert` is used, indicating support for iOS photo uploads.

## 19. CONTENT MANAGEMENT

- The app features a bespoke CMS. Pages load their content via `pages` and `g3_pages` tables.
- E.g., The Home page hero text (`heroHeadline`, `heroTagline`) is queried from D1.

## 20. RESPONSIVE DESIGN

- Built mobile-first using Tailwind.
- Uses `md:`, `lg:` breakpoints. 
- WebGL/Canvas elements have fallback components (e.g., `VMarkFallback.tsx`) likely for mobile performance or unsupported browsers.

## 21. ACCESSIBILITY

- Radix UI primitives (`@radix-ui/react-slot`) and standard HTML semantic tags are in use.

## 22. PERFORMANCE

- **Edge Runtime**: Extremely fast TTFB.
- **Media Optimization**: Next.js `next/image` is set to `unoptimized: true` in `next.config.ts`, relying on Cloudflare's edge image optimization or raw R2 URLs.
- **Bundle Size**: Three.js and GSAP are heavy. Dynamic imports (`next/dynamic`) should be used for 3D scenes.

## 23. ERROR & EDGE-CASE HANDLING

- Rate limiting is implemented (`src/lib/rate-limit.ts`) backed by the `rate_limits` D1 table. Protects login and form submissions.

## 24. TESTING

- **Unknown / Not Determined From Codebase**: No testing frameworks (Jest, Cypress, Playwright) are currently installed in `package.json`.

## 25. CODE CONVENTIONS

- **File Naming**: Kebab-case for components (`animated-tabs.tsx`, `client-page.tsx`) and some PascalCase (`BentoGrid.tsx`). 
- **Exports**: Default exports for Pages and Layouts. Named exports for UI primitives and utilities.
- **Edge Compliance**: Imports of `fs` or `path` are forbidden. `export const runtime = 'edge';` is at the top of route files.

## 26. DEPENDENCY MAP

- `layout.tsx` -> `Navbar`, `Footer`, `GlobalLoaderProvider`.
- `page.tsx` -> `getDb` -> `ClientHome` -> Various UI primitives.
- `schema.ts` is central and imported globally across all API routes and Server Components.

## 27. FEATURE INVENTORY

- **Admin CMS**: Partially/Fully Implemented (ProjectsManager, MediaLibrary).
- **Public Portfolio (G3)**: Implemented.
- **Lead Generation (Tech/G3 Inquiries)**: Implemented.
- **Authentication**: Implemented (Login, Register, Reset).
- **Payments/Orders**: Planned (Schema exists, Razorpay mentioned, but no active frontend routes seen).

## 28. CURRENTLY INCOMPLETE / FRAGILE AREAS

- **Edge Runtime Limitations**: Third-party libraries that rely on Node.js native modules will crash the app in production. Always verify Cloudflare Workers compatibility.
- **Image Optimization**: `unoptimized: true` is set. Raw R2 images might cause bandwidth/performance issues if not properly sized upon upload.

## 29. KNOWN PRODUCT / UX INTENT

- **Confirmed behavior**: The site is a unified portal for multiple brands owned by one entity.
- **Strong inference**: The CMS is designed to prevent code-deployments for content updates (swappable hero images, text).
- **Strong inference**: Focus on high aesthetics over raw data-density. Animations are critical to the brand identity.

## 30. FUTURE EXTENSIBILITY

- The `schema.ts` is designed relationally. `g3_media` is a central repository allowing assets to be attached to projects, team members, or services indefinitely.
- The `pages` table uses key-value pairs (`section_key`, `value`) allowing infinite new sections without schema migrations.

## 31. SAFE MODIFICATION GUIDE

### Before modifying code
1. Verify Cloudflare Edge compatibility.
2. Check `src/components/ui` for existing primitives.

### When adding a feature
1. Add schema to `src/db/schema.ts`.
2. Generate migration (`npm run db:generate` or equivalent local script).
3. Create UI in `src/components/` and page in `src/app/`.

### When changing data
1. Use `getDb(env.DB)` inside Server Components or API routes.
2. Never expose DB logic to Client Components.

## 32. "DO NOT BREAK" CONTRACT

- **DO NOT** remove `export const runtime = 'edge';`.
- **DO NOT** break Lenis smooth scrolling by applying `overflow-hidden` to `body` or `html` arbitrarily.
- **DO NOT** bypass Iron Session for auth; rely on `requireUserSession()`.

## 33. DEBUGGING GUIDE

- **DB Errors**: Ensure the D1 binding `DB` is correctly passed from `getRequestContext().env.DB`.
- **Media Upload Fails**: Check R2 CORS settings and S3 credentials in `.env`.
- **Build Crashes**: Check for Node.js built-ins (`fs`, `crypto` native) being imported in Edge routes. Use Web Crypto API instead.

## 34. DEVELOPMENT WORKFLOW

- `npm run dev`: Starts Next.js dev server with Cloudflare Pages proxy (`@cloudflare/next-on-pages/next-dev`).
- `npm run build`: Builds the app for Cloudflare Pages.
- Drizzle Kit: Used for schema migrations against local/remote D1.

## 35. DEPLOYMENT

- **Hosting**: Cloudflare Pages.
- **Build Command**: `npx @cloudflare/next-on-pages@1` (inferred).
- **Output Directory**: `.vercel/output/static`.

## 36. SECURITY

- SQL Injection protected via Drizzle ORM.
- Passwords hashed using `bcryptjs`.
- Auth tokens managed securely via Iron Session.
- Rate limiting active on critical endpoints.

## 37. TECHNICAL DECISIONS

- **Decision**: Cloudflare D1 + R2 + Pages.
  - **Why**: Infinite scalability, zero cold-starts on Edge, unified ecosystem, low cost.
- **Decision**: Iron Session over NextAuth/Auth.js.
  - **Why**: Simpler Edge compatibility, no external DB requirement for session storage, stateless.

## 38. Instructions for Future AI Coding Agents

1. **Edge First**: You are writing code for Cloudflare Workers/Pages. Do not use Node.js APIs.
2. **Aesthetic Focus**: When generating UI, use Framer Motion and existing UI primitives to ensure it feels premium. 
3. **Database**: Always use Drizzle. Refer to `src/db/schema.ts` for exact table names and relationships.
4. **Environment**: Do not assume `process.env` works dynamically in the same way as Node.js. Use `getRequestContext().env` where required by Cloudflare Next-on-Pages, though Next.js polyfills some of it.
5. **No Placeholders**: If adding UI, integrate it fully. If a backend route is needed, write it.

## 39. CHANGE IMPACT MAP

- `src/db/schema.ts` -> Affects entire application data layer. Requires migrations.
- `src/app/layout.tsx` -> Affects global CSS, fonts, scrolling, and navigation.
- `src/components/ui/*` -> Modifying these affects multiple pages. Prefer extending via `className` over changing core logic.

## 40. FILE-BY-FILE REFERENCE

- `src/app/layout.tsx`: Root HTML structure, Providers, Lenis initialization.
- `src/db/schema.ts`: Single source of truth for D1 schema.
- `src/lib/auth.ts`: Iron Session configuration and `requireUserSession` middleware equivalent.
- `src/lib/crypto.ts`: Password hashing and token generation.
- `src/components/navbar.tsx`: Global navigation.
- `src/components/global-loader-provider.tsx`: Manages initial loading screen state.

## 41. FINAL PROJECT SUMMARY

**Architecture in one paragraph**: VerspeKtive is a monolithic, Edge-native Next.js application hosted on Cloudflare Pages, utilizing Cloudflare D1 for relational data and R2 for media storage, delivering a highly animated, CMS-driven premium frontend experience.

**Technology stack**: Next.js 16 (App Router, Edge), React 19, TailwindCSS 4, Drizzle ORM, Cloudflare D1/R2, Framer Motion, GSAP, Zustand.

**Core features**: Headless CMS engine, multi-brand routing, dynamic media library, admin dashboard, secure edge auth, lead capture.

**Critical files**: `src/db/schema.ts`, `src/lib/auth.ts`, `src/app/layout.tsx`.

**Current limitations**: Strictly bound to Edge runtime, meaning some standard Node ecosystem packages will not function. Image optimization relies on Cloudflare's external mechanisms.

**Important invariants**: Edge runtime must be preserved. Smooth scrolling and animation fidelity must be maintained.

**Most likely next development areas**: Completion of the `/productions` sub-brands and potential Razorpay payment integration for `orders`.
