import Link from 'next/link';
import { ArrowRight, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketingFooterProps {
  theme?: 'dark' | 'light';
}

export function MarketingFooter({ theme = 'dark' }: MarketingFooterProps) {
  const isDark = theme === 'dark';

  const linkClass = `transition-colors font-light ${
    isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]' : 'text-[#967F71] hover:text-[#3B3937]'
  }`;

  const headingClass = `font-semibold mb-4 uppercase tracking-wider text-xs ${
    isDark ? 'text-[var(--color-cream)]' : 'text-[#3B3937]'
  }`;

  return (
    <footer className={`${
      isDark
        ? 'bg-[var(--color-ink)]'
        : 'bg-[#faf8f5]'
    }`}>
      {/* CTA Band */}
      <div className="bg-[var(--color-dusty-rose)]">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-serif-display text-3xl lg:text-4xl font-normal tracking-tight text-[var(--color-ink)]">
                Ready to work together?
              </p>
              <p className="font-script text-xl italic text-[var(--color-charcoal)] mt-3">
                Structure does not limit creativity, it protects it.
              </p>
            </div>
            <Link href="/apply">
              <Button
                size="lg"
                className="bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-charcoal)] h-12 px-8 text-base font-normal tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Apply
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={`border-t ${
        isDark ? 'border-[var(--color-taupe)]/20' : 'border-[#967F71]/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <h2 className={`font-serif-display text-3xl font-normal tracking-tight mb-4 ${
                isDark ? 'text-[var(--color-cream)]' : 'text-[#3B3937]'
              }`}>
                Oceo Luxe
              </h2>
              <p className={`max-w-sm font-light leading-relaxed mb-8 ${
                isDark ? 'text-[var(--color-taupe)]' : 'text-[#967F71]'
              }`}>
                Studio Operational Partner for founders building businesses they intend to keep.
              </p>
              <div className="flex items-center gap-5">
                <a
                  href="https://www.instagram.com/oceoluxe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-dusty-rose)]' : 'text-[#967F71] hover:text-[#3B3937]'
                  }`}
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kerri-bridgman/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-dusty-rose)]' : 'text-[#967F71] hover:text-[#3B3937]'
                  }`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.pinterest.com/oceoluxe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark ? 'text-[var(--color-taupe)] hover:text-[var(--color-dusty-rose)]' : 'text-[#967F71] hover:text-[#3B3937]'
                  }`}
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore Column */}
            <div className="md:col-span-2 md:col-start-7">
              <h3 className={headingClass}>Explore</h3>
              <ul className="space-y-3">
                <li><Link href="/" className={linkClass}>Home</Link></li>
                <li><Link href="/about" className={linkClass}>About</Link></li>
                <li><Link href="/blog" className={linkClass}>Blog</Link></li>
                <li><Link href="/apply" className={linkClass}>Apply</Link></li>
              </ul>
            </div>

            {/* Services Column */}
            <div className="md:col-span-3">
              <h3 className={headingClass}>Services</h3>
              <ul className="space-y-3">
                <li><Link href="/operational-partnership" className={linkClass}>Operational Partnership</Link></li>
                <li><Link href="/strategic-operational-alignment" className={linkClass}>Strategic Alignment</Link></li>
                <li><Link href="/studio-systems" className={linkClass}>Studio Systems</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${
        isDark ? 'border-[var(--color-taupe)]/20' : 'border-[#967F71]/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm font-light ${
              isDark ? 'text-[var(--color-taupe)]' : 'text-[#967F71]'
            }`}>
              &copy; {new Date().getFullYear()} Oceo Luxe. All rights reserved.
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
