import React from 'react';
import type * as THREE from 'three';
import type { Theme } from '../../../types';

export type ThemeMode = Theme;

export interface LanyardPhysicsProps {
  isVisible: boolean;
  theme: ThemeMode;
  onDraggingChange?: (dragging: boolean) => void;
  triggerFlipRef?: React.MutableRefObject<(() => void) | null>;
}

export interface LanyardSceneProps {
  isVisible: boolean;
  theme: ThemeMode;
  onDraggingChange?: (dragging: boolean) => void;
  triggerFlipRef?: React.MutableRefObject<(() => void) | null>;
}

export interface LanyardCardProps {
  theme: ThemeMode;
  frontTexture: THREE.CanvasTexture;
  backTexture: THREE.CanvasTexture;
}

export interface LanyardStrapProps {
  strapTexture: THREE.CanvasTexture;
  geometryRef: React.RefObject<THREE.BufferGeometry | null>;
}

export interface LanyardPublicProps {
  className?: string;
}
