'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useEffect } from 'react';
import Script from 'next/script';

interface MarkdownRendererProps {
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

// Extract Tally form ID from embed code
function extractTallyFormId(code: string): string | null {
  const match = code.match(/tally\.so\/embed\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-8" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-bold text-gray-900 mb-4 mt-6" {...props} />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props} />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul className="space-y-3 my-8 ml-6 text-gray-700 list-disc list-outside" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-3 my-8 ml-6 text-gray-700 list-decimal list-outside" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-lg leading-relaxed pl-2" {...props} />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-orange-600 hover:text-orange-700 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            const codeContent = String(children).replace(/\n$/, '');

            // Check if this is a Tally embed
            const tallyFormId = extractTallyFormId(codeContent);
            if (tallyFormId && !inline) {
              return <TallyEmbed formId={tallyFormId} />;
            }

            if (inline) {
              return (
                <code
                  className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono border border-gray-700"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block bg-[#1a1d23] p-6 rounded-lg overflow-x-auto font-mono text-base leading-relaxed my-6 [&>*]:text-gray-200 [&]:text-gray-200 border border-gray-800"
                style={{ color: '#e5e7eb' }}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-[#1a1d23] rounded-lg overflow-hidden my-8 shadow-2xl border border-gray-800 [&>*]:text-gray-200" style={{ color: '#e5e7eb' }} {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-orange-500 pl-6 py-4 my-8 bg-orange-50 rounded-r-lg"
              {...props}
            />
          ),

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full border border-gray-200 rounded-lg" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-200" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 text-sm text-gray-700" {...props} />
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
            <hr className="my-12 border-gray-200" {...props} />
          ),

          // Strong (bold)
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),

          // Emphasis (italic)
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
