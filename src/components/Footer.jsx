import React from 'react';
import { Github, Linkedin, Mail, Heart, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { icon: Github, href: personalInfo.github, label: 'GitHub' },
  { icon: Linkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${personalInfo.email}`, label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#090d16] border-t border-slate-200/50 dark:border-slate-800/50 pt-16 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-200/50 dark:border-slate-800/50">
          {/* Brand Column */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2.5 group w-fit">
              <div className="h-9 w-9 overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/80 bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <img
                  src="/assets/logo.png"
                  alt="Sareach Dim Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                Sareach<span className="text-gradient">.dev</span>
              </span>
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              Full-Stack Developer specializing in React.js, Django, and AI-powered web applications. Based in Phnom Penh, Cambodia.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 group transition-colors"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Summary */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Contact</p>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Email: </span>
                <a href={`mailto:${personalInfo.email}`} className="font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {personalInfo.email}
                </a>
              </p>
              <p>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Phone: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{personalInfo.phone}</span>
              </p>
              <p>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Location: </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Phnom Penh, Cambodia</span>
              </p>
            </div>

            {/* Hire Me CTA */}
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              Hire Me
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
            © {year} Sareach Dim. Built with
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            using React &amp; Tailwind CSS.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            Phnom Penh, Cambodia 🇰🇭
          </p>
        </div>
      </div>
    </footer>
  );
}
