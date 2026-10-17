import type { DeveloperGoal, WorkspaceTask, BacklogItem, WorkspaceData } from '../types/workspace.ts';
import type { PortfolioConfig } from '../types/portfolio.ts';

const WORKSPACE_STORAGE_KEY = 'gitmetrics_workspace_v1';
const PORTFOLIO_STORAGE_KEY = 'gitmetrics_portfolio_v1';

export const INITIAL_GOALS: DeveloperGoal[] = [
  {
    id: 'goal-1',
    title: 'Contribute to 3 Open-Source Repositories',
    description: 'Submit documentation fixes and PRs to developer-friendly tools in the ecosystem.',
    category: 'open-source',
    progress: 65,
    targetDate: '2026-11-30',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-2',
    title: 'Master Systems Programming in Rust',
    description: 'Build memory-safe concurrency primitives, learn async tokio runtimes, and write an embedded CLI.',
    category: 'learning',
    progress: 80,
    targetDate: '2026-12-15',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-3',
    title: 'Deploy Production Developer Portfolio',
    description: 'Publish customized GitMetrics bundle to GitHub Pages or Vercel.',
    category: 'shipping',
    progress: 100,
    targetDate: '2026-10-25',
    isCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_TASKS: WorkspaceTask[] = [
  {
    id: 'task-1',
    title: 'Refactor GitHub API cache layer with expiration TTL',
    status: 'in-progress',
    priority: 'high',
    category: 'Architecture',
    dueDate: 'Tomorrow',
    githubRepo: 'gitmetrics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement GitHub Profile & Repo Scorecard with actionable suggestions',
    status: 'done',
    priority: 'urgent',
    category: 'Frontend / Audit',
    dueDate: 'Today',
    githubRepo: 'gitmetrics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Draft technical blog post on WebGL shader performance',
    status: 'todo',
    priority: 'medium',
    category: 'Writing',
    dueDate: 'Next Friday',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Audit web accessibility (contrast ratios and ARIA attributes)',
    status: 'todo',
    priority: 'high',
    category: 'QA / A11y',
    dueDate: 'This Weekend',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_BACKLOG: BacklogItem[] = [
  {
    id: 'backlog-1',
    title: 'Interactive CLI terminal emulator in browser',
    notes: 'Allow visitors to type `help`, `skills`, `cat resume.txt` right in the portfolio preview.',
    priority: 'medium',
    status: 'planned',
    tags: ['Interactive', 'CLI', 'Web'],
    estimatedHours: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'backlog-2',
    title: 'Real-time WebSocket multiplayer cursor presence on portfolio',
    notes: 'Show live visitors looking at the portfolio at the same time.',
    priority: 'low',
    status: 'idea',
    tags: ['WebSockets', 'Experimental'],
    estimatedHours: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'backlog-3',
    title: 'GitHub release webhook notification daemon',
    notes: 'Auto-ping Discord channel whenever a new version is tagged.',
    priority: 'medium',
    status: 'idea',
    tags: ['DevOps', 'GitHub Actions'],
    estimatedHours: 4,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PORTFOLIO: PortfolioConfig = {
  username: 'alex-dev',
  fullName: 'Alex Rivera',
  headline: 'Full-Stack Systems Architect & Creative Technologist',
  bio: 'Specializing in high-performance distributed systems, WebGL creative computing, and developer ergonomics.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  location: 'San Francisco, CA / Remote',
  theme: 'neon-obsidian',
  socials: {
    github: 'https://github.com/alex-dev',
    twitter: 'https://twitter.com/alexrivera_dev',
    linkedin: 'https://linkedin.com/in/alexrivera',
    email: 'alex@opensource.labs',
    website: 'https://alexrivera.codes',
  },
  skills: {
    languages: ['TypeScript', 'Rust', 'Go', 'Python', 'C++'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Three.js'],
    tools: ['Docker', 'Kubernetes', 'Git', 'Linux / POSIX', 'Vite', 'Vitest'],
  },
  projects: [
    {
      id: 101,
      name: 'hyper-cache-engine',
      description: 'High-throughput in-memory caching engine written in Rust with lock-free concurrent hash tables.',
      language: 'Rust',
      stars: 842,
      forks: 67,
      url: 'https://github.com/alex-dev/hyper-cache-engine',
      homepage: 'https://hypercache.dev',
      featured: true,
      tags: ['Rust', 'Concurrency', 'Systems'],
    },
    {
      id: 102,
      name: 'quantum-gl-canvas',
      description: 'WebGL shader pipeline for real-time quantum probability wave simulation in React.',
      language: 'TypeScript',
      stars: 618,
      forks: 43,
      url: 'https://github.com/alex-dev/quantum-gl-canvas',
      homepage: 'https://quantum-gl.alexrivera.codes',
      featured: true,
      tags: ['WebGL', 'Three.js', 'Shaders'],
    },
    {
      id: 108,
      name: 'gitmetrics',
      description: 'GitMetrics — Premium Developer Portfolio & GitHub Intelligence Platform.',
      language: 'TypeScript',
      stars: 1120,
      forks: 135,
      url: 'https://github.com/riazaslam029/GitMetrics',
      homepage: 'https://gitmetrics.vercel.app',
      featured: true,
      tags: ['React', 'Tailwind', 'DevTools', 'GitHub API'],
    },
  ],
  visibleSections: {
    hero: true,
    stats: true,
    skills: true,
    featuredProjects: true,
    allProjects: true,
    goals: true,
    contact: true,
  },
  lastUpdated: new Date().toISOString(),
};

/**
 * Storage Service to manage Workspace data
 */
export const storageService = {
  getWorkspaceData(): WorkspaceData {
    try {
      const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as WorkspaceData;
      }
    } catch (e) {
      console.warn('Failed to parse workspace data from localStorage', e);
    }

    const defaultData: WorkspaceData = {
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      backlog: INITIAL_BACKLOG,
      lastBackupDate: new Date().toISOString(),
    };
    this.saveWorkspaceData(defaultData);
    return defaultData;
  },

  saveWorkspaceData(data: WorkspaceData): void {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save workspace data to localStorage', e);
    }
  },

  resetWorkspaceData(): WorkspaceData {
    const defaultData: WorkspaceData = {
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      backlog: INITIAL_BACKLOG,
      lastBackupDate: new Date().toISOString(),
    };
    this.saveWorkspaceData(defaultData);
    return defaultData;
  },

  getPortfolioConfig(): PortfolioConfig {
    try {
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as PortfolioConfig;
      }
    } catch (e) {
      console.warn('Failed to parse portfolio config from localStorage', e);
    }

    this.savePortfolioConfig(INITIAL_PORTFOLIO);
    return INITIAL_PORTFOLIO;
  },

  savePortfolioConfig(config: PortfolioConfig): void {
    try {
      localStorage.setItem(
        PORTFOLIO_STORAGE_KEY,
        JSON.stringify({ ...config, lastUpdated: new Date().toISOString() })
      );
    } catch (e) {
      console.error('Failed to save portfolio config to localStorage', e);
    }
  },

  exportAllDataJson(): string {
    const backup = {
      workspace: this.getWorkspaceData(),
      portfolio: this.getPortfolioConfig(),
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importDataJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.workspace && parsed.portfolio) {
        this.saveWorkspaceData(parsed.workspace);
        this.savePortfolioConfig(parsed.portfolio);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
