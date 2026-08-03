import React from 'react';
import { GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';
import { educationData, certificationsData } from '../data/portfolioData';

export default function EducationCertificates() {
  return (
    <section id="education" className="py-20 bg-brand-lightSecondary dark:bg-brand-darkSecondary/20 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Education column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center">
                <GraduationCap className="h-7 w-7 text-indigo-500 mr-3 flex-shrink-0" />
                Education
              </h2>
              <div className="mt-2 h-1 w-12 bg-indigo-500 rounded-full" />
            </div>

            <div className="space-y-6">
              {educationData.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-card relative overflow-hidden transition hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <span className="inline-flex items-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-brand-lightBorder dark:border-brand-darkBorder px-2.5 py-1 rounded-lg flex-shrink-0">
                      <Calendar className="h-3 w-3 mr-1" />
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-brand-teal">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center">
                <Award className="h-7 w-7 text-indigo-500 mr-3 flex-shrink-0" />
                Certifications
              </h2>
              <div className="mt-2 h-1 w-12 bg-indigo-500 rounded-full" />
            </div>

            <div className="space-y-4">
              {certificationsData.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder bg-white/40 dark:bg-brand-darkSecondary/10 flex items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-brand-darkSecondary/35"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="text-xs text-indigo-600 dark:text-brand-teal font-semibold flex-shrink-0">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
