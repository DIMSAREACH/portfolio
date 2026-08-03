import React from 'react';
import { Calendar, Briefcase, Award } from 'lucide-react';
import { experienceData } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-brand-lightSecondary dark:bg-brand-darkSecondary/20 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Work Experience
          </h2>
          <div className="mt-2 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            A chronological timeline of my professional experience and academic leadership roles.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-brand-lightBorder dark:border-brand-darkBorder ml-4 md:ml-32 py-2">
          {experienceData.map((exp, index) => (
            <div key={index} className="mb-12 last:mb-0 relative pl-6 md:pl-10">
              {/* Circle Marker */}
              <span className="absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-brand-darkBg border-2 border-indigo-600 dark:border-brand-teal">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-brand-teal" />
              </span>

              {/* Side Date Label (Desktop Only) */}
              <div className="hidden md:block absolute -left-48 top-1.5 w-36 text-right text-sm font-semibold text-slate-500 dark:text-slate-400">
                {exp.period}
              </div>

              {/* Timeline Card */}
              <div className="p-6 rounded-2xl glass-card transition hover:-translate-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-brand-teal mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="md:hidden inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {exp.period}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 list-disc list-inside text-sm text-slate-600 dark:text-slate-400 pl-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed pl-1 marker:text-indigo-500">
                      <span className="relative -left-2 text-slate-600 dark:text-slate-400">{bullet}</span>
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
