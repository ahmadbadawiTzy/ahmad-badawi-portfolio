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
    canvas.width = 512;
    canvas.height = 256;
    const sCtx = canvas.getContext('2d');
    if (!sCtx) return new THREE.CanvasTexture(canvas);

    // Premium woven polyester base — deep charcoal
    sCtx.fillStyle = '#1a1816';
    sCtx.fillRect(0, 0, 512, 256);

    // Diagonal twill weave texture — subtle textile feel
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    sCtx.lineWidth = 1;
    for (let i = -256; i < 768; i += 6) {
      sCtx.beginPath();
      sCtx.moveTo(i, 0);
      sCtx.lineTo(i + 256, 256);
      sCtx.stroke();
    }

    // Cross-hatch micro fibers
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    sCtx.lineWidth = 0.5;
    for (let i = -256; i < 768; i += 6) {
      sCtx.beginPath();
      sCtx.moveTo(i, 256);
      sCtx.lineTo(i + 256, 0);
      sCtx.stroke();
    }

    // Reinforced top edge
    sCtx.fillStyle = '#131110';
    sCtx.fillRect(0, 0, 512, 18);

    // Reinforced bottom edge
    sCtx.fillRect(0, 238, 512, 18);

    // Primary stitch line — top
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.22)';
    sCtx.lineWidth = 1.5;
    sCtx.setLineDash([8, 5]);
    sCtx.beginPath();
    sCtx.moveTo(0, 26);
    sCtx.lineTo(512, 26);
    sCtx.stroke();

    // Secondary stitch line — top
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.10)';
    sCtx.lineWidth = 1;
    sCtx.beginPath();
    sCtx.moveTo(0, 34);
    sCtx.lineTo(512, 34);
    sCtx.stroke();

    // Primary stitch line — bottom
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.22)';
    sCtx.lineWidth = 1.5;
    sCtx.beginPath();
    sCtx.moveTo(0, 222);
    sCtx.lineTo(512, 222);
    sCtx.stroke();

    // Secondary stitch line — bottom
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.10)';
    sCtx.lineWidth = 1;
    sCtx.beginPath();
    sCtx.moveTo(0, 230);
    sCtx.lineTo(512, 230);
    sCtx.stroke();
    sCtx.setLineDash([]);

    // Swiss Red accent stripe — thin institutional mark
    sCtx.fillStyle = SWISS_RED;
    sCtx.fillRect(0, 118, 512, 4);
    sCtx.fillRect(0, 134, 512, 4);

    // Typographic pattern — name + role repeating
    sCtx.fillStyle = 'rgba(250, 250, 249, 0.50)';
    sCtx.font = '600 16px "IBM Plex Mono", monospace';

    for (let x = 24; x < 512; x += 240) {
      sCtx.fillText('AHMAD BADAWI', x, 90);
      sCtx.fillText('SOFTWARE DEVELOPER', x, 162);
    }

    // Hairline separator between text blocks
    sCtx.strokeStyle = 'rgba(250, 250, 249, 0.06)';
    sCtx.lineWidth = 0.5;
    sCtx.beginPath();
    sCtx.moveTo(0, 108);
    sCtx.lineTo(512, 108);
    sCtx.stroke();

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
