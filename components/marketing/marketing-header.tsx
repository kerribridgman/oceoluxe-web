'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CartIcon } from '@/components/cart';

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Studio Systems', href: '/studio-systems' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#CDA7B2] shadow-md'
          : 'bg-[#faf8f5] border-b border-[#967F71]/10 shadow-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-xl font-light tracking-wide transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-[#3B3937]'
            }`}>Oceo Luxe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-light uppercase text-sm tracking-wider transition-colors duration-300 ${
                  isScrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#967F71] hover:text-[#CDA7B2]'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Cart Icon */}
            <CartIcon isScrolled={isScrolled} />
          </div>

          {/* Mobile Cart and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <CartIcon isScrolled={isScrolled} />
            <button
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'hover:bg-white/20' : 'hover:bg-[#967F71]/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-[#3B3937]'}`} />
              ) : (
                <Menu className={`h-6 w-6 transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-[#3B3937]'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-[#967F71]/10 bg-white/50 backdrop-blur-sm">
            <Link
              href="/"
              className="block text-[#967F71] hover:text-[#CDA7B2] hover:bg-[#CDA7B2]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-[#967F71] hover:text-[#CDA7B2] hover:bg-[#CDA7B2]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
