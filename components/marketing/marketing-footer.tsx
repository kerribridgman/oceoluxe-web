import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';

interface MarketingFooterProps {
  theme?: 'dark' | 'light';
}

export function MarketingFooter({ theme = 'dark' }: MarketingFooterProps) {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-12 ${
      isDark
        ? 'border-[var(--color-taupe)]/20 bg-[var(--color-ink)]'
        : 'border-[#967F71]/10 bg-[#faf8f5]'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <h2 className={`text-xl font-light tracking-wide ${
                isDark ? 'text-[var(--color-cream)]' : 'text-[#3B3937]'
              }`}>Oceo Luxe</h2>
            </div>
            <p className={`mb-6 max-w-md font-light leading-relaxed ${
              isDark ? 'text-[var(--color-taupe)]' : 'text-[#967F71]'
            }`}>
              Studio Operational Partner for founders building businesses they intend to keep.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/oceoluxe"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/kerri-bridgman/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.pinterest.com/oceoluxe/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}
                aria-label="Pinterest"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Primary Links */}
          <div>
            <h3 className={`font-semibold mb-4 uppercase tracking-wider text-sm ${
              isDark ? 'text-[var(--color-cream)]' : 'text-[#3B3937]'
            }`}>Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`transition-colors font-light ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work-with-oceo-luxe" className={`transition-colors font-light ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}>
                  Work With Oceo Luxe
                </Link>
              </li>
              <li>
                <Link href="/about" className={`transition-colors font-light ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className={`transition-colors font-light ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/apply" className={`transition-colors font-light ${
                  isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
                }`}>
                  Apply
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tagline */}
        <div className={`border-t mt-8 pt-8 text-center ${
          isDark ? 'border-[var(--color-taupe)]/20' : 'border-[#967F71]/10'
        }`}>
          <p className="font-script text-xl italic text-[var(--color-dusty-rose)] mb-6">
            Structure does not limit creativity, it protects it.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t pt-6 ${
          isDark ? 'border-[var(--color-taupe)]/20' : 'border-[#967F71]/10'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm font-light ${
              isDark ? 'text-[var(--color-taupe)]' : 'text-[#967F71]'
            }`}>
              &copy; 2026 Oceo Luxe. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className={`text-sm font-light transition-colors ${
                isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
              }`}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={`text-sm font-light transition-colors ${
                isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
              }`}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
