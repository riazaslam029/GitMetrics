import { describe, it, expect } from 'vitest';
import { calculateLanguageStats, GitHubApiError } from '../services/githubApi.ts';
import { DEMO_REPOSITORIES } from '../data/mockDemoData.ts';
import type { GitHubRepo } from '../types/github.ts';

describe('GitHub API Service and Utilities', () => {
  it('correctly calculates language percentages from repository collection', () => {
    const stats = calculateLanguageStats(DEMO_REPOSITORIES);

    expect(stats.length).toBeGreaterThan(0);
    // Sum of percentages should be close to 100
    const sum = stats.reduce((acc, curr) => acc + curr.percentage, 0);
    expect(sum).toBeGreaterThanOrEqual(95);
    expect(sum).toBeLessThanOrEqual(105);

    // Verify top language matches our dataset
    const hasTypeScript = stats.some((s) => s.name === 'TypeScript');
    const hasRust = stats.some((s) => s.name === 'Rust');
    expect(hasTypeScript).toBe(true);
    expect(hasRust).toBe(true);
  });

  it('returns empty array when repositories have no language or only forks', () => {
    const emptyRepos: GitHubRepo[] = [
      {
        id: 1,
        node_id: '1',
        name: 'forked-repo',
        full_name: 'test/forked-repo',
        private: false,
        html_url: 'https://github.com/test/forked',
        description: null,
        fork: true, // Should be ignored in language calculation
        url: '',
        created_at: '',
        updated_at: '',
        pushed_at: '',
        homepage: null,
        size: 10,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Python',
        forks_count: 0,
        open_issues_count: 0,
        license: null,
        archived: false,
        disabled: false,
        default_branch: 'main',
      },
    ];

    const stats = calculateLanguageStats(emptyRepos);
    expect(stats).toEqual([]);
  });

  it('instantiates GitHubApiError with proper rate limit flags', () => {
    const error = new GitHubApiError('Rate limit exceeded', 403, true, 1700000000);
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.status).toBe(403);
    expect(error.isRateLimit).toBe(true);
    expect(error.resetTime).toBe(1700000000);
  });
});
