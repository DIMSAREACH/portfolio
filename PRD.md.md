# Product Requirements Document (PRD)
## Sareach Dim — Personal Portfolio Website

**Author:** Sareach Dim
**Document version:** 1.0
**Date:** August 3, 2026
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose
Build a professional, responsive portfolio website for Sareach Dim, a final-year Computer Science student at Norton University, to showcase his full-stack development skills, work experience, projects, and volunteer contributions. The site will serve as a central hub for internship/job applications, networking, and demonstrating hands-on technical ability.

### 1.2 Background
Sareach currently has a strong CV covering:
- Full-stack skills (React.js, Django/DRF, PostgreSQL, JavaScript, Bootstrap/Tailwind)
- Professional experience at Digital Divide Data (document annotation for AI/OCR projects)
- Leadership experience (Vice Class President, Norton University)
- Internship experience (Spring Education Center — marketing)
- Volunteer work (RISE by Tech for Kids Academy, Technovation Girls Cambodia x Future Digital Talents)
- Certifications (English Language Proficiency, Career Acceleration Program)

A portfolio site will let this experience live in an interactive, visually engaging format rather than a static PDF.

### 1.3 Problem Statement
A CV alone cannot demonstrate coding ability, project quality, or design sensibility. Recruiters and hiring managers increasingly expect a live link to a portfolio/GitHub alongside a resume. Sareach currently has no such presence.

---

## 2. Goals & Success Metrics

### 2.1 Goals
| Goal | Description |
|---|---|
| Credibility | Present Sareach as a job-ready full-stack developer |
| Discoverability | Rank well when recruiters search his name; easy to share via one URL |
| Conversion | Drive visitors to contact him or download his CV |
| Showcase | Demonstrate real code/project quality, not just claims |

### 2.2 Success Metrics
- Site is live and mobile-responsive within the agreed timeline
- At least 3–5 real projects documented with live demo/GitHub links
- Contact form successfully delivers messages (tested end-to-end)
- Lighthouse performance score ≥ 90 on mobile
- Positive feedback from at least 2 lecturers/peers before public launch

---

## 3. Target Audience

| Persona | Need |
|---|---|
| Recruiters / HR at tech companies | Quickly assess skills, experience, and professionalism |
| Internship coordinators | See relevant project work and reliability signals (references, certificates) |
| Fellow students / collaborators | Understand what Sareach can build, reach out for team projects |
| Sareach himself | A living, updatable record of growth over time |

---

## 4. Scope

### 4.1 In Scope (v1)
- Single-page or multi-page responsive portfolio site
- Sections: Hero/Landing, About, Skills, Experience, Projects, Education, Certifications, Volunteer Work, Contact
- Downloadable CV (PDF)
- Contact form (email delivery)
- Dark/light mode toggle
- SEO basics (meta tags, Open Graph for link sharing)

### 4.2 Out of Scope (v1)
- Blog/CMS functionality
- Multi-language support (English/Khmer toggle) — candidate for v2
- User authentication or admin dashboard
- E-commerce or payment features

---

## 5. Site Structure & Content Requirements

### 5.1 Navigation
Home · About · Skills · Experience · Projects · Education · Contact

### 5.2 Section-by-Section Requirements

**Hero / Landing**
- Full name: Sareach Dim
- Title: "Final-Year Computer Science Student | Full-Stack Developer"
- Short tagline (1 sentence) pulling from profile summary
- Profile photo
- CTA buttons: "View Projects," "Download CV," "Contact Me"

**About**
- Adapted from CV profile: full-stack web development, AI-powered applications, passion for problem-solving
- Location: Phnom Penh, Cambodia
- Languages: Khmer (Fluent), English (Intermediate)

**Skills**
Grouped by category, ideally shown as tags or progress indicators:
- Languages: HTML5, CSS3, JavaScript (ES6+), PHP, Python, Java
- Frontend: React.js, Bootstrap, Tailwind CSS
- Backend: Django, Django REST Framework (DRF), RESTful APIs
- Databases: PostgreSQL, MySQL
- Tools: Git, GitHub, VS Code, DocWizz, Microsoft Office
- Soft skills: Problem-Solving, Teamwork, Time Management, Critical Thinking, Flexibility, Creativity

**Experience** (reverse chronological, from CV)
1. **Digital Divide Data**, Phnom Penh — Associate, Project (Sep 2025 – Jul 2026)
   - Document annotation via DocWizz for AI/OCR projects
   - Quality assurance against annotation guidelines
   - Cross-functional collaboration to meet daily production targets
2. **Norton University** — Vice Class President (2024–2025)
   - Classroom management, attendance, activity organization
3. **Spring Education Center** — Marketing Intern (Mar 2–30, 2024)
   - Customer outreach, physical/virtual meetings, sales strategy execution

*Note: consider reframing bullet points in first-person, results-oriented language for the website (e.g., quantify "20 students reached" as an outcome).*

**Projects** *(needs input from Sareach — CV does not list specific coding projects)*
- Recommend adding 3–5 projects that demonstrate the React/Django/PostgreSQL stack
- Each project card should include: title, short description, tech stack tags, screenshot, live demo link, GitHub repo link

**Education**
- Norton University (NU), Phnom Penh — Fourth-Year Computer Science Student (2022–Present)
- Hun Sen Peamchikang High School, Kampong Cham — Baccalaureate Degree (2022)

**Certifications**
- Certificate of English Language Proficiency — Norton University (2025)
- Career Acceleration Program — Digital Divide Data (2025)
- Certificate of Appreciation — Class Monitor, Norton University (2023–2024)

**Volunteer Work**
- RISE by Tech for Kids Academy — Volunteer (May–Aug 2025): coding/entrepreneurship programs for youth aged 8–18
- Technovation Girls Cambodia x Future Digital Talents — Logistics Volunteer (2025 Launching Day)

**Contact**
- Email: dimsareach009@gmail.com
- Phone: 071 28 32 071
- Location: Phnom Penh, Cambodia
- Contact form (name, email, message → sent via backend or a service like Formspree/EmailJS)
- Links: GitHub, LinkedIn *(to be created if not already present)*

> **Note:** Personal ID numbers, date of birth, and family record details from the uploaded documents should **not** appear anywhere on the public website for privacy and safety reasons.

---

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR1 | Site must be fully responsive (mobile, tablet, desktop) | Must |
| FR2 | Navigation bar with smooth scroll or routing to sections | Must |
| FR3 | Downloadable CV as PDF | Must |
| FR4 | Working contact form with email delivery and validation | Must |
| FR5 | Project cards with filters by tech stack (optional) | Should |
| FR6 | Dark/light mode toggle | Should |
| FR7 | Animations on scroll (subtle, performance-safe) | Could |
| FR8 | Khmer/English language toggle | Won't (v1) |

---

## 7. Non-Functional Requirements

- **Performance:** Page load under 2 seconds on 4G; Lighthouse score ≥ 90
- **Accessibility:** WCAG 2.1 AA basics — alt text, color contrast, keyboard navigation
- **SEO:** Meta title/description, Open Graph tags, sitemap.xml, favicon
- **Security:** Contact form protected against spam (honeypot or reCAPTCHA); no sensitive personal data (ID numbers, DOB specifics beyond age) exposed
- **Browser support:** Latest 2 versions of Chrome, Firefox, Safari, Edge

---

## 8. Recommended Tech Stack

Leveraging skills already listed on Sareach's CV:

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend (contact form/API) | Django + Django REST Framework |
| Database (if needed for a projects CMS) | PostgreSQL |
| Hosting (frontend) | Vercel or Netlify |
| Hosting (backend) | Render or Railway |
| Version control | Git + GitHub |

*Alternative lightweight option:* a static React (or plain HTML/CSS/JS + Bootstrap) site with a form service like Formspree/EmailJS, requiring no backend hosting — faster to ship for v1.

---

## 9. Design Requirements

- Clean, modern, professional aesthetic (avoid generic template look)
- Consistent color palette (2–3 primary colors + neutrals)
- Clear typography hierarchy (one heading font, one body font)
- Consistent iconography (e.g., Lucide or Font Awesome)
- Photo of Sareach used tastefully (hero section, about section)
- Whitespace-conscious layout; avoid clutter

---

## 10. Milestones & Timeline (Suggested)

| Phase | Deliverable | Est. Duration |
|---|---|---|
| 1. Content collection | Finalize bio, project write-ups, screenshots, CV PDF | 3–5 days |
| 2. Design | Wireframes + visual design/mockup | 3–5 days |
| 3. Development | Build responsive site, all sections functional | 1–2 weeks |
| 4. Contact form & integrations | Email delivery, analytics, SEO tags | 2–3 days |
| 5. QA & testing | Cross-browser, mobile, performance, accessibility checks | 2–3 days |
| 6. Launch | Deploy, connect custom domain (optional), share link | 1 day |

---

## 11. Open Questions / Inputs Needed from Sareach

1. Which 3–5 coding projects should be featured? (screenshots, live links, GitHub repos needed)
2. Is there a GitHub/LinkedIn profile to link to?
3. Preference: single-page scrolling site vs. multi-page site?
4. Custom domain desired (e.g., sareachdim.com) or subdomain (e.g., via Vercel/Netlify) acceptable for v1?
5. Should the reference (Ms. Lakhena Keo) be listed publicly, or available on request only?

---

## 12. Risks & Considerations

- **Privacy:** Avoid publishing sensitive identity document details (ID number, exact DOB, family info) — only professional info belongs on a public site.
- **Content gap:** CV lacks concrete coding project details; without 2–3 solid project write-ups, the "Projects" section will be the weakest part of the site and should be prioritized early.
- **Maintenance:** Plan to update the site each time a new project, internship, or certification is completed.