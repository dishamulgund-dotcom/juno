'use client';

import React, { useState } from 'react';
import { Certification } from '@/types';
import CertificateModal from '@/components/ui/CertificateModal';
import { Award, ShieldCheck, CheckCircle2, Eye, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CertificationsClientProps {
  initialCertifications: Certification[];
}

export default function CertificationsClient({ initialCertifications }: CertificationsClientProps) {
  const [certifications] = useState<Certification[]>(initialCertifications);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <div className="space-y-12">
      {/* Notice Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#D9E2EC] flex items-start gap-4 shadow-xs">
        <ShieldCheck className="w-6 h-6 text-[#16B8B3] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#334E68]">
          <strong className="text-sm font-bold text-[#073B5C] block">
            Verification Integrity Policy
          </strong>
          <p className="leading-relaxed">
            In compliance with strict pharmaceutical marketing regulations, Juno Healthcare Private Limited lists only verified statutory filings (such as our Ministry of Corporate Affairs Certificate of Incorporation) and active partner cGMP audit records. No unverified certifications or placeholder accreditations are marked as active.
          </p>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {certifications.map(cert => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl border border-[#D9E2EC] p-8 flex flex-col justify-between shadow-xs hover:border-[#16B8B3] hover:shadow-xl transition-all group"
          >
            <div className="space-y-5">
              {/* Type Badge & Status */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] text-xs font-bold uppercase">
                  <Award className="w-3.5 h-3.5 text-[#16B8B3]" />
                  {cert.type} Registry
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#102A43] group-hover:text-[#073B5C] transition-colors">
                {cert.name}
              </h3>

              {/* ID Box */}
              <div className="p-4 bg-[#F3F9FB] rounded-2xl border border-[#D9E2EC] text-xs space-y-1 font-mono">
                <span className="text-[10px] text-[#334E68] uppercase font-sans font-bold block">
                  Reference Record / Identification
                </span>
                <span className="font-bold text-[#073B5C] break-all select-all block text-sm">
                  {cert.certificateNumber}
                </span>
              </div>

              {/* Authority */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#334E68] block tracking-wider">
                  Issuing Authority
                </span>
                <p className="text-xs font-bold text-[#102A43] leading-snug">
                  {cert.issuingAuthority}
                </p>
              </div>

              {/* Scope */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#334E68] block tracking-wider">
                  Scope of Record
                </span>
                <p className="text-xs text-[#334E68] line-clamp-3 leading-relaxed">
                  {cert.scope}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#334E68] font-medium pt-2 border-t border-[#D9E2EC]">
                <Calendar className="w-3.5 h-3.5 text-[#16B8B3]" />
                <span>Issue Date: {formatDate(cert.issueDate)}</span>
              </div>
            </div>

            {/* Inspect Button */}
            <div className="mt-8 pt-4 border-t border-[#D9E2EC]">
              <button
                onClick={() => setSelectedCert(cert)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#073B5C] hover:bg-[#0D5C91] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Record Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Inspector */}
      <CertificateModal
        certification={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
