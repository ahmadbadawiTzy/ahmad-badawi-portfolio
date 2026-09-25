import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollPullProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  displacement?: number; // Y-axis pull displacement in px (default 24)
  duration?: number;
}

/**
 * ScrollPull Component
 * Creates an organic "pull → follow → settle" physical interaction
 * as elements scroll into viewport, respecting prefers-reduced-motion.
 */
export const ScrollPull: React.FC<ScrollPullProps> = ({
  children,
  className = '',
  delay = 0,
  displacement = 24,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.1, y: displacement }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 85,
        damping: 18,
        mass: 0.8,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
