/**
 * Utility functions for importing content from Notion
 */

/**
 * Extract Notion page ID from any Notion URL format
 * Supports:
 * - https://www.notion.so/workspace/Page-Title-{32-char-id}
 * - https://workspace.notion.site/Page-Title-{32-char-id}
 * - https://notion.so/{32-char-id}
 * - Custom domains: https://lightclub.notion.site/Page-Title-{32-char-id}
 */
export function extractNotionPageId(url: string): string | null {
  try {
    // Match the 32-character hex ID pattern
    const idPattern = /([0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
    const match = url.match(idPattern);

    if (match && match[1]) {
      // Remove hyphens if present to get the raw 32-character ID
      return match[1].replace(/-/g, '');
    }

    return null;
  } catch (error) {
    console.error('Error extracting Notion page ID:', error);
    return null;
  }
}

/**
 * Validate if a URL is a valid Notion URL
 */
export function isValidNotionUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check if it's a Notion domain
    const isNotionDomain =
      hostname === 'notion.so' ||
      hostname === 'www.notion.so' ||
      hostname.endsWith('.notion.site') ||
      hostname.endsWith('.notion.so');

    // Check if we can extract a page ID
    const hasPageId = extractNotionPageId(url) !== null;

    return isNotionDomain && hasPageId;
  } catch (error) {
    return false;
  }
}

/**
 * Extract image URLs from markdown content
 * Matches patterns like: ![alt](url) or ![alt](url "title")
 */
export function extractImageUrls(markdown: string): string[] {
  const imagePattern = /!\[.*?\]\((https?:\/\/[^\s)"]+)/g;
  const urls: string[] = [];
  let match;

  while ((match = imagePattern.exec(markdown)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
}

/**
 * Replace image URLs in markdown content
 */
export function replaceImageUrls(
  markdown: string,
  urlMap: Map<string, string>
): string {
  let updatedMarkdown = markdown;

  urlMap.forEach((newUrl, oldUrl) => {
    // Escape special regex characters in the old URL
    const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedOldUrl, 'g');
    updatedMarkdown = updatedMarkdown.replace(regex, newUrl);
  });

  return updatedMarkdown;
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  if (!title) {
    return `untitled-${Date.now()}`;
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract a brief excerpt from markdown content
 * @param markdown The markdown content
 * @param maxLength Maximum length of excerpt (default: 200)
 */
export function extractExcerpt(markdown: string, maxLength: number = 200): string {
  // Remove markdown formatting
  let text = markdown
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/>\s/g, '') // Remove blockquotes
    .replace(/[-*+]\s/g, '') // Remove list markers
    .trim();

  // Get first paragraph or first maxLength characters
  const firstParagraph = text.split('\n\n')[0];

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  // Truncate at word boundary
  const truncated = firstParagraph.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}
