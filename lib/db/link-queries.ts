import { db } from './drizzle';
import { linkSettings } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Get all link settings
 */
export async function getLinkSettings() {
  try {
    const links = await db.select().from(linkSettings);

    // Convert to a map for easy lookup
    const linkMap: Record<string, { label: string; url: string }> = {};
    links.forEach(link => {
      linkMap[link.key] = {
        label: link.label,
        url: link.url,
      };
    });

    return linkMap;
  } catch (error) {
    console.error('Error fetching link settings:', error);
    // Return defaults if there's an error
    return {
      discovery_call: {
        label: 'Book a Free Discovery Call',
        url: 'https://calendly.com/example/discovery',
      },
      strategy_session: {
        label: 'Book a Free 30-Min Strategy Session',
        url: 'https://calendly.com/example/strategy',
      },
    };
  }
}

/**
 * Get a specific link by key
 */
export async function getLink(key: string) {
  try {
    const [link] = await db
      .select()
      .from(linkSettings)
      .where(eq(linkSettings.key, key))
      .limit(1);

    if (!link) {
      return null;
    }

    return {
      label: link.label,
      url: link.url,
    };
  } catch (error) {
    console.error(`Error fetching link ${key}:`, error);
    return null;
  }
}
