import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PROFILE } from '../../data/profile';
import { Mail, ArrowUpRight, Copy, Check, Github, Linkedin, Instagram } from 'lucide-react';
import { ScrollPull } from '../Motion/ScrollPull';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const socialLinks = [
    { label: 'GitHub', href: PROFILE.github, icon: Github },
    { label: 'LinkedIn', href: PROFILE.linkedin, icon: Linkedin },
    { label: 'Instagram', href: PROFILE.instagram, icon: Instagram },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Index Marker */}
        <ScrollPull displacement={16}>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-medium tracking-[0.2em] uppercase text-stone-900/60 dark:text-stone-50/60">
              {t.contact.sectionNum}
            </span>
          </div>
        </ScrollPull>

        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Main Inquiry Column */}
          <div className="col-span-12 lg:col-span-7">
            <ScrollPull delay={0.05} displacement={20}>
              <h2
                id="contact-title"
                className="text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-tight text-stone-900 dark:text-stone-50 leading-[1.05] text-balance"
              >
                {t.contact.headline}
              </h2>

              <p className="mt-6 text-base sm:text-lg font-normal leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[55ch] text-pretty">
                {t.contact.lead}
              </p>
            </ScrollPull>

            {/* CTAs */}
            <ScrollPull delay={0.1} displacement={20}>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${PROFILE.email}?subject=Discussion%20/%20Project%20Inquiry`}
                  id="contact-email-cta-btn"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[44px] bg-[#C8102E] text-white hover:bg-[#A00D24] transition-colors text-xs font-mono font-medium tracking-wider uppercase rounded-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8102E]"
                >
                  <Mail size={15} />
                  <span>{t.contact.ctaButton}</span>
                  <ArrowUpRight size={15} />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  id="copy-email-btn"
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors text-xs font-mono font-medium tracking-wider uppercase rounded-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C8102E]"
                >
                  {copied ? (
                    <>
                      <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {t.contact.copySuccess}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>{t.contact.copyEmail}</span>
                    </>
                  )}
                </button>
              </div>
            </ScrollPull>
          </div>

          {/* Social Channels & Technical Coordinates */}
          <div className="col-span-12 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 pt-8 lg:pt-0 lg:pl-12">
            <ScrollPull delay={0.15} displacement={20}>
              <h3 className="text-xs font-mono font-medium uppercase tracking-[0.15em] text-stone-900/50 dark:text-stone-50/50 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C8102E]" />
                {t.contact.linksHeading}
              </h3>

              <div className="divide-y divide-stone-200 dark:divide-stone-800">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 flex items-center justify-between text-stone-900 dark:text-stone-50 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors group min-h-[44px]"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-stone-900/60 dark:text-stone-50/60 group-hover:text-[#C8102E] transition-colors" />
                        <span className="text-sm font-normal uppercase tracking-tight font-mono">{item.label}</span>
                      </div>
                      <ArrowUpRight size={14} className="text-stone-900/40 dark:text-stone-50/40 group-hover:text-[#C8102E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  );
                })}

                {/* Direct email display */}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="py-4 flex items-center justify-between text-stone-900 dark:text-stone-50 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors group min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-stone-900/60 dark:text-stone-50/60 group-hover:text-[#C8102E] transition-colors" />
                    <span className="text-xs sm:text-sm font-mono truncate max-w-[60vw] sm:max-w-[240px]">
                      {PROFILE.email}
                    </span>
                  </div>
                  <ArrowUpRight size={14} className="text-stone-900/40 dark:text-stone-50/40 group-hover:text-[#C8102E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </ScrollPull>
          </div>
        </div>
      </div>
    </section>
  );
};
