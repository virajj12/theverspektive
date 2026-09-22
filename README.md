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
The application is built on **Next.js** and designed to be deployed on **Vercel** as a static/serverless application. It utilizes local JSON files for content management, eliminating the need for a traditional backend or database.

### Native Data Shape
The product is structured around a static catalog and content system:
- **CMS (`content/*.json`):** Drives dynamic content for heroes, page sections, configuration, and navigation (e.g., `home.json`, `site.json`, `founder.json`).
- **Media (`src/lib/youtube.ts`):** Fetches, caches, and serves embedded video content natively from the YouTube Data API.
- **Contact (`src/app/api/contact/route.ts`):** A serverless endpoint powered by Resend to process user inquiries securely.

## Critical Files
- **`src/app/client-page.tsx`**: The core entry point for the landing page; orchestrates the brand presentation, Framer Motion scroll animations, and sub-brand routing.
- **`src/app/globals.css`**: The definitive source of truth for the design system, Apple-inspired theme tokens, and typography scales.
- **`content/*.json`**: The static data files that control the text, links, and content across the entire website.
- **`package.json`**: Outlines the stack, including Framer Motion, Next.js, Lucide React, and standard frontend dependencies.
