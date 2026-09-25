import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { t } = useLanguage();

  // Phase states: 'enter' (reveal text) -> 'ready' -> 'exit' (wipe up) -> 'done'
  const [phase, setPhase] = useState<'enter' | 'reveal' | 'exit' | 'done'>('enter');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const finishSplash = useCallback(() => {
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
    if (phase === 'exit' || phase === 'done') return;
    setPhase('exit');
    setTimeout(() => {
      finishSplash();
    }, 450);
  }, [phase, finishSplash]);

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

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      setIsReducedMotion(true);
      const quickTimer = setTimeout(() => {
        triggerExit();
      }, 300);
      return () => clearTimeout(quickTimer);
    }

    document.body.style.overflow = 'hidden';

    // Sequence timers for Swiss transition (~1.2s total)
    const t1 = setTimeout(() => {
      setPhase('reveal');
    }, 50);

    const t2 = setTimeout(() => {
      setPhase('exit');
    }, 1100);

    const t3 = setTimeout(() => {
      finishSplash();
    }, 1550);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [finishSplash, triggerExit]);

  if (phase === 'done') {
    return null;
  }

  const isExiting = phase === 'exit';
  const isRevealing = phase === 'reveal' || phase === 'exit';

  return (
    <div
      id="splash-screen"
      role="status"
      aria-label={t.splash.system}
      onClick={triggerExit}
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none cursor-pointer bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50 ${
        isReducedMotion
          ? `transition-opacity duration-200 ${
              isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`
          : `transition-transform duration-500 will-change-transform ${
              isExiting
                ? '-translate-y-full pointer-events-none ease-[cubic-bezier(0.85,0,0.15,1)]'
                : 'translate-y-0'
            }`
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
        <div
          className={`flex items-center gap-2 mb-3 sm:mb-4 transition-all duration-500 ease-out ${
            isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">
            {t.splash.profiling}
          </span>
        </div>

        {/* Primary Name Display with Masked Clip Reveal */}
        <div className="overflow-hidden py-1">
          <h1
            className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight uppercase leading-none text-stone-900 dark:text-stone-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealing
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            AHMAD<br />BADAWI
          </h1>
        </div>

        {/* Architectural Accent Rule */}
        <div
          className={`w-12 h-0.5 bg-[#C8102E] my-6 transition-all duration-700 delay-150 ease-out origin-left ${
            isRevealing ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
        ></div>

        {/* Role Subtitle with Offset Timing */}
        <div className="overflow-hidden py-1">
          <h2
            className={`text-lg sm:text-2xl md:text-3xl font-light uppercase tracking-tight text-stone-900/70 dark:text-stone-50/70 transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isRevealing
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            SOFTWARE DEVELOPER
          </h2>
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
    </div>
  );
};
