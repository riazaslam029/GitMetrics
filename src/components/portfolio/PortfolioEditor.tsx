import { useState } from 'react';
import {
  Sliders,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import type { PortfolioConfig, PortfolioThemeId } from '../../types/portfolio.ts';
import { PORTFOLIO_THEMES } from './themes.ts';
import { Button } from '../common/Button.tsx';

interface PortfolioEditorProps {
  config: PortfolioConfig;
  onUpdateField: <K extends keyof PortfolioConfig>(field: K, value: PortfolioConfig[K]) => void;
  onSetTheme: (theme: PortfolioThemeId) => void;
  onToggleSection: (section: keyof PortfolioConfig['visibleSections']) => void;
  onAddSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  onRemoveSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  onSyncGitHub: () => void;
}

export function PortfolioEditor({
  config,
  onUpdateField,
  onSetTheme,
  onToggleSection,
  onAddSkill,
  onRemoveSkill,
  onSyncGitHub,
}: PortfolioEditorProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'theme' | 'skills' | 'sections'>(
    'profile'
  );
  const [newSkillText, setNewSkillText] = useState('');
  const [skillCat, setSkillCat] = useState<'languages' | 'frameworks' | 'tools'>('languages');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillText.trim()) {
      onAddSkill(skillCat, newSkillText.trim());
      setNewSkillText('');
    }
  };

  const sectionsList: Array<{ key: keyof PortfolioConfig['visibleSections']; label: string }> = [
    { key: 'hero', label: 'Hero Banner & Profile Header' },
    { key: 'featuredProjects', label: 'Featured Engineering Projects Grid' },
    { key: 'skills', label: 'Technical Capabilities & Skills Matrix' },
    { key: 'contact', label: 'Contact Details & Direct Links' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
      {/* Top Header & Sync from GitHub button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Portfolio Configurator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize typography, aesthetic theme, technical skills, and visible sections.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={onSyncGitHub}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-cyan-400" />}
        >
          Auto-Fill from GitHub
        </Button>
      </div>

      {/* Editor Subtabs */}
      <div className="flex border-b border-white/5 gap-2 text-xs font-mono">
        <button
          onClick={() => setActiveSection('profile')}
          className={`pb-2 px-2.5 transition-colors font-medium ${
            activeSection === 'profile'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Profile &amp; Bio
        </button>
        <button
          onClick={() => setActiveSection('theme')}
          className={`pb-2 px-2.5 transition-colors font-medium ${
            activeSection === 'theme'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Theme Styles
        </button>
        <button
          onClick={() => setActiveSection('skills')}
          className={`pb-2 px-2.5 transition-colors font-medium ${
            activeSection === 'skills'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Skills Matrix
        </button>
        <button
          onClick={() => setActiveSection('sections')}
          className={`pb-2 px-2.5 transition-colors font-medium ${
            activeSection === 'sections'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Visibility
        </button>
      </div>

      {/* Profile & Social Details Form */}
      {activeSection === 'profile' && (
        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={config.fullName}
                onChange={(e) => onUpdateField('fullName', e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Headline</label>
              <input
                type="text"
                value={config.headline}
                onChange={(e) => onUpdateField('headline', e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bio / Statement</label>
            <textarea
              rows={3}
              value={config.bio}
              onChange={(e) => onUpdateField('bio', e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => onUpdateField('location', e.target.value)}
                placeholder="City, Country / Remote"
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={config.avatarUrl}
                onChange={(e) => onUpdateField('avatarUrl', e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-3">
            <span className="font-bold text-slate-300">Social Connections</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="GitHub Profile URL"
                value={config.socials.github}
                onChange={(e) =>
                  onUpdateField('socials', { ...config.socials, github: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Personal Website / Blog"
                value={config.socials.website || ''}
                onChange={(e) =>
                  onUpdateField('socials', { ...config.socials, website: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={config.socials.linkedin || ''}
                onChange={(e) =>
                  onUpdateField('socials', { ...config.socials, linkedin: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={config.socials.email || ''}
                onChange={(e) =>
                  onUpdateField('socials', { ...config.socials, email: e.target.value })
                }
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Theme Picker */}
      {activeSection === 'theme' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(PORTFOLIO_THEMES).map((theme) => {
            const isSelected = config.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSetTheme(theme.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-500/10'
                    : 'border-white/10 bg-slate-900/40 hover:border-white/20'
                }`}
              >
                <div
                  className={`h-8 w-full rounded-lg bg-gradient-to-r ${theme.previewGradient} mb-2 flex items-center justify-end px-2`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="font-bold text-sm text-white">{theme.name}</div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Skills Matrix */}
      {activeSection === 'skills' && (
        <div className="space-y-4">
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <select
              value={skillCat}
              onChange={(e) => setSkillCat(e.target.value as 'languages' | 'frameworks' | 'tools')}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
            >
              <option value="languages">Language</option>
              <option value="frameworks">Framework</option>
              <option value="tools">Tool / Infra</option>
            </select>
            <input
              type="text"
              placeholder="e.g. Rust, WebGPU, Docker..."
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
            <Button type="submit" size="sm" variant="primary">
              Add
            </Button>
          </form>

          {/* Existing Skills */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                Languages ({config.skills.languages.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.skills.languages.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => onRemoveSkill('languages', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                Frameworks ({config.skills.frameworks.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.skills.frameworks.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => onRemoveSkill('frameworks', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                Tools &amp; Infrastructure ({config.skills.tools.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {config.skills.tools.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200"
                  >
                    <span>{s}</span>
                    <button
                      onClick={() => onRemoveSkill('tools', s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Toggles */}
      {activeSection === 'sections' && (
        <div className="space-y-3">
          {sectionsList.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5"
            >
              <span className="text-xs text-slate-200 font-mono">{label}</span>
              <button
                onClick={() => onToggleSection(key)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  config.visibleSections[key] ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    config.visibleSections[key] ? 'transform translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
