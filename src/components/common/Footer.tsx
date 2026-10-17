import { Terminal, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';
import { GithubIcon } from './BrandIcons.tsx';
import type { NavTab } from './Navbar.tsx';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export function Footer({ onTabChange }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-[#04060C] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Manifesto */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-white font-mono tracking-tight text-sm">
              Git<span className="text-cyan-400">Metrics</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The open-source developer command center combining live GitHub analytics, profile score audits, actionable improvement recommendations, and 1-click standalone portfolio publishing.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side • Zero Telemetry</span>
          </div>
        </div>

        {/* Quick Nav */}
        <div>
          <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onTabChange('overview')}
                className="hover:text-cyan-400 transition-colors"
              >
                Overview &amp; Manifesto
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('github')}
                className="hover:text-cyan-400 transition-colors"
              >
                GitHub Intelligence
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('audit')}
                className="hover:text-cyan-400 transition-colors font-medium text-amber-300"
              >
                Profile Score &amp; Audit
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('projects')}
                className="hover:text-cyan-400 transition-colors"
              >
                Project Showcase
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('workspace')}
                className="hover:text-cyan-400 transition-colors"
              >
                Personal Workspace
              </button>
            </li>
            <li>
              <button
                onClick={() => onTabChange('portfolio')}
                className="hover:text-cyan-400 transition-colors"
              >
                Portfolio Builder
              </button>
            </li>
          </ul>
        </div>

        {/* Tech Stack & Standards */}
        <div>
          <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider">
            Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>React 19 + TypeScript + Vite</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Tailwind CSS Dark Systems</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Algorithmic Developer Audit</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Lenis &amp; GSAP Scroll Physics</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>GitHub REST API Public v3</span>
            </li>
          </ul>
        </div>

        {/* Open Source / Community */}
        <div>
          <h4 className="text-xs font-mono uppercase text-slate-300 font-semibold mb-3 tracking-wider">
            Open Source
          </h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Free and open-source under the MIT License. Built for students, engineers, and builders worldwide.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/riazaslam029/GitMetrics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://docs.github.com/en/rest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span>GitHub REST API Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          &copy; {new Date().getFullYear()} GitMetrics. Released under the MIT License.
        </div>
        <div className="flex items-center gap-1">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for the global developer community</span>
        </div>
      </div>
    </footer>
  );
}
