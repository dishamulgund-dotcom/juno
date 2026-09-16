import React from 'react';
import type { Metadata } from 'next';
import { getProductsPaginated, getCategories } from '@/lib/db';
import ProductsCatalogClient from './ProductsCatalogClient';

export const metadata: Metadata = {
  title: 'Healthcare Portfolio | Pharmaceutical Formulations',
  description: 'Explore the complete pharmaceutical product portfolio from Juno Healthcare Private Limited. Quality-assured tablets, capsules, injectables, and syrups.'
};

export const revalidate = 0;

export default async function ProductsPage() {
  const [paginatedResult, categories] = await Promise.all([
    getProductsPaginated({ includeDrafts: false, page: 1, limit: 12 }),
    getCategories()
  ]);

  return (
    <div className="bg-slate-50/60 min-h-screen">
      {/* Header */}
      <section className="py-16 lg:py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-sky-400 tracking-widest uppercase block">
              Formulation Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
              Pharmaceutical Products
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Explore our verified healthcare formulations manufactured in compliance with Indian Pharmacopoeia monographs and cGMP quality standards.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Catalog Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <ProductsCatalogClient
          initialProducts={paginatedResult.products}
          categories={categories}
          initialTotal={paginatedResult.total}
        />
      </div>
    </div>
  );
}
