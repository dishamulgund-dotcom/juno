'use client';

import React, { useState, useEffect } from 'react';

interface TreeOfLifeScienceProps {
  mousePos?: { x: number; y: number };
  isExiting?: boolean;
}

export default function TreeOfLifeScience({ 
  mousePos = { x: 0, y: 0 },
  isExiting = false 
}: TreeOfLifeScienceProps) {
  const [growthStage, setGrowthStage] = useState(0);

  useEffect(() => {
    // Single-play slow organic emergence
    const t1 = setTimeout(() => setGrowthStage(1), 250);  // Roots & Mother/Life base
    const t2 = setTimeout(() => setGrowthStage(2), 800);  // Trunk & primary pathways
    const t3 = setTimeout(() => setGrowthStage(3), 1600); // Foliage & canopy
    const t4 = setTimeout(() => setGrowthStage(4), 2500); // Molecular bond tips

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const swayX = mousePos.x * 0.25;
  const swayY = mousePos.y * 0.15;

  return (
    <div 
      className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div 
        className="relative w-[480px] sm:w-[660px] md:w-[820px] lg:w-[940px] h-[480px] sm:h-[660px] md:h-[820px] lg:h-[940px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${swayX * -0.5}px, ${swayY * -0.3}px)`
        }}
      >
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full"
          style={{ opacity: 0.11 }} // 11% subtle background watermark opacity (8-18% range)
        >
          <defs>
            <linearGradient id="tree-grad-light" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#073B5C" />
              <stop offset="40%" stopColor="#0D5C91" />
              <stop offset="80%" stopColor="#16B8B3" />
              <stop offset="100%" stopColor="#48D4D2" />
            </linearGradient>

            <linearGradient id="leaf-grad-left-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#16B8B3" />
              <stop offset="60%" stopColor="#0D5C91" />
              <stop offset="100%" stopColor="#073B5C" />
            </linearGradient>

            <linearGradient id="leaf-grad-right-light" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#48D4D2" />
              <stop offset="60%" stopColor="#0D5C91" />
              <stop offset="100%" stopColor="#073B5C" />
            </linearGradient>
          </defs>

          {/* =========================================================
              STAGE 1: MOTHER / LIFE SYMBOL EMBLEM BASE
              ========================================================= */}
          <g 
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: growthStage >= 1 ? 1 : 0,
              transform: `translateY(${growthStage >= 1 ? 0 : 25}px)`
            }}
          >
            {/* Outer Seed Capsule */}
            <path
              d="M400 450 C345 450 315 505 315 570 C315 645 350 705 400 705 C450 705 485 645 485 570 C485 505 455 450 400 450 Z"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Mother Silhouette & Cradled Life */}
            <path
              d="M400 490 C375 490 355 515 355 545 C355 580 380 610 395 635 C400 645 405 655 405 670 C405 685 395 695 385 695 C370 695 360 675 360 650"
              fill="none"
              stroke="#0D5C91"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="410" cy="515" r="12" fill="#0D5C91" />
            <circle cx="395" cy="610" r="5" fill="#16B8B3" />
          </g>

          {/* =========================================================
              STAGE 2: TRUNK & BOTANICAL PATHWAYS
              ========================================================= */}
          <g 
            className="transition-all duration-1000 ease-out"
            style={{
              opacity: growthStage >= 2 ? 1 : 0,
              transform: `scale(${growthStage >= 2 ? 1 : 0.96})`,
              transformOrigin: '400px 550px'
            }}
          >
            {/* Central Trunk */}
            <path
              d="M400 450 C400 380 390 320 400 240"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Left Pathways */}
            <path
              d="M395 390 C360 370 300 360 250 330 C210 305 180 260 160 200"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M398 340 C350 310 310 270 280 200 C260 150 250 100 260 50"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Right Pathways */}
            <path
              d="M405 390 C440 370 500 360 550 330 C590 305 620 260 640 200"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M402 340 C450 310 490 270 520 200 C540 150 550 100 540 50"
              fill="none"
              stroke="url(#tree-grad-light)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* =========================================================
              STAGE 3: SYMMETRIC BOTANICAL LEAF CROWN
              ========================================================= */}
          <g 
            className="transition-all duration-1200 ease-out"
            style={{
              opacity: growthStage >= 3 ? 1 : 0,
              transform: `scale(${growthStage >= 3 ? 1 : 0.92})`,
              transformOrigin: '400px 300px'
            }}
          >
            {/* Top Crown Apex */}
            <path d="M400 120 C385 80 400 40 400 40 C400 40 415 80 400 120 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M400 180 C380 140 400 90 400 90 C400 90 420 140 400 180 Z" fill="url(#leaf-grad-right-light)" />

            {/* Tier 1 Leaves */}
            <path d="M350 170 C330 140 345 100 345 100 C345 100 375 125 350 170 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M450 170 C470 140 455 100 455 100 C455 100 425 125 450 170 Z" fill="url(#leaf-grad-right-light)" />

            <path d="M310 230 C280 205 290 165 290 165 C290 165 325 185 310 230 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M490 230 C520 205 510 165 510 165 C510 165 475 185 490 230 Z" fill="url(#leaf-grad-right-light)" />

            {/* Tier 2 Leaves */}
            <path d="M260 290 C225 270 230 230 230 230 C230 230 270 245 260 290 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M540 290 C575 270 570 230 570 230 C570 230 530 245 540 290 Z" fill="url(#leaf-grad-right-light)" />

            <path d="M210 360 C175 345 175 305 175 305 C175 305 215 315 210 360 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M590 360 C625 345 625 305 625 305 C625 305 585 315 590 360 Z" fill="url(#leaf-grad-right-light)" />

            {/* Tier 3 Leaves */}
            <path d="M170 430 C135 420 130 380 130 380 C130 380 170 385 170 430 Z" fill="url(#leaf-grad-left-light)" />
            <path d="M630 430 C665 420 670 380 670 380 C670 380 630 385 630 430 Z" fill="url(#leaf-grad-right-light)" />
          </g>

          {/* =========================================================
              STAGE 4: MOLECULAR BONDS & NODES
              ========================================================= */}
          <g 
            className="transition-all duration-1500 ease-out"
            style={{
              opacity: growthStage >= 4 ? 1 : 0
            }}
          >
            {/* Hexagonal Benzene Rings */}
            <polygon 
              points="140,170 155,155 170,170 170,190 155,205 140,190" 
              fill="none" 
              stroke="#16B8B3" 
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx="155" cy="155" r="2.5" fill="#16B8B3" />
            <circle cx="170" cy="170" r="2.5" fill="#0D5C91" />

            <polygon 
              points="660,170 645,155 630,170 630,190 645,205 660,190" 
              fill="none" 
              stroke="#16B8B3" 
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle cx="645" cy="155" r="2.5" fill="#16B8B3" />
            <circle cx="630" cy="170" r="2.5" fill="#0D5C91" />

            {/* Fine Molecular Bond Connections */}
            <line x1="260" y1="50" x2="285" y2="30" stroke="#0D5C91" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="285" cy="30" r="3" fill="#16B8B3" />

            <line x1="540" y1="50" x2="515" y2="30" stroke="#0D5C91" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="515" cy="30" r="3" fill="#16B8B3" />
          </g>
        </svg>
      </div>
    </div>
  );
}
