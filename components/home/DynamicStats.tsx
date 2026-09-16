'use client';

import React from 'react';
import { CompanyStat } from '@/types';
import { CheckCircle2, Clock } from 'lucide-react';

interface DynamicStatsProps {
  stats: CompanyStat[];
}

export default function DynamicStats({ stats = [] }: DynamicStatsProps) {
  return (
    <section className="py-20 lg:py-24 bg-white border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
            Metrics & Institutional Benchmarks
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
            Juno by the Numbers
          </h2>
          <p className="text-sm sm:text-base text-[#334E68]">
            Factual indicators reflecting corporate milestones, certified manufacturing network parameters, and verified operational status.
          </p>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div
              key={stat.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#F3F9FB] border border-[#D9E2EC] text-center flex flex-col justify-between shadow-xs hover:border-[#16B8B3] transition-all"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#334E68] block">
                  {stat.label}
                </span>
                
                <div className="text-3xl sm:text-4xl font-bold text-[#102A43] tracking-tight">
                  {stat.value ? stat.value : '—'}
                  {stat.suffix && <span className="text-2xl text-[#0D5C91] ml-1">{stat.suffix}</span>}
                </div>

                <p className="text-xs text-[#334E68] pt-1">
                  {stat.notes || (stat.isVerified ? 'Verified corporate milestone' : 'Data to be updated')}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#D9E2EC] flex items-center justify-center gap-1.5 text-[11px] font-bold">
                {stat.isVerified ? (
                  <span className="text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    MCA Verified Record
                  </span>
                ) : (
                  <span className="text-[#334E68] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Data to be updated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
