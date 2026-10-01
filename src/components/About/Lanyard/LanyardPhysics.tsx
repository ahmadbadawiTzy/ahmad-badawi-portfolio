import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import type { MeshLineGeometry } from 'meshline';
import { LanyardCard } from './LanyardCard';
import { LanyardStrap } from './LanyardStrap';
import type { LanyardPhysicsProps } from './lanyard.types';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_THICKNESS,
  CARD_CLIP_OFFSET_Y,
  FIXED_ANCHOR_POS,
  ROPE_JOINT_LENGTH,
  JOINT_LINEAR_DAMPING,
  JOINT_ANGULAR_DAMPING,
  CARD_LINEAR_DAMPING,
  CARD_ANGULAR_DAMPING,
  DRAG_THRESHOLD,
  FLIP_SMOOTHING,
  SWING_STABILIZE,
  DRAG_BOUNDS_X,
  DRAG_BOUNDS_Y,
  DRAG_BOUNDS_Z,
  STRAP_CURVE_POINTS,
  VEC_TEMP,
  DIR_TEMP,
  ANG_TEMP,
  ROT_TEMP,
} from './lanyard.constants';

export const LanyardPhysics: React.FC<LanyardPhysicsProps> = ({
  isVisible,
  theme,
  onDraggingChange,
  triggerFlipRef,
}) => {
  // Rapier RigidBody references
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  // Inner visual mesh group ref (for flip rotation without disrupting physics constraints)
  const cardInnerRef = useRef<THREE.Group>(null);

  // MeshLine geometry ref for the visual strap
  const strapGeometryRef = useRef<MeshLineGeometry>(null);

  // Drag & Flip interaction state
  const [dragged, setDragged] = useState<boolean>(false);
  const isPointerDown = useRef<boolean>(false);
  const dragStartPointer = useRef<THREE.Vector2>(new THREE.Vector2());
  const hasMovedPastThreshold = useRef<boolean>(false);
  const dragOffset = useRef<THREE.Vector3>(new THREE.Vector3());

  // Card Flip interpolation
  const targetFlip = useRef<number>(0);
  const currentFlip = useRef<number>(0);

  // Preallocated spline curve & sampled points for strap (zero allocations in useFrame)
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
    [],
  );

  const strapPoints = useMemo(
    () =>
      Array.from(
        { length: STRAP_CURVE_POINTS + 1 },
        () => new THREE.Vector3(),
      ),
    [],
  );

  // Expose keyboard triggerFlip
  useEffect(() => {
    if (triggerFlipRef) {
      triggerFlipRef.current = () => {
        targetFlip.current = targetFlip.current === 0 ? Math.PI : 0;
      };
    }
  }, [triggerFlipRef]);

  // Rope joints connecting fixed anchor down to j3
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_JOINT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_JOINT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_JOINT_LENGTH]);

  // Spherical joint connecting j3 to card top attachment point
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_CLIP_OFFSET_Y, 0],
  ]);

  // Joint segment physics defaults
  const segmentProps = useMemo(
    () => ({
      type: 'dynamic' as const,
      canSleep: true,
      colliders: false as const,
      angularDamping: JOINT_ANGULAR_DAMPING,
      linearDamping: JOINT_LINEAR_DAMPING,
    }),
    [],
  );

  // Pointer event handlers
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!card.current) return;

    try {
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }

    dragStartPointer.current.set(e.pointer.x, e.pointer.y);
    hasMovedPastThreshold.current = false;
    isPointerDown.current = true;

    const currentCardPos = card.current.translation();
    dragOffset.current.set(
      e.point.x - currentCardPos.x,
      e.point.y - currentCardPos.y,
      e.point.z - currentCardPos.z,
    );

    setDragged(true);
    onDraggingChange?.(true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture release is unavailable
    }

    const moved = hasMovedPastThreshold.current;
    isPointerDown.current = false;
    setDragged(false);
    onDraggingChange?.(false);

    if (!moved) {
      // Click interaction: flip card
      targetFlip.current = targetFlip.current === 0 ? Math.PI : 0;
    } else {
      // Drag release: wake up bodies so Rapier physics takes over seamlessly
      card.current?.wakeUp();
      j1.current?.wakeUp();
      j2.current?.wakeUp();
      j3.current?.wakeUp();
    }
  };

  // Main animation frame loop
  useFrame((state) => {
    // Distinguish click vs drag using screen-pixel distance threshold
    if (isPointerDown.current && !hasMovedPastThreshold.current) {
      const dx = (state.pointer.x - dragStartPointer.current.x) * (state.size.width / 2);
      const dy = (state.pointer.y - dragStartPointer.current.y) * (state.size.height / 2);
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        hasMovedPastThreshold.current = true;
      }
    }

    // Kinematic translation update during active dragging
    if (dragged && card.current) {
      VEC_TEMP.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      DIR_TEMP.copy(VEC_TEMP).sub(state.camera.position).normalize();
      VEC_TEMP.add(DIR_TEMP.multiplyScalar(state.camera.position.length()));

      const nextX = Math.max(
        DRAG_BOUNDS_X[0],
        Math.min(DRAG_BOUNDS_X[1], VEC_TEMP.x - dragOffset.current.x),
      );
      const nextY = Math.max(
        DRAG_BOUNDS_Y[0],
        Math.min(DRAG_BOUNDS_Y[1], VEC_TEMP.y - dragOffset.current.y),
      );
      const nextZ = Math.max(
        DRAG_BOUNDS_Z[0],
        Math.min(DRAG_BOUNDS_Z[1], VEC_TEMP.z - dragOffset.current.z),
      );

      if (Number.isFinite(nextX) && Number.isFinite(nextY) && Number.isFinite(nextZ)) {
        card.current.setNextKinematicTranslation({ x: nextX, y: nextY, z: nextZ });
      }

      card.current.wakeUp();
      j1.current?.wakeUp();
      j2.current?.wakeUp();
      j3.current?.wakeUp();
      fixed.current?.wakeUp();
    }

    // Dynamic physics state: stabilize card yaw rotation towards camera
    if (card.current && !dragged) {
      ANG_TEMP.copy(card.current.angvel());
      ROT_TEMP.copy(card.current.rotation());
      card.current.setAngvel(
        {
          x: ANG_TEMP.x,
          y: ANG_TEMP.y - ROT_TEMP.y * SWING_STABILIZE,
          z: ANG_TEMP.z,
        },
        true,
      );
    }

    // Smooth card flip rotation
    currentFlip.current += (targetFlip.current - currentFlip.current) * FLIP_SMOOTHING;
    if (cardInnerRef.current) {
      cardInnerRef.current.rotation.y = currentFlip.current;
    }

    // Update Catmull-Rom curve & strap points
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      const tFixed = fixed.current.translation();
      const tj1 = j1.current.translation();
      const tj2 = j2.current.translation();
      const tj3 = j3.current.translation();

      if (
        Number.isFinite(tFixed.x) &&
        Number.isFinite(tj1.x) &&
        Number.isFinite(tj2.x) &&
        Number.isFinite(tj3.x)
      ) {
        curve.points[0].copy(tj3);
        curve.points[1].copy(tj2);
        curve.points[2].copy(tj1);
        curve.points[3].copy(tFixed);

        for (let i = 0; i <= STRAP_CURVE_POINTS; i++) {
          curve.getPoint(i / STRAP_CURVE_POINTS, strapPoints[i]);
        }

        if (strapGeometryRef.current) {
          strapGeometryRef.current.setPoints(strapPoints);
        }
      }
    }
  });

  return (
    <>
      <group position={FIXED_ANCHOR_POS}>
        {/* Fixed Anchor at the neck */}
        <RigidBody ref={fixed} type="fixed" colliders={false} />

        {/* Rope Joint Segment 1 */}
        <RigidBody position={[0.35, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Rope Joint Segment 2 */}
        <RigidBody position={[0.7, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Rope Joint Segment 3 */}
        <RigidBody position={[1.05, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Physical Card Rigid Body */}
        <RigidBody
          position={[1.4, 0, 0]}
          ref={card}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          colliders={false}
          linearDamping={CARD_LINEAR_DAMPING}
          angularDamping={CARD_ANGULAR_DAMPING}
        >
          <CuboidCollider
            args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_THICKNESS / 2]}
          />
          <group ref={cardInnerRef}>
            <LanyardCard
              theme={theme}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            />
          </group>
        </RigidBody>
      </group>

      {/* Visual Strap following the joint points */}
      <LanyardStrap geometryRef={strapGeometryRef} />
    </>
  );
};
