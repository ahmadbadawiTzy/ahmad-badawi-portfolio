import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { ThreeEvent } from '@react-three/fiber';
import { AHMAD_PORTRAITS } from '../../../assets/images';
import { IDENTITY_DATA, SOCIAL_LINKS } from '../../../data/socialLinks';
import { FEATURED_PROJECTS, GITHUB_PROFILE_URL } from '../../../data/projects';
import type { ThemeMode } from './lanyard.types';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_THICKNESS,
  CARD_CORNER_RADIUS,
  CARD_CLIP_OFFSET_Y,
  TEXTURE_WIDTH,
  TEXTURE_HEIGHT,
  SWISS_RED,
  METAL_CLIP_COLOR,
  STRAP_BASE_COLOR,
  THEME_COLORS,
} from './lanyard.constants';

export interface LanyardCardProps {
  theme: ThemeMode;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerUp?: (e: ThreeEvent<PointerEvent>) => void;
}

// -----------------------------------------------------------------------------
// Procedural Canvas Helpers: Swiss Editorial & Technical Identity Graphics
// -----------------------------------------------------------------------------

function drawRegistrationCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.restore();
}

function drawEMVChip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  const goldGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  goldGrad.addColorStop(0, '#f2d87e');
  goldGrad.addColorStop(0.3, '#dfc15d');
  goldGrad.addColorStop(0.7, '#c29b2b');
  goldGrad.addColorStop(1, '#e8ce6b');

  ctx.fillStyle = goldGrad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();

  ctx.strokeStyle = 'rgba(100, 75, 10, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Contact segmentation cuts
  ctx.strokeStyle = 'rgba(70, 50, 10, 0.75)';
  ctx.lineWidth = 2;

  // Horizontal divider
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h * 0.5);
  ctx.lineTo(x + w - 10, y + h * 0.5);
  ctx.stroke();

  // Vertical cuts forming 8 distinct contact pads
  ctx.beginPath();
  ctx.moveTo(x + w * 0.34, y + 6);
  ctx.lineTo(x + w * 0.34, y + h - 6);
  ctx.moveTo(x + w * 0.66, y + 6);
  ctx.lineTo(x + w * 0.66, y + h - 6);
  ctx.stroke();

  // Center grounding pad
  ctx.fillStyle = '#b89020';
  ctx.beginPath();
  ctx.roundRect(x + w * 0.40, y + h * 0.35, w * 0.20, h * 0.30, 3);
  ctx.fill();

  ctx.restore();
}

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  ctx.save();
  ctx.fillStyle = color;
  const pattern = [
    3, 1, 2, 4, 1, 3, 1, 2, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 2, 3, 1, 4, 1,
    2, 3, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1, 3, 1, 2, 4, 2, 1, 3, 1, 2, 3, 4,
    1, 2, 1, 4, 3, 2, 1, 3, 2, 1, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 4, 3, 1,
  ];

  let curX = x;
  const unit = (width - 40) / pattern.reduce((a, b) => a + b, 0);

  // Left guard bars
  ctx.fillRect(curX, y, 4, height);
  ctx.fillRect(curX + 8, y, 4, height);
  curX += 20;

  for (let i = 0; i < pattern.length; i++) {
    const barW = pattern[i] * unit;
    if (i % 2 === 0) {
      ctx.fillRect(curX, y + (i % 5 === 0 ? 0 : 2), barW, height - (i % 5 === 0 ? 0 : 4));
    }
    curX += barW;
  }

  // Right guard bars
  ctx.fillRect(x + width - 12, y, 4, height);
  ctx.fillRect(x + width - 4, y, 4, height);
  ctx.restore();
}

function drawQrCode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.fillStyle = color;

  const drawFinder = (fx: number, fy: number, s: number) => {
    ctx.fillRect(fx, fy, s, s);
    ctx.clearRect(fx + s * 0.15, fy + s * 0.15, s * 0.7, s * 0.7);
    ctx.fillRect(fx + s * 0.3, fy + s * 0.3, s * 0.4, s * 0.4);
  };

  const finderSize = size * 0.28;
  drawFinder(x, y, finderSize);
  drawFinder(x + size - finderSize, y, finderSize);
  drawFinder(x, y + size - finderSize, finderSize);

  const cellSize = size / 21;
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= 14;
      const inBottomLeft = r >= 14 && c < 7;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      if ((r * 11 + c * 17 + (r ^ c)) % 3 === 0) {
        ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize * 0.88, cellSize * 0.88);
      }
    }
  }
  ctx.restore();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const LanyardCard: React.FC<LanyardCardProps> = ({
  theme,
  onPointerDown,
  onPointerUp,
}) => {
  const isDark = theme === 'dark';

  const canvasesRef = useRef<{
    frontCanvas: HTMLCanvasElement;
    backCanvas: HTMLCanvasElement;
    fCtx: CanvasRenderingContext2D;
    bCtx: CanvasRenderingContext2D;
    portraitImg: HTMLImageElement;
  } | null>(null);

  if (!canvasesRef.current && typeof document !== 'undefined') {
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = TEXTURE_WIDTH;
    frontCanvas.height = TEXTURE_HEIGHT;
    const fCtx = frontCanvas.getContext('2d')!;

    const backCanvas = document.createElement('canvas');
    backCanvas.width = TEXTURE_WIDTH;
    backCanvas.height = TEXTURE_HEIGHT;
    const bCtx = backCanvas.getContext('2d')!;

    const portraitImg = new Image();
    portraitImg.crossOrigin = 'anonymous';
    portraitImg.src = AHMAD_PORTRAITS.primary;

    canvasesRef.current = {
      frontCanvas,
      backCanvas,
      fCtx,
      bCtx,
      portraitImg,
    };
  }

  const { frontTexture, backTexture } = useMemo(() => {
    if (!canvasesRef.current) {
      const dummy = new THREE.Texture();
      return { frontTexture: dummy as THREE.CanvasTexture, backTexture: dummy as THREE.CanvasTexture };
    }
    const ft = new THREE.CanvasTexture(canvasesRef.current.frontCanvas);
    ft.colorSpace = THREE.SRGBColorSpace;
    ft.anisotropy = 8;
    ft.generateMipmaps = true;
    ft.minFilter = THREE.LinearMipmapLinearFilter;
    ft.magFilter = THREE.LinearFilter;

    const bt = new THREE.CanvasTexture(canvasesRef.current.backCanvas);
    bt.colorSpace = THREE.SRGBColorSpace;
    bt.anisotropy = 8;
    bt.generateMipmaps = true;
    bt.minFilter = THREE.LinearMipmapLinearFilter;
    bt.magFilter = THREE.LinearFilter;

    return { frontTexture: ft, backTexture: bt };
  }, []);

  const drawCardFaces = useRef<() => void>(() => {});
  drawCardFaces.current = () => {
    if (!canvasesRef.current) return;
    const { fCtx, bCtx, portraitImg } = canvasesRef.current;
    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    const W = TEXTURE_WIDTH;
    const H = TEXTURE_HEIGHT;
    const PAD = 64;

    // =========================================================================
    // FRONT FACE: Clean Swiss Developer Identity Badge
    // =========================================================================

    // 1. Solid matte polymer substrate
    fCtx.fillStyle = colors.cardBg;
    fCtx.fillRect(0, 0, W, H);

    // 2. Outer hairline border
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1.5;
    fCtx.strokeRect(36, 36, W - 72, H - 72);

    // 3. Top punch slot cutout
    fCtx.fillStyle = colors.topCutout;
    fCtx.beginPath();
    fCtx.roundRect(W / 2 - 75, 46, 150, 24, 12);
    fCtx.fill();
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1.5;
    fCtx.stroke();

    // 4. Header Bar (Y = 105)
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, 102, 10, 10);

    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 14px "IBM Plex Mono", monospace';
    fCtx.fillText(IDENTITY_DATA.institution.toUpperCase(), PAD + 20, 111);

    fCtx.textAlign = 'right';
    fCtx.fillStyle = SWISS_RED;
    fCtx.beginPath();
    fCtx.arc(W - PAD - 86, 107, 4, 0, Math.PI * 2);
    fCtx.fill();

    fCtx.fillStyle = colors.textSecondary;
    fCtx.font = '500 13px "IBM Plex Mono", monospace';
    fCtx.fillText('DEV // 2026', W - PAD, 111);
    fCtx.textAlign = 'left';

    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1;
    fCtx.beginPath();
    fCtx.moveTo(PAD, 136);
    fCtx.lineTo(W - PAD, 136);
    fCtx.stroke();

    // 5. Portrait Section (Y = 160 .. 840)
    const photoX = PAD;
    const photoY = 160;
    const photoW = W - PAD * 2;
    const photoH = 680;

    fCtx.fillStyle = colors.photoBg;
    fCtx.beginPath();
    fCtx.roundRect(photoX, photoY, photoW, photoH, 16);
    fCtx.fill();

    if (portraitImg.complete && portraitImg.naturalWidth > 0) {
      fCtx.save();
      fCtx.beginPath();
      fCtx.roundRect(photoX, photoY, photoW, photoH, 16);
      fCtx.clip();

      const imgW = portraitImg.naturalWidth;
      const imgH = portraitImg.naturalHeight;
      const targetRatio = photoW / photoH;
      const imgRatio = imgW / imgH;
      let srcX = 0, srcY = 0, srcW = imgW, srcH = imgH;
      if (imgRatio > targetRatio) {
        srcW = imgH * targetRatio;
        srcX = (imgW - srcW) / 2;
      } else {
        srcH = imgW / targetRatio;
        srcY = (imgH - srcH) / 2;
      }

      fCtx.drawImage(portraitImg, srcX, srcY, srcW, srcH, photoX, photoY, photoW, photoH);
      fCtx.restore();
    }

    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1.5;
    fCtx.beginPath();
    fCtx.roundRect(photoX, photoY, photoW, photoH, 16);
    fCtx.stroke();

    // 6. Identity Typography (Y = 890 .. 1120)
    const ty = 890;
    fCtx.fillStyle = SWISS_RED;
    fCtx.font = '600 13px "IBM Plex Mono", monospace';
    fCtx.fillText('// IDENTITY ATTRIBUTION', PAD, ty);

    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '700 64px "IBM Plex Sans", -apple-system, sans-serif';
    fCtx.fillText('AHMAD BADAWI', PAD, ty + 70);

    fCtx.fillStyle = SWISS_RED;
    fCtx.font = '600 22px "IBM Plex Mono", monospace';
    fCtx.fillText('SOFTWARE DEVELOPER', PAD, ty + 114);

    fCtx.fillStyle = colors.textSecondary;
    fCtx.font = '500 18px "IBM Plex Sans", -apple-system, sans-serif';
    fCtx.fillText(`${IDENTITY_DATA.degree}  \u2022  Web & Applied AI`, PAD, ty + 150);

    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1;
    fCtx.beginPath();
    fCtx.moveTo(PAD, ty + 185);
    fCtx.lineTo(W - PAD, ty + 185);
    fCtx.stroke();

    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, ty + 184, 44, 3);

    // 7. Metadata Grid (Y = 1115 .. 1320)
    const my = ty + 225;
    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '600 11px "IBM Plex Mono", monospace';
    fCtx.fillText('INSTITUTION', PAD, my);
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '500 16px "IBM Plex Mono", monospace';
    fCtx.fillText(IDENTITY_DATA.institution, PAD, my + 24);

    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '600 11px "IBM Plex Mono", monospace';
    fCtx.fillText('LOCATION', PAD, my + 66);
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '500 16px "IBM Plex Mono", monospace';
    fCtx.fillText(IDENTITY_DATA.location, PAD, my + 90);

    fCtx.textAlign = 'right';
    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '600 11px "IBM Plex Mono", monospace';
    fCtx.fillText('BADGE SERIAL', W - PAD, my);
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 16px "IBM Plex Mono", monospace';
    fCtx.fillText(`AB-${IDENTITY_DATA.idNumber}`, W - PAD, my + 24);

    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '600 11px "IBM Plex Mono", monospace';
    fCtx.fillText('STATUS', W - PAD, my + 66);
    fCtx.fillStyle = SWISS_RED;
    fCtx.font = '600 14px "IBM Plex Mono", monospace';
    fCtx.fillText('\u25CF VERIFIED ACTIVE', W - PAD, my + 90);
    fCtx.textAlign = 'left';

    // 8. Vector Barcode & Bottom Swiss Red Rule
    drawBarcode(fCtx, PAD, 1380, W - PAD * 2, 38, isDark ? '#fafaf9' : '#141416');

    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, H - 48, W - PAD * 2, 3.5);

    // =========================================================================
    // BACK FACE: Clean Swiss Directory & Technical Profile
    // =========================================================================

    bCtx.fillStyle = colors.cardBg;
    bCtx.fillRect(0, 0, W, H);

    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1.5;
    bCtx.strokeRect(36, 36, W - 72, H - 72);

    bCtx.fillStyle = colors.topCutout;
    bCtx.beginPath();
    bCtx.roundRect(W / 2 - 75, 46, 150, 24, 12);
    bCtx.fill();
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1.5;
    bCtx.stroke();

    // Header
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, 102, 10, 10);

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '600 14px "IBM Plex Mono", monospace';
    bCtx.fillText('DEVELOPER PORTFOLIO // DIRECTORY', PAD + 20, 111);

    bCtx.textAlign = 'right';
    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '500 13px "IBM Plex Mono", monospace';
    bCtx.fillText('INDEX 2026', W - PAD, 111);
    bCtx.textAlign = 'left';

    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(PAD, 136);
    bCtx.lineTo(W - PAD, 136);
    bCtx.stroke();

    // Section 1: Selected Projects
    const py = 165;
    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '700 28px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText('SELECTED PROJECTS', PAD, py);

    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '500 13px "IBM Plex Mono", monospace';
    bCtx.fillText('CORE OPEN-SOURCE REPOSITORIES', PAD, py + 24);

    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.beginPath();
    bCtx.moveTo(PAD, py + 38);
    bCtx.lineTo(W - PAD, py + 38);
    bCtx.stroke();

    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, py + 37, 44, 3);

    let curProjY = py + 60;
    FEATURED_PROJECTS.forEach((proj) => {
      bCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.025)';
      bCtx.beginPath();
      bCtx.roundRect(PAD, curProjY - 10, W - PAD * 2, 78, 8);
      bCtx.fill();
      bCtx.strokeStyle = colors.hairlineBorder;
      bCtx.stroke();

      bCtx.fillStyle = SWISS_RED;
      bCtx.font = '700 16px "IBM Plex Mono", monospace';
      bCtx.fillText(proj.number, PAD + 18, curProjY + 22);

      bCtx.fillStyle = colors.textPrimary;
      bCtx.font = '600 19px "IBM Plex Sans", -apple-system, sans-serif';
      bCtx.fillText(proj.title, PAD + 62, curProjY + 22);

      bCtx.textAlign = 'right';
      bCtx.fillStyle = colors.textTertiary;
      bCtx.font = '500 11px "IBM Plex Mono", monospace';
      bCtx.fillText(proj.classification.en.toUpperCase(), W - PAD - 18, curProjY + 22);
      bCtx.textAlign = 'left';

      const cleanRepo = proj.githubUrl.replace('https://', '');
      bCtx.fillStyle = colors.textSecondary;
      bCtx.font = '400 13px "IBM Plex Mono", monospace';
      bCtx.fillText(cleanRepo, PAD + 62, curProjY + 48);

      curProjY += 92;
    });

    // More projects CTA
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, curProjY + 4, 6, 18);
    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '600 15px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText('MORE REPOSITORIES \u2192', PAD + 16, curProjY + 18);

    const cleanProfile = GITHUB_PROFILE_URL.replace('https://', '');
    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '500 13px "IBM Plex Mono", monospace';
    bCtx.fillText(cleanProfile, PAD + 195, curProjY + 18);

    // Section 2: Technical Competencies
    const techY = curProjY + 54;
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.beginPath();
    bCtx.moveTo(PAD, techY);
    bCtx.lineTo(W - PAD, techY);
    bCtx.stroke();

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '700 22px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText('TECHNICAL COMPETENCIES', PAD, techY + 32);

    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '500 14px "IBM Plex Mono", monospace';
    bCtx.fillText('React \u2022 TypeScript \u2022 Next.js \u2022 Python \u2022 Three.js \u2022 Tailwind', PAD, techY + 62);
    bCtx.fillText('Applied AI \u2022 Computer Vision \u2022 RESTful APIs \u2022 Git Workflow', PAD, techY + 86);

    // Section 3: Channels & Connect
    const commY = techY + 120;
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.beginPath();
    bCtx.moveTo(PAD, commY);
    bCtx.lineTo(W - PAD, commY);
    bCtx.stroke();

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '700 22px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText('CONNECT & CHANNELS', PAD, commY + 32);

    const channels = [
      { label: 'GITHUB', value: SOCIAL_LINKS.github.label },
      { label: 'LINKEDIN', value: SOCIAL_LINKS.linkedin.label },
      { label: 'EMAIL', value: SOCIAL_LINKS.email.label },
    ];

    let rowY = commY + 62;
    channels.forEach((ch) => {
      bCtx.font = '600 11px "IBM Plex Mono", monospace';
      bCtx.fillStyle = colors.textTertiary;
      bCtx.fillText(ch.label, PAD, rowY);

      bCtx.font = '500 14px "IBM Plex Mono", monospace';
      bCtx.fillStyle = colors.textPrimary;
      bCtx.fillText(ch.value, PAD + 120, rowY);

      bCtx.strokeStyle = colors.hairlineBorder;
      bCtx.beginPath();
      bCtx.moveTo(PAD, rowY + 12);
      bCtx.lineTo(W - PAD, rowY + 12);
      bCtx.stroke();

      rowY += 36;
    });

    // Section 4: QR Code & Signature
    const footerY = 1320;
    const qrSize = 125;
    const qrX = W - PAD - qrSize;
    drawQrCode(bCtx, qrX, footerY, qrSize, isDark ? '#fafaf9' : '#141416');

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '700 18px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText('AHMAD BADAWI', PAD, footerY + 28);

    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '400 14px "IBM Plex Sans", -apple-system, sans-serif';
    bCtx.fillText(`Software Developer \u2022 ${IDENTITY_DATA.institution}`, PAD, footerY + 54);
    bCtx.fillText('Bekasi, West Java, Indonesia', PAD, footerY + 76);

    bCtx.fillStyle = SWISS_RED;
    bCtx.font = '600 12px "IBM Plex Mono", monospace';
    bCtx.fillText('SCAN TO VIEW LIVE PORTFOLIO & CODE REPOSITORIES', PAD, footerY + 112);

    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, H - 48, W - PAD * 2, 3.5);

    frontTexture.needsUpdate = true;
    backTexture.needsUpdate = true;
  };

  useEffect(() => {
    if (!canvasesRef.current) return;
    const { portraitImg } = canvasesRef.current;
    let isMounted = true;

    const redraw = () => {
      if (isMounted) {
        drawCardFaces.current();
      }
    };

    portraitImg.onload = redraw;

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(redraw).catch(() => {});
    }

    redraw();

    return () => {
      isMounted = false;
      portraitImg.onload = null;
    };
  }, [theme]);

  // ---------------------------------------------------------------------------
  // 3D Physical Geometry & Materials
  // ---------------------------------------------------------------------------

  // Physical ID Card: Rounded Box Geometry with real thickness and beveled corners
  const cardGeometry = useMemo(
    () =>
      new RoundedBoxGeometry(
        CARD_WIDTH,
        CARD_HEIGHT,
        CARD_THICKNESS,
        4,
        CARD_CORNER_RADIUS,
      ),
    [],
  );

  // Recessed dark badge punch slot insert
  const punchSlotGeometry = useMemo(
    () => new THREE.BoxGeometry(0.24, 0.045, CARD_THICKNESS + 0.002),
    [],
  );

  // Hardware A: Clamp jaws that grip the card around the punch slot
  const clipPlateGeometry = useMemo(
    () => new RoundedBoxGeometry(0.16, 0.10, 0.02, 3, 0.005),
    [],
  );

  // Hardware B: Cross-locking rivet pin through the punch slot
  const clipPinGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.012, 0.012, 0.06, 20),
    [],
  );

  // Hardware C: Swivel neck base collar seated on the clamp
  const clipNeckGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.022, 0.022, 0.05, 24),
    [],
  );

  // Hardware C2: Machined swivel barrel body
  const swivelBarrelGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.026, 0.026, 0.05, 24),
    [],
  );

  // Hardware C3: Swivel top flange / thrust washer
  const swivelFlangeGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.033, 0.033, 0.012, 24),
    [],
  );

  // Hardware D: Eyelet link joining the swivel flange to the ring
  const ringLinkGeometry = useMemo(
    () => new RoundedBoxGeometry(0.05, 0.055, 0.024, 3, 0.006),
    [],
  );

  // Hardware E: Machined attachment ring (chamfered annulus) centred precisely
  // at CARD_CLIP_OFFSET_Y (1.70) — the physical spherical-joint pivot point.
  const clipRingGeometry = useMemo(() => {
    const outerRadius = 0.075;
    const innerRadius = 0.048;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.0045,
      bevelSize: 0.0045,
      bevelSegments: 2,
      curveSegments: 32,
    });
    geo.center();
    return geo;
  }, []);

  // Hardware F: Folded strap hem crimped inside a metal ferrule through the ring
  const strapFerruleGeometry = useMemo(
    () => new RoundedBoxGeometry(0.10, 0.052, 0.026, 3, 0.008),
    [],
  );

  // Materials — brushed satin metal: a slightly rougher, less mirror-like finish
  // so the machined arrises catch the studio key/rim lights with clear structure.
  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: METAL_CLIP_COLOR,
        roughness: 0.32,
        metalness: 0.8,
      }),
    [],
  );

  const strapLoopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: STRAP_BASE_COLOR,
        roughness: 0.85,
        metalness: 0.0,
      }),
    [],
  );

  const punchSlotMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? THEME_COLORS.dark.topCutout : THEME_COLORS.light.topCutout,
        roughness: 0.7,
        metalness: 0.05,
      }),
    [isDark],
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? THEME_COLORS.dark.edgeColor : THEME_COLORS.light.edgeColor,
        roughness: 0.42,
        metalness: 0.04,
      }),
    [isDark],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.38,
        metalness: 0.04,
      }),
    [frontTexture],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backTexture,
        roughness: 0.38,
        metalness: 0.04,
      }),
    [backTexture],
  );

  const cardMaterials = useMemo(
    () => [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ],
    [edgeMaterial, frontMaterial, backMaterial],
  );

  // Resource Disposal on unmount
  useEffect(() => {
    return () => {
      frontTexture.dispose();
      backTexture.dispose();
      cardGeometry.dispose();
      punchSlotGeometry.dispose();
      clipPlateGeometry.dispose();
      clipPinGeometry.dispose();
      clipNeckGeometry.dispose();
      swivelBarrelGeometry.dispose();
      swivelFlangeGeometry.dispose();
      ringLinkGeometry.dispose();
      clipRingGeometry.dispose();
      strapFerruleGeometry.dispose();
      metalMaterial.dispose();
      strapLoopMaterial.dispose();
      punchSlotMaterial.dispose();
      edgeMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
    };
  }, [
    frontTexture,
    backTexture,
    cardGeometry,
    punchSlotGeometry,
    clipPlateGeometry,
    clipPinGeometry,
    clipNeckGeometry,
    swivelBarrelGeometry,
    swivelFlangeGeometry,
    ringLinkGeometry,
    clipRingGeometry,
    strapFerruleGeometry,
    metalMaterial,
    strapLoopMaterial,
    punchSlotMaterial,
    edgeMaterial,
    frontMaterial,
    backMaterial,
  ]);

  return (
    <group>
      {/* 1. Physical ID Card Body (RoundedBox with 6-face mapping) */}
      <mesh
        geometry={cardGeometry}
        material={cardMaterials}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />

      {/* Recessed punch-hole cutout near top of card */}
      <mesh
        geometry={punchSlotGeometry}
        material={punchSlotMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.07, 0]}
      />

      {/* ------------------------------------------------------------------- */}
      {/* 2. Mechanical Attachment Chain                                      */}
      {/*    STRAP → CRIMP FERRULE → MACHINED RING → EYELET LINK →            */}
      {/*    SWIVEL FLANGE → SWIVEL BARREL → CLAMP JAWS → CARD                */}
      {/* ------------------------------------------------------------------- */}

      {/* A. Clamp jaws gripping the card around the punch slot */}
      <mesh
        geometry={clipPlateGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.02, 0.026]}
      />
      <mesh
        geometry={clipPlateGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.02, -0.026]}
      />

      {/* B. Cross-locking rivet pin through the punch slot */}
      <mesh
        geometry={clipPinGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.07, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* C. Swivel assembly: neck collar → barrel → top flange */}
      <mesh
        geometry={clipNeckGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.02, 0]}
      />
      <mesh
        geometry={swivelBarrelGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.075, 0]}
      />
      <mesh
        geometry={swivelFlangeGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.105, 0]}
      />

      {/* D. Eyelet link bridging the swivel flange to the ring */}
      <mesh
        geometry={ringLinkGeometry}
        material={metalMaterial}
        position={[0, CARD_CLIP_OFFSET_Y - 0.065, 0]}
      />

      {/* E. Machined attachment ring centred at CARD_CLIP_OFFSET_Y (1.70) */}
      <mesh
        geometry={clipRingGeometry}
        material={metalMaterial}
        position={[0, CARD_CLIP_OFFSET_Y, 0]}
      />

      {/* F. Folded strap hem crimped inside a ferrule threading through the ring */}
      <mesh
        geometry={strapFerruleGeometry}
        material={strapLoopMaterial}
        position={[0, CARD_CLIP_OFFSET_Y + 0.1, 0]}
      />
    </group>
  );
};
