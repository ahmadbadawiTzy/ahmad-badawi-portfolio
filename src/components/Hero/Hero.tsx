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

      <div className="max-w-6xl mx-auto px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Narrative & Information Architecture (Left / 7 columns) */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="col-span-12 lg:col-span-7 flex flex-col justify-center"
          >
            {/* Section Index Marker */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 bg-[#C8102E]"></span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">
                {t.hero.sectionNum}
              </span>
            </div>

            {/* Swiss Accent Rule */}
            <div className="w-10 h-0.5 bg-[#C8102E] mb-6"></div>

            {/* Primary Name Display */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50 leading-none">
              {t.hero.name}
            </h1>

            {/* Primary Role */}
            <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 mt-3">
              {t.hero.role}
            </p>

            {/* Engineering Statement */}
            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-stone-900/80 dark:text-stone-50/80 mt-6 max-w-[52ch] text-pretty">
              &ldquo;{t.hero.statement}&rdquo;
            </p>

            {/* Academic Credential & Coordinates */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-900/60 dark:text-stone-50/60 flex flex-wrap items-center gap-x-4 gap-y-1">
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
            <div className="flex flex-wrap items-center gap-4 mt-8">
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
            <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-900/60 dark:text-stone-50/60">
              <span className="text-stone-900/40 dark:text-stone-50/40">{t.hero.coreStackLabel}</span>
              <span className="text-stone-900 dark:text-stone-50 font-medium tracking-wider">
                PYTHON · TYPESCRIPT · REACT · NODE.JS
              </span>
            </div>
          </motion.div>

          {/* Focal Visual Zone: Liquid Reveal & Hover Swap Portrait (Right / 5 columns) */}
          <motion.div
            style={{ y: photoY }}
            className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="w-full max-w-[min(340px,85vw)] sm:max-w-[380px] md:max-w-[420px] lg:max-w-full aspect-[896/1200] border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 relative overflow-hidden">
              <HeroVisual />
            </div>

            {/* Interaction Metadata Hint */}
            <div className="mt-3 text-center">
              <span className="font-mono text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 select-none">
                [ {t.hero.interactionHint} ]
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
