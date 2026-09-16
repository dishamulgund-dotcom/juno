'use client';

import React, { useEffect, useRef } from 'react';

interface MolecularDepthCanvasProps {
  mousePos?: { x: number; y: number };
  isExiting?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

interface BokehOrb {
  x: number;
  y: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  color: string;
}

export default function MolecularDepthCanvas({ 
  mousePos = { x: 0, y: 0 },
  isExiting = false 
}: MolecularDepthCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<BokehOrb[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;
    const particleCount = isMobile ? 18 : 36;
    const orbCount = isMobile ? 6 : 14;

    const particleColors = ['#16B8B3', '#48D4D2', '#0D5C91', '#829AB1'];
    const orbColors = ['rgba(72, 212, 210, 0.08)', 'rgba(22, 184, 179, 0.06)', 'rgba(243, 249, 251, 0.4)'];

    const initElements = () => {
      // Molecular nodes
      const p: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        p.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 2 + 1,
          baseAlpha: Math.random() * 0.35 + 0.15,
          color: particleColors[Math.floor(Math.random() * particleColors.length)]
        });
      }
      particlesRef.current = p;

      // Soft out-of-focus bokeh bubbles (laboratory liquid droplets & depth)
      const orbs: BokehOrb[] = [];
      for (let i = 0; i < orbCount; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -(Math.random() * 0.2 + 0.1),
          radius: Math.random() * 70 + 40,
          alpha: Math.random() * 0.12 + 0.04,
          phase: Math.random() * Math.PI * 2,
          color: orbColors[Math.floor(Math.random() * orbColors.length)]
        });
      }
      orbsRef.current = orbs;
    };

    initElements();

    let lightSweepAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // 1. SOFT TRANSLUCENT LIVING LIGHT SWEEP (Subtle ambient motion)
      // =========================================================================
      lightSweepAngle += 0.0004;
      const beamX = width * (0.5 + Math.sin(lightSweepAngle) * 0.3);
      const beamY = height * (0.35 + Math.cos(lightSweepAngle * 0.7) * 0.15);

      const beamGrad = ctx.createRadialGradient(beamX, beamY, 80, beamX, beamY, width * 0.55);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      beamGrad.addColorStop(0.4, 'rgba(72, 212, 210, 0.08)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      // =========================================================================
      // 4. SOFT FLOATING BOKEH ORBS (Depth-of-field scientific atmosphere)
      // =========================================================================
      const orbs = orbsRef.current;
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        orb.y += orb.vy;
        orb.phase += 0.003;
        const driftX = Math.sin(orb.phase) * 0.3;
        orb.x += driftX;

        if (orb.y + orb.radius < 0) {
          orb.y = height + orb.radius;
          orb.x = Math.random() * width;
        }

        const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGrad.addColorStop(0, orb.color);
        orbGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 5. MOLECULAR LATTICE WITH LOGO BREATHING ZONE EXCLUSION
      // =========================================================================
      const particles = particlesRef.current;
      const logoCenterX = width * 0.5;
      const logoCenterY = height * 0.38;
      const logoZoneWidth = Math.min(520, width * 0.75);
      const logoZoneHeight = 160;
      const maxConnectDist = isMobile ? 80 : 120;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isExiting) {
          p.x += p.vx * 3;
          p.y += p.vy * 3;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Check if inside logo breathing zone: smoothly fade out so letters remain clean & crisp
        const inLogoX = Math.abs(p.x - logoCenterX) < logoZoneWidth * 0.5;
        const inLogoY = Math.abs(p.y - logoCenterY) < logoZoneHeight * 0.5;
        let effectiveAlpha = p.baseAlpha;
        if (inLogoX && inLogoY) {
          effectiveAlpha *= 0.15; // 85% reduction directly behind JUNO letters
        }

        // Draw connecting bonds between nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < maxConnectDist) {
            let lineAlpha = (1 - cdist / maxConnectDist) * 0.16;
            if (inLogoX && inLogoY) lineAlpha *= 0.15;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(22, 184, 179, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = effectiveAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // =========================================================================
      // 6. PRISTINE CENTRAL CLEANROOM LUMINOUS HALO (Highlights JUNO Logo Hero)
      // =========================================================================
      const cleanroomGlow = ctx.createRadialGradient(
        logoCenterX,
        logoCenterY,
        10,
        logoCenterX,
        logoCenterY,
        Math.min(width, height) * 0.38
      );
      cleanroomGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      cleanroomGlow.addColorStop(0.45, 'rgba(243, 249, 251, 0.7)');
      cleanroomGlow.addColorStop(0.8, 'rgba(243, 249, 251, 0.15)');
      cleanroomGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = cleanroomGlow;
      ctx.fillRect(0, 0, width, height);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExiting]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}
