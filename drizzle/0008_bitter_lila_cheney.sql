CREATE TABLE `g3_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`project_type` text,
	`budget_range` text,
	`location` text,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`notified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `g3_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`r2_key` text NOT NULL,
	`url` text NOT NULL,
	`alt_text` text DEFAULT '' NOT NULL,
	`width` integer,
	`height` integer,
	`duration_seconds` integer,
	`thumbnail_r2_key` text,
	`thumbnail_url` text,
	`size_bytes` integer,
	`mime_type` text,
	`uploaded_at` integer NOT NULL,
	`uploaded_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `g3_media_r2_key_unique` ON `g3_media` (`r2_key`);--> statement-breakpoint
CREATE TABLE `g3_pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`section_key` text NOT NULL,
	`content_type` text NOT NULL,
	`value` text DEFAULT '' NOT NULL,
	`hero_media_id` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `g3_project_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`media_id` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`caption` text
);
--> statement-breakpoint
CREATE TABLE `g3_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`location` text,
	`sqft` integer,
	`year` integer,
	`status` text DEFAULT 'completed' NOT NULL,
	`client_name` text,
	`cover_media_id` integer,
	`summary` text,
	`body` text,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `g3_projects_slug_unique` ON `g3_projects` (`slug`);--> statement-breakpoint
CREATE TABLE `g3_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text,
	`body` text,
	`icon_media_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `g3_services_slug_unique` ON `g3_services` (`slug`);--> statement-breakpoint
CREATE TABLE `g3_team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`bio` text,
	`photo_media_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `g3_testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_name` text NOT NULL,
	`project_id` integer,
	`quote` text NOT NULL,
	`rating` integer,
	`sort_order` integer DEFAULT 0 NOT NULL
);
