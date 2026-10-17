import { useState } from 'react';
import { Download, Copy, Check, Globe, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import type { PortfolioConfig } from '../../types/portfolio.ts';
import { generateStandalonePortfolioHtml, downloadFile } from '../../services/exportService.ts';

interface ExportPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
}

export function ExportPublishModal({ isOpen, onClose, config }: ExportPublishModalProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'guide' | 'code'>('download');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const htmlContent = generateStandalonePortfolioHtml(config);
  const jsonContent = JSON.stringify(config, null, 2);

  const handleDownloadHtml = () => {
    downloadFile('index.html', htmlContent, 'text/html');
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#8B5CF6', '#10B981'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  const handleDownloadJson = () => {
    downloadFile(`gitmetrics-config-${config.username}.json`, jsonContent, 'application/json');
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export &amp; Deploy Your Developer Portfolio"
      subtitle="Publish your standalone single-file portfolio to GitHub Pages, Netlify, or Vercel"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 font-bold transition-colors ${
              activeTab === 'download'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Click Download
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 font-bold transition-colors ${
              activeTab === 'guide'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GitHub Pages Guide
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 font-bold transition-colors ${
              activeTab === 'code'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Source Code Inspection
          </button>
        </div>

        {/* Tab 1: 1-Click Download */}
        {activeTab === 'download' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Zero-Dependency Standalone Bundle
              </div>
              <p className="leading-relaxed">
                Generates a single self-contained <code className="text-cyan-300 font-mono">index.html</code> file with complete typography, responsiveness, and embedded styles. Works anywhere instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-sm font-bold text-white mb-1">Production HTML Bundle</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Stand-alone single file ready to host on GitHub Pages or double-click to view offline.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadHtml}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download index.html
                </Button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-sm font-bold text-white mb-1">Portfolio Configuration (JSON)</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Save your configured projects, bio, skills, and theme preferences to re-import anytime.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDownloadJson}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download config.json
                </Button>
              </div>
            </div>

            {/* Quick Copy Snippet Row */}
            <div className="pt-2 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyHtml}
                leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedCode ? 'HTML Copied to Clipboard!' : 'Copy Raw HTML'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJson}
                leftIcon={copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedJson ? 'JSON Copied!' : 'Copy Config JSON'}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub Pages Publishing Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs">
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>How to Host Free on GitHub Pages (Step-by-Step)</span>
            </div>

            <ol className="space-y-3 pl-4 border-l-2 border-white/10 text-slate-300">
              <li className="relative pl-3">
                <span className="font-bold text-cyan-300 block mb-0.5">Step 1: Download index.html</span>
                Click the &ldquo;Download index.html&rdquo; button from the Download tab above to get your generated portfolio.
              </li>

              <li className="relative pl-3">
                <span className="font-bold text-cyan-300 block mb-0.5">Step 2: Create a Repository on GitHub</span>
                Go to GitHub and create a new public repository named{' '}
                <code className="bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                  {config.username || 'your-username'}.github.io
                </code>
                . (Or name it <code className="bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono">portfolio</code>).
              </li>

              <li className="relative pl-3">
                <span className="font-bold text-cyan-300 block mb-0.5">Step 3: Upload the file</span>
                In your new repository, click <strong>Add file &rarr; Upload files</strong>, drag the downloaded{' '}
                <code className="bg-black/40 text-cyan-400 px-1.5 py-0.5 rounded font-mono">index.html</code> into it, and commit.
              </li>

              <li className="relative pl-3">
                <span className="font-bold text-cyan-300 block mb-0.5">Step 4: Enable GitHub Pages</span>
                Navigate to <strong>Settings &rarr; Pages</strong>. Under <strong>Branch</strong>, select{' '}
                <code className="bg-black/40 text-emerald-400 px-1.5 py-0.5 rounded font-mono">main</code> and{' '}
                <code className="bg-black/40 text-emerald-400 px-1.5 py-0.5 rounded font-mono">/ (root)</code>, then click <strong>Save</strong>.
              </li>

              <li className="relative pl-3">
                <span className="font-bold text-cyan-300 block mb-0.5">Step 5: Live Worldwide!</span>
                Within ~60 seconds, your site is published globally at{' '}
                <span className="text-emerald-400 font-mono font-bold">
                  https://{config.username || 'your-username'}.github.io
                </span>
                .
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: Raw Code Inspection */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Preview generated standalone source:</span>
              <Button size="sm" variant="ghost" onClick={handleCopyHtml}>
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
            <pre className="max-h-60 overflow-y-auto p-4 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300">
              {htmlContent}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
