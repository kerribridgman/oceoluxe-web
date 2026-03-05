/**
 * Utility function to clean Notion-to-markdown output
 * Removes empty bullet points, broken images, and other artifacts
 */

export interface CleanedContent {
  content: string;
  tallyFormIds: string[];
  stripeButtons: StripeButton[];
}

export interface StripeButton {
  buyButtonId: string;
  publishableKey: string;
}

/**
 * Clean markdown content from Notion, removing artifacts and extracting embeds
 */
export function cleanNotionMarkdown(content: string): CleanedContent {
  const tallyFormIds: string[] = [];
  const stripeButtons: StripeButton[] = [];

  // Find all Tally form IDs in the content
  const tallyMatches = content.matchAll(/tally\.so\/(?:embed|r)\/([a-zA-Z0-9]+)/g);
  for (const match of tallyMatches) {
    if (match[1] && !tallyFormIds.includes(match[1])) {
      tallyFormIds.push(match[1]);
    }
  }

  // Find all Stripe buy buttons in the content
  const stripeMatches = content.matchAll(/<stripe-buy-button[\s\S]*?buy-button-id=["']([^"']+)["'][\s\S]*?publishable-key=["']([^"']+)["'][\s\S]*?(?:\/>|<\/stripe-buy-button>)/gi);
  for (const match of stripeMatches) {
    if (match[1] && match[2]) {
      const exists = stripeButtons.some(b => b.buyButtonId === match[1]);
      if (!exists) {
        stripeButtons.push({
          buyButtonId: match[1],
          publishableKey: match[2]
        });
      }
    }
  }

  // Also try alternate attribute order
  const stripeMatchesAlt = content.matchAll(/<stripe-buy-button[\s\S]*?publishable-key=["']([^"']+)["'][\s\S]*?buy-button-id=["']([^"']+)["'][\s\S]*?(?:\/>|<\/stripe-buy-button>)/gi);
  for (const match of stripeMatchesAlt) {
    if (match[1] && match[2]) {
      const exists = stripeButtons.some(b => b.buyButtonId === match[2]);
      if (!exists) {
        stripeButtons.push({
          buyButtonId: match[2],
          publishableKey: match[1]
        });
      }
    }
  }

  let cleaned = content;

  // Remove code blocks that contain embed code
  cleaned = cleaned.replace(/```(?:javascript|js|html)?\s*\n?super-embed:[\s\S]*?```/gi, '');
  cleaned = cleaned.replace(/```(?:javascript|js|html)?\s*\n?[\s\S]*?<stripe-buy-button[\s\S]*?```/gi, '');
  cleaned = cleaned.replace(/```(?:javascript|js|html)?\s*\n?[\s\S]*?tally\.so[\s\S]*?```/gi, '');

  // Remove super-embed blocks
  cleaned = cleaned.replace(/super-embed:\s*\n?<iframe[\s\S]*?<\/iframe>\s*\n?<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/super-embed:\s*\n?<iframe[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/super-embed:\s*/gi, '');

  // Remove raw HTML tags
  cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<stripe-buy-button[\s\S]*?(?:\/>|<\/stripe-buy-button>)/gi, '');

  // Remove tally embed URLs
  cleaned = cleaned.replace(/https?:\/\/tally\.so\/embed\/[a-zA-Z0-9]+[^\s]*/gi, '');

  // Remove broken image references (images with just filenames, no URLs)
  cleaned = cleaned.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/gi, '');

  // Remove images pointing to Notion's temporary S3 URLs (they expire quickly)
  cleaned = cleaned.replace(/!\[[^\]]*\]\(https?:\/\/prod-files-secure\.s3[^)]+\)/gi, '');

  // Remove standalone image filenames (on their own line only — not within URLs)
  cleaned = cleaned.replace(/^[A-Za-z0-9_-]+\.(jpe?g|png|gif|webp|svg)$/gim, '');

  // Convert inline checkmarks into list items
  // Note: Use Unicode escapes to avoid accidentally matching variation selectors (U+FE0F)
  // ✓ = U+2713, ✔ = U+2714, ✔️ = U+2714 + U+FE0F
  cleaned = cleaned.replace(/([^\n])\s*[\u2713\u2714][\uFE0F]?\s*/g, '$1\n- ');
  cleaned = cleaned.replace(/^\s*[\u2713\u2714][\uFE0F]?\s*/gm, '- ');

  // Remove empty list items (markdown style - single dash/asterisk with optional whitespace)
  cleaned = cleaned.replace(/^-\s*$/gm, '');
  cleaned = cleaned.replace(/^\*\s*$/gm, '');

  // Remove nested empty list items (multiple dashes/asterisks like "- - " or "  - - ")
  cleaned = cleaned.replace(/^\s*[-*]\s+[-*]\s*$/gm, '');
  cleaned = cleaned.replace(/^\s*[-*]\s*[-*]\s*$/gm, '');

  // Remove lines that are just whitespace + list markers + whitespace
  cleaned = cleaned.replace(/^\s*[-*]+\s*$/gm, '');

  // Remove empty bullet point lines (• or multiple bullets with just spaces)
  // This handles notion-to-md output for column_list and other empty blocks
  cleaned = cleaned.replace(/^[•\s]+$/gm, '');
  cleaned = cleaned.replace(/^\s*•\s*•\s*$/gm, '');

  // Remove lines that are just bullet characters (one or more)
  // Unicode: • (2022), ‣ (2023), ◦ (25E6), ⁃ (2043), ∙ (2219)
  cleaned = cleaned.replace(/^[\u2022\u2023\u25E6\u2043\u2219\s]+$/gm, '');

  // Remove duplicate dashes at start of line
  cleaned = cleaned.replace(/^-\s*-\s*/gm, '- ');

  // Remove lines that only contain list markers and punctuation
  cleaned = cleaned.replace(/^[\s\-\*•·]+$/gm, '');

  // Clean up excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Remove trailing whitespace from each line
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');

  // Remove empty lines at the end
  cleaned = cleaned.replace(/\n+$/g, '');

  return {
    content: cleaned.trim(),
    tallyFormIds,
    stripeButtons
  };
}
