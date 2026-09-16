'use client';

import React, { useState } from 'react';
import { Pill, ShieldCheck, Factory, TrendingUp, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

const NODES = [
  {
    id: 'product',
    label: 'Product Concept',
    icon: Pill,
    headline: 'Therapeutic Identification & Monograph Scoping',
    description: 'Every product in the Juno portfolio begins with targeted clinical need identification, selecting optimal dosage forms and pharmacopoeial specifications.',
    metrics: ['Bioavailability Mapping', 'Pharmacopoeial Standard (IP)', 'Solid/Liquid Dosage Scoping']
  },
  {
    id: 'quality',
    label: 'Quality Audit',
    icon: ShieldCheck,
    headline: 'Multi-Tier Analytical Testing & Batch Verification',
    description: 'Active Pharmaceutical Ingredients (APIs) and finished forms undergo HPLC potency verification, dissolution profiling, and microbial assays.',
    metrics: ['Assay Potency Checks', 'Quarantine Release Authorization', 'Stability Protocol Auditing']
  },
  {
    id: 'manufacturing',
    label: 'cGMP Alliance',
    icon: Factory,
    headline: 'Vetted Third-Party Manufacturing Facilities',
    description: 'Production is contracted exclusively with facilities audited for Schedule M compliance, automated high-speed compression, and cleanroom HVAC protocols.',
    metrics: ['Class 100,000 Cleanrooms', 'Validated CIP/SIP Systems', 'Automated Containment Packing']
  },
  {
    id: 'marketing',
    label: 'Responsible Marketing',
    icon: TrendingUp,
    headline: 'Ethical Medical Representation & Physician Engagement',
    description: 'Our marketing team delivers truthful, scientifically grounded literature to clinicians and pharmacies without unsupported therapeutic claims.',
    metrics: ['Scientific Product Dossiers', 'Regulatory Literature Compliance', 'Distribution Channel Alignment']
  },
  {
    id: 'information',
    label: 'Healthcare Info',
    icon: BookOpen,
    headline: 'Patient Safety & Pharmacovigilance Vigilance',
    description: 'Transparent product information and active post-marketing pharmacovigilance surveillance to protect patient health.',
    metrics: ['Batch Traceability', 'Storage Guideline Transparency', 'Adverse Event Logging']
  }
];

export default function ScientificInteractive() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const activeNode = NODES[activeNodeIndex];
  const Icon = activeNode.icon;

  return (
    <section className="py-20 lg:py-28 bg-[#073B5C] text-white border-b border-[#0B4C74] relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-scientific-grid opacity-25 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#16B8B3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#48D4D2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#48D4D2] tracking-widest uppercase block">
            Integrated Lifecycle Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            From Quality to Care
          </h2>
          <p className="text-base text-[#F3F9FB]/90 leading-relaxed">
            Experience the systematic pharmaceutical marketing paradigm that unites formulation selection, rigorous partner verification, ethical communication, and healthcare delivery.
          </p>
        </div>

        {/* Interactive Node Path (Top Visualizer) */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {NODES.map((node, idx) => {
              const NodeIcon = node.icon;
              const isActive = activeNodeIndex === idx;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive
                      ? 'bg-[#04243A] border-[#16B8B3] shadow-lg ring-1 ring-[#48D4D2]/40'
                      : 'bg-[#073B5C] border-[#0B4C74] hover:border-[#16B8B3]/50 hover:bg-[#04243A]/50'
                  }`}
                  aria-selected={isActive}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#16B8B3] text-[#073B5C] font-bold'
                          : 'bg-[#04243A] text-[#48D4D2] group-hover:text-white'
                      }`}
                    >
                      <NodeIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F3F9FB]/60">
                      0{idx + 1}
                    </span>
                  </div>

                  <span className={`text-xs sm:text-sm font-bold block ${isActive ? 'text-white' : 'text-[#F3F9FB]/80'}`}>
                    {node.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16B8B3] to-[#48D4D2]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Node Detailed Display */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#04243A]/90 border border-[#0B4C74] shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#16B8B3]/20 rounded-2xl text-[#48D4D2] border border-[#16B8B3]/30">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#48D4D2] block">
                    Phase 0{activeNodeIndex + 1} • {activeNode.label}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {activeNode.headline}
                  </h3>
                </div>
              </div>

              <p className="text-base text-[#F3F9FB]/90 leading-relaxed">
                {activeNode.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#48D4D2] block">
                  Core Implementation Parameters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeNode.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#073B5C] border border-[#0B4C74] text-xs font-bold text-[#F3F9FB] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16B8B3] shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Step Navigator */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#073B5C] border border-[#0B4C74] space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#48D4D2] block">
                  Quality Feedback Loop
                </span>
                <h4 className="text-lg font-bold text-white">
                  Continuous Pharmacovigilance
                </h4>
                <p className="text-xs text-[#F3F9FB]/80 leading-relaxed">
                  Every stage feeds into our centralized pharmacovigilance and marketing registry, ensuring full traceability from the raw API lot to the pharmacy shelf.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#0B4C74]">
                <button
                  onClick={() => setActiveNodeIndex(prev => (prev > 0 ? prev - 1 : NODES.length - 1))}
                  className="px-3 py-2 text-xs font-bold text-[#F3F9FB]/70 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  ← Previous Node
                </button>
                <button
                  onClick={() => setActiveNodeIndex(prev => (prev < NODES.length - 1 ? prev + 1 : 0))}
                  className="px-4 py-2 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Next Node</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
