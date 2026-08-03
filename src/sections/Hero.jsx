import React, { useState } from 'react';
import { ArrowUpRight, Download, Mail, Github, Linkedin, ChevronDown } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Hero() {
  const [imageError, setImageError] = useState(false);

  const stats = [
    { value: '3+', label: 'Years Coding' },
    { value: '5+', label: 'Projects Built' },
    { value: '99%', label: 'Data Accuracy' },
  ];

  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-white dark:bg-[#090d16] dot-grid"
    >
      {/* Ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/5 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/8 dark:bg-violet-500/5 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-pink-500/6 dark:bg-pink-500/4 blur-[80px] pointer-events-none animate-float-alt" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                Available for Full-Time &amp; Internship Roles
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                Hello, I'm
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                <span className="text-gradient">{personalInfo.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-heading font-semibold text-slate-700 dark:text-slate-200">
                Full-Stack Developer &amp; AI Enthusiast
              </p>
            </div>

            {/* Bio */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {personalInfo.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                View My Work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="/sareach-dim-cv.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Download CV
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Github className="h-4.5 w-4.5" />
                GitHub
              </a>
              <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Linkedin className="h-4.5 w-4.5" />
                LinkedIn
              </a>
              <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Mail className="h-4.5 w-4.5" />
                Email Me
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-2">
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl font-heading font-black text-gradient">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Profile Photo */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 blur-2xl opacity-25 dark:opacity-20 animate-pulse" />

              {/* Decorative orbit ring */}
              <div className="absolute -inset-3 rounded-full border-2 border-dashed border-indigo-300/30 dark:border-indigo-500/20 animate-spin-slow" />

              {/* Gradient border wrapper */}
              <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 shadow-2xl shadow-indigo-500/30">
                <div className="h-72 w-72 sm:h-80 sm:w-80 rounded-full overflow-hidden bg-[#2196f3] border-4 border-white dark:border-[#090d16]">
                  {imageError ? (
                    <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center select-none">
                      <div className="h-20 w-20 rounded-full bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-4">
                        <span className="text-4xl font-heading font-black text-indigo-300">SD</span>
                      </div>
                      <span className="text-base font-heading font-semibold text-slate-300">Sareach Dim</span>
                      <span className="text-xs text-indigo-400 mt-1">Full-Stack Developer</span>
                    </div>
                  ) : (
                    <img
                      src="/assets/profile.jpg"
                      alt="Sareach Dim — Full-Stack Developer"
                      className="w-full h-full object-contain object-top"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>

              {/* Floating skill badges */}
              <div className="absolute -top-2 -right-4 sm:-right-8 glass px-3 py-2 rounded-xl shadow-lg border-0 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white/90 dark:bg-slate-900/90 animate-float">
                React.js ⚛️
              </div>
              <div className="absolute -bottom-2 -left-4 sm:-left-10 glass px-3 py-2 rounded-xl shadow-lg border-0 text-xs font-bold text-violet-700 dark:text-violet-300 bg-white/90 dark:bg-slate-900/90 animate-float-alt">
                Django 🐍
              </div>
              <div className="absolute top-1/2 -right-8 sm:-right-14 glass px-3 py-2 rounded-xl shadow-lg border-0 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white/90 dark:bg-slate-900/90 animate-float-slow">
                PostgreSQL 🗄️
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-600 hidden sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
