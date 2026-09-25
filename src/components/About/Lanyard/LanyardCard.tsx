import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import type { ThreeEvent } from '@react-three/fiber';
import { AHMAD_PORTRAITS } from '../../../assets/images';
import type { ThemeMode } from './lanyard.types';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_THICKNESS,
  CARD_CORNER_RADIUS,
  TEXTURE_WIDTH,
  TEXTURE_HEIGHT,
  SWISS_RED,
  METAL_CLIP_COLOR,
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
      ctx.fillRect(curX, y + (i % 5 === 0 ? 0 : 3), barW, height - (i % 5 === 0 ? 0 : 6));
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

    const bt = new THREE.CanvasTexture(canvasesRef.current.backCanvas);
    bt.colorSpace = THREE.SRGBColorSpace;

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
    // FRONT FACE: Swiss Editorial Developer Identity Badge
    // =========================================================================

    // Solid card substrate
    fCtx.fillStyle = colors.cardBg;
    fCtx.fillRect(0, 0, W, H);

    // Micro-dot matrix background pattern
    fCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.025)';
    for (let py = 32; py < H; py += 32) {
      for (let px = 32; px < W; px += 32) {
        fCtx.fillRect(px, py, 1.5, 1.5);
      }
    }

    // Outer card edge hairline border (inset for rounded corners)
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 2;
    fCtx.strokeRect(32, 32, W - 64, H - 64);

    // Drafting registration crosshairs at the 4 card corners
    const regCrossColor = isDark ? 'rgba(250, 250, 249, 0.25)' : 'rgba(24, 23, 26, 0.25)';
    drawRegistrationCross(fCtx, 44, 44, 12, regCrossColor);
    drawRegistrationCross(fCtx, W - 44, 44, 12, regCrossColor);
    drawRegistrationCross(fCtx, 44, H - 44, 12, regCrossColor);
    drawRegistrationCross(fCtx, W - 44, H - 44, 12, regCrossColor);

    // Top punch slot cutout (physical badge slot)
    fCtx.fillStyle = colors.topCutout;
    fCtx.beginPath();
    fCtx.roundRect(W / 2 - 85, 46, 170, 26, 13);
    fCtx.fill();
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1.5;
    fCtx.stroke();

    // Section 1: Header Category & Institutional Branding
    // Kicker: DEVELOPER IDENTITY
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, 98, 12, 12);

    fCtx.fillStyle = isDark ? '#fafaf9' : '#18171a';
    fCtx.font = '600 16px "IBM Plex Mono", monospace';
    fCtx.fillText('DEVELOPER IDENTITY', PAD + 22, 110);

    // Right ID
    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '500 15px "IBM Plex Mono", monospace';
    fCtx.textAlign = 'right';
    fCtx.fillText('UBI // ID-2024', W - PAD, 110);
    fCtx.textAlign = 'left';

    // Institution & Degree
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 24px "IBM Plex Mono", monospace';
    fCtx.fillText('UNIVERSITAS BINA INSANI', PAD, 150);

    fCtx.fillStyle = colors.textSecondary;
    fCtx.font = '400 18px "IBM Plex Sans", sans-serif';
    fCtx.fillText('S1 SISTEM INFORMASI  \u2022  BEKASI, INDONESIA', PAD, 180);

    // Restrained Swiss Red accent rule
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, 206, W - PAD * 2, 4);

    // Section 2: Portrait Photo Presentation
    const portraitX = PAD;
    const portraitY = 228;
    const portraitW = W - PAD * 2;
    const portraitH = 660;

    fCtx.fillStyle = colors.photoBg;
    fCtx.fillRect(portraitX, portraitY, portraitW, portraitH);

    if (portraitImg.complete && portraitImg.naturalWidth > 0) {
      fCtx.drawImage(portraitImg, portraitX, portraitY, portraitW, portraitH);
    }

    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 2;
    fCtx.strokeRect(portraitX, portraitY, portraitW, portraitH);

    // Corner registration crosshairs on photo
    drawRegistrationCross(fCtx, portraitX, portraitY, 8, regCrossColor);
    drawRegistrationCross(fCtx, portraitX + portraitW, portraitY, 8, regCrossColor);
    drawRegistrationCross(fCtx, portraitX, portraitY + portraitH, 8, regCrossColor);
    drawRegistrationCross(fCtx, portraitX + portraitW, portraitY + portraitH, 8, regCrossColor);

    // Technical photo overlay tag
    fCtx.fillStyle = isDark ? 'rgba(18, 17, 19, 0.88)' : 'rgba(247, 247, 248, 0.90)';
    fCtx.fillRect(portraitX + portraitW - 150, portraitY + 12, 138, 26);
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1;
    fCtx.strokeRect(portraitX + portraitW - 150, portraitY + 12, 138, 26);

    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 13px "IBM Plex Mono", monospace';
    fCtx.fillText('DEV-ID // 2024', portraitX + portraitW - 138, portraitY + 30);

    // Millimeter ticks along left edge of photo
    fCtx.fillStyle = isDark ? 'rgba(250, 250, 249, 0.25)' : 'rgba(24, 23, 26, 0.25)';
    for (let ty = portraitY + 20; ty < portraitY + portraitH - 20; ty += 20) {
      const isMajor = (ty - (portraitY + 20)) % 100 === 0;
      fCtx.fillRect(portraitX + 4, ty, isMajor ? 12 : 6, 1.5);
    }

    // Section 3: Hardware EMV Chip & Security Verification
    drawEMVChip(fCtx, PAD, 915, 128, 90);

    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '500 14px "IBM Plex Mono", monospace';
    fCtx.fillText('SECURITY CLEARANCE', PAD + 160, 945);

    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 16px "IBM Plex Mono", monospace';
    fCtx.fillText('LEVEL 03 // FULL ACCESS', PAD + 160, 975);

    fCtx.fillStyle = SWISS_RED;
    fCtx.font = '500 13px "IBM Plex Mono", monospace';
    fCtx.fillText('[ ATTESTED AUTH-VALID ]', PAD + 160, 1000);

    // Separator line
    fCtx.strokeStyle = colors.hairlineBorder;
    fCtx.lineWidth = 1;
    fCtx.beginPath();
    fCtx.moveTo(PAD, 1025);
    fCtx.lineTo(W - PAD, 1025);
    fCtx.stroke();

    // Section 4: Primary Identity Typography
    const nameY = 1105;
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 76px "IBM Plex Sans", sans-serif';
    fCtx.fillText('AHMAD', PAD, nameY);
    fCtx.fillText('BADAWI', PAD, nameY + 76);

    // Swiss Red accent block under name
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, nameY + 96, 56, 5);

    // Primary Role
    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '600 30px "IBM Plex Mono", monospace';
    fCtx.fillText('SOFTWARE DEVELOPER', PAD, nameY + 146);

    // Section 5: Institutional & Tenancy Metadata Grid
    const metaY = 1290;
    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '500 14px "IBM Plex Mono", monospace';
    fCtx.fillText('PROGRAM', PAD, metaY);
    fCtx.fillText('TENURE', PAD, metaY + 34);

    fCtx.fillStyle = colors.textPrimary;
    fCtx.font = '500 15px "IBM Plex Mono", monospace';
    fCtx.fillText('UNIVERSITAS BINA INSANI  \u2022  S1 SISTEM INFORMASI', PAD + 110, metaY);
    fCtx.fillText('2024 \u2014 PRESENT  \u2022  BEKASI, INDONESIA', PAD + 110, metaY + 34);

    // Section 6: Footer Barcode & Cryptographic Attestation
    drawBarcode(fCtx, PAD, 1375, W - PAD * 2, 42, isDark ? '#fafaf9' : '#18171a');

    fCtx.fillStyle = colors.textTertiary;
    fCtx.font = '500 14px "IBM Plex Mono", monospace';
    fCtx.textAlign = 'center';
    fCtx.fillText('* AB-8492-2024 // CRYPTOGRAPHICALLY ATTESTED *', W / 2, 1445);
    fCtx.textAlign = 'left';

    // Bottom Swiss Red hairline
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, H - 46, W - PAD * 2, 4);

    // =========================================================================
    // BACK FACE: Physical Developer Badge Manifesto & Technical Profile
    // =========================================================================

    bCtx.fillStyle = colors.cardBg;
    bCtx.fillRect(0, 0, W, H);

    // Micro-dot matrix background pattern
    bCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.025)';
    for (let py = 32; py < H; py += 32) {
      for (let px = 32; px < W; px += 32) {
        bCtx.fillRect(px, py, 1.5, 1.5);
      }
    }

    // Outer card edge hairline border
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 2;
    bCtx.strokeRect(32, 32, W - 64, H - 64);

    drawRegistrationCross(bCtx, 44, 44, 12, regCrossColor);
    drawRegistrationCross(bCtx, W - 44, 44, 12, regCrossColor);
    drawRegistrationCross(bCtx, 44, H - 44, 12, regCrossColor);
    drawRegistrationCross(bCtx, W - 44, H - 44, 12, regCrossColor);

    // Top punch slot cutout
    bCtx.fillStyle = colors.topCutout;
    bCtx.beginPath();
    bCtx.roundRect(W / 2 - 85, 46, 170, 26, 13);
    bCtx.fill();
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1.5;
    bCtx.stroke();

    // Magnetic Stripe (Full card width at Y = 95, Height = 100)
    bCtx.fillStyle = isDark ? '#141416' : '#27272a';
    bCtx.fillRect(0, 95, W, 100);

    bCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    bCtx.lineWidth = 1;
    for (let my = 105; my < 190; my += 12) {
      bCtx.beginPath();
      bCtx.moveTo(0, my);
      bCtx.lineTo(W, my);
      bCtx.stroke();
    }

    // Signature Panel (Y = 215, Height = 70)
    bCtx.fillStyle = isDark ? '#1c1c1f' : '#f0f0f3';
    bCtx.beginPath();
    bCtx.roundRect(PAD, 215, W - PAD * 2, 70, 6);
    bCtx.fill();
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1;
    bCtx.stroke();

    // Guilloche wavy lines
    bCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
    bCtx.lineWidth = 1;
    for (let gy = 225; gy < 280; gy += 10) {
      bCtx.beginPath();
      bCtx.moveTo(PAD + 10, gy);
      bCtx.bezierCurveTo(PAD + 200, gy + 8, PAD + 500, gy - 8, W - PAD - 10, gy);
      bCtx.stroke();
    }

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '500 15px "IBM Plex Mono", monospace';
    bCtx.fillText('ECDSA_P256: 3045022100A9F8E2... [AUTHENTICATED]', PAD + 24, 256);

    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '400 13px "IBM Plex Mono", monospace';
    bCtx.fillText('SECURITY KEY ID: 884-2024-AB', W - PAD - 260, 256);

    // Section: Core Manifesto (BUILD. LEARN. EXPERIMENT. IMPROVE.)
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, 320, 6, 210);

    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '600 14px "IBM Plex Mono", monospace';
    bCtx.fillText('// DEVELOPER MANIFESTO', PAD + 24, 335);

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '600 48px "IBM Plex Sans", sans-serif';
    bCtx.fillText('BUILD.', PAD + 24, 385);
    bCtx.fillText('LEARN.', PAD + 24, 435);
    bCtx.fillText('EXPERIMENT.', PAD + 24, 485);
    bCtx.fillText('IMPROVE.', PAD + 24, 535);

    // Separator
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(PAD, 560);
    bCtx.lineTo(W - PAD, 560);
    bCtx.stroke();

    // Section: Technical Capabilities Matrix
    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '600 16px "IBM Plex Mono", monospace';
    bCtx.fillText('TECHNICAL CAPABILITIES', PAD, 595);

    const capabilities = [
      { tag: 'LANGUAGES', skills: 'TypeScript \u2022 Python \u2022 C++ \u2022 Java \u2022 SQL' },
      { tag: 'WEB ARCHITECTURE', skills: 'React \u2022 Next.js \u2022 Tailwind CSS \u2022 Three.js' },
      { tag: 'DATA & STATE', skills: 'PostgreSQL \u2022 MongoDB \u2022 Redis \u2022 Vector DBs' },
      { tag: 'SYSTEMS & TOOLS', skills: 'Docker \u2022 Linux \u2022 Git \u2022 CI/CD Pipelines' },
    ];

    let capY = 640;
    for (const cap of capabilities) {
      bCtx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
      bCtx.beginPath();
      bCtx.roundRect(PAD, capY - 22, 190, 36, 4);
      bCtx.fill();
      bCtx.strokeStyle = colors.hairlineBorder;
      bCtx.lineWidth = 1;
      bCtx.stroke();

      bCtx.fillStyle = SWISS_RED;
      bCtx.font = '600 13px "IBM Plex Mono", monospace';
      bCtx.fillText(cap.tag, PAD + 14, capY);

      bCtx.fillStyle = colors.textPrimary;
      bCtx.font = '400 18px "IBM Plex Sans", sans-serif';
      bCtx.fillText(cap.skills, PAD + 215, capY + 1);

      capY += 56;
    }

    // Separator
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(PAD, capY + 15);
    bCtx.lineTo(W - PAD, capY + 15);
    bCtx.stroke();

    // Section: Academic Record
    const eduY = capY + 50;
    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '600 16px "IBM Plex Mono", monospace';
    bCtx.fillText('ACADEMIC RECORD', PAD, eduY);

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '600 22px "IBM Plex Sans", sans-serif';
    bCtx.fillText('Universitas Bina Insani \u2014 S1 Sistem Informasi', PAD, eduY + 45);

    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '400 17px "IBM Plex Mono", monospace';
    bCtx.fillText('2024 \u2014 PRESENT  \u2022  BEKASI, INDONESIA', PAD, eduY + 75);

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '600 20px "IBM Plex Sans", sans-serif';
    bCtx.fillText('SMK Teknologi Nasional \u2014 Teknik Komputer & Jaringan', PAD, eduY + 130);

    bCtx.fillStyle = colors.textSecondary;
    bCtx.font = '400 17px "IBM Plex Mono", monospace';
    bCtx.fillText('2021 \u2014 2024  \u2022  NETWORKING & INFRASTRUCTURE', PAD, eduY + 160);

    // Separator
    bCtx.strokeStyle = colors.hairlineBorder;
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(PAD, eduY + 200);
    bCtx.lineTo(W - PAD, eduY + 200);
    bCtx.stroke();

    // Section: Footer Verification & Contact
    const footerY = eduY + 240;
    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '600 14px "IBM Plex Mono", monospace';
    bCtx.fillText('PUBLIC COMMUNICATIONS', PAD, footerY);

    bCtx.fillStyle = colors.textPrimary;
    bCtx.font = '500 18px "IBM Plex Mono", monospace';
    bCtx.fillText('ahmadbadawi.dev', PAD, footerY + 36);
    bCtx.fillText('github.com/ahmadbadawi', PAD, footerY + 72);
    bCtx.fillText('ahmadbadawi.biu.si@gmail.com', PAD, footerY + 108);

    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '500 13px "IBM Plex Mono", monospace';
    bCtx.fillText('BADGE NO: AB-2024-UBI-08492', PAD, footerY + 155);

    drawQrCode(bCtx, W - PAD - 150, footerY - 10, 150, isDark ? '#fafaf9' : '#18171a');

    bCtx.fillStyle = colors.textTertiary;
    bCtx.font = '500 11px "IBM Plex Mono", monospace';
    bCtx.textAlign = 'right';
    bCtx.fillText('SCAN TO VERIFY KEYS', W - PAD, footerY + 165);
    bCtx.textAlign = 'left';

    // Bottom Swiss Red stripe
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, H - 46, W - PAD * 2, 4);

    frontTexture.needsUpdate = true;
    backTexture.needsUpdate = true;
  };

  useEffect(() => {
    if (!canvasesRef.current) return;
    const { portraitImg } = canvasesRef.current;
    const handleLoad = () => {
      drawCardFaces.current();
    };
    portraitImg.onload = handleLoad;
    drawCardFaces.current();
  }, [theme]);

  // ---------------------------------------------------------------------------
  // 3D Physical Geometry & Materials (React Bits Lanyard Structure)
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
    () => new THREE.BoxGeometry(0.32, 0.06, CARD_THICKNESS + 0.002),
    [],
  );

  // Hardware: Strap crimp clamp (metal sleeve holding the folded ribbon loop)
  const strapCrimpGeometry = useMemo(
    () => new THREE.BoxGeometry(0.30, 0.08, 0.045),
    [],
  );

  // Hardware: Folded fabric loop wrapping through the top of the metal ring
  const strapLoopGeometry = useMemo(
    () => new THREE.TorusGeometry(0.065, 0.018, 12, 24),
    [],
  );

  // Hardware: Real 3D Metal Ring (Torus with thickness, hole, and bevel)
  const metalRingGeometry = useMemo(
    () => new THREE.TorusGeometry(0.095, 0.020, 20, 36),
    [],
  );

  // Hardware: Swivel Eyelet connecting to ring
  const swivelEyeletGeometry = useMemo(
    () => new THREE.TorusGeometry(0.045, 0.012, 16, 24),
    [],
  );

  // Hardware: Swivel Barrel & Pivot Hinge
  const swivelBarrelGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.035, 0.035, 0.065, 20),
    [],
  );
  const clipHingePinGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.016, 0.016, 0.08, 16),
    [],
  );

  // Hardware: Badge Clip Jaws clamping the top of the card
  const clipJawGeometry = useMemo(
    () => new THREE.BoxGeometry(0.28, 0.14, 0.024),
    [],
  );

  // Hardware: Clip tongue passing through the card punch slot
  const clipTongueGeometry = useMemo(
    () => new THREE.BoxGeometry(0.12, 0.10, 0.020),
    [],
  );

  // Tactile 3D Physical EMV Smart Chip plate (flush on card front)
  const chip3DGeometry = useMemo(
    () => new THREE.BoxGeometry(0.25, 0.18, 0.003),
    [],
  );

  // Materials
  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: METAL_CLIP_COLOR,
        roughness: 0.25,
        metalness: 0.88,
      }),
    [],
  );

  const strapLoopMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x161517,
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

  const chipGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dfc15d',
        roughness: 0.22,
        metalness: 0.88,
      }),
    [],
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? THEME_COLORS.dark.edgeColor : THEME_COLORS.light.edgeColor,
        roughness: 0.45,
        metalness: 0.05,
      }),
    [isDark],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.32,
        metalness: 0.03,
      }),
    [frontTexture],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backTexture,
        roughness: 0.32,
        metalness: 0.03,
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
      strapCrimpGeometry.dispose();
      strapLoopGeometry.dispose();
      metalRingGeometry.dispose();
      swivelEyeletGeometry.dispose();
      swivelBarrelGeometry.dispose();
      clipHingePinGeometry.dispose();
      clipJawGeometry.dispose();
      clipTongueGeometry.dispose();
      chip3DGeometry.dispose();
      metalMaterial.dispose();
      strapLoopMaterial.dispose();
      punchSlotMaterial.dispose();
      chipGoldMaterial.dispose();
      edgeMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
    };
  }, [
    frontTexture,
    backTexture,
    cardGeometry,
    punchSlotGeometry,
    strapCrimpGeometry,
    strapLoopGeometry,
    metalRingGeometry,
    swivelEyeletGeometry,
    swivelBarrelGeometry,
    clipHingePinGeometry,
    clipJawGeometry,
    clipTongueGeometry,
    chip3DGeometry,
    metalMaterial,
    strapLoopMaterial,
    punchSlotMaterial,
    chipGoldMaterial,
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
        position={[0, CARD_HEIGHT / 2 - 0.08, 0]}
      />

      {/* Tactile 3D Physical EMV Smart Chip (aligned with front graphics) */}
      <mesh
        geometry={chip3DGeometry}
        material={chipGoldMaterial}
        position={[-0.75, -0.42, CARD_THICKNESS / 2 + 0.0016]}
      />

      {/* ------------------------------------------------------------------- */}
      {/* 2. Hardware Attachment Hierarchy (React Bits Lanyard Structure)     */}
      {/* ------------------------------------------------------------------- */}

      {/* A. Card Clip Jaws (clamped over top edge of card into punch slot) */}
      {/* Front Jaw */}
      <mesh
        geometry={clipJawGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.03, 0.028]}
      />
      {/* Back Jaw */}
      <mesh
        geometry={clipJawGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.03, -0.028]}
      />
      {/* Clip tongue through card punch slot */}
      <mesh
        geometry={clipTongueGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 - 0.07, 0]}
      />

      {/* B. Clip Body, Hinge Pin & Swivel Connector */}
      <mesh
        geometry={clipHingePinGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.04, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={swivelBarrelGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.08, 0]}
      />
      <mesh
        geometry={swivelEyeletGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.125, 0]}
      />

      {/* C. Real 3D Metal Ring (Centered at CARD_CLIP_OFFSET_Y = 1.70) */}
      <mesh
        geometry={metalRingGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.20, 0]}
      />

      {/* D. Strap Loop (Fabric ribbon wrapping through top of metal ring) */}
      <mesh
        geometry={strapLoopGeometry}
        material={strapLoopMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.23, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* E. Strap Crimp Ferrule (Metal clamp sleeve securing the ribbon loop) */}
      <mesh
        geometry={strapCrimpGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.27, 0]}
      />
    </group>
  );
};
