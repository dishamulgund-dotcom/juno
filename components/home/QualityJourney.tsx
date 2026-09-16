'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { qualityProcessSteps } from '@/lib/mockData';
import { 
  ShieldCheck, 
  FlaskConical, 
  Settings2, 
  Gauge, 
  Microscope, 
  FileCheck2, 
  Truck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const STAGE_ICONS = [
  FlaskConical,
  Gauge,
  Settings2,
  Microscope,
  ShieldCheck,
  FileCheck2,
  Truck
];

export default function QualityJourney() {
  const [selectedStage, setSelectedStage] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
            Quality Assurance Paradigm
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
            Quality Is an Uncompromising Process.
          </h2>
          <p className="text-base sm:text-lg text-[#334E68] leading-relaxed pt-2">
            Pharmaceutical integrity is achieved through continuous verification. Every formulation marketed by Juno Healthcare undergoes a 7-stage quality lifecycle from API validation to cold-chain delivery.
          </p>
        </div>

        {/* Interactive 7-Stage Stepper Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Stage List Navigator (Left) */}
          <div className="lg:col-span-5 space-y-2">
            {qualityProcessSteps.map((step, idx) => {
              const isSelected = selectedStage === idx;
              const Icon = STAGE_ICONS[idx] || ShieldCheck;
              return (
                <button
                  key={step.step}
                  onClick={() => setSelectedStage(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-[#073B5C] text-white border-[#0B4C74] shadow-md translate-x-1'
                      : 'bg-[#F3F9FB] hover:bg-[#D9E2EC]/50 text-[#102A43] border-[#D9E2EC]'
                  }`}
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                        isSelected
                          ? 'bg-[#16B8B3] text-[#073B5C]'
                          : 'bg-[#D9E2EC] text-[#073B5C] group-hover:bg-[#BCCCDC]'
                      }`}
                    >
                      {step.step}
                    </span>
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#102A43]'}`}>
                        {step.title}
                      </h4>
                      <span className={`text-xs ${isSelected ? 'text-[#48D4D2]' : 'text-[#334E68]'}`}>
                        {step.subtitle}
                      </span>
                    </div>
                  </div>

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isSelected ? 'text-[#48D4D2]' : 'text-[#334E68] group-hover:text-[#073B5C]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Breakdown (Right) */}
          <div className="lg:col-span-7">
            {(() => {
              const current = qualityProcessSteps[selectedStage];
              const Icon = STAGE_ICONS[selectedStage] || ShieldCheck;
              return (
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#073B5C] to-[#04243A] text-white shadow-xl border border-[#0B4C74] space-y-8 animate-fade-in relative overflow-hidden">
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#16B8B3]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Stage Top Bar */}
                  <div className="flex items-center justify-between pb-6 border-b border-[#0B4C74]">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#16B8B3]/20 rounded-2xl text-[#48D4D2] border border-[#16B8B3]/30">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#48D4D2]">
                          Quality Stage 0{selectedStage + 1} of 0{qualityProcessSteps.length}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                          {current.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-3xl font-bold font-mono text-[#F3F9FB]/30">
                      {current.step}
                    </span>
                  </div>

                  {/* Content Breakdown */}
                  <div className="space-y-4">
                    <div className="inline-block px-3.5 py-1 rounded-full bg-[#04243A] border border-[#0B4C74] text-[#48D4D2] text-xs font-semibold">
                      Standard: {current.subtitle}
                    </div>

                    <p className="text-base text-[#F3F9FB]/90 leading-relaxed">
                      {current.description}
                    </p>
                  </div>

                  {/* Quality Checklist */}
                  <div className="p-5 rounded-2xl bg-[#04243A] border border-[#0B4C74] space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#48D4D2]">
                      Standard Quality Protocol
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#F3F9FB]/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                        <span>Pharmacopoeial Conformity (IP)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                        <span>Documented Analytical Audit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                        <span>Traceable Batch Records</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0" />
                        <span>Quarantine Clearance & CoA</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#F3F9FB]/60">
                      Click any stage on the left to review protocol
                    </span>
                    <Link
                      href="/quality"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#48D4D2] hover:text-white transition-colors"
                    >
                      <span>Read Complete Quality Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
}
