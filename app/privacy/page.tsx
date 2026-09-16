import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Juno Healthcare Private Limited',
  description: 'Privacy policy and data protection framework for Juno Healthcare Private Limited.'
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#334E68] hover:text-[#073B5C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3 pb-6 border-b border-[#D9E2EC]">
          <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-widest block">
            Statutory Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#102A43]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#334E68] font-mono">
            Last Updated: March 2026 • Juno Healthcare Private Limited (CIN: U46497MR2026PTC474137)
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#334E68] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">1. Information We Collect</h2>
            <p>
              Juno Healthcare Private Limited collects information provided directly by commercial visitors, medical practitioners, and prospective distributors through our digital enquiry channels. This includes your name, email address, telephone number, organization affiliation, and message details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">2. Purpose of Data Utilization</h2>
            <p>
              Information collected through this website is utilized exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#334E68]">
              <li>Responding to commercial, distribution, and product information inquiries.</li>
              <li>Providing technical datasheets and pharmacopoeial batch release documents.</li>
              <li>Fulfilling institutional procurement and regulatory compliance obligations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">3. Non-Disclosure & Data Security</h2>
            <p>
              We do not sell, rent, or trade your personal or institutional information to third-party marketing entities. We implement industry-standard administrative, physical, and digital safeguards to protect your data against unauthorized access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">4. Medical Information Confidentiality</h2>
            <p>
              This website does not collect confidential patient health records (PHI). Healthcare providers submitting clinical or pharmacovigilance observations are reminded to ensure data is de-identified in accordance with standard medical regulatory protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">5. Contact Information</h2>
            <p>
              For privacy-related inquiries, please contact our administrative desk by telephone at <span className="font-bold text-[#102A43]">+91 9743094555</span> or through our corporate portal at <span className="font-bold text-[#0D5C91]">junohealthcare.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
