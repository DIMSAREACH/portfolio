# Phase Plan — Sareach Dim Portfolio Website
**Derived from:** PRD v1.0 — August 3, 2026  
**Status:** In Progress / Launching

---

## Overview

This document breaks the portfolio project into 6 sequential phases, each with clear goals, deliverables, tasks, and acceptance criteria. Phases are ordered to front-load content and decisions that unblock development, reducing rework later.

---

## Phase 1 — Content Collection & Decisions

**Estimated Duration:** 3–5 days  
**Goal:** Gather all raw content and resolve open questions before any design or code work begins.

### Tasks
- [x] Write/finalize 1-sentence tagline and About bio (adapted from CV profile)
- [x] Select 3–5 coding projects to feature; for each, prepare:
  - Project title and short description
  - Tech stack used
  - Screenshot(s)
  - Live demo URL (if available)
  - GitHub repository URL
- [x] Confirm GitHub profile URL (create if not yet public)
- [x] Confirm LinkedIn profile URL (create if not yet present)
- [x] Export final CV as a clean, print-ready PDF
- [x] Gather high-quality profile photo for Hero and About sections
- [x] Rephrase CV experience bullets in first-person, results-oriented language (quantify outcomes where possible)
- [x] Decide: single-page scrolling vs. multi-page routing
- [x] Decide: custom domain (e.g., `sareachdim.com`) or free subdomain via Vercel/Netlify for v1
- [x] Decide: reference (Ms. Lakhena Keo) listed publicly or "available on request"
- [x] Gather all certification images/PDFs if badges/images will be shown

### Deliverables
- `content-draft.md` — all text content written and approved
- `projects.md` — project entries with all fields filled
- `assets/` folder — photo, CV PDF, project screenshots collected
- Open questions from PRD §11 fully answered

### Acceptance Criteria
- All 9 site sections have finalized copy
- At least 3 projects are documented with screenshot + GitHub link
- CV PDF is ready to serve as a download

---

## Phase 2 — Design (Wireframes + Visual Mockup)

**Estimated Duration:** 3–5 days  
**Goal:** Establish the visual identity and layout before touching code. All design decisions are locked here to avoid churn in development.

### Tasks
- [x] Choose color palette (2–3 primary colors + neutrals; avoid generic defaults)
- [x] Choose typography: one heading font + one body font (e.g., from Google Fonts)
- [x] Choose icon library (Lucide Icons or Font Awesome)
- [x] Decide on dark/light mode color tokens for both themes
- [x] Sketch low-fidelity wireframes for all sections:
  - Hero / Landing
  - About
  - Skills (tag/badge layout)
  - Experience (timeline or card layout)
  - Projects (card grid with stack tags)
  - Education
  - Certifications
  - Volunteer Work
  - Contact (form + social links)
- [x] Create high-fidelity mockup (Figma or equivalent) for at least Hero, Projects, and Contact
- [x] Define responsive breakpoints: mobile (< 640px), tablet (640–1024px), desktop (> 1024px)
- [x] Define scroll animation style (subtle entrance animations only — no heavy effects)
- [x] Review mockup for accessibility: color contrast >= WCAG 2.1 AA, readable font sizes

### Deliverables
- Color palette & typography spec doc
- Low-fidelity wireframes for all sections
- High-fidelity mockup for at least 3 key sections
- Design tokens list (colors, spacing, font sizes for Tailwind config)

### Acceptance Criteria
- Design reviewed and approved by Sareach
- All sections have a clear layout blueprint
- Dark and light mode both designed
- Design passes basic color contrast check

---

## Phase 3 — Development (Core Site Build)

**Estimated Duration:** 1–2 weeks  
**Goal:** Build a fully functional, responsive site implementing all sections and the approved design. This is the largest phase.

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Routing | React Router (if multi-page) or smooth scroll (if single-page) |
| Icons | Lucide React or Font Awesome |
| Animations | Framer Motion (lightweight) or CSS transitions |
| Form handling | Formspree or EmailJS (no backend needed for v1) |
| Hosting | Vercel or Netlify |
| Version control | Git + GitHub |

### Tasks

#### Project Setup
- [x] Initialize React + Vite project
- [x] Configure Tailwind CSS with custom design tokens (colors, fonts, spacing)
- [x] Set up ESLint + Prettier
- [x] Create folder structure: `components/`, `assets/`, `sections/`, `hooks/`, `data/`
- [x] Set up Git repo and push initial commit

#### Navigation
- [x] Build responsive Navbar with links to all sections
- [x] Mobile hamburger menu
- [x] Dark/light mode toggle (FR6)
- [x] Smooth scroll (or React Router routes if multi-page) — FR2

#### Section — Hero / Landing
- [x] Full name, title, tagline
- [x] Profile photo with appropriate styling
- [x] CTA buttons: "View Projects", "Download CV" (PDF link), "Contact Me"
- [x] Subtle entrance animation

#### Section — About
- [x] Bio adapted from CV profile
- [x] Location and language display

#### Section — Skills
- [x] Grouped skill tags by category (Languages, Frontend, Backend, Databases, Tools, Soft Skills)
- [x] Visual treatment: badge/tag or progress indicators

#### Section — Experience
- [x] Reverse-chronological timeline or card layout
- [x] Three entries: Digital Divide Data, Norton University VP, Spring Education Center

#### Section — Projects
- [x] Project card grid (3–5 cards)
- [x] Each card: title, description, tech stack tags, screenshot, live demo link, GitHub link
- [x] Optional: filter by tech stack (FR5 — "Should" priority)

#### Section — Education
- [x] Norton University entry
- [x] Hun Sen Peamchikang High School entry

#### Section — Certifications
- [x] List of 3 certifications with issuer and year

#### Section — Volunteer Work
- [x] RISE by Tech for Kids Academy
- [x] Technovation Girls Cambodia x Future Digital Talents

#### Section — Contact
- [x] Contact info display (email, phone, location)
- [x] Social links: GitHub, LinkedIn
- [x] Contact form: name, email, message fields
- [x] Form validation (client-side)
- [x] Spam protection: honeypot field (FR security requirement)

#### Global
- [x] Scroll-triggered entrance animations (subtle — FR7)
- [x] Fully responsive layout across mobile, tablet, desktop (FR1)

### Acceptance Criteria
- All 9 sections rendered correctly on mobile, tablet, and desktop
- Dark/light mode toggle works across all sections
- CV PDF downloads successfully
- Project cards all link to correct GitHub repos / demos
- No console errors in browser dev tools

---

## Phase 4 — Contact Form & Integrations

**Estimated Duration:** 2–3 days  
**Goal:** Make the contact form deliver real emails, add analytics, and finalize SEO tags.

### Tasks

#### Contact Form Backend
- [x] Integrate Formspree or EmailJS with the contact form
- [x] Test end-to-end: submit form → email received at `dimsareach009@gmail.com`
- [x] Confirm validation error messages display correctly
- [x] Confirm honeypot anti-spam field is hidden from users but present in DOM

#### SEO
- [x] Add `<title>` and `<meta name="description">` for the site
- [x] Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- [x] Add Twitter Card meta tags
- [x] Create `sitemap.xml`
- [x] Add favicon.ico and app icon variants
- [x] Set `robots.txt`

#### Analytics (optional but recommended)
- [ ] Set up Google Analytics 4 or Plausible (privacy-friendly) to track visits

### Acceptance Criteria
- Contact form submits successfully and email is received
- Page shows rich preview when shared on LinkedIn/WhatsApp (Open Graph working)
- Lighthouse SEO score >= 90
- No sensitive personal data (ID number, DOB) exposed anywhere in HTML source

---

## Phase 5 — QA & Testing

**Estimated Duration:** 2–3 days  
**Goal:** Validate quality, performance, accessibility, and cross-browser compatibility before launch.

### Tasks

#### Performance
- [ ] Run Lighthouse audit on mobile — target score >= 90 (NFR requirement)
- [x] Compress and optimize all images (WebP format preferred)
- [x] Lazy-load images below the fold
- [ ] Review bundle size; eliminate unused dependencies

#### Accessibility (WCAG 2.1 AA)
- [x] Verify alt text on all images including profile photo
- [x] Verify color contrast meets AA ratio for both light and dark modes
- [ ] Test keyboard navigation through all interactive elements (nav, form, buttons)
- [ ] Check focus states are visible

#### Cross-Browser Testing
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

#### Responsive / Device Testing
- [ ] iPhone SE (375px width)
- [ ] Standard mobile (390px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px+)

#### Content Review
- [x] Proofread all text for typos and grammar
- [x] Verify all links (GitHub, LinkedIn, demo URLs) work and are not 404
- [x] Verify CV PDF downloads correctly and is the latest version
- [x] Confirm no private data (ID numbers, exact DOB, family info) appears anywhere
- [x] Confirm reference is displayed per Sareach's preference (public or "on request")

#### Peer Review
- [ ] Share staging link with at least 2 lecturers/peers for feedback (success metric)
- [ ] Action any critical feedback before launch

### Acceptance Criteria
- Lighthouse mobile score >= 90 across Performance, Accessibility, Best Practices, SEO
- Zero broken links
- Passes cross-browser smoke test on all 4 browsers
- Approved by Sareach and at least 2 reviewers

---

## Phase 6 — Launch & Deployment

**Estimated Duration:** 1 day  
**Goal:** Make the site publicly live, connect a domain if desired, and announce.

### Tasks
- [ ] Deploy production build to Vercel or Netlify
- [ ] (Optional) Connect custom domain (e.g., `sareachdim.com`) with HTTPS
- [ ] Verify live URL loads correctly on mobile and desktop
- [ ] Final smoke test: contact form, CV download, all section navigation
- [x] Update GitHub repository README with live site link and tech stack
- [ ] Submit URL to Google Search Console for indexing
- [ ] Share live link on LinkedIn, GitHub profile bio, and in CV header URL

### Acceptance Criteria
- Site is publicly accessible at a stable URL
- HTTPS is active (no browser security warnings)
- Google Search Console shows no critical crawl errors
- Live URL is added to Sareach's LinkedIn profile and CV

---

## Phase Summary

| # | Phase | Duration | Key Output |
|---|---|---|---|
| 1 | Content Collection & Decisions | 3–5 days | Finalized copy, assets, project entries, open questions resolved |
| 2 | Design | 3–5 days | Wireframes, high-fidelity mockup, design tokens |
| 3 | Development | 1–2 weeks | Fully built, responsive React site — all sections functional |
| 4 | Contact Form & Integrations | 2–3 days | Working email form, SEO tags, analytics |
| 5 | QA & Testing | 2–3 days | Lighthouse >= 90, cross-browser pass, peer-reviewed |
| 6 | Launch | 1 day | Live public URL, domain connected, indexed |

**Total Estimated Duration:** ~3–4 weeks

---

## Dependencies & Risks

| Risk | Mitigation |
|---|---|
| Projects section content not ready | Prioritize collecting 3 project write-ups in Phase 1; this is the highest-value section |
| No GitHub/LinkedIn profile yet | Create both in Phase 1 before development begins |
| Form integration fails | Use Formspree as the default (no backend needed); test in Phase 4 before QA |
| Performance issues with animations | Use CSS transitions over JavaScript-heavy libraries; test with Lighthouse early in Phase 5 |
| Custom domain setup delays | Default to Vercel subdomain for launch; migrate domain later as a post-launch task |
| Private data accidentally exposed | Add a content checklist item in both Phase 3 and Phase 5 to audit the HTML source |

---

## Privacy Reminder

> **Do not publish** on the site: ID card numbers, exact date of birth, family record details, or any sensitive identity documents. Only professional information (name, contact email, phone, location city) belongs on a public portfolio.
