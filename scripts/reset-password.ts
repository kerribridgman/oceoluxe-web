import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema';
import { hashPassword } from '../lib/auth/password';
import { eq } from 'drizzle-orm';

const EMAIL = 'kerrib@oceoluxe.com';
const NEW_PASSWORD = process.argv[2];

async function resetPassword() {
  if (!NEW_PASSWORD) {
    console.error('Usage: npx tsx scripts/reset-password.ts <new-password>');
    process.exit(1);
  }

  if (NEW_PASSWORD.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }

  // Find the user
  const [user] = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.email, EMAIL));

  if (!user) {
    console.error(`User not found: ${EMAIL}`);
    process.exit(1);
  }

  console.log(`Found user: ${user.email} (role: ${user.role})`);

  // Hash the new password
  const passwordHash = await hashPassword(NEW_PASSWORD);

  // Update the user
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  console.log(`Password reset successfully for ${EMAIL}`);
  process.exit(0);
}

resetPassword().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
