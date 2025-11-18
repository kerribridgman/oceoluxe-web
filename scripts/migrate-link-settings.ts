import { sql } from 'drizzle-orm';
import { db } from '../lib/db/drizzle';

async function migrate() {
  try {
    console.log('Creating link_settings table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "link_settings" (
        "id" serial PRIMARY KEY NOT NULL,
        "key" varchar(100) NOT NULL,
        "label" varchar(255) NOT NULL,
        "url" text NOT NULL,
        "updated_by" integer,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "link_settings_key_unique" UNIQUE("key")
      );
    `);

    try {
      await db.execute(sql`
        ALTER TABLE "link_settings"
        ADD CONSTRAINT "link_settings_updated_by_users_id_fk"
        FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id")
        ON DELETE no action ON UPDATE no action;
      `);
    } catch (error: any) {
      // Ignore if constraint already exists
      if (error.code !== '42710') {
        throw error;
      }
    }

    console.log('Inserting default link settings...');

    await db.execute(sql`
      INSERT INTO "link_settings" ("key", "label", "url") VALUES
        ('discovery_call', 'Book a Free Discovery Call', 'https://calendly.com/example/discovery'),
        ('strategy_session', 'Book a Free 30-Min Strategy Session', 'https://calendly.com/example/strategy')
      ON CONFLICT (key) DO NOTHING;
    `);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
