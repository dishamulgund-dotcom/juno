import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Target, 
  Award, 
  HeartHandshake, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { initialCorporateProfile, whyJunoPillars } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'About Us | Corporate Identity & Ethical Marketing',
  description: 'Learn about Juno Healthcare Private Limited, our mission, pharmaceutical marketing ethos, and commitment to quality consistency.'
};

export default function AboutPage() {
  const profile = initialCorporateProfile;

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <section className="py-20 lg:py-24 bg-[#073B5C] text-white relative overflow-hidden border-b border-[#0B4C74]">
        <div className="absolute inset-0 bg-scientific-grid opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
              Corporate Overview
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              About Juno Healthcare
            </h1>
            <p className="text-lg text-[#F3F9FB]/90 leading-relaxed">
              Advancing healthcare access through responsible pharmaceutical marketing, verified formulations, and strict quality governance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
                Our Foundation
              </span>
              <h2 className="text-3xl font-bold text-[#102A43]">
                Pharmaceutical Marketing Grounded in Responsibility
              </h2>
            </div>

            <p className="text-base text-[#334E68] leading-relaxed">
              {profile.aboutFull}
            </p>

            <p className="text-base text-[#334E68] leading-relaxed">
              In a complex healthcare landscape, Juno Healthcare Private Limited acts as a dependable bridge between quality pharmaceutical producers and the clinical community. We curate formulations across critical therapeutic vectors, ensuring that every batch marketed carries documented analytical verification and compliant packaging.
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="p-6 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-3">
                <div className="p-2.5 rounded-2xl bg-[#073B5C]/10 text-[#073B5C] w-fit">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#102A43]">Our Vision</h3>
                <p className="text-xs text-[#334E68] leading-relaxed">
                  {profile.vision}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-3">
                <div className="p-2.5 rounded-2xl bg-[#16B8B3]/15 text-[#0D5C91] w-fit">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#102A43]">Our Mission</h3>
                <p className="text-xs text-[#334E68] leading-relaxed">
                  {profile.mission}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Legal Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74] space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#48D4D2]">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Entity Details</span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                JUNO HEALTHCARE PRIVATE LIMITED
              </h3>

              <div className="space-y-3 text-xs text-[#F3F9FB]/90 font-mono">
                <div className="p-3 rounded-2xl bg-[#04243A] border border-[#0B4C74]">
                  <span className="text-[#F3F9FB]/60 block text-[10px] uppercase font-sans">Corporate Identity (CIN)</span>
                  <span className="text-sm font-bold text-[#48D4D2] select-all">{profile.cin}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#04243A] border border-[#0B4C74]">
                  <span className="text-[#F3F9FB]/60 block text-[10px] uppercase font-sans">ROC Jurisdiction</span>
                  <span className="text-sm font-bold text-white">{profile.roc}</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#04243A] border border-[#0B4C74]">
                  <span className="text-[#F3F9FB]/60 block text-[10px] uppercase font-sans">Date of Incorporation</span>
                  <span className="text-sm font-bold text-white">{profile.incorporationDate} (06 March 2026)</span>
                </div>
              </div>

              <Link
                href="/company"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                <span>View Full Corporate Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quality Principles Box */}
            <div className="p-6 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#073B5C]">
                Compliance Protocol
              </h4>
              <ul className="space-y-2 text-xs text-[#102A43]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Exclusive alliances with cGMP accredited facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Batch-level analytical testing conforming to IP monographs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Adherence to ethical pharmaceutical promotional codes</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Ethical Marketing Commitment */}
      <section className="py-16 bg-[#F3F9FB] border-t border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3 mb-12">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Ethical Code
            </span>
            <h2 className="text-3xl font-bold text-[#102A43]">
              Our 4 Operating Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJunoPillars.map(pillar => (
              <div key={pillar.id} className="p-6 bg-white rounded-3xl border border-[#D9E2EC] space-y-2 shadow-xs">
                <h3 className="text-lg font-bold text-[#102A43]">{pillar.title}</h3>
                <span className="text-xs font-bold text-[#0D5C91] block">{pillar.subtitle}</span>
                <p className="text-xs text-[#334E68] leading-relaxed pt-1">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
