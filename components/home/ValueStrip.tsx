import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Target } from 'lucide-react';

const VALUES = [
  {
    title: 'QUALITY',
    subtitle: 'Standardized Formulations',
    description: 'Committed to rigorous pharmacopoeial specifications and analytical integrity across every batch.',
    icon: ShieldCheck
  },
  {
    title: 'RESPONSIBILITY',
    subtitle: 'Ethical Healthcare',
    description: 'Transparent pharmaceutical marketing grounded strictly in factual science and patient safety.',
    icon: HeartHandshake
  },
  {
    title: 'TRUST',
    subtitle: 'Verified Partnerships',
    description: 'Cultivating long-term alliances with accredited manufacturers, distributors, and medical professionals.',
    icon: Award
  },
  {
    title: 'PRECISION',
    subtitle: 'Clinical Excellence',
    description: 'Systematic therapeutic evaluation ensuring optimal dosage forms, packaging, and stability.',
    icon: Target
  }
];

export default function ValueStrip() {
  return (
    <section id="value-strip" className="bg-[#073B5C] text-white py-12 lg:py-16 border-y border-[#0B4C74]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#0B4C74]">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div 
                key={val.title}
                className={`pt-6 sm:pt-0 ${idx !== 0 ? 'lg:pl-6' : ''} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-[#16B8B3]/20 text-[#48D4D2] border border-[#16B8B3]/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold tracking-widest text-white uppercase">
                      {val.title}
                    </h3>
                  </div>
                  <h4 className="text-sm font-bold text-[#48D4D2] mb-2">
                    {val.subtitle}
                  </h4>
                  <p className="text-xs text-[#F3F9FB]/80 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
