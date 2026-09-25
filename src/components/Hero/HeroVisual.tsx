import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AHMAD_PORTRAITS } from '../../assets/images';
import { useLanguage } from '../../context/LanguageContext';

export const HeroVisual: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation and physics state (held in ref for 60fps execution without re-render lag)
  const stateRef = useRef({
    mouseX: 0.5,
    mouseY: 0.5,
    currentX: 0.5,
    currentY: 0.5,
    lastX: 0.5,
    lastY: 0.5,
    velocity: 0,
    revealProgress: 0,
    targetProgress: 0,
    wavePhase: 0,
    isPointerInside: false,
    imagesLoaded: false,
  });

  const imagesRef = useRef<{ img1: HTMLImageElement | null; img2: HTMLImageElement | null }>({
    img1: null,
    img2: null,
  });

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Preload both portrait images
  useEffect(() => {
    let mounted = true;
    const img1 = new Image();
    const img2 = new Image();

    img1.crossOrigin = 'anonymous';
    img2.crossOrigin = 'anonymous';

    let count = 0;
    const onLoad = () => {
      count++;
      if (count === 2 && mounted) {
        imagesRef.current = { img1, img2 };
        stateRef.current.imagesLoaded = true;
      }
    };

    img1.onload = onLoad;
    img2.onload = onLoad;
    img1.src = AHMAD_PORTRAITS.primary;
    img2.src = AHMAD_PORTRAITS.secondary;

    return () => {
      mounted = false;
    };
  }, []);

  // Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const state = stateRef.current;
      const { img1, img2 } = imagesRef.current;

      const width = canvas.width;
      const height = canvas.height;

      // Smooth interpolation for cursor follow (lerp factor 0.08)
      const lerpFactor = 0.08;
      state.currentX += (state.mouseX - state.currentX) * lerpFactor;
      state.currentY += (state.mouseY - state.currentY) * lerpFactor;

      // Dynamic velocity calculation for organic mask expansion
      const dx = state.currentX - state.lastX;
      const dy = state.currentY - state.lastY;
      const instantVelocity = Math.sqrt(dx * dx + dy * dy);
      state.velocity = state.velocity * 0.9 + instantVelocity * 0.1;
      state.lastX = state.currentX;
      state.lastY = state.currentY;

      // Smooth transition progress
      state.revealProgress += (state.targetProgress - state.revealProgress) * 0.07;
      state.wavePhase += 0.035 + state.velocity * 1.2;

      ctx.clearRect(0, 0, width, height);

      // Draw base image 1
      if (img1 && img1.complete && img1.naturalWidth > 0) {
        drawImageFit(ctx, img1, 0, 0, width, height);
      }

      // Draw image 2 via liquid mask when revealed
      const effectiveProgress = state.revealProgress;
      if (effectiveProgress > 0.004 && img2 && img2.complete && img2.naturalWidth > 0) {
        ctx.save();

        if (prefersReducedMotion) {
          // Simple accessible crossfade for users requesting reduced motion
          ctx.globalAlpha = effectiveProgress;
          drawImageFit(ctx, img2, 0, 0, width, height);
        } else {
          // Organic Liquid Mask Path
          ctx.beginPath();
          const centerX = state.currentX * width;
          const centerY = state.currentY * height;

          // Maximum radius calculation to gracefully cover image when expanded
          const maxRadius = Math.sqrt(width * width + height * height) * 0.95;
          const baseRadius = maxRadius * effectiveProgress;
          const numPoints = 40;

          for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            // Harmonic sinusoidal wave displacement simulating liquid fluid tension
            const wave1 = Math.sin(angle * 4 + state.wavePhase) * (14 + state.velocity * 90);
            const wave2 = Math.cos(angle * 7 - state.wavePhase * 1.3) * (9 + state.velocity * 60);
            const wave3 = Math.sin(angle * 2 + state.wavePhase * 0.8) * 6;
            const r = Math.max(8, baseRadius + wave1 + wave2 + wave3);

            const px = centerX + Math.cos(angle) * r;
            const py = centerY + Math.sin(angle) * r;

            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }

          ctx.closePath();
          ctx.clip();

          // Organic displacement offset for liquid depth effect
          const offsetX = (state.currentX - 0.5) * 12 * state.velocity;
          const offsetY = (state.currentY - 0.5) * 12 * state.velocity;

          drawImageFit(ctx, img2, offsetX, offsetY, width, height);

          // Subtle editorial hairline indicator on mask boundary (Swiss precision)
          ctx.strokeStyle = 'rgba(200, 16, 46, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  // Precise image fit maintaining exact 896:1200 proportions
  const drawImageFit = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    offsetX: number,
    offsetY: number,
    w: number,
    h: number,
  ) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sW, sH, sX, sY;

    if (canvasRatio > imgRatio) {
      sW = img.naturalWidth;
      sH = img.naturalWidth / canvasRatio;
      sX = 0;
      // Crop bias: square/wide canvas needs less downward bias to keep shoulders visible;
      // portrait canvas keeps original bias for optimal face framing
      sY = canvasRatio >= 0.9
        ? (img.naturalHeight - sH) * 0.12
        : (img.naturalHeight - sH) * 0.2;
    } else {
      sH = img.naturalHeight;
      sW = img.naturalHeight * canvasRatio;
      sX = (img.naturalWidth - sW) * 0.5;
      sY = 0;
    }

    ctx.drawImage(img, sX, sY, sW, sH, offsetX, offsetY, w, h);
  };

  // Resize canvas according to element bounding box & devicePixelRatio
  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }, []);

  useEffect(() => {
    handleResize();
    const ro = new ResizeObserver(() => handleResize());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Pointer move handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    stateRef.current.mouseX = x;
    stateRef.current.mouseY = y;
    stateRef.current.isPointerInside = true;

    // Expand reveal dynamically when hovering
    stateRef.current.targetProgress = activeImageIndex === 1 ? 1 : 0.85;
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
  };

  const handlePointerLeave = () => {
    stateRef.current.isPointerInside = false;
    // Revert to baseline state smoothly
    if (activeImageIndex === 0) {
      stateRef.current.targetProgress = 0;
    } else {
      stateRef.current.targetProgress = 1;
    }
  };

  // Toggle on click or touch for mobile / keyboard
  const handleToggle = () => {
    const next = activeImageIndex === 0 ? 1 : 0;
    setActiveImageIndex(next);
    stateRef.current.targetProgress = next === 1 ? 1 : 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      ref={containerRef}
      id="hero-focal-photo"
      role="button"
      tabIndex={0}
      aria-label="Ahmad Badawi portrait - Hover or tap to toggle perspectives"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full max-h-full mx-auto select-none cursor-pointer focus:outline-hidden"
      style={{
        // Smooth bottom gradient feathering so portrait integrates seamlessly into the continuous hero background
        maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
