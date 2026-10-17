import { useState, useCallback } from 'react';
import { SmoothScrollProvider } from './components/common/SmoothScrollProvider.tsx';
import { Navbar, type NavTab } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { LandingPageView } from './components/landing/LandingPageView.tsx';
import { GitHubDashboardView } from './components/github/GitHubDashboardView.tsx';
import { ProfileAuditView } from './components/audit/ProfileAuditView.tsx';
import { ProjectShowcaseView } from './components/projects/ProjectShowcaseView.tsx';
import { WorkspaceView } from './components/workspace/WorkspaceView.tsx';
import { PortfolioBuilderView } from './components/portfolio/PortfolioBuilderView.tsx';
import { ExportPublishModal } from './components/portfolio/ExportPublishModal.tsx';
import { useGitHubUser } from './hooks/useGitHubUser.ts';
import { usePortfolio } from './hooks/usePortfolio.ts';
import type { GitHubRepo } from './types/github.ts';
import type { PortfolioThemeId } from './types/portfolio.ts';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // GitHub Telemetry Hook
  const {
    username,
    setUsername,
    user,
    repos,
    events,
    languageStats,
    rateLimit,
    isLoading,
    error,
    isRateLimited,
    isDemoMode,
    refetch,
    loadDemoProfile,
  } = useGitHubUser('alex-dev');

  // Portfolio Builder Hook
  const {
    config: portfolioConfig,
    updateField,
    setTheme,
    toggleSection,
    toggleProject,
    addSkill,
    removeSkill,
    syncFromGitHub,
  } = usePortfolio(user, repos);

  // Quick navigation handlers
  const handleSearchUsername = useCallback(
    (newUsername: string) => {
      setUsername(newUsername);
    },
    [setUsername]
  );

  const handleSelectTheme = useCallback(
    (theme: PortfolioThemeId) => {
      setTheme(theme);
    },
    [setTheme]
  );

  const handleInspectRepo = useCallback(
    (_repo: GitHubRepo) => {
      setActiveTab('projects');
    },
    []
  );

  const selectedPortfolioRepoIds = portfolioConfig.projects.map((p) => p.id);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#05070E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          username={username}
          onSearchUsername={handleSearchUsername}
          rateLimit={rateLimit}
          isDemoMode={isDemoMode}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Main Application Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <LandingPageView
              onTabChange={setActiveTab}
              onSearchUsername={handleSearchUsername}
              currentUsername={username}
              onSelectTheme={handleSelectTheme}
            />
          )}

          {activeTab === 'github' && (
            <GitHubDashboardView
              user={user}
              repos={repos}
              events={events}
              languageStats={languageStats}
              rateLimit={rateLimit}
              isLoading={isLoading}
              error={error}
              isRateLimited={isRateLimited}
              isDemoMode={isDemoMode}
              onRefresh={refetch}
              onSearchUsername={handleSearchUsername}
              selectedPortfolioRepoIds={selectedPortfolioRepoIds}
              onTogglePortfolio={toggleProject}
              onSelectForUniverse={handleInspectRepo}
              onLoadDemo={loadDemoProfile}
            />
          )}

          {activeTab === 'audit' && (
            <ProfileAuditView
              user={user}
              repos={repos}
              isDemoMode={isDemoMode}
              onRefresh={refetch}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectShowcaseView
              repos={repos}
              selectedPortfolioRepoIds={selectedPortfolioRepoIds}
              onTogglePortfolio={toggleProject}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'workspace' && <WorkspaceView />}

          {activeTab === 'portfolio' && (
            <PortfolioBuilderView
              config={portfolioConfig}
              onUpdateField={updateField}
              onSetTheme={setTheme}
              onToggleSection={toggleSection}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              onSyncGitHub={syncFromGitHub}
            />
          )}
        </main>

        {/* Footer */}
        <Footer onTabChange={setActiveTab} />

        {/* Global Export Modal */}
        <ExportPublishModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          config={portfolioConfig}
        />
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
