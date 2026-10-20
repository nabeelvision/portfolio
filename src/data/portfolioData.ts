import { StatItem, SkillItem, ProjectItem, ExperienceItem, ContactChannel, ProfileInfo } from '../types';
import initialProfile from './profile.json';

export const portfolioInfo: ProfileInfo = initialProfile as ProfileInfo;

export const statsData: StatItem[] = [
  { number: '50+', label: 'Projects Completed' },
  { number: '30+', label: 'Happy Clients' },
  { number: '5+', label: 'Years Experience' },
  { number: '99%', label: 'Client Satisfaction' },
];

export const skillsData: SkillItem[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: '⚛️',
    iconColor: 'blue',
    description: 'Building responsive, accessible, and performant user interfaces with modern frameworks.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: '🛠️',
    iconColor: 'teal',
    description: 'Designing scalable APIs, databases, and server-side architecture for real-world apps.',
    tags: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
  },
  {
    id: 'ai-automation',
    name: 'AI Integration & Automation',
    icon: '🎨',
    iconColor: 'blue',
    description: 'Building intelligent applications by integrating AI models and automating complex workflows for efficiency and scalability.',
    tags: ['OpenAI API', 'TensorFlow', 'Node.js', 'Python'],
  },
  {
    id: 'machine-learning',
    name: 'ML / DL (Machine & Deep Learning)',
    icon: '☁️',
    iconColor: 'teal',
    description: 'Designing and training advanced AI models to solve real-world problems using data-driven approaches.',
    tags: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
  },
];

import initialProjects from './projects.json';

export const projectsData: ProjectItem[] = initialProjects as ProjectItem[];


export const experienceData: ExperienceItem[] = [
  {
    id: 'techcorp',
    period: '2022 — Present',
    role: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    description: 'Leading development of enterprise SaaS products, managing a team of 5 engineers, architecting microservices infrastructure, and delivering features to 10,000+ users.',
    technologies: ['React', 'Node.js', 'Microservices', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'digital-craft',
    period: '2020 — 2022',
    role: 'Frontend Developer',
    company: 'Digital Craft Agency',
    description: 'Built pixel-perfect UIs for 20+ client projects, improved page load speed by 60%, and established company-wide design system used by all developers.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Figma', 'REST APIs'],
  },
  {
    id: 'startuphub',
    period: '2019 — 2020',
    role: 'Junior Web Developer',
    company: 'StartupHub Pakistan',
    description: 'Developed and maintained web applications using React and Node.js. Collaborated with design team to implement responsive, accessible interfaces.',
    technologies: ['React', 'Node.js', 'HTML5/CSS3', 'Git', 'MongoDB'],
  },
];

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'raonabeelahmad11.11@gmail.com',
    href: 'mailto:raonabeelahmad11.11@gmail.com',
    iconType: 'email',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/nabeelahmad',
    href: 'https://www.linkedin.com/in/nabeelvision/',
    iconType: 'linkedin',
  },
  {
    label: 'GitHub',
    value: 'github.com/nabeelahmad',
    href: 'https://github.com/nabeelvision',
    iconType: 'github',
  },
  {
    label: 'Facebook',
    value: 'facebook.com/NabeelAhmad',
    href: 'https://web.facebook.com/nabeelrajp0ot',
    iconType: 'facebook',
  },
];
