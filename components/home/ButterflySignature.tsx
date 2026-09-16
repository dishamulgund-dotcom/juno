'use client';

import React, { useState, useEffect, useRef, useId } from 'react';

interface ButterflySignatureProps {
  logoRef: React.RefObject<HTMLDivElement | null>;
  isExiting?: boolean;
}

export default function ButterflySignature({ logoRef, isExiting = false }: ButterflySignatureProps) {
  // States: 'waiting' (0-1.8s) -> 'flying' (1.8s-4.5s) -> 'settling' (4.5s-5.0s) -> 'perched' (5.0s+)
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

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute exact coordinates of butterfly motif in JUNO logo
  useEffect(() => {
    const updateTarget = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        // The butterfly motif in JUNO logo is situated right over the letter 'N' (approx 68% from left, 12% from top)
        restingTargetRef.current = {
          x: rect.left + rect.width * 0.68,
          y: rect.top + rect.height * 0.12
        };
      } else {
        restingTargetRef.current = {
          x: window.innerWidth * 0.5 + (window.innerWidth < 640 ? 55 : 85),
          y: window.innerHeight * 0.38 - (window.innerWidth < 640 ? 25 : 35)
        };
      }
    };

    updateTarget();
    window.addEventListener('resize', updateTarget);
    return () => window.removeEventListener('resize', updateTarget);
  }, [logoRef]);

  // Track cursor position for subtle in-place micro-flutter
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // If already perched, check proximity for micro wing tilt ONLY (no position change)
      if (hasFinishedFlightRef.current) {
        const target = restingTargetRef.current;
        const dx = target.x - e.clientX;
        const dy = target.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setIsMicroFlutter(dist < 90);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ONE-TIME Butterfly Flight Animation Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      // If reduced motion, immediately place butterfly at resting position without flight
      const target = restingTargetRef.current;
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

    const startX = Math.max(30, window.innerWidth * 0.12);
    const startY = Math.max(70, window.innerHeight * 0.22);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const target = restingTargetRef.current;

      if (isExiting) {
        // Smooth ascension on platform entry
        setPos(prev => ({
          x: prev.x + 1.2,
          y: prev.y - 2.5,
          angle: -30,
          scale: Math.max(0.2, prev.scale - 0.015),
          opacity: Math.max(0, prev.opacity - 0.03)
        }));
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // TIMELINE:
      // STEP 1 & 2 (0.0 - 2.0s): Background & all main content (JUNO Logo, Headings, Quote, CTA, surrounding corporate metadata) appear first. Butterfly is waiting (opacity: 0).
      // STEP 3 (2.0 - 4.7s): Single curved Bezier flight to JUNO logo
      // STEP 4 (4.7 - 5.1s): Gentle settle & wing touchdown on butterfly motif in JUNO logo
      // STEP 5 (5.1s+): PERCHED FOREVER. Flight NEVER repeats, no loops, no hover restarts.

      if (elapsed < 2000) {
        // Waiting state (invisible while main content reveals)
        setPos({
          x: startX,
          y: startY,
          angle: 15,
          scale: 0.85,
          opacity: 0
        });
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= 2000 && elapsed < 4700) {
        // SINGLE CURVED FLIGHT
        if (stage !== 'flying') setStage('flying');

        const flightDuration = 2700; // 2000ms to 4700ms
        const progress = (elapsed - 2000) / flightDuration;

        // Cubic easeInOut with natural deceleration approaching the logo
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        // Spline control points for an organic curved flight
        const p0 = { x: startX, y: startY };
        const p1 = { x: startX + window.innerWidth * 0.28, y: startY - 70 };
        const p2 = { x: target.x - 70, y: target.y + 65 };
        const p3 = target;

        // Cubic Bezier calculation
        const t = ease;
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const bx = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        const verticalSine = Math.sin((elapsed - 2000) * 0.009) * (14 * (1 - ease));
        const by = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y + verticalSine;

        // Calculate heading angle
        const nextT = Math.min(1, t + 0.015);
        const nextU = 1 - nextT;
        const nbx = (nextU*nextU*nextU)*p0.x + 3*(nextU*nextU)*nextT*p1.x + 3*nextU*(nextT*nextT)*p2.x + (nextT*nextT*nextT)*p3.x;
        const nby = (nextU*nextU*nextU)*p0.y + 3*(nextU*nextU)*nextT*p1.y + 3*nextU*(nextT*nextT)*p2.y + (nextT*nextT*nextT)*p3.y;
        
        const dx = nbx - bx;
        const dy = nby - by;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (progress > 0.8) {
          const blend = (progress - 0.8) / 0.2;
          angle = angle * (1 - blend) + (-6) * blend;
        }

        setPos({
          x: bx,
          y: by,
          angle: angle,
          scale: 0.85 + ease * 0.15,
          opacity: Math.min(1, progress * 4) // Fade in smoothly
        });

        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= 4700 && elapsed < 5100) {
        // SETTLING STATE (gentle touchdown on JUNO)
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

      // 5100ms+ : FULLY PERCHED & STATIC. Animation Complete!
      hasFinishedFlightRef.current = true;
      if (stage !== 'perched') setStage('perched');

      setPos({
        x: target.x,
        y: target.y,
        angle: -6,
        scale: 1,
        opacity: 1
      });

      // Continue minimal loop solely to maintain coordinates on resize or exit
      if (isExiting) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExiting, prefersReducedMotion]);

  const isFlapping = stage === 'flying' || stage === 'settling';
  const isPerched = stage === 'perched';

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
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(22,184,179,0.35)]">
        {/* Soft subtle glow during initial flight */}
        {isFlapping && (
          <div className="absolute inset-0 -z-10 rounded-full bg-[#48D4D2]/20 blur-sm animate-ping" />
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
