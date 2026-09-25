import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, type ThreeElement } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { STRAP_COLOR, STRAP_WIDTH, STRAP_REPEAT, SWISS_RED } from './lanyard.constants';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

export interface LanyardStrapProps {
  geometryRef: React.RefObject<MeshLineGeometry | null>;
}

export const LanyardStrap: React.FC<LanyardStrapProps> = ({ geometryRef }) => {
  const { size } = useThree();
  const materialRef = useRef<MeshLineMaterial>(null);

  const strapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const sCtx = canvas.getContext('2d');
    if (!sCtx) return new THREE.CanvasTexture(canvas);

    const W = 1024;
    const H = 256;

    // Technical woven polyester base — deep matte charcoal
    sCtx.fillStyle = '#161517';
    sCtx.fillRect(0, 0, W, H);

    // Diagonal twill weave micro-structure — subtle fabric feel
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.028)';
    sCtx.lineWidth = 1;
    for (let i = -H; i < W + H; i += 6) {
      sCtx.beginPath();
      sCtx.moveTo(i, 0);
      sCtx.lineTo(i + H, H);
      sCtx.stroke();
    }

    // Intersecting counter-weave for herringbone textile depth
    sCtx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
    sCtx.lineWidth = 0.8;
    for (let i = -H; i < W + H; i += 6) {
      sCtx.beginPath();
      sCtx.moveTo(i, H);
      sCtx.lineTo(i + H, 0);
      sCtx.stroke();
    }

    // Reinforced selvedge hem edges
    sCtx.fillStyle = '#0f0e10';
    sCtx.fillRect(0, 0, W, 22);
    sCtx.fillRect(0, H - 22, W, 22);

    // Stitching helper: lockstitch with realistic thread highlight & drop-shadow
    const drawLockStitch = (y: number, dash: number[]) => {
      sCtx.save();
      // Shadow
      sCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      sCtx.lineWidth = 1.8;
      sCtx.setLineDash(dash);
      sCtx.beginPath();
      sCtx.moveTo(0, y + 1);
      sCtx.lineTo(W, y + 1);
      sCtx.stroke();

      // Thread highlight
      sCtx.strokeStyle = 'rgba(250, 250, 249, 0.38)';
      sCtx.lineWidth = 1.4;
      sCtx.beginPath();
      sCtx.moveTo(0, y);
      sCtx.lineTo(W, y);
      sCtx.stroke();
      sCtx.restore();
    };

    // Double-needle edge stitching — top and bottom
    drawLockStitch(28, [10, 6]);
    drawLockStitch(H - 28, [10, 6]);

    // Restrained Swiss Red accent pinstripe — razor-thin institutional mark
    sCtx.fillStyle = SWISS_RED;
    sCtx.fillRect(0, H - 38, W, 3);

    // Subtle horizontal divider line
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.05)';
    sCtx.lineWidth = 1;
    sCtx.beginPath();
    sCtx.moveTo(0, H / 2);
    sCtx.lineTo(W, H / 2);
    sCtx.stroke();

    // Clean, un-stretched technical typography (2 repeating segments per canvas)
    const segmentWidth = W / 2; // 512px per repeat segment
    for (let offset = 0; offset < W; offset += segmentWidth) {
      // Primary name
      sCtx.fillStyle = '#fafaf9';
      sCtx.font = '600 24px "IBM Plex Mono", monospace';
      sCtx.fillText('AHMAD BADAWI', offset + 32, H / 2 - 14);

      // Title & ID
      sCtx.fillStyle = 'rgba(250, 250, 249, 0.70)';
      sCtx.font = '500 20px "IBM Plex Mono", monospace';
      sCtx.fillText('SOFTWARE DEVELOPER', offset + 32, H / 2 + 30);

      // Restrained red tag
      sCtx.fillStyle = SWISS_RED;
      sCtx.font = '500 16px "IBM Plex Mono", monospace';
      sCtx.fillText('[0x7F]', offset + 330, H / 2 + 30);

      // Micro registration tag
      sCtx.fillStyle = 'rgba(250, 250, 249, 0.28)';
      sCtx.font = '400 13px "IBM Plex Mono", monospace';
      sCtx.fillText('ID: 2024-UBI', offset + 330, H / 2 - 14);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(STRAP_REPEAT[0], STRAP_REPEAT[1]);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    return () => {
      strapTexture.dispose();
    };
  }, [strapTexture]);

  const resolution = useMemo(
    () => new THREE.Vector2(size.width, size.height),
    [size.width, size.height],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.resolution.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh>
      <meshLineGeometry ref={geometryRef} />
      <meshLineMaterial
        ref={materialRef}
        transparent={false}
        color={STRAP_COLOR}
        map={strapTexture}
        useMap={1}
        repeat={new THREE.Vector2(STRAP_REPEAT[0], STRAP_REPEAT[1])}
        lineWidth={STRAP_WIDTH}
        resolution={resolution}
      />
    </mesh>
  );
};
