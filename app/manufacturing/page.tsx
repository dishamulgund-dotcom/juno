import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getManufacturers } from '@/lib/db';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Factory, 
  Send, 
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manufacturing Network & Partner Alliances | Juno Healthcare',
  description: 'Learn about Juno Healthcare Private Limited’s vetted network of cGMP-compliant contract manufacturing partners across solid orals, parenterals, and liquid formulations.'
};

export const revalidate = 0;

export default async function ManufacturingPage() {
  const manufacturers = await getManufacturers();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Contract Manufacturing Alliances
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Our Manufacturing Network
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              Juno Healthcare Private Limited is engaged in pharmaceutical marketing. Formulations in our portfolio are manufactured through specialized, state-of-the-art third-party facilities holding certified cGMP, Schedule M, and ISO accreditations.
            </p>
          </div>
        </div>
      </section>

      {/* Alliance Philosophy */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 border-b border-[#D9E2EC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-wider block">
              Strategic Manufacturing Model
            </span>
            <h2 className="text-3xl font-bold text-[#102A43]">
              Precision Infrastructure Through Specialized Partners
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              Rather than maintaining single-facility constraints, Juno Healthcare collaborates with specialized formulation units across India. This allows us to select facilities with dedicated infrastructure tailored specifically to solid orals, sterile injectables, or liquid topicals.
            </p>
          </div>

          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#073B5C] block">
              Key Facility Standards
            </span>
            <ul className="space-y-2 text-xs text-[#102A43]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                <span>Schedule M & cGMP audited units</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                <span>Automated high-speed compression & blister lines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                <span>Class 100 sterile cleanrooms for parenterals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                <span>Closed-loop Purified Water / WFI systems</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Partner Facilities Matrix */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
            Audited Units
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102A43]">
            Partner Facility Profiles
          </h2>
          <p className="text-base text-[#334E68]">
            Profiles of accredited manufacturing partners producing formulations under our marketing portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {manufacturers.map(mfg => (
            <div
              key={mfg.id}
              className="bg-white rounded-3xl border border-[#D9E2EC] p-8 flex flex-col justify-between shadow-xs hover:border-[#16B8B3] hover:shadow-xl transition-all"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] text-xs font-bold uppercase">
                    <Factory className="w-3.5 h-3.5 text-[#16B8B3]" />
                    Partner Plant
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Audit Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#102A43]">
                    {mfg.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#334E68] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0D5C91]" />
                    <span>{mfg.location}, {mfg.country}</span>
                  </div>
                </div>

                <p className="text-xs text-[#334E68] leading-relaxed">
                  {mfg.description}
                </p>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E68] block mb-2">
                    Formulation Competence
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mfg.dosageForms.map(df => (
                      <span
                        key={df}
                        className="px-2.5 py-1 rounded-lg bg-[#F3F9FB] border border-[#D9E2EC] text-[#073B5C] text-xs font-bold"
                      >
                        {df}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E68] block mb-2">
                    Infrastructure & Capabilities
                  </span>
                  <ul className="space-y-1.5">
                    {mfg.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#334E68]">
                        <span className="text-[#16B8B3] font-bold">•</span>
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E68] block mb-2">
                    Quality Systems
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mfg.qualitySystems.map((qs, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        {qs}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#D9E2EC] flex items-center justify-between text-xs text-[#334E68]">
                <span>Compliance Basis:</span>
                <span className="font-bold text-[#073B5C]">{mfg.certifications[0] || 'Schedule M cGMP'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alliance Submission Banner */}
      <section className="py-16 bg-[#073B5C] text-white border-t border-[#0B4C74]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#04243A] border border-[#0B4C74] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold text-[#48D4D2] uppercase tracking-widest block">
                Manufacturing Alliances Desk
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Partner with Juno Healthcare
              </h3>
              <p className="text-sm text-[#F3F9FB]/80 max-w-2xl leading-relaxed">
                We invite licensed, cGMP-certified pharmaceutical formulation facilities to register their plant capacities and dosage portfolios for marketing alliances.
              </p>
            </div>

            <Link
              href="/contact?category=Manufacturing+Alliance"
              className="px-8 py-4 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Plant Dossier</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
