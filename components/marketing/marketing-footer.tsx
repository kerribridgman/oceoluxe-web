import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#967F71]/10 bg-[#faf8f5] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-serif font-light text-[#3B3937] tracking-wide mb-1">Studio Systems</h2>
              <p className="text-sm text-[#967F71] italic font-light">by Oceo Luxe</p>
            </div>
            <p className="text-[#967F71] mb-6 max-w-md font-light leading-relaxed">
              Structure as Support for fashion designers and visionaries. Build sustainable production systems that feel like luxury.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/oceoluxe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#967F71] hover:text-[#CDA7B2] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/kerri-bridgman/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#967F71] hover:text-[#CDA7B2] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.pinterest.com/oceoluxe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#967F71] hover:text-[#CDA7B2] transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#3B3937] font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-[#3B3937] font-semibold mb-4 uppercase tracking-wider text-sm">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/studio-systems" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Join Membership
                </Link>
              </li>
              <li>
                <Link href="/quiz/about" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Take the Quiz
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#967F71] hover:text-[#CDA7B2] transition-colors font-light">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tagline */}
        <div className="border-t border-[#967F71]/10 mt-8 pt-8 text-center">
          <p className="text-[#3B3937] text-lg font-serif italic mb-6">
            Structure does not limit creativity, it protects it.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#967F71]/10 pt-6 text-center">
          <p className="text-[#967F71] text-sm font-light mb-2">
            &copy; {currentYear} Studio Systems by Oceo Luxe. All rights reserved.
          </p>
          <p className="text-[#967F71] text-xs font-light">
            Professional fashion production education platform
          </p>
        </div>
      </div>
    </footer>
  );
}
