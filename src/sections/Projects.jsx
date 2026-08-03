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
    <section id="projects" className="py-20 bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Projects
          </h2>
          <div className="mt-2 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            A curated list of my coding projects, showcasing my tech stack and engineering capabilities.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 ${
                filter === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-600 dark:border-indigo-600 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-brand-darkSecondary/40 border-brand-lightBorder dark:border-brand-darkBorder text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-2xl glass-card overflow-hidden group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card visual banner instead of missing screenshot */}
              <div className="h-44 w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 relative flex items-center justify-center overflow-hidden border-b border-brand-lightBorder dark:border-brand-darkBorder select-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <Code className="h-10 w-10 text-indigo-400/50 group-hover:scale-110 transition duration-300" />
                <span className="absolute bottom-3 right-3 text-[10px] font-semibold tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 px-2 py-0.5 rounded-md">
                  {project.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-brand-teal transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-brand-lightBorder dark:border-brand-darkBorder"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA Links */}
                <div className="flex items-center gap-4 pt-6 border-t border-brand-lightBorder dark:border-brand-darkBorder mt-6 text-xs font-semibold">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition"
                  >
                    <Github className="h-4 w-4 mr-1.5" />
                    GitHub
                  </a>
                  
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 dark:text-brand-teal hover:underline transition"
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" />
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
