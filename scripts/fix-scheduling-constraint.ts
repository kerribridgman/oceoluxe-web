import { db } from '../lib/db/drizzle';
import { sql } from 'drizzle-orm';

async function fixConstraint() {
  try {
    console.log('Adding unique constraint to mmfc_scheduling_links...');

    await db.execute(sql`
      ALTER TABLE mmfc_scheduling_links
      ADD CONSTRAINT IF NOT EXISTS mmfc_scheduling_links_api_key_id_external_id_unique
      UNIQUE (api_key_id, external_id);
    `);

    console.log('✓ Constraint added successfully!');
    process.exit(0);
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('✓ Constraint already exists!');
      process.exit(0);
    }
    console.error('Error adding constraint:', error);
    process.exit(1);
  }
}

fixConstraint();
