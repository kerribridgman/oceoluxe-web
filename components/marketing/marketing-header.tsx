'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasProducts, setHasProducts] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Mark that we're on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if there are any visible products
  useEffect(() => {
    async function checkProducts() {
      try {
        const response = await fetch('/api/mmfc-products/public');
        if (response.ok) {
          const data = await response.json();
          setHasProducts(data.products && data.products.length > 0);
        }
      } catch (error) {
        console.error('Error checking products:', error);
      }
    }
    checkProducts();
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Studio Systems', href: '/studio-systems' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blog' },
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
                className="text-[#967F71] hover:text-[#CDA7B2] font-light transition-colors uppercase text-sm tracking-wider"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#3B3937]" />
            ) : (
              <Menu className="h-6 w-6 text-[#3B3937]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-[#967F71]/10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-[#967F71] hover:text-[#CDA7B2] font-light py-2 uppercase text-sm tracking-wider"
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
