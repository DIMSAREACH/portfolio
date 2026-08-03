import React from 'react';
import { GraduationCap, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { educationData, certificationsData } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function EducationCertificates() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: eduRef, isVisible: eduVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: certRef, isVisible: certVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="education" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`reveal ${headerVisible ? 'visible' : ''} text-center mb-20`}
        >
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            My background
          </p>
          <h2 className="section-heading">Education & Certifications</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Academic qualifications and professional certifications I've earned.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Education Column */}
          <div
            ref={eduRef}
            className={`reveal-left ${eduVisible ? 'visible' : ''} space-y-8`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">Education</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{educationData.length} academic institutions</p>
              </div>
            </div>

            <div className="space-y-5">
              {educationData.map((edu, idx) => (
                <div key={idx} className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                  {/* Timeline number */}
                  <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-black text-indigo-500">
                    {educationData.length - idx}
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 flex-shrink-0 mt-0.5">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-grow pr-8">
                      <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {edu.degree}
                      </h4>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                        {edu.institution}
                      </p>
                      <div className="flex items-center flex-wrap gap-3 mt-2.5">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {edu.period}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          📍 {edu.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div
            ref={certRef}
            className={`reveal-right ${certVisible ? 'visible' : ''} space-y-8`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">Certifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{certificationsData.length} certificates earned</p>
              </div>
            </div>

            <div className="space-y-4">
              {certificationsData.map((cert, idx) => (
                <div key={idx} className="glass-card glass-card-hover p-5 rounded-2xl flex items-start justify-between gap-4 group">
                  <div className="flex items-start gap-3.5 flex-grow">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        Issued by {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 px-2.5 py-1.5 text-[10px] font-black rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/15">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>

            {/* Reference block */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">Reference</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Ms. Lakhena Keo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Available upon request
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
