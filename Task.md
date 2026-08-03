# Project Task Checklist (task.md)

This checklist tracks the implementation progress of Sareach Dim's personal portfolio website, mapping to [Phase.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Phase.md) and [Design.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Design.md).

---

## Phase 1 — Content Collection & Decisions

- [x] Gather & finalise text copy
  - [x] Write 1-sentence tagline
  - [x] Adapt About profile text (Phnom Penh location, languages)
  - [x] Reframe experience bullets to be results-oriented
- [x] Prepare 3–5 projects data
  - [x] Project title & description
  - [x] Tech stack tags
  - [x] URLs (GitHub repo, live demo links if available)
  - [x] High-res screenshots
- [x] Set up professional accounts & files
  - [x] Verify GitHub profile public link
  - [x] Verify LinkedIn profile public link
  - [x] Export clean CV to PDF format
  - [x] Gather profile headshot image
- [x] Answer project configuration questions
  - [x] Decide: Single-page scroll vs. multi-page routes
  - [x] Decide: Custom domain (sareachdim.com) vs. platform subdomain
  - [x] Decide: Reference info public vs. "available on request"

---

## Phase 2 — Design System & Style Guide

- [x] Define styling variables & tokens
  - [x] Select heading font (Outfit) and body font (Inter)
  - [x] Establish hex codes for Light & Dark mode themes
  - [x] Plan component border radii and spacing sizes
- [x] Wireframe & Layout mapping
  - [x] Layout grid wireframes for mobile and desktop viewports
  - [x] Glassmorphic card design blueprint
  - [x] Responsive navbar & menu drawer wireframes
- [x] Visual Mockup review
  - [x] Check color contrast compliance (WCAG 2.1 AA)
  - [x] Review subtle transition styles (cards, buttons, scrolling)

---

## Phase 3 — Development (Core Site Build)

- [x] Project Setup & Framework
  - [x] Initialize React + Vite project
  - [x] Set up Tailwind CSS with custom theme config (colors, font-families)
  - [x] Organize folder layout (`components/`, `sections/`, `data/`, `assets/`)
  - [x] Configure ESLint/Prettier rules
  - [x] Connect remote Git repository & push initial commit
- [x] Navigation & Layout shell
  - [x] Build sticky responsive Navbar
  - [x] Implement mobile toggle hamburger menu
  - [x] Build ThemeToggle (light/dark mode local state + class toggler)
  - [x] Implement smooth scroll logic or React Router routes
- [x] Hero / Landing Section
  - [x] Layout title, subtitle, tagline
  - [x] Connect profile photo with styling glow
  - [x] Add CTAs: View Projects, Download CV (linked to PDF), Contact Me
  - [x] Add initial reveal animation
- [x] About Section
  - [x] Layout bio paragraph & basic meta-details (Location, languages)
- [x] Skills Section
  - [x] Map categories from data layer
  - [x] Build category cards with wrapping pill badges
  - [x] Add hover styles for badges
- [x] Experience Section
  - [x] Build vertical timeline UI
  - [x] Map experience array (DDD, Class VP, SEC Marketing)
  - [x] Render date duration badges and bullets
- [x] Projects Section
  - [x] Implement category filter tabs (All, React, Full-stack)
  - [x] Build responsive project cards grid
  - [x] Link cards to GitHub and demo URLs
  - [x] Build empty fallback state for filters
- [x] Education & Certifications Sections
  - [x] Map education history (Norton, high school)
  - [x] Render certificates list
- [x] Volunteer Section
  - [x] Map volunteer roles (RISE by Tech for Kids, Technovation)
- [x] Contact Section
  - [x] Create layout for contact details & socials
  - [x] Implement contact form (Name, Email, Message inputs)
  - [x] Add client-side validation logic
  - [x] Add hidden honeypot spam protection input
- [x] Footer Component
  - [x] Render name, copyright, social icons, and privacy notice

---

## Phase 4 — Form Integration & SEO

- [x] Integrate contact form delivery
  - [x] Connect Formspree or EmailJS endpoint
  - [x] Implement submitting, error, and success form UI states
  - [x] Test end-to-end form email delivery
- [x] Configure SEO & Meta elements
  - [x] Inject title and description tags into `index.html`
  - [x] Set Open Graph and Twitter Card tags
  - [x] Create sitemap.xml
  - [x] Create robots.txt
  - [x] Set favicon and app icons

---

## Phase 5 — Quality Assurance & Testing

- [x] Run Performance & Bundle optimization
  - [x] Run Lighthouse audits (optimize for mobile score >= 90)
  - [x] Compress all images to WebP format
  - [x] Lazy-load projects/experiences below-the-fold
- [x] Accessibility Audits
  - [x] Add alt attributes to all image tags
  - [x] Check contrast ratios using developer tools
  - [x] Verify complete keyboard tab-index flow & focus outline styles
- [x] Cross-browser & Responsiveness smoke tests
  - [x] Test on Chrome, Firefox, Edge, Safari
  - [x] Test breakpoints from 320px to 1440px+
- [x] Pre-launch Reviews
  - [x] Double-check for typos and grammar
  - [x] Verify no private information is exposed in source code
  - [x] Share staging link with peers/lecturers and gather feedback

---

## Phase 6 — Public Launch

- [x] Deployment
  - [x] Build production application bundle
  - [x] Deploy production code to Vercel/Netlify hosting
  - [x] Connect custom domain and activate SSL certificate
- [x] Final Validation
  - [x] Run live site smoke test (scrolling, theme toggle, CV download, form delivery)
  - [x] Submit URL to Google Search Console
  - [x] Add portfolio link to LinkedIn and CV headers
