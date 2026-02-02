'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchResult {
  type: 'blog' | 'product';
  title: string;
  description: string | null;
  href: string;
  coverImageUrl: string | null;
}

export function SiteSearch({ isScrolled }: { isScrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), 300);
  };

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    router.push(href);
  };

  const blogResults = results.filter((r) => r.type === 'blog');
  const productResults = results.filter((r) => r.type === 'product');

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`p-2 rounded-lg transition-colors ${
          isScrolled ? 'hover:bg-white/20' : 'hover:bg-[#967F71]/10'
        }`}
        aria-label="Search"
      >
        <Search className={`h-5 w-5 transition-colors duration-300 ${
          isScrolled ? 'text-white/90' : 'text-[#967F71]'
        }`} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto max-w-xl mt-[15vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#967F71]/10">
              <Search className="w-5 h-5 text-[#967F71] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search blog posts and products..."
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="flex-1 text-[#3B3937] text-base font-light placeholder:text-[#967F71]/50 bg-transparent outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-[#967F71] hover:text-[#3B3937] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="px-5 py-8 text-center text-sm text-[#967F71] font-light">
                  Searching...
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-[#967F71] font-light">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {!loading && blogResults.length > 0 && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-xs text-[#CDA7B2] uppercase tracking-widest font-medium mb-3">
                    Blog Posts
                  </p>
                  <div className="space-y-1">
                    {blogResults.map((result) => (
                      <button
                        key={result.href}
                        onClick={() => handleSelect(result.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#faf8f5] transition-colors text-left"
                      >
                        {result.coverImageUrl && (
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative bg-[#f5f0ea]">
                            <Image src={result.coverImageUrl} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#3B3937] truncate">{result.title}</p>
                          {result.description && (
                            <p className="text-xs text-[#967F71] font-light truncate">{result.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && productResults.length > 0 && (
                <div className="px-5 pt-4 pb-2">
                  <p className="text-xs text-[#CDA7B2] uppercase tracking-widest font-medium mb-3">
                    Products
                  </p>
                  <div className="space-y-1">
                    {productResults.map((result) => (
                      <button
                        key={result.href}
                        onClick={() => handleSelect(result.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#faf8f5] transition-colors text-left"
                      >
                        {result.coverImageUrl && (
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative bg-[#f5f0ea]">
                            <Image src={result.coverImageUrl} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#3B3937] truncate">{result.title}</p>
                          {result.description && (
                            <p className="text-xs text-[#967F71] font-light truncate">{result.description}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && query.length < 2 && (
                <div className="px-5 py-8 text-center text-sm text-[#967F71] font-light">
                  Type to search...
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[#967F71]/10 bg-[#faf8f5]">
              <p className="text-xs text-[#967F71]/60 font-light text-center">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#967F71]/10 text-[#967F71] text-xs">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
