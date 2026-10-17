import { Star, GitFork, ExternalLink, Calendar, Plus, Check, Eye } from 'lucide-react';
import type { GitHubRepo } from '../../types/github.ts';
import { LANGUAGE_COLORS } from '../../services/githubApi.ts';

interface RepositoryCardProps {
  repo: GitHubRepo;
  isPortfolioSelected?: boolean;
  onTogglePortfolio?: (repo: GitHubRepo) => void;
  onInspectRepo?: (repo: GitHubRepo) => void;
}

export function RepositoryCard({
  repo,
  isPortfolioSelected = false,
  onTogglePortfolio,
  onInspectRepo,
}: RepositoryCardProps) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#38bdf8' : '#64748b';

  const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Language and Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {repo.language ? (
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span>{repo.language}</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">Documentation / Config</span>
          )}

          <div className="flex items-center gap-1">
            {onTogglePortfolio && (
              <button
                onClick={() => onTogglePortfolio(repo)}
                title={isPortfolioSelected ? 'Remove from Portfolio' : 'Add to Portfolio'}
                className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 ${
                  isPortfolioSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {isPortfolioSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span className="text-[10px] hidden sm:inline">
                  {isPortfolioSelected ? 'In Portfolio' : 'Pin'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <button
            onClick={() => onInspectRepo && onInspectRepo(repo)}
            className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-mono text-left"
          >
            <span className="truncate max-w-[220px] sm:max-w-[260px]">{repo.name}</span>
          </button>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open on GitHub"
            className="text-slate-500 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed min-h-[3rem]">
          {repo.description || 'No public repository description provided.'}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300/80 border border-cyan-500/15"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] font-mono text-slate-400 self-center">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer: Metrics, Deep Inspect Button and Updated Timestamp */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors" title="Stars">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{repo.stargazers_count}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300 hover:text-purple-400 transition-colors" title="Forks">
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>{repo.forks_count}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onInspectRepo && (
            <button
              onClick={() => onInspectRepo(repo)}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Eye className="w-3 h-3" />
              <span>Details</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400 flex items-center gap-1" title="Last updated">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
