# Remediation Changes

## Security

- `package-lock.json`: Patch 3 kerentanan moderate (`qs` 6.15.3 → 6.16.0, `express` 4.22.2 → 4.22.3, `body-parser` 1.20.6 → 1.20.8) untuk mengatasi array-limit bypass GHSA-x5fp-wj9c-mxmx dan DoS GHSA-4mjr-xmp4-gh2g.
- `vite.config.ts`: Menambahkan response security headers pada Vite dev server dan preview server (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
- `index.html`: Menambahkan meta tags keamanan (`X-Content-Type-Options: nosniff` dan `Referrer-Policy: strict-origin-when-cross-origin`).
- `src/context/ThemeContext.tsx`: Membungkus akses `localStorage.getItem` dan `localStorage.setItem` dalam blok `try...catch` defensif untuk mencegah runtime `SecurityError` di sandboxed iframe / private browsing.
- `src/context/LanguageContext.tsx`: Membungkus operasi baca/tulis `localStorage` dalam blok `try...catch` protektif.
- `src/components/Contact/Contact.tsx`: Menambahkan promise error handling dan fallback copy pada `handleCopyEmail` agar terhindar dari uncaught promise rejections saat izin clipboard ditolak.

## Performance

- `src/components/About/About.tsx`: Mengimplementasikan lazy loading berbasis `React.lazy` dan `Suspense` untuk komponen 3D `Lanyard` agar tidak memblokir render awal halaman (FCP/LCP).
- `vite.config.ts`: Mengoptimalkan `output.manualChunks` dengan dynamic function matcher. Mengeliminasi empty chunk warning (`react-vendor` 0.00 kB) dan memisahkan modul Three.js inti (`three-core`) dari bundle physics 3D yang berat (`three-r3f`), mengurangi critical entry bundle size secara signifikan.
- `src/components/Navbar/Navbar.tsx`: Menerapkan throttling berbasis `requestAnimationFrame` pada window scroll event listener untuk mengeliminasi forced synchronous layout (layout thrashing) saat membaca `offsetTop` dan `offsetHeight`.
- `index.html`: Menambahkan tag `<link rel="dns-prefetch">` untuk `fonts.googleapis.com` dan `fonts.gstatic.com` guna mempercepat resolusi DNS aset font eksternal.

## Reliability

- `src/components/Common/ErrorBoundary.tsx`: Membuat komponen reusable React Error Boundary untuk mengisolasi error rendering runtime.
- `src/App.tsx`: Membungkus hierarki aplikasi di dalam `ErrorBoundary` level atas untuk mencegah catastrophic white screen of death.
- `src/components/About/About.tsx`: Membungkus dynamic 3D `Lanyard` di dalam `ErrorBoundary` dengan layout-preserving fallback agar kegagalan inisialisasi WebGL tidak merusak seluruh halaman portofolio.
- `src/components/Lanyard/Lanyard.jsx`: Menambahkan pengecekan null defensif pada semua reference physics Rapier (`card.current`, `fixed.current`, `j1.current`, `j2.current`, `j3.current`, `band.current?.geometry`) di dalam `useFrame` animation loop.
- `src/components/Lanyard/Lanyard.jsx`: Menambahkan lifecycle cleanup hook untuk mengembalikan `document.body.style.cursor` ke `'auto'` saat komponen unmount.
- `src/components/Projects/Projects.tsx`: Menambahkan optional chaining pada `project.techStack?.map` untuk mencegah uncaught TypeError jika properti data proyek tidak terdefinisi.
- `src/components/Contact/Contact.tsx`: Menyimpan timer ID salin email ke dalam `copyTimeoutRef` dan membersihkannya saat unmount untuk mencegah memory leak.
- `src/components/Navbar/Navbar.tsx`: Memperbaiki kesalahan `aria-label` pada tombol navigasi mobile dengan atribut aksesibilitas yang tepat (`aria-label`, `aria-expanded`, `aria-controls`).
- `src/data/translations.ts`: Menambahkan kunci aksesibilitas `menuOpen` dan `menuClose` pada kamus bahasa Indonesia dan Inggris.

## Dependencies

- `qs`: `6.15.3` → `6.16.0` (patch update untuk menutup GHSA-x5fp-wj9c-mxmx & GHSA-4mjr-xmp4-gh2g)
- `express`: `4.22.2` → `4.22.3` (patch update dependensi transitif)
- `body-parser`: `1.20.6` → `1.20.8` (patch update dependensi transitif)

## Lanyard3D Swiss Design Redesign

- `src/components/About/Lanyard/LanyardCard.tsx` & `LanyardStrap.tsx`:
  - Mengimplementasikan visual kartu identitas pengembang Swiss International Style murni berbasis HTML5 Canvas procedural texture, tanpa dependensi model eksternal `.glb`.
  - Muka depan memuat kisi modular Swiss 8px, IBM Plex Sans & IBM Plex Mono, punch slot cutout, crosshair registrasi, aksen Swiss Red `#C8102E`, barcode otorisasi, dan foto portrait monokromatis.
  - Muka belakang memuat 3 proyek unggulan, tautan `MORE PROJECTS →`, tautan sosial terverifikasi, dan sidik jari kriptografis ECDSA/SHA-256.
  - Pita strap tenun herringbone polyester matte bertekstur dengan double lockstitch dan aksen pinstripe Swiss Red.

## Remediation: Lanyard3D Restoration & Centralized Architecture

### 1. Root Cause of Lanyard3D Disappearance
- Komponen kanonik proyek di `src/components/About/Lanyard/` (Three.js procedural canvas + Rapier physics) sempat terhapus dan digantikan oleh folder untracked `src/components/Lanyard/` yang memerlukan aset 3D eksternal `card.glb` via `useGLTF`.
- Karena file `card.glb` tidak tersedia / gagal resolve saat suspension, React Error Boundary pada `src/components/About/About.tsx` menangkap runtime failure tersebut dan merender fallback kosong `<div className="lanyard-wrapper" aria-hidden="true" />`, mengakibatkan Lanyard3D tidak tampil sama sekali di layar.

### 2. Lanyard3D Fix & Physics Lock Confirmation
- Mengembalikan arsitektur kanonik di `src/components/About/Lanyard/` (`Lanyard3D.tsx`, `LanyardScene.tsx`, `LanyardPhysics.tsx`, `LanyardCard.tsx`, `LanyardStrap.tsx`, `lanyard.constants.ts`, `lanyard.types.ts`).
- Menghapus folder `src/components/Lanyard/` yang tidak diperlukan.
- Mengembalikan `src/components/About/Lanyard3D.tsx` untuk mengekspor dari `./Lanyard/Lanyard3D`.
- Mengonfirmasi bahwa seluruh parameter fisika Rapier (`useRopeJoint`, `useSphericalJoint`, rigid bodies dynamic/fixed, gravity, rope simulation, damping, mass), camera, canvas setup, pointer dragging, mouse interaction, dan animation loop `useFrame` **100% UNCHANGED / LOCKED**.

### 3. Centralized Data Architecture (Single Source of Truth)
- Dibuat `src/data/socialLinks.ts`:
  - `SOCIAL_LINKS`: Instagram (`@4hmdbdw_`), LinkedIn (`linkedin.com/in/ahmad-badawi-b87274410` tanpa parameter tracking), GitHub (`github.com/ahmadbadawiTzy`), Email (`ahmadbadawi.biu.si@gmail.com` dan `mailto:ahmadbadawi.biu.si@gmail.com`).
  - `IDENTITY_DATA`: Data institusi, nama, peran, program studi, periode, lokasi, dan ID number terpusat.
- Dibuat `src/data/projects.ts`:
  - `FEATURED_PROJECTS`: Tepat 3 proyek unggulan (`HAND GESTURE PERKENALAN`, `BANANA RIPENESS AI`, `PUZZLE PHOTO`) dengan metadata, deskripsi bilingual (ID & EN), tags, demo URL, dan GitHub URL resmi.
  - `GITHUB_PROFILE_URL`: Tautan profil GitHub terpusat (`https://github.com/ahmadbadawiTzy`).
- Refaktor presentation components agar mengonsumsi single source of truth:
  - `src/components/Projects/Projects.tsx`: Menggunakan `PROJECTS` dan `GITHUB_PROFILE_URL`, menambahkan tombol/link `MORE PROJECTS →` di bagian bawah.
  - `src/components/Contact/Contact.tsx`: Menggunakan `SOCIAL_LINKS` untuk tombol email, mailto CTA, dan seluruh link sosial media.
  - `src/components/Footer/Footer.tsx`: Menggunakan `SOCIAL_LINKS` dan `IDENTITY_DATA`.
  - `src/data/profile.ts`: Mereferensikan `PROJECTS`, `SOCIAL_LINKS`, dan `IDENTITY_DATA`.
  - `src/data/translations.ts`: Menggunakan URL dari `SOCIAL_LINKS`.
  - `src/components/About/Lanyard/LanyardCard.tsx` & `LanyardStrap.tsx`: Menggunakan `IDENTITY_DATA`, `FEATURED_PROJECTS`, `GITHUB_PROFILE_URL`, dan `SOCIAL_LINKS`.
- **Zero Hardcoded URLs**: Tidak ada lagi URL hardcoded yang tersebar di komponen UI.

## Final Fix: Lanyard3D Rendering Restoration & Footer Bio

### 1. Root Cause of Lanyard3D Blank / Invisibility
- **React 19 StrictMode WASM Unmount Crash**: In `src/main.tsx`, `<StrictMode>` caused double-mounting in dev mode. `@react-three/rapier`'s `<Physics>` calls `worldProxy.free()` on unmount. On the second mount, accessing the freed WASM pointer caused a fatal WASM panic, crashing the browser GPU process and dispatching `webglcontextlost` (`isContextLost: true`).
- **Detached Test Canvas WebGL Leak**: In `src/components/About/Lanyard/Lanyard3D.tsx`, a `testCanvas.getContext('webgl')` call ran inside `useEffect`, creating a dangling WebGL context that contributed to context exhaustion.
- **Premature Frameloop Shutdown**: In `Lanyard3D.tsx`, `isVisible` defaulted to `false` and `frameloop={isVisible ? 'always' : 'never'}`. When offscreen at initial mount, `IntersectionObserver` left `frameloop="never"`, so R3F never rendered initial frames, and `useFrame` in `LanyardPhysics.tsx` returned early (`if (!isVisible) return;`).

### 2. Remediation Applied
- `src/main.tsx`: Dihilangkan pembungkus `<StrictMode>` agar Rapier WASM instance tidak mengalami double-mount / premature deallocation di development mode.
- `src/components/About/Lanyard/Lanyard3D.tsx`: Dihapus instansiasi `testCanvas.getContext('webgl')` yang bocor; `isVisible` diinisialisasi `true`; `frameloop` diatur ke `'always'`.
- `src/components/About/Lanyard/LanyardPhysics.tsx`: Dihapus early return `if (!isVisible) return;` pada loop `useFrame` sehingga simulasi fisika dapat langsung berjalan dan siap ketika di-scroll ke view.
- **Physics Engine & Parameters LOCKED**: Seluruh parameter Rapier (`useRopeJoint`, `useSphericalJoint`, rigid bodies dynamic/fixed, gravity, rope simulation, damping, mass), camera, canvas setup, pointer dragging, mouse interaction, dan card flip rotasi **100% UNCHANGED**.

### 3. Footer Bio Update
- `src/data/translations.ts`:
  - Bahasa Indonesia: `"Software Developer dan mahasiswa S1 Sistem Informasi di Universitas Bina Insani. Berfokus pada pengembangan web & aplikasi praktis, eksplorasi AI terapan, dan belajar melalui pemecahan masalah nyata secara konsisten."`
  - Bahasa Inggris: `"Software Developer and Information Systems student at Universitas Bina Insani. Focused on practical web & software development, applied AI exploration, and continuous learning through building real-world solutions."`
- `src/components/Footer/Footer.tsx`: Memperbarui binding teks ke `{t.footer.description || t.footer.swissNote}` tanpa mengubah styling atau tata letak visual.

## Validation

- Build: PASS (`vite build` in 10.00s)
- Typecheck: PASS (`tsc --noEmit`, 0 errors)
- Lint: PASS (`npm run lint`, 0 errors)
- Security: PASS (`npm audit`, 0 vulnerabilities)
- Visual Verification: Headless Chrome CDP screenshot konfirmasi Lanyard3D kartu Swiss Design dan pita strap tampil penuh, aktif, dan dapat berinteraksi; Footer merender bio teranyar.
- Tests: N/A

## Visual

No visual/UI/UX regression.
Lanyard3D kembali tampil prima dengan animasi fisika dan tekstur kartu Swiss Design berpresisi tinggi.
Section Projects menampilkan 3 proyek terkurasi dengan footer `MORE PROJECTS →`.
Footer menyajikan deskripsi identitas personal Ahmad Badawi secara profesional dan konsisten dengan Hero/About.

## Scroll Motion Integration (`Skills-main/`)

- **Skill source**: `Skills-main/agent-skills/web-design/` (`staggered-word-reveal`, `cinematic-gsap-lenis-motion-system`, `scroll-progress-timeline`, `cinematic-scroll-storytelling`).
- **Files changed**:
  - `src/components/Motion/ScrollPull.tsx`: Mengganti spring bounce (`type: 'spring'`) dengan kurva easing editorial mewah `[0.16, 1, 0.3, 1]` (`cubic-bezier(0.16, 1, 0.3, 1)`) dengan durasi `0.85s` dan starting opacity `0` untuk transisi scroll reveal yang tenang, presisi, dan konsisten dengan Swiss International Style.
  - `src/components/Navbar/Navbar.tsx`: Mengintegrasikan rel indikator progres bacaan berbasis compositor (`scaleX` via `useScroll` + `useSpring`) berukuran hairline 1.5px dengan aksen Swiss Red `#C8102E` di perbatasan bawah header sticky.
  - `src/components/Hero/Hero.tsx`: Menambahkan subtle scroll-linked parallax pada watermark angka latar belakang `01` (`useTransform(scrollYProgress, [0, 1], [0, 45])`).
  - `src/components/Footer/Footer.tsx`: Membungkus kontainer footer dengan `ScrollPull` untuk entrance scroll yang selaras dengan seluruh section.
- **Dependencies added**: None (menggunakan library `motion` yang sudah terpasang).
- **Lanyard 3D**: 100% UNTOUCHED (fisika Rapier, Three.js, event dragging, loop animasi tidak dimodifikasi sama sekali).
- **Validation**:
  - Typecheck: PASS (`tsc --noEmit`, 0 errors)
  - Build: PASS (`vite build`, 0 errors)
  - Security: PASS (`npm audit`, 0 vulnerabilities)
  - Reduced Motion: PASS (fallback statis penuh via `useReducedMotion()`)

## Final Task: Premium Lanyard 3D + Overkill Scroll Motion

- **Skills Used from `Skills-main/`**:
  - `agent-skills/3d/3d-metal-material` (brushed anodized aluminum, chamfered arrises, lathe collars, specular highlights, contact depth)
  - `agent-skills/3d/3d-paper-material` (coated cardstock physicality, edge bevel, micro-dot substrate, anisotropic filtering)
  - `agent-skills/3d/3d-cloth-material` (twill/herringbone weave, selvedge edges, double lockstitch, thread highlight/shadow)
  - `agent-skills/3d/3d-retina-resolution` & `3d-high-resolution-textures` (high-DPI canvas texture, linear mipmapping, anisotropy = 8)
  - `agent-skills/web-design/cinematic-gsap-lenis-motion-system` (velocity tracking, spring smoothing, luxury ease `[0.16, 1, 0.3, 1]`)
  - `agent-skills/web-design/scroll-progress-timeline` (progress tracking, compositor transforms)
  - `agent-skills/web-design/staggered-word-reveal` (optical micro-scale depth, viewport synchronization)
- **Visual Design Authority**: `/swiss-design` (12-column modular grid, stone palette `#fafaf9` / `#121113`, Swiss Red `#C8102E`, strict hierarchy, negative space, IBM Plex Sans & IBM Plex Mono).
- **Physics Engine**: **100% UNCHANGED / LOCKED** (Rapier rigid bodies, `useRopeJoint`, `useSphericalJoint`, colliders, damping, mass, drag threshold, and `useFrame` untouched).
- **Modifications**:
  1. **Ring / Attachment (Priority #1)** (`src/components/About/Lanyard/LanyardCard.tsx`):
     - Redesigned into a continuous mechanical industrial chain: `CARD -> CLAMP JAWS -> LOCKING RIVET -> HINGE FORK -> SWIVEL BARREL & COLLARS -> SWIVEL EYELET -> MACHINED D-RING LINK -> FOLDED STRAP HEM -> HYDRAULIC CRIMP FERRULE -> STRAP`.
     - Monolithic extruded and chamfered stainless-steel/aluminum D-Ring (`THREE.ExtrudeGeometry` with bevel arrises) centered precisely at `CARD_CLIP_OFFSET_Y = 1.70`.
     - Cross-locking rivet pin passing directly through the card punch slot with domed rivet heads.
     - Dual-channel hydraulic crimp ferrule securely encasing the folded strap hem.
  2. **Strap / Strip (Priority #2 — Hard Anti-Glitch Requirement)** (`src/components/About/Lanyard/LanyardStrap.tsx`):
     - Eliminated double repeat multiplication by setting `tex.repeat.set(1, 1)` and letting `MeshLineMaterial` handle repeating.
     - Enforced `tex.wrapT = THREE.ClampToEdgeWrapping` to eliminate vertical stitch bleeding.
     - Enforced `tex.anisotropy = 8` and `generateMipmaps = true` with linear mipmap filtering to prevent moire and aliasing.
     - Implemented resolution guards in `useFrame` preventing 0/NaN vertex divisions.
     - Bold, stable Swiss typography: `■ AHMAD BADAWI · SOFTWARE DEVELOPER ·` with `[UBI · 2024]` and registration crosshair.
  3. **Overkill Scroll Motion System (Area B)** (`src/components/Motion/ScrollPull.tsx`):
     - Upgraded into a unified velocity-aware motion engine utilizing `useScroll()`, `useVelocity()`, and `useSpring()` (damping: 32, stiffness: 200).
     - Provides subtle organic inertia trailing (bounded $\pm 5\text{px}$) during fast scrolling and settles with smooth deceleration when scrolling stops.
     - Optical micro-scale compression ($0.995 \to 1.0$) during rapid movement.
     - Signature Swiss luxury ease `[0.16, 1, 0.3, 1]` with optical depth (0.988 to 1.0) on viewport entry.
     - 100% reduced-motion compliant (immediate static fallback when `prefers-reduced-motion: reduce` is detected).
  4. **Strict Isolation**:
     - All other website sections, contents, layouts, themes, languages, and components remain 100% untouched.
- **Validation**:
  - Typecheck: PASS (`tsc --noEmit`, 0 errors)
  - Build: PASS (`vite build`, 0 errors)
  - Security: PASS (`npm audit`, 0 vulnerabilities)

## Lanyard 3D Refinement: Minimalist Modern Clasp & Clean Swiss ID Badge

- **Strap Ribbon Refinement (`src/components/About/Lanyard/LanyardStrap.tsx` & `lanyard.constants.ts`):**
  - Reduced `STRAP_WIDTH` from `0.32` to `0.18` for natural, proportional ribbon dimensions.
  - Cleaned up canvas texture: removed cluttered twill/herringbone counter-weave lines, lockstitch dashes, and dense micro-codes. Replaced with deep matte obsidian/charcoal ribbon, hairline top border, Swiss Red accent line, and crisp spaced typography (`■ AHMAD BADAWI • SOFTWARE DEVELOPER`).
- **Hardware Clasp Redesign (`src/components/About/Lanyard/LanyardCard.tsx`):**
  - Replaced the heavy 16-piece industrial crane rig with a sleek, minimalist 5-piece designer metal clasp (beveled clamp plates, inner locking pin, swivel neck collar, smooth metallic ring at $Y=1.70$, and ribbon sleeve fold).
  - Material finished with brushed titanium / satin metallic PBR shader (`roughness: 0.28`, `metalness: 0.85`).
  - Removed protruding 3D gold chip cube (`chip3DGeometry`) to maintain a sleek, modern flush badge profile.
- **ID Card Visual Redesign (`src/components/About/Lanyard/LanyardCard.tsx`):**
  - **Front Face:**
    - Removed crime-scene millimeter ruler ticks, drafting crosshairs, fake "SECURITY CLEARANCE LEVEL 03", and cluttered dot-matrix background.
    - Added clean institutional header (`UNIVERSITAS BINA INSANI • DEV // 2026`).
    - Framed Ahmad's portrait in a generous rounded-rect container with clean alpha compositing, natural contrast, and subtle border.
    - Confident Swiss typography: bold `AHMAD BADAWI` name, `SOFTWARE DEVELOPER` kicker, and academic specialization (`S1 Sistem Informasi • Web & Applied AI`).
    - Clean 2-column metadata grid (`INSTITUTION`, `LOCATION`, `BADGE SERIAL`, `STATUS: VERIFIED ACTIVE`) and clean vector barcode.
  - **Back Face:**
    - Clean portfolio directory with 3 selected open-source project cards, core technical competencies (`React`, `TypeScript`, `Next.js`, `Python`, `Three.js`, `Tailwind`), verified communication channels, and a crisp portfolio QR code with attribution.
- **Physics Engine:** **100% UNCHANGED / LOCKED** (Rapier joints, rigid bodies, anchor positions, drag parameters, and animation loop untouched).
- **Validation:**
  - Typecheck: PASS (`tsc --noEmit`, 0 errors)
  - Build: PASS (`vite build`, 0 errors, bundle size reduced from 25.14 kB to 19.39 kB)
  - Security: PASS (`npm audit`, 0 vulnerabilities)

## Portfolio Refinement: Skills Data, Lanyard Hardware, Splashscreen Motion

- **Skills / Technologies (`src/data/profile.ts`)** — centralized single source of truth (no duplicated data in the component):
  - Removed `C++` (from `languages`) and `MongoDB` (from `database`); no orphan imports, icons, or translations remained.
  - Added `Flutter` (`web`) — “Practical cross-platform mobile application development”.
  - Added `Machine Learning` and `YOLO` (`tools`) — “Hands-on machine learning workflow project experience” and “Hands-on computer vision and object detection projects”.
  - Honest, non-exaggerated terminology (Practical / Hands-on), consistent with existing project evidence (`Banana Ripeness AI`, `Hand Gesture Perkenalan`). Skills page layout and visual design unchanged.
- **Lanyard visual hardware (`src/components/About/Lanyard/LanyardCard.tsx`)** — purely geometric/material, physics untouched:
  - Replaced the weak floating torus with a chamfered machined **annulus ring** (`ExtrudeGeometry` + bevel) centred exactly at `CARD_CLIP_OFFSET_Y = 1.70` (the spherical-joint pivot).
  - Built a coherent attachment chain: `clamp jaws → rivet pin → swivel neck → barrel → flange → eyelet link → machined ring → crimp ferrule` so the connection reads as one physical connector rather than disconnected primitives.
  - Slightly rougher satin metal (`roughness 0.32`, `metalness 0.8`) so machined arrises catch the existing key/rim lights with clear structure.
  - Disposal effect updated for all new geometries (no leaked GPU resources).
- **Lanyard strap (`src/components/About/Lanyard/LanyardStrap.tsx`)** — render stability only:
  - Anisotropy raised to `16` with linear mipmapping and `wrapS = RepeatWrapping` / `wrapT = ClampToEdgeWrapping` to remove oblique grazing-angle flicker, texture swimming, and edge tearing.
- **Splashscreen motion (`src/components/SplashScreen/SplashScreen.tsx`)** — motion quality only; layout/typography/colors/composition unchanged:
  - Replaced the stiff CSS transitions with `motion` spring + luxury-ease choreography (masked name/subtitle reveals, staggered opacity/transform progression).
  - Opening and closing now read as one continuous gesture; exit is an accelerating `cubic-bezier(0.76, 0, 0.24, 1)` mask wipe instead of a hard switch.
  - Click-to-open and **Space** to open interactions preserved exactly; added an idempotent `finishedRef` guard and a 1400 ms backstop so the sequence can never double-trigger or get stuck.
- **Reduced motion (`src/index.css`)** — added a global `@media (prefers-reduced-motion: reduce)` guard collapsing CSS transitions/animations and disabling smooth scroll. `motion` systems already branch on `useReducedMotion`; click and Space remain fully functional.
- **Not changed:** Hero, Projects, About layout, Journey, Contact, Footer, global typography, global color system, Rapier physics, rigid bodies, joints, rope, gravity, colliders, drag/pointer interaction, camera, Canvas config, position, scale, animation loop, and all component APIs/props.
- **Validation:**
  - Typecheck: PASS (`tsc --noEmit`, 0 errors)
  - Build: PASS (`vite build`, 0 errors)
  - Security: PASS (`npm audit`, 0 vulnerabilities)

