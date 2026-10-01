import React from 'react';
import { Physics } from '@react-three/rapier';
import { LanyardPhysics } from './LanyardPhysics';
import type { LanyardSceneProps } from './lanyard.types';
import { GRAVITY, TIME_STEP } from './lanyard.constants';

export const LanyardScene: React.FC<LanyardSceneProps> = ({
  isVisible,
  theme,
  onDraggingChange,
  triggerFlipRef,
}) => {
  return (
    <>
      {/* Editorial Studio Lighting — Stripe precision & brushed metallic highlights */}
      <ambientLight color="#ffffff" intensity={0.55} />
      {/* Key light: Crisp directional light casting subtle specular highlights on card & clamp */}
      <directionalLight color="#ffffff" intensity={1.6} position={[2.5, 4.5, 3.5]} />
      {/* Rim light: Catches top metallic carabiner loop and card beveled edge */}
      <directionalLight color="#f1f5f9" intensity={0.9} position={[-2.8, 3.5, -2.5]} />
      {/* Fill light: Gentle bounce from below to prevent crushing shadow details */}
      <directionalLight color="#ffffff" intensity={0.45} position={[-2.2, -1.2, 2.2]} />
      {/* Overhead top glint: Highlights strap anchor and swivel fastener */}
      <directionalLight color="#ffffff" intensity={0.35} position={[0, 4.2, 0.8]} />

      <Physics
        gravity={GRAVITY}
        timeStep={TIME_STEP}
        interpolate
      >
        <LanyardPhysics
          isVisible={isVisible}
          theme={theme}
          onDraggingChange={onDraggingChange}
          triggerFlipRef={triggerFlipRef}
        />
      </Physics>
    </>
  );
};
