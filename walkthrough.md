# Security Remediation Walkthrough

All 14 vulnerabilities from the 2026-08-22 audit have been fixed across 4 phases.

---

## Phase 1 — Critical (3 fixes)

| # | Fix | File | Diff Summary |
|---|-----|------|-------------|
| 1 | Remove hardcoded admin password | [route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/auth/route.ts) | Removed `bcrypt.hashSync("Admin123!", 10)` fallback → returns 500 if env var missing |
| 2 | Split session secrets, remove fallbacks | [auth.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/auth.ts) | `SECRET_COOKIE_PASSWORD` → two separate `ADMIN_SESSION_SECRET` + `USER_SESSION_SECRET`, throws on missing |
| 3 | Lock down admin cookie | [auth.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/auth.ts) | Added `httpOnly: true`, `sameSite: "strict"`, `maxAge: 24h` to admin session |

**Supporting changes:**
- [env.d.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/env.d.ts) — Added new env var type declarations
- [.env.example](file:///d:/Projects/Vikhil%20anna/VerspeKtive/.env.example) — **[NEW]** Documents all required env vars

> [!WARNING]
> **Deploy note:** Phase 1 changes invalidate ALL existing sessions (admin + user). You must set `ADMIN_SESSION_SECRET` and `USER_SESSION_SECRET` env vars before deploying. Generate each with: `openssl rand -base64 32`

---

## Phase 2 — High (4 fixes)

| # | Fix | File | Diff Summary |
|---|-----|------|-------------|
| 4a | Zod validation on content | [content/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/content/route.ts) | Added `slugPattern` regex, `content_type` enum, 50KB max on `value` |
| 4b | Zod validation on YouTube videos | [youtube_videos/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/youtube_videos/route.ts) | Added HTTPS-only URL validation, `z.coerce.number().int().positive()` for ID (also fixes #13) |
| 5 | File upload validation | [upload/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/upload/route.ts) | MIME allowlist, 10MB limit, UUID+ext filename generation, `R2_ACCOUNT_ID` from env |
| 6 | Rate-limit reset-password | [reset-password/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/auth/reset-password/route.ts) | Added 5/15min rate limit (stricter due to 600k-iteration PBKDF2 cost) |
| 7 | Lock down legacy admin route | [auth/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/auth/route.ts) | Added 10/15min rate limit, Zod validation on input |

---

## Phase 3 — Medium (4 fixes)

| # | Fix | File | Diff Summary |
|---|-----|------|-------------|
| 8 | Timing-safe comparison | [crypto.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/crypto.ts) | Replaced string comparison with XOR accumulator on raw `Uint8Array` bytes |
| 9 | Rate limiter fails closed | [rate-limit.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/rate-limit.ts) | `catch` now returns `{ success: false }` + high-severity alert log |
| 10 | Fix TOCTOU race | [rate-limit.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/rate-limit.ts) | Atomic `SET count = count + 1 WHERE count < limit` + `onConflictDoUpdate` upsert |
| 11 | CSRF protection | [auth.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/lib/auth.ts) + [middleware.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/middleware.ts) | `sameSite: "strict"` on both cookies + Origin header validation in middleware |

---

## Phase 4 — Low (3 fixes)

| # | Fix | File | Diff Summary |
|---|-----|------|-------------|
| 12 | Stop leaking error details | [auth/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/auth/route.ts) | Removed `details: error.message` from 500 response (done in fix #1) |
| 13 | Validate ID params | [youtube_videos/route.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/app/api/youtube_videos/route.ts) | Replaced `parseInt(id)` with `z.coerce.number().int().positive()` (done in fix #4b) |
| 14 | Global middleware | [middleware.ts](file:///d:/Projects/Vikhil%20anna/VerspeKtive/src/middleware.ts) | **[NEW]** Security headers (CSP, X-Frame-Options, nosniff), Origin validation, admin cookie gate |

---

## Files Changed Summary

| Action | File |
|--------|------|
| Modified | `src/app/api/auth/route.ts` |
| Modified | `src/app/api/auth/reset-password/route.ts` |
| Modified | `src/app/api/content/route.ts` |
| Modified | `src/app/api/upload/route.ts` |
| Modified | `src/app/api/youtube_videos/route.ts` |
| Modified | `src/lib/auth.ts` |
| Modified | `src/lib/crypto.ts` |
| Modified | `src/lib/rate-limit.ts` |
| Modified | `env.d.ts` |
| **New** | `src/middleware.ts` |
| **New** | `.env.example` |

---

## Required Env Vars for Deploy

Before deploying, ensure these are set in your Cloudflare Pages settings:

```
ADMIN_SESSION_SECRET=<random 32+ char string>
USER_SESSION_SECRET=<random 32+ char string>  (different from above!)
ADMIN_PASSWORD_HASH=<bcrypt hash>
R2_ACCOUNT_ID=<your cloudflare account ID>
R2_ACCESS_KEY_ID=<R2 API token key>
R2_SECRET_ACCESS_KEY=<R2 API token secret>
R2_PUBLIC_URL=<public URL for your R2 bucket>
RESEND_API_KEY=<resend.com API key>
```

> [!IMPORTANT]
> For local development, copy `.env.example` to `.env.local` and fill in dev values. Both session secrets must be at least 32 characters.
