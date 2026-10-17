import { useState, useEffect, useCallback } from 'react';
import type { GitHubUser, GitHubRepo, GitHubEvent, LanguageStat, RateLimitInfo } from '../types/github.ts';
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchGitHubEvents,
  calculateLanguageStats,
  getLatestRateLimit,
  GitHubApiError,
} from '../services/githubApi.ts';
import { DEMO_USERNAME } from '../data/mockDemoData.ts';

export interface UseGitHubUserReturn {
  username: string;
  setUsername: (username: string) => void;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  languageStats: LanguageStat[];
  rateLimit: RateLimitInfo;
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  isDemoMode: boolean;
  refetch: () => Promise<void>;
  loadDemoProfile: () => void;
}

export function useGitHubUser(initialUsername = DEMO_USERNAME): UseGitHubUserReturn {
  const [username, setUsername] = useState<string>(initialUsername);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>(getLatestRateLimit());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  const isDemoMode = username.toLowerCase() === DEMO_USERNAME.toLowerCase();

  const loadData = useCallback(async (targetUsername: string, forceFresh = false) => {
    if (!targetUsername.trim()) {
      setUser(null);
      setRepos([]);
      setEvents([]);
      setLanguageStats([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);

    try {
      const [userData, reposData, eventsData] = await Promise.all([
        fetchGitHubUser(targetUsername, forceFresh),
        fetchGitHubRepos(targetUsername, forceFresh),
        fetchGitHubEvents(targetUsername, forceFresh),
      ]);

      setUser(userData);
      setRepos(reposData);
      setEvents(eventsData);
      setLanguageStats(calculateLanguageStats(reposData));
      setRateLimit(getLatestRateLimit());
    } catch (err: unknown) {
      if (err instanceof GitHubApiError) {
        setError(err.message);
        setIsRateLimited(err.isRateLimit);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while communicating with GitHub.');
      }
      setRateLimit(getLatestRateLimit());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(username, false);
  }, [username, loadData]);

  const refetch = useCallback(async () => {
    await loadData(username, true);
  }, [username, loadData]);

  const loadDemoProfile = useCallback(() => {
    setUsername(DEMO_USERNAME);
  }, []);

  return {
    username,
    setUsername,
    user,
    repos,
    events,
    languageStats,
    rateLimit,
    isLoading,
    error,
    isRateLimited,
    isDemoMode,
    refetch,
    loadDemoProfile,
  };
}
