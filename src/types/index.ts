export type Language = 'id' | 'en';
export type Theme = 'light' | 'dark';

export interface Project {
  id: string;
  number: string;
  title: string;
  description: {
    id: string;
    en: string;
  };
  classification: {
    id: string;
    en: string;
  };
  accentColor: {
    text: string;
    darkText: string;
    dot: string;
    darkDot: string;
  };
  details?: {
    id: string[];
    en: string[];
  };
  techStack?: string[];
  architecture?: {
    id: string;
    en: string;
  };
  githubUrl: string;
  demoUrl?: string;
  category?: 'system' | 'web' | 'tool' | 'algorithm' | 'machine-learning' | 'fullstack';
  evidence?: string[];
  metrics?: { label: string; value: string }[];
}

export interface EducationItem {
  period: string;
  institution: string;
  degree: {
    id: string;
    en: string;
  };
  location: string;
  details: {
    id: string;
    en: string;
  };
}

export interface ApproachStep {
  number: string;
  title: {
    id: string;
    en: string;
  };
  description: {
    id: string;
    en: string;
  };
}
