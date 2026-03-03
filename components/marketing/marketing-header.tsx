'use client';

import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { SiteSearch } from '@/components/search/site-search';

const serviceSubLinks = [
  { name: 'Operational Partnership', href: '/operational-partnership' },
  { name: 'Strategic Production Alignment', href: '/strategic-production-alignment' },
  { name: 'Studio Systems', href: '/studio-systems' },
];

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const navItems = [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3B3937] shadow-md'
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
            {/* Work With Oceo Luxe - Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/work-with-oceo-luxe"
                className={`inline-flex items-center gap-1 font-light uppercase text-sm tracking-wider transition-colors duration-300 ${
                  isScrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#967F71] hover:text-[#3B3937]'
                }`}
              >
                Work With Oceo Luxe
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-white rounded-lg shadow-lg border border-[#967F71]/10 py-2 min-w-[260px]">
                    {serviceSubLinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-5 py-2.5 text-sm text-[#967F71] hover:text-[#3B3937] hover:bg-[#faf8f5] font-light tracking-wide transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-light uppercase text-sm tracking-wider transition-colors duration-300 ${
                  isScrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#967F71] hover:text-[#3B3937]'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Search */}
            <SiteSearch isScrolled={isScrolled} />

            {/* Apply CTA Button */}
            <Link
              href="/apply"
              className={`inline-flex items-center px-5 py-2 text-sm font-medium tracking-wide rounded-full transition-all duration-300 ${
                isScrolled
                  ? 'bg-white text-[#3B3937] hover:bg-white/90'
                  : 'bg-[#3B3937] text-white hover:bg-[#4A4745]'
              }`}
            >
              Apply
            </Link>
          </div>

          {/* Mobile Cart and Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <SiteSearch isScrolled={isScrolled} />
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
            {/* Work With Oceo Luxe - Expandable */}
            <button
              className="flex items-center justify-between w-full text-[#967F71] hover:text-[#3B3937] hover:bg-[#3B3937]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            >
              Work With Oceo Luxe
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileServicesOpen && (
              <div className="pl-6 space-y-1">
                <Link
                  href="/work-with-oceo-luxe"
                  className="block text-[#967F71] hover:text-[#3B3937] hover:bg-[#3B3937]/5 font-light py-2.5 px-4 text-sm tracking-wider rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Overview
                </Link>
                {serviceSubLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block text-[#967F71] hover:text-[#3B3937] hover:bg-[#3B3937]/5 font-light py-2.5 px-4 text-sm tracking-wider rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-[#967F71] hover:text-[#3B3937] hover:bg-[#3B3937]/5 font-light py-3 px-4 uppercase text-sm tracking-wider rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/apply"
              className="block text-center bg-[#3B3937] text-white font-medium py-3 px-4 mx-4 mt-2 rounded-full text-sm tracking-wide"
              onClick={() => setMobileMenuOpen(false)}
            >
              Apply
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
