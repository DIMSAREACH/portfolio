import React, { useState } from 'react';
import { Github, ExternalLink, Code } from 'lucide-react';
import { projectsData } from '../data/portfolioData';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Frontend', 'Backend', 'Full Stack'];

  const filteredProjects = filter === 'All' 
    ? projectsData
    : projectsData.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects
          </h2>
          <div className="mt-3.5 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            A curated list of my coding projects, showcasing my tech stack and engineering capabilities.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all duration-300 ${
                filter === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-600 dark:border-indigo-600 dark:text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl glass-card glass-card-hover overflow-hidden group"
            >
              {/* Card visual banner instead of missing screenshot */}
              <div className="h-48 w-full bg-gradient-to-br from-slate-950 via-[#0f172a] to-indigo-950 relative flex items-center justify-center overflow-hidden border-b border-slate-200/50 dark:border-slate-800/80 select-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <Code className="h-12 w-12 text-indigo-500/40 dark:text-indigo-400/30 group-hover:scale-110 transition duration-500" />
                <span className="absolute bottom-4 right-4 text-[10px] font-bold tracking-widest text-indigo-400 dark:text-brand-teal bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 rounded-lg uppercase">
                  {project.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-7 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-brand-teal transition tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-650 dark:text-slate-450 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-slate-800/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA Links */}
                <div className="flex items-center gap-5 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 mt-6 text-sm font-bold">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition"
                  >
                    <Github className="h-4.5 w-4.5 mr-2" />
                    GitHub
                  </a>
                  
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 dark:text-brand-teal hover:underline transition"
                    >
                      <ExternalLink className="h-4.5 w-4.5 mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
