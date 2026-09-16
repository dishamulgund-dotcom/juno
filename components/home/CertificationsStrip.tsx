'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Certification } from '@/types';
import CertificateModal from '@/components/ui/CertificateModal';
import { Award, ShieldCheck, ArrowRight, Eye, CheckCircle2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CertificationsStripProps {
  certifications: Certification[];
}

export default function CertificationsStrip({ certifications = [] }: CertificationsStripProps) {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Governance & Verification
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
              Standards That Define Our Work
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              Transparent corporate documentation and verified manufacturing standards. Every document in our registry is verified through official statutory and auditor channels.
            </p>
          </div>

          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073B5C] hover:text-[#0D5C91] group"
          >
            <span>Full Compliance Registry</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Certifications Grid */}
        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map(cert => (
              <div
                key={cert.id}
                className="bg-[#F3F9FB] rounded-3xl border border-[#D9E2EC] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#16B8B3] hover:shadow-xl transition-all group"
              >
                <div className="space-y-4">
                  {/* Badge & Type */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#073B5C] border border-[#D9E2EC] text-[11px] font-bold uppercase">
                      <Award className="w-3.5 h-3.5 text-[#16B8B3]" />
                      {cert.type} Record
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#102A43] group-hover:text-[#073B5C] transition-colors">
                    {cert.name}
                  </h3>

                  {/* Identifier */}
                  <div className="p-3.5 bg-white rounded-2xl border border-[#D9E2EC] text-xs">
                    <span className="text-[10px] text-[#334E68] uppercase block font-bold">Record / Reference ID</span>
                    <span className="font-mono font-bold text-[#073B5C] break-all select-all">
                      {cert.certificateNumber}
                    </span>
                  </div>

                  {/* Scope Preview */}
                  <p className="text-xs text-[#334E68] line-clamp-3 leading-relaxed">
                    {cert.scope}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#334E68] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#16B8B3]" />
                    <span>Issue: {formatDate(cert.issueDate)}</span>
                  </div>
                </div>

                {/* Inspect Button */}
                <div className="mt-6 pt-4 border-t border-[#D9E2EC]">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-[#073B5C] hover:text-white text-[#073B5C] border border-[#D9E2EC] rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-[#F3F9FB] rounded-3xl border border-[#D9E2EC]">
            <p className="text-sm text-[#334E68]">
              Certification information will be published here once verified by the statutory registrar.
            </p>
          </div>
        )}

        {/* Modal Inspector */}
        <CertificateModal
          certification={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      </div>
    </section>
  );
}
