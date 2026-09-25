import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EDUCATION_LIST } from '../../data/profile';
import { ScrollPull } from '../Motion/ScrollPull';

export const Journey: React.FC = () => {
  const { language, t } = useLanguage();

  const journeyItems = [
    ...EDUCATION_LIST,
    {
      period: '2024 — ' + (language === 'id' ? 'SEKARANG' : 'PRESENT'),
      institution: language === 'id' ? 'Eksplorasi Proyek & Sistem' : 'Project & System Exploration',
      degree: {
        id: 'Praktik Mandiri & Eksperimen Software',
        en: 'Self-Directed Engineering & Experiments',
      },
      location: 'Bekasi, Indonesia',
      details: {
        id: 'Mengembangkan aplikasi praktis secara end-to-end (AI Financial Manager, klasifikasi kematangan berbasis computer vision, dan sistem gestur interaktif) untuk memecahkan masalah komputasi riil.',
        en: 'Developing practical applications end-to-end (AI Financial Manager, computer vision ripeness classification, and interactive gesture systems) to solve real computational problems.',
      },
    },
  ];

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.journey.sectionNum}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-9">
              <h2
                id="journey-title"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50"
              >
                {t.journey.title}
              </h2>
              <p className="mt-4 text-base font-normal text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] leading-relaxed">
                {t.journey.lead}
              </p>
            </div>
          </div>
        </ScrollPull>

        {/* Editorial Timeline Grid (Sleek Swiss grid, clear typography, dividers, tabular numerals) */}
        <div className="border-t border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {journeyItems.map((item, index) => {
            const isCurrent = item.period.includes('SEKARANG') || item.period.includes('NOW') || item.period.includes('PRESENT');
            return (
              <ScrollPull key={index} delay={0.06 * index} displacement={20}>
                <div className="py-8 md:py-10 grid grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-stone-100/40 dark:hover:bg-stone-900/40 transition-colors px-2 -mx-2">
                  {/* Chronology Column */}
                  <div className="col-span-12 md:col-span-3">
                    <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-stone-900 dark:text-stone-50 tabular-nums font-medium block">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-900/40 dark:text-stone-50/40 mt-1 block">
                      [ {isCurrent ? t.journey.statusCurrent : t.journey.statusGraduated} ]
                    </span>
                  </div>

                  {/* Institution & Degree Column */}
                  <div className="col-span-12 md:col-span-4">
                    <h3 className="text-lg sm:text-xl font-normal uppercase text-stone-900 dark:text-stone-50 tracking-tight">
                      {item.institution}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal text-stone-900/70 dark:text-stone-50/70 mt-1">
                      {item.degree[language]}
                    </p>
                    <p className="text-[11px] font-mono text-stone-900/40 dark:text-stone-50/40 mt-1 uppercase tracking-wider">
                      LOC: {item.location}
                    </p>
                  </div>

                  {/* Context & Technical Takeaway Column */}
                  <div className="col-span-12 md:col-span-5">
                    <p className="text-xs sm:text-sm font-normal text-stone-900/70 dark:text-stone-50/70 leading-relaxed max-w-[55ch] text-pretty">
                      {item.details[language]}
                    </p>
                  </div>
                </div>
              </ScrollPull>
            );
          })}
        </div>
      </div>
    </section>
  );
};
