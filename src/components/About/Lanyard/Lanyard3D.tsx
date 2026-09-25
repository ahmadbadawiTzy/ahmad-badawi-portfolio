import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { LanyardScene } from './LanyardScene';
import type { LanyardPublicProps } from './lanyard.types';
import {
  CAMERA_POSITION,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
} from './lanyard.constants';

export const Lanyard3D: React.FC<LanyardPublicProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // Keyboard flip trigger ref passed down to physics
  const triggerFlipRef = useRef<(() => void) | null>(null);

  // WebGL support verification
  useEffect(() => {
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  // IntersectionObserver to pause rendering when section is out of viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        setIsVisible(visible);
      },
      { threshold: 0.1 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Accessibility keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFlipRef.current?.();
    }
  };

  const hintText =
    language === 'id'
      ? 'Ketuk kartu untuk membalik \u2022 Tarik untuk mengayun'
      : 'Click badge to flip \u2022 Drag to swing';

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <div
        ref={containerRef}
        id="lanyard-3d-container"
        tabIndex={0}
        role="img"
        aria-label="Interactive 3D Physical ID Badge for Ahmad Badawi. Click or press Enter to flip."
        onKeyDown={handleKeyDown}
        className={`relative mx-auto w-full max-w-[480px] h-[min(480px,60vh)] sm:h-[min(540px,70vh)] md:h-[580px] flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {webGlSupported ? (
          <Canvas
            camera={{
              position: CAMERA_POSITION,
              fov: CAMERA_FOV,
              near: CAMERA_NEAR,
              far: CAMERA_FAR,
            }}
            dpr={[1, 1.75]}
            frameloop={isVisible ? 'always' : 'never'}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            className="w-full h-full block touch-none"
            style={{ pointerEvents: 'auto' }}
          >
            <LanyardScene
              isVisible={isVisible}
              theme={theme}
              onDraggingChange={setIsDragging}
              triggerFlipRef={triggerFlipRef}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full p-8 flex flex-col justify-between bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div>
              <p className="font-mono text-xs uppercase text-stone-900/60 dark:text-stone-50/60 mb-2">
                AHMAD BADAWI
              </p>
              <h4 className="text-2xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50">
                SOFTWARE DEVELOPER
              </h4>
              <p className="font-mono text-xs mt-2 text-stone-900/70 dark:text-stone-50/70">
                Universitas Bina Insani — S1 Sistem Informasi (2024–Sekarang)
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <span className="font-mono text-[11px] tracking-wider uppercase text-stone-900/50 dark:text-stone-50/50 select-none">
          [ {hintText} ]
        </span>
      </div>
    </div>
  );
};
