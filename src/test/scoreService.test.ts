import { describe, it, expect } from 'vitest';
import { calculateProfileAudit } from '../services/scoreService.ts';
import { DEMO_USER, DEMO_REPOSITORIES } from '../data/mockDemoData.ts';

describe('Profile Audit & Developer Scoring Engine', () => {
  it('accurately audits complete developer profile and assigns high grade', () => {
    const audit = calculateProfileAudit(DEMO_USER, DEMO_REPOSITORIES);

    expect(audit.overallScore).toBeGreaterThanOrEqual(70);
    expect(['A+', 'A', 'B']).toContain(audit.grade);
    expect(audit.categories.profile.score).toBeGreaterThan(0);
    expect(audit.categories.repos.score).toBeGreaterThan(0);
    expect(audit.categories.documentation.score).toBeGreaterThan(0);
    expect(audit.categories.discoverability.score).toBeGreaterThan(0);
  });

  it('generates actionable suggestions for missing profile fields', () => {
    const minimalUser = {
      ...DEMO_USER,
      name: '',
      bio: '',
      location: null,
      blog: '',
      twitter_username: null,
    };

    const audit = calculateProfileAudit(minimalUser, []);
    expect(audit.overallScore).toBeLessThan(50);
    expect(audit.suggestions.length).toBeGreaterThan(0);

    const hasNameSuggestion = audit.suggestions.some((s) => s.id === 'profile-name');
    const hasBioSuggestion = audit.suggestions.some((s) => s.id === 'profile-bio');
    expect(hasNameSuggestion).toBe(true);
    expect(hasBioSuggestion).toBe(true);
  });

  it('detects missing open source licenses across repositories', () => {
    const unlicensedRepos = DEMO_REPOSITORIES.map((r) => ({
      ...r,
      license: null,
    }));

    const audit = calculateProfileAudit(DEMO_USER, unlicensedRepos);
    const hasLicenseSuggestion = audit.suggestions.some((s) => s.id === 'repo-licenses');
    expect(hasLicenseSuggestion).toBe(true);
    expect(audit.stats.reposWithLicense).toBe(0);
  });

  it('determines archetype based on languages in repositories', () => {
    const audit = calculateProfileAudit(DEMO_USER, DEMO_REPOSITORIES);
    expect(audit.archetype).toContain('Systems');
  });
});
