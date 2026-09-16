'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { ArrowRight, ShieldCheck, Pill, CheckCircle2, Eye, ExternalLink } from 'lucide-react';

interface VerticalProductShowcaseProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export default function VerticalProductShowcase({
  products,
  onQuickView
}: VerticalProductShowcaseProps) {
  return (
    <div className="space-y-20 lg:space-y-32">
      {products.map((product, index) => {
        const itemNumber = (index + 1).toString().padStart(2, '0');
        const isEven = index % 2 === 1;

        return (
          <article
            key={product.id}
            className="group relative bg-white rounded-3xl border border-[#D9E2EC] p-6 sm:p-10 lg:p-12 shadow-sm hover:shadow-xl hover:border-[#16B8B3]/60 transition-all duration-300"
          >
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
              isEven ? 'lg:grid-flow-dense' : ''
            }`}>
              
              {/* LEFT / SPECIFICATION SHEET (Cols 1-7 or 6-12) */}
              <div className={`space-y-6 ${isEven ? 'lg:col-start-6 lg:col-span-7' : 'lg:col-span-7'}`}>
                
                {/* Index & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D9E2EC]">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-[#073B5C]/20 group-hover:text-[#16B8B3]/40 transition-colors font-mono">
                      {itemNumber}
                    </span>
                    <span className="px-3 py-1 bg-[#F3F9FB] text-[#073B5C] border border-[#16B8B3]/30 text-xs font-bold uppercase rounded-full tracking-wider">
                      {product.dosageForm}
                    </span>
                  </div>

                  {product.isFeatured && (
                    <span className="px-3 py-1 bg-[#073B5C] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
                      Key Formulation
                    </span>
                  )}
                </div>

                {/* Formulation Title & Generic Composition */}
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#102A43] tracking-tight group-hover:text-[#073B5C] transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-base sm:text-lg font-medium text-[#0D5C91] leading-snug">
                    {product.genericName}
                  </p>
                </div>

                {/* Full Chemical Composition Box */}
                <div className="p-4 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#334E68] block">
                    Pharmacopoeial Active Composition
                  </span>
                  <p className="text-xs sm:text-sm text-[#102A43] leading-relaxed">
                    {product.composition}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white border border-[#D9E2EC] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#334E68] block">Clinical Strength</span>
                    <span className="font-bold text-[#102A43] text-sm">{product.strength || 'Standard'}</span>
                  </div>
                  <div className="p-3 bg-white border border-[#D9E2EC] rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-[#334E68] block">Pack Configuration</span>
                    <span className="font-bold text-[#102A43] text-sm">{product.packSize}</span>
                  </div>
                  <div className="p-3 bg-white border border-[#D9E2EC] rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-[#334E68] block">Category</span>
                    <span className="font-bold text-[#0D5C91] truncate block">{product.therapeuticCategory}</span>
                  </div>
                </div>

                {/* Indications */}
                {product.indications && (
                  <div className="flex items-start gap-2 text-xs text-[#334E68] pt-1">
                    <CheckCircle2 className="w-4 h-4 text-[#16B8B3] shrink-0 mt-0.5" />
                    <span><strong>Clinical Indications:</strong> {product.indications}</span>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#D9E2EC]">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all group/btn"
                  >
                    <span>View Full Specification</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={() => onQuickView(product)}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-white hover:bg-[#F3F9FB] text-[#073B5C] border border-[#D9E2EC] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    <Eye className="w-4 h-4 text-[#16B8B3]" />
                    <span>Quick Inspection</span>
                  </button>
                </div>

              </div>

              {/* RIGHT / PACKAGING VISUAL (Cols 8-12 or 1-5) */}
              <div className={`${isEven ? 'lg:col-start-1 lg:col-span-5' : 'lg:col-span-5'} flex justify-center`}>
                <div className="relative w-full max-w-[380px] aspect-square rounded-3xl bg-gradient-to-b from-[#F3F9FB] to-white border border-[#D9E2EC] p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#16B8B3]/50 transition-colors">
                  
                  {/* Subtle Grid Backdrop */}
                  <div className="absolute inset-0 bg-scientific-grid opacity-30 pointer-events-none" />

                  {/* Product Pack Visual */}
                  <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={product.image || '/images/placeholder-product.png'}
                      alt={`${product.name} - Juno Healthcare Formulations`}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-contain drop-shadow-md"
                      onError={(e) => {
                        // If image fails, fallback to placeholder
                        (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                      }}
                    />
                  </div>

                  {/* Authenticity Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-[#D9E2EC] text-[10px] font-mono font-bold text-[#073B5C] shadow-xs">
                    cGMP Monograph
                  </div>
                </div>
              </div>

            </div>
          </article>
        );
      })}
    </div>
  );
}
