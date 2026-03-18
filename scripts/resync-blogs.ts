import 'dotenv/config';
import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { syncNotionBlogPosts } from '../lib/notion-blog-sync';

const ADMIN_EMAIL = 'kerrib@oceoluxe.com';

async function resyncBlogs() {
  console.log('🔄 Starting Notion blog re-sync...\n');

  // Get admin user
  const adminUser = await db.query.users.findFirst({
    where: eq(users.email, ADMIN_EMAIL),
  });

  if (!adminUser) {
    console.error(`❌ User not found: ${ADMIN_EMAIL}`);
    process.exit(1);
  }

  console.log(`✅ User: ${adminUser.email} (ID: ${adminUser.id})`);
  console.log(`📡 Notion DB: ${process.env.NOTION_BLOG_DATABASE_ID}\n`);

  const result = await syncNotionBlogPosts(
    adminUser.id,
    (progress) => {
      const icon = progress.status === 'error' ? '❌' : progress.status === 'updated' ? '🔄' : '✨';
      console.log(`  ${icon} [${progress.current}/${progress.total}] ${progress.currentTitle} → ${progress.status}`);
    }
  );

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Sync complete: ${result.synced} posts synced`);
  console.log(`📊 Results: ${result.posts.filter(p => p.status === 'created').length} created, ${result.posts.filter(p => p.status === 'updated').length} updated`);

  if (result.errors.length > 0) {
    console.log(`\n⚠️  Errors (${result.errors.length}):`);
    result.errors.forEach(e => console.log(`  - ${e}`));
  }

  process.exit(0);
}

resyncBlogs().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
