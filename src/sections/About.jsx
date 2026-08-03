import React from 'react';
import { MapPin, Globe, Award, GraduationCap } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <div className="mt-3.5 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Get to know my professional journey, location, and background.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Bio column */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              My Passion & Professional Background
            </h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {personalInfo.bio}
            </p>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Currently in my fourth year of Computer Science study, I've spent substantial time refining my ability to build clean RESTful backends (Django, DRF) combined with responsive, reactive interfaces (React.js, Tailwind CSS). I'm highly interested in AI-powered tools, automation pipelines, and robust database modeling.
            </p>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-4 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-[#0f172a]/30 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/20">
                <MapPin className="h-6 w-6 text-indigo-600 dark:text-brand-teal flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{personalInfo.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-[#0f172a]/30 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/20">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-brand-teal flex-shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Languages</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {personalInfo.languages.map(l => `${l.name} (${l.level})`).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Cards: Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-card glass-card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-start space-x-5">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">4th Year Student</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Studying Bachelor of Computer Science at Norton University, Phnom Penh.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card glass-card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-start space-x-5">
                <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">AI Annotation background</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Professional experience working with machine learning OCR validation pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
