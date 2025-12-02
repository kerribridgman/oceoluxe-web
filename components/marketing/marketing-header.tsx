'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CartIcon } from '@/components/cart';

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Studio Systems', href: '/studio-systems' },
  ];

  const shopItems = [
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
  ];

  return (
    <header className="bg-[#faf8f5] border-b border-[#967F71]/10 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-light text-[#3B3937] tracking-wide">Oceo Luxe</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#967F71] hover:text-[#CDA7B2] font-light uppercase text-sm tracking-wider transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Shop Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-[#967F71] hover:text-[#CDA7B2] font-light uppercase text-sm tracking-wider transition-colors"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                onMouseEnter={() => setShopDropdownOpen(true)}
              >
                Shop
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#967F71]/10 py-2"
                  onMouseLeave={() => setShopDropdownOpen(false)}
                >
                  {shopItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-[#967F71] hover:text-[#CDA7B2] hover:bg-[#CDA7B2]/5 font-light uppercase text-sm tracking-wider transition-colors"
                      onClick={() => setShopDropdownOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="text-[#967F71] hover:text-[#CDA7B2] font-light uppercase text-sm tracking-wider transition-colors"
            >
              Blog
            </Link>

            {/* Cart Icon */}
            <CartIcon />
          </div>

          {/* Mobile Cart and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <CartIcon />
            <button
              className="p-2 hover:bg-[#967F71]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#3B3937]" />
              ) : (
                <Menu className="h-6 w-6 text-[#3B3937]" />
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

            {/* Mobile Shop Accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between text-[#967F71] hover:text-[#CDA7B2] hover:bg-[#CDA7B2]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileShopOpen && (
                <div className="pl-4">
                  {shopItems.map((item) => (
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
            </div>

            <Link
              href="/blog"
              className="block text-[#967F71] hover:text-[#CDA7B2] hover:bg-[#CDA7B2]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
