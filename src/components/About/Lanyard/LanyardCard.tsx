import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { AHMAD_PORTRAITS } from '../../../assets/images';
import type { ThemeMode } from './lanyard.types';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_THICKNESS,
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

    // =================================================================
    // FRONT: Swiss Institutional Developer ID
    // =================================================================
    fCtx.fillStyle = '#141311';
    fCtx.fillRect(0, 0, W, H);

    // Card border
    fCtx.strokeStyle = 'rgba(250, 250, 249, 0.10)';
    fCtx.lineWidth = 3;
    fCtx.strokeRect(30, 30, W - 60, H - 60);

    // Top slot cutout
    fCtx.fillStyle = '#0c0a09';
    fCtx.beginPath();
    fCtx.roundRect(W / 2 - 90, 48, 180, 26, 13);
    fCtx.fill();

    // Swiss red accent bar
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, 100, W - PAD * 2, 6);

    // Institution label
    fCtx.fillStyle = 'rgba(250, 250, 249, 0.35)';
    fCtx.font = '500 20px "IBM Plex Mono", monospace';
    fCtx.fillText('UNIVERSITAS BINA INSANI \u2022 ID-2024', PAD, 160);

    fCtx.fillStyle = 'rgba(250, 250, 249, 0.55)';
    fCtx.font = '400 24px "IBM Plex Sans", sans-serif';
    fCtx.fillText('S1 SISTEM INFORMASI', PAD, 200);

    // Hairline separator
    fCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    fCtx.lineWidth = 1;
    fCtx.beginPath();
    fCtx.moveTo(PAD, 240);
    fCtx.lineTo(W - PAD, 240);
    fCtx.stroke();

    // Portrait
    const portraitX = PAD;
    const portraitY = 280;
    const portraitW = W - PAD * 2;
    const portraitH = 720;

    fCtx.fillStyle = '#1c1917';
    fCtx.fillRect(portraitX, portraitY, portraitW, portraitH);

    if (portraitImg.complete && portraitImg.naturalWidth > 0) {
      fCtx.drawImage(portraitImg, portraitX, portraitY, portraitW, portraitH);
    }

    fCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    fCtx.lineWidth = 2;
    fCtx.strokeRect(portraitX, portraitY, portraitW, portraitH);

    // Hairline below portrait
    fCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    fCtx.beginPath();
    fCtx.moveTo(PAD, portraitY + portraitH + 40);
    fCtx.lineTo(W - PAD, portraitY + portraitH + 40);
    fCtx.stroke();

    // Name
    const nameY = portraitY + portraitH + 100;
    fCtx.fillStyle = '#fafaf9';
    fCtx.font = '300 72px "IBM Plex Sans", sans-serif';
    fCtx.fillText('AHMAD', PAD, nameY);
    fCtx.fillText('BADAWI', PAD, nameY + 80);

    // Red accent rule under name
    fCtx.fillStyle = SWISS_RED;
    fCtx.fillRect(PAD, nameY + 110, 56, 5);

    // Role
    fCtx.fillStyle = 'rgba(250, 250, 249, 0.65)';
    fCtx.font = '400 32px "IBM Plex Sans", sans-serif';
    fCtx.fillText('SOFTWARE DEVELOPER', PAD, nameY + 180);

    // Bottom info line
    fCtx.fillStyle = 'rgba(250, 250, 249, 0.30)';
    fCtx.font = '400 20px "IBM Plex Mono", monospace';
    fCtx.fillText('BEKASI, INDONESIA  \u2022  2024 \u2014 PRESENT', PAD, H - 80);

    // Decorative barcode at bottom
    fCtx.fillStyle = 'rgba(250, 250, 249, 0.12)';
    for (let x = PAD; x < W - PAD; x += 10) {
      const w = x % 20 === 0 ? 5 : 2;
      fCtx.fillRect(x, H - 50, w, 18);
    }

    // =================================================================
    // BACK: Editorial System Profile
    // =================================================================
    bCtx.fillStyle = '#141311';
    bCtx.fillRect(0, 0, W, H);

    bCtx.strokeStyle = 'rgba(250, 250, 249, 0.10)';
    bCtx.lineWidth = 3;
    bCtx.strokeRect(30, 30, W - 60, H - 60);

    // Top slot cutout
    bCtx.fillStyle = '#0c0a09';
    bCtx.beginPath();
    bCtx.roundRect(W / 2 - 90, 48, 180, 26, 13);
    bCtx.fill();

    // Swiss red top stripe
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, 100, W - PAD * 2, 6);

    // Name header
    bCtx.fillStyle = '#fafaf9';
    bCtx.font = '300 56px "IBM Plex Sans", sans-serif';
    bCtx.fillText('AHMAD BADAWI', PAD, 180);

    bCtx.fillStyle = 'rgba(250, 250, 249, 0.55)';
    bCtx.font = '400 26px "IBM Plex Sans", sans-serif';
    bCtx.fillText('SOFTWARE DEVELOPER', PAD, 220);

    // Separator
    bCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(PAD, 260);
    bCtx.lineTo(W - PAD, 260);
    bCtx.stroke();

    // Section: TECHNICAL STACK
    bCtx.fillStyle = 'rgba(250, 250, 249, 0.30)';
    bCtx.font = '500 18px "IBM Plex Mono", monospace';
    bCtx.fillText('TECHNICAL STACK', PAD, 320);

    const stackCategories = [
      { label: 'LANGUAGES', skills: 'Python \u2022 Java \u2022 JavaScript \u2022 TypeScript \u2022 C++ \u2022 PHP' },
      { label: 'WEB', skills: 'React \u2022 Next.js \u2022 Node.js \u2022 Tailwind \u2022 HTML5' },
      { label: 'DATABASE', skills: 'SQL \u2022 MySQL \u2022 MongoDB' },
      { label: 'TOOLS', skills: 'Git \u2022 Linux \u2022 Figma' },
    ];

    let stackY = 365;
    for (const cat of stackCategories) {
      bCtx.fillStyle = SWISS_RED;
      bCtx.font = '500 16px "IBM Plex Mono", monospace';
      bCtx.fillText(cat.label, PAD, stackY);

      bCtx.fillStyle = 'rgba(250, 250, 249, 0.55)';
      bCtx.font = '300 22px "IBM Plex Sans", sans-serif';
      bCtx.fillText(cat.skills, PAD + 200, stackY);

      stackY += 44;
    }

    // Separator
    bCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    bCtx.beginPath();
    bCtx.moveTo(PAD, stackY + 20);
    bCtx.lineTo(W - PAD, stackY + 20);
    bCtx.stroke();

    // Section: DOMAIN EXPERTISE
    bCtx.fillStyle = 'rgba(250, 250, 249, 0.30)';
    bCtx.font = '500 18px "IBM Plex Mono", monospace';
    bCtx.fillText('DOMAIN EXPERTISE', PAD, stackY + 70);

    const domains = [
      'Full-Stack Web Applications',
      'Computer Vision & Machine Learning',
      'Real-Time Interactive Systems',
    ];

    let domainY = stackY + 115;
    for (const domain of domains) {
      bCtx.fillStyle = 'rgba(250, 250, 249, 0.08)';
      bCtx.fillRect(PAD, domainY - 18, 6, 20);

      bCtx.fillStyle = 'rgba(250, 250, 249, 0.70)';
      bCtx.font = '300 24px "IBM Plex Sans", sans-serif';
      bCtx.fillText(domain, PAD + 24, domainY);

      domainY += 44;
    }

    // Separator
    bCtx.strokeStyle = 'rgba(250, 250, 249, 0.08)';
    bCtx.beginPath();
    bCtx.moveTo(PAD, domainY + 20);
    bCtx.lineTo(W - PAD, domainY + 20);
    bCtx.stroke();

    // Section: EDUCATION
    bCtx.fillStyle = 'rgba(250, 250, 249, 0.30)';
    bCtx.font = '500 18px "IBM Plex Mono", monospace';
    bCtx.fillText('EDUCATION', PAD, domainY + 70);

    bCtx.fillStyle = 'rgba(250, 250, 249, 0.70)';
    bCtx.font = '300 22px "IBM Plex Sans", sans-serif';
    bCtx.fillText('Universitas Bina Insani \u2014 S1 Sistem Informasi', PAD, domainY + 110);
    bCtx.fillText('2024 \u2014 Present', PAD, domainY + 145);

    bCtx.fillStyle = 'rgba(250, 250, 249, 0.50)';
    bCtx.font = '300 20px "IBM Plex Sans", sans-serif';
    bCtx.fillText('SMK Teknologi Nasional \u2014 TKJ', PAD, domainY + 190);
    bCtx.fillText('2021 \u2014 2024', PAD, domainY + 222);

    // Swiss red bottom stripe
    bCtx.fillStyle = SWISS_RED;
    bCtx.fillRect(PAD, H - 110, W - PAD * 2, 6);

    // Footer contact
    bCtx.fillStyle = 'rgba(250, 250, 249, 0.30)';
    bCtx.font = '400 18px "IBM Plex Mono", monospace';
    bCtx.fillText('ahmadbadawi.biu.si@gmail.com', PAD, H - 75);
    bCtx.fillText('github.com/ahmadbadawi', PAD, H - 50);

    // Decorative barcode
    bCtx.fillStyle = 'rgba(250, 250, 249, 0.12)';
    for (let x = PAD; x < W - PAD; x += 10) {
      const w = x % 20 === 0 ? 5 : 2;
      bCtx.fillRect(x, H - 30, w, 10);
    }

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

  const cardGeometry = useMemo(
    () => new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_THICKNESS),
    [],
  );
  const clipSlotGeometry = useMemo(() => new THREE.BoxGeometry(0.55, 0.18, 0.08), []);
  const clipRingGeometry = useMemo(() => new THREE.TorusGeometry(0.14, 0.028, 16, 32), []);

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: METAL_CLIP_COLOR,
        roughness: 0.25,
        metalness: 0.85,
      }),
    [],
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isDark ? THEME_COLORS.dark.edgeColor : THEME_COLORS.light.edgeColor,
        roughness: 0.5,
        metalness: 0.1,
      }),
    [isDark],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.35,
        metalness: 0.05,
      }),
    [frontTexture],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backTexture,
        roughness: 0.35,
        metalness: 0.05,
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

  useEffect(() => {
    return () => {
      frontTexture.dispose();
      backTexture.dispose();
      cardGeometry.dispose();
      clipSlotGeometry.dispose();
      clipRingGeometry.dispose();
      metalMaterial.dispose();
      edgeMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
    };
  }, [
    frontTexture,
    backTexture,
    cardGeometry,
    clipSlotGeometry,
    clipRingGeometry,
    metalMaterial,
    edgeMaterial,
    frontMaterial,
    backMaterial,
  ]);

  return (
    <group>
      <mesh
        geometry={cardGeometry}
        material={cardMaterials}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <mesh
        geometry={clipSlotGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.08, 0]}
      />
      <mesh
        geometry={clipRingGeometry}
        material={metalMaterial}
        position={[0, CARD_HEIGHT / 2 + 0.20, 0]}
      />
    </group>
  );
};
