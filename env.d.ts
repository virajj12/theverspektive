/// <reference types="@cloudflare/workers-types" />
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    ADMIN_PASSWORD_HASH: string;
    R2_PUBLIC_URL: string;
    ADMIN_SESSION_SECRET: string;
    USER_SESSION_SECRET: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_ACCOUNT_ID: string;
    RESEND_API_KEY: string;
    /** Optional: recipient for /tech inquiry notifications. */
    TECH_INQUIRY_TO?: string;
    /** Optional: recipient for G3 Builders consultation enquiries. */
    G3_INQUIRY_TO?: string;
  }

  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}

export {};
