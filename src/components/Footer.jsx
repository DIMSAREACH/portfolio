import React from 'react';
import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-brand-lightBorder dark:border-brand-darkBorder bg-brand-lightSecondary dark:bg-brand-darkSecondary/40 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-heading font-bold text-gradient">Sareach Dim</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Final-Year CS Student | Full-Stack Developer
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-2 rounded-xl border border-brand-lightBorder dark:border-brand-darkBorder hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-brand-teal transition"
              aria-label="Send Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Divider line */}
        <hr className="my-8 border-brand-lightBorder dark:border-brand-darkBorder" />

        {/* Info & Policy */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} Sareach Dim. All rights reserved.</p>
          <div className="flex space-x-4">
            <span>Built with React & Tailwind CSS</span>
            <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
            <span>Phnom Penh, Cambodia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
