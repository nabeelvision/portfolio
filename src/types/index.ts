export interface ProfileInfo {
  name: string;
  firstName: string;
  lastName: string;
  brandName: string;
  tagline: string;
  badgeText: string;
  bio: string;
  profileImage: string;
  profileImageZoom?: number;
  profileImagePosition?: string;
  experienceYears: string;
  projectsCount: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  iconColor: 'blue' | 'teal';
  description: string;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  themeClass: 'p1' | 'p2' | 'p3';
  link?: string;
  previewImage?: string;
  imageUrl?: string;
  imageZoom?: number;
  imagePosition?: string;
  imageFit?: 'cover' | 'contain';
  createdAt?: string;
  caseStudy?: {
    overview: string;
    highlights: string[];
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
  };
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  technologies?: string[];
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  iconType: 'email' | 'linkedin' | 'github' | 'facebook';
}
