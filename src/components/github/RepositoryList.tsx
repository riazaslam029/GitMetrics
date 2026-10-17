import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import type { GitHubRepo } from '../../types/github.ts';
import { RepositoryCard } from './RepositoryCard.tsx';
import { RepositoryDetailModal } from './RepositoryDetailModal.tsx';
import { RepoCardSkeleton } from '../common/Skeleton.tsx';
import { Badge } from '../common/Badge.tsx';

type SortOption = 'stars' | 'forks' | 'updated' | 'name';

interface RepositoryListProps {
  repos: GitHubRepo[];
  isLoading: boolean;
  selectedPortfolioRepoIds?: (string | number)[];
  onTogglePortfolio?: (repo: GitHubRepo) => void;
  onInspectRepo?: (repo: GitHubRepo) => void;
}

export function RepositoryList({
  repos,
  isLoading,
  selectedPortfolioRepoIds = [],
  onTogglePortfolio,
  onInspectRepo,
}: RepositoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [internalModalRepo, setInternalModalRepo] = useState<GitHubRepo | null>(null);

  // Extract available unique languages
  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [repos]);

  // Filter and sort logic
  const filteredRepos = useMemo(() => {
    return repos
      .filter((repo) => {
        const matchesLang =
          selectedLanguage === 'all' || repo.language === selectedLanguage;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          repo.name.toLowerCase().includes(q) ||
          (repo.description && repo.description.toLowerCase().includes(q)) ||
          (repo.topics && repo.topics.some((t) => t.toLowerCase().includes(q)));
        return matchesLang && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        }
        if (sortBy === 'forks') {
          return (b.forks_count || 0) - (a.forks_count || 0);
        }
        if (sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  const handleInspect = (repo: GitHubRepo) => {
    if (onInspectRepo) {
      onInspectRepo(repo);
    } else {
      setInternalModalRepo(repo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Language Filter, and Sort */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search repositories by name, topic, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">
                All Languages ({repos.length})
              </option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="stars" className="bg-slate-900 text-white">
                Sort: Most Stars
              </option>
              <option value="forks" className="bg-slate-900 text-white">
                Sort: Most Forks
              </option>
              <option value="updated" className="bg-slate-900 text-white">
                Sort: Recently Updated
              </option>
              <option value="name" className="bg-slate-900 text-white">
                Sort: Alphabetical
              </option>
            </select>
          </div>

          <Badge variant="muted" size="sm">
            {filteredRepos.length} Repos
          </Badge>
        </div>
      </div>

      {/* Repositories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              isPortfolioSelected={selectedPortfolioRepoIds.includes(repo.id)}
              onTogglePortfolio={onTogglePortfolio}
              onInspectRepo={handleInspect}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Matching Repositories</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No public repositories matched your filter &ldquo;{searchQuery}&rdquo; and language
            selection. Try resetting your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLanguage('all');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Internal Modal fallback */}
      <RepositoryDetailModal
        repo={internalModalRepo}
        isOpen={Boolean(internalModalRepo)}
        onClose={() => setInternalModalRepo(null)}
        isPortfolioSelected={
          internalModalRepo ? selectedPortfolioRepoIds.includes(internalModalRepo.id) : false
        }
        onTogglePortfolio={onTogglePortfolio || (() => {})}
      />
    </div>
  );
}
