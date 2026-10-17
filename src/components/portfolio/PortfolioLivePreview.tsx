import { useState, useMemo } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from 'lucide-react';
import type { PortfolioConfig } from '../../types/portfolio.ts';
import { generateStandalonePortfolioHtml } from '../../services/exportService.ts';

interface PortfolioLivePreviewProps {
  config: PortfolioConfig;
  onOpenExportModal: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function PortfolioLivePreview({ config, onOpenExportModal }: PortfolioLivePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);

  const htmlDoc = useMemo(() => {
    return generateStandalonePortfolioHtml(config);
  }, [config]);

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Device Toolbar */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              device === 'desktop'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              device === 'tablet'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
              device === 'mobile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Refresh preview render"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenExportModal}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-glow-cyan"
          >
            <span>Export &amp; Deploy</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full bg-[#030509] rounded-2xl border border-white/10 p-2 sm:p-4 overflow-hidden flex items-center justify-center min-h-[600px]">
        <div
          className={`${deviceWidths[device]} h-full min-h-[580px] transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#060810] flex flex-col`}
        >
          {/* Mock Browser URL Bar */}
          <div className="px-3 py-2 bg-slate-900 border-b border-white/5 flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 text-center bg-black/40 py-0.5 rounded px-2 text-slate-300 truncate">
              https://{config.username || 'user'}.github.io
            </div>
          </div>

          {/* Rendered HTML in sandbox iframe */}
          <iframe
            key={key}
            srcDoc={htmlDoc}
            title="GitMetrics Live Preview"
            sandbox="allow-scripts"
            className="w-full flex-1 h-[540px] border-none bg-[#05070E]"
          />
        </div>
      </div>
    </div>
  );
}
