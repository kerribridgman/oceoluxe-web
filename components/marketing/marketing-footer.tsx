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

        {/* Bottom Bar */}
        <div className="border-t border-[#967F71]/10 mt-8 pt-8 text-center">
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
