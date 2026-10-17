import { Shield, Key, Database, Cpu, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons.tsx';
import { Badge } from '../common/Badge.tsx';

export function OpenSourceCallout() {
  const principles = [
    {
      icon: <Key className="w-5 h-5 text-cyan-400" />,
      title: 'Zero Paid API Keys Required',
      desc: 'Connects directly to the official GitHub REST API v3. Never demands credit cards or recurring SaaS subscriptions.',
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      title: '100% Client-Side Privacy',
      desc: 'Your coding goals, tasks, and portfolio settings are stored strictly in your browser’s LocalStorage. No covert tracking.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: 'Honest Engineering Metrics',
      desc: 'We never fabricate contribution calendars or fake stars. What you see is authentic data retrieved from GitHub.',
    },
    {
      icon: <Shield className="w-5 h-5 text-amber-400" />,
      title: 'Free Deployment Anywhere',
      desc: 'Export a self-contained single-file HTML bundle. Drag it onto GitHub Pages, Vercel, or Netlify with zero build dependencies.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B0F19] to-[#060810] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-12">
            <Badge variant="emerald" size="sm" className="mb-3">
              Open Source Manifesto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Honest Tools for Modern Developers.
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              We believe developer portfolios shouldn’t be locked behind expensive proprietary builders or slow, ad-heavy platforms. GitMetrics gives you complete ownership over your identity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="font-bold text-white text-base">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400">
              Licensed under MIT • Free for personal and commercial usage
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Contribute on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
