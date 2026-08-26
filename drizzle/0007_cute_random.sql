CREATE TABLE `tech_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`track` text,
	`message` text NOT NULL,
	`notified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
