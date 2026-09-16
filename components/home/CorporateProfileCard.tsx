'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { initialCorporateProfile } from '@/lib/mockData';

export default function CorporateProfileCard() {
  const profile = initialCorporateProfile;

  return (
    <section className="py-20 lg:py-28 bg-[#073B5C] text-white border-b border-[#0B4C74] relative overflow-hidden">
      {/* Background glow texture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#16B8B3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
            Statutory Registration Records
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Corporate Profile
          </h2>
          <p className="text-base text-[#F3F9FB]/90 leading-relaxed pt-1">
            Verified corporate identification and legal entity records registered with the Ministry of Corporate Affairs, Government of India.
          </p>
        </div>

        {/* Premium Corporate Certificate Container */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#04243A]/90 border border-[#0B4C74] shadow-2xl backdrop-blur-md space-y-10">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#0B4C74]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#48D4D2] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#16B8B3]" />
                <span>Ministry of Corporate Affairs • Certified Legal Entity</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {profile.companyName}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#073B5C] border border-[#16B8B3]/50 text-[#48D4D2] text-xs font-bold rounded-full uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3]" />
                Active & Compliant
              </span>
            </div>
          </div>

          {/* MCA Legal Data 6-Box Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Corporate Identification No. (CIN)
              </span>
              <p className="text-base font-bold font-mono text-[#48D4D2] select-all">
                {profile.cin}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Registrar of Companies (ROC)
              </span>
              <p className="text-base font-bold text-white">
                {profile.roc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Registration Number
              </span>
              <p className="text-base font-bold font-mono text-white select-all">
                {profile.registrationNumber}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Date of Incorporation
              </span>
              <p className="text-base font-bold text-white">
                06 March 2026
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Company Category & Class
              </span>
              <p className="text-base font-bold text-white">
                {profile.companyCategory} ({profile.companyClass})
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#073B5C]/70 border border-[#0B4C74] space-y-1">
              <span className="text-xs text-[#F3F9FB]/70 uppercase font-bold tracking-wider block">
                Sub-Category
              </span>
              <p className="text-base font-bold text-white">
                {profile.companySubCategory}
              </p>
            </div>

          </div>

          {/* Contact Verification Strip */}
          <div className="p-6 rounded-2xl bg-[#073B5C] border border-[#0B4C74] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-6 text-[#F3F9FB]/80">
              <div>
                <strong className="text-white">Official Telephone:</strong>{' '}
                <a href={`tel:${profile.officialPhone}`} className="text-[#48D4D2] hover:underline font-bold">
                  {profile.officialPhone}
                </a>
              </div>
              <div>
                <strong className="text-white">Official Email:</strong>{' '}
                <a href={`mailto:${profile.officialEmail}`} className="text-[#48D4D2] hover:underline">
                  {profile.officialEmail}
                </a>
              </div>
              <div>
                <strong className="text-white">Domain:</strong>{' '}
                <span className="text-white">{profile.domain}</span>
              </div>
            </div>

            <Link
              href="/company"
              className="px-6 py-3 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] font-bold rounded-xl transition-colors shrink-0 uppercase tracking-wider text-xs shadow-sm"
            >
              Statutory Dossier
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
