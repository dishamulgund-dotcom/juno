'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Lock
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#073B5C] text-[#F3F9FB] border-t border-[#0B4C74]">
      {/* Primary Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand & Corporate Statement */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative w-[190px] h-[58px] bg-white/95 px-3 py-1.5 rounded-xl">
              <Image 
                src="/images/juno-logo.png" 
                alt="Juno Healthcare Private Limited Logo"
                fill
                sizes="190px"
                className="object-contain object-left p-1"
              />
            </div>

            <p className="text-sm text-[#F3F9FB]/80 leading-relaxed max-w-md">
              A dedicated pharmaceutical marketing enterprise focused on responsible medicine representation, rigorous quality assurance, and verified healthcare distribution across India.
            </p>

            {/* MCA Statutory Tag */}
            <div className="p-4 rounded-xl bg-[#04243A]/90 border border-[#0B4C74] text-xs space-y-1.5 text-[#F3F9FB]/90">
              <div className="flex items-center gap-2 text-[#48D4D2] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#48D4D2]" />
                Ministry of Corporate Affairs (Govt. of India)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#F3F9FB]/70 pt-1 font-mono">
                <div>CIN: <span className="text-white">U46497MR2026PTC474137</span></div>
                <div>ROC: <span className="text-white">ROC Mumbai II</span></div>
                <div>Reg No: <span className="text-white">474137</span></div>
                <div>Inc Date: <span className="text-white">06/03/2026</span></div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#48D4D2]">
              Company Portfolio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Juno
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Healthcare Portfolio
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link href="/manufacturing" className="hover:text-white transition-colors">
                  Manufacturing Network
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-white transition-colors">
                  Certifications & MCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#48D4D2]">
              Formulation Types
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?dosage=tablets" className="hover:text-white transition-colors">
                  Solid Oral Tablets
                </Link>
              </li>
              <li>
                <Link href="/products?dosage=capsules" className="hover:text-white transition-colors">
                  Encapsulated Dosage
                </Link>
              </li>
              <li>
                <Link href="/products?dosage=injections" className="hover:text-white transition-colors">
                  Sterile Parenterals
                </Link>
              </li>
              <li>
                <Link href="/products?dosage=syrups" className="hover:text-white transition-colors">
                  Liquid Orals & Syrups
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-white transition-colors">
                  Corporate Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#48D4D2]">
              Corporate Office
            </h4>
            <div className="space-y-3 text-sm text-[#F3F9FB]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#48D4D2] shrink-0 mt-1" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#48D4D2] shrink-0" />
                <a href="tel:+919743094555" className="hover:text-white transition-colors font-semibold text-white">
                  +91 9743094555
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#48D4D2] shrink-0" />
                <span className="font-mono text-white">junohealthcare.in</span>
              </div>
              <div className="text-[11px] text-[#48D4D2] font-mono pt-1">
                ROC Mumbai II • 06/03/2026
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Strip */}
        <div className="mt-12 pt-8 border-t border-[#0B4C74] text-xs text-[#F3F9FB]/60 leading-relaxed">
          <p>
            <strong>Statutory Compliance Disclaimer:</strong> The information provided on this corporate website is intended solely for educational, informational, business-to-business (B2B), and distribution inquiry purposes. Juno Healthcare Private Limited is engaged in pharmaceutical and medicine marketing. Product specifications and formulations are manufactured through verified third-party cGMP compliant facilities. Nothing on this website constitutes medical advice, clinical recommendation, or direct-to-consumer solicitation.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#0B4C74] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F3F9FB]/70">
          <div>
            © 2026 Juno Healthcare Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="flex items-center gap-1 hover:text-[#48D4D2] transition-colors text-[#F3F9FB]/70">
              <Lock className="w-3 h-3 text-[#48D4D2]" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
