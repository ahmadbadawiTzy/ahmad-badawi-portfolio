import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Scroll Progress Timeline (from Skills-main scroll-progress-timeline)
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['hero', 'about', 'skills', 'journey', 'work', 'contact'];
          const scrollPos = window.scrollY + 200;

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(sectionId);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'about', label: t.nav.about, href: '#about' },
    { id: 'skills', label: t.nav.skills, href: '#skills' },
    { id: 'journey', label: t.nav.journey, href: '#journey' },
    { id: 'work', label: t.nav.work, href: '#work' },
    { id: 'contact', label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 relative">
      {/* Scroll Progress Timeline Rail (from Skills-main scroll-progress-timeline) */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C8102E] origin-left pointer-events-none z-10"
          style={{ scaleX }}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-0">
        {/* Brand */}
        <a
          href="#hero"
          id="navbar-brand-link"
          className="flex items-center gap-2.5 text-stone-900 dark:text-stone-50 group focus-visible:ring-2 focus-visible:ring-stone-900 dark:focus-visible:ring-stone-50 py-2 min-w-0"
        >
          <span className="w-2 h-2 bg-[#C8102E] transition-transform group-hover:scale-125 shrink-0" />
          <span className="text-sm font-medium tracking-widest uppercase truncate">
            {t.nav.name}
          </span>
          <span className="text-[11px] font-mono text-stone-900/40 dark:text-stone-50/40 hidden sm:inline tracking-wider shrink-0">
            / 2026
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                id={`nav-link-${link.id}`}
                className={`transition-colors py-2 ${
                  isActive
                    ? 'text-[#C8102E] font-medium'
                    : 'text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            id="lang-toggle-btn"
            aria-label={t.nav.languageLabel}
            className="flex items-center justify-center text-[11px] font-mono font-medium tracking-widest uppercase px-2.5 sm:px-3 py-2 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-50 transition-colors cursor-pointer min-h-[44px] min-w-[52px] sm:min-w-[54px]"
          >
            <span className={language === 'id' ? 'text-stone-900 dark:text-stone-50' : 'text-stone-900/30 dark:text-stone-50/30'}>
              ID
            </span>
            <span className="mx-1 text-stone-900/30 dark:text-stone-50/30">/</span>
            <span className={language === 'en' ? 'text-stone-900 dark:text-stone-50' : 'text-stone-900/30 dark:text-stone-50/30'}>
              EN
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label={t.nav.themeLabel}
            className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-medium tracking-widest uppercase px-2.5 sm:px-3 py-2 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-50 transition-colors cursor-pointer min-h-[44px] min-w-[48px] sm:min-w-[54px] text-stone-900 dark:text-stone-50"
          >
            <Sun size={13} className="text-current" />
            <span className="hidden sm:inline">
              {theme === 'light' ? t.nav.light : t.nav.dark}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            aria-label={mobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            className="md:hidden p-2 sm:p-2.5 text-stone-900 dark:text-stone-50 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 sm:px-8 py-6"
        >
          <div className="flex flex-col gap-0 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 border-b border-stone-200 dark:border-stone-800 text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
