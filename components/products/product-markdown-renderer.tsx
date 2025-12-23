'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { cleanNotionMarkdown, type StripeButton } from '@/lib/notion-markdown-cleaner';

interface ProductMarkdownRendererProps {
  content: string;
}

// Component to render Stripe Buy Button
function StripeBuyButton({ buyButtonId, publishableKey }: StripeButton) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  return (
    <div className="my-10 flex justify-center">
      <div className="w-full max-w-md">
        <Script
          src="https://js.stripe.com/v3/buy-button.js"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
        {/* @ts-ignore - stripe-buy-button is a custom element */}
        <stripe-buy-button
          buy-button-id={buyButtonId}
          publishable-key={publishableKey}
        />
      </div>
    </div>
  );
}

// Component to render Tally embeds
function TallyEmbed({ formId }: { formId: string }) {
  const [submitted, setSubmitted] = useState(false);

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

    // Listen for Tally form submission
    const handleTallyMessage = (event: MessageEvent) => {
      if (event.data?.event === 'Tally.FormSubmitted') {
        setSubmitted(true);
      }
    };

    window.addEventListener('message', handleTallyMessage);
    return () => window.removeEventListener('message', handleTallyMessage);
  }, [formId]);

  if (submitted) {
    return (
      <div className="my-8 p-8 bg-[#CDA7B2]/10 rounded-lg text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-serif font-light text-[#3B3937] mb-2">Thank you!</h3>
        <p className="text-[#967F71] font-light">Your submission was successful. Check your email for your download link.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="500"
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

// Extended cleaning for product pages (adds bold formatting for intro phrases)
function cleanProductContent(content: string) {
  const { content: baseClean, tallyFormIds, stripeButtons } = cleanNotionMarkdown(content);

  let cleaned = baseClean;

  // Extract "Inside, you'll find:" or similar intro phrases and make them standalone paragraphs with bold formatting
  cleaned = cleaned.replace(/(\.|!|\?)\s*(Inside,?\s+you'?l?l?\s+find:?|What's included:?|Here's what you get:?|You'll get:?|Includes:?)/gi, '$1\n\n**$2**\n');
  cleaned = cleaned.replace(/^(Inside,?\s+you'?l?l?\s+find:?|What's included:?|Here's what you get:?|You'll get:?|Includes:?)$/gim, '**$1**');

  return { cleanedContent: cleaned.trim(), tallyFormIds, stripeButtons };
}

export function ProductMarkdownRenderer({ content }: ProductMarkdownRendererProps) {
  const { cleanedContent, tallyFormIds, stripeButtons } = useMemo(() => cleanProductContent(content), [content]);

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-[#3B3937] prose-p:text-[#967F71] prose-p:font-light prose-a:text-[#CDA7B2] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#3B3937] prose-li:text-[#967F71]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-serif font-light text-[#3B3937] mb-2 mt-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-serif font-light text-[#3B3937] mb-2 mt-6" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-serif font-light text-[#3B3937] mb-2 mt-4" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-medium text-[#3B3937] mb-2 mt-4" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-[#967F71] leading-relaxed mb-0 text-lg font-light" {...props} />
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
              className="rounded-xl shadow-lg mt-0 mb-0 w-full"
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

      {/* Render Stripe buy buttons */}
      {stripeButtons.map((button, index) => (
        <StripeBuyButton
          key={`stripe-${button.buyButtonId}-${index}`}
          buyButtonId={button.buyButtonId}
          publishableKey={button.publishableKey}
        />
      ))}

      {/* Render Tally embeds at the end */}
      {tallyFormIds.map((formId) => (
        <TallyEmbed key={formId} formId={formId} />
      ))}
    </div>
  );
}
