import React from 'react';
import { whyJunoPillars } from '@/lib/mockData';
import { ShieldCheck, HeartHandshake, Users2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PILLAR_ICONS: Record<string, any> = {
  quality: ShieldCheck,
  responsibility: HeartHandshake,
  partnership: Users2,
  growth: Sparkles
};

export default function WhyJuno() {
  return (
    <section className="py-20 lg:py-28 bg-[#F3F9FB] border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Strategic Value Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
              Why Healthcare Partners Choose Juno
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              We approach pharmaceutical marketing not as a transactional commodity, but as a long-term clinical and distribution partnership built on responsibility and consistency.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#073B5C] hover:text-[#0D5C91] group shrink-0"
          >
            <span>Learn About Our Principles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyJunoPillars.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[pillar.id] || ShieldCheck;
            return (
              <div
                key={pillar.id}
                className="p-8 rounded-3xl bg-white border border-[#D9E2EC] shadow-xs hover:border-[#16B8B3] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] w-fit group-hover:bg-[#073B5C] group-hover:text-white group-hover:border-[#073B5C] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-[#334E68] block mb-1">
                      Pillar 0{idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-[#102A43] group-hover:text-[#073B5C] transition-colors">
                      {pillar.title}
                    </h3>
                    <span className="text-xs font-bold text-[#0D5C91] block mt-0.5">
                      {pillar.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-[#334E68] leading-relaxed pt-1">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#D9E2EC] flex items-center justify-between text-xs font-bold text-[#334E68] group-hover:text-[#073B5C] transition-colors">
                  <span>Standard of Practice</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
