import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'dimsareach009@gmail.com',
    href: 'mailto:dimsareach009@gmail.com',
    color: 'indigo',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '071 28 32 071',
    href: 'tel:+85571283071',
    color: 'violet',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Phnom Penh, Cambodia',
    href: 'https://www.google.com/maps/search/?api=1&query=Street+103+Phnom+Penh+Cambodia',
    color: 'pink',
  },
];

const colorMap = {
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
};

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', botcheck: '' });
  const [status, setStatus] = useState('IDLE');
  const [errors, setErrors] = useState({});
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: infoRef, isVisible: infoVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: formRef, isVisible: formVisible } = useScrollReveal({ threshold: 0.1 });

  const validate = () => {
    const temp = {};
    if (!formState.name.trim()) temp.name = 'Full name is required';
    if (!formState.email.trim()) {
      temp.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      temp.email = 'Enter a valid email address';
    }
    if (!formState.message.trim()) temp.message = 'Message is required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (formState.botcheck) { setStatus('SUCCESS'); return; }
    setStatus('SUBMITTING');
    try {
      const res = await fetch('https://formspree.io/f/xbdnnbje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: formState.name, email: formState.email, message: formState.message }),
      });
      if (res.ok) {
        setStatus('SUCCESS');
        setFormState({ name: '', email: '', message: '', botcheck: '' });
      } else {
        setStatus('ERROR');
      }
    } catch {
      setStatus('ERROR');
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`reveal ${headerVisible ? 'visible' : ''} text-center mb-20`}
        >
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-3">
            Let's talk
          </p>
          <h2 className="section-heading">Contact Me</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            Have an opportunity, project idea, or question? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Contact info + map */}
          <div
            ref={infoRef}
            className={`reveal-left ${infoVisible ? 'visible' : ''} lg:col-span-2 space-y-6`}
          >
            <div className="space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                const style = colorMap[method.color];
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.icon === MapPin ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl glass-card glass-card-hover group"
                  >
                    <div className={`p-3 rounded-xl border flex-shrink-0 ${style}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{method.label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {method.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="glass-card p-5 rounded-2xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Connect with me</p>
              <div className="flex gap-3">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-1 justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-1 justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-sm h-48">
              <iframe
                title="Sareach Dim — Phnom Penh, Cambodia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.2891391942475!2d104.902325!3d11.599182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951664188f8df%3A0xe54c1f9643441a1!2sStreet%20103%2C%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div
            ref={formRef}
            className={`reveal-right ${formVisible ? 'visible' : ''} lg:col-span-3`}
          >
            <div className="glass-card p-8 rounded-2xl">

              {status === 'SUCCESS' ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                    Message Sent! 🎉
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. I've received your message and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('IDLE')}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" name="botcheck" value={formState.botcheck} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Sareach Dim"
                          className={`form-input ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-500">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-500">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Hi Sareach, I'd love to discuss a full-stack opportunity..."
                        className={`form-input resize-none ${errors.message ? 'error' : ''}`}
                      />
                      {errors.message && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-500">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Error */}
                    {status === 'ERROR' && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Failed to send message</span>
                          Please check your connection and try again.
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'SUBMITTING'}
                      className="w-full flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-70 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      {status === 'SUBMITTING' ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
                      Your message is sent securely via Formspree. No data is stored by me.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
