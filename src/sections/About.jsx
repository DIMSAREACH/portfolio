import React from 'react';
import { MapPin, Globe, Heart, Briefcase, Download, FileText } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

const highlights = [
  {
    icon: Briefcase,
    color: 'indigo',
    title: 'AI Data Specialist',
    desc: '9 months at Digital Divide Data — 99% annotation accuracy on ML pipelines.',
  },
  {
    icon: Globe,
    color: 'violet',
    title: '4th Year CS Student',
    desc: 'Bachelor of Computer Science at Norton University, Phnom Penh.',
  },
  {
    icon: Heart,
    color: 'pink',
    title: 'Volunteer Mentor',
    desc: 'Mentored youth in coding, digital entrepreneurship, and tech events.',
  },
];

const colorMap = {
  indigo: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/15',
  violet: 'bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/15',
  pink: 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border-pink-500/15',
};

export default function About() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: bioRef, isVisible: bioVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: highlightsRef, isVisible: highlightsVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="about" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`reveal ${headerVisible ? 'visible' : ''} text-center mb-20`}
        >
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            Get to know me
          </p>
          <h2 className="section-heading">About Me</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            My professional journey, background, and what drives me.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Bio Column */}
          <div
            ref={bioRef}
            className={`reveal-left ${bioVisible ? 'visible' : ''} space-y-8`}
          >
            <div className="space-y-5 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>{personalInfo.bio}</p>
              <p>
                Currently in my fourth year of Computer Science study, I've spent substantial time refining 
                my ability to build clean RESTful backends with <span className="font-semibold text-indigo-600 dark:text-indigo-400">Django &amp; DRF</span> combined 
                with responsive interfaces using <span className="font-semibold text-indigo-600 dark:text-indigo-400">React.js &amp; Tailwind CSS</span>. I'm highly interested 
                in AI-powered tools, automation pipelines, and robust database modeling.
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4.5 rounded-2xl glass-card">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4.5 rounded-2xl glass-card">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex-shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Languages</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {personalInfo.languages.map(l => `${l.name} (${l.level})`).join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Core Stack</p>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'Django', 'DRF', 'PostgreSQL', 'MySQL', 'Tailwind CSS', 'Python', 'JavaScript'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Download CV + Hire Me Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/sareach-dim-cv.pdf"
                download="Sareach-Dim-CV.pdf"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <FileText className="h-4 w-4" />
                Download My CV
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                Hire Me →
              </a>
            </div>
          </div>

          {/* Highlights Column */}
          <div
            ref={highlightsRef}
            className={`reveal-right ${highlightsVisible ? 'visible' : ''} space-y-5`}
          >
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-40 ${colorMap[item.color].split(' ')[0]}`} />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-3.5 rounded-xl border flex-shrink-0 ${colorMap[item.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Open-to-Work Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Currently</p>
              <p className="text-lg font-heading font-bold leading-snug">Open to full-time roles &amp; internship opportunities</p>
              <p className="text-sm text-indigo-200 mt-2">Available in Phnom Penh · Remote-friendly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
