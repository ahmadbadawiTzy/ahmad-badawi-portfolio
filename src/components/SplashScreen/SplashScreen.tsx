import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';

interface SplashScreenProps {
  onComplete?: () => void;
}

/**
 * SplashScreen — Swiss editorial intro sequence.
 *
 * Motion refinement only: the layout, typography, palette and composition are
 * unchanged. The opening/closing choreography is driven by `motion` springs and
 * a luxury ease curve so the reveal reads as one continuous, physical gesture
 * rather than a set of linear CSS switches.
 */

// Signature Swiss luxury ease — controlled anticipation, long settle.
const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Accelerating exit curve — the overlay lifts cleanly off the page.
const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Spring tuned for a premium card: fast attack, minimal overshoot, no wobble.
const REVEAL_SPRING = {
  type: 'spring',
  stiffness: 95,
  damping: 22,
  mass: 1,
} as const;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { t } = useLanguage();

  // Phase states: 'enter' -> 'reveal' -> 'exit' -> 'done'
  const [phase, setPhase] = useState<'enter' | 'reveal' | 'exit' | 'done'>('enter');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const finishedRef = useRef(false);

  const finishSplash = useCallback(() => {
    // Idempotent: guards against the exit animation and the backstop timer
    // both resolving the sequence (prevents double onComplete + stuck states).
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase('done');
    try {
      sessionStorage.setItem('ab_splash_shown', 'true');
    } catch {
      // Ignore storage errors in restricted browser contexts
    }
    document.body.style.overflow = '';
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const triggerExit = useCallback(() => {
    setPhase((prev) => (prev === 'enter' || prev === 'reveal' ? 'exit' : prev));
  }, []);

  useEffect(() => {
    // Check if reload or already displayed in session
    try {
      const navEntries = performance.getEntriesByType('navigation');
      const isReload =
        navEntries.length > 0 &&
        (navEntries[0] as PerformanceNavigationTiming).type === 'reload';

      if (typeof window !== 'undefined' && window.location.search.includes('nosplash')) {
        finishSplash();
        return;
      }

      if (isReload) {
        sessionStorage.removeItem('ab_splash_shown');
      } else {
        const alreadyShown = sessionStorage.getItem('ab_splash_shown');
        if (alreadyShown === 'true') {
          finishSplash();
          return;
        }
      }
    } catch {
      // Continue if performance or storage fails
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space is the documented trigger; Escape/Enter remain supported.
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Check prefers-reduced-motion — shorten the sequence but never disable it.
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timers: number[] = [];

    if (reducedMotionQuery.matches) {
      setIsReducedMotion(true);
      timers.push(window.setTimeout(() => triggerExit(), 300));
    } else {
      // Orchestrated sequence (~1.2s of held composition before the lift).
      timers.push(window.setTimeout(() => setPhase('reveal'), 50));
      timers.push(window.setTimeout(() => triggerExit(), 1100));
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [finishSplash, triggerExit]);

  // Backstop: if the exit animation is interrupted (e.g. tab hidden mid-frame
  // pauses rAF), still resolve the sequence so the page never gets stuck.
  useEffect(() => {
    if (phase !== 'exit') return;
    const backstop = window.setTimeout(() => finishSplash(), 1400);
    return () => window.clearTimeout(backstop);
  }, [phase, finishSplash]);

  if (phase === 'done') {
    return null;
  }

  const isExiting = phase === 'exit';
  const isRevealing = phase === 'reveal' || phase === 'exit';

  // Overlay: full-height mask wipe (desktop) / gentle fade (reduced motion).
  const overlayInitial = isReducedMotion ? { opacity: 1 } : { y: '0%' };
  const overlayAnimate = isExiting
    ? isReducedMotion
      ? { opacity: 0 }
      : { y: '-100%' }
    : isReducedMotion
      ? { opacity: 1 }
      : { y: '0%' };
  const overlayTransition = isReducedMotion
    ? { duration: 0.18, ease: 'easeOut' as const }
    : isExiting
      ? { duration: 0.8, ease: EXIT_EASE }
      : { duration: 0.4, ease: ENTER_EASE };

  // Shared helper builders keep every element's hidden/shown state symmetrical.
  const fadeTransition = (delay: number) =>
    isReducedMotion
      ? { duration: 0.2, ease: 'easeOut' as const, delay: 0 }
      : { duration: 0.6, ease: ENTER_EASE, delay };

  const revealTransition = (delay: number) =>
    isReducedMotion
      ? { duration: 0.2, ease: 'easeOut' as const, delay: 0 }
      : { ...REVEAL_SPRING, delay };

  return (
    <motion.div
      id="splash-screen"
      role="status"
      aria-label={t.splash.system}
      onClick={triggerExit}
      initial={overlayInitial}
      animate={overlayAnimate}
      transition={overlayTransition}
      onAnimationComplete={() => {
        if (phase === 'exit') finishSplash();
      }}
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none cursor-pointer bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50 will-change-transform ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Top Technical Metadata Strip */}
      <header className="w-full flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 text-[11px] font-mono uppercase tracking-widest text-stone-900/70 dark:text-stone-50/70">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
          <span>{t.splash.system}</span>
        </div>

        <div className="hidden sm:block text-stone-900/40 dark:text-stone-50/40">
          {t.splash.edition}
        </div>

        <div className="text-stone-900/40 dark:text-stone-50/40 tabular-nums">
          {t.splash.coordinates}
        </div>
      </header>

      {/* Main Center Content: Architectural Swiss Identity */}
      <main className="w-full max-w-5xl mx-auto my-auto flex flex-col">
        {/* Eyebrow / Catalog Index */}
        <motion.div
          className="flex items-center gap-2 mb-3 sm:mb-4"
          initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={
            isRevealing
              ? isReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0 }
              : isReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10 }
          }
          transition={fadeTransition(0.05)}
        >
          <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">
            {t.splash.profiling}
          </span>
        </motion.div>

        {/* Primary Name Display with Masked Clip Reveal */}
        <div className="overflow-hidden py-1">
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight uppercase leading-none text-stone-900 dark:text-stone-50"
            initial={isReducedMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            animate={
              isRevealing
                ? isReducedMotion
                  ? { opacity: 1 }
                  : { y: '0%', opacity: 1 }
                : isReducedMotion
                  ? { opacity: 0 }
                  : { y: '100%', opacity: 0 }
            }
            transition={revealTransition(0.18)}
          >
            AHMAD<br />BADAWI
          </motion.h1>
        </div>

        {/* Architectural Accent Rule */}
        <motion.div
          className="w-12 h-0.5 bg-[#C8102E] my-6 origin-left"
          initial={isReducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
          animate={
            isRevealing
              ? isReducedMotion
                ? { opacity: 1 }
                : { scaleX: 1, opacity: 1 }
              : isReducedMotion
                ? { opacity: 0 }
                : { scaleX: 0, opacity: 0 }
          }
          transition={fadeTransition(0.4)}
        ></motion.div>

        {/* Role Subtitle with Offset Timing */}
        <div className="overflow-hidden py-1">
          <motion.h2
            className="text-lg sm:text-2xl md:text-3xl font-light uppercase tracking-tight text-stone-900/70 dark:text-stone-50/70"
            initial={isReducedMotion ? { opacity: 0 } : { y: '100%', opacity: 0 }}
            animate={
              isRevealing
                ? isReducedMotion
                  ? { opacity: 1 }
                  : { y: '0%', opacity: 1 }
                : isReducedMotion
                  ? { opacity: 0 }
                  : { y: '100%', opacity: 0 }
            }
            transition={revealTransition(0.3)}
          >
            SOFTWARE DEVELOPER
          </motion.h2>
        </div>
      </main>

      {/* Bottom Technical Strip & Subtle Skip Hint */}
      <footer className="w-full flex items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-4 text-[11px] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2 text-stone-900/40 dark:text-stone-50/40">
          <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
          <span>{t.splash.status}</span>
        </div>

        <div className="text-stone-900/40 dark:text-stone-50/40 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
          [ {t.splash.skipHint} ]
        </div>
      </footer>
    </motion.div>
  );
};
