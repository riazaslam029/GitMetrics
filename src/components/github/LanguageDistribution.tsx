import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { LanguageStat } from '../../types/github.ts';
import { Badge } from '../common/Badge.tsx';
import { Code2 } from 'lucide-react';

interface LanguageDistributionProps {
  stats: LanguageStat[];
}

export function LanguageDistribution({ stats }: LanguageDistributionProps) {
  if (!stats || stats.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center py-12">
        <Code2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <div className="text-sm font-semibold text-slate-300">No Language Telemetry Available</div>
        <p className="text-xs text-slate-500 mt-1">
          No primary languages were reported by the GitHub API for these repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Language Distribution</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Primary repository language frequency aggregated across public repositories
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          {stats.length} Identified
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Pie / Donut Chart */}
        <div className="lg:col-span-5 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#05070e" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as LanguageStat;
                    return (
                      <div className="bg-slate-900 border border-white/15 px-3 py-2 rounded-xl shadow-xl text-xs font-mono">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                        <div className="text-slate-400 mt-1">
                          {data.count} repos ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-mono uppercase text-slate-400">Top Stack</span>
            <span className="text-sm font-bold text-white font-mono">{stats[0]?.name || 'N/A'}</span>
          </div>
        </div>

        {/* Legend / Breakdown List */}
        <div className="lg:col-span-7 space-y-3">
          {stats.map((lang) => (
            <div key={lang.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-slate-200">{lang.name}</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-bold text-slate-100">{lang.percentage}%</span>
                  <span className="text-[10px] ml-1.5">({lang.count} repos)</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
