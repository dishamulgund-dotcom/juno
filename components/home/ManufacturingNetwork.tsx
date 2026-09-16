'use client';

import React from 'react';
import Link from 'next/link';
import { Manufacturer } from '@/types';
import { MapPin, CheckCircle2, ArrowRight, Factory } from 'lucide-react';

interface ManufacturingNetworkProps {
  manufacturers: Manufacturer[];
}

export default function ManufacturingNetwork({ manufacturers = [] }: ManufacturingNetworkProps) {
  return (
    <section className="py-20 lg:py-28 bg-[#F3F9FB] border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Contract Manufacturing Alliances
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
              Our Manufacturing Network
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              Juno Healthcare operates as a specialized pharmaceutical marketing organization. Formulations are produced through vetted third-party manufacturing partners possessing verified cGMP, Schedule M, and ISO accreditations.
            </p>
          </div>

          <Link
            href="/manufacturing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 self-start md:self-auto"
          >
            <span>Partner Standards</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Manufacturing Cards Grid */}
        {manufacturers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {manufacturers.map(mfg => (
              <div
                key={mfg.id}
                className="bg-white rounded-3xl border border-[#D9E2EC] p-6 flex flex-col justify-between shadow-xs hover:border-[#16B8B3] hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Top Tag & Status */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] text-[11px] font-bold uppercase">
                      <Factory className="w-3 h-3 text-[#16B8B3]" />
                      Partner Facility
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Audit Verified
                    </span>
                  </div>

                  {/* Partner Name & Location */}
                  <div>
                    <h3 className="text-xl font-bold text-[#102A43]">
                      {mfg.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#334E68] mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#0D5C91]" />
                      <span>{mfg.location}, {mfg.country}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#334E68] leading-relaxed">
                    {mfg.description}
                  </p>

                  {/* Dosage Form Pills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E68] block mb-1.5">
                      Manufactured Dosage Lines
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mfg.dosageForms.map(df => (
                        <span
                          key={df}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F3F9FB] border border-[#D9E2EC] text-[#073B5C] text-[11px] font-bold"
                        >
                          {df}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#334E68] block mb-1.5">
                      Technical Capabilities
                    </span>
                    <ul className="space-y-1">
                      {mfg.capabilities.slice(0, 3).map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-[#334E68]">
                          <span className="text-[#16B8B3] font-bold text-xs">•</span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Audit Strip */}
                <div className="mt-6 pt-4 border-t border-[#D9E2EC] flex items-center justify-between text-xs text-[#334E68]">
                  <span>Quality Standard:</span>
                  <span className="font-bold text-[#073B5C]">{mfg.certifications[0] || 'cGMP Compliant'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-[#D9E2EC]">
            <p className="text-sm text-[#334E68]">
              Manufacturing partner information will be updated shortly upon completion of annual audit renewals.
            </p>
          </div>
        )}

        {/* Partnership Callout Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#073B5C] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#0B4C74]">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white">
              Are you a licensed cGMP / WHO-GMP formulation manufacturer?
            </h4>
            <p className="text-xs sm:text-sm text-[#F3F9FB]/80">
              Juno Healthcare actively evaluates accredited manufacturing partners for solid oral, parenteral, and liquid formulation contracts.
            </p>
          </div>
          <Link
            href="/contact?type=manufacturing"
            className="px-6 py-3.5 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Submit Facility Dossier
          </Link>
        </div>

      </div>
    </section>
  );
}
