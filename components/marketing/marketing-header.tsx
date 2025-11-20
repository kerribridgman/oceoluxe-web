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
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    // Only show Products link on client-side after checking
    ...(isClient && hasProducts ? [{ name: 'Products', href: '/products' }] : []),
  ];

  return (
    <header className="bg-gradient-to-r from-[#1a2332] via-[#1e2838] to-[#243442] border-b border-[#2a3342]/50 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Patrick Farrell"
              width={220}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-[#4a9fd8] font-medium transition-colors uppercase text-sm tracking-wider"
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
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-[#2a3342]">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-300 hover:text-[#4a9fd8] font-medium py-2 uppercase text-sm tracking-wider"
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
