import mongoose, { Types } from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import User, { IUser } from '../src/models/User';
import Profile from '../src/models/Profile';
import Category, { ICategory } from '../src/models/Category';
import Skill from '../src/models/Skill';
import Experience from '../src/models/Experience';
import Education from '../src/models/Education';
import Certification from '../src/models/Certification';
import SocialLink from '../src/models/SocialLink';
import Settings from '../src/models/Settings';
import Project from '../src/models/Project';
import BlogPost from '../src/models/BlogPost';
import Message from '../src/models/Message';
import Media from '../src/models/Media';
import logger from '../src/utils/logger';

export interface SeedSummary {
  users: number;
  profile: number;
  categories: number;
  skills: number;
  experience: number;
  education: number;
  certifications: number;
  socialLinks: number;
  settings: number;
  projects: number;
  blogPosts: number;
  messages: number;
  media: number;
}

export interface SeedOptions {
  clear?: boolean;
  force?: boolean;
  disconnectOnFinish?: boolean;
}

export const ADMIN_DEFAULTS = {
  email: 'admin@portfolio.dev',
  password: 'Admin@123456',
  fullName: 'Dimsa Reach',
  role: 'admin' as const,
};

export const PROFILE_SEED = {
  fullName: { en: 'Dimsa Reach', kh: 'ដារឹមសា រ្យាច' },
  title: { en: 'Full-Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍ Full-Stack' },
  introduction: {
    en: 'Passionate developer building modern web applications with Angular, Node.js, and MongoDB.',
    kh: 'អ្នកអភិវឌ្ឍន៍ដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតកម្មវិធីវែបទំនើបជាមួយ Angular, Node.js និង MongoDB។',
  },
  about: {
    en: 'I am a full-stack developer with expertise in building scalable web architectures, modern reactive frontends, and robust backend microservices. I specialize in Angular, Node.js, TypeScript, and MongoDB, with hands-on experience in machine learning and computer vision. Committed to clean code, test-driven development, and delivering high-performance digital experiences.',
    kh: 'ខ្ញុំជាអ្នកអភិវឌ្ឍន៍ Full-Stack ដែលមានជំនាញក្នុងការបង្កើតស្ថាបត្យកម្មវែបខ្នាតធំ ផ្នែកខាងមុខបែបទំនើប និងសេវាកម្មខាងក្រោយដ៏រឹងមាំ។ ខ្ញុំមានជំនាញពិសេសក្នុង Angular, Node.js, TypeScript និង MongoDB ព្រមទាំងមានបទពិសោធន៍ផ្ទាល់ក្នុងការរៀនម៉ាស៊ីន (Machine Learning) និង Computer Vision។ ខ្ញុំប្តេជ្ញាចិត្តចំពោះកូដស្អាត ការអភិវឌ្ឍផ្អែកលើការធ្វើតេស្ត និងការផ្តល់នូវបទពិសោធន៍ឌីជីថលដែលមានប្រសិទ្ធភាពខ្ពស់។',
  },
  professionalSummary: {
    en: 'Experienced in end-to-end web engineering, API design, database modeling, and cloud deployments.',
    kh: 'មានបទពិសោធន៍ក្នុងការបង្កើតគេហទំព័រទាំងស្រុង ការរចនា API ការបង្កើតគំរូមូលដ្ឋានទិន្នន័យ និងការដាក់ឱ្យដំណើរការលើ Cloud។',
  },
  careerInterests: {
    en: 'Full-Stack Web Development, Cloud Computing, AI-powered Applications, Distributed Systems.',
    kh: 'ការអភិវឌ្ឍន៍វែប Full-Stack, Cloud Computing, កម្មវិធីដែលដំណើរការដោយ AI, និងប្រព័ន្ធចែកចាយ។',
  },
  background: {
    en: 'Computer Science graduate with deep focus on modern web standards and software architecture.',
    kh: 'បញ្ចប់ការសិក្សាផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ ដោយផ្តោតយ៉ាងស៊ីជម្រៅលើស្តង់ដារវែបទំនើប និងស្ថាបត្យកម្មសូហ្វវែរ។',
  },
  strengths: {
    en: [
      'Full-Stack Architecture',
      'TypeScript / JavaScript',
      'Responsive & Accessible UI',
      'RESTful & Clean APIs',
      'Database Optimization',
    ],
    kh: [
      'ស្ថាបត្យកម្ម Full-Stack',
      'TypeScript / JavaScript',
      'UI ឆ្លើយតប និងងាយស្រួលប្រើ',
      'API ស្តង់ដារ RESTful',
      'ការបង្កើនប្រសិទ្ធភាពទិន្នន័យ',
    ],
  },
  goals: {
    en: 'To architect impactful software solutions that solve real-world problems and empower communities.',
    kh: 'បង្កើតដំណោះស្រាយសូហ្វវែរដែលមានប្រសិទ្ធភាព ដើម្បីដោះស្រាយបញ្ហាជាក់ស្តែង និងជួយលើកកម្ពស់សហគមន៍។',
  },
  profileImage:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
  aboutImage:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
  email: 'contact@portfolio.dev',
  phone: '+855 12 345 678',
  location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ, កម្ពុជា' },
};

export const CATEGORIES_SEED = [
  {
    name: { en: 'Web Application', kh: 'កម្មវិធីវែប' },
    slug: 'web-application',
    description: {
      en: 'Modern web applications and digital platforms',
      kh: 'កម្មវិធីវែបទំនើប និងវេទិកាឌីជីថល',
    },
    type: 'both' as const,
    order: 1,
  },
  {
    name: { en: 'Mobile App', kh: 'កម្មវិធីទូរស័ព្ទ' },
    slug: 'mobile-app',
    description: {
      en: 'Cross-platform and native mobile applications',
      kh: 'កម្មវិធីទូរស័ព្ទដៃទំនើប',
    },
    type: 'project' as const,
    order: 2,
  },
  {
    name: { en: 'AI/ML', kh: 'បញ្ញាសិប្បនិម្មិត និងម៉ាស៊ីនរៀន' },
    slug: 'ai-ml',
    description: {
      en: 'Artificial intelligence and computer vision projects',
      kh: 'គម្រោងបញ្ញាសិប្បនិម្មិត និង Computer Vision',
    },
    type: 'both' as const,
    order: 3,
  },
  {
    name: { en: 'System Design', kh: 'ការរចនាប្រព័ន្ធ' },
    slug: 'system-design',
    description: {
      en: 'Software architecture and distributed systems',
      kh: 'ស្ថាបត្យកម្មសូហ្វវែរ និងប្រព័ន្ធចែកចាយ',
    },
    type: 'both' as const,
    order: 4,
  },
  {
    name: { en: 'Tutorial', kh: 'មេរៀន និងការណែនាំ' },
    slug: 'tutorial',
    description: {
      en: 'Step-by-step guides and technical walkthroughs',
      kh: 'ការណែនាំជាជំហានៗ និងការអនុវត្តបច្ចេកទេស',
    },
    type: 'blog' as const,
    order: 5,
  },
  {
    name: { en: 'Technical', kh: 'បច្ចេកទេសទូទៅ' },
    slug: 'technical',
    description: {
      en: 'In-depth engineering analysis and best practices',
      kh: 'ការវិភាគវិស្វកម្មស៊ីជម្រៅ និងការអនុវត្តល្អបំផុត',
    },
    type: 'blog' as const,
    order: 6,
  },
];

export const SKILLS_SEED = [
  // Frontend
  {
    name: 'Angular',
    category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
    icon: 'angular',
    order: 1,
    isVisible: true,
  },
  {
    name: 'TypeScript',
    category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
    icon: 'typescript',
    order: 2,
    isVisible: true,
  },
  {
    name: 'React',
    category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
    icon: 'react',
    order: 3,
    isVisible: true,
  },
  {
    name: 'HTML5 & CSS3',
    category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
    icon: 'html5',
    order: 4,
    isVisible: true,
  },
  // Backend
  {
    name: 'Node.js',
    category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
    icon: 'nodejs',
    order: 1,
    isVisible: true,
  },
  {
    name: 'Express.js',
    category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
    icon: 'express',
    order: 2,
    isVisible: true,
  },
  {
    name: 'Django',
    category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
    icon: 'django',
    order: 3,
    isVisible: true,
  },
  // Database
  {
    name: 'MongoDB',
    category: { en: 'Database', kh: 'មូលដ្ឋានទិន្នន័យ' },
    icon: 'mongodb',
    order: 1,
    isVisible: true,
  },
  {
    name: 'PostgreSQL',
    category: { en: 'Database', kh: 'មូលដ្ឋានទិន្នន័យ' },
    icon: 'postgresql',
    order: 2,
    isVisible: true,
  },
  // Tools & DevOps
  {
    name: 'Docker',
    category: { en: 'Tools & DevOps', kh: 'ឧបករណ៍ និង DevOps' },
    icon: 'docker',
    order: 1,
    isVisible: true,
  },
  {
    name: 'Git & GitHub',
    category: { en: 'Tools & DevOps', kh: 'ឧបករណ៍ និង DevOps' },
    icon: 'git',
    order: 2,
    isVisible: true,
  },
  {
    name: 'Linux & Nginx',
    category: { en: 'Tools & DevOps', kh: 'ឧបករណ៍ និង DevOps' },
    icon: 'linux',
    order: 3,
    isVisible: true,
  },
];

export const EXPERIENCE_SEED = [
  {
    title: { en: 'Full-Stack Software Engineer', kh: 'វិស្វករសូហ្វវែរ Full-Stack' },
    organization: { en: 'Tech Innovations Cambodia', kh: 'ក្រុមហ៊ុន តិច អ៊ីណូវេសិន ខេមបូឌា' },
    location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ, កម្ពុជា' },
    type: 'work' as const,
    startDate: new Date('2023-01-01'),
    isCurrent: true,
    description: {
      en: 'Developing enterprise web applications and REST APIs using modern TypeScript frameworks.',
      kh: 'អភិវឌ្ឍកម្មវិធីវែបសហគ្រាស និង REST APIs ដោយប្រើបច្ចេកវិទ្យា TypeScript ទំនើប។',
    },
    responsibilities: {
      en: [
        'Architected scalable microservices using Node.js and Express',
        'Developed reactive single-page applications with Angular 19',
        'Optimized MongoDB database queries reducing response times by 40%',
      ],
      kh: [
        'រៀបចំស្ថាបត្យកម្ម Microservices ដោយប្រើ Node.js និង Express',
        'អភិវឌ្ឍកម្មវិធីគេហទំព័រ Single Page ដោយប្រើ Angular 19',
        'បង្កើនប្រសិទ្ធភាពសំណួរទិន្នន័យ MongoDB កាត់បន្ថយពេលរង់ចាំ ៤០%',
      ],
    },
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
    order: 1,
  },
  {
    title: { en: 'Junior Web Developer', kh: 'អ្នកអភិវឌ្ឍន៍វែបកម្រិតដំបូង' },
    organization: { en: 'Digital Solutions Lab', kh: 'មន្ទីរពិសោធន៍ ឌីជីថល សូលូសិន' },
    location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ, កម្ពុជា' },
    type: 'internship' as const,
    startDate: new Date('2022-03-01'),
    endDate: new Date('2022-12-31'),
    isCurrent: false,
    description: {
      en: 'Collaborated on frontend UI components, responsive layouts, and REST API integration.',
      kh: 'សហការបង្កើតសមាសធាតុ UI ផ្នែកខាងមុខ រចនាប្លង់ឆ្លើយតប និងតភ្ជាប់ជាមួយ REST API។',
    },
    responsibilities: {
      en: [
        'Built reusable UI components with HTML, CSS, and modern JavaScript',
        'Integrated third-party APIs and payment gateways',
        'Participated in agile code reviews and sprint planning',
      ],
      kh: [
        'បង្កើត UI Components ឡើងវិញបានជាមួយ HTML, CSS និង JavaScript',
        'តភ្ជាប់ API ភាគីទីបី និងប្រព័ន្ធទូទាត់ប្រាក់',
        'ចូលរួមការត្រួតពិនិត្យកូដ និងការរៀបចំគម្រោងបែប Agile',
      ],
    },
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Git'],
    order: 2,
  },
];

export const EDUCATION_SEED = [
  {
    institution: {
      en: 'Royal University of Phnom Penh (RUPP)',
      kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
    },
    degree: { en: 'Bachelor of Science', kh: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ' },
    field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
    startYear: 2020,
    endYear: 2024,
    gpa: '3.85 / 4.00',
    description: {
      en: 'Focused on software engineering, algorithm analysis, computer networks, and artificial intelligence.',
      kh: 'ផ្តោតលើវិស្វកម្មសូហ្វវែរ ការវិភាគក្បួនដោះស្រាយ បណ្តាញកុំព្យូទ័រ និងបញ្ញាសិប្បនិម្មិត។',
    },
    activities: {
      en: [
        'Lead Organizer of RUPP Tech Hackathon 2023',
        'Top 5 Finalist in National Programming Contest',
        'Academic Excellence Scholarship Recipient',
      ],
      kh: [
        'ប្រធានរៀបចំកម្មវិធី RUPP Tech Hackathon ឆ្នាំ ២០២៣',
        'ជ័យលាភីកំពូលទាំង ៥ ក្នុងការប្រកួតប្រជែងសរសេរកម្មវិធីជាតិ',
        'ទទួលបានអាហារូបករណ៍សិស្សឆ្នើម',
      ],
    },
    order: 1,
  },
];

export const CERTIFICATIONS_SEED = [
  {
    name: {
      en: 'Meta Front-End Developer Professional Certificate',
      kh: 'វិញ្ញាបនបត្រវិជ្ជាជីវៈ Meta Front-End Developer',
    },
    type: 'certification' as const,
    organization: { en: 'Coursera / Meta', kh: 'Coursera / Meta' },
    issueDate: new Date('2023-08-15'),
    credentialId: 'META-FE-982341',
    credentialUrl: 'https://coursera.org/verify/meta-fe-982341',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    description: {
      en: 'Demonstrated proficiency in React, JavaScript ES6+, UI/UX principles, and modern frontend testing.',
      kh: 'បង្ហាញពីជំនាញក្នុង React, JavaScript ES6+, គោលការណ៍ UI/UX និងការធ្វើតេស្តផ្នែកខាងមុខ។',
    },
    isVisible: true,
    order: 1,
  },
  {
    name: {
      en: 'AWS Certified Cloud Practitioner',
      kh: 'វិញ្ញាបនបត្រ AWS Certified Cloud Practitioner',
    },
    type: 'certification' as const,
    organization: { en: 'Amazon Web Services', kh: 'Amazon Web Services' },
    issueDate: new Date('2023-11-20'),
    expirationDate: new Date('2026-11-20'),
    credentialId: 'AWS-CCP-554129',
    credentialUrl: 'https://aws.amazon.com/verification/AWS-CCP-554129',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    description: {
      en: 'Validated foundational understanding of AWS Cloud services, security, architecture, and pricing.',
      kh: 'បញ្ជាក់ការយល់ដឹងជាមូលដ្ឋានអំពីសេវាកម្ម Cloud របស់ AWS សន្តិសុខ ស្ថាបត្យកម្ម និងតម្លៃ។',
    },
    isVisible: true,
    order: 2,
  },
];

export const SOCIAL_LINKS_SEED = [
  {
    platform: 'github' as const,
    label: 'GitHub',
    url: 'https://github.com/dimsareach',
    icon: 'github',
    order: 1,
    isVisible: true,
  },
  {
    platform: 'linkedin' as const,
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/dimsareach',
    icon: 'linkedin',
    order: 2,
    isVisible: true,
  },
  {
    platform: 'email' as const,
    label: 'Email',
    url: 'mailto:contact@portfolio.dev',
    icon: 'email',
    order: 3,
    isVisible: true,
  },
  {
    platform: 'facebook' as const,
    label: 'Facebook',
    url: 'https://facebook.com/dimsareach',
    icon: 'facebook',
    order: 4,
    isVisible: true,
  },
];

export const SETTINGS_SEED = {
  siteTitle: {
    en: 'Dimsa Reach | Full-Stack Developer',
    kh: 'ដារឹមសា រ្យាច | អ្នកអភិវឌ្ឍន៍ Full-Stack',
  },
  siteDescription: {
    en: 'Personal portfolio and technical blog of Dimsa Reach, showcasing modern web development, AI, and systems engineering.',
    kh: 'គេហទំព័រផលប័ត្រផ្ទាល់ខ្លួន និងប្លុកបច្ចេកទេសរបស់ ដារឹមសា រ្យាច បង្ហាញពីការអភិវឌ្ឍន៍វែបទំនើប AI និងវិស្វកម្មប្រព័ន្ធ។',
  },
  enableCvDownload: true,
  cvFile: {
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    publicId: 'portfolio/cv/dimsa_reach_cv',
    fileName: 'Dimsa_Reach_CV.pdf',
  },
  cvDownloadCount: 15,
  enableContactForm: true,
  emailNotifications: true,
  notificationEmail: 'admin@portfolio.dev',
  maintenanceMode: false,
};

export const getProjectsSeed = (categoryMap: Map<string, Types.ObjectId>) => [
  {
    title: { en: 'CamTraffic AI', kh: 'CamTraffic AI' },
    slug: 'camtraffic-ai',
    shortDescription: {
      en: 'AI-based traffic sign detection and law enforcement system for Cambodia.',
      kh: 'ប្រព័ន្ធឆ្លាតវៃសម្រាប់ការរកឃើញស្លាកសញ្ញាចរាចរណ៍ និងការអនុវត្តច្បាប់ចរាចរណ៍នៅកម្ពុជា។',
    },
    fullDescription: {
      en: 'CamTraffic AI is an automated traffic monitoring and violation detection platform built to improve traffic safety and law compliance in Cambodia. It leverages computer vision models (YOLOv8) to identify traffic signs and vehicles, integrated with an OCR pipeline for automated license plate recognition and a responsive web dashboard for real-time monitoring and reporting.',
      kh: 'CamTraffic AI គឺជាប្រព័ន្ធតាមដានចរាចរណ៍ និងការរកឃើញការល្មើសច្បាប់ដោយស្វ័យប្រវត្ត ដើម្បីលើកកម្ពស់សុវត្ថិភាពចរាចរណ៍នៅកម្ពុជា។ ប្រព័ន្ធនេះប្រើប្រាស់ម៉ូដែល Computer Vision (YOLOv8) ដើម្បីសម្គាល់ស្លាកសញ្ញាចរាចរណ៍ និងយានយន្ត រួមជាមួយបច្ចេកវិទ្យា OCR សម្រាប់អានស្លាកលេខ និងផ្ទាំងគ្រប់គ្រងវែបសម្រាប់តាមដានទិន្នន័យផ្ទាល់។',
    },
    problem: {
      en: 'Manual traffic law enforcement in urban Cambodia is labor-intensive, error-prone, and cannot provide 24/7 coverage across major intersections.',
      kh: 'ការអនុវត្តច្បាប់ចរាចរណ៍ដោយដៃនៅតាមទីក្រុងទាមទារកម្លាំងពលកម្មច្រើន ងាយមានកំហុស និងមិនអាចគ្របដណ្តប់ ២៤/៧ នៅគ្រប់ផ្លូវបំបែកបានទេ។',
    },
    solution: {
      en: 'Engineered an automated end-to-end pipeline with camera streams, real-time object detection via YOLOv8, automated OCR license plate extraction, and violation logging with high accuracy.',
      kh: 'បានបង្កើតប្រព័ន្ធស្វ័យប្រវត្តពេញលេញភ្ជាប់ជាមួយកាមេរ៉ា ការរកឃើញវត្ថុផ្ទាល់តាមរយៈ YOLOv8 ការស្រង់ស្លាកលេខដោយ OCR និងការកត់ត្រាការល្មើសច្បាប់យ៉ាងត្រឹមត្រូវ។',
    },
    features: {
      en: [
        'Real-time traffic sign recognition',
        'Automated license plate detection (OCR)',
        'Violation tracking & audit logs',
        'Interactive administrative dashboard',
      ],
      kh: [
        'ការសម្គាល់ស្លាកសញ្ញាចរាចរណ៍ផ្ទាល់',
        'ការស្រង់ស្លាកលេខរថយន្តដោយស្វ័យប្រវត្ត (OCR)',
        'ការកត់ត្រា និងតាមដានការល្មើសច្បាប់',
        'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាលបែបអន្តរកម្ម',
      ],
    },
    technologies: ['React', 'Django', 'Django REST Framework', 'PostgreSQL', 'YOLO', 'OpenCV', 'OCR'],
    category: categoryMap.get('ai-ml') || new Types.ObjectId(),
    mainImage:
      'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    ],
    githubUrl: 'https://github.com/dimsareach/camtraffic-ai',
    liveUrl: 'https://camtraffic.demo.dev',
    status: 'published' as const,
    featured: true,
    order: 1,
    viewCount: 142,
  },
  {
    title: {
      en: 'Pharmacy POS & Inventory System',
      kh: 'ប្រព័ន្ធ POS និងស្តុកឱសថស្ថាន',
    },
    slug: 'pharmacy-pos-inventory',
    shortDescription: {
      en: 'Complete pharmacy management system with POS, inventory, supplier, and reporting modules.',
      kh: 'ប្រព័ន្ធគ្រប់គ្រងឱសថស្ថានពេញលេញ ជាមួយម៉ូឌុល POS, ស្តុក, អ្នកផ្គត់ផ្គង់ និងរបាយការណ៍។',
    },
    fullDescription: {
      en: 'A comprehensive web-based pharmacy point-of-sale and inventory control system. Provides batch and expiry tracking, prescription management, barcode scanning, purchase orders, sales receipts, and deep financial analytics designed for modern pharmacies.',
      kh: 'ប្រព័ន្ធលក់ និងគ្រប់គ្រងស្តុកឱសថស្ថានតាមវែបយ៉ាងទូលំទូលាយ។ ផ្តល់នូវការតាមដានកាលបរិច្ឆេទផុតកំណត់ ការគ្រប់គ្រងវេជ្ជបញ្ជា ការស្កេនបាកូដ ការបញ្ជាទិញទំនិញ វិក្កយបត្រ និងការវិភាគហិរញ្ញវត្ថុសម្រាប់ឱសថស្ថានទំនើប។',
    },
    problem: {
      en: 'Pharmacies often struggle with expired medications, manual stock reconciliation, untracked batch numbers, and slow point-of-sale checkouts.',
      kh: 'ឱសថស្ថានតែងតែជួបការលំបាកជាមួយថ្នាំហួសកាលកំណត់ ការផ្ទៀងផ្ទាត់ស្តុកដោយដៃ ការមិនបានកត់ត្រាលេខបាច់ និងការគិតប្រាក់យឺតយ៉ាវ។',
    },
    solution: {
      en: 'Built an integrated POS and inventory platform with automated low-stock and expiry alerts, barcode lookup, multi-tier pricing, and automated profit/loss reporting.',
      kh: 'បានបង្កើតប្រព័ន្ធ POS និងស្តុកដែលជូនដំណឹងស្វ័យប្រវត្តនៅពេលទំនិញជិតអស់ ឬជិតផុតកំណត់ ការស្វែងរកតាមបាកូដ និងរបាយការណ៍ចំណេញខាតដោយស្វ័យប្រវត្តិ។',
    },
    features: {
      en: [
        'Rapid POS checkout with barcode scanner',
        'Batch and expiry date tracking',
        'Supplier and purchase order management',
        'Sales analytics and financial summaries',
      ],
      kh: [
        'ការគិតប្រាក់រហ័សជាមួយម៉ាស៊ីនស្កេនបាកូដ',
        'ការតាមដានលេខបាច់ និងកាលបរិច្ឆេទផុតកំណត់',
        'ការគ្រប់គ្រងអ្នកផ្គត់ផ្គង់ និងការបញ្ជាទិញ',
        'ការវិភាគការលក់ និងរបាយការណ៍ហិរញ្ញវត្ថុ',
      ],
    },
    technologies: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript'],
    category: categoryMap.get('web-application') || new Types.ObjectId(),
    mainImage:
      'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop',
    ],
    githubUrl: 'https://github.com/dimsareach/pharmacy-pos',
    liveUrl: 'https://pharmacy-pos.demo.dev',
    status: 'published' as const,
    featured: true,
    order: 2,
    viewCount: 98,
  },
  {
    title: {
      en: 'Developer Portfolio & CMS Platform',
      kh: 'វេទិកាផលប័ត្រ និងគ្រប់គ្រងមាតិកាអ្នកអភិវឌ្ឍន៍',
    },
    slug: 'portfolio-cms-platform',
    shortDescription: {
      en: 'Full-stack personal portfolio and headless CMS with bilingual support and secure admin dashboard.',
      kh: 'គេហទំព័រផលប័ត្រផ្ទាល់ខ្លួន និងប្រព័ន្ធ CMS ជាមួយការគាំទ្រពីរភាសា និងផ្ទាំងគ្រប់គ្រងរដ្ឋបាលប្រកបដោយសុវត្ថិភាព។',
    },
    fullDescription: {
      en: 'A modern full-stack developer portfolio and content management system built with Angular 19, Express.js, TypeScript, and MongoDB. Includes case-study project presentations, Markdown blog engine, CV management, JWT auth with refresh tokens, dark/light themes, and bilingual English/Khmer support.',
      kh: 'គេហទំព័រផលប័ត្រ និងប្រព័ន្ធគ្រប់គ្រងមាតិកាពេញលេញដែលត្រូវបានបង្កើតឡើងដោយ Angular 19, Express.js, TypeScript និង MongoDB។ រួមបញ្ចូលទាំងការបង្ហាញគម្រោងបែប Case Study, ម៉ាស៊ីនប្លុក Markdown, ការគ្រប់គ្រង CV, សុវត្ថិភាព JWT ជាមួយ Refresh Token, ស្បែក Dark/Light និងការគាំទ្រពីរភាសា (អង់គ្លេស/ខ្មែរ)។',
    },
    problem: {
      en: 'Traditional developer portfolios are either static HTML files that are hard to update or generic CMS platforms with bloated dependencies and poor UX.',
      kh: 'គេហទំព័រផលប័ត្រអ្នកអភិវឌ្ឍន៍ភាគច្រើនជា HTML ថេរដែលពិបាកកែប្រែ ឬជា CMS ទូទៅដែលមានទំហំធំ និងបទពិសោធន៍ប្រើប្រាស់មិនល្អ។',
    },
    solution: {
      en: 'Designed a tailored, lightning-fast portfolio with a sleek private admin dashboard, enabling immediate content updates without modifying code.',
      kh: 'បានរចនាគេហទំព័រផលប័ត្រដែលមានល្បឿនលឿន ជាមួយផ្ទាំងគ្រប់គ្រងរដ្ឋបាលផ្ទាល់ខ្លួន ដែលអនុញ្ញាតឱ្យកែប្រែមាតិកាភ្លាមៗដោយមិនបាច់ប៉ះពាល់កូដ។',
    },
    features: {
      en: [
        'Case study project showcase',
        'Markdown blog with syntax highlighting',
        'Bilingual English/Khmer localization',
        'Secured admin CMS with role-based auth',
      ],
      kh: [
        'ការបង្ហាញគម្រោងលម្អិតបែប Case Study',
        'ប្លុក Markdown ជាមួយការរំលេចកូដ',
        'ការបកប្រែពីរភាសា អង់គ្លេស និងខ្មែរ',
        'ប្រព័ន្ធគ្រប់គ្រង CMS ប្រកបដោយសុវត្ថិភាព',
      ],
    },
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Docker'],
    category: categoryMap.get('system-design') || new Types.ObjectId(),
    mainImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    ],
    githubUrl: 'https://github.com/dimsareach/portfolio-cms',
    liveUrl: 'https://dimsareach.dev',
    status: 'published' as const,
    featured: true,
    order: 3,
    viewCount: 215,
  },
];

export const getBlogPostsSeed = (
  categoryMap: Map<string, Types.ObjectId>,
  authorId: Types.ObjectId,
) => [
  {
    title: {
      en: 'Getting Started with Angular Signals',
      kh: 'ការចាប់ផ្តើមជាមួយ Angular Signals',
    },
    slug: 'getting-started-with-angular-signals',
    excerpt: {
      en: 'Learn how Angular Signals transform reactivity, state management, and performance in modern Angular applications.',
      kh: 'ស្វែងយល់ពីរបៀបដែល Angular Signals ផ្លាស់ប្តូរការគ្រប់គ្រង State និងបង្កើនល្បឿនកម្មវិធី Angular ទំនើប។',
    },
    content: {
      en: `## Introduction to Angular Signals

Angular Signals introduce a fine-grained reactive model to the Angular ecosystem, eliminating unnecessary change detection cycles and boosting runtime performance.

### Why Signals?

Before Signals, Angular relied heavily on **Zone.js** to detect when any asynchronous event occurred. Zone.js monkey-patches browser APIs, leading to whole-tree dirty checking.

With Signals, Angular knows **precisely** which parts of the DOM depend on which state:

\`\`\`typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter-card">
      <h2>Count: {{ count() }}</h2>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}
\`\`\`

### Key Benefits
- **Zero Zone.js overhead**: Paves the path for zoneless Angular apps.
- **Predictable Glitch-Free Reactivity**: Computed values evaluate lazily and consistently.
- **Simpler Mental Model**: No need to manually manage RxJS subscriptions for synchronous UI state.

### Conclusion

Signals are the future of Angular reactivity. Start adopting them in your modern components today!`,
      kh: `## ការណែនាំអំពី Angular Signals

Angular Signals នាំមកនូវគំរូ Reactive ដ៏មានប្រសិទ្ធភាពខ្ពស់ ដែលជួយកាត់បន្ថយការត្រួតពិនិត្យការផ្លាស់ប្តូរ (Change Detection) មិនចាំបាច់ និងបង្កើនល្បឿនដំណើរការ។

### ហេតុអ្វីត្រូវប្រើ Signals?

កាលពីមុន Angular ពឹងផ្អែកលើ **Zone.js** ដើម្បីតាមដានរាល់ព្រឹត្តិការណ៍ Async។ ឥឡូវនេះ Signals អនុញ្ញាតឱ្យ Angular ដឹងច្បាស់ថាផ្នែកណានៃ DOM ត្រូវធ្វើបច្ចុប្បន្នភាព៖

\`\`\`typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter-card">
      <h2>ចំនួន: {{ count() }}</h2>
      <p>គុណនឹងពីរ: {{ doubleCount() }}</p>
      <button (click)="increment()">បន្ថែម</button>
    </div>
  \`
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}
\`\`\`

### អត្ថប្រយោជន៍ចម្បង
- **ល្បឿនលឿន**: ត្រៀមខ្លួនសម្រាប់ Zoneless Architecture
- **ភាពងាយស្រួល**: មិនចាំបាច់ដោះស្រាយ Unsubscribe ដូច RxJS
- **កូដច្បាស់លាស់**: ងាយស្រួលយល់ និងថែទាំ`,
    },
    coverImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
    category: categoryMap.get('tutorial') || new Types.ObjectId(),
    tags: ['Angular', 'TypeScript', 'Frontend', 'Reactivity'],
    status: 'published' as const,
    featured: true,
    publishedAt: new Date('2024-01-15T09:00:00Z'),
    viewCount: 320,
    author: authorId,
  },
  {
    title: {
      en: 'Building Robust REST APIs with Express and TypeScript',
      kh: 'ការបង្កើត REST APIs ដ៏រឹងមាំជាមួយ Express និង TypeScript',
    },
    slug: 'building-rest-apis-with-express-and-typescript',
    excerpt: {
      en: 'A comprehensive guide to structuring production-grade Express.js applications with TypeScript, validation, and error handling.',
      kh: 'ការណែនាំពេញលេញក្នុងការរៀបចំរចនាសម្ព័ន្ធ Express.js ជាមួយ TypeScript ការផ្ទៀងផ្ទាត់ទិន្នន័យ និងការដោះស្រាយកំហុស។',
    },
    content: {
      en: `## Architecture for Scalable Express APIs

When building backends with Express and TypeScript, having a structured architecture is key to long-term maintainability.

### The Controller-Service-Model Pattern

Separating business logic from transport logic keeps your controllers lean and testable:

1. **Routes**: Define URL paths and apply middleware (auth, validation, rate limiting).
2. **Controllers**: Parse requests, extract parameters, and call services.
3. **Services**: Contain pure business logic and orchestrate database queries.
4. **Models**: Define database schema and relationships using Mongoose.

\`\`\`typescript
// Example Express Controller with async wrapper
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile();
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  sendSuccess(res, profile, 'Profile retrieved successfully');
});
\`\`\`

### Key Best Practices
- **Strict Validation**: Always validate user input using \`express-validator\` or \`zod\`.
- **Centralized Error Handling**: Use an operational error hierarchy and centralized error middleware.
- **Security Headers**: Always enable \`helmet\`, \`cors\`, and appropriate rate limiters.`,
      kh: `## ស្ថាបត្យកម្មសម្រាប់ Express APIs ខ្នាតធំ

នៅពេលបង្កើតប្រព័ន្ធខាងក្រោយជាមួយ Express និង TypeScript ការមានរចនាសម្ព័ន្ធស្អាតគឺជាគន្លឹះសំខាន់សម្រាប់ការថែទាំយូរអង្វែង។

### គំរូ Controller-Service-Model

ការបែងចែកកូដជំនួញ (Business Logic) ចេញពីកូដបញ្ជូនទិន្នន័យជួយឱ្យកូដងាយស្រួលធ្វើតេស្ត៖

1. **Routes**: កំណត់ផ្លូវ URL និង Middleware (Auth, Validation, Rate Limiter)
2. **Controllers**: ទទួល Request និងហៅ Service
3. **Services**: មាន Business Logic និងទាញទិន្នន័យពី DB
4. **Models**: កំណត់ Schema ទិន្នន័យតាមរយៈ Mongoose

\`\`\`typescript
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await profileService.getProfile();
  if (!profile) {
    throw new NotFoundError('រកមិនឃើញព័ត៌មានប្រវត្តិរូប');
  }
  sendSuccess(res, profile, 'ទាញយកព័ត៌មានដោយជោគជ័យ');
});
\`\`\`

### គោលការណ៍ល្អៗ
- **ការផ្ទៀងផ្ទាត់ទិន្នន័យ**: ត្រូវផ្ទៀងផ្ទាត់ជានិច្ចមុននឹងបញ្ជូនទៅ Service
- **ការគ្រប់គ្រងកំហុសកណ្តាល**: ប្រើប្រាស់ Global Error Middleware
- **សុវត្ថិភាព**: ប្រើ Helmet, CORS និង Rate Limiting ជានិច្ច`,
    },
    coverImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
    category: categoryMap.get('technical') || new Types.ObjectId(),
    tags: ['Node.js', 'Express', 'TypeScript', 'Backend', 'API'],
    status: 'published' as const,
    featured: true,
    publishedAt: new Date('2024-02-10T10:30:00Z'),
    viewCount: 245,
    author: authorId,
  },
  {
    title: {
      en: 'My Journey into AI and Computer Vision',
      kh: 'ដំណើរនៃការរៀនសូត្រ AI និង Computer Vision របស់ខ្ញុំ',
    },
    slug: 'my-journey-into-ai-and-computer-vision',
    excerpt: {
      en: 'Reflections and practical lessons from building the CamTraffic AI project using YOLO, OpenCV, and Python.',
      kh: 'ការចែករំលែកបទពិសោធន៍ជាក់ស្តែងពីការបង្កើតគម្រោង CamTraffic AI ដោយប្រើ YOLO, OpenCV និង Python។',
    },
    content: {
      en: `## Exploring Computer Vision in Cambodia

Developing the CamTraffic AI system gave me deep insights into practical AI engineering beyond theoretical models.

### Challenges Encountered
1. **Data Collection**: Traffic conditions in Phnom Penh are dynamic and dense. Standard open datasets did not reflect local motorcycle traffic patterns and signage.
2. **Model Training**: Fine-tuning YOLOv8 on custom-annotated local images required careful balancing to avoid false positives in low-light conditions.
3. **Inference Latency**: Real-time traffic analysis demands high FPS, requiring model quantization and GPU optimization.

### Key Takeaways
- Real-world AI is 80% data cleaning, labeling, and pipeline engineering.
- Combining classical computer vision (OpenCV pre-processing) with modern deep learning yields the most reliable results.`,
      kh: `## ការរុករកពិភព Computer Vision នៅកម្ពុជា

ការអភិវឌ្ឍប្រព័ន្ធ CamTraffic AI បានផ្តល់ឱ្យខ្ញុំនូវការយល់ដឹងស៊ីជម្រៅអំពីវិស្វកម្ម AI ជាក់ស្តែងលើសពីទ្រឹស្តីក្នុងសៀវភៅ។

### បញ្ហាប្រឈមដែលបានជួបប្រទះ
1. **ការប្រមូលទិន្នន័យ**: ចរាចរណ៍នៅភ្នំពេញមានភាពចម្រុះ និងមមាញឹក ដែលទាមទារការប្រមូលរូបភាពជាក់ស្តែងក្នុងស្រុក។
2. **ការបង្វឹកម៉ូដែល**: ការ Fine-tune YOLOv8 ត្រូវការការផ្ទៀងផ្ទាត់យ៉ាងហ្មត់ចត់ដើម្បីកាត់បន្ថយកំហុសនៅពេលយប់។
3. **ល្បឿនដំណើរការ**: ការវិភាគទិន្នន័យផ្ទាល់ទាមទារ FPS ខ្ពស់ និងការបង្កើនល្បឿន GPU។

### មេរៀនសំខាន់ៗ
- ការងារ AI ជាក់ស្តែង ៨០% គឺការរៀបចំ និងកែច្នៃទិន្នន័យ (Data Engineering)
- ការរួមបញ្ចូលគ្នារវាង OpenCV និង Deep Learning ផ្តល់នូវលទ្ធផលល្អបំផុត`,
    },
    coverImage:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    category: categoryMap.get('ai-ml') || new Types.ObjectId(),
    tags: ['AI', 'Computer Vision', 'YOLO', 'Python'],
    status: 'published' as const,
    featured: false,
    publishedAt: new Date('2024-03-01T14:00:00Z'),
    viewCount: 180,
    author: authorId,
  },
];

export const MESSAGES_SEED = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Exciting Full-Stack Opportunity',
    message:
      'Hello Dimsa, I came across your portfolio and was impressed by your CamTraffic AI and Angular projects. Would you be open to discussing a senior developer role?',
    isRead: false,
    isArchived: false,
  },
  {
    name: 'Sarah Connor',
    email: 'sarah.c@techcorp.com',
    subject: 'Collaboration on AI Vision System',
    message:
      'Hi Dimsa, our team is researching traffic flow monitoring in Southeast Asia. We would love to exchange insights regarding your YOLOv8 implementation.',
    isRead: true,
    isArchived: false,
    readAt: new Date('2024-03-10T11:00:00Z'),
  },
];

export const MEDIA_SEED = [
  {
    fileName: 'dimsa_profile.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    publicId: 'portfolio/media/dimsa_profile',
    mimeType: 'image/jpeg',
    size: 245000,
    width: 800,
    height: 800,
    altText: { en: 'Dimsa Reach Profile Picture', kh: 'រូបថតប្រវត្តិរូប ដារឹមសា រ្យាច' },
    folder: 'portfolio/profile',
  },
  {
    fileName: 'camtraffic_hero.jpg',
    url: 'https://images.unsplash.com/photo-1508873696983-2df570464756?w=800&auto=format&fit=crop',
    publicId: 'portfolio/media/camtraffic_hero',
    mimeType: 'image/jpeg',
    size: 480000,
    width: 1200,
    height: 800,
    altText: { en: 'CamTraffic AI Hero Banner', kh: 'ផ្ទាំងរូបភាព CamTraffic AI' },
    folder: 'portfolio/projects',
  },
];

/**
 * Clear all seeded collections with production safety check.
 */
export async function clearDatabase(force = false): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowProdSeed = process.env.ALLOW_PROD_SEED === 'true';

  if (isProduction && !force && !allowProdSeed) {
    const errorMsg =
      'Refusing to clear database in production environment without explicit ALLOW_PROD_SEED=true flag.';
    logger.warn(errorMsg);
    throw new Error(errorMsg);
  }

  logger.info('Clearing existing documents from collections...');
  await Promise.all([
    User.deleteMany({}),
    Profile.deleteMany({}),
    Category.deleteMany({}),
    Skill.deleteMany({}),
    Experience.deleteMany({}),
    Education.deleteMany({}),
    Certification.deleteMany({}),
    SocialLink.deleteMany({}),
    Settings.deleteMany({}),
    Project.deleteMany({}),
    BlogPost.deleteMany({}),
    Message.deleteMany({}),
    Media.deleteMany({}),
  ]);
  logger.info('Collections successfully cleared.');
}

/**
 * Seed all collections in dependency order.
 */
export async function seedDatabase(options: SeedOptions = {}): Promise<SeedSummary> {
  const { clear = true, force = false, disconnectOnFinish = true } = options;

  let didConnect = false;
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDatabase();
      didConnect = true;
    }

    if (clear) {
      await clearDatabase(force);
    }

    // 1. Admin User
    let adminUser: IUser;
    const existingAdmin = await User.findOne({ email: ADMIN_DEFAULTS.email });
    if (existingAdmin) {
      adminUser = existingAdmin;
      logger.info(`Admin user already exists (${adminUser.email}).`);
    } else {
      adminUser = await User.create({
        email: ADMIN_DEFAULTS.email,
        password: ADMIN_DEFAULTS.password,
        fullName: ADMIN_DEFAULTS.fullName,
        role: ADMIN_DEFAULTS.role,
        isActive: true,
      });
      logger.info(`Admin user created (${adminUser.email}).`);
    }

    // 2. Profile
    await Profile.create(PROFILE_SEED);
    logger.info('Profile data seeded.');

    // 3. Categories
    const categoryDocs = await Category.create(CATEGORIES_SEED);
    const categoryMap = new Map<string, Types.ObjectId>();
    categoryDocs.forEach((cat) => {
      categoryMap.set(cat.slug, cat._id as Types.ObjectId);
    });
    logger.info(`Categories seeded (${categoryDocs.length} items).`);

    // 4. Skills
    await Skill.create(SKILLS_SEED);
    logger.info(`Skills seeded (${SKILLS_SEED.length} items).`);

    // 5. Experience
    await Experience.create(EXPERIENCE_SEED);
    logger.info(`Experience seeded (${EXPERIENCE_SEED.length} items).`);

    // 6. Education
    await Education.create(EDUCATION_SEED);
    logger.info(`Education seeded (${EDUCATION_SEED.length} items).`);

    // 7. Certifications
    await Certification.create(CERTIFICATIONS_SEED);
    logger.info(`Certifications seeded (${CERTIFICATIONS_SEED.length} items).`);

    // 8. Social Links
    await SocialLink.create(SOCIAL_LINKS_SEED);
    logger.info(`Social links seeded (${SOCIAL_LINKS_SEED.length} items).`);

    // 9. Settings
    await Settings.create(SETTINGS_SEED);
    logger.info('Settings seeded.');

    // 10. Projects (dependent on categories)
    const projectsData = getProjectsSeed(categoryMap);
    await Project.create(projectsData);
    logger.info(`Projects seeded (${projectsData.length} items).`);

    // 11. Blog Posts (dependent on categories and author)
    const blogPostsData = getBlogPostsSeed(categoryMap, adminUser._id as Types.ObjectId);
    await BlogPost.create(blogPostsData);
    logger.info(`Blog posts seeded (${blogPostsData.length} items).`);

    // 12. Messages
    await Message.create(MESSAGES_SEED);
    logger.info(`Messages seeded (${MESSAGES_SEED.length} items).`);

    // 13. Media
    await Media.create(MEDIA_SEED);
    logger.info(`Media seeded (${MEDIA_SEED.length} items).`);

    const summary: SeedSummary = {
      users: 1,
      profile: 1,
      categories: categoryDocs.length,
      skills: SKILLS_SEED.length,
      experience: EXPERIENCE_SEED.length,
      education: EDUCATION_SEED.length,
      certifications: CERTIFICATIONS_SEED.length,
      socialLinks: SOCIAL_LINKS_SEED.length,
      settings: 1,
      projects: projectsData.length,
      blogPosts: blogPostsData.length,
      messages: MESSAGES_SEED.length,
      media: MEDIA_SEED.length,
    };

    logger.info('Database seeding completed successfully.', summary);
    return summary;
  } catch (error) {
    logger.error('Error during database seeding:', error);
    throw error;
  } finally {
    if (didConnect && disconnectOnFinish) {
      await disconnectDatabase();
    }
  }
}

// Execute when run directly from command line (e.g. npm run seed)
if (require.main === module) {
  seedDatabase({ disconnectOnFinish: true })
    .then((summary) => {
      // eslint-disable-next-line no-console
      console.log('Seeding summary:', summary);
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Fatal seed failure:', error);
      process.exit(1);
    });
}

export default seedDatabase;
