import type { GitHubUser, GitHubRepo, GitHubEvent, LanguageStat, RateLimitInfo } from '../types/github.ts';
import { DEMO_USERNAME, DEMO_USER, DEMO_REPOSITORIES, DEMO_EVENTS } from '../data/mockDemoData.ts';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_PREFIX = 'gitmetrics_cache_';
const TOKEN_KEY = 'gitmetrics_gh_token';

// Language color mappings based on GitHub's official linguist library
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Zig: '#ec915c',
  Elixir: '#6e4a7e',
  Other: '#64748b',
};

export class GitHubApiError extends Error {
  status: number;
  isRateLimit: boolean;
  resetTime?: number;

  constructor(message: string, status: number, isRateLimit = false, resetTime?: number) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.isRateLimit = isRateLimit;
    this.resetTime = resetTime;
  }
}

// In-memory rate limit tracker
let latestRateLimit: RateLimitInfo = {
  limit: 60,
  remaining: 60,
  resetTime: Math.floor(Date.now() / 1000) + 3600,
  used: 0,
};

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function getLatestRateLimit(): RateLimitInfo {
  return latestRateLimit;
}

function updateRateLimitFromHeaders(headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');
  const used = headers.get('x-ratelimit-used');

  if (limit && remaining && reset) {
    latestRateLimit = {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      resetTime: parseInt(reset, 10),
      used: used ? parseInt(used, 10) : parseInt(limit, 10) - parseInt(remaining, 10),
    };
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch GitHub User Profile
 */
export async function fetchGitHubUser(username: string, forceFresh = false): Promise<GitHubUser> {
  const cleanUsername = username.trim().toLowerCase();

  // If user requested the demo username, return mock data immediately
  if (cleanUsername === DEMO_USERNAME) {
    return DEMO_USER;
  }

  const cacheKey = `${CACHE_PREFIX}user_${cleanUsername}`;
  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as GitHubUser;
      }
    } catch {
      // Ignore cache retrieval errors
    }
  }

  const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}`, {
    headers: getAuthHeaders(),
  });

  updateRateLimitFromHeaders(response.headers);

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError(`User "${cleanUsername}" was not found on GitHub. Check the spelling and try again.`, 404);
    }
    if (response.status === 403) {
      const resetTime = latestRateLimit.resetTime;
      const isRate = response.headers.get('x-ratelimit-remaining') === '0';
      throw new GitHubApiError(
        isRate
          ? `GitHub public API rate limit reached (60 req/hr). Reset in ${Math.max(1, Math.ceil((resetTime * 1000 - Date.now()) / 60000))} minutes. Add an optional personal token or use Demo Mode.`
          : 'Access denied or rate-limited by GitHub API.',
        403,
        isRate,
        resetTime
      );
    }
    throw new GitHubApiError(`GitHub API error (${response.status}): ${response.statusText}`, response.status);
  }

  const data = (await response.json()) as GitHubUser;
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // Ignore storage quota
  }

  return data;
}

/**
 * Fetch Public Repositories (up to 100 most recently updated)
 */
export async function fetchGitHubRepos(username: string, forceFresh = false): Promise<GitHubRepo[]> {
  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername === DEMO_USERNAME) {
    return DEMO_REPOSITORIES;
  }

  const cacheKey = `${CACHE_PREFIX}repos_${cleanUsername}`;
  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as GitHubRepo[];
      }
    } catch {
      // Ignore cache
    }
  }

  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated&type=owner`;
  const response = await fetch(url, { headers: getAuthHeaders() });

  updateRateLimitFromHeaders(response.headers);

  if (!response.ok) {
    throw new GitHubApiError(`Failed to fetch repositories (${response.status})`, response.status);
  }

  const data = (await response.json()) as GitHubRepo[];
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // Ignore
  }

  return data;
}

/**
 * Fetch Recent Public Activity Events
 */
export async function fetchGitHubEvents(username: string, forceFresh = false): Promise<GitHubEvent[]> {
  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername === DEMO_USERNAME) {
    return DEMO_EVENTS;
  }

  const cacheKey = `${CACHE_PREFIX}events_${cleanUsername}`;
  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as GitHubEvent[];
      }
    } catch {
      // Ignore
    }
  }

  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=30`;
  const response = await fetch(url, { headers: getAuthHeaders() });

  updateRateLimitFromHeaders(response.headers);

  if (!response.ok) {
    // Events might be empty or restricted, fallback gracefully to empty array rather than blocking user
    return [];
  }

  const data = (await response.json()) as GitHubEvent[];
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // Ignore
  }

  return data;
}

/**
 * Calculate Language Distribution across Repositories
 */
export function calculateLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const langCountMap: Record<string, number> = {};
  let totalWithLanguage = 0;

  repos.forEach((repo) => {
    if (repo.language && !repo.fork) {
      langCountMap[repo.language] = (langCountMap[repo.language] || 0) + 1;
      totalWithLanguage += 1;
    }
  });

  if (totalWithLanguage === 0) {
    return [];
  }

  const sorted = Object.entries(langCountMap).sort((a, b) => b[1] - a[1]);

  // Keep top 6 and bundle the rest into 'Other'
  const topLangs = sorted.slice(0, 6);
  const remainingLangs = sorted.slice(6);
  const remainingCount = remainingLangs.reduce((acc, curr) => acc + curr[1], 0);

  const result: LanguageStat[] = topLangs.map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / totalWithLanguage) * 100),
    color: LANGUAGE_COLORS[name] || '#38bdf8',
  }));

  if (remainingCount > 0) {
    result.push({
      name: 'Other',
      count: remainingCount,
      percentage: Math.round((remainingCount / totalWithLanguage) * 100),
      color: LANGUAGE_COLORS.Other,
    });
  }

  return result;
}
