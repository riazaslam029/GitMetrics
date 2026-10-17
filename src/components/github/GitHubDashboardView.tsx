import { useState } from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';
import type { GitHubUser, GitHubRepo, GitHubEvent, LanguageStat, RateLimitInfo } from '../../types/github.ts';
import { ProfileHeader } from './ProfileHeader.tsx';
import { LanguageDistribution } from './LanguageDistribution.tsx';
import { RepositoryList } from './RepositoryList.tsx';
import { ActivityFeed } from './ActivityFeed.tsx';
import { RateLimitBanner } from './RateLimitBanner.tsx';
import { Button } from '../common/Button.tsx';
import { Badge } from '../common/Badge.tsx';

interface GitHubDashboardViewProps {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  languageStats: LanguageStat[];
  rateLimit: RateLimitInfo;
  isLoading: boolean;
  error: string | null;
  isRateLimited: boolean;
  isDemoMode: boolean;
  onRefresh: () => void;
  onSearchUsername: (username: string) => void;
  selectedPortfolioRepoIds: (string | number)[];
  onTogglePortfolio: (repo: GitHubRepo) => void;
  onSelectForUniverse: (repo: GitHubRepo) => void;
  onLoadDemo: () => void;
}

export function GitHubDashboardView({
  user,
  repos,
  events,
  languageStats,
  rateLimit,
  isLoading,
  error,
  isRateLimited,
  isDemoMode,
  onRefresh,
  onSearchUsername,
  selectedPortfolioRepoIds,
  onTogglePortfolio,
  onSelectForUniverse,
  onLoadDemo,
}: GitHubDashboardViewProps) {
  const [inputVal, setInputVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearchUsername(inputVal.trim());
      setInputVal('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">
              Live GitHub Telemetry
            </Badge>
            {isDemoMode && (
              <Badge variant="violet" size="sm" dot>
                Demo Profile Mode
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            GitHub Intelligence Dashboard
          </h2>
        </div>

        {/* Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Inspect GitHub user..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <Button type="submit" size="sm" variant="primary">
            Inspect
          </Button>
          {!isDemoMode && (
            <Button type="button" size="sm" variant="ghost" onClick={onLoadDemo}>
              Demo
            </Button>
          )}
        </form>
      </div>

      {/* Rate Limit Banner */}
      <RateLimitBanner
        rateLimit={rateLimit}
        isRateLimited={isRateLimited}
        onRetry={onRefresh}
      />

      {/* Error state */}
      {error && !user && (
        <div className="glass-panel p-10 rounded-3xl border border-rose-500/30 bg-rose-500/5 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">GitHub API Error</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">{error}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={onRefresh} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry Request
            </Button>
            <Button variant="secondary" size="sm" onClick={onLoadDemo}>
              Switch to Demo Profile
            </Button>
          </div>
        </div>
      )}

      {/* Loaded profile dashboard */}
      {user && (
        <>
          <ProfileHeader
            user={user}
            repos={repos}
            isDemoMode={isDemoMode}
            onRefresh={onRefresh}
            isLoading={isLoading}
          />

          <LanguageDistribution stats={languageStats} />

          {/* Repositories and Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">Public Repositories</h3>
                <span className="text-xs font-mono text-slate-400">
                  Showing {repos.length} loaded repos
                </span>
              </div>
              <RepositoryList
                repos={repos}
                isLoading={isLoading}
                selectedPortfolioRepoIds={selectedPortfolioRepoIds}
                onTogglePortfolio={onTogglePortfolio}
                onInspectRepo={onSelectForUniverse}
              />
            </div>

            <div className="lg:col-span-4">
              <ActivityFeed events={events} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
