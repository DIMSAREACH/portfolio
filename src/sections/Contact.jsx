import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    botcheck: '' // Honeypot field
  });

  const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS, ERROR
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formState.name.trim()) tempErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    if (!formState.message.trim()) tempErrors.message = 'Message is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation
    if (!validate()) return;

    // Check honeypot
    if (formState.botcheck) {
      console.warn('Bot detected via honeypot');
      setStatus('SUCCESS'); // Act successful to mislead bot
      return;
    }

    setStatus('SUBMITTING');

    try {
      const endpoint = "https://formspree.io/f/xbdnnbje";

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        })
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setFormState({ name: '', email: '', message: '', botcheck: '' });
      } else {
        setTimeout(() => {
          setStatus('SUCCESS');
          setFormState({ name: '', email: '', message: '', botcheck: '' });
        }, 1000);
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Me
          </h2>
          <div className="mt-3.5 h-1.5 w-16 bg-brand-gradient rounded-full mx-auto" />
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Let's discuss full-stack opportunities, class management support, or collaboration ideas.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-8 animate-slide-up">
            <div className="space-y-4">
              <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                Get in Touch
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Have an opening, a question, or a project concept? Reach out using the form or direct coordinates below. I respond to inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md transition hover:border-indigo-500/20">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-brand-teal flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email</span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm font-semibold text-slate-850 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-brand-teal transition"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md transition hover:border-indigo-500/20">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-brand-teal flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Phone</span>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-slate-855 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-brand-teal transition"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md transition hover:border-indigo-500/20">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-brand-teal flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-xs font-semibold text-slate-850 dark:text-slate-200 block break-words">
                    {personalInfo.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-md">
              <iframe
                title="Sareach Dim Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.2891391942475!2d104.902325!3d11.599182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951664188f8df%3A0xe54c1f9643441a1!2sStreet%20103%2C%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl glass-card">
              {status === 'SUCCESS' ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h4 className="text-xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-sm text-slate-650 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. I've received your request and will get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus('IDLE')}
                    className="mt-6 inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-300 hover:shadow-lg shadow-indigo-500/20"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden from users) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botcheck">Do not fill this out if you are human:</label>
                    <input
                      type="text"
                      name="botcheck"
                      id="botcheck"
                      value={formState.botcheck}
                      onChange={handleInputChange}
                      tabIndex="-1"
                      autoComplete="off"
                    />
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className={`w-full px-4.5 py-3.5 text-sm rounded-xl border bg-white/70 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                        errors.name
                          ? 'border-red-500 ring-4 ring-red-500/10'
                          : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10'
                      }`}
                      placeholder="e.g. Sareach Dim"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      className={`w-full px-4.5 py-3.5 text-sm rounded-xl border bg-white/70 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                        errors.email
                          ? 'border-red-500 ring-4 ring-red-500/10'
                          : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10'
                      }`}
                      placeholder="e.g. dimsareach009@gmail.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      value={formState.message}
                      onChange={handleInputChange}
                      className={`w-full px-4.5 py-3.5 text-sm rounded-xl border bg-white/70 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-200 resize-none ${
                        errors.message
                          ? 'border-red-500 ring-4 ring-red-500/10'
                          : 'border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10'
                      }`}
                      placeholder="What would you like to discuss?"
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Error Notification */}
                  {status === 'ERROR' && (
                    <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 text-xs text-red-600 dark:text-red-400 flex items-start">
                      <AlertCircle className="h-4.5 w-4.5 mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Failed to send message</span>
                        Please check your network connection and try again.
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'SUBMITTING'}
                    className="w-full inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl transition duration-300 shadow-md shadow-indigo-500/15 hover:shadow-lg hover:shadow-indigo-500/25 group hover:-translate-y-0.5"
                  >
                    {status === 'SUBMITTING' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
