'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';

interface ButterflySignatureProps {
  logoRef: React.RefObject<HTMLDivElement | null>;
  isExiting?: boolean;
}

export default function ButterflySignature({ logoRef, isExiting = false }: ButterflySignatureProps) {
  // States: 'waiting' (0-1.5s) -> 'flying' (1.5s-4.0s) -> 'settling' (4.0s-4.5s) -> 'perched' (4.5s+)
  const [stage, setStage] = useState<'waiting' | 'flying' | 'settling' | 'perched'>('waiting');
  const [isMicroFlutter, setIsMicroFlutter] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [pos, setPos] = useState<{ x: number; y: number; angle: number; scale: number; opacity: number }>({
    x: -100,
    y: 100,
    angle: 20,
    scale: 0.9,
    opacity: 0
  });

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const restingTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const hasFinishedFlightRef = useRef(false);

  const gradId1 = useId();
  const gradId2 = useId();

  // Helper to compute target position of butterfly motif atop 'N' in JUNO logo
  const getTargetCoords = useCallback(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      // Butterfly motif is situated atop 'N' in the JUNO logo
      return {
        x: rect.left + rect.width * 0.68,
        y: rect.top + rect.height * 0.12
      };
    }
    return {
      x: window.innerWidth * 0.5 + (window.innerWidth < 640 ? 55 : 85),
      y: window.innerHeight * 0.35
    };
  }, [logoRef]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Continuous Scroll & Resize Synchronisation — Keeps butterfly locked to logo at all times
  useEffect(() => {
    const handleScrollOrResize = () => {
      const target = getTargetCoords();
      restingTargetRef.current = target;

      // If already perched, immediately update screen coordinates so it moves seamlessly with scroll
      if (hasFinishedFlightRef.current) {
        setPos({
          x: target.x,
          y: target.y,
          angle: -6,
          scale: 1,
          opacity: 1
        });
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    
    // Initial calculate
    handleScrollOrResize();

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [getTargetCoords]);

  // Track cursor position for subtle in-place micro-flutter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      if (hasFinishedFlightRef.current) {
        const target = restingTargetRef.current;
        const dx = target.x - e.clientX;
        const dy = target.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setIsMicroFlutter(dist < 80);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ONE-TIME Graceful Butterfly Flight Animation Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      const target = getTargetCoords();
      restingTargetRef.current = target;
      setPos({
        x: target.x,
        y: target.y,
        angle: -6,
        scale: 1,
        opacity: 1
      });
      setStage('perched');
      hasFinishedFlightRef.current = true;
      return;
    }

    const startX = Math.max(25, window.innerWidth * 0.1);
    const startY = Math.max(50, window.innerHeight * 0.18);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const target = getTargetCoords();
      restingTargetRef.current = target;

      if (isExiting) {
        // Smooth ascension on platform entry
        setPos(prev => ({
          x: prev.x + 1.5,
          y: prev.y - 2.8,
          angle: -25,
          scale: Math.max(0.2, prev.scale - 0.015),
          opacity: Math.max(0, prev.opacity - 0.035)
        }));
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // TIMELINE:
      // 0 - 1500ms: Background & content reveal, butterfly waiting
      // 1500ms - 4200ms: Graceful curved flight to JUNO logo
      // 4200ms - 4600ms: Gentle touchdown & settling
      // 4600ms+: PERCHED on logo (locked to scroll)

      if (elapsed < 1500) {
        setPos({
          x: startX,
          y: startY,
          angle: 12,
          scale: 0.85,
          opacity: 0
        });
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= 1500 && elapsed < 4200) {
        if (stage !== 'flying') setStage('flying');

        const flightDuration = 2700;
        const progress = (elapsed - 1500) / flightDuration;

        // Smooth cubic ease out
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Elegant curved Bezier flight path
        const p0 = { x: startX, y: startY };
        const p1 = { x: startX + (target.x - startX) * 0.35, y: Math.min(startY, target.y) - 50 };
        const p2 = { x: startX + (target.x - startX) * 0.75, y: target.y - 30 };
        const p3 = target;

        const t = ease;
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const bx = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        const flutterSine = Math.sin((elapsed - 1500) * 0.01) * (10 * (1 - ease));
        const by = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y + flutterSine;

        // Natural rotation heading towards flight tangent
        const nextT = Math.min(1, t + 0.02);
        const nextU = 1 - nextT;
        const nbx = (nextU*nextU*nextU)*p0.x + 3*(nextU*nextU)*nextT*p1.x + 3*nextU*(nextT*nextT)*p2.x + (nextT*nextT*nextT)*p3.x;
        const nby = (nextU*nextU*nextU)*p0.y + 3*(nextU*nextU)*nextT*p1.y + 3*nextU*(nextT*nextT)*p2.y + (nextT*nextT*nextT)*p3.y;

        const dx = nbx - bx;
        const dy = nby - by;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (progress > 0.75) {
          const blend = (progress - 0.75) / 0.25;
          angle = angle * (1 - blend) + (-6) * blend;
        }

        setPos({
          x: bx,
          y: by,
          angle: angle,
          scale: 0.85 + ease * 0.15,
          opacity: Math.min(1, progress * 3.5)
        });

        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= 4200 && elapsed < 4600) {
        if (stage !== 'settling') setStage('settling');

        setPos({
          x: target.x,
          y: target.y,
          angle: -6,
          scale: 1,
          opacity: 1
        });

        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // 4600ms+: PERCHED & SYNCHRONIZED
      hasFinishedFlightRef.current = true;
      if (stage !== 'perched') setStage('perched');

      setPos({
        x: target.x,
        y: target.y,
        angle: -6,
        scale: 1,
        opacity: 1
      });

      // Keep animation frame running if exiting
      if (isExiting) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExiting, prefersReducedMotion, getTargetCoords]);

  const isFlapping = stage === 'flying' || stage === 'settling';

  if (pos.opacity === 0) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `translate(-50%, -50%) rotate(${pos.angle}deg) scale(${pos.scale})`,
        opacity: pos.opacity
      }}
      aria-hidden="true"
    >
      <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(22,184,179,0.35)]">
        {/* Soft subtle glow during flight */}
        {isFlapping && (
          <div className="absolute inset-0 -z-10 rounded-full bg-[#48D4D2]/25 blur-sm animate-ping" />
        )}

        <svg
          viewBox="0 0 60 60"
          className="w-full h-full overflow-visible"
          style={{ perspective: 600 }}
        >
          <defs>
            <linearGradient id={gradId1} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48D4D2" />
              <stop offset="60%" stopColor="#16B8B3" />
              <stop offset="100%" stopColor="#073B5C" />
            </linearGradient>
            <linearGradient id={gradId2} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#48D4D2" />
              <stop offset="70%" stopColor="#16B8B3" />
              <stop offset="100%" stopColor="#0D5C91" />
            </linearGradient>
          </defs>

          {/* LEFT WING */}
          <g 
            className={
              isFlapping 
                ? 'wing-left' 
                : isMicroFlutter 
                  ? 'wing-rest-left' 
                  : ''
            }
          >
            <path
              d="M30 30 C22 18, 8 12, 6 22 C4 30, 16 35, 30 33 Z"
              fill={`url(#${gradId1})`}
              opacity="0.95"
            />
            <path
              d="M30 32 C20 34, 12 40, 15 48 C18 53, 27 46, 30 36 Z"
              fill={`url(#${gradId1})`}
              opacity="0.85"
            />
            <path
              d="M30 30 Q16 20 8 23"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeOpacity="0.8"
              fill="none"
            />
          </g>

          {/* RIGHT WING */}
          <g 
            className={
              isFlapping 
                ? 'wing-right' 
                : isMicroFlutter 
                  ? 'wing-rest-right' 
                  : ''
            }
          >
            <path
              d="M30 30 C38 18, 52 12, 54 22 C56 30, 44 35, 30 33 Z"
              fill={`url(#${gradId2})`}
              opacity="0.95"
            />
            <path
              d="M30 32 C40 34, 48 40, 45 48 C42 53, 33 46, 30 36 Z"
              fill={`url(#${gradId2})`}
              opacity="0.85"
            />
            <path
              d="M30 30 Q44 20 52 23"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeOpacity="0.8"
              fill="none"
            />
          </g>

          {/* CENTRAL BODY & ANTENNAE */}
          <g>
            <path
              d="M29 25 C29 23, 31 23, 31 25 L31 38 C31 40, 29 40, 29 38 Z"
              fill="#073B5C"
            />
            <circle cx="30" cy="23" r="1.8" fill="#073B5C" />
            <path
              d="M29.5 22 Q27 16 24 15"
              stroke="#073B5C"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M30.5 22 Q33 16 36 15"
              stroke="#073B5C"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="30" cy="28" r="1" fill="#48D4D2" />
          </g>
        </svg>
      </div>
    </div>
  );
}
