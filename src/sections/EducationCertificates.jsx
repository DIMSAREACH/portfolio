import React from 'react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { educationData, certificationsData } from '../data/portfolioData';

export default function EducationCertificates() {
  return (
    <section id="education" className="py-24 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Education column */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center tracking-tight">
                <GraduationCap className="h-8 w-8 text-indigo-500 mr-3 flex-shrink-0" />
                Education
              </h2>
              <div className="mt-3.5 h-1.5 w-12 bg-brand-gradient rounded-full" />
            </div>

            <div className="space-y-6">
              {educationData.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-card glass-card-hover"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                      {edu.degree}
                    </h3>
                    <span className="inline-flex items-center text-[10px] font-bold text-slate-550 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1.5 rounded-lg flex-shrink-0">
                      <Calendar className="h-3 w-3 mr-1" />
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 dark:text-brand-teal">
                    {edu.institution}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {edu.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications column */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center tracking-tight">
                <Award className="h-8 w-8 text-indigo-500 mr-3 flex-shrink-0" />
                Certifications
              </h2>
              <div className="mt-3.5 h-1.5 w-12 bg-brand-gradient rounded-full" />
            </div>

            <div className="space-y-4">
              {certificationsData.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-card glass-card-hover flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-450 mt-1">
                      {cert.issuer}
                    </p>
                  </div>
                  <span className="text-xs text-indigo-650 dark:text-brand-teal font-bold flex-shrink-0 bg-indigo-500/5 dark:bg-brand-teal/5 py-1 px-2.5 rounded-lg">
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
