import { useState, useRef, type ChangeEvent } from 'react';
import { HardDrive, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { storageService } from '../../services/storageService.ts';
import { downloadFile } from '../../services/exportService.ts';

interface DataBackupPanelProps {
  onRefreshData: () => void;
}

export function DataBackupPanel({ onRefreshData }: DataBackupPanelProps) {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const json = storageService.exportAllDataJson();
    downloadFile(`gitmetrics-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`, json, 'application/json');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = storageService.importDataJson(content);
        if (ok) {
          setImportStatus('Backup restored successfully!');
          onRefreshData();
        } else {
          setImportStatus('Invalid JSON backup file structure.');
        }
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset all workspace goals, tasks, and portfolio settings back to default templates?')) {
      storageService.resetWorkspaceData();
      onRefreshData();
      setImportStatus('Reset to default templates.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Local Browser Persistence (LocalStorage)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Your goals, weekly tasks, and backlog belong solely to this browser instance and are not sent to any central server. Export a JSON backup to transfer your workspace across machines.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportBackup}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
          >
            {copied ? 'Exported!' : 'Export JSON'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-400" />}
            className="text-slate-400 hover:text-rose-400"
          >
            Reset
          </Button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}
    </div>
  );
}
