import { Project } from '../types';
import { SOCIAL_LINKS } from './socialLinks';

/**
 * Centralized Single Source of Truth for Project Repositories & Profile
 *
 * Strict constraint: Do NOT duplicate or hardcode project URLs across UI components.
 */

export const GITHUB_PROFILE_URL = SOCIAL_LINKS.github.url;

export const FEATURED_PROJECTS: Project[] = [
  {
    id: 'hand-gesture-perkenalan',
    number: '01',
    title: 'HAND GESTURE PERKENALAN',
    category: 'system',
    description: {
      id: 'Proyek interaksi real-time menggunakan computer vision untuk mendeteksi gestur tangan dan memicu interaksi perkenalan interaktif.',
      en: 'Real-time computer vision interaction project detecting hand gestures to trigger interactive introductory experiences.',
    },
    classification: {
      id: 'Computer Vision / Gesture Interaction',
      en: 'Computer Vision / Gesture Interaction',
    },
    accentColor: {
      text: 'text-[#047857]',
      darkText: 'dark:text-[#34D399]',
      dot: 'bg-[#047857]',
      darkDot: 'dark:bg-[#34D399]',
    },
    details: {
      id: [
        'Melacak 21 titik koordinat spasial tangan secara real-time via webcam dengan framework MediaPipe.',
        'Mengklasifikasikan gestur tangan untuk memicu respons visual dan audio perkenalan dinamis.',
        'Mengoptimalkan pengolahan frame buffer berbasis NumPy untuk menjaga performa konsisten 30+ FPS.',
      ],
      en: [
        'Tracks 21 spatial hand landmark coordinates in real time via webcam feed using MediaPipe.',
        'Classifies hand gestures to trigger dynamic interactive visual and introductory responses.',
        'Optimizes frame buffer operations with NumPy to sustain steady 30+ FPS throughput on standard hardware.',
      ],
    },
    techStack: ['Python', 'MediaPipe', 'OpenCV', 'NumPy'],
    architecture: {
      id: 'Pipeline inferensi visi komputer berlatensi rendah yang memetakan koordinat landmark tangan ke antarmuka interaktif.',
      en: 'Low-latency computer vision inference pipeline mapping hand landmark coordinates to reactive interactive states.',
    },
    githubUrl: 'https://github.com/ahmadbadawiTzy/handgestureperkenalan',
    evidence: [
      'REAL-TIME VISION',
      '21 HAND LANDMARKS',
      '30+ FPS PIPELINE',
      'INTERACTIVE LOGIC',
    ],
    metrics: [
      { label: 'TRACKING', value: '21 LANDMARKS' },
      { label: 'THROUGHPUT', value: '30+ FPS' },
      { label: 'STACK', value: 'MEDIAPIPE + OPENCV' },
      { label: 'DOMAIN', value: 'COMPUTER VISION' },
    ],
  },
  {
    id: 'banana-ripeness-ai',
    number: '02',
    title: 'BANANA RIPENESS AI',
    category: 'machine-learning',
    description: {
      id: 'Sistem kecerdasan buatan berbasis machine learning untuk mengklasifikasikan tingkat kematangan buah pisang berdasarkan ekstraksi fitur citra.',
      en: 'Machine learning system classifying banana ripeness stages through structured computer vision feature extraction.',
    },
    classification: {
      id: 'Machine Learning / Image Classification',
      en: 'Machine Learning / Image Classification',
    },
    accentColor: {
      text: 'text-[#C8102E]',
      darkText: 'dark:text-[#EF4444]',
      dot: 'bg-[#C8102E]',
      darkDot: 'dark:bg-[#EF4444]',
    },
    details: {
      id: [
        'Ekstraksi fitur warna multi-ruang (RGB, HSV, Lab) untuk menangkap perubahan pigmen kematangan pisang.',
        'Pelatihan model klasifikasi ensemble HistGradientBoosting dengan akurasi pengujian 93.68% dan Macro F1 0.9313.',
        'Inferensi efisien berkecepatan 20.31 ms per sampel tanpa memerlukan akselerator GPU berat.',
      ],
      en: [
        'Multi-space color feature extraction (RGB, HSV, Lab) capturing ripeness pigment transitions.',
        'Trained HistGradientBoosting ensemble classification model achieving 93.68% test accuracy and 0.9313 Macro F1.',
        'Lightweight inference latency of 20.31 ms per sample designed for CPU execution without heavy GPU requirements.',
      ],
    },
    techStack: ['Python', 'Scikit-learn', 'Computer Vision', 'HistGradientBoosting'],
    architecture: {
      id: 'Pipeline ekstraksi fitur citra terarah dipadukan dengan ensemble tree gradient boosting untuk inferensi klasifikasi cepat.',
      en: 'Deterministic color-space feature extraction pipeline paired with gradient-boosted decision trees for low-latency classification.',
    },
    githubUrl: 'https://github.com/ahmadbadawiTzy/Banana-Ripeness-AI',
    evidence: [
      '93.68% ACCURACY',
      '0.9313 MACRO F1',
      '20.31 MS LATENCY',
      'LIGHTWEIGHT CPU',
    ],
    metrics: [
      { label: 'ACCURACY', value: '93.68%' },
      { label: 'MACRO F1', value: '0.9313' },
      { label: 'LATENCY', value: '20.31 MS' },
      { label: 'ENGINE', value: 'SCIKIT-LEARN' },
    ],
  },
  {
    id: 'puzzle-photo',
    number: '03',
    title: 'PUZZLE PHOTO',
    category: 'web',
    description: {
      id: 'Aplikasi web interaktif permainan teka-teki foto berbasis algoritma manipulasi citra kanvas dan logika penyusunan ubin (sliding/tile puzzle).',
      en: 'Interactive web puzzle application featuring canvas image slicing algorithms and stateful tile matrix logic.',
    },
    classification: {
      id: 'Interactive Web / Algorithmic Logic',
      en: 'Interactive Web / Algorithmic Logic',
    },
    accentColor: {
      text: 'text-[#1D4ED8]',
      darkText: 'dark:text-[#60A5FA]',
      dot: 'bg-[#1D4ED8]',
      darkDot: 'dark:bg-[#60A5FA]',
    },
    details: {
      id: [
        'Algoritma pemotongan matriks citra dinamis pada kanvas web dengan resolusi adaptif.',
        'Pengelolaan state permainan reaktif, validasi keterpecahan puzzle (solvability check), dan deteksi kondisi kemenangan real-time.',
        'Antarmuka interaktif responsif dengan transisi ubin halus dan penanganan sentuhan mobile.',
      ],
      en: [
        'Dynamic image matrix slicing algorithms on HTML5 Canvas with adaptive viewport resolution.',
        'Reactive game state management with mathematical puzzle solvability validation and win-condition detection.',
        'Responsive interactive user interface with smooth tile transitions and touch interaction support.',
      ],
    },
    techStack: ['JavaScript', 'TypeScript', 'HTML5 Canvas', 'CSS3 / Tailwind'],
    architecture: {
      id: 'Komponen web reaktif memadukan render kanvas 2D modular dengan state machine logika puzzle berkinerja tinggi.',
      en: 'Modular 2D canvas rendering coupled with deterministic puzzle state-machine logic for lightweight interactive execution.',
    },
    githubUrl: 'https://github.com/ahmadbadawiTzy/puzzle-photo',
    evidence: [
      'CANVAS SLICING',
      'SOLVABILITY CHECK',
      'TOUCH INTERACTION',
      'RESPONSIVE UI',
    ],
    metrics: [
      { label: 'ENGINE', value: 'HTML5 CANVAS' },
      { label: 'LOGIC', value: 'SOLVABILITY VALIDATED' },
      { label: 'PERFORMANCE', value: '60 FPS ANIMATION' },
      { label: 'DEVICE', value: 'DESKTOP & MOBILE' },
    ],
  },
];

export const PROJECTS: Project[] = FEATURED_PROJECTS;
