# Sareach Dim — Professional Portfolio Website

A highly polished, responsive, and animated modern portfolio website showcasing full-stack engineering expertise, AI data specialty, and academic leadership background.

![Portfolio Preview](/public/assets/logo.png)

## 🌐 Live URL
- **Live Demo:** [sareachdim.vercel.app](https://sareachdim.vercel.app/)
- **GitHub Repository:** [github.com/DIMSAREACH/portfolio](https://github.com/DIMSAREACH/portfolio)

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Core Frontend** | [React.js](https://reactjs.org/) + JavaScript (ES6+) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Custom theme variables & utility extensions) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing & Scroll** | Smooth anchor scrolling with Active Navigation Highlighting |
| **Animations** | Lightweight CSS animations & scroll-triggered reveal hooks using `IntersectionObserver` |
| **Form Processing** | [Formspree](https://formspree.io/) (Secure serverless contact form submission) |
| **Deployment** | [Vercel](https://vercel.com/) (Automated CI/CD from main branch) |

---

## ✨ Features

- **Double Theme Mode:** Sleek dark mode toggled via persistence-state custom toggle (`localStorage` & prefers-color-scheme).
- **Subtle Scroll Reveals:** Clean entrance animations (`fade-in-up`, `slide-in`, `staggered-delays`) using custom React reveal hooks.
- **Angkor Wat Branding Logo:** Custom icon branding representing Cambodian heritage integrated seamlessly in header, favicon, and footer.
- **Responsive Layout:** Expanded full-width layout (`max-w-7xl`) tested across mobile, tablet, and ultra-wide desktop breakpoints.
- **Secure Spam-Protected Form:** Fully validated inputs with a honeypot field to block automated spambots.
- **Direct PDF Download:** Direct CV download action integrated in the Hero landing and About bio section.

---

## 📂 Project Structure

```text
├── public/
│   ├── assets/               # Profile photo, logo, and design assets
│   ├── robots.txt            # Search engine crawlers setup
│   ├── sitemap.xml           # Search engine sitemap indexing
│   └── sareach-dim-cv.pdf    # CV PDF serving action
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar header
│   │   ├── Footer.jsx        # Footer layout
│   │   └── ThemeToggle.jsx   # Dark/light theme persistence switcher
│   ├── hooks/
│   │   └── useScrollReveal.js# Scroll animation trigger hook
│   ├── sections/
│   │   ├── Hero.jsx          # Hero landing header & statistics
│   │   ├── About.jsx         # Biography and core stacks
│   │   ├── Skills.jsx        # Skills grid by categories
│   │   ├── Experience.jsx    # Reverse-chronological timeline
│   │   ├── Projects.jsx      # Projects grid with category filters
│   │   ├── EducationCertificates.jsx # Education lists and references
│   │   ├── Volunteer.jsx     # Volunteering cards and quote
│   │   └── Contact.jsx       # Validation contact form & Google Maps
│   ├── data/
│   │   └── portfolioData.js  # Clean structured JSON database file
│   ├── App.jsx               # Entry component routing
│   ├── index.css             # Main styling rules and animations
│   └── main.jsx              # React app mount
├── index.html                # Document structure, fonts, and meta-tags
├── tailwind.config.js        # Custom styling design tokens config
└── vite.config.js            # Vite build parameters
```

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DIMSAREACH/portfolio.git
   cd portfolio
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Compile production build bundle:**
   ```bash
   npm run build
   ```

---

## 📄 License & Privacy
- **Privacy:** No sensitive personal data (e.g. ID numbers, exact DOB) is exposed in the HTML codebase.
- **Reference:** Academic references are available upon request.
