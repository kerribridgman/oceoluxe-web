CREATE TABLE "analytics_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"google_analytics_id" varchar(255),
	"google_tag_manager_id" varchar(255),
	"plausible_domain" varchar(255),
	"plausible_api_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analytics_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "mmfc_scheduling_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_key_id" integer NOT NULL,
	"external_id" integer NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"duration_minutes" integer NOT NULL,
	"booking_url" text NOT NULL,
	"max_advance_booking_days" integer,
	"min_notice_minutes" integer,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mmfc_scheduling_links_api_key_id_external_id_key" UNIQUE("api_key_id","external_id")
);
--> statement-breakpoint
CREATE TABLE "mmfc_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"api_key_id" integer NOT NULL,
	"external_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"url" text,
	"description" text,
	"pricing_type" varchar(50),
	"price" numeric(10, 2),
	"sale_price" numeric(10, 2),
	"featured_image_url" text,
	"cover_image" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mmfc_services_api_key_id_external_id_key" UNIQUE("api_key_id","external_id")
);
--> statement-breakpoint
CREATE TABLE "notion_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"notion_page_id" varchar(100) NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"description" text,
	"content" text,
	"excerpt" text,
	"price" varchar(50),
	"sale_price" varchar(50),
	"product_type" varchar(100),
	"category" varchar(100),
	"cover_image_url" text,
	"checkout_url" text,
	"preview_url" text,
	"is_published" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notion_products_notion_page_id_unique" UNIQUE("notion_page_id"),
	CONSTRAINT "notion_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "analytics_settings" ADD CONSTRAINT "analytics_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mmfc_scheduling_links" ADD CONSTRAINT "mmfc_scheduling_links_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mmfc_services" ADD CONSTRAINT "mmfc_services_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notion_products" ADD CONSTRAINT "notion_products_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;