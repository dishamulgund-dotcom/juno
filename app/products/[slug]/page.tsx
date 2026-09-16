import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/db';
import ProductSpecDownloadButton from '@/components/products/ProductSpecDownloadButton';
import { 
  Pill, 
  ShieldCheck, 
  ArrowLeft, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Juno Healthcare Private Limited',
      description: 'The requested pharmaceutical product formulation is unavailable.'
    };
  }

  return {
    title: `${product.name} (${product.genericName}) | Juno Healthcare`,
    description: `Official pharmaceutical datasheet for ${product.name} - ${product.composition}. Dosage: ${product.dosageForm}, Strength: ${product.strength}.`
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts({ dosageForm: product.dosageForm }))
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-[#F3F9FB] border-b border-[#D9E2EC] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#073B5C] hover:text-[#0D5C91] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Portfolio</span>
          </Link>

          <div className="text-xs text-[#334E68] hidden sm:block">
            <span>Portfolio</span> / <span className="text-[#073B5C] font-semibold">{product.dosageForm}</span> / <span className="text-[#102A43] font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Datasheet Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Product Identity & Core Specs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title & Badges */}
            <div className="space-y-3 pb-6 border-b border-[#D9E2EC]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3F9FB] text-[#073B5C] border border-[#16B8B3]/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Pill className="w-3.5 h-3.5 text-[#16B8B3]" />
                  {product.dosageForm}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F9FB] text-[#334E68] rounded-full text-xs font-semibold">
                  {product.therapeuticCategory}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#073B5C] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#48D4D2]" />
                    Key Formulation
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102A43] tracking-tight">
                {product.name}
              </h1>

              <p className="text-base sm:text-lg font-semibold text-[#0D5C91]">
                {product.genericName}
              </p>
            </div>

            {/* High-Resolution Pack Visual (Featured Container) */}
            <div className="relative w-full max-w-lg mx-auto aspect-video sm:aspect-2/1 bg-gradient-to-b from-[#F3F9FB] to-white rounded-3xl border border-[#D9E2EC] p-6 flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-scientific-grid opacity-30 pointer-events-none" />
              <div className="relative w-full h-full max-w-xs transition-transform duration-300 hover:scale-105">
                <Image
                  src={product.image || '/images/placeholder-product.png'}
                  alt={`${product.name} Pack`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Pharmacopoeial Composition Box */}
            <div className="p-6 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#073B5C] block">
                Approved Pharmacopoeial Formula & Active Composition
              </span>
              <p className="text-sm text-[#102A43] font-semibold leading-relaxed">
                {product.composition}
              </p>
            </div>

            {/* Specification Matrix Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#102A43]">
                Formulation Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F3F9FB] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Strength</span>
                  <p className="text-sm font-bold text-[#102A43]">{product.strength || 'Standard'}</p>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F3F9FB] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Packaging Presentation</span>
                  <p className="text-sm font-bold text-[#102A43]">{product.packSize}</p>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F3F9FB] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Therapeutic Class</span>
                  <p className="text-sm font-bold text-[#102A43]">{product.therapeuticCategory}</p>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F3F9FB] space-y-1">
                  <span className="text-xs text-[#334E68] uppercase font-bold">Manufacturing Standard</span>
                  <p className="text-sm font-bold text-[#102A43]">{product.manufacturer || 'Verified cGMP Partner Facility'}</p>
                </div>
              </div>
            </div>

            {/* Description & Clinical Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#102A43]">
                Therapeutic Description & Overview
              </h2>
              <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                {product.description}
              </p>

              {product.indications && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-base font-bold text-[#102A43]">
                    Clinical Indications
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed">
                    {product.indications}
                  </p>
                </div>
              )}
            </div>

            {/* Storage Guidelines */}
            <div className="p-5 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#073B5C]">
                Storage & Quality Maintenance Guidelines
              </h3>
              <p className="text-xs text-[#334E68] leading-relaxed">
                {product.storageInstructions || 'Store in a cool, dry place protected from light and moisture. Keep out of reach of children.'}
              </p>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Statutory Medical Notice</span>
              </div>
              <p>
                This product information sheet is published exclusively for healthcare practitioners, hospital formularies, and licensed pharmaceutical distributors. It does not constitute medical advice or direct treatment guidance. The formulation should only be prescribed and dispensed by qualified medical professionals under statutory drug control regulations.
              </p>
            </div>

          </div>

          {/* Right Column: Commercial Actions & Enquiry Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Commercial Order / Inquiry Card */}
            <div className="p-8 rounded-3xl bg-[#073B5C] text-white shadow-xl border border-[#0B4C74] space-y-6 sticky top-24">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#48D4D2] block">
                  Commercial Inquiries & Trade Supply
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Stockist & Institutional Supply
                </h3>
                <p className="text-xs text-[#F3F9FB]/80 leading-relaxed">
                  Submit an institutional inquiry for commercial supply terms, batch analysis records (CoA), or regional distribution availability for {product.name}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#04243A] border border-[#0B4C74] text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-[#F3F9FB]/70">
                  <span>Product Code:</span>
                  <span className="text-white">{product.id}</span>
                </div>
                <div className="flex items-center justify-between text-[#F3F9FB]/70">
                  <span>Presentation:</span>
                  <span className="text-white font-medium">{product.packSize}</span>
                </div>
                <div className="flex items-center justify-between text-[#F3F9FB]/70">
                  <span>Status:</span>
                  <span className="text-[#48D4D2] font-bold">Active in Catalog</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&category=Product+Inquiry`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#16B8B3] hover:bg-[#48D4D2] text-[#073B5C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Enquire About {product.name}</span>
                </Link>

                <ProductSpecDownloadButton
                  productName={product.name}
                  genericName={product.genericName}
                />
              </div>

              <div className="pt-4 border-t border-[#0B4C74] text-[11px] text-[#F3F9FB]/70 space-y-1">
                <div>Direct Phone: <a href="tel:+919743094555" className="text-white font-bold hover:underline">+91 9743094555</a></div>
                <div>Corporate Portal: <span className="text-[#48D4D2] font-mono">junohealthcare.in</span></div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Formulations in Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#D9E2EC]">
            <h3 className="text-2xl font-bold text-[#102A43] mb-6">
              Other {product.dosageForm} Formulations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(rel => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="p-5 rounded-2xl bg-[#F3F9FB] border border-[#D9E2EC] hover:border-[#16B8B3] hover:shadow-md transition-all group"
                >
                  <span className="text-[11px] font-bold text-[#0D5C91] uppercase">{rel.dosageForm}</span>
                  <h4 className="text-lg font-bold text-[#102A43] group-hover:text-[#073B5C] transition-colors mt-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#334E68] mt-1 line-clamp-1">{rel.composition}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
