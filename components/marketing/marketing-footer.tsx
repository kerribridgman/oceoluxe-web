import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a2332] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Patrick Farrell"
                width={220}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Strategy, Systems, and Support for Start-ups, Entrepreneurs & Coaches Ready to Scale while Maintaining Their Freedom.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/patrickfarrell.life"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4a9fd8] transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/pfarrell85"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4a9fd8] transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Get Started</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#ai-consulting" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  AI Consulting
                </Link>
              </li>
              <li>
                <Link href="/services#tech-coaching" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  1:1 Coaching
                </Link>
              </li>
              <li>
                <Link href="/services#mastermind" className="text-gray-400 hover:text-[#4a9fd8] transition-colors">
                  Mastermind
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a3342] mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Patrick Farrell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
