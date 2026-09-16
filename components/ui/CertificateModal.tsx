'use client';

import React from 'react';
import { Certification } from '@/types';
import { X, Award, CheckCircle2, Calendar, ShieldCheck, Building2, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CertificateModalProps {
  certification: Certification | null;
  onClose: () => void;
}

export default function CertificateModal({ certification, onClose }: CertificateModalProps) {
  if (!certification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B5C]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9E2EC] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#073B5C] text-white border-b border-[#0B4C74]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#16B8B3]/20 rounded-xl text-[#48D4D2]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#48D4D2] font-bold">Official Statutory Record</span>
              <h3 id="cert-modal-title" className="text-xl font-bold text-white leading-tight">
                {certification.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#0B4C74] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-[#F3F9FB] rounded-2xl border border-[#D9E2EC]">
            <div className="flex items-center gap-2 text-[#073B5C]">
              <ShieldCheck className="w-5 h-5 text-[#16B8B3]" />
              <span className="text-sm font-bold">Verification Status:</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {certification.verified ? 'Verified & Active' : 'Under Review'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl border border-[#D9E2EC] bg-[#F3F9FB]">
              <span className="text-xs text-[#334E68] block mb-1 font-bold">Certificate / Reference No.</span>
              <span className="text-sm font-bold text-[#073B5C] font-mono select-all">
                {certification.certificateNumber}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#D9E2EC] bg-[#F3F9FB]">
              <span className="text-xs text-[#334E68] block mb-1 font-bold">Certification Type</span>
              <span className="text-sm font-bold text-[#102A43]">
                {certification.type} Standard
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#D9E2EC] bg-[#F3F9FB]">
              <div className="flex items-center gap-1.5 text-xs text-[#334E68] mb-1 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#16B8B3]" />
                Issue Date
              </div>
              <span className="text-sm font-bold text-[#102A43]">
                {formatDate(certification.issueDate)}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#D9E2EC] bg-[#F3F9FB]">
              <div className="flex items-center gap-1.5 text-xs text-[#334E68] mb-1 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#16B8B3]" />
                Validity / Expiry
              </div>
              <span className="text-sm font-bold text-[#102A43]">
                {certification.expiryDate.includes('-') ? formatDate(certification.expiryDate) : certification.expiryDate}
              </span>
            </div>
          </div>

          {/* Issuing Authority */}
          <div className="p-4 rounded-2xl border border-[#D9E2EC] bg-white">
            <div className="flex items-center gap-2 text-xs font-bold text-[#073B5C] mb-1.5 uppercase tracking-wide">
              <Building2 className="w-4 h-4 text-[#16B8B3]" />
              Issuing Organization / Statutory Body
            </div>
            <p className="text-sm text-[#102A43] font-semibold">
              {certification.issuingAuthority}
            </p>
          </div>

          {/* Scope of Certification */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#334E68] uppercase tracking-wider">
              Audited Scope & Compliance Statement
            </h4>
            <div className="p-4 bg-[#F3F9FB] rounded-2xl border border-[#D9E2EC] text-sm text-[#334E68] leading-relaxed">
              {certification.scope}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F3F9FB] border-t border-[#D9E2EC]">
          <p className="text-xs text-[#334E68]">
            Juno Healthcare Private Limited Corporate Registry
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#334E68] hover:bg-[#D9E2EC] rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Document Record: ${certification.certificateNumber} is digitally verified in the company registry.`);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Verify Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
