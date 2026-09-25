import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { TECHNOLOGIES } from '../../data/profile';
import { ScrollPull } from '../Motion/ScrollPull';

export const Technologies: React.FC = () => {
  const { t } = useLanguage();

  const categories = [
    { key: 'languages', title: t.tech.categories.languages, items: TECHNOLOGIES.languages },
    { key: 'web', title: t.tech.categories.web, items: TECHNOLOGIES.web },
    { key: 'database', title: t.tech.categories.database, items: TECHNOLOGIES.database },
    { key: 'tools', title: t.tech.categories.tools, items: TECHNOLOGIES.tools },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.tech.sectionNum}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-9">
              <h2
                id="skills-title"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase text-stone-900 dark:text-stone-50"
              >
                {t.tech.title}
              </h2>
              <p className="mt-4 text-base font-normal text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] leading-relaxed">
                {t.tech.lead}
              </p>
            </div>
          </div>
        </ScrollPull>

        {/* Minimal Swiss Editorial Grid for Technologies (Zero percentage bars, zero badge clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {categories.map((cat, idx) => (
            <ScrollPull key={cat.key} delay={0.05 * idx} displacement={20}>
              <div className="border-t-2 border-stone-900 dark:border-stone-50 pt-4 flex flex-col h-full">
                {/* Category Header */}
                <div className="flex items-baseline justify-between mb-2 font-mono text-[10px] uppercase">
                  <span className="font-medium text-stone-900 dark:text-stone-50 tracking-wider">
                    0{idx + 1} //
                  </span>
                  <span className="text-stone-900/40 dark:text-stone-50/40 tabular-nums tracking-wider">
                    {cat.items.length} {t.tech.itemsLabel}
                  </span>
                </div>

                <h3 className="text-xs font-mono uppercase tracking-[0.15em] text-stone-900 dark:text-stone-50 mb-6 font-medium">
                  {cat.title}
                </h3>

                {/* Technologies List */}
                <ul className="space-y-4">
                  {cat.items.map((item, i) => (
                    <li
                      key={i}
                      className="border-b border-stone-200 dark:border-stone-800 pb-3"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm sm:text-base font-normal uppercase text-stone-900 dark:text-stone-50 tracking-tight">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-stone-900/60 dark:text-stone-50/60 mt-1 font-mono leading-relaxed">
                        {item.role}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollPull>
          ))}
        </div>
      </div>
    </section>
  );
};
