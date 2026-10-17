import {
  MapPin,
  Building,
  Link as LinkIcon,
  RefreshCw,
  Star,
  Users,
  GitFork,
  BookOpen,
} from 'lucide-react';
import { GithubIcon, TwitterIcon } from '../common/BrandIcons.tsx';
import type { GitHubUser, GitHubRepo } from '../../types/github.ts';
import { Badge } from '../common/Badge.tsx';
import { StatCard } from '../common/StatCard.tsx';
import { Button } from '../common/Button.tsx';

interface ProfileHeaderProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  isDemoMode: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export function ProfileHeader({
  user,
  repos,
  isDemoMode,
  onRefresh,
  isLoading,
}: ProfileHeaderProps) {
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Profile Banner Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-glow-cyan"
              />
              {user.hireable && (
                <div
                  className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md"
                  title="Open for opportunities"
                >
                  Hireable
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user.name || user.login}
                </h1>
                <Badge variant="cyan" size="sm">
                  @{user.login}
                </Badge>
                {isDemoMode && (
                  <Badge variant="violet" size="sm" dot>
                    Demo Showcase Profile
                  </Badge>
                )}
              </div>

              {user.bio && (
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {user.location}
                  </span>
                )}
                {user.company && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    {user.company}
                  </span>
                )}
                {user.blog && (
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    {user.blog.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {user.twitter_username && (
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-cyan-400"
                  >
                    <TwitterIcon className="w-3.5 h-3.5" />
                    @{user.twitter_username}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              isLoading={isLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Public Repos"
          value={user.public_repos}
          subtitle="Total open-source repos"
          icon={<BookOpen className="w-5 h-5" />}
          accent="cyan"
        />
        <StatCard
          title="Stars Earned"
          value={totalStars.toLocaleString()}
          subtitle="Across active public repos"
          icon={<Star className="w-5 h-5" />}
          accent="amber"
        />
        <StatCard
          title="Total Forks"
          value={totalForks.toLocaleString()}
          subtitle="Community derivatives"
          icon={<GitFork className="w-5 h-5" />}
          accent="violet"
        />
        <StatCard
          title="Followers"
          value={user.followers.toLocaleString()}
          subtitle={`${user.following} following`}
          icon={<Users className="w-5 h-5" />}
          accent="emerald"
        />
      </div>
    </div>
  );
}
