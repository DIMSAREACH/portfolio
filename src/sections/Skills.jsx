import React from 'react';
import { Code, Layout, Database, Wrench, Sparkles, Server } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

const categories = [
  {
    key: 'languages',
    title: 'Programming Languages',
    icon: Code,
    colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    tagColor: 'hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30'
  },
  {
    key: 'frontend',
    title: 'Frontend Frameworks',
    icon: Layout,
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    tagColor: 'hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30'
  },
  {
    key: 'backend',
    title: 'Backend Frameworks',
    icon: Server,
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    tagColor: 'hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30'
  },
  {
    key: 'databases',
    title: 'Databases',
    icon: Database,
    colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    tagColor: 'hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30'
  },
  {
    key: 'tools',
    title: 'Tools & Ecosystem',
    icon: Wrench,
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    tagColor: 'hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/30'
  },
  {
    key: 'softSkills',
    title: 'Professional Soft Skills',
    icon: Sparkles,
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    tagColor: 'hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/30'
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white">
            Skills & Expertise
          </h2>
          <div className="mt-2 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            My technology stack, tools, and methodologies categorized by focus area.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const skills = skillsData[cat.key];

            return (
              <div
                key={cat.key}
                className="p-6 rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Card Header */}
                <div className="flex items-center space-x-3.5 mb-6">
                  <div className={`p-2.5 rounded-xl border ${cat.colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-slate-800 dark:text-slate-200 text-base">
                    {cat.title}
                  </h3>
                </div>

                {/* Badges Flow */}
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder bg-slate-50 dark:bg-brand-darkBg/60 text-slate-600 dark:text-slate-400 transition-all duration-300 cursor-default ${cat.tagColor}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
