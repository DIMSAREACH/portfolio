import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import EducationCertificates from './sections/EducationCertificates';
import Volunteer from './sections/Volunteer';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-lightBg dark:bg-brand-darkBg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="flex-grow">
        {/* Sections */}
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <EducationCertificates />
        <Volunteer />
        <Contact />
      </main>

      {/* Footer Banner */}
      <Footer />
    </div>
  );
}

export default App;
