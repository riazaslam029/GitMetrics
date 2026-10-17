import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import type { GitHubRepo } from '../../types/github.ts';
import { RepositoryCard } from '../github/RepositoryCard.tsx';
import { RepositoryDetailModal } from '../github/RepositoryDetailModal.tsx';
import { Badge } from '../common/Badge.tsx';

interface ProjectShowcaseViewProps {
  repos: GitHubRepo[];
  selectedPortfolioRepoIds: (string | number)[];
  onTogglePortfolio: (repo: GitHubRepo) => void;
  isLoading?: boolean;
}

export function ProjectShowcaseView({
  repos,
  selectedPortfolioRepoIds,
  onTogglePortfolio,
}: ProjectShowcaseViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeModalRepo, setActiveModalRepo] = useState<GitHubRepo | null>(null);

  // Extract top technology tags / languages across repositories
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        tagCount[r.language] = (tagCount[r.language] || 0) + 1;
      }
      if (r.topics) {
        r.topics.forEach((t) => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === 'all' ||
        r.language?.toLowerCase() === selectedTag.toLowerCase() ||
        r.topics?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [repos, searchQuery, selectedTag]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              Project Showcase
            </Badge>
            <Badge variant="emerald" size="sm">
              Clean 2D Explorer
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curated Engineering Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Explore and inspect your open-source repositories. Pin projects to your public portfolio, generate clone commands, and review repository health.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Category:
        </span>
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
            selectedTag === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          All ({repos.length})
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              selectedTag === tag
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepos.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repo={repo}
            isPortfolioSelected={selectedPortfolioRepoIds.includes(repo.id)}
            onTogglePortfolio={onTogglePortfolio}
            onInspectRepo={(r) => setActiveModalRepo(r)}
          />
        ))}
      </div>

      {/* Deep-dive Project Inspection Modal */}
      <RepositoryDetailModal
        repo={activeModalRepo}
        isOpen={Boolean(activeModalRepo)}
        onClose={() => setActiveModalRepo(null)}
        isPortfolioSelected={
          activeModalRepo ? selectedPortfolioRepoIds.includes(activeModalRepo.id) : false
        }
        onTogglePortfolio={onTogglePortfolio}
      />
    </div>
  );
}
