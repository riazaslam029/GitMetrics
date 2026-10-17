// Portfolio Builder Configuration Types

export type PortfolioThemeId = 'neon-obsidian' | 'cyberpunk-emerald' | 'cosmic-violet' | 'nordic-monolith';

export interface PortfolioThemeConfig {
  id: PortfolioThemeId;
  name: string;
  description: string;
  bgClass: string;
  primaryColor: string;
  accentColor: string;
  cardBg: string;
  borderClass: string;
  fontHeadline: string;
  previewGradient: string;
}

export interface PortfolioProject {
  id: string | number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  homepage?: string | null;
  featured: boolean;
  tags: string[];
}

export interface PortfolioSocials {
  github: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
  website?: string;
}

export interface PortfolioConfig {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  theme: PortfolioThemeId;
  socials: PortfolioSocials;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: PortfolioProject[];
  visibleSections: {
    hero: boolean;
    stats: boolean;
    skills: boolean;
    featuredProjects: boolean;
    allProjects: boolean;
    goals: boolean;
    contact: boolean;
  };
  customCss?: string;
  lastUpdated: string;
}
