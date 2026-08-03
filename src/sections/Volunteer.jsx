import React from 'react';
import { Heart, Calendar, MapPin, Users } from 'lucide-react';
import { volunteerData } from '../data/portfolioData';

const accentColors = [
  { icon: 'bg-pink-500/10 text-pink-500 border border-pink-500/20', badge: 'bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' },
  { icon: 'bg-violet-500/10 text-violet-500 border border-violet-500/20', badge: 'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
];

export default function Volunteer() {
  return (
    <section id="volunteer" className="py-24 sm:py-32 bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-pink-600 dark:text-pink-400 uppercase tracking-[0.2em] mb-3">
            Giving back
          </p>
          <h2 className="section-heading">Volunteer Work</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Contributing to the tech ecosystem through mentorship and event support.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {volunteerData.map((vol, index) => {
            const accent = accentColors[index % accentColors.length];
            return (
              <div key={index} className="glass-card glass-card-hover p-8 rounded-2xl relative overflow-hidden group">
                {/* Decorative blob */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full ${accent.dot} opacity-5 group-hover:opacity-10 transition-opacity`} />

                {/* Icon */}
                <div className={`inline-flex p-3.5 rounded-xl ${accent.icon} mb-5`}>
                  <Heart className="h-6 w-6" />
                </div>

                {/* Role + Org */}
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
                  {vol.role}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {vol.organization}
                  </p>
                </div>

                {/* Period badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${accent.badge}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {vol.period}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200/60 dark:bg-slate-700/40 mb-5" />

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {vol.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Impact Banner */}
        <div className="mt-16 max-w-5xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-pink-500/5 via-violet-500/5 to-indigo-500/5 border border-pink-200/30 dark:border-pink-900/20 text-center">
          <Heart className="h-8 w-8 text-pink-500 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-heading font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            "Technology is best when it brings people together."
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">— A guiding principle for how I approach every project and mentorship role.</p>
        </div>
      </div>
    </section>
  );
}
