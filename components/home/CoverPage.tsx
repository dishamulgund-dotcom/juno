'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Phone, Mail, Globe } from 'lucide-react';
import ButterflySignature, { ButterflyGraphic } from './ButterflySignature';
import MolecularDepthCanvas from './MolecularDepthCanvas';

interface CoverPageProps {
  onEnter: () => void;
}

export default function CoverPage({ onEnter }: CoverPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [isButterflyPerched, setIsButterflyPerched] = useState(false);
  const logoRef = useRef<HTMLDivElement | null>(null);

  // Subtle mouse tracking for gentle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Motion Timeline:
  // STEP 1 (0.15s): Clean light background & corporate statutory header/footer appear
  // STEP 2 (0.35s): JUNO Logo reveals in the luminous center
  // STEP 3 (0.65s): Editorial headline "PHARMACEUTICAL formulation & marketing" & quote reveal
  // STEP 4 (0.95s): ENTER PLATFORM CTA & subtitle become active
  // (Main content completes by ~1.2s, right BEFORE the butterfly begins flight at 2.0s)
  useEffect(() => {
    const s1 = setTimeout(() => setIntroStep(1), 150);
    const s2 = setTimeout(() => setIntroStep(2), 350);
    const s3 = setTimeout(() => setIntroStep(3), 650);
    const s4 = setTimeout(() => setIntroStep(4), 950);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(s4);
    };
  }, []);

  const handleEnterClick = () => {
    if (isExiting) return;
    setIsExiting(true);
    // 700ms smooth dissolution transition
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  return (
    <div 
      className={`relative w-full min-h-screen bg-[#F8FCFD] text-[#073B5C] flex flex-col justify-between overflow-hidden select-none transition-all duration-700 ${
        isExiting ? 'scale-102 opacity-0' : 'opacity-100'
      }`}
    >
      {/* =========================================================================
          1. CLEAN, BRIGHT PHARMACEUTICAL SCIENTIFIC BACKGROUND
          (PREDOMINANTLY WHITE / PALE CYAN, SOFT LAB GLASSWARE, LIGHT 3D MOLECULES)
          ========================================================================= */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px) scale(1.02)`
        }}
      >
        <Image
          src="/images/juno-cover-exact-bg.png"
          alt="Juno Healthcare Scientific Environment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-115 contrast-95 opacity-92"
        />
        {/* Soft luminous white & pale-cyan diffusion for maximum overall lightness & logo clarity */}
        <div className="absolute inset-0 bg-radial from-white/80 via-white/45 to-white/20 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-white/30 pointer-events-none" />
      </div>

      {/* Dynamic Ambient Molecular Particles, Bokeh & Soft Light Sweep Canvas */}
      <MolecularDepthCanvas mousePos={mousePos} isExiting={isExiting} />

      {/* Signature Butterfly (Flies strictly ONCE on page load, lands, and stays permanently) */}
      <ButterflySignature 
        logoRef={logoRef} 
        isExiting={isExiting} 
        onPerched={() => setIsButterflyPerched(true)} 
      />

      {/* =========================================================================
          2. CORPORATE STATUTORY HEADER BAR (STRONG CONTRAST & CLEAR READABILITY)
          ========================================================================= */}
      <header className="relative z-10 w-full px-4 sm:px-12 py-2.5 sm:py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-3 text-xs backdrop-blur-2xs font-sans text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[#073B5C] bg-[#FFFFFF]/95 px-3 py-1 rounded-full border border-[#00B4D8]/35 text-[10px] sm:text-[12px] font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B4D8]" />
            CIN: U46497MR2026PTC474137
          </span>
          <span className="hidden md:inline text-[#073B5C]/35 font-light">|</span>
          <span className="hidden md:inline text-[#073B5C] text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-bold">
            ROC MUMBAI II • REG. NO: 474137
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] text-[#073B5C] uppercase tracking-[0.12em] sm:tracking-[0.2em] font-bold flex-wrap">
          <span className="text-[#073B5C]">NON-GOVT COMPANY</span>
          <span className="text-[#073B5C]/35">•</span>
          <span>DATE OF INC: 06 MARCH 2026</span>
        </div>
      </header>

      {/* =========================================================================
          3. CENTERPIECE — OFFICIAL JUNO LOGO, EDITORIAL TYPOGRAPHY & CTA BUTTON
          ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-3 sm:py-6">
        <div 
          className="w-full max-w-4xl flex flex-col items-center transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px)`
          }}
        >
          {/* OFFICIAL JUNO LOGO HERO */}
          <div 
            ref={logoRef}
            className={`relative mb-4 sm:mb-6 transition-all duration-1000 ease-out ${
              introStep >= 2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
            }`}
          >
            {/* Luminous Cleanroom Halo */}
            <div className="absolute inset-0 -inset-x-16 -inset-y-10 rounded-full bg-radial from-[#FFFFFF]/95 via-[#FFFFFF]/60 to-transparent blur-2xl pointer-events-none -z-10" />

            {/* JUNO Master Artwork */}
            <div className="relative w-[260px] xs:w-[300px] sm:w-[440px] md:w-[490px] h-[80px] xs:h-[95px] sm:h-[140px] md:h-[160px] max-w-[90vw]">
              <Image
                src="/images/juno-logo.png"
                alt="Juno Healthcare Private Limited"
                fill
                priority
                sizes="(max-width: 640px) 300px, (max-width: 768px) 440px, 490px"
                className="object-contain drop-shadow-[0_4px_16px_rgba(7,59,92,0.1)]"
              />

              {/* Perched butterfly physically anchored inside logo container — 100% synchronized with scroll */}
              {isButterflyPerched && (
                <div 
                  className="absolute pointer-events-none z-20 transition-opacity duration-500 animate-fade-in"
                  style={{
                    left: '68%',
                    top: '12%',
                    transform: 'translate(-50%, -50%) rotate(-6deg)'
                  }}
                  aria-hidden="true"
                >
                  <ButterflyGraphic isFlapping={false} isMicroFlutter={true} />
                </div>
              )}
            </div>
          </div>

          {/* PRIMARY HERO HEADLINE — CORMORANT GARAMOND EDITORIAL HIERARCHY */}
          <div 
            className={`space-y-2 sm:space-y-3 mb-5 sm:mb-8 max-w-4xl px-2 sm:px-4 transition-all duration-1000 ease-out w-full ${
              introStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <h1 className="font-editorial text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-[0.08em] xs:tracking-[0.1em] sm:tracking-[0.14em] text-[#073B5C] uppercase leading-tight sm:leading-none whitespace-nowrap">
              PHARMACEUTICAL
              <span className="block text-[#00B4D8] font-normal italic lowercase text-xl xs:text-2xl sm:text-4xl md:text-5xl mt-1.5 sm:mt-2 tracking-normal font-editorial">
                formulation & marketing
              </span>
            </h1>

            <p className="font-sans text-xs xs:text-sm sm:text-base md:text-lg text-[#1A365D] font-normal leading-relaxed max-w-lg mx-auto pt-1 px-2">
              &ldquo;Advancing healthcare through quality, responsibility and ethical integrity.&rdquo;
            </p>

            {/* Decorative Two-Tone Accent Bar */}
            <div className="w-14 sm:w-16 h-[2.5px] rounded-full mx-auto my-2.5 sm:my-3 flex overflow-hidden">
              <div className="w-1/2 h-full bg-[#073B5C]" />
              <div className="w-1/2 h-full bg-[#00B4D8]" />
            </div>
          </div>

          {/* CTA & INTERACTION CONTROLS */}
          <div 
            className={`flex flex-col items-center gap-2.5 sm:gap-3 transition-all duration-1000 ease-out ${
              introStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {/* ENTER PLATFORM Button (Deep Blue -> Vibrant Cyan Gradient) */}
            <button
              onClick={handleEnterClick}
              className="group relative inline-flex items-center gap-2.5 sm:gap-3.5 px-7 py-3 sm:px-11 sm:py-4 bg-gradient-to-r from-[#073B5C] via-[#0D5C91] to-[#00B4D8] text-white text-xs sm:text-base font-sans font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-full shadow-[0_4px_20px_rgba(7,59,92,0.25)] hover:shadow-[0_8px_30px_rgba(7,59,92,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] cursor-pointer"
              aria-label="Enter Juno Healthcare Corporate Platform"
            >
              <span className="relative z-10 font-sans tracking-[0.16em] sm:tracking-[0.2em]">ENTER PLATFORM</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 relative z-10 text-[#48D4D2] group-hover:translate-x-1.5 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-15 transition-opacity" />
            </button>

            {/* Secondary Subtitle */}
            <span className="text-[10px] sm:text-[12px] text-[#073B5C] uppercase tracking-[0.16em] sm:tracking-[0.24em] font-sans font-bold">
              EXPLORE A HEALTHIER TOMORROW
            </span>
          </div>
        </div>
      </main>

      {/* =========================================================================
          4. CORPORATE STATUTORY & CONTACT FOOTER (HIGH CONTRAST & CLEAR READABILITY)
          ========================================================================= */}
      <footer className="relative z-10 w-full px-4 sm:px-12 py-3 sm:py-4.5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 text-xs font-sans tracking-normal sm:tracking-widest text-[#073B5C] backdrop-blur-2xs text-center">
        <div className="flex items-center justify-center text-[10px] sm:text-[12px]">
          <span className="uppercase tracking-[0.1em] sm:tracking-[0.18em] font-bold text-[#073B5C]">
            PHARMACEUTICAL MARKETING • QUALITY DRIVEN • PEOPLE FOCUSED
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-6 text-[10px] sm:text-[12px]">
          {/* Official Phone */}
          <a 
            href="tel:+919743094555" 
            className="hover:text-[#00B4D8] transition-colors flex items-center gap-1.5 uppercase tracking-[0.1em] sm:tracking-[0.15em] font-bold text-[#073B5C] whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
            <span className="whitespace-nowrap">+91 9743094555</span>
          </a>

          <span className="text-[#073B5C]/35 hidden xs:inline">•</span>

          {/* Business Focus / Medicine Marketing */}
          <span className="text-[#073B5C] flex items-center gap-1.5 uppercase tracking-[0.1em] sm:tracking-[0.15em] font-bold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
            <span className="whitespace-nowrap">MEDICINE MARKETING</span>
          </span>

          <span className="text-[#073B5C]/35 hidden sm:inline">•</span>

          {/* Official Website */}
          <span className="text-[#073B5C] flex items-center gap-1.5 uppercase tracking-[0.1em] sm:tracking-[0.15em] font-bold whitespace-nowrap">
            <Globe className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
            <span className="whitespace-nowrap">JUNOHEALTHCARE.IN</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
