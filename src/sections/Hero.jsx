import React, { useState } from 'react';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Hero() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="home" className="relative w-full py-24 md:py-36 flex items-center justify-center overflow-hidden">
      {/* Decorative floating gradient glow elements in background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[90px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/15 dark:bg-violet-500/10 blur-[100px] pointer-events-none animate-float-delayed" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Heading and Tagline */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/40 rounded-full py-1.5 px-4">
              <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-brand-teal animate-pulse" />
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 tracking-wide uppercase">
                Available for Full-Time Roles & Internships
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Hi, I'm <span className="text-gradient">{personalInfo.name}</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 font-heading">
              {personalInfo.title}
            </p>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 group"
              >
                View Projects
                <ArrowUpRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="/sareach-dim-cv.pdf"
                download
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-brand-darkSecondary/30 hover:bg-slate-50 dark:hover:bg-[#0f172a]/60 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Download CV
                <Download className="ml-2 h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition-all duration-300"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right Column: Visual Avatar / Profile Photo */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in">
            <div className="relative">
              {/* Outer decorative rings */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-30 dark:opacity-20 animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
              
              {/* Profile Image Wrap */}
              <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-2xl flex items-center justify-center bg-slate-100 dark:bg-[#0f172a]">
                {imageError ? (
                  /* Fallback avatar visual using modern CSS vectors */
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="h-24 w-24 rounded-full bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-4">
                      <span className="text-4xl font-heading font-bold text-indigo-300">SD</span>
                    </div>
                    <span className="text-lg font-heading font-semibold text-slate-200">Sareach Dim</span>
                    <span className="text-xs text-indigo-400 mt-1">Full-Stack Developer</span>
                    
                    {/* Grid background effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
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
