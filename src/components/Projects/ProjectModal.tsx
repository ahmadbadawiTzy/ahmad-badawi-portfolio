import React, { useEffect } from 'react';
import { Project } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { X, Github, ExternalLink, Cpu } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 relative text-stone-900 dark:text-stone-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#C8102E]" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-900/60 dark:text-stone-50/60 font-medium">
              SYS // SPECIFICATION: {project.number}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.work.closeModal}
            className="p-1.5 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-50 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Title */}
        <div className="mb-4">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase block mb-1 text-stone-900/50 dark:text-stone-50/50">
            SYS // SPECIFICATION {project.number} • {project.category.toUpperCase()}
          </span>
          <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-stone-900 dark:text-stone-50">
            {project.title}
          </h3>
          <p className="mt-2 text-sm sm:text-base font-normal text-stone-900/70 dark:text-stone-50/70 leading-relaxed">
            {project.description[language]}
          </p>
        </div>

        {/* Technical Evidence Badges */}
        {project.evidence && project.evidence.length > 0 && (
          <div className="my-5 p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-900/50 dark:text-stone-50/50 font-medium block mb-2.5">
              {t.work.evidenceLabel}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {project.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="px-2.5 py-2 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 font-mono text-[11px] font-medium tracking-tight text-center flex items-center justify-center text-stone-900 dark:text-stone-50"
                >
                  {ev}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Note */}
        <div className="my-5 p-4 border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider font-medium mb-2 text-stone-900/70 dark:text-stone-50/70">
            <Cpu size={14} className="text-[#C8102E]" />
            <span>{t.work.architectureLabel}</span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-stone-900/80 dark:text-stone-50/80 leading-relaxed">
            {project.architecture[language]}
          </p>
        </div>

        {/* Engineering Takeaways */}
        <div className="mb-6">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-900/50 dark:text-stone-50/50 mb-3 font-medium">
            {t.work.detailsLabel}
          </h4>
          <ul className="space-y-2 text-sm text-stone-900/80 dark:text-stone-50/80">
            {project.details[language].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-xs text-stone-900/40 dark:text-stone-50/40 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-8 pt-4 border-t border-stone-200 dark:border-stone-800">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone-900/50 dark:text-stone-50/50 mb-2 font-medium">
            {t.work.techStackLabel}
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[10px] font-mono uppercase border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-900/80 dark:text-stone-50/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] text-[10px] font-medium font-mono tracking-widest uppercase bg-[#C8102E] text-white hover:bg-[#A00D24] transition-colors rounded-none"
          >
            <Github size={14} />
            <span>{t.work.viewCode}</span>
          </a>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 min-h-[44px] text-[10px] font-medium font-mono tracking-widest uppercase border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-50 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors rounded-none"
            >
              <ExternalLink size={14} />
              <span>{t.work.liveDemo}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
