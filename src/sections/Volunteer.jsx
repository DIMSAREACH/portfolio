import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import { volunteerData } from '../data/portfolioData';

export default function Volunteer() {
  return (
    <section id="volunteer" className="py-20 bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center justify-center">
            <Heart className="h-8 w-8 text-indigo-500 mr-3 animate-pulse" />
            Volunteer Contributions
          </h2>
          <div className="mt-2 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Giving back to the tech ecosystem by teaching programming and assisting local digital events.
          </p>
        </div>

        {/* Volunteer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {volunteerData.map((vol, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl glass-card relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                  {vol.role}
                </h3>
                <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-brand-teal bg-indigo-500/5 px-2.5 py-1 rounded-lg flex-shrink-0">
                  <Calendar className="h-3 w-3 mr-1" />
                  {vol.period}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                {vol.organization}
              </h4>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {vol.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
