import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Juno Healthcare Private Limited',
  description: 'Terms of service, medical disclaimer, and commercial inquiry conditions for Juno Healthcare Private Limited.'
};

export default function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#334E68] font-mono">
            CIN: U46497MR2026PTC474137 • Registrar of Companies (ROC Mumbai II)
          </p>
        </div>

        {/* Warning Box */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Important Medical Disclaimer</span>
          </div>
          <p>
            The content provided on this website is for informational, B2B trade, and distributor reference only. It is not intended as medical advice, diagnosis, or clinical treatment. Formulation availability is subject to statutory licensing and state drug controller regulations.
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#334E68] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">1. Nature of Business</h2>
            <p>
              Juno Healthcare Private Limited is a registered private limited company incorporated under the Companies Act, 2013, engaged in pharmaceutical and medicine marketing. Products in our portfolio are manufactured through verified third-party cGMP compliant facilities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">2. Intellectual Property & Wordmark</h2>
            <p>
              All trademarks, wordmarks (including JUNO and JUNO HEALTHCARE PRIVATE LIMITED), layout elements, product nomenclature, and digital assets published on this website are the proprietary property of Juno Healthcare Private Limited or its respective licensing partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">3. Commercial Inquiries & Agreements</h2>
            <p>
              Submission of an enquiry form does not constitute a legally binding agreement for distributorship, stockist allocation, or institutional supply. Final commercial distribution terms are subject to formal written contracts executed by authorized signatories.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#102A43]">4. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising out of or in connection with this website shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
