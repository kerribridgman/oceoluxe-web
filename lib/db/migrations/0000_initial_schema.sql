-- Migration: 0000_initial_schema
-- Created: 2025-11-20
-- Description: Initial schema with all 15 tables for oceoluxe application
-- This migration creates the complete database schema including:
-- - User authentication and team management
-- - Blog and SEO management
-- - Application submissions
-- - API key management (MCP and MMFC)
-- - MMFC integration (products, services, scheduling links)
-- - Analytics settings

-- =============================================================================
-- INDEPENDENT TABLES (no foreign key dependencies)
-- =============================================================================

-- Users table: Core authentication and user management
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint

-- Teams table: Organization/team management with Stripe integration
CREATE TABLE IF NOT EXISTS "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"plan_name" varchar(50),
	"subscription_status" varchar(20),
	CONSTRAINT "teams_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "teams_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint

-- =============================================================================
-- TABLES WITH FOREIGN KEY DEPENDENCIES ON USERS AND TEAMS
-- =============================================================================

-- Team Members: Junction table for users and teams
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Activity Logs: Audit trail for team activities
CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45)
);
--> statement-breakpoint

-- Invitations: Team member invitations
CREATE TABLE IF NOT EXISTS "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"invited_by" integer NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint

-- Blog Posts: Content management with SEO fields
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"author" varchar(100) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"content_json" jsonb,
	"cover_image_url" text,
	"og_image_url" text,
	"og_title" varchar(255),
	"og_description" text,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"meta_keywords" text,
	"focus_keyword" varchar(100),
	"canonical_url" text,
	"meta_robots" varchar(50) DEFAULT 'index, follow',
	"article_type" varchar(50) DEFAULT 'BlogPosting',
	"industry" varchar(100),
	"target_audience" text,
	"key_concepts" text,
	"published_at" timestamp,
	"is_published" boolean DEFAULT false,
	"reading_time_minutes" integer,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint

-- SEO Settings: Page-specific SEO configuration
CREATE TABLE IF NOT EXISTS "seo_settings" (
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

-- Applications: Application submissions for coaching or entrepreneur circle
CREATE TABLE IF NOT EXISTS "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"social_handle" varchar(255) NOT NULL,
	"interest" text NOT NULL,
	"experiences" text NOT NULL,
	"growth_areas" text NOT NULL,
	"obstacles" text NOT NULL,
	"willing_to_invest" varchar(10) NOT NULL,
	"additional_info" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Link Settings: Configurable external links (e.g., calendly, booking links)
CREATE TABLE IF NOT EXISTS "link_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"updated_by" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "link_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint

-- MCP API Keys: API keys for Model Context Protocol access
CREATE TABLE IF NOT EXISTS "mcp_api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" varchar(10) NOT NULL,
	"permissions" jsonb DEFAULT '{"blog": ["read", "write"]}'::jsonb NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- MMFC API Keys: Integration with Make Money From Coding platform
CREATE TABLE IF NOT EXISTS "mmfc_api_keys" (
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

-- Analytics Settings: User-specific analytics configuration
CREATE TABLE IF NOT EXISTS "analytics_settings" (
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

-- =============================================================================
-- TABLES WITH DEPENDENCIES ON MMFC_API_KEYS
-- =============================================================================

-- MMFC Products: Synced products from Make Money From Coding
CREATE TABLE IF NOT EXISTS "mmfc_products" (
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

-- MMFC Scheduling Links: Synced scheduling links from MMFC
CREATE TABLE IF NOT EXISTS "mmfc_scheduling_links" (
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
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- MMFC Services: Synced services from Make Money From Coding
CREATE TABLE IF NOT EXISTS "mmfc_services" (
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

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS
-- =============================================================================

-- Team Members foreign keys
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Activity Logs foreign keys
DO $$ BEGIN
 ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Invitations foreign keys
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Blog Posts foreign keys
DO $$ BEGIN
 ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- SEO Settings foreign keys
DO $$ BEGIN
 ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Applications foreign keys
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Link Settings foreign keys
DO $$ BEGIN
 ALTER TABLE "link_settings" ADD CONSTRAINT "link_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- MCP API Keys foreign keys
DO $$ BEGIN
 ALTER TABLE "mcp_api_keys" ADD CONSTRAINT "mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- MMFC API Keys foreign keys
DO $$ BEGIN
 ALTER TABLE "mmfc_api_keys" ADD CONSTRAINT "mmfc_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Analytics Settings foreign keys
DO $$ BEGIN
 ALTER TABLE "analytics_settings" ADD CONSTRAINT "analytics_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- MMFC Products foreign keys
DO $$ BEGIN
 ALTER TABLE "mmfc_products" ADD CONSTRAINT "mmfc_products_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- MMFC Scheduling Links foreign keys
DO $$ BEGIN
 ALTER TABLE "mmfc_scheduling_links" ADD CONSTRAINT "mmfc_scheduling_links_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- MMFC Services foreign keys (with CASCADE delete)
DO $$ BEGIN
 ALTER TABLE "mmfc_services" ADD CONSTRAINT "mmfc_services_api_key_id_mmfc_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."mmfc_api_keys"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for foreign keys (improves join performance)
CREATE INDEX IF NOT EXISTS "idx_team_members_user_id" ON "team_members"("user_id");
CREATE INDEX IF NOT EXISTS "idx_team_members_team_id" ON "team_members"("team_id");
CREATE INDEX IF NOT EXISTS "idx_activity_logs_team_id" ON "activity_logs"("team_id");
CREATE INDEX IF NOT EXISTS "idx_activity_logs_user_id" ON "activity_logs"("user_id");
CREATE INDEX IF NOT EXISTS "idx_invitations_team_id" ON "invitations"("team_id");
CREATE INDEX IF NOT EXISTS "idx_invitations_email" ON "invitations"("email");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_created_by" ON "blog_posts"("created_by");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_is_published" ON "blog_posts"("is_published");
CREATE INDEX IF NOT EXISTS "idx_blog_posts_published_at" ON "blog_posts"("published_at");
CREATE INDEX IF NOT EXISTS "idx_mcp_api_keys_user_id" ON "mcp_api_keys"("user_id");
CREATE INDEX IF NOT EXISTS "idx_mmfc_api_keys_user_id" ON "mmfc_api_keys"("user_id");
CREATE INDEX IF NOT EXISTS "idx_mmfc_products_api_key_id" ON "mmfc_products"("api_key_id");
CREATE INDEX IF NOT EXISTS "idx_mmfc_products_external_id" ON "mmfc_products"("external_id");
CREATE INDEX IF NOT EXISTS "idx_mmfc_scheduling_links_api_key_id" ON "mmfc_scheduling_links"("api_key_id");
CREATE INDEX IF NOT EXISTS "idx_mmfc_services_api_key_id" ON "mmfc_services"("api_key_id");
CREATE INDEX IF NOT EXISTS "idx_analytics_settings_user_id" ON "analytics_settings"("user_id");
