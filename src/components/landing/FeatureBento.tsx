import { Activity, Award, CheckSquare, Sparkles, ArrowRight, ShieldCheck, Download, Code } from 'lucide-react';
import { Badge } from '../common/Badge.tsx';
import type { NavTab } from '../common/Navbar.tsx';

interface FeatureBentoProps {
  onTabChange: (tab: NavTab) => void;
}

export function FeatureBento({ onTabChange }: FeatureBentoProps) {
  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" size="sm" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Serious Builders. <br />
            <span className="text-gradient-cyan">Not Just Another Template.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Real engineering workflows: real API metrics, algorithmic profile audits with prioritized improvement suggestions, local task management, and clean production exports.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: GitHub Intelligence (Spans 2 cols on md+) */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <Badge variant="cyan" size="sm">
                REST API v3
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">GitHub Intelligence &amp; Telemetry</h3>
            <p className="text-slate-400 text-sm max-w-xl mb-6 leading-relaxed">
              Real-time profile statistics, repository metadata, star metrics, and language distribution charts. Honest public API feeds without fabricated contributions or deceptive charts.
            </p>
            {/* Visual Mini Mockup */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>GET /users/:username/repos</span>
                <span className="text-emerald-400">200 OK (cached)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '45%' }} className="bg-[#3178c6]" title="TypeScript: 45%" />
                <div style={{ width: '30%' }} className="bg-[#dea584]" title="Rust: 30%" />
                <div style={{ width: '15%' }} className="bg-[#00ADD8]" title="Go: 15%" />
                <div style={{ width: '10%' }} className="bg-[#f1e05a]" title="JavaScript: 10%" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>TypeScript 45%</span>
                <span>Rust 30%</span>
                <span>Go 15%</span>
                <span>JS 10%</span>
              </div>
            </div>
            <button
              onClick={() => onTabChange('github')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore GitHub Analytics <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: GitHub Profile Score & Audit (Replaced 3D!) */}
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <Badge variant="amber" size="sm">
                Score: 88/100
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Profile Score &amp; Audit</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Algorithmic scorecard rating your profile, repo documentation, open licenses, and topic tags with high-impact suggestions to boost recruiter appeal.
            </p>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Repository Quality</span>
                <span className="text-emerald-400 font-bold">Grade A</span>
              </div>
              <div className="text-[11px] text-amber-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>+3 High impact suggestions found</span>
              </div>
            </div>
            <button
              onClick={() => onTabChange('audit')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Inspect Profile Score <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Personal Developer Workspace */}
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-6 h-6" />
              </div>
              <Badge variant="emerald" size="sm">
                LocalStorage
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Developer Workspace</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Personal coding goals with progress bars, weekly Kanban task tracking, and an idea backlog. Stored 100% locally in your browser.
            </p>
            <div className="space-y-2 p-3 rounded-2xl bg-slate-950/80 border border-white/5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Ship GitMetrics</span>
                <span className="text-emerald-400">100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-full" />
              </div>
            </div>
            <button
              onClick={() => onTabChange('workspace')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Manage Tasks &amp; Goals <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: 1-Click Publishing & Portfolio Exporter (Spans 2 cols) */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <Badge variant="violet" size="sm">
                No Fake Publish
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Standalone Production HTML Generator
            </h3>
            <p className="text-slate-400 text-sm max-w-xl mb-6 leading-relaxed">
              Generate a completely self-contained, standalone single-file `index.html` portfolio. No Node.js build step needed. Deploy to GitHub Pages or Netlify by simply uploading the file.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                <Download className="w-4 h-4 text-purple-400 mb-1" />
                <div className="font-bold text-slate-200">1-Click Download</div>
                <div className="text-[11px] text-slate-400">Self-contained index.html</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                <Code className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="font-bold text-slate-200">JSON Config</div>
                <div className="text-[11px] text-slate-400">Version control ready</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="font-bold text-slate-200">GitHub Pages</div>
                <div className="text-[11px] text-slate-400">Included step-by-step guide</div>
              </div>
            </div>
            <button
              onClick={() => onTabChange('portfolio')}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Open Portfolio Configurator <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
