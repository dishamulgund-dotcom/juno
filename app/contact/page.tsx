import React from 'react';
import type { Metadata } from 'next';
import ContactSection from '@/components/home/ContactSection';
import { initialCorporateProfile } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'Contact Us | Commercial & Distribution Inquiries',
  description: 'Connect with the commercial, distribution, and product inquiry desks of Juno Healthcare Private Limited. Telephone: +91 9743094555, Domain: junohealthcare.in.'
};

export default function ContactPage() {
  const profile = initialCorporateProfile;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Commercial & Institutional Channels
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Connect With Juno
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              We welcome trade inquiries, regional distribution applications, hospital formulary requests, and contract manufacturing proposals.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Form & Coordinates */}
      <ContactSection />

      {/* Regional Inquiry Channels */}
      <section className="py-16 bg-[#F3F9FB] border-t border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-wider block">
              Departmental Routing
            </span>
            <h2 className="text-3xl font-bold text-[#102A43]">
              Direct Contact Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#D9E2EC] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#0D5C91] uppercase block">Trade & Distribution</span>
              <h3 className="text-base font-bold text-[#102A43]">Regional Stockists</h3>
              <p className="text-xs text-[#334E68] leading-relaxed">For territory-wise distributorship agreements and wholesale supply.</p>
              <span className="text-xs font-mono text-[#102A43] block pt-1 font-bold">+91 9743094555</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#D9E2EC] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#0D5C91] uppercase block">Institutional Supply</span>
              <h3 className="text-base font-bold text-[#102A43]">Hospitals & Formularies</h3>
              <p className="text-xs text-[#334E68] leading-relaxed">For institutional rate contracts, bulk batches, and analytical dossiers.</p>
              <span className="text-xs font-mono text-[#073B5C] block pt-1 font-bold">+91 9743094555</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#D9E2EC] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#0D5C91] uppercase block">Manufacturing Alliances</span>
              <h3 className="text-base font-bold text-[#102A43]">cGMP Plants</h3>
              <p className="text-xs text-[#334E68] leading-relaxed">For accredited formulation facilities seeking marketing partnerships.</p>
              <span className="text-xs font-mono text-[#073B5C] block pt-1 font-bold">junohealthcare.in</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#D9E2EC] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#0D5C91] uppercase block">Corporate Governance</span>
              <h3 className="text-base font-bold text-[#102A43]">Statutory Office</h3>
              <p className="text-xs text-[#334E68] leading-relaxed">For legal compliance, ROC filings, and corporate governance.</p>
              <span className="text-xs font-mono text-[#073B5C] block pt-1 font-bold">CIN: U46497MR2026PTC474137</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
