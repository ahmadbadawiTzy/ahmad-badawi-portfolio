/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Technologies } from './components/Technologies/Technologies';
import { Journey } from './components/Journey/Journey';
import { Projects } from './components/Projects/Projects';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {/* Editorial Swiss Splash Screen Sequence */}
        {!isSplashComplete && (
          <SplashScreen onComplete={() => setIsSplashComplete(true)} />
        )}

        <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50 transition-colors duration-150 selection:bg-[#C8102E] selection:text-white flex flex-col font-sans antialiased">
          {/* Main Navigation */}
          <Navbar />

          {/* Core Content Layout: Hero → About → Skills → Journey → Projects → Contact */}
          <main id="main-content" className="flex-1">
            {/* 01 — HERO (Ahmad Badawi, Software Developer, Liquid Reveal & Hover Swap) */}
            <Hero />

            {/* 02 — ABOUT (Developer background & Swiss 3D Lanyard ID Card) */}
            <About />

            {/* 03 — SKILLS (Actual technologies grouped in Swiss 4-column editorial grid) */}
            <Technologies />

            {/* 04 — JOURNEY (Education & Systems Progression) */}
            <Journey />

            {/* 05 — PROJECTS (Technical projects with metrics & architecture notes) */}
            <Projects />

            {/* 06 — CONTACT (Direct communication channels & verified networks) */}
            <Contact />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
