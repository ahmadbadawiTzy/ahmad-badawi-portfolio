import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { HeroVisual } from './HeroVisual';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle scroll-driven displacement between typography and portrait
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 25]);
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
          <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] aspect-[896/1200] relative mx-auto">
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
    </section>
  );
};
