'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TocHeading {
  level: number;
  text: string;
  id: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
      headings.push({ level, text, id: slugify(text) });
    }
  }

  return headings;
}

interface TableOfContentsProps {
  markdown: string;
}

export function TableOfContents({ markdown }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(markdown);

  if (headings.length < 3) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 border border-[var(--color-taupe)]/10 rounded-lg bg-[var(--color-charcoal)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-[var(--color-cream)] uppercase tracking-wider">
          Table of Contents
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-bone)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <nav className="px-6 pb-4">
          <ul className="space-y-2">
            {headings.map((heading, i) => (
              <li key={`${heading.id}-${i}`}>
                <button
                  onClick={() => handleClick(heading.id)}
                  className={`text-sm font-light transition-colors text-left hover:text-[var(--color-dusty-rose)] ${
                    heading.level === 3 ? 'pl-4 text-[var(--color-bone)]' : 'text-[var(--color-cream)]'
                  }`}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
