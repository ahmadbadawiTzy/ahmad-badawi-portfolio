import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PROJECTS } from '../../data/profile';
import { Github, ArrowUpRight } from 'lucide-react';
import { ScrollPull } from '../Motion/ScrollPull';

export const Projects: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.work.sectionNum}
            </span>
          </div>

          {/* Section Heading & Subtitle */}
          <div className="mb-12 md:mb-16">
            <h2
              id="work-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-tight text-stone-900 dark:text-stone-50"
            >
              {t.work.title}
            </h2>
            <p className="mt-4 text-base font-normal text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] leading-relaxed">
              {t.work.lead}
            </p>
          </div>
        </ScrollPull>

        {/* Editorial Project List: Clean, unboxed, horizontal dividers with scroll-pull physics */}
        <div className="border-t border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {PROJECTS.map((project, idx) => (
            <ScrollPull key={project.id} delay={idx * 0.08} displacement={28}>
              <article
                id={`project-${project.id}`}
                className="group py-8 sm:py-10 md:py-12 transition-colors hover:bg-stone-100/40 dark:hover:bg-stone-900/40 px-3 -mx-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 md:gap-8">
                  {/* Number & Content Block */}
                  <div className="flex items-start gap-4 sm:gap-6 md:gap-8 flex-1 min-w-0">
                    {/* Monospace Project Index */}
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs sm:text-sm font-normal tabular-nums text-stone-900/40 dark:text-stone-50/40 pt-1 shrink-0 select-none group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors"
                    >
                      {project.number}
                    </span>

                    {/* Details: Name, Short Description, Metrics, Classification */}
                    <div className="flex-1 min-w-0">
                      {/* Project Name */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-light uppercase tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors"
                        >
                          <span>{project.title}</span>
                          <ArrowUpRight
                            size={18}
                            className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-stone-900/60 dark:text-stone-50/60"
                          />
                        </a>
                      </h3>

                      {/* Short Description */}
                      <p className="mt-3 text-sm sm:text-base font-normal text-stone-900/70 dark:text-stone-50/70 leading-relaxed max-w-[65ch]">
                        {project.description[language]}
                      </p>

                      {/* Tech stack & Classification tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-4 font-mono">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-wider uppercase bg-stone-200/60 dark:bg-stone-800/60 text-stone-900/70 dark:text-stone-50/70 border border-stone-300/40 dark:border-stone-700/40">
                          <span className="w-1.5 h-1.5 bg-[#C8102E]" />
                          {project.classification[language]}
                        </span>
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] tracking-wider uppercase text-stone-900/60 dark:text-stone-50/60 border border-stone-200 dark:border-stone-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Tabular Metrics Grid */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                          {project.metrics.map((m, mIdx) => (
                            <div key={mIdx}>
                              <span className="block text-[9px] uppercase tracking-[0.15em] text-stone-900/40 dark:text-stone-50/40">
                                {m.label}
                              </span>
                              <span className="block text-xs font-medium uppercase text-stone-900 dark:text-stone-50 tabular-nums mt-0.5">
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GitHub Repository Link */}
                  <div className="flex items-center sm:self-center pl-8 sm:pl-0 shrink-0">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} repository on GitHub`}
                      title={`View ${project.title} repository on GitHub`}
                      className="group/gh inline-flex items-center justify-center p-3 text-stone-900/40 dark:text-stone-50/40 hover:text-stone-900 dark:hover:text-stone-50 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all rounded-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8102E] min-w-[44px] min-h-[44px]"
                    >
                      <Github
                        size={20}
                        className="transition-transform duration-200 group-hover/gh:scale-110"
                      />
                    </a>
                  </div>
                </div>
              </article>
            </ScrollPull>
          ))}
        </div>
      </div>
    </section>
  );
};
