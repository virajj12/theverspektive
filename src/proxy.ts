import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global middleware for:
 * 1. Security headers on all responses
 * 2. Origin validation (CSRF defense-in-depth) on state-mutating API requests
 * 3. Auth guard for admin routes (defense-in-depth — route handlers also check)
 */

// Routes that require admin session (checked server-side, but we add an early gate here)
const PROTECTED_MUTATION_PATTERNS = [
  { path: "/api/content", methods: ["POST"] },
  { path: "/api/upload", methods: ["POST"] },
  { path: "/api/youtube_videos", methods: ["POST", "DELETE"] },
  { path: "/api/auth/update-profile", methods: ["POST"] },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const response = NextResponse.next();

  // --- 1. Security Headers (all responses) ---
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // --- 2. Origin Validation for state-mutating requests ---
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // If Origin header is present, verify it matches our host
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          console.warn(`[SECURITY] Origin mismatch: origin=${origin}, host=${host}, path=${pathname}`);
          return new NextResponse(
            JSON.stringify({ error: "Forbidden: Cross-origin request blocked" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch {
        // Malformed origin header
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Invalid origin" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // --- 3. Admin page auth guard (defense-in-depth) ---
  // Note: The actual session check happens in the admin layout.tsx server component.
  // This middleware ensures the admin cookie exists at all before proceeding.
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminCookie = request.cookies.get("verspektive_admin_session");
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
