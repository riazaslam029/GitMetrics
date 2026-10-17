import { useState } from 'react';
import {
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  Check,
  Plus,
  Shield,
  Copy,
  Terminal,
  AlertCircle,
  CheckCircle2,
  GitBranch,
  CircleDot,
  FileText,
} from 'lucide-react';
import type { GitHubRepo } from '../../types/github.ts';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { LANGUAGE_COLORS } from '../../services/githubApi.ts';

interface RepositoryDetailModalProps {
  repo: GitHubRepo | null;
  isOpen: boolean;
  onClose: () => void;
  isPortfolioSelected: boolean;
  onTogglePortfolio: (repo: GitHubRepo) => void;
}

export function RepositoryDetailModal({
  repo,
  isOpen,
  onClose,
  isPortfolioSelected,
  onTogglePortfolio,
}: RepositoryDetailModalProps) {
  const [cloneProtocol, setCloneProtocol] = useState<'https' | 'ssh' | 'cli'>('https');
  const [copiedClone, setCopiedClone] = useState(false);

  if (!repo) return null;

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#38bdf8' : '#64748b';

  const cloneCommands = {
    https: `git clone https://github.com/${repo.full_name}.git`,
    ssh: `git clone git@github.com:${repo.full_name}.git`,
    cli: `gh repo clone ${repo.full_name}`,
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommands[cloneProtocol]);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.pushed_at || repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={repo.name}
      subtitle={repo.full_name}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Metric Badges Header */}
        <div className="flex flex-wrap items-center gap-3">
          {repo.language && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-white">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
              <span>{repo.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-amber-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{repo.stargazers_count.toLocaleString()} stars</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-purple-300">
            <GitFork className="w-3.5 h-3.5 text-purple-400" />
            <span>{repo.forks_count.toLocaleString()} forks</span>
          </div>

          {repo.license ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>{repo.license.spdx_id || repo.license.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>No License</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate}d ago`}</span>
          </div>
        </div>

        {/* Detailed Overview */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Repository Description
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5 font-sans">
            {repo.description || 'No public repository description provided on GitHub.'}
          </p>
        </div>

        {/* Topics / Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
              Categorized Topics &amp; Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Clone Terminal Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Clone Repository</span>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setCloneProtocol('https')}
                className={`px-2 py-0.5 rounded ${
                  cloneProtocol === 'https' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                }`}
              >
                HTTPS
              </button>
              <button
                onClick={() => setCloneProtocol('ssh')}
                className={`px-2 py-0.5 rounded ${
                  cloneProtocol === 'ssh' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                }`}
              >
                SSH
              </button>
              <button
                onClick={() => setCloneProtocol('cli')}
                className={`px-2 py-0.5 rounded ${
                  cloneProtocol === 'cli' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                }`}
              >
                GitHub CLI
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 bg-black/60 p-2.5 rounded-xl border border-white/5 text-xs">
            <code className="text-cyan-300 truncate">{cloneCommands[cloneProtocol]}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyClone}
              leftIcon={copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedClone ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Repository Health Checklist */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3 font-mono text-xs">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Repository Health &amp; Best Practices
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-slate-300">
              {repo.description ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>Description: {repo.description ? 'Present' : 'Missing'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {repo.license ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>Open License: {repo.license ? repo.license.spdx_id : 'Missing LICENSE file'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {repo.topics && repo.topics.length > 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>Topic Tags: {repo.topics?.length || 0} attached</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {repo.homepage ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span>Live Demo URL: {repo.homepage ? 'Attached' : 'None specified'}</span>
            </div>
          </div>
        </div>

        {/* Direct GitHub Deep Links Navigation */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
            Explore on GitHub
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Browse Code</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`${repo.html_url}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <CircleDot className="w-3.5 h-3.5 text-amber-400" />
              <span>Issues ({repo.open_issues_count})</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`${repo.html_url}/pulls`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>Pull Requests</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`${repo.html_url}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span>Releases</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href={`${repo.html_url}/commits`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span>Commit Log</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <Button
            onClick={() => onTogglePortfolio(repo)}
            variant={isPortfolioSelected ? 'glow-cyan' : 'secondary'}
            size="md"
            leftIcon={isPortfolioSelected ? <Check className="w-4 h-4 text-cyan-300" /> : <Plus className="w-4 h-4" />}
          >
            {isPortfolioSelected ? 'Pinned to Portfolio' : 'Pin to Portfolio'}
          </Button>

          <div className="flex items-center gap-2">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
            >
              <span>Open on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
