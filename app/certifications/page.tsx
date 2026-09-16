import React from 'react';
import type { Metadata } from 'next';
import { getCertifications } from '@/lib/db';
import CertificationsClient from './CertificationsClient';

export const metadata: Metadata = {
  title: 'Certifications & Statutory Registry | Juno Healthcare',
  description: 'Review verified corporate incorporation records (MCA), cGMP compliance standards, and quality management frameworks of Juno Healthcare Private Limited.'
};

export const revalidate = 0;

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="bg-[#F3F9FB] min-h-screen">
      {/* Header */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Statutory Registry & Compliance
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Standards & Certifications
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              Transparent, audit-ready statutory and quality documentation. Juno Healthcare publishes only officially verified certificates and statutory government filings.
            </p>
          </div>
        </div>
      </section>

      {/* Main Registry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <CertificationsClient initialCertifications={certifications} />
      </div>
    </div>
  );
}
