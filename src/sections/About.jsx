import React from 'react';
import { MapPin, Globe, Award, GraduationCap } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function About() {
  return (
    <section id="about" className="py-20 bg-brand-lightSecondary dark:bg-brand-darkSecondary/20 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            About Me
          </h2>
          <div className="mt-2 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Get to know my professional journey, location, and background.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
              My Passion & Professional Background
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {personalInfo.bio}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Currently in my fourth year of Computer Science study, I've spent substantial time refining my ability to build clean RESTful backends (Django, DRF) combined with responsive, reactive interfaces (React.js, Tailwind CSS). I'm highly interested in AI-powered tools, automation pipelines, and robust database modeling.
            </p>

            {/* Quick Details Table/Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3 p-4 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder bg-white/40 dark:bg-brand-darkSecondary/30">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-brand-teal flex-shrink-0" />
                <div>
                  <span className="block text-xs text-slate-400">Location</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{personalInfo.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder bg-white/40 dark:bg-brand-darkSecondary/30">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-brand-teal flex-shrink-0" />
                <div>
                  <span className="block text-xs text-slate-400">Languages</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {personalInfo.languages.map(l => `${l.name} (${l.level})`).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Cards: Highlights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl glass-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200">4th Year Student</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Studying Bachelor of Computer Science at Norton University, Phnom Penh.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-800 dark:text-slate-200">AI Annotation background</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
