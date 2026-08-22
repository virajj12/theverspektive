# VerspeKtive

**Premium storytelling, from studio to screen.**

## Codebase Purpose & Goals
VerspeKtive is a multi-faceted digital platform encompassing cinematic video production, studio rentals, architectural design (G3 Builders), culinary journeys (Taste It Out), and original thought-provoking content (Talk It Out). 

The goal of this application is to serve as a high-end portfolio, a dynamic content delivery system, and an e-commerce/booking platform. It provides a cinematic, premium user experience while supporting user authentication, dynamic CMS-driven page content, and Razorpay-integrated order processing.

## Visual Identity & Design System
The visual language is defined by an **Apple-Inspired Monochromatic Theme** prioritizing stark contrasts, clean typography, and subtle micro-animations.

- **Color Palette:** 
  - Backgrounds/Surfaces: Deep black (`#000000`), crisp white (`#ffffff`), and layered grays (`#1d1d1f`, `#f5f5f7`).
  - Accent/Action: Apple-style blue (`#0071e3` in light mode, `#2997ff` in dark mode).
- **Typography:**
  - Display Headings: `Outfit` (used for large, impactful `text-display-*` scales).
  - Body & Base: `Inter` (used for clean, readable body copy and UI elements).
- **Component Patterns:**
  - **Cinematic Heroes:** Full-screen background imagery with centered, bold typography and mask-text reveals.
  - **Bento Grids:** Used for organizing secondary features and sub-brands clearly.
  - **Glassmorphism:** Navigation and overlays utilize `saturate(180%) blur(20px)` for a premium feel.
  - **Interactions:** "Learn more >" CTA links with inline Chevron arrows that animate on hover, and smooth scroll integrations via Framer Motion.

## Core Logic & Data Structures
The application is built on **Next.js (Edge Runtime)** and designed to be deployed on **Cloudflare Pages/Workers**, utilizing D1 for the database.

### Native Data Shape (`src/db/schema.ts`)
The product is structured around a dynamic catalog and user-driven booking pipeline:
- **CMS (`pages`):** Drives dynamic content for heroes and page sections (e.g., `heroHeadline`, `heroTagline`).
- **Catalog & Pricing (`pricing_items`):** Defines the offerings and rates for studio rentals and add-ons.
- **User Pipeline (`users`, `orders`):** Manages custom authentication (with `bcryptjs`, email verification, and rate limiting) and tracks customer orders linked to Razorpay.
- **Media (`youtube_videos`):** Caches and serves embedded video content.

## Critical Files
- **`src/app/client-page.tsx`**: The core entry point for the landing page; orchestrates the brand presentation, Framer Motion scroll animations, and sub-brand routing.
- **`src/app/globals.css`**: The definitive source of truth for the design system, Apple-inspired theme tokens, and typography scales.
- **`src/db/schema.ts`**: The Drizzle ORM schema that outlines the application's underlying data architecture.
- **`package.json`**: Outlines the stack, including Framer Motion, Drizzle, Lucide React, and Cloudflare adapters.
