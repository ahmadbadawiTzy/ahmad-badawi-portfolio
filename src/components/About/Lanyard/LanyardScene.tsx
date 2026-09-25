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
      {/* Editorial 3-point lighting — restrained, asymmetric */}
      <ambientLight color="#ffffff" intensity={0.6} />
      <directionalLight color="#ffffff" intensity={1.3} position={[2, 4, 3]} />
      <directionalLight color="#ffffff" intensity={0.35} position={[-2, 1, 2]} />
      <directionalLight color="#ffffff" intensity={0.15} position={[0, 3, -2]} />

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
