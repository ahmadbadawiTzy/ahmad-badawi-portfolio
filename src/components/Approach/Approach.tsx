import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { APPROACH_STEPS } from '../../data/profile';
import { ScrollPull } from '../Motion/ScrollPull';

export const Approach: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.approach.sectionNum}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-9">
              <h2
                id="approach-title"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50"
              >
                {t.approach.title}
              </h2>
              <p className="mt-4 text-base font-normal text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] leading-relaxed">
                {t.approach.lead}
              </p>
            </div>
          </div>
        </ScrollPull>

        {/* Editorial Step Sequence */}
        <div className="border-t border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {APPROACH_STEPS.map((step) => (
            <ScrollPull key={step.number} delay={0.06 * Number(step.number)} displacement={20}>
              <div className="py-6 md:py-8 grid grid-cols-12 gap-4 md:gap-8 items-baseline group hover:bg-stone-100/40 dark:hover:bg-stone-900/40 transition-colors px-2 -mx-2">
                {/* Step Number */}
                <div className="col-span-12 sm:col-span-2 md:col-span-1">
                  <span className="font-mono text-sm md:text-base text-stone-900 dark:text-stone-50 font-medium tabular-nums">
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <div className="col-span-12 sm:col-span-4 md:col-span-3">
                  <h3 className="text-lg md:text-xl font-normal uppercase text-stone-900 dark:text-stone-50 tracking-tight">
                    {step.title[language]}
                  </h3>
                </div>

                {/* Step Description */}
                <div className="col-span-12 sm:col-span-6 md:col-span-8">
                  <p className="text-sm md:text-base font-normal text-stone-900/70 dark:text-stone-50/70 leading-relaxed max-w-[60ch] text-pretty">
                    {step.description[language]}
                  </p>
                </div>
              </div>
            </ScrollPull>
          ))}
        </div>
      </div>
    </section>
  );
};
