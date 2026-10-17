import { GitCommit, GitPullRequest, Star, Tag, Info, AlertCircle } from 'lucide-react';
import type { GitHubEvent } from '../../types/github.ts';
import { Badge } from '../common/Badge.tsx';

interface ActivityFeedProps {
  events: GitHubEvent[];
  isLoading: boolean;
}

export function ActivityFeed({ events, isLoading }: ActivityFeedProps) {
  const renderEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4 text-cyan-400" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case 'WatchEvent':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'CreateEvent':
        return <Tag className="w-4 h-4 text-emerald-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatEventTitle = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        return `Pushed ${event.payload.commits?.length || 1} commit(s) to`;
      case 'PullRequestEvent':
        return `${event.payload.action || 'Opened'} PR in`;
      case 'WatchEvent':
        return 'Starred repository';
      case 'CreateEvent':
        return `Created ${event.payload.ref_type || 'tag/branch'} in`;
      case 'ForkEvent':
        return 'Forked repository';
      case 'IssuesEvent':
        return `${event.payload.action || 'Updated'} issue in`;
      default:
        return `${event.type.replace('Event', '')} on`;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
      {/* Header and Honest API Disclaimer */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Public Event Telemetry</h3>
          <Badge variant="cyan" size="sm">
            Live Event Feed
          </Badge>
        </div>

        {/* Clear limitation disclaimer */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Public Activity Note:</span> This stream
            shows real public GitHub activity retrieved from{' '}
            <code className="text-cyan-400 font-mono text-[11px]">/users/:username/events/public</code>.
            Under GitHub privacy standards, private commits and full contribution calendar histories
            cannot be retrieved via public REST endpoints without user OAuth consent.
          </div>
        </div>
      </div>

      {/* Events Stream */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 rounded-xl bg-slate-900/40">
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-slate-800 rounded" />
                <div className="h-2.5 w-1/2 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {events.slice(0, 10).map((event) => {
            const timeAgo = new Date(event.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={event.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#05070E] border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-white/5">{renderEventIcon(event.type)}</span>
                      <span className="text-slate-300 font-medium">
                        {formatEventTitle(event)}{' '}
                        <a
                          href={`https://github.com/${event.repo.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 font-mono font-bold hover:underline"
                        >
                          {event.repo.name}
                        </a>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">{timeAgo}</span>
                  </div>

                  {/* Commit message or PR title snippet */}
                  {event.payload.commits && event.payload.commits.length > 0 && (
                    <div className="mt-2 text-xs font-mono text-slate-400 bg-black/40 p-2 rounded-lg border border-white/5 line-clamp-2">
                      &gt; {event.payload.commits[0].message}
                    </div>
                  )}

                  {event.payload.pull_request && (
                    <div className="mt-2 text-xs text-slate-300 bg-black/40 p-2 rounded-lg border border-white/5">
                      PR #{event.payload.pull_request.number}: {event.payload.pull_request.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <div className="text-sm text-slate-300 font-bold">No Recent Public Events</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This account hasn&apos;t recorded public pushes, stars, or pull requests in the last 90 days.
          </p>
        </div>
      )}
    </div>
  );
}
