import { Project, EducationItem, ApproachStep } from '../types';

export const PROFILE = {
  name: 'AHMAD BADAWI',
  role: 'SOFTWARE DEVELOPER',
  email: 'ahmadbadawi.biu.si@gmail.com',
  github: 'https://github.com/ahmadbadawi',
  linkedin: 'https://linkedin.com/in/ahmadbadawi',
  instagram: 'https://instagram.com/ahmadbadawi',
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

export const PROJECTS: Project[] = [
  {
    id: 'ai-financial-manager',
    number: '01',
    title: 'AI Financial Manager',
    category: 'fullstack',
    description: {
      id: 'Aplikasi manajemen keuangan untuk mencatat transaksi dan mengelola data finansial pribadi.',
      en: 'A financial management application for tracking transactions and managing personal financial data.',
    },
    classification: {
      id: 'Software / Web Application',
      en: 'Software / Web Application',
    },
    accentColor: {
      text: 'text-[#C8102E]',
      darkText: 'dark:text-[#EF4444]',
      dot: 'bg-[#C8102E]',
      darkDot: 'dark:bg-[#EF4444]',
    },
    details: {
      id: [
        'Arsitektur full-stack menyeluruh mencakup backend, frontend, database relasional, autentikasi, dan pengujian ketat.',
        'Mengimplementasikan 276/276 pengujian unit & integrasi (pytest) yang lolos tanpa kegagalan.',
        'Autentikasi stateless berbasis token JWT dengan isolasi data pengguna yang ketat antar-sesi.',
        'Pemodelan skema relasional MySQL yang dinormalisasi dengan migrasi skema terkelola melalui Alembic.',
        'Pemrosesan dan kalkulasi data finansial berbasis alur kerja analitik transaksi terverifikasi.',
      ],
      en: [
        'Comprehensive full-stack architecture encompassing backend, frontend, relational database, authentication, and rigorous testing.',
        'Implemented 276/276 unit & integration tests (pytest) passing with zero failures.',
        'Stateless JWT token authentication enforcing strict user data isolation across sessions.',
        'Normalized MySQL relational schema modeling with automated Alembic versioned migrations.',
        'Verified financial data processing and analytical transaction calculation workflows.',
      ],
    },
    techStack: ['FastAPI', 'React', 'TypeScript', 'MySQL', 'JWT', 'Alembic'],
    architecture: {
      id: 'Layanan REST FastAPI terpisah dari frontend React/TypeScript, diamankan via token stateless JWT, isolasi scope basis data multi-pengguna, dan migrasi skema Alembic di MySQL.',
      en: 'FastAPI REST backend decoupled from React/TypeScript client, secured via stateless JWT bearer tokens, isolated multi-user database scoping, and automated Alembic schema migrations on MySQL.',
    },
    githubUrl: 'https://github.com/ahmadbadawi/ai-financial-manager',
    evidence: [
      '276/276 TESTS PASSED',
      'JWT AUTHENTICATION',
      'USER DATA ISOLATION',
      'MYSQL',
    ],
    metrics: [
      { label: 'TEST SUITE', value: '276/276 PASSED' },
      { label: 'SECURITY', value: 'JWT + ISOLATION' },
      { label: 'DATABASE', value: 'MYSQL + ALEMBIC' },
      { label: 'ARCHITECTURE', value: 'FASTAPI + REACT' },
    ],
  },
  {
    id: 'banana-ripeness-classification',
    number: '02',
    title: 'Banana Ripeness Classification',
    category: 'machine-learning',
    description: {
      id: 'Proyek machine learning yang mengklasifikasikan kematangan pisang menggunakan fitur berbasis warna.',
      en: 'A machine learning project that classifies banana ripeness using color-based features.',
    },
    classification: {
      id: 'Machine Learning / Computer Vision',
      en: 'Machine Learning / Computer Vision',
    },
    accentColor: {
      text: 'text-[#1D4ED8]',
      darkText: 'dark:text-[#60A5FA]',
      dot: 'bg-[#1D4ED8]',
      darkDot: 'dark:bg-[#60A5FA]',
    },
    details: {
      id: [
        'Menggunakan pendekatan machine learning berbasis ekstraksi fitur warna (color-based feature engineering), bukan black-box deep learning.',
        'Mengekstrak distribusi warna lintas ruang warna (RGB, HSV, Lab) untuk membedakan tahapan kematangan secara akurat.',
        'Melatih model HistGradientBoosting yang menghasilkan akurasi pengujian sebesar 93.68% dan Macro F1 0.9313.',
        'Mengoptimalkan latensi inferensi hingga 20.31 ms per sampel sehingga efisien dijalankan di lingkungan CPU tanpa GPU berat.',
      ],
      en: [
        'Utilizes a feature-based machine learning approach (color-based feature engineering) rather than black-box deep learning.',
        'Extracts color distributions across color spaces (RGB, HSV, Lab) to distinguish ripeness stages reliably.',
        'Trained HistGradientBoosting model achieving 93.68% test accuracy and 0.9313 Macro F1 score.',
        'Optimized inference latency down to 20.31 ms per sample, running efficiently on CPU without heavy GPU hardware.',
      ],
    },
    techStack: ['Python', 'Scikit-learn', 'Computer Vision', 'HistGradientBoosting'],
    architecture: {
      id: 'Pipeline ekstraksi fitur warna (RGB/HSV/Lab) dipadukan dengan ensemble decision tree HistGradientBoosting untuk inferensi cepat.',
      en: 'Color-based feature extraction pipeline (RGB/HSV/Lab) coupled with optimized HistGradientBoosting ensemble trees for rapid inference.',
    },
    githubUrl: 'https://github.com/ahmadbadawi/banana-ripeness-classification',
    evidence: [
      '93.68% TEST ACCURACY',
      '0.9313 MACRO F1',
      '20.31 MS INFERENCE',
    ],
    metrics: [
      { label: 'TEST ACCURACY', value: '93.68%' },
      { label: 'MACRO F1 SCORE', value: '0.9313' },
      { label: 'INFERENCE LATENCY', value: '20.31 MS' },
    ],
  },
  {
    id: 'hologram-glitch-band',
    number: '03',
    title: 'Hologram Glitch Band',
    category: 'system',
    description: {
      id: 'Proyek interaksi webcam real-time menggunakan gestur tangan untuk mengontrol efek visual.',
      en: 'A real-time webcam interaction project using hand gestures to control visual effects.',
    },
    classification: {
      id: 'Computer Vision / Interactive System',
      en: 'Computer Vision / Interactive System',
    },
    accentColor: {
      text: 'text-[#047857]',
      darkText: 'dark:text-[#34D399]',
      dot: 'bg-[#047857]',
      darkDot: 'dark:bg-[#34D399]',
    },
    details: {
      id: [
        'Melacak 21 titik koordinat spasial tangan secara real-time via umpan kamera menggunakan framework MediaPipe.',
        'Memetakan gestur dan posisi jari untuk memicu modulasi efek visual glitch hologram dan respons audio sintetis.',
        'Memproses manipulasi matriks citra dan frame buffer dengan operasi vektorisasi NumPy untuk mempertahankan throughput stabil 30+ FPS.',
      ],
      en: [
        'Tracks 21 spatial hand landmark coordinates in real-time through webcam feed using MediaPipe framework.',
        'Maps finger gestures and spatial positions to trigger holographic glitch visual modulations and synthetic responses.',
        'Processes frame buffer and image matrix operations using vectorized NumPy routines to maintain stable 30+ FPS throughput.',
      ],
    },
    techStack: ['Python', 'MediaPipe', 'OpenCV', 'NumPy'],
    architecture: {
      id: 'Pipeline penangkapan frame berlatensi rendah memanfaatkan inferensi landmark tangan MediaPipe dan transformasi matriks NumPy di OpenCV.',
      en: 'Low-latency frame capture pipeline utilizing MediaPipe Hand landmark inference and vectorized NumPy matrix transformations in OpenCV.',
    },
    githubUrl: 'https://github.com/ahmadbadawi/hologram-glitch-band',
    evidence: [
      'REAL-TIME',
      'HAND GESTURE',
      'COMPUTER VISION',
    ],
    metrics: [
      { label: 'PROCESSING', value: 'REAL-TIME (30+ FPS)' },
      { label: 'INPUT', value: 'HAND GESTURE (21 PTS)' },
      { label: 'ENGINE', value: 'COMPUTER VISION' },
    ],
  },
];

export const TECHNOLOGIES = {
  languages: [
    { name: 'Python', role: 'Data structures, scripting, back-end' },
    { name: 'Java', role: 'Object-oriented programming, core system logic' },
    { name: 'JavaScript', role: 'Web standards, async event loop, client interactivity' },
    { name: 'TypeScript', role: 'Strict typing, robust application architectures' },
    { name: 'C++', role: 'Memory management, foundational computer science' },
    { name: 'PHP', role: 'Server-side scripting, classic web architectures' },
  ],
  web: [
    { name: 'HTML5', role: 'Semantic markup, accessibility hierarchy' },
    { name: 'CSS3 / Tailwind', role: 'Swiss design tokens, responsive layouts, print precision' },
    { name: 'React', role: 'Component lifecycle, reactive state pipelines' },
    { name: 'Next.js', role: 'Server-side rendering, routing, full-stack endpoints' },
    { name: 'Node.js', role: 'Event-driven servers, CLI tooling, stream processing' },
  ],
  database: [
    { name: 'SQL', role: 'Relational queries, window functions, schema design' },
    { name: 'MySQL', role: 'Normalized relational storage, transactions' },
    { name: 'MongoDB', role: 'Document-based caching and unstructured datasets' },
  ],
  tools: [
    { name: 'Git', role: 'Version control, atomic commits, branching workflows' },
    { name: 'Linux', role: 'Shell scripting, POSIX systems, server daemon management' },
  ],
};

export const APPROACH_STEPS: ApproachStep[] = [
  {
    number: '01',
    title: {
      id: 'UNDERSTAND',
      en: 'UNDERSTAND',
    },
    description: {
      id: 'Pahami akar masalah, batasan sistem, dan tujuan pengguna sebelum menulis baris kode pertama.',
      en: 'Understand the root problem, system boundaries, and user goals before writing a single line of code.',
    },
  },
  {
    number: '02',
    title: {
      id: 'EXPLORE',
      en: 'EXPLORE',
    },
    description: {
      id: 'Eksplorasi trade-off arsitektur, struktur data, dan pendekatan teknis paling rasional.',
      en: 'Explore architectural trade-offs, data structures, and the most rational technical path.',
    },
  },
  {
    number: '03',
    title: {
      id: 'BUILD',
      en: 'BUILD',
    },
    description: {
      id: 'Bangun kode yang modular, terbaca, dan minim beban kompleksitas yang tidak perlu.',
      en: 'Build modular, readable code that avoids unnecessary engineering overhead.',
    },
  },
  {
    number: '04',
    title: {
      id: 'TEST',
      en: 'TEST',
    },
    description: {
      id: 'Uji skenario batas, identifikasi kemungkinan galat, dan pastikan keandalan operasional.',
      en: 'Test boundary conditions, inspect edge errors, and guarantee operational reliability.',
    },
  },
  {
    number: '05',
    title: {
      id: 'IMPROVE',
      en: 'IMPROVE',
    },
    description: {
      id: 'Refaktor berkelanjutan berdasarkan observasi performa riil dan umpan balik pengguna.',
      en: 'Continuously refactor based on observed real-world performance and constructive feedback.',
    },
  },
];
