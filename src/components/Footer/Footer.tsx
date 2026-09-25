import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PROFILE } from '../../data/profile';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 md:py-24 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50 transition-colors">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 items-start mb-12">
          {/* Identity */}
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
              <span className="text-base font-normal uppercase tracking-tight text-stone-900 dark:text-stone-50">
                {PROFILE.name}
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-900/60 dark:text-stone-50/60 font-medium">
              {PROFILE.role}
            </p>
            <p className="mt-4 text-[10px] font-mono text-stone-900/50 dark:text-stone-50/50 uppercase max-w-[48ch] leading-relaxed">
              {t.footer.swissNote}
            </p>
          </div>

          {/* Social Navigation */}
          <div className="col-span-12 md:col-span-4">
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-stone-900/40 dark:text-stone-50/40 block mb-3">
              {t.footer.channels}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono uppercase font-medium">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900/70 dark:text-stone-50/70 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors min-h-[32px] inline-flex items-center"
              >
                GitHub
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900/70 dark:text-stone-50/70 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors min-h-[32px] inline-flex items-center"
              >
                LinkedIn
              </a>
              <a
                href={PROFILE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900/70 dark:text-stone-50/70 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors min-h-[32px] inline-flex items-center"
              >
                Instagram
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="text-stone-900/70 dark:text-stone-50/70 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors min-h-[32px] inline-flex items-center"
              >
                Email
              </a>
            </div>
          </div>

          {/* Back to top */}
          <div className="col-span-12 md:col-span-2 md:text-right">
            <button
              type="button"
              onClick={scrollToTop}
              id="back-to-top-btn"
              aria-label="Back to top of page"
              className="px-5 py-2.5 min-h-[44px] border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-[10px] font-medium font-mono uppercase tracking-[0.15em] hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer rounded-none inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#C8102E]"
            >
              {t.footer.backToTop}
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono uppercase text-stone-900/40 dark:text-stone-50/40 tabular-nums">
          <span>{t.footer.copyright}</span>
          <span>BEKASI, INDONESIA // 2026</span>
        </div>
      </div>
    </footer>
  );
};
