'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { X, Pill, ShieldCheck, Box, Building, FileText, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B5C]/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9E2EC] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prod-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#073B5C] text-white border-b border-[#0B4C74]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#16B8B3]/20 rounded-xl text-[#48D4D2]">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#48D4D2] font-bold">{product.dosageForm}</span>
              <h3 id="prod-modal-title" className="text-xl font-bold text-white leading-tight">
                {product.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#0B4C74] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Top visual and generic summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="relative w-full h-36 bg-[#F3F9FB] rounded-2xl border border-[#D9E2EC] p-3 flex items-center justify-center">
              <Image
                src={product.image || '/images/placeholder-product.png'}
                alt={product.name}
                fill
                sizes="150px"
                className="object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                }}
              />
            </div>

            <div className="sm:col-span-2 p-4 bg-[#F3F9FB] rounded-2xl border border-[#D9E2EC] space-y-1">
              <span className="text-xs font-bold text-[#073B5C] uppercase tracking-wider block">
                Generic Name / Pharmacopoeial Formula
              </span>
              <p className="text-sm font-bold text-[#102A43]">
                {product.genericName}
              </p>
              <div className="mt-2 pt-2 border-t border-[#D9E2EC] text-xs text-[#334E68] font-mono">
                {product.composition}
              </div>
            </div>
          </div>

          {/* Grid Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F3F9FB] rounded-xl border border-[#D9E2EC]">
              <span className="text-[11px] font-bold text-[#334E68] uppercase block mb-0.5">Strength</span>
              <span className="text-xs font-bold text-[#102A43]">{product.strength || 'Standard'}</span>
            </div>
            <div className="p-3 bg-[#F3F9FB] rounded-xl border border-[#D9E2EC]">
              <span className="text-[11px] font-bold text-[#334E68] uppercase block mb-0.5">Category</span>
              <span className="text-xs font-bold text-[#0D5C91] truncate block">{product.therapeuticCategory}</span>
            </div>
            <div className="p-3 bg-[#F3F9FB] rounded-xl border border-[#D9E2EC]">
              <span className="text-[11px] font-bold text-[#334E68] uppercase block mb-0.5">Pack Configuration</span>
              <span className="text-xs font-bold text-[#102A43]">{product.packSize}</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#334E68] mb-1.5">
                Therapeutic Description
              </h4>
              <p className="text-sm text-[#102A43] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {product.indications && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#334E68] mb-1.5">
                Clinical Indications
              </h4>
              <p className="text-sm text-[#102A43] leading-relaxed">
                {product.indications}
              </p>
            </div>
          )}

          {/* Storage & Disclaimer */}
          <div className="p-3.5 bg-[#F3F9FB] rounded-xl border border-[#D9E2EC] text-xs text-[#334E68] space-y-1">
            <p><strong>Storage:</strong> {product.storageInstructions || 'Store in a cool, dry place protected from light.'}</p>
            <p className="text-[11px] text-[#334E68]/70 italic pt-1 border-t border-[#D9E2EC]">
              * Product monograph for healthcare distributor and trade inquiry purposes only.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F3F9FB] border-t border-[#D9E2EC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#334E68] hover:bg-[#D9E2EC] rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-colors"
            >
              Full Product Page
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
