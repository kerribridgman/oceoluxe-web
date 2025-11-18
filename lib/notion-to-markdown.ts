/**
 * Convert Notion blocks to Markdown
 * Works with the unofficial notion-client library
 */

type NotionBlock = {
  value: {
    id: string;
    type: string;
    properties?: Record<string, any[]>;
    format?: Record<string, any>;
    content?: string[];
  };
};

type RecordMap = {
  block: Record<string, NotionBlock>;
};

/**
 * Extract plain text from Notion rich text array
 */
function getPlainText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';

  return richText
    .map((segment) => {
      if (Array.isArray(segment)) {
        return segment[0] || '';
      }
      return segment || '';
    })
    .join('');
}

/**
 * Extract formatted text from Notion rich text array
 */
function getFormattedText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';

  return richText
    .map((segment) => {
      if (!Array.isArray(segment)) return '';

      const text = segment[0] || '';
      const formatting = segment[1];

      if (!formatting || formatting.length === 0) return text;

      let formatted = text;

      // Apply formatting
      formatting.forEach((format: string[]) => {
        const formatType = format[0];

        switch (formatType) {
          case 'b': // bold
            formatted = `**${formatted}**`;
            break;
          case 'i': // italic
            formatted = `*${formatted}*`;
            break;
          case 'c': // code
            formatted = `\`${formatted}\``;
            break;
          case 's': // strikethrough
            formatted = `~~${formatted}~~`;
            break;
          case 'a': // link
            const url = format[1];
            formatted = `[${formatted}](${url})`;
            break;
        }
      });

      return formatted;
    })
    .join('');
}

/**
 * Convert a single Notion block to Markdown
 */
function blockToMarkdown(block: NotionBlock, recordMap: RecordMap, level: number = 0): string {
  const { type, properties, format, content } = block.value;

  // Get block text content
  const getText = () => {
    if (!properties?.title) return '';
    return getFormattedText(properties.title);
  };

  let markdown = '';

  switch (type) {
    case 'page':
      // Page title - use as H1
      markdown = `# ${getText()}\n\n`;
      break;

    case 'header':
    case 'sub_header':
    case 'sub_sub_header':
      const headerLevel = type === 'header' ? 1 : type === 'sub_header' ? 2 : 3;
      markdown = `${'#'.repeat(headerLevel)} ${getText()}\n\n`;
      break;

    case 'text':
      const text = getText();
      if (text) {
        markdown = `${text}\n\n`;
      }
      break;

    case 'bulleted_list':
    case 'numbered_list':
      // Convert all lists to bullet lists for consistency
      markdown = `- ${getText()}\n`;
      break;

    case 'to_do':
      const checked = properties?.checked?.[0]?.[0] === 'Yes';
      markdown = `- [${checked ? 'x' : ' '}] ${getText()}\n`;
      break;

    case 'quote':
      markdown = `> ${getText()}\n\n`;
      break;

    case 'code':
      const language = properties?.language?.[0]?.[0] || '';
      const code = getText();
      markdown = `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
      break;

    case 'image':
      const imageUrl = format?.display_source || properties?.source?.[0]?.[0] || '';
      const caption = properties?.caption ? getPlainText(properties.caption) : '';
      markdown = `![${caption}](${imageUrl})\n\n`;
      break;

    case 'divider':
      markdown = `---\n\n`;
      break;

    case 'callout':
      const calloutText = getText();
      markdown = `> 💡 ${calloutText}\n\n`;
      break;

    case 'bookmark':
      const bookmarkUrl = properties?.link?.[0]?.[0] || '';
      const bookmarkTitle = properties?.title ? getPlainText(properties.title) : bookmarkUrl;
      markdown = `[${bookmarkTitle}](${bookmarkUrl})\n\n`;
      break;

    default:
      // For unknown types, try to extract text
      const unknownText = getText();
      if (unknownText) {
        markdown = `${unknownText}\n\n`;
      }
  }

  // Process child blocks
  if (content && Array.isArray(content)) {
    for (const childId of content) {
      const childBlock = recordMap.block[childId];
      if (childBlock) {
        const childMarkdown = blockToMarkdown(childBlock, recordMap, level + 1);

        // Indent child blocks for lists
        if (type === 'bulleted_list' || type === 'numbered_list' || type === 'to_do') {
          markdown += childMarkdown.split('\n').map(line => line ? `  ${line}` : line).join('\n');
        } else {
          markdown += childMarkdown;
        }
      }
    }
  }

  return markdown;
}

/**
 * Convert UUID to hyphenated format if needed
 */
function formatUuid(id: string): string {
  // If already hyphenated, return as-is
  if (id.includes('-')) return id;

  // Convert 32-char hex to UUID format: 8-4-4-4-12
  if (id.length === 32) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }

  return id;
}

/**
 * Find the page block in recordMap (handles both hyphenated and non-hyphenated UUIDs)
 */
function findPageBlock(recordMap: RecordMap, pageId: string): NotionBlock | null {
  // Try the ID as-is
  if (recordMap.block[pageId]) {
    return recordMap.block[pageId];
  }

  // Try hyphenated format
  const hyphenatedId = formatUuid(pageId);
  if (recordMap.block[hyphenatedId]) {
    return recordMap.block[hyphenatedId];
  }

  // Try non-hyphenated format
  const nonHyphenatedId = pageId.replace(/-/g, '');
  if (recordMap.block[nonHyphenatedId]) {
    return recordMap.block[nonHyphenatedId];
  }

  return null;
}

/**
 * Convert a Notion page (recordMap) to Markdown
 */
export function notionToMarkdown(recordMap: RecordMap, pageId: string): string {
  const rootBlock = findPageBlock(recordMap, pageId);

  if (!rootBlock) {
    // Debug: log available block IDs
    console.error('Available block IDs:', Object.keys(recordMap.block).slice(0, 5));
    console.error('Looking for pageId:', pageId);
    throw new Error('Page not found in recordMap');
  }

  let markdown = '';

  // Process the page and all its content blocks
  const content = rootBlock.value.content || [];

  for (const blockId of content) {
    const block = recordMap.block[blockId];
    if (block) {
      markdown += blockToMarkdown(block, recordMap);
    }
  }

  return markdown.trim();
}

/**
 * Extract page title from recordMap
 */
export function getPageTitle(recordMap: RecordMap, pageId: string): string {
  const rootBlock = findPageBlock(recordMap, pageId);

  if (!rootBlock?.value?.properties?.title) {
    return 'Untitled';
  }

  return getPlainText(rootBlock.value.properties.title);
}
