# Ahmad Badawi — Portofolio Developer

Portofolio personal single-page untuk **Ahmad Badawi**, Software Developer berbasis di Bekasi, Indonesia. Halaman berjalan melalui Hero → About → Skills → Journey → Projects → Contact, dengan kartu identitas lanyard 3D interaktif dan potret WebGL *liquid reveal* sebagai fokus visual utama.

React 19 · TypeScript · Vite · Tailwind CSS v4 · Three.js / React Three Fiber / Rapier · Motion. Hasil build adalah SPA statis sepenuhnya — semua konten di-bundle saat build, tanpa backend atau database.

## Fitur

- Splash screen intro — hanya sekali per sesi, bisa dilewati, bisa dibypass dengan `?nosplash`, dan tidak muncul saat reduced motion aktif
- Tema terang / gelap dengan deteksi preferensi sistem dan persistensi `localStorage`
- Lokalisasi Indonesia / Inggris (default `id`), juga disimpan
- Navbar lengket dengan pelacakan section aktif, menu mobile, dan rel progres scroll tipis
- Hero dengan *liquid reveal* GLSL kustom berbasis input pointer, komposisi responsif desktop / mobile, dan fallback statis
- Section About dengan lanyard 3D bertenaga fisika: seret, klik untuk membalik, balik via keyboard
- Grid skill dikelompokkan menjadi Languages / Web / Database / Tools
- Timeline Journey (progres pendidikan)
- Showcase proyek — tiga repositori unggulan dengan stack, catatan arsitektur, dan metrik
- Kontak via CTA `mailto:`, salin email ke clipboard, dan tautan sosial
- Animasi yang menghormati `prefers-reduced-motion` di CSS, animasi scroll, splash, dan hero
- Error boundary di root aplikasi dan di sekitar subsystem 3D

## Tech Stack

| Lapisan | Pilihan |
| --- | --- |
| UI | React `^19.0.1`, React DOM `^19.0.1` |
| Bahasa | TypeScript `~5.8.2` (strict, type-check saat build) |
| Build | Vite `^6.2.3`, `@vitejs/plugin-react` `^5.0.4` |
| Styling | Tailwind CSS `^4.1.14` via `@tailwindcss/vite`, design token kustom di `src/index.css` |
| 3D | three `^0.185.1`, `@react-three/fiber` `^9.7.0`, `@react-three/rapier` `^2.2.0`, `meshline` `^3.3.1` |
| Animasi | motion `^12.23.24` |
| Ikon | lucide-react `^0.546.0` |
| Hosting | Vercel (`vercel.json` — preset framework Vite + security headers) |

Dideklarasikan tapi belum dipakai: `@react-three/drei` (lihat [Keterbatasan yang Diketahui](#keterbatasan-yang-diketahui)).

## Struktur Proyek

```
src/
├── App.tsx                  Urutan section, provider, error boundary
├── main.tsx                 Entry point
├── index.css                Import Tailwind v4, design token, aturan reduced-motion
├── assets/images/           Gambar potret (profile1.webp, profile4.png)
├── components/
│   ├── SplashScreen/        Urutan intro (per sesi, bisa dilewati)
│   ├── Navbar/              Nav lengket, section aktif, progres scroll
│   ├── Hero/                Layout hero + HeroVisual (liquid reveal WebGL)
│   ├── About/               Konten About + Lanyard/ (kartu identitas fisika)
│   │   └── Lanyard/         Lanyard3D, Scene, Physics, Card, Strap, types
│   ├── Technologies/        Grid skill
│   ├── Journey/             Timeline pendidikan
│   ├── Projects/            Showcase proyek
│   ├── Contact/             CTA dan kanal kontak
│   ├── Footer/              Footer + kembali ke atas
│   ├── Motion/ScrollPull    Transform scroll-linked sadar-kecepatan
│   └── Common/ErrorBoundary UI fallback aman-produksi
├── context/                 ThemeContext, LanguageContext
├── data/                    profile, projects, socialLinks, translations
└── types/                   Interface bersama (Project, EducationItem, …)
public/favicon.svg
index.html                   Shell statis (lang="id", Google Fonts, preconnect)
vite.config.ts               Plugin, alias '@', chunking, header dev/preview
vercel.json                  Preset framework + security headers produksi
```

## Implementasi Kunci

**Hero liquid reveal** (`src/components/Hero/HeroVisual.tsx`) — scene Three.js mentah pada quad ortografis fullscreen dengan fragment shader kustom. Dua render target saling bertukar (*ping-pong*) tekstur frame sebelumnya, sehingga gerakan pointer menyapu gambar dan mengendap kembali dalam waktu decay terkendali. Seluruh state per-frame disimpan di ref, jadi animasi tidak pernah memicu re-render React. Loop rAF dijeda saat section keluar viewport (`IntersectionObserver`) atau tab tersembunyi (`visibilitychange`). Saat `prefers-reduced-motion` aktif, WebGL tidak pernah diinisialisasi; kegagalan pembuatan konteks men-set `hasWebGLFallback` dan komposisi statis yang dirender.

**Lanyard 3D** (`src/components/About/Lanyard/`) — simulasi rigid-body Rapier dengan rantai joint tali yang menggantungkan kartu pada strap (`meshline`). Kartu menerima seret pointer, klik-untuk-balik, dan balik via keyboard untuk aksesibilitas; tekstur digambar prosedural di canvas, sehingga tidak ada aset biner yang dimuat. Di-*code-split* dengan `React.lazy` dan dibungkus `ErrorBoundary` yang terdegradasi menjadi blok placeholder.

**Animasi scroll** (`src/components/Motion/ScrollPull.tsx`) — transform scroll-linked sadar-kecepatan untuk visual section, dengan intensitas gerakan dihilangkan saat reduced motion diminta.

**Kontak** (`src/components/Contact/Contact.tsx`) — membuka klien email pengguna via `mailto:`, menyediakan salin alamat ke clipboard, dan merender tautan keluar dari `src/data/socialLinks.ts`. Tidak ada form dan tidak ada route API.

**Tema & lokalisasi** (`src/context/`) — tema: `localStorage` → `prefers-color-scheme` → terang; bahasa: `localStorage` → `id`. Keduanya menulis ke `localStorage` dan memperbarui root dokumen / `<html lang>`.

## Proyek Unggulan

| # | Proyek | Jenis | Stack |
| --- | --- | --- | --- |
| 01 | [Hand Gesture Perkenalan](https://github.com/ahmadbadawiTzy/handgestureperkenalan) | system | Python, MediaPipe, OpenCV, NumPy |
| 02 | [Banana Ripeness AI](https://github.com/ahmadbadawiTzy/Banana-Ripeness-AI) | machine-learning | Python, Scikit-learn, Computer Vision, HistGradientBoosting |
| 03 | [Puzzle Photo](https://github.com/ahmadbadawiTzy/puzzle-photo) | web | JavaScript, TypeScript, HTML5 Canvas, Tailwind |

Konten ada di `src/data/projects.ts`; ubah file tersebut untuk mengubah showcase.

## Memulai

**Prasyarat:** Node.js dan npm.

```bash
git clone https://github.com/ahmadbadawiTzy/ahmad-badawi-portfolio.git
cd ahmad-badawi-portfolio
npm install
npm run dev
```

Server dev berjalan di [http://localhost:3000](http://localhost:3000).

## Variabel Lingkungan

Tidak ada yang dibutuhkan — situs ini SPA statis dan `.env.example` menjelaskannya. Jika kamu menambahkan nanti, nilai yang terekspos ke browser harus memakai prefix `VITE_`; rahasia khusus server tidak boleh memakainya.

## Skrip

| Perintah | Fungsinya |
| --- | --- |
| `npm run dev` | Server dev di port 3000, terikat ke `0.0.0.0` |
| `npm run build` | Type-check (`tsc --noEmit`) lalu `vite build` → `dist/` |
| `npm run preview` | Menyajikan build produksi secara lokal |
| `npm run lint` | Type-check saja (repo ini tidak punya konfigurasi ESLint) |
| `npm run clean` | Hapus `dist/` |

## Deployment

`vercel.json` mendeklarasikan preset framework Vite, sehingga Vercel otomatis memakai perintah default `npm run build` dan direktori output `dist/`. File itu juga menerapkan security headers produksi ke semua route:

`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · `Strict-Transport-Security` (2 tahun, includeSubDomains, preload)

Header yang sama (tanpa HSTS) juga disetel untuk server dev dan preview lokal di `vite.config.ts`.

## Filosofi Desain

Swiss International Style: grid adalah struktur, whitespace itu disengaja, dan hierarki tipografi yang membawa layout. Satu warna aksen — crimson `#C8102E` — dipakai hemat di atas skala netral stone hangat (`#fafaf9` → `#0c0a09`). Teks display memakai sans geometris; teks isi memakai sans humanis agar mudah dibaca. Gerakan hanya untuk transisi scroll-linked sadar-kecepatan yang tidak pernah mengganggu grid.

## Performa & Aksesibilitas

- Vendor dipecah menjadi chunk bernama (`three-core`, `three-r3f`, `motion`, `icons`, `react-vendor`) di `vite.config.ts`
- Pekerjaan 3D dimuat malas dan dijeda saat di luar layar / tab tersembunyi; device pixel ratio dibatasi
- Listener scroll di-throttle `requestAnimationFrame`; state animasi pointer dijauhkan dari React
- `prefers-reduced-motion` dihormati di CSS, di Motion, di splash screen, dan di hero
- Pelabelan `aria-*` pada visual interaktif, cincin `focus-visible` terlihat, target sentuh `min-h-[44px]`, kontrol lanyard yang bisa dioperasikan keyboard, dan splash screen yang bisa dilewati dengan klik atau `Space`

## Keterbatasan yang Diketahui

- Tidak ada test otomatis — `npm run lint` hanya type-check; tidak ada test runner
- `@react-three/drei` dideklarasikan di `package.json` tapi tidak pernah diimpor (pakai, atau hapus dependensinya)
- Flag kemampuan WebGL lanyard di-hardcode `true`, sehingga cabang statisnya tidak pernah tercapai — `ErrorBoundary` yang jadi penjaganya
- Prop `isVisible` lanyard dari `IntersectionObserver`-nya sudah diteruskan tapi tidak diterapkan ke frameloop canvas, jadi ia tetap merender saat di luar layar
- Chunk vendor `three-r3f` sekitar 2,4 MB setelah minify (~892 kB gzip) dan Vite menandainya melewati ambang peringatan 500 kB — wajar untuk portofolio, tapi ini lever performa terbesar yang tersisa
- Font dimuat dari Google Fonts, bukan di-*self-host*
- Tidak ada form kontak atau pengiriman email — kontak memang berbasis `mailto:`
- Tidak ada auth, database, atau route API

## Status

Dalam pengembangan aktif. Commit terakhir menyiapkan proyek untuk deployment produksi Vercel; build lokal lulus type-check dan build bersih (`npm run lint && npm run build`).
