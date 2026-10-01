import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, extend, useFrame, type ThreeElement } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { STRAP_COLOR, STRAP_WIDTH, STRAP_REPEAT, SWISS_RED, STRAP_BASE_COLOR } from './lanyard.constants';
import { IDENTITY_DATA } from '../../../data/socialLinks';

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

function renderStrapCanvas(canvas: HTMLCanvasElement) {
  const sCtx = canvas.getContext('2d');
  if (!sCtx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Premium matte ribbon base — deep charcoal / obsidian
  sCtx.fillStyle = STRAP_BASE_COLOR;
  sCtx.fillRect(0, 0, W, H);

  // Top edge subtle hairline border
  sCtx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  sCtx.fillRect(0, 0, W, 2.5);

  // Bottom edge Swiss Red accent line
  sCtx.fillStyle = SWISS_RED;
  sCtx.fillRect(0, H - 4, W, 4);

  // Clean, spaced Swiss typography (2 repeating segments per canvas)
  const segmentWidth = W / 2; // 512px per cycle
  for (let offset = 0; offset < W; offset += segmentWidth) {
    // Red indicator square
    sCtx.fillStyle = SWISS_RED;
    sCtx.fillRect(offset + 36, H / 2 - 5, 10, 10);

    // Primary name
    sCtx.fillStyle = '#fafaf9';
    sCtx.font = '700 21px "IBM Plex Sans", -apple-system, sans-serif';
    sCtx.fillText(IDENTITY_DATA.name.toUpperCase(), offset + 58, H / 2 + 7);

    // Separator dot
    sCtx.fillStyle = 'rgba(250, 250, 249, 0.35)';
    sCtx.font = '600 18px "IBM Plex Mono", monospace';
    sCtx.fillText('\u2022', offset + 258, H / 2 + 6);

    // Role
    sCtx.fillStyle = 'rgba(250, 250, 249, 0.85)';
    sCtx.font = '600 17px "IBM Plex Mono", monospace';
    sCtx.fillText(IDENTITY_DATA.role.toUpperCase(), offset + 280, H / 2 + 6);
  }
}

export const LanyardStrap: React.FC<LanyardStrapProps> = ({ geometryRef }) => {
  const { size } = useThree();
  const materialRef = useRef<MeshLineMaterial>(null);
  const strapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const strapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    strapCanvasRef.current = canvas;

    renderStrapCanvas(canvas);

    const tex = new THREE.CanvasTexture(canvas);
    // Repeat along the ribbon length only; clamp across the width so the
    // selvedge edges never bleed (prevents vertical stitch tearing).
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1); // Identity repeat on texture: MeshLineMaterial handles repeat
    tex.colorSpace = THREE.SRGBColorSpace;
    // Mipmaps + maximum anisotropy keep the weave stable and free of moiré at
    // grazing view angles, eliminating texture swimming and flicker.
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    return tex;
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (strapCanvasRef.current) {
          renderStrapCanvas(strapCanvasRef.current);
          strapTexture.needsUpdate = true;
        }
      }).catch(() => {});
    }

    return () => {
      strapTexture.dispose();
    };
  }, [strapTexture]);

  const resolution = useMemo(
    () => new THREE.Vector2(Math.max(1, size.width), Math.max(1, size.height)),
    [size.width, size.height],
  );

  useFrame((state) => {
    if (materialRef.current && state.size.width > 0 && state.size.height > 0) {
      if (
        materialRef.current.resolution.x !== state.size.width ||
        materialRef.current.resolution.y !== state.size.height
      ) {
        materialRef.current.resolution.set(state.size.width, state.size.height);
      }
    }
  });

  return (
    <mesh>
      <meshLineGeometry ref={geometryRef} />
      <meshLineMaterial
        ref={materialRef}
        transparent={false}
        depthTest={true}
        depthWrite={true}
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
