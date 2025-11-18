-- Create applications table
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
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
