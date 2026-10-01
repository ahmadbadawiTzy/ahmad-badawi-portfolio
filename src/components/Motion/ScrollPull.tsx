import React from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';

export interface ScrollPullProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  displacement?: number; // Y-axis pull displacement in px (default 20)
  duration?: number;
  scale?: boolean; // Subtle optical scale transition (default true)
  velocityResponse?: boolean; // Connected velocity-aware inertia response (default true)
  skew?: boolean; // Microscopic velocity skew response (default false)
}

/**
 * ScrollPull Component — Overkill Scroll Motion System
 *
 * Implements high-end, connected scroll-driven motion derived from:
 * - Skills-main/agent-skills/web-design/cinematic-gsap-lenis-motion-system
 * - Skills-main/agent-skills/web-design/scroll-progress-timeline
 * - Skills-main/agent-skills/web-design/staggered-word-reveal
 *
 * Architecture:
 * 1. Synchronized Viewport Reveal: Signature Swiss luxury ease [0.16, 1, 0.3, 1]
 *    with optical micro-scale depth (0.988 -> 1.0) and controlled Y-displacement.
 * 2. Velocity-Aware Momentum: Continuously tracks page scroll velocity via
 *    useVelocity(scrollY) + useSpring physics (damping: 32, stiffness: 200).
 *    Subtly offsets content during rapid scrolling (bounded [-5px, 5px]) and
 *    settles with smooth organic deceleration when scrolling stops.
 * 3. Zero Jank Guarantee: Outer wrapper handles viewport transitions; inner wrapper
 *    handles GPU-composited transform adjustments (will-change: transform).
 * 4. Full Reduced Motion Compliance: Bypasses all motion and wrappers when
 *    prefers-reduced-motion is active.
 */
export const ScrollPull: React.FC<ScrollPullProps> = ({
  children,
  className = '',
  delay = 0,
  displacement = 20,
  duration = 0.85,
  scale = true,
  velocityResponse = true,
  skew = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Global page scroll tracking & velocity measurement
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 32,
    stiffness: 200,
    mass: 0.6,
  });

  // Velocity-driven micro inertia (settles gracefully on stop)
  const velocityY = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [-5, 0, 5],
  );

  // Optical depth scale compression during rapid scrolling
  const velocityScale = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [0.995, 1, 0.995],
  );

  // Microscopic velocity-induced tilt
  const velocitySkew = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [-0.35, 0, 0.35],
  );

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: displacement,
        scale: scale ? 0.988 : 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {velocityResponse ? (
        <motion.div
          style={{
            y: velocityY,
            scale: velocityScale,
            skewY: skew ? velocitySkew : 0,
          }}
          className="w-full h-full will-change-transform"
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};
