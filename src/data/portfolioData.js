export const personalInfo = {
  name: "Sareach Dim",
  title: "Final-Year Computer Science Student | Full-Stack Developer",
  tagline: "A results-driven full-stack developer passionate about building AI-powered web applications and solving complex digital problems.",
  bio: "I am a final-year Computer Science student at Norton University with hands-on experience in full-stack web development and AI document annotation. Having worked inside data workflows and class leadership structures, I excel at bridging the gap between clean code, database performance, and effective team coordination.",
  location: "ផ្ទះលេខ 092 G ផ្លូវ 103 ភូមិបាក់ទូក សង្កាត់ទួលសង្កែទី១ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ",
  languages: [
    { name: "Khmer", level: "Fluent" },
    { name: "English", level: "Intermediate" }
  ],
  email: "dimsareach009@gmail.com",
  phone: "071 28 32 071",
  github: "https://github.com/sareachdim",
  linkedin: "https://linkedin.com/in/sareach-dim",
};

export const skillsData = {
  languages: ["HTML5", "CSS3", "JavaScript (ES6+)", "PHP", "Python", "Java"],
  frontend: ["React.js", "Bootstrap", "Tailwind CSS"],
  backend: ["Django", "Django REST Framework (DRF)", "RESTful APIs"],
  databases: ["PostgreSQL", "MySQL"],
  tools: ["Git & GitHub", "VS Code", "DocWizz", "Microsoft Office"],
  softSkills: ["Problem-Solving", "Teamwork", "Time Management", "Critical Thinking", "Flexibility", "Creativity"]
};

export const experienceData = [
  {
    role: "Associate, Project",
    company: "Digital Divide Data",
    location: "Phnom Penh, Cambodia",
    period: "Sep 2025 – Jul 2026",
    bullets: [
      "Spearheaded document annotation via DocWizz for AI/OCR data projects, processing high-volume text inputs with 99% accuracy.",
      "Conducted quality assurance audits against guidelines to ensure clean dataset pipelines for machine learning models.",
      "Collaborated closely with cross-functional teams to meet and exceed daily production targets by 15%."
    ]
  },
  {
    role: "Vice Class President",
    company: "Norton University",
    location: "Phnom Penh, Cambodia",
    period: "2024 – 2025",
    bullets: [
      "Managed classroom operations, organized daily attendance, and resolved schedule adjustments for a class of 40+ students.",
      "Acted as primary liaison between class members and university administrators, resolving communication issues."
    ]
  },
  {
    role: "Marketing Intern",
    company: "Spring Education Center",
    location: "Phnom Penh, Cambodia",
    period: "Mar 2 – 30, 2024",
    bullets: [
      "Conducted digital and physical customer outreach, presenting educational services to over 100 potential clients.",
      "Facilitated virtual meetings and executed sales strategies, leading to a 10% increase in course enrollment registration."
    ]
  }
];

export const projectsData = [
  {
    id: 1,
    title: "AI Document Annotator Portal",
    description: "An annotation dashboard for AI/OCR data workflows, inspired by experience at Digital Divide Data. Speeds up data parsing and labeling pipelines.",
    techStack: ["React.js", "Django REST Framework", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/sareachdim/ai-document-annotator",
    demoUrl: "https://annotator-demo.sareachdim.com",
    category: "Full Stack"
  },
  {
    id: 2,
    title: "Classroom Coordination Hub",
    description: "A collaborative calendar and announcements hub built to assist Vice Class Presidents in managing class assignments, announcements, and schedules.",
    techStack: ["React.js", "Tailwind CSS", "Firebase Auth", "Firestore"],
    githubUrl: "https://github.com/sareachdim/classroom-coordination",
    demoUrl: null,
    category: "Frontend"
  },
  {
    id: 3,
    title: "RentEat: Cambodia Food Delivery API",
    description: "A backend service mimicking food ordering and delivery systems with role-based access control, JWT authentication, and Swagger docs.",
    techStack: ["Django", "Django REST Framework", "PostgreSQL", "JWT"],
    githubUrl: "https://github.com/sareachdim/renteat-api",
    demoUrl: null,
    category: "Backend"
  }
];

export const educationData = [
  {
    degree: "Bachelor of Computer Science (4th Year)",
    institution: "Norton University (NU)",
    location: "Phnom Penh, Cambodia",
    period: "2022 – Present"
  },
  {
    degree: "Baccalaureate Degree",
    institution: "Hun Sen Peamchikang High School",
    location: "Kampong Cham, Cambodia",
    period: "Graduated 2022"
  }
];

export const certificationsData = [
  {
    title: "Certificate of English Language Proficiency",
    issuer: "Norton University",
    year: "2025"
  },
  {
    title: "Career Acceleration Program",
    issuer: "Digital Divide Data",
    year: "2025"
  },
  {
    title: "Certificate of Appreciation (Class Monitor)",
    issuer: "Norton University",
    year: "2023 – 2024"
  }
];

export const volunteerData = [
  {
    role: "Volunteer Mentor",
    organization: "RISE by Tech for Kids Academy",
    period: "May – Aug 2025",
    description: "Mentored youth aged 8–18 in coding logic, hardware introduction, and digital entrepreneurship concepts."
  },
  {
    role: "Logistics Volunteer",
    organization: "Technovation Girls Cambodia x Future Digital Talents",
    period: "2025 Launching Day",
    description: "Coordinated guest check-ins, guided presentation teams, and supported tech stage setup for 200+ attendees."
  }
];
