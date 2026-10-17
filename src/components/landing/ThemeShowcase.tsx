import { useState } from 'react';
import { PORTFOLIO_THEMES } from '../portfolio/themes.ts';
import type { PortfolioThemeId } from '../../types/portfolio.ts';
import { Badge } from '../common/Badge.tsx';
import { Check, Sparkles, ExternalLink } from 'lucide-react';
import type { NavTab } from '../common/Navbar.tsx';

interface ThemeShowcaseProps {
  onTabChange: (tab: NavTab) => void;
  onSelectTheme: (theme: PortfolioThemeId) => void;
}

export function ThemeShowcase({ onTabChange, onSelectTheme }: ThemeShowcaseProps) {
  const [selected, setSelected] = useState<PortfolioThemeId>('neon-obsidian');
  const activeTheme = PORTFOLIO_THEMES[selected];

  const handleSelect = (id: PortfolioThemeId) => {
    setSelected(id);
    onSelectTheme(id);
  };

  return (
    <section className="py-24 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="violet" size="sm" className="mb-3">
            Aesthetics Engine
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Four Curated Developer Themes.
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Built with strict contrast standards, fluid typography, and zero visual clutter. Select a theme to inspect the live preview.
          </p>
        </div>

        {/* Theme Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.values(PORTFOLIO_THEMES).map((theme) => {
            const isCurrent = selected === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group ${
                  isCurrent
                    ? 'border-cyan-400/80 bg-slate-900/90 shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/60'
                }`}
              >
                <div
                  className={`h-10 w-full rounded-xl bg-gradient-to-r ${theme.previewGradient} mb-3 flex items-center justify-end px-2.5`}
                >
                  {isCurrent && (
                    <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                      <Check className="w-3 h-3 text-cyan-300" />
                    </div>
                  )}
                </div>
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>{theme.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Preview Card */}
        <div
          className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-2xl relative"
          style={{
            backgroundColor:
              selected === 'cyberpunk-emerald'
                ? '#050B08'
                : selected === 'cosmic-violet'
                ? '#090614'
                : selected === 'nordic-monolith'
                ? '#0B0D11'
                : '#060810',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-bold font-mono text-white"
                style={{
                  borderColor: activeTheme.primaryColor,
                  backgroundColor: activeTheme.cardBg,
                }}
              >
                AR
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Alex Rivera</h3>
                <p
                  className="text-xs font-mono font-medium"
                  style={{ color: activeTheme.primaryColor }}
                >
                  Full-Stack Systems Architect &amp; Creative Technologist
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">San Francisco, CA / Remote</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTabChange('portfolio')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-950"
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Customize in Builder
              </button>
            </div>
          </div>

          {/* Sample Projects in Preview */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl border transition-all"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex justify-between items-center text-xs mb-2">
                <span
                  className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded"
                  style={{
                    color: activeTheme.primaryColor,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  Rust
                </span>
                <span className="text-slate-400 font-mono text-[11px]">★ 842</span>
              </div>
              <h4 className="font-bold text-white text-sm">hyper-cache-engine</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                High-throughput in-memory caching engine written in Rust with lock-free concurrent hash tables.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border transition-all"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex justify-between items-center text-xs mb-2">
                <span
                  className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded"
                  style={{
                    color: activeTheme.primaryColor,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  TypeScript
                </span>
                <span className="text-slate-400 font-mono text-[11px]">★ 618</span>
              </div>
              <h4 className="font-bold text-white text-sm">quantum-gl-canvas</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                WebGL shader pipeline for real-time quantum probability wave simulation in React.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Theme active: {activeTheme.name}</span>
            <button
              onClick={() => onTabChange('portfolio')}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Preview Full Export <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
