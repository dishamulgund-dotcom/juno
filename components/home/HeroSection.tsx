'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import ScientificCanvas from '@/components/ui/ScientificCanvas';

export default function HeroSection() {
  const scrollToNext = () => {
    const valueStrip = document.getElementById('value-strip');
    if (valueStrip) {
      valueStrip.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center bg-gradient-to-b from-[#F3F9FB] via-white to-[#F3F9FB] overflow-hidden border-b border-[#D9E2EC]">
      {/* Interactive Scientific Canvas */}
      <ScientificCanvas className="opacity-75" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-scientific-grid pointer-events-none opacity-40" />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 flex flex-col items-center text-center">
        
        {/* Verified Corporate Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F9FB] border border-[#16B8B3]/50 text-[#073B5C] text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#16B8B3]" />
          <span>Juno Healthcare Private Limited • CIN: U46497MR2026PTC474137</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#102A43] tracking-tight max-w-4xl leading-[1.1] mb-6">
          Pharmaceutical Formulations Built on{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#073B5C] via-[#0D5C91] to-[#16B8B3]">
            Unwavering Quality.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-lg sm:text-xl lg:text-2xl text-[#334E68] max-w-2xl font-normal leading-relaxed mb-10">
          Precision pharmaceutical medicine marketing, verified pharmacopoeial formulations, and responsible healthcare distribution across India.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <span>Explore Healthcare Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/quality"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] hover:border-[#16B8B3] text-sm font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all duration-200"
          >
            <span>Our 7-Stage Quality Journey</span>
          </Link>
        </div>

        {/* Corporate Trust Pillars Mini Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl text-left pt-8 border-t border-[#D9E2EC]">
          <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D9E2EC] shadow-xs">
            <span className="text-[11px] font-bold text-[#0D5C91] uppercase tracking-wider block mb-1">Corporate Entity</span>
            <p className="text-sm font-bold text-[#102A43]">MCA Registered</p>
            <span className="text-xs text-[#334E68]">ROC Mumbai II</span>
          </div>

          <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D9E2EC] shadow-xs">
            <span className="text-[11px] font-bold text-[#0D5C91] uppercase tracking-wider block mb-1">Operational Scope</span>
            <p className="text-sm font-bold text-[#102A43]">Pharma Marketing</p>
            <span className="text-xs text-[#334E68]">Nationwide Reach</span>
          </div>

          <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D9E2EC] shadow-xs">
            <span className="text-[11px] font-bold text-[#0D5C91] uppercase tracking-wider block mb-1">Manufacturing</span>
            <p className="text-sm font-bold text-[#102A43]">cGMP Compliant</p>
            <span className="text-xs text-[#334E68]">Audited Partner Units</span>
          </div>

          <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-[#D9E2EC] shadow-xs">
            <span className="text-[11px] font-bold text-[#0D5C91] uppercase tracking-wider block mb-1">Standards</span>
            <p className="text-sm font-bold text-[#102A43]">IP Monographs</p>
            <span className="text-xs text-[#334E68]">Batch Tested COA</span>
          </div>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 text-[#334E68] hover:text-[#073B5C] transition-colors flex flex-col items-center gap-1 text-xs focus:outline-none"
        aria-label="Scroll to content"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#334E68]">Explore Portfolio</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#16B8B3]" />
      </button>
    </section>
  );
}
