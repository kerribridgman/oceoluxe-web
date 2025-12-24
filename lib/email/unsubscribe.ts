import { db } from '@/lib/db/drizzle';
import { unsubscribeTokens, emailList } from '@/lib/db/schema';
import { eq, and, isNull, gt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export type UnsubscribeListType = 'marketing' | 'drips' | 'all';

/**
 * Generate a secure unsubscribe token for an email list entry
 */
export async function generateUnsubscribeToken(
  emailListId: number,
  listType: UnsubscribeListType = 'all'
): Promise<string> {
  // Generate a secure random token
  const token = randomBytes(32).toString('hex');

  // Token expires in 30 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store the token
  await db.insert(unsubscribeTokens).values({
    emailListId,
    token,
    listType,
    expiresAt,
  });

  return token;
}

/**
 * Validate an unsubscribe token and return the associated email list entry
 */
export async function validateUnsubscribeToken(token: string) {
  const [tokenRecord] = await db
    .select({
      id: unsubscribeTokens.id,
      emailListId: unsubscribeTokens.emailListId,
      listType: unsubscribeTokens.listType,
      usedAt: unsubscribeTokens.usedAt,
      expiresAt: unsubscribeTokens.expiresAt,
    })
    .from(unsubscribeTokens)
    .where(eq(unsubscribeTokens.token, token))
    .limit(1);

  if (!tokenRecord) {
    return { valid: false, error: 'Invalid token' };
  }

  if (tokenRecord.usedAt) {
    return { valid: false, error: 'Token already used' };
  }

  if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
    return { valid: false, error: 'Token expired' };
  }

  // Get the email list entry
  const [emailEntry] = await db
    .select()
    .from(emailList)
    .where(eq(emailList.id, tokenRecord.emailListId))
    .limit(1);

  if (!emailEntry) {
    return { valid: false, error: 'Email not found' };
  }

  return {
    valid: true,
    tokenId: tokenRecord.id,
    emailListId: tokenRecord.emailListId,
    listType: tokenRecord.listType as UnsubscribeListType,
    email: emailEntry.email,
    firstName: emailEntry.firstName,
    currentPreferences: {
      marketing: !emailEntry.unsubscribedFromMarketing,
      drips: !emailEntry.unsubscribedFromDrips,
      all: !emailEntry.unsubscribedFromAll,
    },
  };
}

/**
 * Process an unsubscribe request
 */
export async function processUnsubscribe(
  token: string,
  listType: UnsubscribeListType,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const validation = await validateUnsubscribeToken(token);

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const now = new Date();

  // Update the email list entry based on list type
  const updates: Record<string, boolean | Date | string | null> = {
    unsubscribedAt: now,
    unsubscribeReason: reason || null,
    updatedAt: now,
  };

  if (listType === 'all') {
    updates.unsubscribedFromAll = true;
    updates.unsubscribedFromMarketing = true;
    updates.unsubscribedFromDrips = true;
  } else if (listType === 'marketing') {
    updates.unsubscribedFromMarketing = true;
  } else if (listType === 'drips') {
    updates.unsubscribedFromDrips = true;
  }

  await db
    .update(emailList)
    .set(updates)
    .where(eq(emailList.id, validation.emailListId!));

  // Mark the token as used
  await db
    .update(unsubscribeTokens)
    .set({ usedAt: now })
    .where(eq(unsubscribeTokens.token, token));

  return { success: true };
}

/**
 * Generate an unsubscribe URL for an email
 */
export async function getUnsubscribeUrl(
  emailListId: number,
  listType: UnsubscribeListType = 'all',
  baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://oceoluxe.com'
): Promise<string> {
  const token = await generateUnsubscribeToken(emailListId, listType);
  return `${baseUrl}/unsubscribe?token=${token}`;
}

/**
 * Get or create an email list entry for a given email
 */
export async function getOrCreateEmailListEntry(
  email: string,
  source: 'lead' | 'quiz_lead' | 'member' | 'client' | 'manual',
  sourceId?: number,
  additionalData?: {
    firstName?: string;
    lastName?: string;
    productName?: string;
    archetype?: string;
    membershipTier?: string;
    clientPackage?: string;
    instagramHandle?: string;
  }
) {
  // Check if already exists
  const [existing] = await db
    .select()
    .from(emailList)
    .where(eq(emailList.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    return existing;
  }

  // Create new entry
  const [entry] = await db
    .insert(emailList)
    .values({
      email: email.toLowerCase(),
      source,
      sourceId,
      firstName: additionalData?.firstName || null,
      lastName: additionalData?.lastName || null,
      productName: additionalData?.productName || null,
      archetype: additionalData?.archetype || null,
      membershipTier: additionalData?.membershipTier || null,
      clientPackage: additionalData?.clientPackage || null,
      instagramHandle: additionalData?.instagramHandle || null,
    })
    .returning();

  return entry;
}
