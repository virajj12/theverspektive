CREATE TABLE `youtube_videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`youtube_url` text NOT NULL,
	`thumbnail_url` text NOT NULL,
	`created_at` integer NOT NULL
);
