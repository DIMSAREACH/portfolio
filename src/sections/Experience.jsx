import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';
import { experienceData } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work Experience
          </h2>
          <div className="mt-3.5 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            A chronological timeline of my professional experience and academic leadership roles.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-slate-250 dark:border-slate-800 ml-4 md:ml-32 py-2">
          {experienceData.map((exp, index) => (
            <div key={index} className="mb-12 last:mb-0 relative pl-6 md:pl-10">
              {/* Pulsing Circle Marker */}
              <span className="absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-[#0b0f19] border-2 border-indigo-500 dark:border-brand-teal z-10">
                <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-brand-teal animate-ping absolute" />
                <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-brand-teal" />
              </span>

              {/* Side Date Label (Desktop Only) */}
              <div className="hidden md:block absolute -left-48 top-1.5 w-36 text-right text-sm font-semibold text-slate-500 dark:text-slate-400">
                {exp.period}
              </div>

              {/* Timeline Card */}
              <div className="p-7 rounded-2xl glass-card glass-card-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white flex items-center tracking-tight">
                      <Briefcase className="h-5 w-5 mr-2.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                      {exp.role}
                    </h3>
                    <p className="text-sm font-bold text-indigo-600 dark:text-brand-teal mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="md:hidden inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-lg">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {exp.period}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-2.5 list-none text-sm text-slate-600 dark:text-slate-400 pl-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed flex items-start">
                      <span className="text-indigo-500 mr-2.5 mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
