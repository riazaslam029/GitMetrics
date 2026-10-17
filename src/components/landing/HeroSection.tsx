import { useRef, useState, type FormEvent } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Terminal, Award, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons.tsx';
import { Button } from '../common/Button.tsx';
import { Badge } from '../common/Badge.tsx';
import type { NavTab } from '../common/Navbar.tsx';

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  onTabChange: (tab: NavTab) => void;
  onSearchUsername: (user: string) => void;
  currentUsername: string;
}

export function HeroSection({
  onTabChange,
  onSearchUsername,
  currentUsername,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState('');

  useGSAP(
    () => {
      // Check reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

      tl.from('.hero-badge-elem', { y: 20, opacity: 0, delay: 0.1 })
        .from('.hero-headline', { y: 35, opacity: 0, stagger: 0.12 }, '-=0.5')
        .from('.hero-description', { y: 20, opacity: 0 }, '-=0.4')
        .from('.hero-search-box', { scale: 0.96, opacity: 0 }, '-=0.3')
        .from('.hero-preview-card', { y: 40, opacity: 0, duration: 1 }, '-=0.4');
    },
    { scope: containerRef }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearchUsername(inputVal.trim());
      onTabChange('github');
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-12 pb-24 overflow-hidden border-b border-white/5"
    >
      {/* Ambient background glow and grid */}
      <div className="absolute inset-0 bg-radial-gradient-hero pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="hero-badge-elem inline-flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              GitMetrics • Developer Intelligence &amp; Scorecard Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Audit Your GitHub.{' '}
            <span className="text-gradient-cyan block mt-2">Elevate Your Engineering Presence.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A developer command center uniting live GitHub telemetry, algorithmic profile scoring with actionable improvement suggestions, repository deep inspection, and 1-click standalone portfolio publishing.
          </p>

          {/* Direct Profile Lookup Box */}
          <div className="hero-search-box max-w-xl mx-auto mb-8">
            <form
              onSubmit={handleSubmit}
              className="relative p-1.5 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-cyan-500/60 transition-all"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <GithubIcon className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                <span className="text-slate-400 font-mono text-sm">github.com/</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="username (e.g. torvalds)"
                  className="w-full bg-transparent border-none text-sm text-white placeholder-slate-400 focus:outline-none font-mono py-2"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shrink-0"
              >
                Inspect Profile
              </Button>
            </form>

            {/* Quick Demo links */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-400">Quick explore:</span>
              <button
                onClick={() => {
                  onSearchUsername('alex-dev');
                  onTabChange('github');
                }}
                className="hover:text-cyan-400 font-mono text-slate-300 underline decoration-slate-600 underline-offset-4"
              >
                alex-dev (Demo)
              </button>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => {
                  onSearchUsername('torvalds');
                  onTabChange('github');
                }}
                className="hover:text-cyan-400 font-mono text-slate-300 underline decoration-slate-600 underline-offset-4"
              >
                torvalds
              </button>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => {
                  onSearchUsername('shadcn');
                  onTabChange('github');
                }}
                className="hover:text-cyan-400 font-mono text-slate-300 underline decoration-slate-600 underline-offset-4"
              >
                shadcn
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => onTabChange('github')}
              variant="glow-cyan"
              size="lg"
              leftIcon={<Terminal className="w-4 h-4" />}
            >
              Open Command Center
            </Button>
            <Button
              onClick={() => onTabChange('audit')}
              variant="secondary"
              size="lg"
              leftIcon={<Award className="w-4 h-4 text-amber-400" />}
            >
              Audit Profile &amp; Score
            </Button>
          </div>
        </div>

        {/* Product Preview Mockup Window */}
        <div className="hero-preview-card mt-16 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0B0F19]/90 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* OS Titlebar */}
          <div className="px-4 py-3 bg-[#080B14] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                gitmetrics :: session active [user: @{currentUsername}]
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                Scorecard Ready
              </Badge>
              <Badge variant="emerald" size="sm">
                REST API v3
              </Badge>
            </div>
          </div>

          {/* Preview Content Inside Terminal */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-b from-[#0B0F19] to-[#060810]">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>GitHub Telemetry</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">100% Public Data</div>
              <p className="text-xs text-slate-400">
                Zero scraping or fabricated metrics. Real rate limits, languages, forks &amp; stars.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Profile Score &amp; Audit</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">Score &amp; Action Plan</div>
              <p className="text-xs text-slate-400">
                Automatic audit grading licenses, READMEs, topic tags, and SEO suggestions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>1-Click Publishing</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">Standalone HTML</div>
              <p className="text-xs text-slate-400">
                Download a self-contained, responsive portfolio bundle ready for GitHub Pages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
