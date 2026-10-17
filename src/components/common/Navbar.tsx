import { useState, type FormEvent } from 'react';
import {
  Code2,
  Terminal,
  Activity,
  Award,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';
import { Badge } from './Badge.tsx';
import type { RateLimitInfo } from '../../types/github.ts';
import { SUGGESTED_PROFILES } from '../../data/mockDemoData.ts';

export type NavTab = 'overview' | 'github' | 'audit' | 'projects' | 'workspace' | 'portfolio';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  username: string;
  onSearchUsername: (user: string) => void;
  rateLimit: RateLimitInfo;
  isDemoMode: boolean;
  onOpenExportModal: () => void;
}

export function Navbar({
  activeTab,
  onTabChange,
  username,
  onSearchUsername,
  rateLimit,
  isDemoMode,
  onOpenExportModal,
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isProfilesOpen, setIsProfilesOpen] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchUsername(searchInput.trim());
      setSearchInput('');
      onTabChange('github');
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Terminal className="w-4 h-4" /> },
    { id: 'github', label: 'GitHub Intel', icon: <Activity className="w-4 h-4" /> },
    { id: 'audit', label: 'Score & Audit', icon: <Award className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'workspace', label: 'Workspace', icon: <Code2 className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfolio Builder', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#05070E]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-glow-cyan">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-mono">
                  Git<span className="text-cyan-400 font-extrabold">Metrics</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  v2.0
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/60 border border-white/5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Elements: Quick Search, Profiles Dropdown & Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="relative hidden xl:block">
            <input
              type="text"
              placeholder="Lookup GitHub user..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-44 bg-slate-900/80 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          {/* Quick profile switch */}
          <div className="relative">
            <button
              onClick={() => setIsProfilesOpen(!isProfilesOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-200 hover:border-white/20 transition-all"
            >
              <span className="text-slate-400">@</span>
              <span className="max-w-[75px] sm:max-w-[90px] truncate font-medium">
                {username}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isProfilesOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0B0F19] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">
                  Preset Profiles
                </div>
                <button
                  onClick={() => {
                    onSearchUsername('alex-dev');
                    setIsProfilesOpen(false);
                    onTabChange('github');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center justify-between group text-slate-200"
                >
                  <span className="font-mono">alex-dev</span>
                  <Badge variant="cyan" size="sm">Demo Profile</Badge>
                </button>
                <div className="my-1 border-t border-white/5" />
                {SUGGESTED_PROFILES.map((p) => (
                  <button
                    key={p.username}
                    onClick={() => {
                      onSearchUsername(p.username);
                      setIsProfilesOpen(false);
                      onTabChange('github');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-white/5 text-slate-300 hover:text-white flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-medium">{p.username}</div>
                      <div className="text-[10px] text-slate-400">{p.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* API Status Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border bg-slate-900/50 border-white/5 text-slate-400"
            title={`Rate limit: ${rateLimit.remaining}/${rateLimit.limit} requests remaining. Resets at ${new Date(
              rateLimit.resetTime * 1000
            ).toLocaleTimeString()}`}
          >
            {rateLimit.remaining <= 5 ? (
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            )}
            <span className="hidden lg:inline">API:</span>
            <span
              className={
                rateLimit.remaining <= 5
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-300'
              }
            >
              {rateLimit.remaining}/{rateLimit.limit}
            </span>
          </div>

          {/* Demo badge if active */}
          {isDemoMode && (
            <Badge variant="violet" size="sm" dot>
              Demo
            </Badge>
          )}

          {/* Export Action Button */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all"
          >
            <span>Export</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-white/5 bg-[#080B14]/90 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-mono transition-colors shrink-0 ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
