'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo } from 'react';

interface ProductMarkdownRendererProps {
  content: string;
}

// Component to render Tally embeds
function TallyEmbed({ formId }: { formId: string }) {
  useEffect(() => {
    // Load Tally widget script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).Tally) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, [formId]);

  return (
    <div className="my-8">
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="300"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Tally Form"
        className="rounded-lg"
      />
    </div>
  );
}

// Extract Tally form ID from various formats
function extractTallyFormId(text: string): string | null {
  // Match tally.so/embed/FORMID or tally.so/r/FORMID patterns
  const match = text.match(/tally\.so\/(?:embed|r)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Clean content by removing super-embed blocks and raw HTML/script tags
function cleanContent(content: string): { cleanedContent: string; tallyFormIds: string[] } {
  const tallyFormIds: string[] = [];

  // Find all Tally form IDs in the content
  const tallyMatches = content.matchAll(/tally\.so\/(?:embed|r)\/([a-zA-Z0-9]+)/g);
  for (const match of tallyMatches) {
    if (match[1] && !tallyFormIds.includes(match[1])) {
      tallyFormIds.push(match[1]);
    }
  }

  let cleaned = content;

  // Remove "super-embed:" lines and everything after them that looks like embed code
  // This handles the Notion super-embed format
  cleaned = cleaned.replace(/super-embed:\s*\n?<iframe[\s\S]*?<\/iframe>\s*\n?<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/super-embed:\s*\n?<iframe[\s\S]*?<\/iframe>/gi, '');
  cleaned = cleaned.replace(/super-embed:\s*/gi, '');

  // Remove raw iframe tags
  cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');

  // Remove raw script tags
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove any remaining tally embed URLs that might be floating around
  cleaned = cleaned.replace(/https?:\/\/tally\.so\/embed\/[a-zA-Z0-9]+[^\s]*/gi, '');

  // Clean up multiple consecutive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return { cleanedContent: cleaned.trim(), tallyFormIds };
}

export function ProductMarkdownRenderer({ content }: ProductMarkdownRendererProps) {
  const { cleanedContent, tallyFormIds } = useMemo(() => cleanContent(content), [content]);

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-[#3B3937] prose-p:text-[#967F71] prose-p:font-light prose-a:text-[#CDA7B2] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#3B3937] prose-li:text-[#967F71]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-serif font-light text-[#3B3937] mb-6 mt-8" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-serif font-light text-[#3B3937] mb-6 mt-8" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-4 mt-6" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-medium text-[#3B3937] mb-4 mt-6" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-[#967F71] leading-relaxed mb-6 text-lg font-light" {...props} />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul className="space-y-3 my-8 ml-6 text-[#967F71] list-disc list-outside" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-3 my-8 ml-6 text-[#967F71] list-decimal list-outside" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-lg leading-relaxed pl-2 font-light" {...props} />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-[#CDA7B2] hover:text-[#BD97A2] underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#CDA7B2] pl-6 py-4 my-8 bg-[#CDA7B2]/5 rounded-r-lg"
              {...props}
            />
          ),

          // Images
          img: ({ node, ...props }) => (
            <img
              className="rounded-xl shadow-lg my-8 w-full"
              loading="lazy"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-12 border-[#967F71]/20" {...props} />
          ),

          // Strong (bold)
          strong: ({ node, ...props }) => (
            <strong className="font-medium text-[#3B3937]" {...props} />
          ),

          // Emphasis (italic)
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),

          // Code - in case any code blocks slip through
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-[#f5f0ea] text-[#3B3937] px-2 py-1 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block bg-[#f5f0ea] p-6 rounded-lg overflow-x-auto font-mono text-base leading-relaxed my-6 text-[#3B3937]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-[#f5f0ea] rounded-lg overflow-hidden my-8" {...props} />
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>

      {/* Render Tally embeds at the end */}
      {tallyFormIds.map((formId) => (
        <TallyEmbed key={formId} formId={formId} />
      ))}
    </div>
  );
}
