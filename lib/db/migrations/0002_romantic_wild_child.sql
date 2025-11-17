CREATE TABLE "seo_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"keywords" text,
	"og_title" varchar(255),
	"og_description" text,
	"og_image_url" text,
	"og_type" varchar(50) DEFAULT 'website',
	"twitter_card" varchar(50) DEFAULT 'summary_large_image',
	"twitter_title" varchar(255),
	"twitter_description" text,
	"twitter_image_url" text,
	"canonical_url" text,
	"meta_robots" varchar(50) DEFAULT 'index, follow',
	"updated_by" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_settings_page_unique" UNIQUE("page")
);
--> statement-breakpoint
ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;