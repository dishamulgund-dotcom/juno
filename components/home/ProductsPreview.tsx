'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import ProductDetailModal from '@/components/ui/ProductDetailModal';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';

interface ProductsPreviewProps {
  products: Product[];
}

const DOSAGE_FILTERS = ['All', 'Tablets', 'Capsules', 'Syrups', 'Injections', 'Ointments'];

export default function ProductsPreview({ products = [] }: ProductsPreviewProps) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesFilter =
        selectedFilter === 'All' || p.dosageForm.toLowerCase() === selectedFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.genericName.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q) ||
        p.therapeuticCategory.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [products, selectedFilter, searchQuery]);

  return (
    <section className="py-20 lg:py-28 bg-[#F3F9FB] border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-[#0D5C91] tracking-widest uppercase block">
              Pharmaceutical Formulations
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
              Our Healthcare Portfolio
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              Explore our verified pharmaceutical product range across core therapeutic categories. Formulated through accredited cGMP manufacturing partners.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#073B5C] hover:bg-[#0D5C91] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 self-start md:self-auto"
          >
            <span>View Full Vertical Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#D9E2EC] shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Dosage Form Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {DOSAGE_FILTERS.map(filter => {
              const active = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#073B5C] text-white shadow-xs'
                      : 'bg-[#F3F9FB] text-[#102A43] hover:bg-[#D9E2EC]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#334E68] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by generic, brand, category..."
              className="w-full pl-10 pr-4 py-2 bg-[#F3F9FB] border border-[#D9E2EC] rounded-xl text-xs font-medium text-[#102A43] placeholder:text-[#334E68]/70 focus:outline-none focus:ring-2 focus:ring-[#16B8B3] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, 6).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={prod => setActiveModalProduct(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D9E2EC] space-y-3">
            <AlertCircle className="w-10 h-10 text-[#334E68] mx-auto" />
            <h3 className="text-lg font-bold text-[#102A43]">
              No matching formulations found
            </h3>
            <p className="text-xs text-[#334E68] max-w-md mx-auto">
              {searchQuery
                ? `No products matched your search "${searchQuery}". Try a different therapeutic keyword or reset filters.`
                : 'Product portfolio is currently being updated with verified specifications.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('All');
                }}
                className="mt-2 text-xs font-bold text-[#0D5C91] hover:underline cursor-pointer"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        )}

        {/* Quick View Modal */}
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      </div>
    </section>
  );
}
