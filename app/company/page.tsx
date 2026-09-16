import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { initialCorporateProfile } from '@/lib/mockData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Corporate Profile & MCA Records | Juno Healthcare',
  description: 'Official statutory corporate profile, Ministry of Corporate Affairs (MCA) registration details, CIN, ROC Mumbai II, and governance information for Juno Healthcare Private Limited.'
};

export default function CompanyPage() {
  const profile = initialCorporateProfile;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Ministry of Corporate Affairs • Certified Entity
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Corporate Profile
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              Official corporate registration and legal entity identification for Juno Healthcare Private Limited under the Companies Act, 2013.
            </p>
          </div>
        </div>
      </section>

      {/* Main Dossier */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Official MCA Certificate Card */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Master Statutory Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] shadow-xs space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2EC]">
                <div>
                  <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-widest block">
                    Legal Entity Name
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#102A43]">
                    {profile.companyName}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Active Entity
                </span>
              </div>

              {/* MCA Grid Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Corporate Identification Number (CIN)</span>
                  <p className="text-sm font-bold font-mono text-[#073B5C] select-all">{profile.cin}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Registrar of Companies (ROC)</span>
                  <p className="text-sm font-bold text-[#102A43]">{profile.roc}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Registration Number</span>
                  <p className="text-sm font-bold font-mono text-[#102A43] select-all">{profile.registrationNumber}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Date of Incorporation</span>
                  <p className="text-sm font-bold text-[#102A43]">{profile.incorporationDate} (06 March 2026)</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Company Category</span>
                  <p className="text-sm font-bold text-[#102A43]">{profile.companyCategory}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Sub-Category</span>
                  <p className="text-sm font-bold text-[#102A43]">{profile.companySubCategory}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Class of Company</span>
                  <p className="text-sm font-bold text-[#102A43]">{profile.companyClass}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#D9E2EC] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Primary Business Domain</span>
                  <p className="text-sm font-bold text-[#102A43]">Pharmaceutical / Medicine Marketing</p>
                </div>
              </div>

              {/* Registered Office */}
              <div className="p-5 rounded-2xl bg-white border border-[#D9E2EC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073B5C]">
                  <MapPin className="w-4 h-4 text-[#16B8B3]" />
                  <span>Registered Office Jurisdiction</span>
                </div>
                <p className="text-sm font-semibold text-[#102A43]">
                  {profile.registeredOffice}
                </p>
                <span className="text-xs text-[#334E68] block">
                  Under administrative jurisdiction of the Registrar of Companies, Mumbai II, Maharashtra.
                </span>
              </div>

            </div>

            {/* Corporate Governance Statement */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#102A43]">
                Corporate Governance & Compliance Framework
              </h3>
              <p className="text-sm text-[#334E68] leading-relaxed">
                Juno Healthcare Private Limited is committed to adhering to all applicable provisions of the Companies Act, 2013, the Drugs and Cosmetics Act, 1940 (and Rules thereunder), and standard pharmaceutical marketing practices. All commercial contracts, distributorships, and third-party manufacturing pacts are executed in strict accordance with statutory Indian business laws.
              </p>
            </div>

          </div>

          {/* Right Column: Contact & Statutory Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74] space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#48D4D2] block">
                  Official Communication
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Corporate Inquiries
                </h3>
              </div>

              <div className="space-y-4 text-xs text-[#F3F9FB]/90">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#48D4D2] shrink-0" />
                  <div>
                    <span className="text-[#F3F9FB]/60 block">Official Phone</span>
                    <a href={`tel:${profile.officialPhone}`} className="text-sm font-bold text-white hover:underline">
                      {profile.officialPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#48D4D2] shrink-0" />
                  <div>
                    <span className="text-[#F3F9FB]/60 block">Official Email</span>
                    <a href={`mailto:${profile.officialEmail}`} className="text-sm font-semibold text-[#48D4D2] hover:underline">
                      {profile.officialEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#48D4D2] shrink-0" />
                  <div>
                    <span className="text-[#F3F9FB]/60 block">Domain</span>
                    <span className="text-sm text-white font-medium">{profile.domain}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0B4C74]">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  <span>Contact Corporate Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] text-xs text-[#334E68] space-y-2">
              <strong className="text-[#073B5C] block font-bold">Public Record Disclosure</strong>
              <p className="leading-relaxed">
                Corporate identification records can be verified independently via the official portal of the Ministry of Corporate Affairs, Government of India (mca.gov.in) using CIN: U46497MR2026PTC474137.
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
