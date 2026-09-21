'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';

export function ButterflyGraphic({
  isFlapping = false,
  isMicroFlutter = false,
  className = ''
}: {
  isFlapping?: boolean;
  isMicroFlutter?: boolean;
  className?: string;
}) {
  const gradId1 = useId();
  const gradId2 = useId();

  return (
    <div className={`relative w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center filter drop-shadow-[0_1px_5px_rgba(22,184,179,0.35)] ${className}`}>
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
        <g className={isFlapping ? 'wing-left' : isMicroFlutter ? 'wing-rest-left' : ''}>
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
        <g className={isFlapping ? 'wing-right' : isMicroFlutter ? 'wing-rest-right' : ''}>
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
  );
}

interface ButterflySignatureProps {
  logoRef: React.RefObject<HTMLDivElement | null>;
  isExiting?: boolean;
  onPerched?: () => void;
}

export default function ButterflySignature({ logoRef, isExiting = false, onPerched }: ButterflySignatureProps) {
  const [stage, setStage] = useState<'waiting' | 'flying' | 'settling' | 'perched'>('waiting');
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

  const getTargetCoords = useCallback(() => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // ONE-TIME Butterfly Flight Animation Loop
  useEffect(() => {
    if (prefersReducedMotion) {
      setStage('perched');
      onPerched?.();
      return;
    }

    const isMobile = window.innerWidth < 768;
    const waitDuration = isMobile ? 600 : 1200;
    const flightDuration = isMobile ? 1300 : 2600;
    const settleDuration = isMobile ? 200 : 400;
    const flightEndTime = waitDuration + flightDuration;
    const settleEndTime = flightEndTime + settleDuration;

    const arc1 = isMobile ? 22 : 55;
    const arc2 = isMobile ? 12 : 30;
    const flutterAmp = isMobile ? 4.5 : 11;

    const startX = Math.max(25, window.innerWidth * 0.1);
    const startY = Math.max(50, window.innerHeight * 0.16);

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const target = getTargetCoords();
      restingTargetRef.current = target;

      if (isExiting) {
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
      // 0 to waitDuration: Background & title emerge, butterfly waiting
      // waitDuration to flightEndTime: Natural curved aerodynamic flight to JUNO logo
      // flightEndTime to settleEndTime: Touchdown on 'N' motif
      // settleEndTime+: PERCHED inside logo container permanently

      if (elapsed < waitDuration) {
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

      if (elapsed >= waitDuration && elapsed < flightEndTime) {
        if (stage !== 'flying') setStage('flying');

        const progress = (elapsed - waitDuration) / flightDuration;

        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const p0 = { x: startX, y: startY };
        const p1 = { x: startX + (target.x - startX) * 0.35, y: Math.min(startY, target.y) - arc1 };
        const p2 = { x: startX + (target.x - startX) * 0.75, y: target.y - arc2 };
        const p3 = target;

        const t = ease;
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        const bx = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
        const flutterSine = Math.sin((elapsed - waitDuration) * 0.014) * (flutterAmp * (1 - ease));
        const by = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y + flutterSine;

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
          opacity: Math.min(1, progress * 4)
        });

        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (elapsed >= flightEndTime && elapsed < settleEndTime) {
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

      // Touchdown complete -> hand off to embedded logo butterfly!
      setStage('perched');
      onPerched?.();
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExiting, prefersReducedMotion, getTargetCoords, onPerched]);

  // Once perched, the butterfly is rendered directly inside the logo container for 100% scroll sync
  if (stage === 'perched' || pos.opacity === 0) return null;

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
      <ButterflyGraphic isFlapping={true} />
    </div>
  );
}
