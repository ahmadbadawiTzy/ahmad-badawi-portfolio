import { Project, EducationItem } from '../types';
import { SOCIAL_LINKS, IDENTITY_DATA } from './socialLinks';
import { PROJECTS as CENTRALIZED_PROJECTS, FEATURED_PROJECTS, GITHUB_PROFILE_URL } from './projects';

export const PROFILE = {
  name: IDENTITY_DATA.name,
  role: IDENTITY_DATA.role,
  email: SOCIAL_LINKS.email.address,
  github: SOCIAL_LINKS.github.url,
  linkedin: SOCIAL_LINKS.linkedin.url,
  instagram: SOCIAL_LINKS.instagram.url,
  location: 'Bekasi, Jawa Barat, Indonesia',
};

export const EDUCATION_LIST: EducationItem[] = [
  {
    period: '2024 — SEKARANG',
    institution: 'Universitas Bina Insani',
    degree: {
      id: 'S1 Sistem Informasi',
      en: 'Bachelor of Information Systems',
    },
    location: 'Bekasi, Indonesia',
    details: {
      id: 'Mempelajari rekayasa perangkat lunak, arsitektur basis data, struktur data, dan analisis sistem informasi.',
      en: 'Studying software engineering, database architecture, data structures, and information system analysis.',
    },
  },
  {
    period: '2021 — 2024',
    institution: 'SMK Teknologi Nasional',
    degree: {
      id: 'Teknik Komputer dan Jaringan',
      en: 'Computer and Network Engineering',
    },
    location: 'Bekasi, Indonesia',
    details: {
      id: 'Fondasi jaringan komputer (TCP/IP, routing, switching), administrasi server Linux, konfigurasi periferal, dan dasar pemrograman.',
      en: 'Foundations in computer networking (TCP/IP, routing, switching), Linux system administration, peripheral configuration, and programming fundamentals.',
    },
  },
];

export const PROJECTS: Project[] = CENTRALIZED_PROJECTS;
export { FEATURED_PROJECTS, GITHUB_PROFILE_URL };

export const TECHNOLOGIES = {
  languages: [
    { name: 'Python', role: 'Data structures, scripting, back-end' },
    { name: 'Java', role: 'Object-oriented programming, core system logic' },
    { name: 'JavaScript', role: 'Web standards, async event loop, client interactivity' },
    { name: 'TypeScript', role: 'Strict typing, robust application architectures' },
    { name: 'PHP', role: 'Server-side scripting, classic web architectures' },
  ],
  web: [
    { name: 'HTML5', role: 'Semantic markup, accessibility hierarchy' },
    { name: 'CSS3 / Tailwind', role: 'Swiss design tokens, responsive layouts, print precision' },
    { name: 'React', role: 'Component lifecycle, reactive state pipelines' },
    { name: 'Next.js', role: 'Server-side rendering, routing, full-stack endpoints' },
    { name: 'Node.js', role: 'Event-driven servers, CLI tooling, stream processing' },
    { name: 'Flutter', role: 'Practical cross-platform mobile application development' },
  ],
  database: [
    { name: 'SQL', role: 'Relational queries, window functions, schema design' },
    { name: 'MySQL', role: 'Normalized relational storage, transactions' },
  ],
  tools: [
    { name: 'Git', role: 'Version control, atomic commits, branching workflows' },
    { name: 'Linux', role: 'Shell scripting, POSIX systems, server daemon management' },
    { name: 'Machine Learning', role: 'Hands-on machine learning workflow project experience' },
    { name: 'YOLO', role: 'Hands-on computer vision and object detection projects' },
  ],
};

