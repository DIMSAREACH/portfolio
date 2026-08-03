import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems.map(item => document.querySelector(item.href));
      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].href.slice(1));
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 nav-blur ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2.5 group">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/80 bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img
                src="/assets/logo.png"
                alt="Sareach Dim Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-heading font-bold text-slate-900 dark:text-white tracking-tight">
              Sareach<span className="text-gradient">.dev</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeSection === item.href.slice(1)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-3/4 rounded-full bg-indigo-500" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden md:inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
            >
              Hire Me
            </a>
            
            {/* Rounded Profile Avatar */}
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-500/20 shadow-sm flex-shrink-0 hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/profile.jpg"
                alt="Sareach Dim Profile"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.href.slice(1)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 px-4">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl"
              >
                Hire Me
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
