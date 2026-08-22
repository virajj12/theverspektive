CREATE TABLE `team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`image_url` text NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `team_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer NOT NULL,
	`auto_scroll_speed` integer DEFAULT 3 NOT NULL
);
