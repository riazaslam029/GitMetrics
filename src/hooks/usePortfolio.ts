import { useState, useEffect, useCallback } from 'react';
import type { PortfolioConfig, PortfolioThemeId, PortfolioProject } from '../types/portfolio.ts';
import type { GitHubRepo, GitHubUser } from '../types/github.ts';
import { storageService } from '../services/storageService.ts';

export function usePortfolio(currentUser: GitHubUser | null, currentRepos: GitHubRepo[]) {
  const [config, setConfig] = useState<PortfolioConfig>(() => storageService.getPortfolioConfig());

  // Save changes to localStorage
  useEffect(() => {
    storageService.savePortfolioConfig(config);
  }, [config]);

  // Sync profile details when user loads a new profile (optional auto-fill helper)
  const syncFromGitHub = useCallback(() => {
    if (!currentUser) return;

    const newProjects: PortfolioProject[] = currentRepos.slice(0, 6).map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '',
      language: repo.language || 'Code',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      homepage: repo.homepage,
      featured: repo.stargazers_count > 0,
      tags: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 4) : [repo.language || 'Developer'],
    }));

    setConfig((prev) => ({
      ...prev,
      username: currentUser.login,
      fullName: currentUser.name || currentUser.login,
      headline: prev.headline || `${currentUser.login} • Open Source Builder`,
      bio: currentUser.bio || prev.bio,
      avatarUrl: currentUser.avatar_url,
      location: currentUser.location || prev.location,
      socials: {
        ...prev.socials,
        github: currentUser.html_url,
        website: currentUser.blog || prev.socials.website,
        twitter: currentUser.twitter_username
          ? `https://twitter.com/${currentUser.twitter_username}`
          : prev.socials.twitter,
      },
      projects: newProjects.length > 0 ? newProjects : prev.projects,
    }));
  }, [currentUser, currentRepos]);

  const updateField = useCallback(<K extends keyof PortfolioConfig>(field: K, value: PortfolioConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setTheme = useCallback((theme: PortfolioThemeId) => {
    setConfig((prev) => ({
      ...prev,
      theme,
    }));
  }, []);

  const toggleSection = useCallback((section: keyof PortfolioConfig['visibleSections']) => {
    setConfig((prev) => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [section]: !prev.visibleSections[section],
      },
    }));
  }, []);

  const toggleProject = useCallback((repo: GitHubRepo) => {
    setConfig((prev) => {
      const exists = prev.projects.some((p) => p.id === repo.id || p.name === repo.name);
      if (exists) {
        return {
          ...prev,
          projects: prev.projects.filter((p) => p.id !== repo.id && p.name !== repo.name),
        };
      } else {
        const newProj: PortfolioProject = {
          id: repo.id,
          name: repo.name,
          description: repo.description || '',
          language: repo.language || 'Code',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          homepage: repo.homepage,
          featured: true,
          tags: repo.topics && repo.topics.length > 0 ? repo.topics.slice(0, 4) : [repo.language || 'Dev'],
        };
        return {
          ...prev,
          projects: [...prev.projects, newProj],
        };
      }
    });
  }, []);

  const addSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setConfig((prev) => {
      if (prev.skills[category].includes(trimmed)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], trimmed],
        },
      };
    });
  }, []);

  const removeSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', skill: string) => {
    setConfig((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skill),
      },
    }));
  }, []);

  return {
    config,
    setConfig,
    updateField,
    setTheme,
    toggleSection,
    toggleProject,
    addSkill,
    removeSkill,
    syncFromGitHub,
  };
}
