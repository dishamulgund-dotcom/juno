'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { marketingLifecycleSteps } from '@/lib/mockData';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Truck 
} from 'lucide-react';

const STEP_ICONS: Record<string, any> = {
  understand: Search,
  select: Cpu,
  quality: ShieldCheck,
  market: TrendingUp,
  deliver: Truck
};

export default function AboutPreview() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Corporate Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
              Who We Are
            </h2>
            <p className="text-base sm:text-lg text-[#334E68] leading-relaxed pt-2">
              Juno Healthcare Private Limited is a specialized pharmaceutical and medicine marketing company dedicated to ethical medical representation, rigorous quality assurance, and dependable healthcare distribution.
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#073B5C] hover:text-[#0D5C91] group"
            >
              <span>Read Full Corporate Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 2-Column Editorial About Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-4">
              <h3 className="text-xl font-bold text-[#102A43]">
                Ethical Pharmaceutical Marketing & Alliance Management
              </h3>
              <p className="text-sm text-[#334E68] leading-relaxed">
                As a modern healthcare marketing enterprise incorporated under the Ministry of Corporate Affairs, Juno Healthcare bridges clinical demand with verified pharmaceutical formulations. We partner exclusively with certified cGMP facilities that adhere strictly to Indian Pharmacopoeia (IP) and Schedule M standards.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Verified cGMP Partners</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Batch Quality Auditing</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Strict IP Monographs</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                  <span>Traceable Supply Chain</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#D9E2EC] bg-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#073B5C]">Official Registration</span>
                <p className="text-xs text-[#334E68] font-mono">CIN: U46497MR2026PTC474137 (ROC Mumbai II)</p>
              </div>
              <Link 
                href="/company" 
                className="px-4 py-2 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold rounded-xl transition-colors"
              >
                MCA Dossier
              </Link>
            </div>
          </div>

          {/* Process Interactive Box */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0B4C74]">
                <span className="text-xs font-bold text-[#48D4D2] uppercase tracking-widest">
                  Operational Workflow
                </span>
                <span className="text-xs text-[#F3F9FB]/60 font-mono">
                  Phase 0{activeStep + 1} of 0{marketingLifecycleSteps.length}
                </span>
              </div>

              {/* Progress Step Selector */}
              <div className="grid grid-cols-5 gap-1 mb-8">
                {marketingLifecycleSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStep === idx 
                        ? 'bg-[#48D4D2] ring-2 ring-[#48D4D2]/40' 
                        : idx < activeStep 
                          ? 'bg-[#16B8B3]' 
                          : 'bg-[#0B4C74] hover:bg-[#0D5C91]'
                    }`}
                    aria-label={`Go to step ${step.title}`}
                  />
                ))}
              </div>

              {/* Active Step Details */}
              {(() => {
                const current = marketingLifecycleSteps[activeStep];
                const Icon = STEP_ICONS[current.id] || ShieldCheck;
                return (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#16B8B3]/20 rounded-2xl border border-[#16B8B3]/30 text-[#48D4D2]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-[#F3F9FB]/60 uppercase font-bold tracking-wider">
                          Phase 0{activeStep + 1}
                        </span>
                        <h4 className="text-xl font-bold text-white">
                          {current.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#04243A] border border-[#0B4C74]">
                      <span className="text-xs font-bold text-[#48D4D2] block mb-1">
                        {current.tagline}
                      </span>
                      <p className="text-sm text-[#F3F9FB]/80 leading-relaxed">
                        {current.description}
                      </p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : marketingLifecycleSteps.length - 1))}
                        className="px-3 py-1.5 text-xs font-bold text-[#F3F9FB]/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        ← Previous Phase
                      </button>
                      <button
                        onClick={() => setActiveStep((prev) => (prev < marketingLifecycleSteps.length - 1 ? prev + 1 : 0))}
                        className="px-4 py-2 text-xs font-bold text-[#073B5C] bg-[#16B8B3] hover:bg-[#48D4D2] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next Phase</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
