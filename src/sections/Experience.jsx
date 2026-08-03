import React from 'react';
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { experienceData } from '../data/portfolioData';

const accentColors = [
  { dot: 'bg-indigo-500', glow: 'shadow-indigo-500/50', ring: 'ring-indigo-500/30', tag: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300' },
  { dot: 'bg-violet-500', glow: 'shadow-violet-500/50', ring: 'ring-violet-500/30', tag: 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300' },
  { dot: 'bg-pink-500', glow: 'shadow-pink-500/50', ring: 'ring-pink-500/30', tag: 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300' },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            My journey
          </p>
          <h2 className="section-heading">Work Experience</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            A timeline of my professional experience and academic leadership roles.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 md:-translate-x-px" />

          {experienceData.map((exp, index) => {
            const accent = accentColors[index % accentColors.length];
            const isEven = index % 2 === 0;

            return (
              <div key={index} className={`relative flex items-start gap-6 md:gap-12 mb-12 last:mb-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-6 z-10">
                  <div className={`h-4 w-4 rounded-full ${accent.dot} shadow-lg ${accent.glow} ring-4 ${accent.ring} ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#0b0f19]`} />
                </div>

                {/* Date label (desktop) */}
                <div className={`hidden md:flex items-start pt-4 ${isEven ? 'w-1/2 justify-end pr-10' : 'w-1/2 justify-start pl-10'}`}>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    {exp.period}
                  </div>
                </div>

                {/* Card */}
                <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}>
                  <div className="glass-card glass-card-hover p-6 rounded-2xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${accent.tag.split(' ')[0]} ${accent.tag.split(' ')[1]} flex-shrink-0 mt-0.5`}>
                          <Briefcase className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                            {exp.role}
                          </h3>
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                        {/* Mobile date */}
                        <span className="md:hidden flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-200/60 dark:bg-slate-700/40 mb-4" />

                    {/* Bullet points */}
                    <ul className="space-y-2.5">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
