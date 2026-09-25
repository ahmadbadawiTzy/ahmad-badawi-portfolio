import * as THREE from 'three';

// --- Card Geometry & Physical Dimensions ---
export const CARD_WIDTH = 2.0;
export const CARD_HEIGHT = 3.0;
export const CARD_THICKNESS = 0.04;
export const CARD_CLIP_OFFSET_Y = CARD_HEIGHT / 2 + 0.20; // 1.70 (top clip anchor)

export const TEXTURE_WIDTH = 1024;
export const TEXTURE_HEIGHT = 1536;

// --- Camera Defaults ---
export const CAMERA_FOV = 38;
export const CAMERA_POSITION: [number, number, number] = [0, 0.35, 8.2];
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 100;

// --- Physics Configuration (Rapier) ---
export const GRAVITY: [number, number, number] = [0, -40, 0];
export const TIME_STEP = 1 / 60;

export const FIXED_ANCHOR_POS: [number, number, number] = [0, 2.7, 0];
export const ROPE_JOINT_LENGTH = 0.7;
export const SEGMENT_COUNT = 3;

export const JOINT_LINEAR_DAMPING = 2;
export const JOINT_ANGULAR_DAMPING = 2;
export const CARD_LINEAR_DAMPING = 2;
export const CARD_ANGULAR_DAMPING = 2;

// --- Interaction & Smoothing ---
export const DRAG_THRESHOLD = 8; // Movement threshold in screen pixels to distinguish click vs drag
export const FLIP_SMOOTHING = 0.14; // Smoothing factor for card rotation interpolation
export const SWING_STABILIZE = 0.25; // Yaw stabilization against excessive spin

// --- Drag Translation Bounds (World Space) ---
export const DRAG_BOUNDS_X: [number, number] = [-2.4, 2.4];
export const DRAG_BOUNDS_Y: [number, number] = [-2.2, 1.5];
export const DRAG_BOUNDS_Z: [number, number] = [-1.5, 1.8];

// --- Strap / Ribbon Defaults (Substantially thicker for Swiss institutional weight) ---
export const STRAP_WIDTH = 0.36; // Noticeably thicker and structurally proportional
export const STRAP_CURVE_POINTS = 32;
export const STRAP_COLOR = 0x22201e;
export const STRAP_REPEAT: [number, number] = [10, 1];

// --- Swiss Color Palette ---
export const SWISS_RED = '#C8102E';
export const METAL_CLIP_COLOR = 0xd4d4d8;

export const THEME_COLORS = {
  dark: {
    cardBg: '#141414',
    textPrimary: '#fafaf9', // stone-50
    textSecondary: 'rgba(250, 250, 249, 0.70)',
    textTertiary: 'rgba(250, 250, 249, 0.40)',
    hairlineBorder: 'rgba(250, 250, 249, 0.10)',
    topCutout: '#0c0a09', // stone-950
    photoBg: '#1c1917', // stone-900
    edgeColor: 0x1c1917,
  },
  light: {
    cardBg: '#fafaf9', // stone-50
    textPrimary: '#1c1917', // stone-900
    textSecondary: 'rgba(28, 25, 23, 0.70)',
    textTertiary: 'rgba(28, 25, 23, 0.40)',
    hairlineBorder: 'rgba(28, 25, 23, 0.10)',
    topCutout: '#e7e5e4', // stone-200
    photoBg: '#f5f5f4', // stone-100
    edgeColor: 0xe7e5e4,
  },
} as const;

// Module-level preallocated vectors to eliminate GC in useFrame
export const VEC_TEMP = new THREE.Vector3();
export const DIR_TEMP = new THREE.Vector3();
export const ANG_TEMP = new THREE.Vector3();
export const ROT_TEMP = new THREE.Vector3();
