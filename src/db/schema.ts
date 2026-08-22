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
