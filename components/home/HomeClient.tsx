'use client';

import React, { useState, useEffect } from 'react';
import CoverPage from './CoverPage';
import HeroSection from './HeroSection';
import ValueStrip from './ValueStrip';
import AboutPreview from './AboutPreview';
import ProductsPreview from './ProductsPreview';
import QualityJourney from './QualityJourney';
import ManufacturingNetwork from './ManufacturingNetwork';
import CertificationsStrip from './CertificationsStrip';
import CorporateProfileCard from './CorporateProfileCard';
import DynamicStats from './DynamicStats';
import WhyJuno from './WhyJuno';
import ScientificInteractive from './ScientificInteractive';
import ContactSection from './ContactSection';
import { Product, Manufacturer, Certification, CompanyStat } from '@/types';
import { Sparkles, Layout } from 'lucide-react';

interface HomeClientProps {
  products: Product[];
  manufacturers: Manufacturer[];
  certifications: Certification[];
  stats: CompanyStat[];
}

export default function HomeClient({
  products,
  manufacturers,
  certifications,
  stats
}: HomeClientProps) {
  const [showCover, setShowCover] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already entered in this session or requested skip via URL
    const hasEntered = sessionStorage.getItem('juno_cover_entered');
    if (hasEntered === 'true') {
      setShowCover(false);
    }
  }, []);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowCover(false);
      setIsTransitioning(false);
      sessionStorage.setItem('juno_cover_entered', 'true');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);
  };

  const handleReturnToCover = () => {
    setShowCover(true);
    sessionStorage.removeItem('juno_cover_entered');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showCover && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#041D2D] animate-fade-in">
          <CoverPage onEnter={handleEnter} />
        </div>
      )}

      <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Return to Cover Page Mini Floating Action */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleReturnToCover}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#073B5C]/90 hover:bg-[#073B5C] text-white text-xs font-bold rounded-full shadow-lg border border-[#16B8B3]/30 backdrop-blur-xs transition-all hover:scale-105"
          title="Return to Scientific Cover Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#48D4D2]" />
          <span>Cover View</span>
        </button>
      </div>

      {/* 1. Hero Section with Top-Left Official Logo Context */}
      <HeroSection />

      {/* 2. Value / Trust Strip */}
      <ValueStrip />

      {/* 3. About Juno & Interactive Workflow */}
      <AboutPreview />

      {/* 4. Products Portfolio Showcase */}
      <ProductsPreview products={products} />

      {/* 5. Quality Journey Interactive 7-Stage Pipeline */}
      <QualityJourney />

      {/* 6. Manufacturing Partner Network */}
      <ManufacturingNetwork manufacturers={manufacturers} />

      {/* 7. Certifications & Compliance Registry */}
      <CertificationsStrip certifications={certifications} />

      {/* 8. Verified Corporate Profile (MCA Filing) */}
      <CorporateProfileCard />

      {/* 9. Juno by the Numbers (Dynamic Stats) */}
      <DynamicStats stats={stats} />

      {/* 10. Why Juno (4 Editorial Pillars) */}
      <WhyJuno />

      {/* 11. Scientific Interactive (From Quality to Care) */}
      <ScientificInteractive />

      {/* 12. Contact & Commercial Inquiry */}
      <ContactSection />
    </div>
    </>
  );
}
