import React, { useState } from 'react';
import { Github, ExternalLink, Code2, Layers } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

const categoryColors = {
  'Full Stack': { bg: 'bg-indigo-500/10 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
  'Frontend': { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20' },
  'Backend': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
};

const bannerGradients = [
  'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]',
  'from-[#0f172a] via-[#134e4a] to-[#0f172a]',
  'from-[#0f172a] via-[#1e1b4b] to-[#0c1a3a]',
];

const categories = ['All', 'Full Stack', 'Frontend', 'Backend'];

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All'
    ? projectsData
    : projectsData.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 sm:py-32 bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            What I've built
          </p>
          <h2 className="section-heading">Projects</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            A curated selection of projects demonstrating my full-stack engineering capabilities.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                filter === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-slate-100/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {cat === 'All' && <Layers className="h-3.5 w-3.5" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => {
            const catStyle = categoryColors[project.category] || categoryColors['Full Stack'];
            return (
              <div
                key={project.id}
                className="glass-card glass-card-hover flex flex-col rounded-2xl overflow-hidden group"
              >
                {/* Visual Banner */}
                <div className={`h-48 bg-gradient-to-br ${bannerGradients[idx % bannerGradients.length]} relative flex items-center justify-center overflow-hidden select-none`}>
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  {/* Center icon */}
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                      <Code2 className="h-8 w-8 text-indigo-400" />
                    </div>
                    <p className="text-xs font-bold text-indigo-400/70 tracking-widest uppercase">
                      {project.title}
                    </p>
                  </div>

                  {/* Category badge */}
                  <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                    {project.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-grow p-6 space-y-4">
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* GitHub CTA */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/DIMSAREACH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Github className="h-4 w-4" />
            See all projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
