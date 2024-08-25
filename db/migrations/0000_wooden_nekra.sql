CREATE TABLE `api_keys` (
	`id` integer PRIMARY KEY NOT NULL,
	`api_key` text NOT NULL,
	`description` text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `url_analytics` (
	`id` integer PRIMARY KEY NOT NULL,
	`short_code` text NOT NULL,
	`click_count` integer DEFAULT 0,
	FOREIGN KEY (`short_code`) REFERENCES `urls`(`short_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `urls` (
	`id` integer PRIMARY KEY NOT NULL,
	`short_code` text NOT NULL,
	`url` text NOT NULL,
	`expiration_date` integer,
	`og_title` text DEFAULT 'Untitled',
	`og_description` text DEFAULT 'No description available',
	`og_image` text DEFAULT 'https://via.placeholder.com/1200x630?text=No+Image'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_api_key_unique` ON `api_keys` (`api_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `urls_short_code_unique` ON `urls` (`short_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);