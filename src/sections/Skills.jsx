import React, { useState } from 'react';
import { Code2, Layout, Server, Database, Wrench, Sparkles } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

const categories = [
  {
    key: 'languages',
    title: 'Programming Languages',
    icon: Code2,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    tagBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700',
  },
  {
    key: 'frontend',
    title: 'Frontend',
    icon: Layout,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    tagBg: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700',
  },
  {
    key: 'backend',
    title: 'Backend',
    icon: Server,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    tagBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  {
    key: 'databases',
    title: 'Databases',
    icon: Database,
    gradient: 'from-cyan-500 to-sky-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    tagBg: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/30 hover:text-cyan-700 dark:hover:text-cyan-300 hover:border-cyan-300 dark:hover:border-cyan-700',
  },
  {
    key: 'tools',
    title: 'Tools & Ecosystem',
    icon: Wrench,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    tagBg: 'hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-300 dark:hover:border-amber-700',
  },
  {
    key: 'softSkills',
    title: 'Soft Skills',
    icon: Sparkles,
    gradient: 'from-violet-500 to-pink-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
    tagBg: 'hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-700 dark:hover:text-violet-300 hover:border-violet-300 dark:hover:border-violet-700',
  },
];

export default function Skills() {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <section id="skills" className="py-24 sm:py-32 bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            What I know
          </p>
          <h2 className="section-heading">Skills & Expertise</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            My technology stack and methodologies, organized by category.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const skills = skillsData[cat.key];
            const isHovered = hoveredKey === cat.key;

            return (
              <div
                key={cat.key}
                onMouseEnter={() => setHoveredKey(cat.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className="glass-card glass-card-hover p-7 rounded-2xl group"
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`relative p-3.5 rounded-xl ${cat.bg} border ${cat.border}`}>
                    <Icon className={`h-6 w-6 ${cat.text}`} />
                    {/* Gradient dot indicator */}
                    <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-br ${cat.gradient} ${isHovered ? 'scale-125' : 'scale-100'} transition-transform duration-300`} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {cat.title}
                    </h3>
                    <p className={`text-xs font-semibold ${cat.text} mt-0.5`}>
                      {skills.length} skills
                    </p>
                  </div>
                </div>

                {/* Gradient header bar */}
                <div className={`h-0.5 w-full rounded-full mb-5 bg-gradient-to-r ${cat.gradient} opacity-30`} />

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`skill-badge text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-default ${cat.tagBg}`}
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
