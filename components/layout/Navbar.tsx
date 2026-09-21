'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  ChevronRight, 
  Search,
  Lock
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Quality', href: '/quality' },
  { name: 'Manufacturing', href: '/manufacturing' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Company', href: '/company' },
  { name: 'Contact', href: '/contact' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) return null; // Admin has its own dedicated header/sidebar

  return (
    <>
      {/* Statutory Corporate Top Bar */}
      <div className="bg-[#073B5C] text-[#F3F9FB] text-xs py-1.5 px-3 sm:px-6 border-b border-[#0B4C74]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[#48D4D2] font-mono text-[10px] sm:text-[11px] whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-[#48D4D2] shrink-0" />
              <span>CIN: U46497MR2026PTC474137</span>
            </span>
            <span className="hidden md:inline text-[#16B8B3]/50">|</span>
            <span className="hidden md:inline text-[#F3F9FB]/80 text-[11px] whitespace-nowrap">
              ROC Mumbai II • Inc. 06/03/2026
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a 
              href="tel:+919743094555" 
              className="flex items-center gap-1.5 text-[#F3F9FB] hover:text-[#48D4D2] transition-colors whitespace-nowrap text-[10px] sm:text-xs"
            >
              <Phone className="w-3 h-3 text-[#48D4D2] shrink-0" />
              <span className="font-semibold whitespace-nowrap tracking-wider">+91 9743094555</span>
            </a>
            <Link 
              href="/admin/login" 
              className="hidden sm:flex text-[11px] text-[#48D4D2] hover:text-white transition-colors items-center gap-1 whitespace-nowrap"
            >
              <Lock className="w-3 h-3 shrink-0" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#D9E2EC] py-2'
            : 'bg-white border-b border-[#D9E2EC]/70 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Official JUNO Logo at TOP-LEFT */}
          <Link 
            href="/" 
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16B8B3] rounded transition-transform hover:opacity-95"
            aria-label="Juno Healthcare Private Limited - Home"
          >
            <div className="relative w-[160px] sm:w-[185px] h-[48px] sm:h-[54px]">
              <Image 
                src="/images/juno-logo.png" 
                alt="Juno Healthcare Private Limited Logo"
                fill
                priority
                sizes="(max-width: 640px) 160px, 185px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#073B5C] bg-[#F3F9FB] font-bold border-b-2 border-[#16B8B3]'
                      : 'text-[#102A43] hover:text-[#073B5C] hover:bg-[#F3F9FB]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/products"
              className="p-2 text-[#334E68] hover:text-[#073B5C] hover:bg-[#F3F9FB] rounded-lg transition-colors"
              title="Search Catalog"
              aria-label="Search Formulations"
            >
              <Search className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#073B5C] hover:bg-[#0D5C91] rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16B8B3]"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/contact"
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#073B5C] rounded-lg"
            >
              Enquire
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#102A43] hover:text-[#073B5C] hover:bg-[#F3F9FB] rounded-lg transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#073B5C]/60 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header with Logo at Top Left */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D9E2EC]">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative w-[150px] h-[44px]"
                >
                  <Image 
                    src="/images/juno-logo.png" 
                    alt="Juno Healthcare Private Limited Logo"
                    fill
                    sizes="150px"
                    className="object-contain object-left"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#334E68] hover:text-[#073B5C] rounded-lg"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-1">
                {NAV_LINKS.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#F3F9FB] text-[#073B5C] font-bold border-l-4 border-[#16B8B3]'
                          : 'text-[#102A43] hover:bg-[#F3F9FB] hover:text-[#073B5C]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#16B8B3]" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-[#D9E2EC] space-y-4">
              <div className="p-3.5 bg-[#F3F9FB] rounded-lg text-xs space-y-1 text-[#334E68]">
                <div className="font-bold text-[#073B5C]">JUNO HEALTHCARE PVT. LTD.</div>
                <div>CIN: U46497MR2026PTC474137</div>
                <div>Tel: +91 9743094555</div>
              </div>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3 bg-[#073B5C] hover:bg-[#0D5C91] text-white font-bold text-sm rounded-lg shadow-sm"
              >
                Send Commercial Enquiry
              </Link>
              <div className="text-center">
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#0D5C91] hover:text-[#16B8B3] flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
