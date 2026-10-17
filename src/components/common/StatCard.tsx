import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accent?: 'cyan' | 'violet' | 'emerald' | 'amber';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accent = 'cyan',
  className = '',
}: StatCardProps) {
  const accentGlow = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_-3px_rgba(0,242,254,0.15)]',
    violet: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.15)]',
    emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]',
    amber: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)]',
  };

  const accentIcons = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    violet: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div
      className={`glass-panel p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${accentGlow[accent]} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{title}</span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            {value}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400">vs historical</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl border shrink-0 transition-transform duration-300 group-hover:scale-110 ${accentIcons[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
