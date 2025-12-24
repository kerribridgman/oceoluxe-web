import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_aqu1IEv6SRYQ@ep-summer-fog-ahr42rdt-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function migrate() {
  try {
    await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS token varchar(255) UNIQUE`;
    await sql`ALTER TABLE invitations ADD COLUMN IF NOT EXISTS expires_at timestamp`;
    console.log('Migration successful: Added token and expires_at columns to invitations table');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
