import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { qualityProcessSteps } from '@/lib/mockData';
import { 
  ShieldCheck, 
  FlaskConical, 
  CheckCircle2, 
  FileCheck2, 
  Settings2, 
  Microscope, 
  AlertCircle, 
  ArrowRight,
  Gauge
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quality Assurance & Standards | Juno Healthcare',
  description: 'Learn about the rigorous 7-stage pharmaceutical quality assurance process, analytical protocols, and partner qualification at Juno Healthcare Private Limited.'
};

export default function QualityPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Quality Assurance Paradigm
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Quality Is an Uncompromising Process.
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              Every pharmaceutical formulation marketed under the Juno Healthcare identity is governed by structured analytical verification, cGMP partner standards, and pharmacopoeial monograph compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Matrix */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 border-b border-[#D9E2EC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
                Zero Compromise Framework
              </span>
              <h2 className="text-3xl font-bold text-[#102A43]">
                Analytical Rigor Across Every Formulation
              </h2>
            </div>

            <p className="text-base text-[#334E68] leading-relaxed">
              As a medicine marketing enterprise, our responsibility begins with rigorous partner selection and continues through every stage of analytical clearance. We partner exclusively with manufacturing units that operate strictly under Schedule M and cGMP guidelines, validating each production lot with comprehensive testing before market release.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-1">
                <span className="text-xs font-bold text-[#073B5C] uppercase">Chemical Assay</span>
                <p className="text-xs text-[#334E68]">HPLC potency verification to ensure active ingredient concentration matches label claims exactly.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-1">
                <span className="text-xs font-bold text-[#073B5C] uppercase">Dissolution Kinetics</span>
                <p className="text-xs text-[#334E68]">In-vitro dissolution profiling ensuring optimal drug release and systemic bioavailability.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-1">
                <span className="text-xs font-bold text-[#073B5C] uppercase">Microbial Safety</span>
                <p className="text-xs text-[#334E68]">Total viable aerobic count, pathogen screening, and endotoxin testing for sterile formulations.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-1">
                <span className="text-xs font-bold text-[#073B5C] uppercase">Stability Profiling</span>
                <p className="text-xs text-[#334E68]">Accelerated and real-time climatic zone stability monitoring to preserve shelf-life integrity.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74] space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Partner Audit Criteria
            </h3>
            <p className="text-xs text-[#F3F9FB]/80 leading-relaxed">
              Before entering a marketing alliance for any formulation, the third-party manufacturing site must satisfy our multi-point compliance checklist:
            </p>
            <ul className="space-y-3 text-xs text-[#F3F9FB]/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0 mt-0.5" />
                <span>Valid state manufacturing license and Schedule M cGMP certification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0 mt-0.5" />
                <span>Classified cleanroom HVAC systems with validated HEPA filtration.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0 mt-0.5" />
                <span>Automated electronic batch records and audit-ready analytical logs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0 mt-0.5" />
                <span>Validated water systems (Purified Water / Water for Injection).</span>
              </li>
            </ul>

            <Link
              href="/manufacturing"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#48D4D2] hover:text-white transition-colors"
            >
              <span>Explore Manufacturing Standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 7-Stage Detailed Workflow */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
            End-to-End Quality Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102A43]">
            The 7-Stage Pharmaceutical Quality Lifecycle
          </h2>
        </div>

        <div className="space-y-6">
          {qualityProcessSteps.map((step, idx) => (
            <div
              key={step.step}
              className="p-6 sm:p-8 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#16B8B3] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#073B5C] bg-white px-4 py-2 rounded-2xl border border-[#D9E2EC] shrink-0 shadow-xs">
                  {step.step}
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#0D5C91] uppercase tracking-wider">
                    {step.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-[#102A43]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed max-w-3xl pt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited Protocol</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pharmacovigilance Statement */}
      <section className="py-16 bg-[#073B5C] text-white border-t border-[#0B4C74]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] uppercase tracking-widest block">
              Patient Safety & Pharmacovigilance
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Post-Marketing Surveillance & Regulatory Accountability
            </h3>
            <p className="text-sm text-[#F3F9FB]/90 leading-relaxed">
              Juno Healthcare maintains an active pharmacovigilance monitoring protocol. In the event of any product feedback, batch inquiry, or therapeutic observation, our technical desk immediately logs and traces the corresponding batch records in collaboration with the manufacturing facility.
            </p>
            <div className="pt-2">
              <Link
                href="/contact?category=Product+Inquiry"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
              >
                <span>Contact Quality Desk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
