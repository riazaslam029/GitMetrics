import { useState } from 'react';
import type { PortfolioConfig, PortfolioThemeId } from '../../types/portfolio.ts';
import { PortfolioEditor } from './PortfolioEditor.tsx';
import { PortfolioLivePreview } from './PortfolioLivePreview.tsx';
import { ExportPublishModal } from './ExportPublishModal.tsx';
import { Badge } from '../common/Badge.tsx';

interface PortfolioBuilderViewProps {
  config: PortfolioConfig;
  onUpdateField: <K extends keyof PortfolioConfig>(field: K, value: PortfolioConfig[K]) => void;
  onSetTheme: (theme: PortfolioThemeId) => void;
  onToggleSection: (section: keyof PortfolioConfig['visibleSections']) => void;
  onAddSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  onRemoveSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  onSyncGitHub: () => void;
}

export function PortfolioBuilderView({
  config,
  onUpdateField,
  onSetTheme,
  onToggleSection,
  onAddSkill,
  onRemoveSkill,
  onSyncGitHub,
}: PortfolioBuilderViewProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              Portfolio Engine
            </Badge>
            <Badge variant="emerald" size="sm">
              Zero-Build HTML Export
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portfolio Builder &amp; Live Publisher
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Configure your technical identity, themes, and curated projects. Preview changes in real-time and export a production single-file portfolio ready for GitHub Pages.
          </p>
        </div>
      </div>

      {/* Split Editor and Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Controls */}
        <div className="lg:col-span-5">
          <PortfolioEditor
            config={config}
            onUpdateField={onUpdateField}
            onSetTheme={onSetTheme}
            onToggleSection={onToggleSection}
            onAddSkill={onAddSkill}
            onRemoveSkill={onRemoveSkill}
            onSyncGitHub={onSyncGitHub}
          />
        </div>

        {/* Live Responsive Preview */}
        <div className="lg:col-span-7">
          <PortfolioLivePreview
            config={config}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        </div>
      </div>

      {/* Export & Publishing Modal */}
      <ExportPublishModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />
    </div>
  );
}
