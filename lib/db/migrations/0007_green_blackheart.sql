CREATE TABLE "mmfc_api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"api_key" text NOT NULL,
	"base_url" varchar(500) DEFAULT 'https://makemoneyfromcoding.com' NOT NULL,
	"auto_sync" boolean DEFAULT false NOT NULL,
	"sync_frequency" varchar(20) DEFAULT 'daily',
	"last_sync_at" timestamp,
	"last_sync_status" varchar(20),
	"last_sync_error" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mmfc_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_key_id" integer NOT NULL,
	"external_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"description" text,
	"pricing_type" varchar(50),
	"price" varchar(20),
	"sale_price" varchar(20),
	"delivery_type" varchar(50),
	"cover_image" text,
	"featured_image_url" text,
	"featured_image_alt" varchar(500),
	"images" jsonb,
	"video_url" text,
	"has_files" boolean DEFAULT false NOT NULL,
	"file_count" integer DEFAULT 0 NOT NULL,
	"has_repository" boolean DEFAULT false NOT NULL,
	"checkout_url" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mmfc_api_keys" ADD CONSTRAINT "mmfc_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mmfc_products" ADD CONSTRAINT "mmfc_products_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE no action ON UPDATE no action;