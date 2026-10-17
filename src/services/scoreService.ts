import type { GitHubUser, GitHubRepo } from '../types/github.ts';

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

export type SuggestionPriority = 'critical' | 'high' | 'medium' | 'quick-win';

export interface AuditSuggestion {
  id: string;
  title: string;
  category: 'profile' | 'repository' | 'documentation' | 'discoverability';
  priority: SuggestionPriority;
  description: string;
  actionGuide: string;
  targetRepo?: string;
  targetUrl?: string;
}

export interface ProfileAuditResult {
  overallScore: number; // 0 to 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  archetype: string;
  categories: {
    profile: ScoreCategory;
    repos: ScoreCategory;
    documentation: ScoreCategory;
    discoverability: ScoreCategory;
  };
  suggestions: AuditSuggestion[];
  stats: {
    totalRepos: number;
    reposWithDescription: number;
    reposWithLicense: number;
    reposWithTopics: number;
    reposWithHomepage: number;
  };
}

export function calculateProfileAudit(
  user: GitHubUser | null,
  repos: GitHubRepo[]
): ProfileAuditResult {
  if (!user) {
    return {
      overallScore: 0,
      grade: 'D',
      archetype: 'New Explorer',
      categories: {
        profile: { name: 'Profile Presence', score: 0, maxScore: 25, percentage: 0, description: 'Basic profile fields' },
        repos: { name: 'Repository Quality', score: 0, maxScore: 30, percentage: 0, description: 'Descriptions and health' },
        documentation: { name: 'Documentation & Licensing', score: 0, maxScore: 25, percentage: 0, description: 'Licenses and READMEs' },
        discoverability: { name: 'Discoverability & Topics', score: 0, maxScore: 20, percentage: 0, description: 'Topics and tags' },
      },
      suggestions: [],
      stats: { totalRepos: 0, reposWithDescription: 0, reposWithLicense: 0, reposWithTopics: 0, reposWithHomepage: 0 },
    };
  }

  const suggestions: AuditSuggestion[] = [];

  // 1. Profile Presence (Max 25 pts)
  let profileScore = 0;
  if (user.avatar_url && !user.avatar_url.includes('identicons')) profileScore += 5;
  if (user.name && user.name.trim().length > 0) profileScore += 5;
  else {
    suggestions.push({
      id: 'profile-name',
      title: 'Add your full display name',
      category: 'profile',
      priority: 'high',
      description: 'Your profile displays only your username. A full name helps recruiters find you on LinkedIn and Google.',
      actionGuide: 'Go to GitHub Settings -> Profile -> Name field.',
      targetUrl: 'https://github.com/settings/profile',
    });
  }

  if (user.bio && user.bio.trim().length >= 20) profileScore += 5;
  else {
    suggestions.push({
      id: 'profile-bio',
      title: 'Expand your developer bio',
      category: 'profile',
      priority: 'high',
      description: user.bio ? 'Your bio is very short. Describe your core tech stack, what you are building, or what you are learning.' : 'You do not have a bio. Add a punchy 1-2 sentence description of your expertise.',
      actionGuide: 'Go to GitHub Settings -> Profile -> Bio.',
      targetUrl: 'https://github.com/settings/profile',
    });
  }

  if (user.location) profileScore += 3;
  else {
    suggestions.push({
      id: 'profile-location',
      title: 'Specify your location or remote availability',
      category: 'profile',
      priority: 'quick-win',
      description: 'Helps teams and hiring managers know your time zone and whether you are open to remote work.',
      actionGuide: 'Add e.g. "San Francisco, CA / Remote" or "London, UK" in GitHub Profile settings.',
      targetUrl: 'https://github.com/settings/profile',
    });
  }

  if (user.blog && user.blog.trim().length > 0) profileScore += 4;
  else {
    suggestions.push({
      id: 'profile-website',
      title: 'Add personal website or portfolio link',
      category: 'profile',
      priority: 'high',
      description: 'You do not have a portfolio or blog URL linked on your GitHub profile. Link your published GitMetrics site here!',
      actionGuide: 'Add your URL under GitHub Settings -> Profile -> Website.',
      targetUrl: 'https://github.com/settings/profile',
    });
  }

  if (user.twitter_username || user.company || user.email) profileScore += 3;
  else {
    suggestions.push({
      id: 'profile-socials',
      title: 'Link social presence or contact info',
      category: 'profile',
      priority: 'quick-win',
      description: 'Connect your X/Twitter handle, company affiliation, or contact email to foster community networking.',
      actionGuide: 'Add social handles under GitHub Settings -> Profile -> Social accounts.',
      targetUrl: 'https://github.com/settings/profile',
    });
  }

  // 2. Repository Quality & Metrics (Max 30 pts)
  let repoScore = 0;
  const nonForkRepos = repos.filter((r) => !r.fork);
  const totalReposCount = nonForkRepos.length || repos.length;

  let reposWithDesc = 0;
  let reposWithLic = 0;
  let reposWithTop = 0;
  let reposWithHome = 0;

  const reposWithoutDescription: GitHubRepo[] = [];
  const reposWithoutLicense: GitHubRepo[] = [];
  const reposWithoutTopics: GitHubRepo[] = [];

  (nonForkRepos.length > 0 ? nonForkRepos : repos).forEach((r) => {
    if (r.description && r.description.trim().length > 10) reposWithDesc++;
    else reposWithoutDescription.push(r);

    if (r.license) reposWithLic++;
    else reposWithoutLicense.push(r);

    if (r.topics && r.topics.length > 0) reposWithTop++;
    else reposWithoutTopics.push(r);

    if (r.homepage && r.homepage.trim().length > 0) reposWithHome++;
  });

  const descRatio = totalReposCount > 0 ? reposWithDesc / totalReposCount : 0;
  repoScore += Math.round(descRatio * 15);

  if (reposWithoutDescription.length > 0) {
    const sampleNames = reposWithoutDescription.slice(0, 3).map((r) => r.name).join(', ');
    suggestions.push({
      id: 'repo-descriptions',
      title: `Add descriptions to ${reposWithoutDescription.length} repository${reposWithoutDescription.length > 1 ? 'ies' : ''}`,
      category: 'repository',
      priority: 'critical',
      description: `Repositories without descriptions (such as ${sampleNames}) are often skipped by recruiters because they have no immediate context.`,
      actionGuide: 'Click the gear icon next to "About" on the repository main page on GitHub and write a 1-sentence summary.',
      targetRepo: reposWithoutDescription[0]?.name,
      targetUrl: reposWithoutDescription[0]?.html_url,
    });
  }

  // Public engagement & activity
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  if (totalStars > 0) repoScore += Math.min(10, Math.round(Math.log10(totalStars + 1) * 4));
  if (user.public_repos >= 5) repoScore += 5;

  // 3. Documentation & Licensing (Max 25 pts)
  let docScore = 0;
  const licenseRatio = totalReposCount > 0 ? reposWithLic / totalReposCount : 0;
  docScore += Math.round(licenseRatio * 15);

  if (reposWithoutLicense.length > 0) {
    const sampleLicNames = reposWithoutLicense.slice(0, 3).map((r) => r.name).join(', ');
    suggestions.push({
      id: 'repo-licenses',
      title: `Add an Open-Source License to ${reposWithoutLicense.length} repository${reposWithoutLicense.length > 1 ? 'ies' : ''}`,
      category: 'documentation',
      priority: 'high',
      description: `Repositories like ${sampleLicNames} have no LICENSE file. Without an open license, other developers cannot legally use or contribute to your code.`,
      actionGuide: 'In your repository on GitHub, click "Add file" -> "Create new file", name it LICENSE, and choose an MIT or Apache 2.0 template.',
      targetRepo: reposWithoutLicense[0]?.name,
      targetUrl: reposWithoutLicense[0]?.html_url,
    });
  }

  // Live demos / homepages
  const homeRatio = totalReposCount > 0 ? reposWithHome / totalReposCount : 0;
  docScore += Math.round(homeRatio * 10);

  if (reposWithHome === 0 && totalReposCount > 0) {
    suggestions.push({
      id: 'repo-homepages',
      title: 'Deploy and link a live demo for your top repository',
      category: 'documentation',
      priority: 'high',
      description: 'None of your repositories have a live demo or homepage URL. Live web previews increase engagement by up to 300%.',
      actionGuide: 'Deploy via GitHub Pages, Vercel, or Netlify, then paste the URL into the "Website" field in the repository About sidebar.',
      targetRepo: repos[0]?.name,
      targetUrl: repos[0]?.html_url,
    });
  }

  // 4. Discoverability & Topics (Max 20 pts)
  let discScore = 0;
  const topicRatio = totalReposCount > 0 ? reposWithTop / totalReposCount : 0;
  discScore += Math.round(topicRatio * 10);

  if (reposWithoutTopics.length > 0) {
    suggestions.push({
      id: 'repo-topics',
      title: `Add topic tags to ${reposWithoutTopics.length} repository${reposWithoutTopics.length > 1 ? 'ies' : ''}`,
      category: 'discoverability',
      priority: 'medium',
      description: 'Topic tags like #react, #typescript, #rust, or #api allow GitHub Search and Explore to index your projects.',
      actionGuide: 'Click the gear icon next to About on GitHub and add 3 to 5 relevant tags.',
      targetRepo: reposWithoutTopics[0]?.name,
      targetUrl: reposWithoutTopics[0]?.html_url,
    });
  }

  // Special Profile README check suggestion
  const hasProfileReadmeRepo = repos.some(
    (r) => r.name.toLowerCase() === user.login.toLowerCase()
  );
  if (!hasProfileReadmeRepo) {
    suggestions.push({
      id: 'profile-readme',
      title: `Create a Special Profile README (${user.login}/${user.login})`,
      category: 'discoverability',
      priority: 'medium',
      description: `GitHub has a secret feature: create a repository with the exact same name as your username (${user.login}), and its README will be displayed directly on your public GitHub profile!`,
      actionGuide: `Create a new public repository named "${user.login}", check "Add a README file", and write your portfolio highlights.`,
      targetUrl: 'https://github.com/new',
    });
  } else {
    discScore += 5;
  }

  // Language diversity
  const uniqueLangs = new Set(repos.map((r) => r.language).filter(Boolean));
  if (uniqueLangs.size >= 2) discScore += 5;

  const totalScore = Math.min(100, profileScore + repoScore + docScore + discScore);

  let grade: ProfileAuditResult['grade'] = 'C';
  if (totalScore >= 92) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 65) grade = 'B';
  else if (totalScore >= 45) grade = 'C';
  else grade = 'D';

  // Determine Archetype
  let archetype = 'Full-Stack Developer';
  if (uniqueLangs.has('Rust') || uniqueLangs.has('C') || uniqueLangs.has('C++') || uniqueLangs.has('Go')) {
    archetype = 'Systems & Distributed Architect';
  } else if (uniqueLangs.has('TypeScript') && uniqueLangs.has('Python')) {
    archetype = 'Full-Stack & Applied AI Engineer';
  } else if (uniqueLangs.has('TypeScript') || uniqueLangs.has('JavaScript')) {
    archetype = 'Frontend & Creative Technologist';
  } else if (uniqueLangs.has('Python')) {
    archetype = 'Data Systems & Python Specialist';
  }

  return {
    overallScore: totalScore,
    grade,
    archetype,
    categories: {
      profile: {
        name: 'Profile Presence',
        score: profileScore,
        maxScore: 25,
        percentage: Math.round((profileScore / 25) * 100),
        description: 'Avatar, bio, name, location, and social links',
      },
      repos: {
        name: 'Repository Quality',
        score: repoScore,
        maxScore: 30,
        percentage: Math.round((repoScore / 30) * 100),
        description: 'Meaningful descriptions, stars, and engagement',
      },
      documentation: {
        name: 'Documentation & Licensing',
        score: docScore,
        maxScore: 25,
        percentage: Math.round((docScore / 25) * 100),
        description: 'Open-source licenses and deployed homepages',
      },
      discoverability: {
        name: 'Discoverability & Topics',
        score: discScore,
        maxScore: 20,
        percentage: Math.round((discScore / 20) * 100),
        description: 'Topic tags, profile README, and language breadth',
      },
    },
    suggestions,
    stats: {
      totalRepos: totalReposCount,
      reposWithDescription: reposWithDesc,
      reposWithLicense: reposWithLic,
      reposWithTopics: reposWithTop,
      reposWithHomepage: reposWithHome,
    },
  };
}
