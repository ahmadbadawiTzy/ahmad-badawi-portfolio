import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HeroVisual } from './HeroVisual';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Responsive breakpoint detector: preserves exact git 545a135 mobile view while providing large layered desktop view
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1024px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subtle scroll-driven displacement between typography and portrait
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 20]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, shouldReduceMotion ? 1 : 0.4]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label={t.hero.sectionNum}
      className="relative w-full border-b border-stone-200 dark:border-stone-800 overflow-hidden select-none bg-stone-50 dark:bg-stone-950"
    >
      {/* Background Watermark Numeral */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 text-[clamp(10rem,25vw,22rem)] font-light leading-none text-stone-900/[0.03] dark:text-stone-50/[0.03] select-none pointer-events-none pr-8 pt-4 tabular-nums"
      >
        01
      </div>

      {isDesktop ? (
        /* ══════════════════════════════════════════════════════════════════════
           DESKTOP COMPOSITION (≥ 1024px): Large 16:9 Portrait with Overlay Typo
           ══════════════════════════════════════════════════════════════════════ */
        <div className="w-full max-w-[1440px] mx-auto px-8 lg:px-12 py-16 xl:py-20 relative z-10">
          <div className="relative w-full flex items-center justify-center min-h-[680px] xl:min-h-[740px] 2xl:min-h-[800px]">
            
            {/* ─── LEFT OVERLAY: Context, Role Headline, Statement & Stack ─── */}
            <motion.div
              style={{ opacity: contentOpacity }}
              className="absolute inset-x-0 top-0 bottom-0 z-20 pointer-events-none flex flex-col justify-between text-left"
            >
              {/* Upper Group: Index Marker, Accent Rule & Prominent Role Headline */}
              <div className="flex flex-col items-start max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">
                    {t.hero.sectionNum}
                  </span>
                </div>

                <div className="w-10 h-0.5 bg-[#C8102E] mb-5"></div>

                <h2 className="text-6xl xl:text-7xl 2xl:text-8xl font-light tracking-tight uppercase leading-[0.9] text-stone-900 dark:text-stone-50">
                  SOFTWARE<br />DEVELOPER
                </h2>
              </div>

              {/* Lower-Left Group: Engineering Statement & Core Stack */}
              <div className="flex flex-col items-start max-w-[34ch] xl:max-w-[38ch]">
                <p className="text-base font-normal leading-relaxed text-stone-900/80 dark:text-stone-50/80 text-pretty">
                  &ldquo;{t.hero.statement}&rdquo;
                </p>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-[11px] font-mono text-stone-900/60 dark:text-stone-50/60 w-full">
                  <span className="text-stone-900/40 dark:text-stone-50/40 block mb-1">
                    {t.hero.coreStackLabel}
                  </span>
                  <span className="text-stone-900 dark:text-stone-50 font-medium tracking-wider">
                    PYTHON · TYPESCRIPT · REACT · NODE.JS
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ─── CENTER VISUAL: Large 16:9 Interactive Portrait (Dominant Visual Layer) ─── */}
            <motion.div
              style={{ y: photoY }}
              className="w-full max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1240px] aspect-[16/9] relative z-10 mx-auto pointer-events-auto flex flex-col items-center justify-center"
            >
              <div className="w-full aspect-[16/9] relative mx-auto">
                <HeroVisual />
              </div>

              {/* Interaction Metadata Hint */}
              <div className="mt-3 text-center">
                <span className="font-mono text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 select-none">
                  [ {t.hero.interactionHint} ]
                </span>
              </div>
            </motion.div>

            {/* ─── RIGHT OVERLAY: Identity, Credentials & Swiss Actions ─── */}
            <motion.div
              style={{ opacity: contentOpacity }}
              className="absolute right-0 bottom-0 z-20 pointer-events-none max-w-[340px] xl:max-w-[380px] flex flex-col justify-center text-left"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">
                  PORTFOLIO //
                </span>
                <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
              </div>

              <div className="w-10 h-0.5 bg-[#C8102E] mb-5"></div>

              <h1 className="text-4xl xl:text-5xl font-light tracking-tight uppercase leading-[0.95] text-stone-900 dark:text-stone-50">
                {t.hero.name}
              </h1>

              <p className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60 mt-2">
                {t.hero.role}
              </p>

              <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-900/60 dark:text-stone-50/60 space-y-1.5 w-full">
                <div className="text-stone-900 dark:text-stone-50 font-medium">
                  {t.hero.education}
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span>{t.hero.period}</span>
                  <span>·</span>
                  <span>{t.hero.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#C8102E] font-medium tracking-wider pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse"></span>
                  <span>{t.hero.status || 'AVAILABLE FOR PROJECTS'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 mt-7 pointer-events-auto">
                <a
                  href="#work"
                  id="hero-cta-projects"
                  className="px-5 py-3.5 bg-[#C8102E] text-white text-xs font-mono font-medium tracking-widest uppercase hover:bg-[#C8102E]/90 active:scale-[0.98] transition-all rounded-none min-h-[44px] inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.viewWork}</span>
                  <ArrowDown size={14} />
                </a>

                <a
                  href="#contact"
                  id="hero-cta-contact"
                  className="px-5 py-3.5 border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xs text-stone-900 dark:text-stone-50 text-xs font-mono font-medium tracking-widest uppercase hover:border-stone-900 dark:hover:border-stone-50 transition-colors rounded-none min-h-[44px] inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.contact}</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
           MOBILE & TABLET COMPOSITION (< 1024px): Exact commit 545a135 layout
           ══════════════════════════════════════════════════════════════════════ */
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 sm:py-20 md:py-24 relative z-10 flex flex-col items-center text-center">
          
          {/* Top Header Hierarchy: Index Marker, Accent, Name & Primary Role */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="w-full flex flex-col items-center justify-center max-w-3xl"
          >
            {/* Section Index Marker */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">
                {t.hero.sectionNum}
              </span>
            </div>

            {/* Swiss Accent Rule */}
            <div className="w-10 h-0.5 bg-[#C8102E] mb-5"></div>

            {/* Primary Name Display */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50 leading-none">
              {t.hero.name}
            </h1>

            {/* Primary Role: SOFTWARE DEVELOPER */}
            <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] uppercase text-stone-900/70 dark:text-stone-50/70 mt-3 sm:mt-4">
              {t.hero.role}
            </p>
          </motion.div>

          {/* Absolute Focal Visual Center: Frameless Floating Portrait */}
          <motion.div
            style={{ y: photoY }}
            className="w-full flex flex-col items-center justify-center my-6 sm:my-8 relative"
          >
            {/* Portrait Container: Frameless, borderless, seamless transparent blend */}
            <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[390px] aspect-[896/1200] relative mx-auto">
              <HeroVisual />
            </div>

            {/* Interaction Metadata Hint */}
            <div className="mt-3 text-center">
              <span className="font-mono text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 select-none">
                <span className="hidden sm:inline">[ {t.hero.interactionHint} ]</span>
                <span className="inline sm:hidden">[ {t.hero.mobileInteractionHint || t.hero.interactionHint} ]</span>
              </span>
            </div>
          </motion.div>

          {/* Supporting Hero Content: Statement, Credentials, CTAs, Core Stack */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="w-full flex flex-col items-center justify-center max-w-2xl"
          >
            {/* Engineering Statement */}
            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-stone-900/80 dark:text-stone-50/80 max-w-[50ch] text-pretty">
              &ldquo;{t.hero.statement}&rdquo;
            </p>

            {/* Academic Credential & Coordinates */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-900/60 dark:text-stone-50/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 w-full">
              <span className="text-stone-900 dark:text-stone-50 font-medium">
                {t.hero.education}
              </span>
              <span>·</span>
              <span className="tabular-nums">
                {t.hero.period}
              </span>
              <span>·</span>
              <span>
                {t.hero.location}
              </span>
            </div>

            {/* Rectangular Swiss Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a
                href="#work"
                id="hero-cta-projects"
                className="px-6 py-3.5 bg-[#C8102E] text-white text-xs font-mono font-medium tracking-widest uppercase hover:bg-[#C8102E]/90 active:scale-[0.98] transition-all rounded-none min-h-[44px] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero.viewWork}</span>
                <ArrowDown size={14} />
              </a>

              <a
                href="#contact"
                id="hero-cta-contact"
                className="px-6 py-3.5 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50 text-xs font-mono font-medium tracking-widest uppercase hover:border-stone-900 dark:hover:border-stone-50 transition-colors rounded-none min-h-[44px] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero.contact}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Core Stack Strip */}
            <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-stone-900/60 dark:text-stone-50/60 w-full">
              <span className="text-stone-900/40 dark:text-stone-50/40">{t.hero.coreStackLabel}</span>
              <span className="text-stone-900 dark:text-stone-50 font-medium tracking-wider">
                PYTHON · TYPESCRIPT · REACT · NODE.JS
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
