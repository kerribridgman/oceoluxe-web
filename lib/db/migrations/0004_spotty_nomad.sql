-- Applications table already exists from previous migration
-- Only creating link_settings table

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
DO $$ BEGIN
 ALTER TABLE "link_settings" ADD CONSTRAINT "link_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
-- Insert default link settings
INSERT INTO "link_settings" ("key", "label", "url") VALUES
  ('discovery_call', 'Book a Free Discovery Call', 'https://calendly.com/example/discovery'),
  ('strategy_session', 'Book a Free 30-Min Strategy Session', 'https://calendly.com/example/strategy')
ON CONFLICT (key) DO NOTHING;