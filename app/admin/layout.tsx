'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Pill, 
  Factory, 
  Award, 
  MessageSquare, 
  TrendingUp, 
  Building, 
  Settings, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products Catalog', href: '/admin/products', icon: Pill },
  { name: 'Manufacturing Partners', href: '/admin/manufacturers', icon: Factory },
  { name: 'Certifications & Records', href: '/admin/certifications', icon: Award },
  { name: 'Inbound Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  { name: 'Dynamic Statistics', href: '/admin/statistics', icon: TrendingUp },
  { name: 'Company & MCA Details', href: '/admin/company', icon: Building },
  { name: 'Settings & Security', href: '/admin/settings', icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = sessionStorage.getItem('juno_admin_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue client cleanup
    }
    sessionStorage.removeItem('juno_admin_token');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // If on login route, just render the child
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Waiting for session check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#04243A] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#16B8B3]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F3F9FB] flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#073B5C] text-white p-4 flex items-center justify-between border-b border-[#0B4C74]">
        <div className="relative w-[130px] h-[36px] bg-white rounded-lg p-1">
          <Image
            src="/images/juno-logo.png"
            alt="Juno Healthcare Logo"
            fill
            sizes="130px"
            className="object-contain"
          />
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#073B5C] text-white flex flex-col justify-between border-r border-[#0B4C74] transition-transform lg:translate-x-0 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:static'
      }`}>
        <div>
          {/* Brand Logo Header in Sidebar */}
          <div className="p-6 border-b border-[#0B4C74]">
            <Link href="/admin" className="block relative w-full h-[52px] bg-white rounded-xl p-2 shadow-xs">
              <Image
                src="/images/juno-logo.png"
                alt="Juno Healthcare Private Limited Logo"
                fill
                priority
                sizes="240px"
                className="object-contain p-1"
              />
            </Link>
            <span className="text-[10px] font-bold tracking-widest text-[#48D4D2] uppercase block mt-3 text-center">
              Control & Compliance Console
            </span>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {ADMIN_NAV.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#16B8B3] text-[#073B5C] shadow-sm'
                      : 'text-[#F3F9FB]/80 hover:bg-[#0B4C74] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#073B5C]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Footer */}
        <div className="p-4 border-t border-[#0B4C74] space-y-3">
          <div className="p-3 bg-[#04243A] rounded-xl text-[11px] text-[#F3F9FB]/80 space-y-1 font-mono">
            <div className="text-[#48D4D2] font-bold">CIN: U46497MR2026PTC474137</div>
            <div>ROC Mumbai II • 06/03/2026</div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#48D4D2] hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
