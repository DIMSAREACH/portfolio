import React, { useState } from 'react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Hero() {
  const [imageError, setImageError] = useState(false);
  return (
    <section id="home" className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden">
      {/* Decorative gradient glow elements in background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-violet-500/10 blur-[90px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Tagline */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/40 rounded-full py-1 px-3">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-brand-teal animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Available for Full-Time Roles & Internships
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
              Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300">
              {personalInfo.title}
            </p>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
              {personalInfo.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition duration-300 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 group"
              >
                View Projects
                <ArrowUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="/sareach-dim-cv.pdf"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 border border-brand-lightBorder dark:border-brand-darkBorder bg-white/50 dark:bg-brand-darkSecondary/35 hover:bg-slate-50 dark:hover:bg-brand-darkSecondary/60 rounded-xl transition duration-300"
              >
                Download CV
                <Download className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition duration-300"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right Column: Visual Avatar / Profile Placeholder */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in">
            <div className="relative">
              {/* Outer glowing design ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 blur-md opacity-40 animate-pulse" />
              
              {/* Profile Image Wrap */}
              <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full border-4 border-white dark:border-brand-darkSecondary overflow-hidden shadow-xl glass-card flex items-center justify-center">
                {imageError ? (
                  /* Fallback avatar visual using modern CSS vectors */
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="h-20 w-20 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-3">
                      <span className="text-3xl font-heading font-bold text-indigo-300">SD</span>
                    </div>
                    <span className="text-sm font-heading font-semibold text-slate-200">Sareach Dim</span>
                    <span className="text-xs text-indigo-400 mt-0.5">Full-Stack Developer</span>
                    
                    {/* Grid background effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  </div>
                ) : (
                  /* Real image if loaded successfully */
                  <img
                    src="/assets/profile.jpg"
                    alt="Sareach Dim"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
