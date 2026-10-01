/**
 * Centralized Single Source of Truth for Social & Contact Links
 *
 * Strict constraint: Do NOT duplicate or hardcode these URLs across UI components.
 */

export interface SocialLink {
  id: 'instagram' | 'linkedin' | 'github' | 'email';
  label: string;
  url: string;
  handle?: string;
}

export const SOCIAL_LINKS = {
  instagram: {
    id: 'instagram' as const,
    label: '@1hmdbdw_',
    url: 'https://www.instagram.com/1hmdbdw_/',
    handle: '@1hmdbdw_',
  },
  linkedin: {
    id: 'linkedin' as const,
    label: 'linkedin.com/in/ahmad-badawi-b87274410',
    url: 'https://www.linkedin.com/in/ahmad-badawi-b87274410/',
    handle: 'ahmad-badawi-b87274410',
  },
  github: {
    id: 'github' as const,
    label: 'github.com/ahmadbadawiTzy',
    url: 'https://github.com/ahmadbadawiTzy',
    handle: 'ahmadbadawiTzy',
  },
  email: {
    id: 'email' as const,
    label: 'ahmadbadawi.biu.si@gmail.com',
    url: 'mailto:ahmadbadawi.biu.si@gmail.com',
    address: 'ahmadbadawi.biu.si@gmail.com',
  },
} as const;

export const SOCIAL_LINKS_LIST: SocialLink[] = [
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.instagram,
  SOCIAL_LINKS.email,
];

export const IDENTITY_DATA = {
  name: 'AHMAD BADAWI',
  role: 'SOFTWARE DEVELOPER',
  institution: 'UNIVERSITAS BINA INSANI',
  degree: 'S1 SISTEM INFORMASI',
  tenure: '2024 — PRESENT',
  location: 'BEKASI, INDONESIA',
  coordinates: "6°14'S 107°00'E",
  idNumber: '2024-UBI',
  version: '2024.1',
  docType: 'DEV-ID',
} as const;
