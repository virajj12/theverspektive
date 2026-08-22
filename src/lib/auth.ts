import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

/**
 * Retrieves a required env var. Throws if missing, preventing the app
 * from silently running with a weak or default secret.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`FATAL: Required environment variable "${name}" is not set. Refusing to start with insecure defaults.`);
  }
  return value;
}

export const sessionOptions = {
  password: requireEnv("ADMIN_SESSION_SECRET"),
  cookieName: "verspektive_admin_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

export const userSessionOptions = {
  password: requireEnv("USER_SESSION_SECRET"),
  cookieName: "verspektive_user_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
};

export interface SessionData {
  isLoggedIn: boolean;
}

export interface UserSessionData {
  isLoggedIn: boolean;
  userId?: number;
  email?: string;
  sessionVersion?: number;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const defaultUserSession: UserSessionData = {
  isLoggedIn: false,
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  
  return session;
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<UserSessionData>(cookieStore, userSessionOptions);
  
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultUserSession.isLoggedIn;
  }
  
  return session;
}

/**
 * Reusable helper for protected routes/API endpoints.
 * Validates the session exists and that the session_version matches the database.
 * If invalid, it destroys the session and returns null.
 */
export async function requireUserSession(db: any) {
  const session = await getUserSession();
  
  if (!session.isLoggedIn || !session.userId) {
    return null;
  }
  
  try {
    // Dynamic import to avoid circular dependencies if auth.ts is imported everywhere
    const { users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    
    const user = await db.select().from(users).where(eq(users.id, session.userId)).get();
    
    if (!user || user.session_version !== session.sessionVersion) {
      session.destroy();
      return null;
    }
    
    return { session, user };
  } catch (error) {
    console.error("Session verification failed", error);
    return null;
  }
}
