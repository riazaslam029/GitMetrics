import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'muted' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'cyan',
  size = 'sm',
  className = '',
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    violet: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    muted: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
    outline: 'bg-transparent text-slate-300 border-white/10 hover:border-white/25',
  };

  const dotColors = {
    cyan: 'bg-cyan-400',
    violet: 'bg-purple-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    muted: 'bg-slate-400',
    outline: 'bg-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-md font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-mono tracking-wide transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
