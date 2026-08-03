# Technical & Visual Design Document (Design.md)
**Project:** Sareach Dim — Personal Portfolio Website  
**Derived from:** [PRD.md.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/PRD.md.md) & [Phase.md](file:///d:/Year4/S2/Build%20Own%20Project/Portfolio/Phase.md)  
**Status:** Approved for Implementation

---

## 1. Visual Design System

To ensure a premium, modern, and professional aesthetic (avoiding a generic template look), the site uses the **"Neo-Minimalist Slate & Indigo"** theme. It relies on glassmorphism, subtle gradients, and clean geometric structures.

### 1.1 Color Palettes

The site supports a native dark and light mode. The color system uses CSS custom properties configured with Tailwind CSS classes.

#### Dark Mode (Default / Preferred)
*   **Primary Background:** Deep Slate-950 (`#090d16`)
*   **Secondary Background:** Slate-900 (`#0f172a`)
*   **Card Background:** Semi-transparent Slate-900/60 (`rgba(15, 23, 42, 0.6)`) with `backdrop-blur-md`
*   **Primary Text:** Slate-50 (`#f8fafc`)
*   **Secondary Text:** Slate-400 (`#94a3b8`)
*   **Brand Accent:** Indigo-500 (`#6366f1`) to Violet-600 (`#7c3aed`) gradient
*   **Success/Highlight Accent:** Teal-400 (`#2dd4bf`)
*   **Border Color:** Slate-800/80 (`rgba(30, 41, 59, 0.8)`)

#### Light Mode
*   **Primary Background:** Slate-50 (`#f8fafc`)
*   **Secondary Background:** White (`#ffffff`)
*   **Card Background:** Semi-transparent White/75 (`rgba(255, 255, 255, 0.75)`) with `backdrop-blur-md`
*   **Primary Text:** Slate-900 (`#0f172a`)
*   **Secondary Text:** Slate-600 (`#475569`)
*   **Brand Accent:** Indigo-600 (`#4f46e5`) to Violet-700 (`#6d28d9`) gradient
*   **Success/Highlight Accent:** Teal-600 (`#0d9488`)
*   **Border Color:** Slate-200/80 (`rgba(226, 232, 240, 0.8)`)

---

### 1.2 Typography

We use Google Fonts loaded via HTML links to provide a modern, high-quality reading experience:
*   **Heading Font (H1, H2, H3):** **Outfit** (Geometric Sans-Serif, weights: 500, 600, 700) — clean, professional, and slightly futuristic.
*   **Body Font (Paragraphs, Lists, Labels):** **Inter** (Highly legible UI font, weights: 400, 500, 600) — optimized for readability across screen sizes.

```css
/* Custom utility for titles */
.font-heading {
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.02em;
}
.font-body {
  font-family: 'Inter', sans-serif;
}
```

---

### 1.3 Spacing & Borders
*   **Standard Cards:** `rounded-2xl` (16px border-radius) with a thin `1px` border to emphasize structure.
*   **Pill Tags:** `rounded-full` for skill tags and tech stack chips.
*   **Section Spacing:** `py-16 md:py-24` (80px to 96px vertical padding) to create breathing room (whitespace-conscious).
*   **Max Width Container:** `max-w-6xl` (1152px) to ensure comfortable line-lengths on ultra-wide screens.

---

## 2. Component Hierarchy & Architecture

The application is structured as a single-page app (SPA) with smooth scrolling and local state.

### 2.1 File Structure
```text
src/
├── assets/
│   ├── profile.jpg
│   ├── sareach-dim-cv.pdf
│   └── project-screenshots/
├── components/
│   ├── Navbar.jsx         # Floating responsive header with dark mode toggle
│   ├── Footer.jsx         # Bottom footer with socials and privacy notes
│   ├── ProjectCard.jsx    # Glassmorphic project display card
│   ├── ExperienceCard.jsx # Timeline or card style experience item
│   ├── VolunteerCard.jsx  # Card layout for volunteering
│   ├── SkillGroup.jsx     # Accordion or categorised tag group
│   └── ThemeToggle.jsx    # Animated light/dark switch
├── data/
│   ├── projects.js        # Structured data for portfolio items
│   ├── experience.js      # Structured data for roles
│   ├── education.js       # Structured data for schools
│   ├── skills.js          # Categorised list of tech skills
│   └── certifications.js  # List of certificates
├── sections/
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Experience.jsx
│   ├── Projects.jsx
│   ├── Education.jsx
│   ├── Certifications.jsx
│   ├── Volunteer.jsx
│   └── Contact.jsx
├── App.jsx                # Main orchestrator
├── index.css              # Custom Tailwind directives & base styles
└── main.jsx               # React entry point
```

---

### 2.2 Global State & Contexts
*   **Theme Context:** Tracks `dark` vs `light` mode. Saves preference to `localStorage` and toggles the `.dark` class on the `<html>` document.
*   **Menu Context:** Tracks whether the mobile navigation drawer is open or closed.
*   **Active Section State:** Uses an `IntersectionObserver` hook to highlight the current section in the Navbar.

---

## 3. Section Layouts & Design Mockup Blueprints

### 3.1 Hero / Landing Section
*   **Visual Layout:** Split-pane layout (Desktop).
    *   *Left Pane (60%):* Large Outfit heading with gradient text (Indigo to Violet). Subtitle with high-contrast badge. Short tagline. Responsive CTA button group (primary gradient button for "View Projects", outline button for "Download CV", link for "Contact Me").
    *   *Right Pane (40%):* Circular profile picture with a soft glowing accent background (glowing Indigo shadow in dark mode, clean ring in light mode).
*   **Responsive Flow:** Stacked vertically on mobile, photo centered at the top or middle, text center-aligned.

### 3.2 Skills Section
*   **Visual Layout:** A grid of cards, each card representing a skill category (Languages, Frontend, Backend, Databases, Tools, Soft Skills).
*   **Inside each card:** A flex wrap container of skill badges.
*   **Badge Design:** Modern dark/light theme pill buttons. Hovering over a badge reveals a subtle color change matching the category (e.g., green for backend, blue for frontend).

### 3.3 Projects Grid Section (with Filter)
*   **Visual Layout:** Tabbed category filters at the top (All, React, Backend, Databases/Full Stack). Underneath, a dynamic CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) displaying the project cards.
*   **Card details:**
    *   Image container at the top with a subtle zoom hover effect.
    *   Card body containing title, 2-line description, and small skill chips.
    *   Card footer with text-links or icon-buttons for "Live Demo" and "GitHub Code".
*   **Empty State:** If a filter has no items, display a clean placeholder card with a CTA to check other filters.

### 3.4 Experience & Volunteer Section
*   **Visual Layout:** Vertical timeline indicator (a thin gradient line down the center/left) with cards sprouting off to the right (or alternating side-by-side on desktop).
*   **Card Details:** Role title, organization name with logo placeholder, date duration badge, bullet points reframed in results-oriented language.

### 3.5 Contact Section & Form
*   **Visual Layout:** Two-column grid (Desktop).
    *   *Left Column:* Contact info blocks (Email, Phone, Phnom Penh location) with modern Lucide icons, and links to GitHub/LinkedIn.
    *   *Right Column:* A clean contact form containing Name, Email, and Message inputs. Includes floating label inputs or clean borders with focus-glow states.
*   **Form States:**
    *   *Default:* Border Slate-300 (light) / Slate-700 (dark).
    *   *Focus:* Border Indigo-500, ring Indigo-500/20.
    *   *Validation Success:* Border Green-500, ring Green-500/20.
    *   *Validation Error:* Border Red-500, ring Red-500/20.
    *   *Submitting:* Disable inputs, change button to spinner + "Sending...".
    *   *Success Message:* Replaces form with a smooth fade-in illustration + thank you message.

---

## 4. Interactive Micro-Animations & Motion Design

We use subtle transitions and scroll effects to make the site feel responsive and premium without impacting performance.

*   **Dark/Light Toggle Transition:** The background color shift uses `transition-colors duration-300 ease-in-out` on the body. The toggle switch icon rotates 90 degrees and fades between sun/moon icons.
*   **Scroll-driven Reveal:** Sections fade and slide up slightly as they enter the viewport using pure CSS transitions or a lightweight `framer-motion` variant:
    ```javascript
    const fadeInUp = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };
    ```
*   **Navbar Sticky Effect:** On scroll, the Navbar transitions from fully transparent to a glassmorphic background (`bg-slate-900/80 backdrop-blur-md` on dark / `bg-white/80 backdrop-blur-md` on light) with a subtle bottom border shadow.
*   **Card Hover State:** Project cards translate upward by `4px` (`hover:-translate-y-1`) and increase drop-shadow opacity.
*   **Button Hover State:** Gradient CTAs grow a soft radial background glow on hover, and icon indicators (like arrows or icons) shift `2px` in their target direction (`hover:translate-x-0.5`).

---

## 5. Accessibility (A11y) & SEO Requirements

### 5.1 Accessibility Checklist (WCAG 2.1 AA Compliant)
*   **Contrast:** Text color tokens guarantee contrast ratio >= 4.5:1 against card/page backgrounds.
*   **Semantic Elements:** Map layout components to standard HTML5 tags:
    *   Header / Navigation -> `<header>`, `<nav>`
    *   Hero -> `<section aria-label="Introduction">`
    *   Sections -> `<section>` with clear `<h2 id="...">` headings.
    *   Contact Form -> `<form>` with `<label>` tags explicitly linked to `<input>` and `<textarea>` using `htmlFor` and `id`.
*   **Keyboard Navigation:** All interactive elements (Navbar links, Filter tabs, CTA buttons, input fields) must be focusable using the `Tab` key, displaying a prominent outline ring:
    ```css
    *:focus-visible {
      outline: 2px solid var(--color-indigo-500);
      outline-offset: 2px;
    }
    ```
*   **Images:** Alt tags mandatory on all images (`alt="Sareach Dim Profile Photo"`, `alt="Project screenshot showing dashboard"`).

### 5.2 SEO Configuration
*   **Meta Details:**
    *   Title: `Sareach Dim | Full-Stack Developer Portfolio`
    *   Description: `Professional full-stack portfolio of Sareach Dim, Computer Science student at Norton University. Showcasing projects built with React, Django, PostgreSQL, and Tailwind CSS.`
*   **Open Graph Tags:**
    ```html
    <meta property="og:title" content="Sareach Dim | Full-Stack Developer Portfolio" />
    <meta property="og:description" content="Explore projects, experience, and full-stack skills." />
    <meta property="og:image" content="https://sareachdim.com/og-image.jpg" />
    <meta property="og:type" content="website" />
    ```
*   **Robots & Sitemap:** Set `robots.txt` to allow indexation, and link to a auto-generated `sitemap.xml` listing the home page.

---

## 6. Structured Content Schemas (Data Layer)

To maintain a clean frontend, all content is separated into structured data files. This enables quick updates when Sareach earns new certificates or projects.

### 6.1 Project Schema (`src/data/projects.js`)
```javascript
export const projects = [
  {
    id: "proj-1",
    title: "AI Document Annotator Portal",
    description: "An annotation dashboard for AI/OCR data workflows, inspired by experience at Digital Divide Data. Speeds up data parsing pipelines.",
    techStack: ["React.js", "Django REST Framework", "PostgreSQL", "Tailwind CSS"],
    imageUrl: "/assets/project-screenshots/annotator.webp",
    demoUrl: "https://annotator-demo.sareachdim.com",
    githubUrl: "https://github.com/sareachdim/ai-document-annotator",
    featured: true
  },
  {
    id: "proj-2",
    title: "Classroom Coordination Platform",
    description: "A collaborative calendar and announcements hub built to assist Vice Class Presidents in managing assignments and schedules.",
    techStack: ["React.js", "Tailwind CSS", "Firebase Auth", "Firestore"],
    imageUrl: "/assets/project-screenshots/classroom.webp",
    demoUrl: null, // Available on Request or GitHub-only
    githubUrl: "https://github.com/sareachdim/classroom-coordination",
    featured: true
  }
];
```

### 6.2 Skills Schema (`src/data/skills.js`)
```javascript
export const skills = {
  languages: [
    { name: "HTML5/CSS3", icon: "html5" },
    { name: "JavaScript (ES6+)", icon: "javascript" },
    { name: "Python", icon: "python" },
    { name: "PHP", icon: "php" },
    { name: "Java", icon: "java" }
  ],
  frontend: [
    { name: "React.js", icon: "react" },
    { name: "Tailwind CSS", icon: "tailwind" },
    { name: "Bootstrap", icon: "bootstrap" }
  ],
  backend: [
    { name: "Django", icon: "django" },
    { name: "Django REST Framework", icon: "drf" },
    { name: "RESTful APIs", icon: "api" }
  ],
  databases: [
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MySQL", icon: "mysql" }
  ],
  tools: [
    { name: "Git & GitHub", icon: "github" },
    { name: "VS Code", icon: "vscode" }
  ],
  softSkills: [
    "Problem-Solving", "Teamwork", "Time Management", "Critical Thinking", "Flexibility", "Creativity"
  ]
};
```
