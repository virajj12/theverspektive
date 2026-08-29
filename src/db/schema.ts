import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  section_key: text("section_key").notNull(),
  content_type: text("content_type").notNull(), // 'text', 'richtext', 'image_url'
  value: text("value").notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const pricing_items = sqliteTable("pricing_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  page_slug: text("page_slug").notNull(), // 'studios', 'studios-addons'
  label: text("label").notNull(),
  description: text("description").notNull(),
  rate: text("rate").notNull(),
  sort_order: integer("sort_order").notNull(),
});

export const terms_sections = sqliteTable("terms_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  body: text("body").notNull(), // can be JSON string array of bullets
  sort_order: integer("sort_order").notNull(),
});

export const youtube_videos = sqliteTable("youtube_videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  youtube_url: text("youtube_url").notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(), // format: pbkdf2$sha256$iterations$salt$hash
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email_verified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  failed_login_attempts: integer("failed_login_attempts").notNull().default(0),
  locked_until: integer("locked_until", { mode: "timestamp" }),
  session_version: integer("session_version").notNull().default(1),
  razorpay_customer_id: text("razorpay_customer_id"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const password_reset_tokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
});

export const email_verification_tokens = sqliteTable("email_verification_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
});

export const rate_limits = sqliteTable("rate_limits", {
  id: text("id").primaryKey(), // Format: action_identifier (e.g. "login_192.168.1.1")
  count: integer("count").notNull().default(1),
  reset_at: integer("reset_at", { mode: "timestamp" }).notNull(),
});

/**
 * Inbound leads from the /tech page contact section (spec 4.7).
 *
 * Persisted as well as emailed so an inquiry is never lost to a Resend outage
 * or a missing API key — the email is a notification, this table is the record.
 */
export const tech_inquiries = sqliteTable("tech_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  name: text("name"),
  /** Which audience track they came through, if they picked one: 'business' | 'personal' */
  track: text("track"),
  message: text("message").notNull(),
  /** Set false if the notification email failed, so it can be retried/reviewed. */
  notified: integer("notified", { mode: "boolean" }).notNull().default(false),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").notNull(),
  title: text("title").notNull(), // e.g., "Studio Rental - 4 Hrs"
  total_amount: integer("total_amount").notNull(), // Amount in smallest currency unit (e.g. paise for INR)
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'cancelled'
  razorpay_order_id: text("razorpay_order_id"),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ══════════════════════════════════════════════════════════════════════
   G3 Builders & Architecture — spec section 5
   ──────────────────────────────────────────────────────────────────────
   Tables are prefixed `g3_` rather than sharing VerspeKtive's. The spec
   calls G3 "its own database"; since both brands now run from one D1
   binding, the prefix is how that separation is preserved — it also
   avoids a direct collision on `pages`, which already exists.

   `g3_media` is the single source of truth for every uploaded asset.
   Nothing in G3 stores a file path directly: projects, services, team,
   testimonials and page heroes all reference media by id. That indirection
   is what makes the no-code admin in section 5a possible.
   ══════════════════════════════════════════════════════════════════════ */

export const g3_media = sqliteTable("g3_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),                       // 'image' | 'video'
  r2_key: text("r2_key").notNull().unique(),
  url: text("url").notNull(),
  alt_text: text("alt_text").notNull().default(""),   // required at upload (spec 5a → SEO, spec 7)
  width: integer("width"),
  height: integer("height"),
  duration_seconds: integer("duration_seconds"),      // video only
  thumbnail_r2_key: text("thumbnail_r2_key"),         // video poster frame
  thumbnail_url: text("thumbnail_url"),
  size_bytes: integer("size_bytes"),
  mime_type: text("mime_type"),
  uploaded_at: integer("uploaded_at", { mode: "timestamp" }).notNull(),
  uploaded_by: text("uploaded_by"),
});

export const g3_projects = sqliteTable("g3_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),               // Residential | Commercial | Interiors | Concept
  location: text("location"),
  sqft: integer("sqft"),
  year: integer("year"),
  status: text("status").notNull().default("completed"), // completed | in-progress | concept
  client_name: text("client_name"),
  cover_media_id: integer("cover_media_id"),          // → g3_media.id
  summary: text("summary"),
  body: text("body"),                                 // narrative: brief / challenge / approach
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* Join table: an ordered gallery of many assets per project, so media can be
   reused and reordered without touching the project record (spec 5). */
export const g3_project_media = sqliteTable("g3_project_media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  project_id: integer("project_id").notNull(),        // → g3_projects.id
  media_id: integer("media_id").notNull(),            // → g3_media.id
  sort_order: integer("sort_order").notNull().default(0),
  caption: text("caption"),
});

export const g3_services = sqliteTable("g3_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  body: text("body"),
  icon_media_id: integer("icon_media_id"),            // → g3_media.id (nullable)
  sort_order: integer("sort_order").notNull().default(0),
});

export const g3_team_members = sqliteTable("g3_team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  photo_media_id: integer("photo_media_id"),          // → g3_media.id
  sort_order: integer("sort_order").notNull().default(0),
});

export const g3_testimonials = sqliteTable("g3_testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  client_name: text("client_name").notNull(),
  project_id: integer("project_id"),                  // → g3_projects.id
  quote: text("quote").notNull(),
  rating: integer("rating"),
  sort_order: integer("sort_order").notNull().default(0),
});

export const g3_inquiries = sqliteTable("g3_inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  project_type: text("project_type"),
  budget_range: text("budget_range"),
  location: text("location"),
  message: text("message"),
  status: text("status").notNull().default("new"),    // new | contacted | closed
  notified: integer("notified", { mode: "boolean" }).notNull().default(false),
  created_at: integer("created_at", { mode: "timestamp" }).notNull(),
});

/* Same shape as VerspeKtive's `pages`, plus hero_media_id so hero
   backgrounds are swappable from the admin without a deploy (spec 5). */
export const g3_pages = sqliteTable("g3_pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  section_key: text("section_key").notNull(),
  content_type: text("content_type").notNull(),       // text | richtext | media
  value: text("value").notNull().default(""),
  hero_media_id: integer("hero_media_id"),            // → g3_media.id
  updated_at: integer("updated_at", { mode: "timestamp" }).notNull(),
});
