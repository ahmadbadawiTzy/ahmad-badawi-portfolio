import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Lanyard3D } from './Lanyard3D';
import { ScrollPull } from '../Motion/ScrollPull';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.about.sectionNum}
            </span>
          </div>

          <h2
            id="about-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50 mb-10 md:mb-14"
          >
            {t.about.title}
          </h2>
        </ScrollPull>

        {/* 12-Column Editorial Grid: Narrative on Left, 3D Lanyard on Right */}
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Narrative & Background */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
            <ScrollPull delay={0.05} displacement={20}>
              <p className="text-lg sm:text-xl font-normal leading-relaxed text-stone-900 dark:text-stone-50 text-pretty">
                {t.about.lead}
              </p>
            </ScrollPull>

            <ScrollPull delay={0.1} displacement={20}>
              <p className="text-sm sm:text-base font-normal leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[55ch] text-pretty">
                {t.about.body1}
              </p>
            </ScrollPull>

            <ScrollPull delay={0.15} displacement={20}>
              <p className="text-sm sm:text-base font-normal leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[55ch] text-pretty">
                {t.about.body2}
              </p>
            </ScrollPull>

            <ScrollPull delay={0.2} displacement={20}>
              <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
                <div className="grid grid-cols-2 gap-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-900/40 dark:text-stone-50/40 block mb-1">
                      {t.about.focus}
                    </span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-50 uppercase tracking-tight">
                      {t.about.focusValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-900/40 dark:text-stone-50/40 block mb-1">
                      {t.about.philosophy}
                    </span>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-50 uppercase tracking-tight">
                      {t.about.philosophyValue}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollPull>
          </div>

          {/* Right Column: 3D Lanyard Physical Object */}
          <div className="col-span-12 lg:col-span-6 flex items-center justify-center overflow-hidden">
            <Lanyard3D />
          </div>
        </div>
      </div>
    </section>
  );
};
