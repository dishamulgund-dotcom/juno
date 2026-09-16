'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Pill, ArrowRight, Box, Eye, Droplet, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const getDosageIcon = (form: string) => {
    switch (form.toLowerCase()) {
      case 'tablets':
      case 'capsules':
        return Pill;
      case 'syrups':
      case 'drops':
      case 'injections':
        return Droplet;
      default:
        return Box;
    }
  };

  const DosageIcon = getDosageIcon(product.dosageForm);

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#D9E2EC] shadow-xs hover:border-[#16B8B3] hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Product Image Thumbnail */}
      <div className="relative w-full h-44 bg-gradient-to-b from-[#F3F9FB] to-white border-b border-[#D9E2EC] p-4 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.image || '/images/placeholder-product.png'}
            alt={`${product.name} - Juno Healthcare Formulations`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
            }}
          />
        </div>

        {/* Dosage Form Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#073B5C] border border-[#D9E2EC] text-[11px] font-bold uppercase tracking-wider shadow-xs">
            <DosageIcon className="w-3 h-3 text-[#16B8B3]" />
            {product.dosageForm}
          </span>
        </div>

        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#073B5C] text-white text-[10px] font-bold uppercase shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#48D4D2]" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 pb-0 flex-1 flex flex-col">
        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="focus:outline-none">
          <h3 className="text-xl font-bold text-[#102A43] group-hover:text-[#073B5C] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Strength & Generic name */}
        <div className="mt-1 space-y-1">
          <p className="text-xs font-semibold text-[#0D5C91] line-clamp-1">
            {product.genericName}
          </p>
          <p className="text-[11px] text-[#334E68] line-clamp-2">
            {product.composition}
          </p>
        </div>
      </div>

      {/* Attributes Strip */}
      <div className="p-5 pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-[#F3F9FB] border border-[#D9E2EC] text-xs">
          <div>
            <span className="text-[10px] text-[#334E68] uppercase block font-bold">Strength</span>
            <span className="font-bold text-[#102A43] text-[11px]">{product.strength || 'Standard'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#334E68] uppercase block font-bold">Pack Presentation</span>
            <span className="font-bold text-[#102A43] text-[11px] truncate block">{product.packSize}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#D9E2EC]">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#334E68] hover:text-[#073B5C] py-1.5 px-2.5 rounded-lg hover:bg-[#F3F9FB] transition-colors cursor-pointer"
              title="Quick specifications"
            >
              <Eye className="w-3.5 h-3.5 text-[#16B8B3]" />
              <span>Quick Spec</span>
            </button>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#073B5C] hover:text-white ml-auto py-1.5 px-3 rounded-lg bg-[#F3F9FB] hover:bg-[#073B5C] transition-colors"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
