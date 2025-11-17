import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">
                Patrick <span className="text-orange-500">Farrell</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches Ready to Scale while Maintaining Their Freedom.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/patrickfarrell.life"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/pfarrell85"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#ai-consulting" className="text-gray-400 hover:text-orange-500 transition-colors">
                  AI Consulting
                </Link>
              </li>
              <li>
                <Link href="/services#tech-coaching" className="text-gray-400 hover:text-orange-500 transition-colors">
                  1:1 Coaching
                </Link>
              </li>
              <li>
                <Link href="/services#mastermind" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Mastermind
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Patrick Farrell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
